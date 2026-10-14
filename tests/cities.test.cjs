const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const html=fs.readFileSync('dist/index.html','utf8'),c={uid:()=>crypto.randomUUID(),clone:o=>JSON.parse(JSON.stringify(o)),fonts:['Arial','Georgia','Impact','Bangers','Creepster','Kalam'],URL};vm.createContext(c);
for(const f of ['context-core.js','type-core.js','catalog-data.js','promo-scenes.js','promo-data.js','remix-core.js','people-collection.js','studio-collection.js','city-collection.js','pages-core.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);vm.runInContext('this.items=cityTemplates;this.cities=cityDestinations',c);
const assets=Object.fromEntries(JSON.parse(fs.readFileSync('assets/people/PROVENANCE.json')).assets.map(a=>[a.id,'data:image/jpeg;base64,'+fs.readFileSync(a.path).toString('base64')]));

test('eight cities each produce three portable, editable compositions',()=>{
 assert.equal(c.cities.length,8);assert.equal(c.items.length,24);assert.equal(new Set(c.items.map(t=>t.id)).size,24);
 for(const t of c.items){const d=c.validateDesign(c.makeCityDesign(t,assets));assert.ok(d.elements.some(e=>e.type==='text'&&e.text===t.title));const images=d.elements.filter(e=>e.type==='image');assert.equal(images.length,1);assert.equal(images[0].src,assets[t.asset]);assert.match(images[0].altText,/AI-generated/);assert.equal(images[0].w,images[0].h);for(const e of d.elements){assert.ok(e.x>=0&&e.y>=0&&e.x+e.w<=d.width&&e.y+e.h<=d.height,t.id);}const next=c.makeCityDesign(t,assets);assert.notEqual(d.id,next.id);assert.ok(d.elements.every(e=>!next.elements.some(f=>f.id===e.id)));}
 for(const city of c.cities)assert.equal(c.items.filter(t=>t.key===city.key).length,3);
});
test('city plural, aliases and combined queries match in home and gallery search',()=>{
 for(const q of ['city','cities','skyline','skylines'])assert.equal(c.items.filter(t=>c.matchesCatalog(t,q)).length,24,q);
 for(const [q,key]of [['NYC','new-york'],['New York','new-york'],['Winston-Salem','winston-salem'],['winston salem','winston-salem'],['Paris','paris'],['TOKYO','tokyo'],['Barcelona','barcelona']]){const result=c.promoFilter(c.items,{query:q});assert.equal(result.length,3,q);assert.ok(result.every(t=>t.key===key));}
 assert.equal(c.promoFilter(c.items,{query:'cities Tokyo',format:'cover'}).length,1);
 assert.equal(c.promoFilter(c.items,{query:'cities London nightlife'}).length,1);
 assert.equal(c.promoFilter(c.items,{query:'cities unknownplace'}).length,0);
 assert.ok(c.matchesCatalog({name:'Old City Poster'},'cities'));
});
test('city imagery and native formats remain honest and varied',()=>{
 assert.equal(new Set(c.items.map(t=>t.asset)).size,8);
 for(const format of ['post','square','cover'])assert.equal(c.promoFilter(c.items,{format}).length,8);
 assert.equal(c.promoFilter(c.items,{people:true}).length,0);
 assert.equal(c.distinctTemplateConcepts(c.items).length,24);
 const geometries=c.items.slice(0,1).concat(c.items.slice(8,9),c.items.slice(16,17)).map(t=>JSON.stringify(c.makeCityDesign(t,assets).elements.map(e=>[e.type,e.x,e.y,e.w,e.h])));assert.equal(new Set(geometries).size,3);
});
