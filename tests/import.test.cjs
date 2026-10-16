const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('import-core.js','utf8'),ctx);
test('PDF ranges are deduplicated and stay in document order',()=>{assert.equal(JSON.stringify(ctx.importPageNumbers('5, 1-3, 2',8)),'[1,2,3,5]');assert.equal(ctx.importPageNumbers('',3).length,3)});
test('Invalid and oversized PDF selections fail before rendering',()=>{for(const [s,n] of [['0',5],['4-2',5],['1-6',5],['hello',5],['',31],['1-31',50],['1,',5]])assert.throws(()=>ctx.importPageNumbers(s,n));assert.equal(ctx.importPageNumbers('32-33',40).length,2)});
test('Raster dimensions preserve aspect ratio within editor limits',()=>{const s=ctx.importCanvasSize(612,792);assert.equal(s.width,1224);assert.equal(s.height,1584);const large=ctx.importCanvasSize(6000,3000);assert.equal(large.width,2400);assert.equal(large.height,1200);assert.throws(()=>ctx.importCanvasSize(0,100))});

test('Import intake supports editable formats and browser files with no MIME type',()=>{
 for(const [name,kind] of [['Deck.PPTX','pptx'],['poster.svg','svg'],['flyer.pdf','pdf'],['photo.JPG','image']])assert.equal(ctx.importCheckFiles([{name,size:30,type:''}]),kind);
 assert.equal(ctx.importCheckFiles([{name:'one.png',size:1},{name:'two.webp',size:1}]),'image');
 for(const files of [[],[{name:'empty.svg',size:0}],[{name:'url.canva',size:30}],[{name:'a.pptx',size:10},{name:'b.svg',size:10}],[{name:'big.pptx',size:31*1024*1024}]])assert.throws(()=>ctx.importCheckFiles(files));
});

function openingHarness(){
 let releaseSave,releaseOpen;const events=[],nodes=new Map(),original={id:'original'},draft={id:'imported'};
 const c={importDraft:draft,importOpening:false,design:original,$:selector=>{if(!nodes.has(selector))nodes.set(selector,{checked:true,disabled:false,open:true,close(){this.open=false;events.push('close')}});return nodes.get(selector)},importSetBusy:busy=>events.push('busy:'+busy),saveNow:()=>new Promise(resolve=>releaseSave=resolve),startDesign:()=>new Promise(resolve=>releaseOpen=()=>{c.design=draft;resolve(true)}),switchTab:name=>events.push(name),saveFile:()=>events.push('backup:'+c.design.id),toast:()=>events.push('toast')};
 vm.createContext(c);const source=fs.readFileSync('import-tools.js','utf8');vm.runInContext(source.slice(source.indexOf('async function finishDesignImport('),source.indexOf("$('#finishImport').onclick=")),c);
 return{c,nodes,events,original,save:result=>releaseSave(result),open:()=>releaseOpen()};
}
test('Opening an import awaits saving and switching before backing up the imported project',async()=>{
 const h=openingHarness(),promise=h.c.finishDesignImport();assert.equal(h.c.design,h.original);assert.equal(h.c.importOpening,true);
 await h.c.finishDesignImport();h.save(true);await new Promise(resolve=>setImmediate(resolve));assert.equal(h.events.includes('close'),false);h.open();await promise;
 assert.deepEqual(h.events,['busy:true','close','pages','backup:imported','toast','busy:false']);assert.equal(h.c.importOpening,false);
});
test('Failed saves and project changes retain the current design and keep the import review open',async()=>{
 for(const changed of [false,true]){const h=openingHarness(),promise=h.c.finishDesignImport();if(changed)h.c.design={id:'other'};h.save(changed);await promise;
 assert.equal(h.events.includes('close'),false);assert.equal(h.events.some(e=>e.startsWith('backup:')),false);assert.equal(h.c.design.id,changed?'other':'original');assert.equal(h.nodes.get('#finishImport').disabled,false);assert.match(h.nodes.get('#importStatus').textContent,changed?/changed/:/could not be saved/);}
});
