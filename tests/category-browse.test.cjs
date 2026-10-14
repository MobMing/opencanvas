const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={};vm.createContext(c);for(const f of ['catalog-data.js','promo-scenes.js','promo-data.js','gaming-collection.js','category-collection.js','category-browse.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext('this.items=[...gamingTemplates,...categoryTemplates];this.guides=categoryGuides;',c);

test('every topic has relevant discovery guidance and suggestions backed by real matches',()=>{
 const topics=[...new Set(c.items.map(t=>t.topic))];assert.equal(topics.length,25);assert.deepEqual(new Set(Object.keys(c.guides)),new Set(topics));
 for(const topic of topics){const local=c.items.filter(t=>t.topic===topic),guide=c.categoryGuide(topic),queries=c.categorySuggestions(local,topic);assert.ok(guide[0]&&guide[1]);assert.ok(queries.length,topic+' has a useful search');assert.ok(queries.every(q=>local.some(t=>c.matchesCatalog(t,q))));}
 assert.equal(c.categorySuggestions([],'Gaming').length,0);assert.ok(c.categoryGuide('Future topic')[0]);
});

test('category curation is stable and keeps the exact filtered set without duplicates or mutation',()=>{
 for(const topic of ['Gaming','Books','Music & DJ','All topics']){const items=c.items.filter(t=>topic==='All topics'||t.topic===topic),before=JSON.stringify(items),a=c.categoryFeature(items,topic);assert.equal(JSON.stringify(items),before);assert.deepEqual(new Set(a.map(t=>t.id)),new Set(items.map(t=>t.id)));assert.equal(a.length,items.length);assert.equal(JSON.stringify(a),JSON.stringify(c.categoryFeature(items,topic)));}
 const narrowed=c.items.filter(t=>t.topic==='Gaming'&&t.format==='cover'&&c.matchesCatalog(t,'stream'));
 assert.deepEqual(new Set(c.categoryFeature(narrowed,'Gaming').map(t=>t.id)),new Set(narrowed.map(t=>t.id)));
});

test('gaming sections include each visible card once and separate portrait, landscape and square artwork',()=>{
 const items=c.items.filter(t=>t.topic==='Gaming'),sections=c.categoryGamingSections(items),flat=sections.flatMap(s=>s.items);
 assert.equal(sections.length,3);assert.equal(flat.length,items.length);assert.equal(new Set(flat.map(t=>t.id)).size,items.length);
 assert.ok(sections.find(s=>s.id==='posters').items.every(t=>t.height>t.width));assert.ok(sections.find(s=>s.id==='screens').items.every(t=>t.width>t.height));assert.ok(sections.find(s=>s.id==='social').items.every(t=>t.width===t.height));
 assert.equal(c.categoryGamingSections([]).length,0);
});

test('changing category clears incompatible collection and image filters before navigation runs',()=>{
 const source=fs.readFileSync('promo-tools.js','utf8');let click;const h={hubMode:'templates',$:()=>({addEventListener(type,fn,capture){assert.equal(type,'click');assert.equal(capture,true);click=fn;}})};vm.createContext(h);
 vm.runInContext("let promoCollection='gaming',promoImagery='People',promoLayout='custom',promoFormat='story',promoPeople=true,promoVariants=true,promoSavedOnly=true,promoLastFilter='old';"+source.slice(source.indexOf('function promoResetCategoryFilters'),source.indexOf('function promoWireMoreFilters'))+"this.state=()=>[promoCollection,promoImagery,promoLayout,promoFormat,promoPeople,promoVariants,promoSavedOnly,promoLastFilter];",h);
 click({target:{closest:()=>null}});assert.equal(h.state()[0],'gaming');click({target:{closest:()=>({})}});assert.deepEqual([...h.state()],['all','all','all','all',false,false,false,'']);
});
