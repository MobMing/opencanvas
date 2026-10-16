const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
function core(){const c={crypto:crypto.webcrypto,TextEncoder,Uint8Array,Map,Set};vm.createContext(c);vm.runInContext(fs.readFileSync('recovery-core.js','utf8'),c);return c;}
test('backup verification detects truncated or modified content without being an authenticity claim',async()=>{
 const c=core(),raw={format:'opencanvas-workspace',version:3,created:'2026-10-16T00:00:00.000Z',projects:[{id:'p',name:'A meaningful flyer'}],fonts:[],components:[],settings:{}};
 const sealed=await c.recoverySeal(raw);assert.equal(raw.integrity,undefined,'sealing does not change the source snapshot');await c.recoveryValidate(JSON.parse(JSON.stringify(sealed,null,2)));
 for(const bad of [{...sealed,projects:[]},{...sealed,integrity:undefined},{...sealed,integrity:{algorithm:'MD5',value:'a'.repeat(64)}}])await assert.rejects(c.recoveryValidate(bad),/verification|incomplete|changed/);
});
test('legacy backups remain supported and malformed large lists are rejected before import',async()=>{
 const c=core();for(const version of [undefined,1,2])await c.recoveryValidate({format:'opencanvas-workspace',version,projects:[]});
 for(const patch of [{projects:Array.from({length:501},(_,i)=>({id:String(i)}))},{components:Array(501).fill({})},{fonts:Array(21).fill({})},{organization:{trash:{bad:true}}},{organization:{trash:[{project:{id:'p'}}]},projects:[{id:'p'}]}])await assert.rejects(c.recoveryValidate({format:'opencanvas-workspace',projects:[],...patch}));
});
function folder(options={}){const state={text:'',writes:0,closed:0,aborted:0,names:[]};const handle={async getFileHandle(name){state.names.push(name);return{async createWritable(){return{async write(text){state.writes++;if(options.failWrite)throw Error('Disk full');state.text=text;},async close(){if(options.failClose)throw Error('Permission lost');state.closed++;},async abort(){state.aborted++;}};},async getFile(){return{text:async()=>options.corrupt?'damaged':state.text};}};}};return{handle,state};}
test('folder backup succeeds only after the complete file is closed and verified',async()=>{
 const c=core(),f=folder();await c.recoveryWriteFile(f.handle,'OpenCanvas-unique.json','{"projects":[]}');assert.equal(f.state.closed,1);assert.equal(f.state.aborted,0);assert.equal(f.state.text,'{"projects":[]}');const bad=folder({corrupt:true});await assert.rejects(c.recoveryWriteFile(bad.handle,'OpenCanvas-other.json','complete'),/verified/);
});
test('folder write and close failures abort the pending file and never report success',async()=>{
 const c=core();for(const option of [{failWrite:true},{failClose:true}]){const f=folder(option);await assert.rejects(c.recoveryWriteFile(f.handle,'new-file.json','complete'),/Disk full|Permission lost/);assert.equal(f.state.aborted,1);}
});
test('saved settings merge preserves existing entries, removes duplicates and fails explicitly at capacity',()=>{
 const c=core();assert.deepEqual(Array.from(c.recoveryMergeUnique(['one','two'],['two','three'],3)),['one','two','three']);assert.throws(()=>c.recoveryMergeUnique(['one','two'],['three'],2),/Restore projects only/);assert.throws(()=>c.recoverySettingRows({key:{}},'key',5),/Invalid/);
});
