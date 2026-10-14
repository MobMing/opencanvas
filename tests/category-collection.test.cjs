const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c={URL,uid:()=>crypto.randomUUID(),clone:structuredClone,fonts:['Arial','Impact','Georgia','Courier New','Anton','Bebas Neue','DM Sans','Cormorant Garamond','Caveat']};
vm.createContext(c);
const html=fs.readFileSync('dist/index.html','utf8');
for(const f of ['type-core.js','pages-core.js','context-core.js','studio-plus-core.js','category-collection.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);
vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
vm.runInContext('this.items=categoryTemplates',c);

const topics=['Music & DJ','Podcast','Fitness','Wellness','Beauty','Food & Drink','Gaming','Education','Real Estate','Weddings','Faith & Community','Nonprofit','Pets','Crafts','Books','Travel','Photography','Small Business','Technology','Sports','Gardening','Celebrations','Entertainment','Marketing','Fashion'];
test('category collection covers every creative topic with 26 distinct useful compositions',()=>{
 assert.equal(c.items.length,26);
 assert.deepEqual([...new Set(c.items.map(t=>t.topic))].sort(),[...topics].sort());
 assert.equal(new Set(c.items.map(t=>t.id)).size,26);
 assert.equal(new Set(c.items.map(t=>t.layoutName)).size,26);
 assert.equal(new Set(c.items.map(t=>t.format)).size,3);
 const signatures=c.items.map(t=>JSON.stringify(c.makeCategoryDesign(t).elements.map(e=>[e.type,e.x,e.y,e.w,e.h,e.rotation])));
 assert.equal(new Set(signatures).size,26,'each category receives a new composition, not a palette substitution');
});

test('all new templates remain editable, bounded, portable and self contained',()=>{
 for(const t of c.items){
  const raw=c.makeCategoryDesign(t),validated=c.validateDesign(raw),again=c.validateDesign(JSON.parse(JSON.stringify(validated)));
  assert.equal(JSON.stringify(again),JSON.stringify(validated),t.id+' project roundtrip');
  assert.equal(t.aiImagery,false);assert.equal(t.hasPeople,false);assert.equal(t.assetIds.length,0);
  assert.equal(t.imagery,'Shapes & symbols');
  assert.ok(raw.elements.every(e=>['text','rect','round','ellipse','triangle'].includes(e.type)),t.id+' native layers only');
  assert.ok(raw.elements.length<180,t.id+' room left for customization');
  assert.ok(raw.elements.filter(e=>e.type==='text').length>=4,t.id+' editable title, message and details');
  for(const e of validated.elements){
   const b=c.plusBounds([e]);
   assert.ok(b.x>=-.01&&b.y>=-.01&&b.x+b.w<=validated.width+.01&&b.y+b.h<=validated.height+.01,t.id+' outside page: '+(e.text||e.type)+' '+JSON.stringify(b));
   if(e.type==='text'){assert.ok(c.fonts.includes(e.font),t.id+' known font '+e.font);assert.ok(e.size>=16,t.id+' no microcopy');}
  }
  assert.equal(new Set(raw.elements.map(e=>e.id)).size,raw.elements.length);
  assert.notEqual(c.makeCategoryDesign(t).id,raw.id);
 }
});

test('templates have category-specific information rather than repeated generic copy',()=>{
 const expected={
  'open-doors':['LIVING','KITCHEN','BEDROOM','YOUR ADDRESS'],
  'lost-companion':['LAST SEEN','YOUR PHONE NUMBER','PHOTO'],
  'pantry-full':['Canned vegetables','DROP OFF','ACCEPTED ITEMS'],
  'good-neighbors':['TEN STAMPS','REWARD TERMS'],
  'garden-vows':['Mina','RECEPTION','18 JUNE'],
  'mend-make':['WORN PIECE','MATERIALS PROVIDED'],
  'grow-note':['WATER','SOIL','ONE THING I NOTICED'],
  'made-to-launch':['TEASE','REVEAL','INVITE','LAUNCH DATE'],
  'lisbon-weekend':['ALFAMA','THE RIVER','MIRADOURO']
 };
 for(const [key,phrases]of Object.entries(expected)){
  const d=c.makeCategoryDesign(c.items.find(t=>t.key===key)),content=d.elements.filter(e=>e.type==='text').map(e=>e.text).join(' ');
  for(const phrase of phrases)assert.ok(content.includes(phrase),key+' missing '+phrase);
 }
 assert.throws(()=>c.makeCategoryDesign({id:'unknown'}),/Unknown category/);
});

test('templates do not share mutable document or layer state',()=>{
 for(const t of c.items){const first=c.makeCategoryDesign(t),second=c.makeCategoryDesign(t);first.elements[0].color='#000000';assert.notEqual(first.elements[0],second.elements[0]);assert.notEqual(first.elements[0].id,second.elements[0].id);assert.notEqual(second.elements[0].color,'#000000');}
});
