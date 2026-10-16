import {DatabaseSync} from 'node:sqlite';
import {resolve} from 'node:path';
import {readFile} from 'node:fs/promises';
import {snapshotDatabase,inspectDatabase,restoreDatabase,offsiteConfig,createBackupManager} from './backups.mjs';

const [command,source,destination]=process.argv.slice(2),database=process.env.OPENCANVAS_DB||'cloud-data/opencanvas.db',directory=process.env.BACKUP_DIR||'cloud-data/backups';
try{
 if(command==='snapshot'){
  const db=new DatabaseSync(resolve(database),{readOnly:true});try{console.log(JSON.stringify(await snapshotDatabase(db,{directory,keep:Number(process.env.BACKUP_KEEP||3)}),null,2))}finally{db.close()}
 }else if(command==='backup'){
  const db=new DatabaseSync(resolve(database),{readOnly:true}),manager=createBackupManager(db,{directory,keep:Number(process.env.BACKUP_KEEP||3),offsite:offsiteConfig()});
  try{await manager.run(true);console.log(JSON.stringify(manager.status(),null,2))}finally{await manager.stop();db.close()}
 }else if(command==='status'){
  console.log(await readFile(resolve(directory,'backup-status.json'),'utf8'));
 }else if(command==='verify'&&source){
  console.log(JSON.stringify(inspectDatabase(source),null,2));
 }else if(command==='restore'&&source&&destination){
  const counts=await restoreDatabase(source,destination,{key:process.env.BACKUP_ENCRYPTION_KEY});console.log(JSON.stringify({restored:resolve(destination),counts,sessions:'revoked',scheduledPosts:'pending and sending jobs cancelled'},null,2));
 }else{
  console.error('Usage: node cloud/backup-cli.mjs snapshot | backup | status | verify <database> | restore <backup.db or .ocbackup> <NEW database path>');process.exitCode=1;
 }
}catch(e){console.error('Backup operation failed:',e.message);process.exitCode=1}
