const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c={URL,uid:()=>crypto.randomUUID(),clone:structuredClone,fonts:['Arial','Courier New','Anton','Bebas Neue','DM Sans','Cormorant Garamond','Caveat','Bangers']};vm.createContext(c);
const html=fs.readFileSync('dist/index.html','utf8');
for(const file of ['type-core.js','pages-core.js','context-core.js','studio-plus-core.js','gaming-collection.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);
vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
const storage=fs.readFileSync('studio-plus-storage.js','utf8');vm.runInContext(storage.slice(0,storage.indexOf('let plusDB')),c);
vm.runInContext('this.items=gamingTemplates',c);
const assetManifest=JSON.parse(fs.readFileSync('assets/gaming/PROVENANCE.json','utf8'));
const assets=Object.fromEntries(assetManifest.assets.map(asset=>[asset.id,'data:image/webp;base64,'+fs.readFileSync(asset.path).toString('base64')]));

test('Gaming provides twenty-four distinct compositions across four real formats and several game communities',()=>{
 assert.equal(c.items.length,24);assert.equal(new Set(c.items.map(t=>t.id)).size,24);assert.equal(new Set(c.items.map(t=>t.layoutName)).size,24);assert.equal(new Set(c.items.map(t=>t.format)).size,4);
 assert.ok(c.items.every(t=>t.topic==='Gaming'&&t.collection==='gaming'));
 const allTags=c.items.map(t=>t.tags).join(' ');for(const topic of ['controller','esports','arcade','bracket','keyboard','chess','tabletop','speedrun','cozy','trivia'])assert.ok(allTags.includes(topic),topic+' represented');
 const geometry=new Set(c.items.map(t=>JSON.stringify(c.makeGamingDesign(t,assets).elements.map(e=>[e.type,e.x,e.y,e.w,e.h,e.rotation]))));assert.equal(geometry.size,24,'not palette or size permutations');
});

test('Shipped Gaming designs preserve native editable layers and motif groups through project validation',()=>{
 for(const t of c.items.filter(t=>!t.aiImagery)){
  const raw=c.makeGamingDesign(t),saved=c.validateDesign(raw),roundTrip=c.validateDesign(JSON.parse(JSON.stringify(saved)));
  assert.equal(JSON.stringify(saved),JSON.stringify(roundTrip),t.id+' portable round trip');
  assert.equal(t.aiImagery,false);assert.equal(t.assetIds.length,0);assert.equal(t.imagery,'Shapes & symbols');
  assert.ok(raw.elements.every(e=>['text','rect','round','ellipse','triangle','star'].includes(e.type)),t.id+' has no raster artwork or remote asset');
  assert.ok(raw.elements.length<300,t.id+' leaves editing room');assert.ok(raw.elements.filter(e=>e.type==='text').length>=3,t.id+' editable copy');
  assert.equal(new Set(raw.elements.map(e=>e.id)).size,raw.elements.length,t.id+' unique layer IDs');assert.notEqual(c.makeGamingDesign(t).id,raw.id);
  for(const e of saved.elements){const b=c.plusBounds([e]);assert.ok(b.x>=-.01&&b.y>=-.01&&b.x+b.w<=saved.width+.01&&b.y+b.h<=saved.height+.01,t.id+' outside page: '+(e.text||e.type));}
  for(const e of raw.elements.filter(e=>e.groupId))assert.equal(saved.elements.find(v=>v.id===e.id).groupId,e.groupId,t.id+' editable motif group');
 }
});

test('Gaming copy supplies meaningful editable details and uses available type',()=>{
 for(const t of c.items){const texts=c.makeGamingDesign(t).elements.filter(e=>e.type==='text'),content=texts.map(e=>e.text).join(' ');
  assert.match(content,/YOUR|@YOURCHANNEL/,t.id+' editable user details');assert.ok(texts.every(e=>c.fonts.includes(e.font)),t.id+' available font');assert.ok(texts.every(e=>e.size>=23),t.id+' legible supplied copy');
 }
 const bracket=c.makeGamingDesign(c.items.find(t=>t.id==='gaming-04')).elements.filter(e=>e.type==='text').map(e=>e.text).join(' ');
 for(const team of ['TEAM NORTH','TEAM SOUTH','TEAM EAST','TEAM WEST','FINAL'])assert.ok(bracket.includes(team),'bracket label '+team);
 const schedule=c.makeGamingDesign(c.items.find(t=>t.id==='gaming-17')).elements.filter(e=>e.type==='text').map(e=>e.text).join(' ');
 for(const day of ['TUE','THU','SUN','TIME ZONE'])assert.ok(schedule.includes(day),'schedule includes '+day);
});

test('Optional artwork is bounded embedded data and missing or unsafe artwork keeps a complete native design',()=>{
 const withSlots=c.items.filter(t=>t.assetSlot);assert.equal(withSlots.length,8);
 const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
 for(const t of withSlots){const original=c.makeGamingDesign(t),valid=c.validateDesign(c.makeGamingDesign(t,{[t.assetSlot]:png})),photo=valid.elements.filter(e=>e.type==='image');assert.equal(photo.length,1);assert.equal(photo[0].src,png);assert.ok(photo[0].x>=0&&photo[0].y>=0&&photo[0].x+photo[0].w<=valid.width&&photo[0].y+photo[0].h<=valid.height);
  for(const src of ['https://example.com/a.png','javascript:alert(1)','data:image/svg+xml;base64,PHN2Zy8+','data:image/png;base64,bad<svg>',null]){
   const fallback=c.makeGamingDesign(t,{[t.assetSlot]:src});assert.equal(fallback.elements.length,original.elements.length);assert.ok(fallback.elements.every(e=>e.type!=='image'));
  }
 }
 assert.equal(c.gamingAssetSource({test:{src:png}},'test'),png);assert.equal(c.gamingAssetSource({},'missing'),null);
});

test('Four illustration-led designs use credited real assets without stretching square artwork',()=>{
 const illustrated=c.items.filter(t=>t.aiImagery);assert.equal(illustrated.length,4);assert.equal(new Set(illustrated.map(t=>t.format)).size,4);
 for(const t of illustrated){assert.equal(t.assetIds.length,1);const id=t.assetIds[0],record=assetManifest.assets.find(a=>a.id===id);assert.ok(record&&record.origin==='AI-generated illustration',t.id+' accurate provenance');
  const raw=c.makeGamingDesign(t,assets),saved=c.validateDesign(raw),images=saved.elements.filter(e=>e.type==='image');assert.equal(images.length,1);assert.equal(images[0].src,assets[id]);assert.equal(images[0].w,images[0].h,t.id+' square aspect ratio');
  assert.equal(JSON.stringify(c.validateDesign(JSON.parse(JSON.stringify(saved)))),JSON.stringify(saved),t.id+' portable image round trip');
  assert.ok(saved.elements.filter(e=>e.type==='text').length>=3,t.id+' separate editable copy');for(const e of saved.elements){const b=c.plusBounds([e]);assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=saved.width&&b.y+b.h<=saved.height,t.id+' in bounds');}
 }
});
