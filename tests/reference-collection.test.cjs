const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const html=fs.readFileSync('dist/index.html','utf8'),c={uid:()=>crypto.randomUUID(),clone:o=>JSON.parse(JSON.stringify(o)),fonts:['Arial','Georgia','Impact','Bangers','Creepster','Kalam'],URL};vm.createContext(c);
for(const f of ['context-core.js','type-core.js','catalog-data.js','promo-scenes.js','promo-data.js','remix-core.js','people-collection.js','studio-collection.js','reference-collection.js','pages-core.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);vm.runInContext('this.items=referenceTemplates;this.families=referenceFamilies',c);
const assets=Object.fromEntries(JSON.parse(fs.readFileSync('assets/people/PROVENANCE.json')).assets.map(a=>[a.id,'data:image/jpeg;base64,'+fs.readFileSync(a.path).toString('base64')]));

test('240 combinations preserve editable copy, image metadata and safe layer bounds',()=>{
 assert.equal(c.items.length,240);assert.equal(new Set(c.items.map(t=>t.id)).size,240);
 for(const t of c.items){
  const d=c.validateDesign(c.makeReferenceDesign(t,assets));assert.equal(d.name,t.name);
  assert.ok(d.elements.some(e=>e.type==='text'&&e.text===t.title),t.id);
  assert.ok(d.elements.some(e=>e.type==='text'&&e.text===t.detail),t.id);
  const imgs=d.elements.filter(e=>e.type==='image');
  assert.deepEqual(Array.from(imgs,e=>e.src),Array.from(t.assetIds,id=>assets[id]),t.id);
  assert.equal(t.aiImagery,imgs.length>0);
  for(const e of d.elements){const angle=(e.rotation||0)*Math.PI/180,bw=Math.abs(e.w*Math.cos(angle))+Math.abs(e.h*Math.sin(angle)),bh=Math.abs(e.w*Math.sin(angle))+Math.abs(e.h*Math.cos(angle));assert.ok(e.x+e.w/2-bw/2>=-.01&&e.y+e.h/2-bh/2>=-.01&&e.x+e.w/2+bw/2<=d.width+.01&&e.y+e.h/2+bh/2<=d.height+.01,t.id+' '+e.type+' '+e.text);if(e.type==='image')assert.equal(e.w,e.h);}
 }
});
test('20 families interleave with 12 distinct editable combinations each',()=>{
 assert.equal(c.families.length,20);assert.equal(new Set(c.items.slice(0,20).map(t=>t.family)).size,20);
 assert.equal(c.distinctTemplateConcepts(c.items).length,240);
 const signatures=new Set();
 for(const f of c.families){const items=c.items.filter(t=>t.family===f.key);assert.equal(items.length,12);assert.equal(new Set(items.map(t=>t.title)).size,12);assert.equal(new Set(items.map(t=>t.paletteName)).size,12);}
 for(const t of c.items){const a=c.makeReferenceDesign(t,assets),b=c.makeReferenceDesign(t,assets);assert.notEqual(a.id,b.id);assert.ok(a.elements.every(e=>!b.elements.some(f=>f.id===e.id)));signatures.add(JSON.stringify([a.background,a.elements.map(({id,...e})=>e)]));}
 assert.equal(signatures.size,240);
});
test('2027 calendar dates align to weekdays and real month lengths',()=>{
 for(const t of c.items.filter(t=>t.family==='calendar')){
 const d=c.makeReferenceDesign(t,assets),nums=d.elements.filter(e=>e.type==='text'&&/^\d+$/.test(e.text)),days=new Date(Date.UTC(2027,t.variant+1,0)).getUTCDate(),start=new Date(Date.UTC(2027,t.variant,1)).getUTCDay();
 assert.equal(nums.length,days);for(let day=1;day<=days;day++){const e=nums.find(e=>e.text===String(day)),n=start+day-1;assert.equal(e.x,55+n%7*125+8);assert.equal(e.y,225+Math.floor(n/7)*72+7);}
 }
});
test('new practical templates remain searchable with accurate image and format filters',()=>{
 for(const q of ['calendar','sign-up','travel','restaurant','halloween','dj','resume','birthday'])assert.ok(c.promoFilter(c.items,{query:q}).length>=12,q);
 assert.equal(c.promoFilter(c.items,{layout:'Monthly planner'}).length,12);
 assert.ok(c.promoFilter(c.items,{people:true}).every(t=>t.assetIds.some(id=>['studio-portrait','fashion','beauty-editorial','creator-street','life-birthday','life-creator','creator','comedian','creative-founder','wellness','studio-friends','night-friends','podcast-pair','rooftop','studio-duo'].includes(id))));
 const d=c.makeReferenceDesign(c.items.find(t=>t.family==='signup'),assets);assert.equal(d.elements.filter(e=>e.type==='text'&&/^[1-8]$/.test(e.text)).length,8);
});
test('dark variations keep invitation banners and paper captions readable',()=>{
 const lum=hex=>{const a=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
 for(const t of c.items.filter(t=>['gothic','creator','harvest'].includes(t.family))){
 const d=c.makeReferenceDesign(t,assets),title=d.elements.find(e=>e.type==='text'&&e.text===t.title),bg=t.family==='gothic'?t.accent:t.bg,L=[lum(title.color),lum(bg)].sort((a,b)=>b-a);
 assert.ok((L[0]+.05)/(L[1]+.05)>=4.5,t.id);
 if(t.family==='harvest')assert.ok(d.elements.some(e=>e.type==='round'&&e.color===t.bg));
 }
});
