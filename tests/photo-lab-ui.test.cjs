const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
// A small canvas/DOM fixture exercises the real UI handlers without a browser dependency.
function fixture({bindReplacement=false}={}){
 const nodes=new Map();
 class ImageData{constructor(data,width,height){this.data=data;this.width=width;this.height=height}}
 class Element{
  constructor(tag='div'){this.tag=tag;this.style={};this.disabled=false;this.value='';this.textContent='';}
  set innerHTML(html){for(const token of html.matchAll(/<([a-z]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){const element=new Element(token[1]);if(token[1]==='canvas')Object.assign(element,canvas());element.id=token[3];element.value=/\bvalue="([^"]*)"/.exec(token[2])?.[1]||'';element.disabled=/\bdisabled\b/.test(token[2]);nodes.set(element.id,element);}}
  append(){}insertBefore(){}insertAdjacentHTML(){}closest(){return card}scrollIntoView(){}setPointerCapture(){}removeAttribute(){}
  querySelectorAll(query){return [...nodes.values()].filter(e=>query==='[id^="photoLab"]'?e.id?.startsWith('photoLab'):['button','input','select'].includes(e.tag));}
  getBoundingClientRect(){return{left:0,top:0,width:2,height:1}}
 }
 function canvas(initial=[200,100,50,255,20,80,160,0]){
  let bytes=new Uint8ClampedArray(initial);const c={width:2,height:1};
  const context={filter:'none',getImageData:()=>new ImageData(new Uint8ClampedArray(bytes),c.width,c.height),putImageData:data=>bytes=new Uint8ClampedArray(data.data),clearRect:()=>bytes.fill(0),drawImage:other=>bytes=other.getContext('2d').getImageData().data,fillRect(){const hex=this.fillStyle.slice(1);const color=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));bytes=new Uint8ClampedArray(c.width*c.height*4);for(let i=0;i<bytes.length;i+=4)bytes.set([...color,255],i);}};
  c.getContext=()=>context;return c;
 }
 const card=new Element(),body=new Element();nodes.set('plusBody',body);
 for(const id of ['plusMask','plusBrush','plusBrushSize','plusPhotoLayer','plusPhotoApply','plusPhotoReplace','plusMaskUndo','plusMaskRemove','plusMaskFeather','plusAutoCutout','plusAutoCutoutCancel','plusAutoCutoutEdge','plusAutoCutoutSoftness','plusAutoCutoutStatus','plusCropZoom','plusCropX','plusCropY','plusDialog']){const e=new Element(id==='plusMask'?'canvas':id==='plusBrush'?'select':'button');e.id=id;nodes.set(id,e);}
 nodes.get('plusDialog').open=true;nodes.get('plusBrush').value='erase';nodes.get('plusBrushSize').value='3';
 nodes.get('plusCropZoom').value='1';nodes.get('plusCropX').value=nodes.get('plusCropY').value='.5';
 const raw=canvas(),original=canvas([200,100,50,255,20,80,160,255]),target={id:'photo'};const state={raw,original,target,projectId:'test',history:[],editRevision:0,dirty:false};
 const remember=()=>{state.editRevision++;state.history.push(raw.getContext('2d').getImageData());state.autoMask=null;state.dirty=true;};
 nodes.get('plusMaskUndo').onclick=()=>{const last=state.history.pop();if(last)raw.getContext('2d').putImageData(last)};
 let previews=0;const messages=[],context={document:{createElement:tag=>tag==='canvas'?canvas():new Element(tag)},$:(selector)=>nodes.get(selector.slice(1)),plusPhotoState:state,plusSection:'Photo',design:{id:'test',elements:[target]},plusMessage:message=>messages.push(message),OpenCanvasPhotoLab:require('../photo-lab-core.js'),OpenCanvasCutoutCore:require('../cutout-core.js'),ImageData,Uint8ClampedArray,Error,Math,Number};
 vm.createContext(context);
 if(bindReplacement){const source=fs.readFileSync(require.resolve('../studio-plus-media.js'),'utf8');vm.runInContext(source.slice(source.indexOf('function plusBindPhotoReplacement('),source.indexOf('async function plusPhotoPanel(')),context);context.plusBindPhotoReplacement(state,()=>previews++);}
 vm.runInContext(fs.readFileSync(require.resolve('../photo-lab-tools.js'),'utf8'),context);context.photoLabEnhance(state,()=>previews++,remember);nodes.get('photoLabBackgroundMode').value='solid';nodes.get('photoLabColor').value='#ffffff';nodes.get('photoLabStrength').value='100';
 return{nodes,state,context,remember,messages,canvas,pixels:()=>[...raw.getContext('2d').getImageData().data],previews:()=>previews};
}
test('Background preview never changes the photo; apply and undo preserve the original cutout',()=>{
 const f=fixture(),before=f.pixels();f.nodes.get('photoLabPreview').onclick();assert.deepEqual(f.pixels(),before);assert.equal(f.state.history.length,0);assert(f.state.lab.pending);
 f.nodes.get('photoLabUseBackground').onclick();assert.deepEqual(f.pixels(),[200,100,50,255,255,255,255,255]);assert.equal(f.state.history.length,1);assert.equal(f.state.lab.pending,null);
 f.nodes.get('plusMaskUndo').onclick();assert.deepEqual(f.pixels(),before);assert.equal(f.state.editRevision,2);
});
test('A background preview cannot overwrite edits made after it was rendered',()=>{
 const f=fixture();f.nodes.get('photoLabPreview').onclick();f.remember();f.state.raw.getContext('2d').putImageData({data:new Uint8ClampedArray([30,40,50,255,0,0,0,0])});const edited=f.pixels();
 f.nodes.get('photoLabUseBackground').onclick();assert.deepEqual(f.pixels(),edited);assert.equal(f.state.lab.pending,null);assert.match(f.nodes.get('photoLabBackgroundStatus').textContent,/changed.*Preview/);
});
test('Reset restores panel original pixels, is undoable, and clears sample/cutout state',()=>{
 const f=fixture(),before=f.pixels();f.state.lab.sample={x:1,y:1};f.state.lab.selectionSource={};f.nodes.get('photoLabReset').onclick();assert.deepEqual(f.pixels(),[200,100,50,255,20,80,160,255]);assert.equal(f.state.lab.sample,null);assert.equal(f.state.lab.selectionSource,null);
 f.nodes.get('plusMaskUndo').onclick();assert.deepEqual(f.pixels(),before);
});
test('Choosing a clone sample leaves pixels intact and prevents accidental erasing',()=>{
 const f=fixture(),before=f.pixels();f.nodes.get('photoLabSample').onclick();f.nodes.get('plusMask').onpointerdown({clientX:0,clientY:.5,preventDefault(){}});
 assert.equal(f.nodes.get('plusBrush').value,'clone');assert.equal(f.state.history.length,0);assert.deepEqual(f.pixels(),before);
 f.nodes.get('plusMask').onpointerdown({clientX:1.5,clientY:.5,pointerId:1,preventDefault(){}});f.nodes.get('plusMask').onpointerup({});
 assert.equal(f.state.history.length,1);assert(f.pixels()[7]>0);f.nodes.get('plusMaskUndo').onclick();assert.deepEqual(f.pixels(),before);
});
test('Opaque photos require a cutout and unavailable uploaded backgrounds do not mutate pixels',()=>{
 const f=fixture();f.nodes.get('photoLabReset').onclick();const before=f.pixels();f.nodes.get('photoLabPreview').onclick();assert.equal(f.state.lab.pending,null);assert.match(f.nodes.get('photoLabBackgroundStatus').textContent,/cutout first/);assert.deepEqual(f.pixels(),before);
 f.nodes.get('plusMaskUndo').onclick();f.nodes.get('photoLabBackgroundMode').value='image';const cutout=f.pixels();f.nodes.get('photoLabPreview').onclick();assert.match(f.nodes.get('photoLabBackgroundStatus').textContent,/background photo first/);assert.deepEqual(f.pixels(),cutout);
});
test('Subject selection keeps one undo snapshot and enables shared edge refinement on success',async()=>{
 const f=fixture(),before=f.pixels();let resolve;f.context.photoLabStartSubjectCutout=()=>({result:new Promise(r=>resolve=r),cancel(){}});
 f.nodes.get('photoLabSelect').onclick();f.nodes.get('plusMask').onpointerdown({clientX:0,clientY:.5,preventDefault(){}});
 assert.equal(f.nodes.get('plusPhotoApply').disabled,true);assert.equal(f.state.history.length,0);
 resolve({type:'result',confidence:new Float32Array([1,0]),width:2,height:1});await new Promise(setImmediate);
 assert.equal(f.state.history.length,1);assert(f.state.autoMask);assert.equal(f.state.autoMask.source.data[0],before[0]);assert.equal(f.nodes.get('plusAutoCutoutEdge').disabled,false);assert.equal(f.nodes.get('plusPhotoApply').disabled,false);assert.equal(f.state.autoJob,null);
 f.nodes.get('plusMaskUndo').onclick();assert.deepEqual(f.pixels(),before);
});
test('A late subject result cannot change a photo after the user leaves the panel',async()=>{
 const f=fixture(),before=f.pixels();let resolve;f.context.photoLabStartSubjectCutout=()=>({result:new Promise(r=>resolve=r),cancel(){}});
 f.nodes.get('photoLabSelect').onclick();f.nodes.get('plusMask').onpointerdown({clientX:0,clientY:.5,preventDefault(){}});
 f.context.plusSection='Motion';resolve({type:'result',confidence:new Float32Array([0,1]),width:2,height:1});await new Promise(setImmediate);
 assert.deepEqual(f.pixels(),before);assert.equal(f.state.history.length,0);assert.equal(f.state.autoJob,null);
});
function delayedImages(f){
 const pending=new Map();f.context.createImageBitmap=file=>new Promise((resolve,reject)=>pending.set(file.name,{resolve,reject}));
 return{choose:(name,id)=>f.nodes.get(id).onchange({target:{files:[{name,type:'image/png',size:100}]}}),finish(name,color){const bitmap=f.canvas([...color,255,...color,255]);bitmap.closed=false;bitmap.close=()=>bitmap.closed=true;pending.get(name).resolve(bitmap);return bitmap;},fail:name=>pending.get(name).reject(Error('Obsolete image error'))};
}
test('Photo replacements resolving out of order keep only the latest chosen file and release both bitmaps',async()=>{
 const f=fixture({bindReplacement:true}),decode=delayedImages(f),a=decode.choose('A','plusPhotoReplace'),b=decode.choose('B','plusPhotoReplace');
 const bitmapB=decode.finish('B',[20,180,90]);await b;assert.equal(f.state.editRevision,1);const chosen=f.pixels();
 const bitmapA=decode.finish('A',[200,20,30]);await a;assert.deepEqual(f.pixels(),chosen);assert.equal(f.state.editRevision,1);assert.equal(bitmapA.closed,true);assert.equal(bitmapB.closed,true);
});
test('A replacement cannot erase edits and undo history made while it decodes',async()=>{
 const f=fixture({bindReplacement:true}),decode=delayedImages(f);f.state.lab.sample={x:1,y:0};const source={saved:true};f.state.lab.selectionSource=source;
 const loading=decode.choose('A','plusPhotoReplace');f.remember();f.state.raw.getContext('2d').putImageData({data:new Uint8ClampedArray([11,22,33,255,0,0,0,0])});const edited=f.pixels(),history=f.state.history.length;
 const bitmap=decode.finish('A',[200,20,30]);await loading;assert.deepEqual(f.pixels(),edited);assert.equal(f.state.history.length,history);assert.equal(f.state.lab.selectionSource,source);assert(f.state.lab.sample);assert.equal(bitmap.closed,true);assert.match(f.messages[0],/edits were kept/);
});
test('A late replacement also preserves changed framing and an in-progress subject job',async()=>{
 for(const change of ['crop','job','panel']){const f=fixture({bindReplacement:true}),decode=delayedImages(f),before=f.pixels(),loading=decode.choose('A','plusPhotoReplace');if(change==='crop')f.nodes.get('plusCropZoom').value='2';if(change==='job')f.state.autoJob={};if(change==='panel')f.context.plusSection='Motion';const bitmap=decode.finish('A',[200,20,30]);await loading;assert.deepEqual(f.pixels(),before);assert.equal(f.state.editRevision,0);assert.equal(bitmap.closed,true);}
});
test('Background uploads cannot overwrite a newer choice or report obsolete decode errors',async()=>{
 const f=fixture(),decode=delayedImages(f),a=decode.choose('A','photoLabUpload'),b=decode.choose('B','photoLabUpload');assert.equal(f.state.lab.background,null);
 const bitmapB=decode.finish('B',[20,180,90]);await b;const chosen=f.state.lab.background;
 const bitmapA=decode.finish('A',[200,20,30]);await a;assert.equal(f.state.lab.background,chosen);assert.equal(bitmapA.closed,true);assert.equal(bitmapB.closed,true);
 const c=decode.choose('C','photoLabUpload'),d=decode.choose('D','photoLabUpload');decode.finish('D',[90,30,200]);await d;const latest=f.state.lab.background,status=f.nodes.get('photoLabBackgroundStatus').textContent;decode.fail('C');await c;assert.equal(f.state.lab.background,latest);assert.equal(f.nodes.get('photoLabBackgroundStatus').textContent,status);
});
