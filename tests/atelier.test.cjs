const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c={uid:()=>crypto.randomUUID(),clone:structuredClone,URL,fonts:['Arial','Impact','Georgia','Anton','Bebas Neue','DM Sans','Cormorant Garamond','Caveat']};vm.createContext(c);
const html=fs.readFileSync('dist/index.html','utf8');
for(const f of ['type-core.js','pages-core.js','context-core.js','studio-plus-core.js','atelier-collection.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);
vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
vm.runInContext(fs.readFileSync('studio-plus-storage.js','utf8').split('let plusDB')[0],c);
vm.runInContext('this.items=atelierTemplates',c);
const provenance=['assets/people/PROVENANCE.json','assets/atelier/PROVENANCE.json'].flatMap(f=>JSON.parse(fs.readFileSync(f)).assets);
const assets=Object.fromEntries(provenance.map(a=>[a.id,'data:image/'+(a.path.endsWith('.webp')?'webp':'jpeg')+';base64,'+fs.readFileSync(a.path).toString('base64')]));

test('atelier provides 24 independent compositions across twelve directions, three formats and diverse sources',()=>{
 assert.equal(c.items.length,24);assert.equal(new Set(c.items.map(t=>t.id)).size,24);assert.equal(new Set(c.items.map(t=>t.name)).size,24);
 assert.equal(new Set(c.items.map(t=>t.layoutName)).size,12);assert.equal(new Set(c.items.map(t=>t.format)).size,3);
 assert.ok(new Set(c.items.flatMap(t=>t.assetIds)).size>=20);
 const geometries=new Set();for(const t of c.items){assert.equal(t.collection,'atelier');const d=c.makeAtelierDesign(t,assets);geometries.add(JSON.stringify(d.elements.map(e=>[e.type,e.x,e.y,e.w,e.h,e.rotation])));assert.ok(d.elements.some(e=>e.type==='text'&&e.size>=100),'large editorial typography');}
 assert.equal(geometries.size,24,'each design changes the composition instead of just replacing colors and words');
});

test('atelier designs remain editable and portable with source credits and exact photo framing',()=>{
 for(const t of c.items){
  const raw=c.makeAtelierDesign(t,assets),d=c.validateDesign(raw),again=c.validateDesign(JSON.parse(JSON.stringify(d)));
  assert.equal(JSON.stringify(d),JSON.stringify(again),t.id+' round trip');assert.notEqual(c.makeAtelierDesign(t,assets).id,raw.id);
  assert.ok(d.elements.filter(e=>e.type==='text').length>=4);assert.ok(d.elements.some(e=>['rect','ellipse','star'].includes(e.type)));
  assert.ok(d.elements.length<250,'leaves at least half the editor layer budget for user content');
  const text=raw.elements.filter(e=>e.type==='text');assert.ok(text.every(e=>e.font!=='Impact'&&e.font!=='Georgia'),'uses bundled art-direction fonts');
  for(const e of d.elements){const b=c.plusBounds([e]);assert.ok(b.x>=-.01&&b.y>=-.01&&b.x+b.w<=d.width+.01&&b.y+b.h<=d.height+.01,t.id+' layer outside page: '+e.type+' '+(e.text||''));}
  for(const e of d.elements.filter(e=>e.type==='image')){assert.match(e.src,/^data:image\/(jpeg|webp);base64,/);assert.match(e.altText,/Original generated artwork/);assert.ok(t.assetIds.some(id=>assets[id]===e.src),t.id+' undeclared artwork');assert.equal(e.photoCrop.zoom,1);}
  for(const e of d.elements.filter(e=>e.type==='text'))assert.ok(c.fonts.includes(e.font));
 }
});

test('transparent artwork retains square framing and all sources are present in the credited manifests',()=>{
 const transparent=new Set(provenance.filter(a=>a.transparent).map(a=>a.id));assert.equal(transparent.size,4);
 for(const t of c.items){for(const id of t.assetIds)assert.ok(assets[id],t.id+' missing artwork '+id);
  const d=c.makeAtelierDesign(t,assets);for(const e of d.elements.filter(e=>e.type==='image'&&[...transparent].some(id=>assets[id]===e.src))){assert.equal(e.w,e.h,'transparent cutouts must not be stretched');assert.equal(e.photoCrop.zoom,1);assert.equal(e.photoCrop.x,.5);assert.equal(e.photoCrop.y,.5);}
 }
});

test('full-bleed and portrait-first layouts are structural alternatives to the old square photo tiles',()=>{
 const ds=c.items.map(t=>c.makeAtelierDesign(t,assets));
 assert.ok(ds.filter(d=>d.elements.some(e=>e.type==='image'&&e.x===0&&e.y===0&&e.w===d.width&&e.h===d.height)).length>=5);
 assert.ok(ds.filter(d=>d.elements.some(e=>e.type==='image'&&e.w!==e.h)).length>=12);
 const receipt=ds.find(d=>d.name==='YOU ARE ON THE LIST'),portrait=receipt.elements.find(e=>e.type==='image');assert.equal(portrait.photoCrop.y,.08,'portrait receipt anchors near the faces instead of cropping to torsos');
 const closer=ds.find(d=>d.name==='CLOSER'),credit=closer.elements.find(e=>e.type==='text'&&e.text==='YOUR ARTIST & SPECIAL GUESTS');assert.ok(closer.elements.slice(0,closer.elements.indexOf(credit)).some(e=>e.type==='rect'&&e.color===closer.background&&e.y<=credit.y&&e.y+e.h>=credit.y+credit.h),'artist credit has a readable solid backdrop');
});
