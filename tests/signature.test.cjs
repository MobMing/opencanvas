const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c={URL,uid:()=>crypto.randomUUID(),clone:structuredClone,fonts:['Arial','Impact','Georgia','Anton','Bebas Neue','DM Sans','Cormorant Garamond','Caveat']};vm.createContext(c);
const html=fs.readFileSync('dist/index.html','utf8');
for(const f of ['type-core.js','pages-core.js','context-core.js','studio-plus-core.js','signature-collection.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);
vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
vm.runInContext('this.items=signatureTemplates',c);

test('Signature has twenty distinct original compositions and four practical formats',()=>{
 assert.equal(c.items.length,20);assert.equal(new Set(c.items.map(t=>t.id)).size,20);assert.equal(new Set(c.items.map(t=>t.layoutName)).size,20);assert.equal(new Set(c.items.map(t=>t.format)).size,4);
 assert.ok(c.items.filter(t=>t.topic==='Music & DJ').length>=8);
 const geometries=new Set(c.items.map(t=>JSON.stringify(c.makeSignatureDesign(t).elements.map(e=>[e.type,e.x,e.y,e.w,e.h,e.rotation]))));
 assert.equal(geometries.size,20,'these are different compositions, not palette substitutions');
});

test('Signature designs remain native editable layers through real project validation',()=>{
 for(const t of c.items){
  const raw=c.makeSignatureDesign(t),saved=c.validateDesign(raw),roundTrip=c.validateDesign(JSON.parse(JSON.stringify(saved)));
  assert.equal(JSON.stringify(roundTrip),JSON.stringify(saved),t.id+' portable round trip');
  assert.equal(t.aiImagery,false);assert.equal(t.assetIds.length,0);assert.equal(t.imagery,'Shapes & symbols');
  assert.ok(raw.elements.every(e=>['text','rect','ellipse','star'].includes(e.type)),t.id+' no raster, SVG-image or external dependency');
  assert.ok(raw.elements.length<250,t.id+' leaves half the editor budget free');
  assert.ok(raw.elements.filter(e=>e.type==='text').length>=4,t.id+' editable title, message and details');
  for(const e of saved.elements){const b=c.plusBounds([e]);assert.ok(b.x>=-.01&&b.y>=-.01&&b.x+b.w<=saved.width+.01&&b.y+b.h<=saved.height+.01,t.id+' outside page: '+(e.text||e.type));}
  assert.notEqual(c.makeSignatureDesign(t).id,raw.id);assert.equal(new Set(raw.elements.map(e=>e.id)).size,raw.elements.length);
 }
});

test('Signature templates include actionable event or campaign details, with open bundled type',()=>{
 for(const t of c.items){const d=c.makeSignatureDesign(t),texts=d.elements.filter(e=>e.type==='text'),content=texts.map(e=>e.text).join(' ');
  assert.match(content,/YOUR |YOURWEBSITE|LISTEN NOW/,t.id+' editable user-specific call to action');
  assert.ok(texts.every(e=>c.fonts.includes(e.font)),t.id+' known bundled font');
  assert.ok(texts.every(e=>e.size>=22),t.id+' no unreadable microcopy');
 }
 const curved=c.makeSignatureDesign(c.items.find(t=>t.id==='signature-04'));
 assert.ok(curved.elements.some(e=>e.type==='text'&&e.curve===95),'curved record title uses real editable text');
});
