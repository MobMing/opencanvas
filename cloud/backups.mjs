import {DatabaseSync, backup} from 'node:sqlite';
import {createReadStream, createWriteStream} from 'node:fs';
import {mkdir, chmod, readdir, rename, unlink, readFile, writeFile, stat, statfs, open, copyFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {resolve, join, basename, dirname} from 'node:path';
import {randomBytes, createCipheriv, createDecipheriv, createHash, createHmac} from 'node:crypto';
import {pipeline} from 'node:stream/promises';
import {createGzip, createGunzip} from 'node:zlib';

const TABLES=['users','sessions','projects','members','comments','reviews','jobs'];
const SNAPSHOT=/^opencanvas-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-[a-f0-9]{8}\.db$/;
const MAGIC=Buffer.from('OCBACKUP1\n');
const DAY=86400000;
const remove=path=>unlink(path).catch(e=>{if(e.code!=='ENOENT')throw e});
const hash=data=>createHash('sha256').update(data).digest('hex');
const hmac=(key,data)=>createHmac('sha256',key).update(data).digest();
const encode=s=>encodeURIComponent(s).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());

export function inspectDatabase(path){
 const db=new DatabaseSync(resolve(path),{readOnly:true});
 try{
  if(db.prepare('PRAGMA integrity_check').all().some(r=>Object.values(r)[0]!=='ok'))throw Error('Backup failed its SQLite integrity check.');
  const names=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r=>r.name));
  if(TABLES.some(name=>!names.has(name)))throw Error('This is not an OpenCanvas workspace database.');
  return Object.fromEntries(['users','projects','comments','jobs'].map(name=>[name,db.prepare('SELECT count(*) AS n FROM '+name).get().n]));
 }finally{db.close()}
}

export async function snapshotDatabase(db,{directory,keep=3,now=Date.now()}={}){
 if(!directory)throw Error('Set a private backup directory.');
 if(!Number.isInteger(keep)||keep<1||keep>30)throw Error('Keep between 1 and 30 local backups.');
 const dir=resolve(directory);await mkdir(dir,{recursive:true,mode:0o700});
 const pageSize=db.prepare('PRAGMA page_size').get().page_size,pageCount=db.prepare('PRAGMA page_count').get().page_count;
 const space=await statfs(dir);if(Number(space.bavail)*Number(space.bsize)<pageSize*pageCount*2+50*1048576)throw Error('Not enough free disk space for a safe backup.');
 const name='opencanvas-'+new Date(now).toISOString().replace(/[:.]/g,'-')+'-'+randomBytes(4).toString('hex')+'.db',path=join(dir,name),temporary=path+'.partial';
 try{
  await writeFile(temporary,'',{flag:'wx',mode:0o600});
  await backup(db,temporary,{rate:100});
  // Finalize a standalone file rather than leaving WAL-mode sidecars beside it.
  const completed=new DatabaseSync(temporary);try{completed.exec('PRAGMA wal_checkpoint(TRUNCATE); PRAGMA journal_mode=DELETE;')}finally{completed.close()}
  const counts=inspectDatabase(temporary);await rename(temporary,path);await chmod(path,0o600);
  const entries=(await readdir(dir,{withFileTypes:true})).filter(e=>e.isFile()&&SNAPSHOT.test(e.name)).map(e=>e.name).sort().reverse();
  for(const old of entries.slice(keep))await remove(join(dir,old));
  return {name,path,created:new Date(now).toISOString(),bytes:(await stat(path)).size,counts};
 }catch(e){await remove(temporary);await remove(temporary+'-wal');await remove(temporary+'-shm');throw e}
}

function encryptionKey(value){if(typeof value!=='string'||!/^[a-f0-9]{64}$/i.test(value))throw Error('BACKUP_ENCRYPTION_KEY must be 64 hexadecimal characters.');return Buffer.from(value,'hex')}

export async function encryptBackup(source,destination,key){
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryptionKey(key),iv),header=Buffer.concat([MAGIC,iv]);cipher.setAAD(header);
 await writeFile(destination,header,{flag:'wx',mode:0o600});
 try{await pipeline(createReadStream(source),createGzip(),cipher,createWriteStream(destination,{flags:'a'}));await writeFile(destination,cipher.getAuthTag(),{flag:'a'});return destination}catch(e){await remove(destination);throw e}
}

export async function decryptBackup(source,destination,key){
 const handle=await open(source,'r'),size=(await handle.stat()).size,header=Buffer.alloc(MAGIC.length+12),tag=Buffer.alloc(16);
 try{if(size<header.length+17)throw Error('Invalid encrypted backup.');await handle.read(header,0,header.length,0);await handle.read(tag,0,16,size-16)}finally{await handle.close()}
 if(!header.subarray(0,MAGIC.length).equals(MAGIC))throw Error('Unrecognized encrypted backup format.');
 const decipher=createDecipheriv('aes-256-gcm',encryptionKey(key),header.subarray(MAGIC.length));decipher.setAAD(header);decipher.setAuthTag(tag);
 await writeFile(destination,'',{flag:'wx',mode:0o600});
 try{await pipeline(createReadStream(source,{start:header.length,end:size-17}),decipher,createGunzip(),createWriteStream(destination,{flags:'a'}));return destination}catch{await remove(destination);throw Error('Backup could not be decrypted. Check the recovery key and file integrity.')}
}

export function offsiteConfig(env=process.env){
 const fields=['BACKUP_R2_ACCOUNT_ID','BACKUP_R2_BUCKET','BACKUP_R2_ACCESS_KEY_ID','BACKUP_R2_SECRET_ACCESS_KEY','BACKUP_ENCRYPTION_KEY'];
 if(!fields.some(k=>env[k]))return null;
 if(fields.some(k=>!env[k]))throw Error('Set all five private R2 backup settings, or leave all unset.');
 if(!/^[a-f0-9]{32}$/i.test(env.BACKUP_R2_ACCOUNT_ID)||!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(env.BACKUP_R2_BUCKET))throw Error('Invalid R2 account ID or bucket name.');
 encryptionKey(env.BACKUP_ENCRYPTION_KEY);
 return {account:env.BACKUP_R2_ACCOUNT_ID,bucket:env.BACKUP_R2_BUCKET,accessKey:env.BACKUP_R2_ACCESS_KEY_ID,secretKey:env.BACKUP_R2_SECRET_ACCESS_KEY,encryptionKey:env.BACKUP_ENCRYPTION_KEY};
}

export function signR2Upload({config,key,payloadHash,now=new Date()}){
 const host=config.account+'.r2.cloudflarestorage.com',path='/'+encode(config.bucket)+'/'+key.split('/').map(encode).join('/'),date=now.toISOString().replace(/[:-]|\.\d{3}/g,''),day=date.slice(0,8),scope=day+'/auto/s3/aws4_request';
 const signed='host;x-amz-content-sha256;x-amz-date',canonical='PUT\n'+path+'\n\nhost:'+host+'\nx-amz-content-sha256:'+payloadHash+'\nx-amz-date:'+date+'\n\n'+signed+'\n'+payloadHash;
 const signing=hmac(hmac(hmac(hmac('AWS4'+config.secretKey,day),'auto'),'s3'),'aws4_request'),signature=createHmac('sha256',signing).update('AWS4-HMAC-SHA256\n'+date+'\n'+scope+'\n'+hash(canonical)).digest('hex');
 return {url:'https://'+host+path,headers:{'x-amz-date':date,'x-amz-content-sha256':payloadHash,Authorization:'AWS4-HMAC-SHA256 Credential='+config.accessKey+'/'+scope+', SignedHeaders='+signed+', Signature='+signature}};
}

export async function uploadR2(source,config,{fetchImpl=fetch,now=new Date()}={}){
 const digest=createHash('sha256');for await(const chunk of createReadStream(source))digest.update(chunk);
 const key='opencanvas/'+basename(source),payloadHash=digest.digest('hex'),signed=signR2Upload({config,key,payloadHash,now});
 const response=await fetchImpl(signed.url,{method:'PUT',headers:{...signed.headers,'Content-Type':'application/octet-stream','Content-Length':String((await stat(source)).size)},body:createReadStream(source),duplex:'half',redirect:'error',signal:AbortSignal.timeout(120000)});
 if(!response.ok){await response.body?.cancel();throw Error('Offsite backup upload failed (HTTP '+response.status+').');}
 await response.body?.cancel();return {key,sha256:payloadHash,created:now.toISOString()};
}

export async function restoreDatabase(source,destination,{key}={}){
 const target=resolve(destination),temporary=target+'.restore-'+randomBytes(6).toString('hex');await mkdir(dirname(target),{recursive:true,mode:0o700});
 try{
  if(source.endsWith('.ocbackup'))await decryptBackup(source,temporary,key);else await copyFile(resolve(source),temporary,constants.COPYFILE_EXCL);
  const counts=inspectDatabase(temporary),db=new DatabaseSync(temporary);
  try{db.exec("DELETE FROM sessions; UPDATE jobs SET status='cancelled',error='Cancelled during backup recovery; review before rescheduling.' WHERE status IN ('pending','sending'); PRAGMA wal_checkpoint(TRUNCATE); PRAGMA journal_mode=DELETE;")}finally{db.close()}
  // COPYFILE_EXCL deliberately prevents restoring over a live or existing database.
  await copyFile(temporary,target,constants.COPYFILE_EXCL);await chmod(target,0o600);return counts;
 }finally{await remove(temporary);await remove(temporary+'-wal');await remove(temporary+'-shm')}
}

export function createBackupManager(db,{directory,keep=3,offsite=null,upload=uploadR2,clock=()=>Date.now(),interval=3600000,logger=console}={}){
 if(!directory)throw Error('Set a private backup directory.');
 if(!Number.isInteger(keep)||keep<1||keep>30)throw Error('Keep between 1 and 30 local backups.');
 const dir=resolve(directory),stateFile=join(dir,'backup-status.json');let active=null,closed=false,timer=null,initial=null,state={local:null,offsite:null,error:null};
 const ready=mkdir(dir,{recursive:true,mode:0o700}).then(async()=>{try{const saved=JSON.parse(await readFile(stateFile,'utf8'));if(saved.local&&SNAPSHOT.test(saved.local.name)&&Number.isFinite(Date.parse(saved.local.created)))state.local=saved.local;if(saved.offsite&&SNAPSHOT.test(saved.offsite.snapshot)&&Number.isFinite(Date.parse(saved.offsite.created)))state.offsite=saved.offsite;if(saved.error)state.error='Backup did not finish. Check the private server log and retry.'}catch(e){if(e.code!=='ENOENT')logger.error('Backup history could not be loaded; a new backup will be made.')}});
 // Keep an initialization failure observable to status/run without an unhandled rejection.
 ready.catch(e=>{state.error='The server backup folder could not be opened.';logger.error('OpenCanvas backup setup:',e.message)});
 const save=async()=>{const temporary=stateFile+'.partial';await writeFile(temporary,JSON.stringify(state,null,2),{mode:0o600});await rename(temporary,stateFile)};
 const status=()=>({enabled:true,offsiteConfigured:!!offsite,running:!!active,lastLocal:state.local?.created||null,lastOffsite:offsite?state.offsite?.created||null:null,error:state.error});
 async function perform(force){
  try{
   await ready;
   if(force||!state.local||clock()-Date.parse(state.local.created)>=DAY){const result=await snapshotDatabase(db,{directory:dir,keep,now:clock()});state.local={name:result.name,created:result.created,bytes:result.bytes,counts:result.counts};await save()}
   if(offsite&&state.offsite?.snapshot!==state.local.name){const encrypted=join(dir,state.local.name+'.ocbackup');try{await remove(encrypted);await encryptBackup(join(dir,state.local.name),encrypted,offsite.encryptionKey);state.offsite={...await upload(encrypted,offsite),snapshot:state.local.name}}finally{await remove(encrypted)}}
   state.error=null;await save();return status();
  }catch(e){state.error='Backup did not finish. Check the private server log and retry.';logger.error('OpenCanvas backup:',e.message);await save().catch(()=>{});throw e}
 }
 function run(force=false){if(closed)return Promise.reject(Error('Backup manager is stopped.'));if(active)return active;active=perform(force).finally(()=>{active=null});return active}
 initial=setTimeout(()=>run().catch(()=>{}),30000);initial.unref();timer=setInterval(()=>run().catch(()=>{}),interval);timer.unref();
 return {run,status,ready,async stop(){closed=true;clearTimeout(initial);clearInterval(timer);if(active)await active.catch(()=>{})}};
}
