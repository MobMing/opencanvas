const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),LiveCore=require('../live-core.js');
const read=file=>fs.readFileSync(file,'utf8');
function documentValue(id='shared',title='Before',x=40){return{id,name:'Flyer',width:500,height:600,background:'#ffffff',elements:[{id:'title',type:'text',text:title,x:10},{id:'badge',type:'rect',x}],pages:[{id:'page',name:'Scene',width:500,height:600,background:'#ffffff',elements:[{id:'title',type:'text',text:title,x:10},{id:'badge',type:'rect',x}]}],pageIndex:0};}
function boot(options={}){
 const nodes=new Map(),timers=new Map(),requests=[],messages=[];let nextTimer=0;
 const node=key=>{if(!nodes.has(key))nodes.set(key,{id:key.slice(1),open:false,hidden:false,textContent:'',style:{},classList:{toggle(){}},replaceChildren(){},append(){},before(){},close(){this.open=false;},showModal(){this.open=true;}});return nodes.get(key);};
 const c={structuredClone,clone:structuredClone,LiveCore,crypto:crypto.webcrypto,AbortController,AbortSignal,TextDecoder,TextEncoder,Date,Promise,Set,Map,design:documentValue('local'),selected:'title',undoStack:[],redoStack:[],drag:null,inline:null,plusSection:'Connect',plusCloudLink:null,plusConnection:{url:'https://workspace.invalid',token:'session-token',liveCollaboration:true},plusReviewId:null,
  document:{body:{insertAdjacentHTML(){}},addEventListener(){},createElement:()=>({style:{},append(){}})},window:{addEventListener(){}},canvas:{addEventListener(){},getBoundingClientRect:()=>({left:0,top:0,width:500,height:600})},$:node,$$:()=>[],persist(){},saveNow:async()=>true,finishInline(){},startDesign(next){if(options.failStart)return false;c.design=structuredClone(next);return true;},validateDesign(raw){if(options.failValidation)throw Error('Unsupported document');return structuredClone(raw);},fit(){},render(){},renderInspector(){},updateControls(){},homeVisible:()=>false,point:()=>({x:1,y:2}),toast:message=>messages.push(message),plusMessage:message=>messages.push(message),uid:()=>crypto.randomUUID(),homeDraftSignature:raw=>JSON.stringify(raw),openPlus(){},plusConnectPanel(){},plusCloudRefresh:async()=>{},plusCloudReview:async()=>{},
  setTimeout(fn){const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id),setInterval(fn){const id=++nextTimer;timers.set(id,fn);return id;},clearInterval:id=>timers.delete(id),fetch:async(url,request)=>{requests.push({url,...request});return options.fetch?options.fetch(url,request):{ok:true,json:async()=>({})};}
 };
 vm.createContext(c);vm.runInContext(read('pages-core.js'),c);vm.runInContext(read('live-client-core.js'),c);vm.runInContext(read('live-tools.js'),c);
 const s={id:'shared',localId:'local',clientId:'unique-client',connection:{...c.plusConnection},base:LiveCore.canonicalize(documentValue()),version:1,role:'editor',peers:[],retry:0,connected:true,status:'connected',sending:false,queued:null};c.session=s;vm.runInContext('liveSession=session;',c);return{c,s,nodes,timers,requests,messages,run:code=>vm.runInContext(code,c)};
}
test('acknowledged own edits remain undoable and concurrent teammate changes survive that Undo',()=>{
 const r=boot(),before=documentValue('local'),sent=documentValue('shared','Mine'),ack=documentValue('shared','Mine',90);r.c.design=documentValue('local','Mine');r.c.undoStack=[before];r.c.liveApplyAck(r.s,{version:2,sent,design:ack});assert.equal(r.s.version,2);assert.equal(r.c.design.elements[0].text,'Mine');assert.equal(r.c.undoStack[0].elements[0].text,'Before');assert.equal(r.c.undoStack[0].elements[1].x,90);
});
test('remote revisions defer during active input and retain the newest queued revision',()=>{
 const r=boot();r.c.drag={};r.c.liveMergeRemote(r.s,{version:3,role:'editor',design:documentValue('shared','Before',100)});r.c.liveMergeRemote(r.s,{version:2,role:'editor',design:documentValue('shared','Before',70)});assert.equal(r.s.version,1);assert.equal(r.c.design.elements[1].x,40);assert.equal(r.s.queued.version,3);
});
test('access-only role changes apply even without a new document version',()=>{
 const r=boot();r.c.liveMergeRemote(r.s,{version:1,role:'reviewer',design:documentValue()});assert.equal(r.s.role,'reviewer');assert.equal(r.s.version,1);assert.equal(r.c.design.elements[0].text,'Before');
});
test('a stale document response cannot restore a superseded permission role',()=>{
 const r=boot();r.s.version=3;r.s.role='reviewer';r.c.liveMergeRemote(r.s,{version:2,role:'editor',design:documentValue()});assert.equal(r.s.role,'reviewer');assert.equal(r.s.version,3);
});
test('reviewers consume deferred acknowledgements without making an outbound save',async()=>{
 const r=boot(),sent=documentValue('shared','Mine');r.c.design=documentValue('local','Mine');r.s.role='reviewer';r.s.pendingAck={version:2,sent,design:sent};await r.c.liveFlush(r.s);assert.equal(r.s.pendingAck,null);assert.equal(r.s.version,2);assert.equal(r.requests.length,0);
});
test('reviewer mutation shortcuts are blocked even while an allowed live toolbar button has focus',()=>{
 const r=boot();r.s.role='reviewer';let prevented=false,stopped=false;const event={type:'keydown',key:'z',ctrlKey:true,target:{closest:selector=>selector.includes('#liveBar')?{}:null},preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;}};r.c.liveReviewerEvent(event);assert.equal(prevented,true);assert.equal(stopped,true);
});
test('a rejected remote design cannot advance the base/version or replace local edits',()=>{
 const r=boot({failValidation:true});r.c.design.elements[0].text='Mine';r.c.liveMergeRemote(r.s,{version:2,role:'editor',design:documentValue('shared','Before',90)});assert.equal(r.s.version,1);assert.equal(r.s.base.pages[0].elements[1].x,40);assert.equal(r.c.design.elements[0].text,'Mine');assert.equal(r.s.conflicted,true);
});
test('two edits to the same field pause without replacing the local copy',()=>{
 const r=boot();r.c.design.elements[0].text='My text';r.c.liveMergeRemote(r.s,{version:2,role:'editor',design:documentValue('shared','Their text')});assert.equal(r.s.conflicted,true);assert.equal(r.c.design.elements[0].text,'My text');assert.equal(r.s.version,1);
});
test('in-flight sync rebases edits typed before its acknowledgement and preserves newer remote fields',async()=>{
 let complete;const pending=new Promise(resolve=>{complete=resolve;}),r=boot({fetch:()=>pending});r.c.design.elements[0].text='First';const task=r.c.liveFlush(r.s);assert.equal(r.s.sending,true);r.c.design.elements[0].text='Second';complete({ok:true,json:async()=>({version:2,design:documentValue('shared','First',120)})});await task;assert.equal(r.c.design.elements[0].text,'Second');assert.equal(r.c.design.elements[1].x,120);assert.equal(r.s.version,2);assert.equal(r.s.sending,false);assert.equal(r.requests.length,1);
});
test('failed shared-project opening cannot create a live session attached to the wrong local project',async()=>{
 const r=boot({failStart:true,fetch:async()=>({ok:true,json:async()=>({version:1,role:'editor',design:documentValue()})})});r.run('liveSession=null;');await r.c.liveJoin('shared');assert.equal(r.run('liveSession'),null);assert.equal(r.c.design.id,'local');assert.ok(r.messages.some(message=>/could not open/i.test(message)));
});
