const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c={URL,uid:()=>crypto.randomUUID(),clone:structuredClone,fonts:['Arial','Anton','Bebas Neue','DM Sans','Cormorant Garamond']};vm.createContext(c);
const html=fs.readFileSync('dist/index.html','utf8');
for(const file of ['type-core.js','pages-core.js','context-core.js','studio-plus-core.js','signal-collection.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);
vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
vm.runInContext(fs.readFileSync('studio-plus-storage.js','utf8').split('let plusDB')[0],c);
vm.runInContext('this.items=signalTemplates',c);
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const assets=Object.fromEntries(['atelier-chrome','signal-orbit','signal-ribbon','signal-spike','signal-glass'].map(id=>[id,png]));
const provenance=['assets/atelier/PROVENANCE.json','assets/signal/PROVENANCE.json'].flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).assets);
test('Signal Lab supplies sixty independently composed editions across fifteen directions',()=>{
 assert.equal(c.items.length,60);assert.equal(new Set(c.items.map(t=>t.id)).size,60);assert.equal(new Set(c.items.map(t=>t.name)).size,60);
 assert.equal(new Set(c.items.map(t=>t.layout)).size,15);assert.equal(new Set(c.items.map(t=>t.format)).size,4);assert.equal(new Set(c.items.map(t=>t.topic)).size,4);
 assert.ok(c.items.every(t=>t.collection==='signal-lab'&&t.aiImagery&&!t.hasPeople&&t.sourceCredit));
 const signatures=c.items.map(t=>JSON.stringify(c.makeSignalDesign(t,assets).elements.map(e=>[e.type,e.x,e.y,e.w,e.h,e.rotation])));
 assert.equal(new Set(signatures).size,60,'composition changes, not sixty palette swaps');
 for(let layout=0;layout<15;layout++)assert.equal(c.items.filter(t=>t.layout===layout).length,4);
});
test('Signal Lab keeps editable information, accurate aspect ratios and stable portable projects',()=>{
 for(const t of c.items){
  const raw=c.makeSignalDesign(t,assets),saved=c.validateDesign(raw),again=c.validateDesign(JSON.parse(JSON.stringify(saved)));
  assert.equal(JSON.stringify(saved),JSON.stringify(again),t.id+' roundtrip');assert.notEqual(raw.id,c.makeSignalDesign(t,assets).id);
  assert.ok(raw.elements.length<250,t.id+' leaves capacity for user layers');assert.equal(new Set(raw.elements.map(e=>e.id)).size,raw.elements.length);
  const texts=saved.elements.filter(e=>e.type==='text');assert.ok(texts.length>=5,t.id+' editable copy');assert.match(texts.map(e=>e.text).join(' '),/YOUR/,t.id+' replaceable event details');
  assert.ok(texts.every(e=>c.fonts.includes(e.font)&&e.size>=22),t.id+' readable bundled type');
  assert.ok(saved.elements.some(e=>e.type==='image'));
  for(const e of saved.elements){const b=c.plusBounds([e]);assert.ok(b.x>=-.01&&b.y>=-.01&&b.x+b.w<=saved.width+.01&&b.y+b.h<=saved.height+.01,t.id+' out of bounds '+(e.text||e.type)+' '+JSON.stringify(b));if(e.type==='image'){assert.equal(e.w,e.h);assert.match(e.altText,/Original generated chrome sculpture/);assert.equal(e.photoCrop.zoom,1);}}
 }
});
test('Signal Lab uses a small explicitly credited artwork set and rejects unsafe image sources',()=>{
 assert.equal(new Set(c.items.flatMap(t=>t.assetIds)).size,5);
 for(const t of c.items){assert.equal(t.assetIds.length,1);assert.equal(t.asset,t.assetIds[0]);
  for(const src of [undefined,'https://example.com/art.png','javascript:alert(1)','data:image/svg+xml;base64,PHN2Zz4=','data:image/png;base64,bad<svg>']){
   const d=c.makeSignalDesign(t,{[t.asset]:src});assert.ok(d.elements.every(e=>e.type!=='image'));assert.doesNotThrow(()=>c.validateDesign(d));
  }
 }
 assert.equal(c.signalAssetSource({test:{src:png}},'test'),png);assert.throws(()=>c.makeSignalDesign({id:'missing'}),/Unknown Signal/);
});
test('all five shipped sculpture assets have prompts, existing files and round-trip-safe image data',()=>{
 for(const id of new Set(c.items.flatMap(t=>t.assetIds))){const credit=provenance.find(asset=>asset.id===id);assert.ok(credit&&credit.prompt&&credit.path,id+' complete asset provenance');
  const bytes=fs.readFileSync(credit.path);assert.ok(bytes.length>1000,id+' full asset exists');
  const src='data:image/webp;base64,'+bytes.toString('base64'),t=c.items.find(t=>t.asset===id),d=c.validateDesign(c.makeSignalDesign(t,{[id]:src}));
  assert.ok(d.elements.some(e=>e.type==='image'&&e.src===src),id+' embedded unchanged');
  assert.equal(JSON.stringify(c.validateDesign(JSON.parse(JSON.stringify(d)))),JSON.stringify(d),id+' portable real artwork');
 }
});
