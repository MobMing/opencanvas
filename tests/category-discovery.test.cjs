const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');

function loadCategoryCatalog(){
 const c={};vm.createContext(c);
 const sources=['catalog-data.js','industry-data.js','promo-scenes.js','promo-data.js','remix-core.js','people-collection.js','studio-collection.js','reference-collection.js','city-collection.js','discovery-collection.js','wave-collection.js','flyer-collection.js','atelier-collection.js','signature-collection.js'];
 for(const file of sources)vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});
 c.openLibraryInfo=JSON.parse(fs.readFileSync('assets/open-library/manifest.json')).assets;
 vm.runInContext(fs.readFileSync('library-briefs.js','utf8'),c);
 vm.runInContext(fs.readFileSync('library-art-direction.js','utf8'),c);
 const extra=[];for(const [file,name] of [['gaming-collection.js','gamingTemplates'],['category-collection.js','categoryTemplates'],['library-layouts.js','libraryTemplates'],['signal-collection.js','signalTemplates']])if(fs.existsSync(file)){vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});extra.push(name);}
 vm.runInContext('this.collections={niche:nicheTemplates,industry:industryCollections,signature:signatureTemplates,atelier:atelierTemplates,flyer:flyerTemplates,wave:waveTemplates,crossover:crossoverTemplates,city:cityTemplates,reference:referenceTemplates,studio:studioTemplates,people:peopleTemplates,promo:promoTemplates,remix:remixTemplates'+extra.map(name=>','+name+':'+name).join('')+'};',c);
 const html=fs.readFileSync('dist/index.html','utf8'),communityJSON=html.match(/const communityTemplates=(\[[^\n]*\]);/),originalJSON=html.match(/const templates=(\[[^\n]*\]);/);
 assert.ok(communityJSON,'Community data must be included in the audit');assert.ok(originalJSON,'Original designs must be included in the audit');
 const community=JSON.parse(communityJSON[1]).map(t=>({...t,topic:'Community',collection:'community'}));
 const originals=vm.runInNewContext(originalJSON[1]).map(([id,name,category])=>({id,name,category,topic:'General',collection:'original'}));
 return {c,collections:c.collections,community,originals,all:[...Object.values(c.collections).flat(),...community,...originals],sources};
}
const catalog=loadCategoryCatalog(),c=catalog.c;

function imageIds(t){
 // Remix metadata retains an asset even in its entirely native-shape directions.
 if(t.collection==='remix'&&!t.aiImagery)return [];
 if(t.collection==='community')return [t.art,...(t.layers||[]).filter(e=>e.type==='image').map(e=>e.src)].filter(Boolean).map(src=>'embedded-'+crypto.createHash('sha256').update(src).digest('hex').slice(0,16));
 return t.assetIds?.length?[...t.assetIds]:t.asset?[t.asset]:[];
}
function layoutKey(t){
 if(t.collection==='reference')return t.layout===null?'reference:'+t.family:'studio:'+t.layout;
 if(['studio','lifestyle'].includes(t.collection))return 'studio:'+t.layout;
 if(t.collection==='remix')return 'remix:'+t.direction.id;
 if(t.collection==='community'||t.collection==='original')return t.id;
 const collection=t.collection||(t.id.startsWith('promo-')?'promo':t.id.startsWith('industry-')?'industry':'niche');
 return collection+':'+(t.layout??t.layoutName??t.id);
}
function formatName(t){return t.format||({Card:'card',Certificate:'certificate'}[t.category])||(t.width&&t.height?(t.width>t.height?'cover':t.width===t.height?'square':t.height===1920?'story':'post'):t.category.toLowerCase());}
function categoryAudit(){
 const navigationTopics=[...new Set([...Object.values(catalog.collections).flat().map(t=>t.topic),'Community'])];
 return {topicCount:navigationTopics.length,total:catalog.all.length,originalsOutsideTopicNavigation:catalog.originals.length,collections:Object.fromEntries(Object.entries(catalog.collections).map(([name,items])=>[name,items.length])),categories:navigationTopics.map(topic=>{const items=catalog.all.filter(t=>t.topic===topic);return {topic,entries:items.length,defaultConcepts:c.distinctTemplateConcepts(items).length,layoutFamilies:new Set(items.map(layoutKey)).size,imageAssets:new Set(items.flatMap(imageIds)).size,formats:[...new Set(items.map(formatName))].sort(),dimensions:[...new Set(items.filter(t=>t.width&&t.height).map(t=>t.width+'×'+t.height))].sort()};})};
}

if(process.argv.includes('--audit'))console.log(JSON.stringify(categoryAudit(),null,2));
else {
test('audit covers every navigation topic, Community, and original designs without duplicate IDs',()=>{
 const audit=categoryAudit();assert.equal(audit.topicCount,26);assert.equal(new Set(catalog.all.map(t=>t.id)).size,catalog.all.length);
 assert.equal(audit.categories.reduce((n,row)=>n+row.entries,0)+audit.originalsOutsideTopicNavigation,catalog.all.length);
 for(const row of audit.categories){assert.ok(row.entries>0,row.topic);assert.ok(row.defaultConcepts>0&&row.defaultConcepts<=row.entries,row.topic);assert.ok(row.layoutFamilies>0,row.topic);assert.ok(row.formats.length>0,row.topic);}
 assert.equal(audit.categories.find(r=>r.topic==='Community').entries,catalog.community.length+catalog.collections.libraryTemplates.filter(t=>t.topic==='Community').length);
});

test('Reference variants group consistently across all topics while photographs and real calendar months remain',()=>{
 const items=catalog.collections.reference,grouped=c.distinctTemplateConcepts(items),before=JSON.stringify(items);
 assert.equal(items.length,240);assert.equal(grouped.length,58);
 assert.equal(grouped.filter(t=>t.topic==='Gaming').length,2,'Twelve board-game palettes and twelve broadcast palettes represent two compositions');
 assert.equal(grouped.filter(t=>t.family==='calendar').length,12,'Each calendar month has different useful dates');
 for(const family of new Set(items.map(t=>t.family))){
  const familyItems=items.filter(t=>t.family===family),shown=grouped.filter(t=>t.family===family);
  const expected=family==='calendar'?12:new Set(familyItems.map(t=>JSON.stringify(t.assetIds))).size;
  assert.equal(shown.length,expected,family);assert.deepEqual(new Set(shown.flatMap(t=>t.assetIds)),new Set(familyItems.flatMap(t=>t.assetIds)),family+' must retain its different pictures');
 }
 assert.equal(JSON.stringify(items),before);assert.ok(grouped.every(t=>items.includes(t)));assert.deepEqual(c.distinctTemplateConcepts(items).map(t=>t.id),grouped.map(t=>t.id));
});

test('a title or palette search can recover every Reference variant after default grouping',()=>{
 const items=catalog.collections.reference;
 for(const t of items){const matches=c.promoFilter(items,{query:t.name,topic:t.topic}),result=c.distinctTemplateConcepts(matches);assert.ok(result.some(x=>x.id===t.id),t.id+' is hidden by grouping');assert.ok(result.every(x=>c.matchesCatalog(x,t.name)&&x.topic===t.topic));}
 for(const style of new Set(items.map(t=>t.style)))for(const format of new Set(items.map(t=>t.format))){
  const matches=c.promoFilter(items,{style,format}),result=c.distinctTemplateConcepts(matches);assert.equal(!!result.length,!!matches.length);assert.ok(result.every(t=>t.style===style&&t.format===format));
 }
});

test('grouping preserves individually composed collections, topic boundaries, photo combinations and unknown future collections',()=>{
 const independent=Object.entries(catalog.collections).filter(([name])=>!['reference','promo','remix'].includes(name)).flatMap(([,items])=>items);
 assert.equal(c.distinctTemplateConcepts(independent).length,independent.length);
 const sample={id:'ref-a',collection:'reference',family:'portrait',topic:'Fashion',assetIds:['photo-a','photo-b']};
 const items=[sample,{...sample,id:'ref-palette',style:'Retro'},{...sample,id:'ref-other-topic',topic:'Photography'},{...sample,id:'ref-other-photo',assetIds:['photo-a','photo-c']},{...sample,id:'ref-photo-order',assetIds:['photo-b','photo-a']},{id:'new-a',collection:'future',layoutName:'Portrait'},{id:'new-b',collection:'future',layoutName:'Portrait'}];
 assert.deepEqual(Array.from(c.distinctTemplateConcepts(items),t=>t.id),['ref-a','ref-other-topic','ref-other-photo','ref-photo-order','new-a','new-b']);
 assert.equal(c.distinctTemplateConcepts(catalog.community).length,catalog.community.length);assert.equal(c.distinctTemplateConcepts(catalog.originals).length,catalog.originals.length);
});

test('real gallery selection filters before grouping and Show all variations preserves the matching catalog',()=>{
 const source=fs.readFileSync('promo-tools.js','utf8'),pipeline=source.split('\n').find(line=>line.includes('const matches=promoFilter(ordered,'));assert.ok(pipeline,'Execute the actual gallery filtering pipeline');
 const helpers=source.slice(0,source.indexOf('// END PURE GALLERY HELPERS'));vm.runInContext(helpers,c);
 Object.assign(c,{ordered:catalog.all,hubQuery:'',hubStyle:'All styles',promoFormat:'all',promoPeople:false,promoImagery:'all',promoLayout:'all',promoCollection:'all',promoSavedOnly:false,promoLimit:10000,topic:'Gaming',promoVariants:false});
 const run=()=>{vm.runInContext('{'+pipeline+';this.auditSelected=list;} ',c);return [...c.auditSelected];};
 const before=JSON.stringify(catalog.all),grouped=run(),raw=catalog.all.filter(t=>t.topic==='Gaming');
 assert.ok(grouped.length<raw.length);assert.ok(grouped.every(t=>t.topic==='Gaming'));
 c.promoVariants=true;assert.deepEqual(new Set(run().map(t=>t.id)),new Set(raw.map(t=>t.id)));
 c.promoVariants=false;c.hubQuery='PRESS START';const narrow=run();assert.ok(narrow.some(t=>t.id==='reference-glitch-12'));assert.ok(narrow.every(t=>c.matchesCatalog(t,'PRESS START')));
 c.topic='Education';c.hubQuery='FEBRUARY 2027';assert.ok(run().some(t=>t.id==='reference-calendar-02'));
 c.topic='Gaming';c.hubQuery='';c.promoFormat='cover';assert.ok(run().length);assert.ok(run().every(t=>t.format==='cover'));
 assert.equal(JSON.stringify(catalog.all),before);
});
}
