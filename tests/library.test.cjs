const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const info=JSON.parse(fs.readFileSync('assets/open-library/manifest.json')).assets;
const c={URL,uid:()=>crypto.randomUUID(),clone:structuredClone,fonts:['Arial','Anton','Bebas Neue','DM Sans','Cormorant Garamond'],openLibraryInfo:info};vm.createContext(c);
const html=fs.readFileSync('dist/index.html','utf8');
for(const f of ['type-core.js','pages-core.js','context-core.js','studio-plus-core.js','library-briefs.js','library-art-direction.js','library-layouts.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);
vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
vm.runInContext(fs.readFileSync('studio-plus-storage.js','utf8').split('let plusDB')[0],c);
vm.runInContext('this.items=libraryTemplates;this.topics=libraryTopics;',c);
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',assets=Object.fromEntries(info.map(a=>[a.id,png]));
test('every creative category and Community receive 104 new editable compositions',()=>{
 assert.equal(c.topics.length,25);assert.equal(c.items.length,2704);assert.equal(new Set(c.items.map(t=>t.id)).size,2704);
 for(const topic of [...c.topics.map(t=>t.topic),'Community']){const items=c.items.filter(t=>t.topic===topic);assert.equal(items.length,104,topic);assert.equal(new Set(items.map(t=>t.name)).size,104);assert.equal(new Set(items.map(t=>t.layoutName)).size,26);for(let b=0;b<26;b++){const variants=items.filter(t=>t.briefIndex===b);assert.equal(variants.length,4);assert.equal(new Set(variants.map(t=>t.family)).size,4,'four actual compositions for '+topic+' '+b);}}
});
test('library designs preserve editable text, bounded layers and image provenance through save/load',()=>{
 for(const t of c.items){const raw=c.makeLibraryDesign(t,assets,info),saved=c.validateDesign(raw),again=c.validateDesign(JSON.parse(JSON.stringify(saved)));assert.equal(JSON.stringify(saved),JSON.stringify(again),t.id);assert.ok(saved.elements.filter(e=>e.type==='text').length>=4,t.id);assert.ok(saved.elements.length<180,t.id);assert.equal(new Set(saved.elements.map(e=>e.id)).size,saved.elements.length);
  for(const detail of t.brief.details)assert.ok(saved.elements.some(e=>e.type==='text'&&e.text.includes(detail)),t.id+' retains '+detail);
  for(const e of saved.elements){const b=c.plusBounds([e]);assert.ok(b.x>=-.01&&b.y>=-.01&&b.x+b.w<=1080+.01&&b.y+b.h<=1350+.01,t.id+' bounds '+(e.text||e.type)+' '+JSON.stringify(b));if(e.type==='image'){assert.equal(e.photoCrop.zoom,1);assert.match(e.altText,/https:\/\/commons.wikimedia.org\//);}}
  const required=raw.elements.filter(e=>e.type==='image'&&e.altText.includes('CC BY'));if(required.length)assert.ok(saved.elements.some(e=>e.type==='text'&&e.text.includes('credits.html#')),t.id+' credit survives flat exports');
 }
});
test('animal notices keep one identity and do not use a photo of the wrong species',()=>{
 const mock=[{id:'cat',topics:['Pets'],title:'Cat portrait',tags:['cat']},{id:'dog-a',topics:['Pets'],title:'Dog portrait',tags:['dog']},{id:'dog-b',topics:['Pets'],title:'Dog portrait',tags:['dog']}];
 for(const title of ['Find Our Friend','Adopt A Dog','Lost Dog']){const ids=c.librarySelectAssets('Pets',{title,subtitle:'Your dog',visual:'dog portrait',tags:['dog']},0,mock);assert.equal(ids.length,1);assert.ok(ids[0].startsWith('dog'));}
 assert.deepEqual([...c.librarySelectAssets('Pets',{title:'Missing Cat',subtitle:'',visual:'cat portrait',tags:['cat']},0,mock)],['cat']);
 assert.equal(c.librarySelectAssets('Pets',{title:'Missing Rabbit',visual:'rabbit',tags:['rabbit']},0,mock).length,0);
});
test('library uses locally shipped artwork with complete verified license records',()=>{
 assert.ok(info.length>=60);assert.equal(new Set(info.map(a=>a.id)).size,info.length);
 for(const a of info){assert.match(a.path,/^assets\/open-library\/[\w-]+\.webp$/);assert.ok(fs.statSync(a.path).size>100);assert.ok(a.creator&&a.title&&a.sourcePageId);assert.match(a.sourceUrl,/^https:\/\/commons.wikimedia.org\/wiki\/File:/);assert.ok(['CC0','Public domain','CC BY 4.0','CC BY 3.0','CC BY 2.0','CC BY 2.5'].includes(a.license),a.license);assert.match(a.licenseUrl,/^https?:\/\//);}
 const invalid=c.makeLibraryDesign(c.items.find(t=>t.assetIds.length),Object.fromEntries(info.map(a=>[a.id,'https://example.com/untrusted.jpg'])),info);assert.ok(invalid.elements.every(e=>e.type!=='image'));
});

test('category discovery separates alternate briefs and layout families without dropping designs or shifting pages',()=>{
 const source=fs.readFileSync('library-tools.js','utf8'),sandbox={categoryFeature:(items,topic)=>topic==='Gaming'?[...items].reverse():[...items]};vm.createContext(sandbox);
 vm.runInContext(source.slice(source.indexOf('const libraryFreshCache='),source.indexOf('const libraryFeatureHomeBase=')),sandbox);
 for(const topic of ['Pets','Crafts','Photography','Technology']){
  const originals=c.items.filter(t=>t.topic===topic),older=[{id:'legacy-'+topic,name:'Earlier design',collection:'original'}],input=[...originals,...older],ordered=sandbox.categoryFeature(input,topic),fresh=ordered.filter(t=>t.collection==='open-library');
  assert.equal(ordered.length,input.length,topic+' count');assert.deepEqual([...ordered.map(t=>t.id)].sort(),input.map(t=>t.id).sort(),topic+' every design appears once');
  for(let round=0;round<4;round++)assert.equal(new Set(fresh.slice(round*26,round*26+26).map(t=>t.title)).size,26,topic+' distinct briefs in round '+round);
  assert.ok(fresh.slice(1).every((t,i)=>t.layoutName!==fresh[i].layoutName),topic+' adjacent layouts differ');
  const firstPage=[...ordered.slice(0,24).map(t=>t.id)],secondPage=sandbox.categoryFeature(input,topic).slice(24,48).map(t=>t.id);ordered.reverse();assert.deepEqual([...sandbox.categoryFeature(input,topic).slice(0,24).map(t=>t.id)],firstPage,topic+' cached order cannot be mutated');assert.equal(new Set([...firstPage,...secondPage]).size,48,topic+' stable pagination');
 }
 const gaming=c.items.filter(t=>t.topic==='Gaming');assert.deepEqual([...sandbox.categoryFeature(gaming,'Gaming').map(t=>t.id)],[...gaming.map(t=>t.id)].reverse(),'Gaming curated lead preserved');
});
