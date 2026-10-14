const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const c={uid:()=>crypto.randomUUID(),clone:structuredClone,fonts:['Arial','Impact','Georgia','Kalam','Anton','Bebas Neue','DM Sans','Cormorant Garamond','Caveat'],URL};vm.createContext(c);
const html=fs.readFileSync('dist/index.html','utf8');
for(const f of ['context-core.js','type-core.js','pages-core.js','studio-plus-core.js','catalog-data.js','promo-scenes.js','promo-data.js','remix-core.js','people-collection.js','studio-collection.js','reference-collection.js','city-collection.js','discovery-collection.js','wave-collection.js','flyer-collection.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);
vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
vm.runInContext(fs.readFileSync('studio-plus-storage.js','utf8').split('let plusDB')[0],c);
vm.runInContext('this.items=flyerTemplates;this.all=[...flyerTemplates,...waveTemplates,...crossoverTemplates,...cityTemplates,...referenceTemplates,...studioTemplates,...peopleTemplates,...promoTemplates,...remixTemplates]',c);
const provenance=JSON.parse(fs.readFileSync('assets/people/PROVENANCE.json')).assets;
const assets=Object.fromEntries(provenance.map(a=>[a.id,'data:image/jpeg;base64,'+fs.readFileSync(a.path).toString('base64')]));
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
test('flyer lab offers 36 unique designs, twelve geometries, four formats and broad photo variety',()=>{
 assert.equal(c.items.length,36);assert.equal(new Set(c.items.map(t=>t.id)).size,36);assert.equal(new Set(c.items.map(t=>t.name)).size,36);
 assert.equal(new Set(c.items.map(t=>t.layout)).size,12);assert.equal(new Set(c.items.map(t=>t.format)).size,4);
 assert.equal(c.items.filter(t=>!t.aiImagery).length,9);assert.ok(new Set(c.items.flatMap(t=>t.assetIds)).size>=18);
 const geometries=new Set();for(const t of c.items){
  assert.equal(t.aiImagery,t.assetIds.length>0);assert.equal(new Set(t.assetIds).size,t.assetIds.length,'contact sheets must use different photographs');
  const d=c.validateDesign(c.makeFlyerDesign(t,assets));geometries.add(JSON.stringify(d.elements.map(e=>[e.type,e.x,e.y,e.w,e.h])));
  assert.ok(d.elements.some(e=>e.type==='text'&&e.text===t.title));assert.notEqual(c.makeFlyerDesign(t,assets).id,d.id);
  const roundtrip=c.validateDesign(JSON.parse(JSON.stringify(d)));assert.equal(JSON.stringify(roundtrip),JSON.stringify(d));
  for(const e of d.elements){const b=c.plusBounds([e]);assert.ok(b.x>=-.01&&b.y>=-.01&&b.x+b.w<=d.width+.01&&b.y+b.h<=d.height+.01,t.id+' layer outside page');}
  const images=d.elements.filter(e=>e.type==='image');assert.equal(images.length,t.assetIds.length);
  images.forEach((image,i)=>{assert.ok(assets[t.assetIds[i]]);assert.equal(image.src,assets[t.assetIds[i]]);assert.match(image.altText,/AI-generated fictional/);assert.equal(image.photoCrop.zoom,1);assert.equal(image.photoCrop.x,.5,'cropped frames preserve source proportions instead of stretching photos');});
  for(const e of d.elements.filter(e=>e.type==='text'))assert.ok(!['Impact','Georgia'].includes(e.font),'uses the new bundled typography');
 }
 assert.ok(geometries.size>=24,'variants also change framing, proportions, and composition');
});
test('flyer palette text stays readable on both paper and accent panels',()=>{
 const lum=h=>{const a=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2]};
 const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 for(const t of c.items){assert.ok(ratio(t.bg,t.ink)>=4.5,t.id+' background text');assert.ok(ratio(t.accent,c.flyerAccentInk(t))>=4.5,t.id+' accent text');}
});
test('flyer discovery stays mixed, preserves existing templates and keeps genre searches relevant',()=>{
 assert.equal(new Set(c.all.map(t=>t.id)).size,c.all.length);const mixed=c.curateTemplates(c.items);assert.equal(mixed.length,36);
 // The first gallery page stays diverse; the remaining tail is a best-effort mix.
 for(let i=1;i<mixed.length;i++){if(i<30)assert.notEqual(mixed[i].layout,mixed[i-1].layout,'first-page layout repeat');assert.ok(!mixed[i].assetIds.some(a=>mixed[i-1].assetIds.includes(a)),'adjacent photograph repeat');}
 for(const query of ['rave','jazz','market','concert','dj','social']){const found=c.promoFilter(c.items,{query});assert.ok(found.length>=3,query);assert.ok(c.curateTemplates(found).every(t=>c.matchesCatalog(t,query)));}
 assert.equal(new Set(c.curateTemplates(c.all).map(t=>t.id)).size,c.all.length);assert.equal(c.promoFilter(c.items,{query:'zz-no-flyer-match'}).length,0);
});
test('wayfinding dividers avoid labels, top portraits clear the headline, and metadata distinguishes equipment',()=>{
 for(const t of c.items.filter(t=>t.layout===10)){
  const d=c.makeFlyerDesign(t,assets),rules=d.elements.filter(e=>e.type==='rect'&&Math.min(e.w,e.h)<=14),text=d.elements.filter(e=>e.type==='text');
  assert.ok(rules.length>=2);for(const rule of rules)for(const label of text)assert.equal(overlaps(rule,label),false,t.id+' route crosses '+label.text);
 }
 for(const t of c.items.filter(t=>[0,5,6,8,9].includes(t.layout))){const d=c.makeFlyerDesign(t,assets),headline=d.elements.find(e=>e.type==='text'&&e.text===t.title),hero=d.elements.find(e=>e.type==='image');assert.ok(hero.y>=headline.y+headline.h,t.id+' headline covers hero portrait');assert.equal(hero.photoCrop.y,0);}
 const equipment=c.items.find(t=>t.asset==='vinyl');assert.equal(equipment.imagery,'Equipment');assert.equal(equipment.hasPeople,false);
 for(const t of c.items.filter(t=>t.assetIds.length>1&&t.hasPeople))assert.equal(t.imagery,'People');
});
