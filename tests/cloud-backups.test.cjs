const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
async function fixture(t){
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'opencanvas-backup-'));
 const {createCloudServer}=await import('../cloud/server.mjs'),api=await import('../cloud/backups.mjs'),{DatabaseSync}=await import('node:sqlite');
 const instance=createCloudServer({database:path.join(root,'live.db'),password:'test-password-12345',backupDirectory:''});t.after(async()=>{instance.server.emit('close');assert.ok(root.startsWith(path.join(os.tmpdir(),'opencanvas-backup-')));await fs.rm(root,{recursive:true,force:true})});
 instance.db.prepare('INSERT INTO projects VALUES(?,?,?,?,?,?)').run('project','owner','A saved design','{"name":"A saved design","elements":[]}',3,Date.now());
 instance.db.prepare('INSERT INTO sessions VALUES(?,?,?)').run('secret-session','owner',Date.now()+86400000);
 instance.db.prepare('INSERT INTO jobs VALUES(?,?,?,?,?,?,?)').run('scheduled','owner','{"text":"Do not replay"}',1,'pending','','');
 return {root,...instance,api,DatabaseSync};
}
test('SQLite snapshots include live WAL writes, verify integrity, and rotate only owned backups',async t=>{
 const f=await fixture(t),directory=path.join(f.root,'backups');await fs.mkdir(directory);await fs.writeFile(path.join(directory,'unrelated.db'),'leave me');
 const results=[];for(let n=0;n<4;n++){f.db.prepare('UPDATE projects SET version=?').run(n+4);results.push(await f.api.snapshotDatabase(f.db,{directory,keep:2,now:Date.UTC(2026,9,16,n)}))}
 const names=await fs.readdir(directory);assert.equal(names.filter(n=>/^opencanvas-.*\.db$/.test(n)).length,2);assert.equal(names.some(n=>n.includes('.partial')),false);assert.equal(await fs.readFile(path.join(directory,'unrelated.db'),'utf8'),'leave me');assert.deepEqual(f.api.inspectDatabase(results.at(-1).path),{users:1,projects:1,comments:0,jobs:1});
 const check=new f.DatabaseSync(results.at(-1).path,{readOnly:true});assert.equal(check.prepare('SELECT version FROM projects').get().version,7);check.close();
 f.db.prepare('UPDATE projects SET version=8').run();assert.equal(f.db.prepare('SELECT version FROM projects').get().version,8);
});
test('restore writes only a new verified database, revokes sessions, and cancels stale publishing jobs',async t=>{
 const f=await fixture(t),saved=await f.api.snapshotDatabase(f.db,{directory:path.join(f.root,'backups')}),target=path.join(f.root,'restored.db');
 await f.api.restoreDatabase(saved.path,target);const restored=new f.DatabaseSync(target);assert.equal(restored.prepare('SELECT name FROM projects').get().name,'A saved design');assert.equal(restored.prepare('SELECT count(*) n FROM sessions').get().n,0);assert.equal(restored.prepare('SELECT status FROM jobs').get().status,'cancelled');restored.close();
 const before=await fs.readFile(target);await assert.rejects(f.api.restoreDatabase(saved.path,target),{code:'EEXIST'});assert.deepEqual(await fs.readFile(target),before);
 const invalid=path.join(f.root,'bad.db');await fs.writeFile(invalid,'not a database');const other=path.join(f.root,'should-not-exist.db');await assert.rejects(f.api.restoreDatabase(invalid,other));await assert.rejects(fs.stat(other),{code:'ENOENT'});
});
test('encrypted offsite backups round trip and reject wrong keys or modified content without plaintext leftovers',async t=>{
 const f=await fixture(t),saved=await f.api.snapshotDatabase(f.db,{directory:path.join(f.root,'backups')}),encrypted=saved.path+'.ocbackup',key=crypto.randomBytes(32).toString('hex');
 await f.api.encryptBackup(saved.path,encrypted,key);assert.equal((await fs.readFile(encrypted)).includes(Buffer.from('A saved design')),false);
 const restored=path.join(f.root,'encrypted-restore.db');await f.api.restoreDatabase(encrypted,restored,{key});assert.equal(f.api.inspectDatabase(restored).projects,1);
 const wrong=path.join(f.root,'wrong.db');await assert.rejects(f.api.decryptBackup(encrypted,wrong,'00'.repeat(32)),/could not be decrypted/);await assert.rejects(fs.stat(wrong),{code:'ENOENT'});
 const data=await fs.readFile(encrypted);data[data.length-20]^=1;await fs.writeFile(encrypted,data);const damaged=path.join(f.root,'damaged.db');await assert.rejects(f.api.decryptBackup(encrypted,damaged,key));await assert.rejects(fs.stat(damaged),{code:'ENOENT'});
});
test('backup manager retries failed offsite copies without discarding the local snapshot or claiming offsite success',async t=>{
 const f=await fixture(t),directory=path.join(f.root,'backups');let now=Date.UTC(2026,9,16),calls=0;const manager=f.api.createBackupManager(f.db,{directory,clock:()=>now,offsite:{encryptionKey:'12'.repeat(32)},logger:{error(){}},upload:async(file)=>{calls++;assert.ok((await fs.stat(file)).size>0);if(calls===1)throw Error('network down');return{created:new Date(now).toISOString(),key:'private-object'}}});t.after(()=>manager.stop());
 await assert.rejects(manager.run(),/network down/);assert.ok(manager.status().lastLocal);assert.equal(manager.status().lastOffsite,null);assert.ok(manager.status().error);
 const local=(await fs.readdir(directory)).filter(n=>n.endsWith('.db'));await manager.run();assert.equal(manager.status().error,null);assert.ok(manager.status().lastOffsite);assert.deepEqual((await fs.readdir(directory)).filter(n=>n.endsWith('.db')),local);
 await manager.run();assert.equal(calls,2);now+=86400001;await manager.run();assert.equal(calls,3);assert.equal((await fs.readdir(directory)).some(n=>n.endsWith('.ocbackup')),false);
 await manager.stop();await assert.rejects(manager.run(),/stopped/);
});
test('R2 setup rejects partial credentials and uploads only an authenticated encrypted object stream',async t=>{
 const f=await fixture(t);assert.equal(f.api.offsiteConfig({}),null);assert.throws(()=>f.api.offsiteConfig({BACKUP_R2_BUCKET:'private-backup'}),/all five/);
 const config=f.api.offsiteConfig({BACKUP_R2_ACCOUNT_ID:'a'.repeat(32),BACKUP_R2_BUCKET:'private-backups',BACKUP_R2_ACCESS_KEY_ID:'test-access',BACKUP_R2_SECRET_ACCESS_KEY:'test-secret',BACKUP_ENCRYPTION_KEY:'12'.repeat(32)});
 const saved=await f.api.snapshotDatabase(f.db,{directory:path.join(f.root,'backups')}),encrypted=saved.path+'.ocbackup';await f.api.encryptBackup(saved.path,encrypted,config.encryptionKey);
 const bytes=await fs.readFile(encrypted),result=await f.api.uploadR2(encrypted,config,{now:new Date('2026-10-16T12:34:56Z'),fetchImpl:async(url,options)=>{
  assert.ok(url.startsWith('https://'+'a'.repeat(32)+'.r2.cloudflarestorage.com/private-backups/opencanvas/'));
  assert.equal(options.method,'PUT');assert.equal(options.redirect,'error');assert.equal(options.headers['x-amz-date'],'20261016T123456Z');assert.match(options.headers.Authorization,/^AWS4-HMAC-SHA256 Credential=test-access\/20261016\/auto\/s3\/aws4_request/);
  const chunks=[];for await(const chunk of options.body)chunks.push(chunk);assert.deepEqual(Buffer.concat(chunks),bytes);assert.equal(options.headers['x-amz-content-sha256'],crypto.createHash('sha256').update(bytes).digest('hex'));return new Response('',{status:200});
 }});assert.equal(result.created,'2026-10-16T12:34:56.000Z');
});
test('server backup controls require the owner and expose status without backup paths or secrets',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'opencanvas-backup-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));const {createCloudServer}=await import('../cloud/server.mjs');const instance=createCloudServer({database:':memory:',password:'test-password-12345',invite:'test-invite',origin:'http://localhost:4173',backupDirectory:path.join(root,'backups'),backupOffsite:null});
 await new Promise(r=>instance.server.listen(0,'127.0.0.1',r));t.after(async()=>{await instance.backups.stop();await new Promise(r=>instance.server.close(r))});const url='http://127.0.0.1:'+instance.server.address().port;
 const request=async(route,method='GET',body,token)=>{const r=await fetch(url+route,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json()}};
 assert.equal((await request('/backups/status')).status,401);const ownerLogin=(await request('/login','POST',{name:'owner',password:'test-password-12345'})).data,memberLogin=(await request('/register','POST',{name:'member',password:'member-password-123',invite:'test-invite'})).data,owner=ownerLogin.token,member=memberLogin.token;assert.equal(ownerLogin.canManageBackups,true);assert.equal(memberLogin.canManageBackups,false);
 assert.equal((await request('/backups/status','GET',null,member)).status,403);assert.equal((await request('/backups','POST',{},member)).status,403);
 const created=await request('/backups','POST',{},owner);assert.equal(created.status,200);assert.ok(created.data.lastLocal);assert.equal(created.data.lastOffsite,null);assert.equal(JSON.stringify(created.data).includes(root),false);assert.equal(created.data.running,false);
});
