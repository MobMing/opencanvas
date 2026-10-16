const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const lab=require('../photo-lab-core.js'),root=path.join(__dirname,'..');
const image=(w,h,color)=>Uint8ClampedArray.from(Array.from({length:w*h},()=>color).flat());
test('Clone brush covers unwanted pixels from a separate sample and preserves source/untouched edges',()=>{
 const source=image(12,5,[20,80,140,255]),target=new Uint8ClampedArray(source);
 for(let y=1;y<4;y++)for(let x=8;x<11;x++)target.set([220,30,20,255],(y*12+x)*4);
 const before=new Uint8ClampedArray(source);
 lab.cloneStamp(target,source,12,5,9.5,2.5,-6,0,3,1);
 assert.deepEqual([...target.slice((2*12+9)*4,(2*12+9)*4+4)],[20,80,140,255]);
 assert.deepEqual(source,before);assert.deepEqual([...target.slice(0,4)],[20,80,140,255]);
});
test('Clone brush skips out-of-bounds samples and blends transparent samples without dark halos',()=>{
 const source=image(5,3,[200,0,0,128]),target=image(5,3,[0,0,200,255]),before=new Uint8ClampedArray(target);
 lab.cloneStamp(target,source,5,3,2.5,1.5,100,100,2);assert.deepEqual(target,before);
 lab.cloneStamp(target,source,5,3,2.5,1.5,0,0,2);
 const at=(1*5+2)*4;assert(Math.abs(target[at]-100)<=1);assert(Math.abs(target[at+2]-100)<=1);assert.equal(target[at+3],255);
});
test('Continuous clone strokes fill the entire drag and reject invalid geometry',()=>{
 const source=image(40,8,[250,200,100,255]),target=image(40,8,[0,0,0,255]);
 lab.cloneLine(target,source,40,8,{x:4,y:4},{x:30,y:4},{x:0,y:0},3);
 for(let x=5;x<30;x++)assert(target[(4*40+x)*4]>200,'Stroke gap at '+x);
 assert.throws(()=>lab.cloneLine(target,source,40,8,{x:NaN,y:4},{x:30,y:4},{x:0,y:0},3),/valid brush/);
 assert.throws(()=>lab.cloneStamp(new Uint8Array(1),source,40,8,1,1,0,0,3),/dimensions/);
});
test('Background compositing keeps subject colors, alpha, and all original inputs intact',()=>{
 const foreground=new Uint8ClampedArray([240,120,60,255,240,120,60,128,240,120,60,0]);
 const background=new Uint8ClampedArray([10,20,30,255,10,20,30,255,10,20,30,128]);
 const result=lab.composite(foreground,background);
 assert.deepEqual([...result.slice(0,4)],[240,120,60,255]);assert.deepEqual([...result.slice(8)],[10,20,30,128]);
 assert(Math.abs(result[4]-125)<=1);assert.equal(result[7],255);assert.equal(foreground[7],128);assert.equal(background[3],255);
 assert.throws(()=>lab.composite(foreground,new Uint8ClampedArray(4)),/dimensions/);
 assert.equal(lab.transparency(foreground),2/3);assert.throws(()=>lab.transparency([]),/pixels/);
});
test('Uploaded background cover calculation crops symmetrically without stretching',()=>{
 assert.deepEqual(lab.coverRect(200,100,100,100),{x:-50,y:0,w:200,h:100});
 assert.deepEqual(lab.coverRect(100,200,100,100),{x:0,y:-50,w:100,h:200});
 assert.throws(()=>lab.coverRect(0,100,100,100),/size/);
});
test('MagicTouch parts reconstruct the pinned official model exactly',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/photo-lab/manifest.json'),'utf8'));
 assert.equal(manifest.runtimeVersion,'1.1.1');assert.equal(manifest.license,'Apache-2.0');
 assert.equal(manifest.modelSource,'https://storage.googleapis.com/mediapipe-models/interactive_segmenter_v2/magic_touch/int8/1/interactive_segmentation.task');
 const pieces=manifest.model.parts.map(p=>{assert(p.bytes<=4500000);const b=fs.readFileSync(path.join(root,'assets/photo-lab',p.file));assert.equal(b.length,p.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),p.sha256);return b;});
 const model=Buffer.concat(pieces);assert.equal(model.length,30525312);assert.equal(crypto.createHash('sha256').update(model).digest('hex'),manifest.model.sha256);
});
function runner(){
 const workers=[];let timeout;
 class Worker{constructor(url){this.url=url;workers.push(this)}postMessage(message){this.sent=message}terminate(){this.terminated=true}}
 const c={Worker,OffscreenCanvas:function(){},WebAssembly:{},URL,document:{baseURI:'https://example.test/opencanvas/'},Uint8ClampedArray,setTimeout:fn=>{timeout=fn;return 1},clearTimeout(){}};
 vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'photo-lab-tools.js'),'utf8'),c);return{c,workers,timeout:()=>timeout()};
}
test('Subject selection runs only on demand and cancellation prevents late mutation',async()=>{
 const r=runner();assert.equal(r.workers.length,0);const photo={data:new Uint8ClampedArray([1,2,3,255]),width:1,height:1};
 const job=r.c.photoLabStartSubjectCutout(photo,{x:.25,y:.6});const worker=r.workers[0];
 assert.equal(worker.url.href,'https://example.test/opencanvas/photo-lab/worker.js?v=1');assert.notEqual(worker.sent.pixels,photo.data);assert.equal(worker.sent.point.x,.25);
 job.cancel();worker.onmessage({data:{type:'result',confidence:[1]}});await assert.rejects(job.result,{name:'AbortError'});assert.equal(worker.terminated,true);assert.equal(photo.data[3],255);
});
test('Subject model download failures, worker errors and timeouts clean up the worker',async()=>{
 for(const reason of ['download','worker','timeout']){const r=runner(),job=r.c.photoLabStartSubjectCutout({data:new Uint8ClampedArray([1,2,3,255]),width:1,height:1},{x:.5,y:.5});if(reason==='download')r.workers[0].onmessage({data:{type:'error',message:'Download failed'}});else if(reason==='worker')r.workers[0].onerror();else r.timeout();await assert.rejects(job.result,/failed|could not start|too long/);assert.equal(r.workers[0].terminated,true);}
});
test('Worker rejects invalid click coordinates before downloading anything',async()=>{
 const messages=[];let closed=false;const context={self:{postMessage:m=>messages.push(m),close:()=>closed=true}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'photo-lab-worker.js'),'utf8'),context);
 await context.self.onmessage({data:{width:1,height:1,pixels:new Uint8ClampedArray(4),point:{x:2,y:.5}}});assert.equal(messages[0].type,'error');assert.match(messages[0].message,/inside the photo/);assert.equal(closed,true);
});
