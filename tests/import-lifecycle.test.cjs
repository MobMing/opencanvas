const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('import-tools.js','utf8');
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return{promise,resolve,reject}};
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function extract(start,end){const a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert.ok(a>=0&&b>a,'import lifecycle function exists');return source.slice(a,b)}
function preparationHarness(){
  const nodes=new Map(),tasks=[],renders=[],canvases=[];
  const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{open:true,disabled:false,hidden:false,value:selector==='#importQuality'?'2400':'',textContent:'',setAttribute(){},replaceChildren(){this.innerHTML=''}});return nodes.get(selector)};
  const c={Uint8Array,setTimeout,importOpening:false,importRevision:0,importTask:null,importRenderTask:null,importDraft:null,importSourceFiles:[],$:node,ImportBinaryDataFactory:class{},importPDFLibrary:async()=>({getDocument({data}){const pending=deferred(),task={id:data[0],promise:pending.promise,destroyed:0,destroy(){this.destroyed++;return Promise.resolve()},resolve:pending.resolve,reject:pending.reject};tasks.push(task);return task}}),document:{createElement(tag){assert.equal(tag,'canvas');const canvas={width:0,height:0,getContext:()=>({}),toDataURL:()=>{throw Error('A cancelled render must not produce an image')}};canvases.push(canvas);return canvas}}};
  vm.createContext(c);vm.runInContext(fs.readFileSync('import-core.js','utf8'),c);vm.runInContext(extract('function importSetBusy(','function openDesignImport('),c);vm.runInContext(extract('async function prepareDesignImport(','async function importPreviewPage('),c);
  const file=(id,pending)=>({name:'presentation-'+id+'.pdf',type:'application/pdf',size:1,arrayBuffer:()=>pending?pending.promise:Promise.resolve(Uint8Array.of(id).buffer)});
  const beginRender=task=>{const pending=deferred(),render={id:task.id,promise:pending.promise,cancelled:0,cancel(){this.cancelled++},resolve:pending.resolve};renders.push(render);task.resolve({numPages:1,getPage:async()=>({getViewport:({scale})=>({width:100*scale,height:100*scale}),render:()=>render,cleanup(){}})});return render};
  return{c,nodes,tasks,renders,canvases,file,beginRender,node};
}
test('A superseded PDF file read cannot create a task or replace the current task',async()=>{
  const h=preparationHarness(),firstRead=deferred(),first=h.c.prepareDesignImport([h.file(1,firstRead)]);await flush();
  assert.equal(h.tasks.length,0);
  const second=h.c.prepareDesignImport([h.file(2)]);await flush();const current=h.tasks[0];
  assert.equal(current.id,2);assert.equal(h.c.importTask,current);
  firstRead.resolve(Uint8Array.of(1).buffer);await flush();
  assert.deepEqual(h.tasks.map(task=>task.id),[2]);await first;assert.equal(h.c.importTask,current);assert.equal(current.destroyed,0);assert.equal(h.node('#chooseImport').disabled,true);assert.equal(h.node('#importStatus').textContent,'Reading your file…');
  h.c.cancelImport();current.resolve({numPages:1});await second;
  assert.ok(current.destroyed>=1);assert.equal(h.c.importTask,null);
});
test('Closing during a PDF file read does not start a PDF worker after cancellation',async()=>{
  const h=preparationHarness(),reading=deferred(),pending=h.c.prepareDesignImport([h.file(1,reading)]);await flush();
  h.node('#importDialog').open=false;h.c.cancelImport();reading.resolve(Uint8Array.of(1).buffer);await flush();
  assert.equal(h.tasks.length,0);await pending;assert.equal(h.c.importTask,null);assert.equal(h.node('#finishImport').disabled,true);
});
test('A superseded PDF render cannot clear the replacement render task',async()=>{
  const h=preparationHarness(),first=h.c.prepareDesignImport([h.file(1)]);await flush();const firstRender=h.beginRender(h.tasks[0]);await flush();
  assert.equal(h.c.importRenderTask,firstRender);
  const second=h.c.prepareDesignImport([h.file(2)]);await flush();const secondTask=h.tasks[1],secondRender=h.beginRender(secondTask);await flush();
  assert.equal(firstRender.cancelled,1);assert.equal(h.c.importRenderTask,secondRender);
  firstRender.resolve();await first;
  assert.equal(h.c.importRenderTask,secondRender);assert.equal(h.c.importTask,secondTask);assert.equal(secondRender.cancelled,0);
  h.c.cancelImport();secondRender.resolve();await second;
  assert.equal(secondRender.cancelled,1);assert.equal(h.c.importRenderTask,null);assert.ok(h.canvases.every(canvas=>canvas.width===1&&canvas.height===1));
});
function previewHarness({decode,draw,serialize}={}){
  const cache=new Map(),images=[],canvases=[],painted=[];
  const c={Map,imageCache:cache,Image:class{constructor(){images.push(this)}async decode(){if(decode)return decode(this)}},document:{createElement(tag){assert.equal(tag,'canvas');const canvas={width:0,height:0,getContext:()=>({scale(){}}),toDataURL:()=>serialize?serialize():'data:image/png;base64,cHJldmlldw=='};canvases.push(canvas);return canvas}},drawDocument(context,page){painted.push(page);if(draw)return draw(cache,page)},esc:value=>String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]))};
  vm.createContext(c);vm.runInContext(extract('async function importPreviewPage(','async function finishDesignImport('),c);
  const page={name:'Imported <flyer>',width:1000,height:500,elements:[{type:'image',src:'existing'},{type:'image',src:'new'},{type:'image',src:'new'},{type:'text',text:'Editable'}]};
  return{c,cache,images,canvases,painted,page};
}
test('Editable previews temporarily use decoded pictures and restore existing cache entries',async()=>{
  const old={from:'current design'},unrelated={from:'other project'};
  const h=previewHarness({draw(cache){assert.notEqual(cache.get('existing'),old);assert.ok(h.images.includes(cache.get('existing')));assert.ok(h.images.includes(cache.get('new')));assert.equal(cache.get('unrelated'),unrelated)}});
  h.cache.set('existing',old);h.cache.set('unrelated',unrelated);
  const html=await h.c.importPreviewPage(h.page,()=>{});
  assert.equal(h.images.length,2,'duplicate pictures are decoded once');assert.match(html,/Imported &lt;flyer&gt;/);assert.match(html,/4 layers/);assert.equal(h.cache.get('existing'),old);assert.equal(h.cache.get('unrelated'),unrelated);assert.equal(h.cache.has('new'),false);assert.equal(h.cache.size,2);assert.equal(h.canvases[0].width,1);assert.equal(h.canvases[0].height,1);
});
test('Editable preview painting and serialization errors release temporary cache entries',async()=>{
  for(const phase of ['draw','serialize']){
    const old={from:'current design'},h=previewHarness({[phase](){throw Error('Preview '+phase+' failed')}});h.cache.set('existing',old);
    await assert.rejects(h.c.importPreviewPage(h.page,()=>{}),new RegExp('Preview '+phase+' failed'));
    assert.equal(h.cache.get('existing'),old);assert.equal(h.cache.has('new'),false);assert.equal(h.cache.size,1);assert.equal(h.canvases[0].width,1);assert.equal(h.canvases[0].height,1);
  }
});
test('Editable preview decode errors leave the editor image cache untouched',async()=>{
  const old={from:'current design'},h=previewHarness({decode(image){if(image.src==='new')throw Error('Image decode failed')}});h.cache.set('existing',old);
  await assert.rejects(h.c.importPreviewPage(h.page,()=>{}),/Image decode failed/);
  assert.equal(h.cache.get('existing'),old);assert.equal(h.cache.has('new'),false);assert.equal(h.cache.size,1);assert.equal(h.canvases.length,0);assert.equal(h.painted.length,0);
});
test('Cancelling a pending preview decode leaves cache and current images unchanged',async()=>{
  const pending=deferred(),old={from:'current design'},h=previewHarness({decode(image){if(image.src==='new')return pending.promise}});h.cache.set('existing',old);let cancelled=false;
  const preview=h.c.importPreviewPage(h.page,()=>{if(cancelled)throw Error('Import cancelled')});await flush();
  assert.equal(h.images.length,2);assert.equal(h.cache.get('existing'),old);assert.equal(h.cache.has('new'),false);
  cancelled=true;pending.resolve();await assert.rejects(preview,/Import cancelled/);
  assert.equal(h.cache.get('existing'),old);assert.equal(h.cache.size,1);assert.equal(h.canvases.length,0);assert.equal(h.painted.length,0);
});
test('Preview cleanup never overwrites a cache entry replaced by another owner',async()=>{
  const replacement={from:'new cache owner'},h=previewHarness({draw(cache){cache.set('new',replacement)}});
  await h.c.importPreviewPage(h.page,()=>{});
  assert.equal(h.cache.get('new'),replacement);assert.equal(h.cache.has('existing'),false);assert.equal(h.cache.size,1);
});
