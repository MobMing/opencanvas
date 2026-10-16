const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
function load(){
 const source = fs.readFileSync(path.join(root,'library-briefs.js'),'utf8');
 return JSON.parse(JSON.stringify(vm.runInNewContext(source+';libraryTopics')));
}
const topics = load();
const briefs = topics.flatMap(t=>t.briefs.map(b=>({...b,topic:t.topic})));

test('library briefs cover every existing topic with 26 new use cases',()=>{
 const guides = vm.runInNewContext(fs.readFileSync(path.join(root,'category-browse.js'),'utf8')+';Object.keys(categoryGuides)');
 assert.deepEqual(topics.map(t=>t.topic).sort(),Array.from(guides).sort());
 assert.equal(topics.length,25);
 assert.equal(briefs.length,650);
 assert.equal(new Set(topics.map(t=>t.slug)).size,25);
 for(const topic of topics){
  assert.equal(topic.briefs.length,26,topic.topic);
  assert.match(topic.slug,/^[a-z]+(?:-[a-z]+)*$/);
 }
});

test('each topic has unique meaningful titles and use-case descriptions',()=>{
 for(const topic of topics){
  assert.equal(new Set(topic.briefs.map(b=>b.title.toLowerCase())).size,26,topic.topic+' titles');
  assert.equal(new Set(topic.briefs.map(b=>b.subtitle.toLowerCase())).size,26,topic.topic+' purposes');
  assert.ok(new Set(topic.briefs.map(b=>b.visual)).size>=8,topic.topic+' visual variety');
  assert.ok(new Set(topic.briefs.map(b=>b.details.join('|'))).size>=23,topic.topic+' practical detail variety');
 }
});

test('all briefs satisfy the renderer contract and contain readable short copy',()=>{
 for(const b of briefs){
  for(const key of ['title','subtitle','kicker','cta','visual'])assert.equal(typeof b[key],'string',b.title+' '+key);
  assert.ok(b.title.length>3&&b.title.length<=24,b.title);
  assert.ok(b.subtitle.length>12&&b.subtitle.length<=80,b.title+' subtitle');
  assert.equal(b.details.length,3,b.title+' details');
  for(const line of b.details)assert.ok(line.length>3&&line.length<=44,b.title+': '+line);
  assert.ok(b.cta.length>4&&b.cta.length<=42,b.title+' CTA');
  assert.match(b.visual,/^[a-z]+(?:-[a-z]+)*$/);
  assert.ok(b.tags.includes(b.visual),b.title+' imagery search');
  assert.ok(b.tags.includes(b.topic.toLowerCase()),b.title+' category search');
 }
});

test('Pets covers multiple animal types and practical services',()=>{
 const pet=topics.find(t=>t.topic==='Pets');
 const content=JSON.stringify(pet).toLowerCase();
 for(const term of ['dog','cat','rabbit','bird','fish','reptile','grooming','sitting','training','adoption','foster','portrait','missing'])assert.ok(content.includes(term),term);
});

test('Crafts covers materials and techniques beyond generic maker markets',()=>{
 const content=JSON.stringify(topics.find(t=>t.topic==='Crafts')).toLowerCase();
 for(const term of ['pottery','weaving','embroidery','knitting','leather','paper','wood','jewelry','printmaking','bookbinding','mosaic','crochet'])assert.ok(content.includes(term),term);
});

test('Photography and Technology retain specific searchable disciplines',()=>{
 const photo=JSON.stringify(topics.find(t=>t.topic==='Photography')).toLowerCase();
 for(const term of ['portrait','nature','architecture','macro','street','wedding','product','fashion','print','exhibition','film'])assert.ok(photo.includes(term),term);
 const tech=JSON.stringify(topics.find(t=>t.topic==='Technology')).toLowerCase();
 for(const term of ['cybersecurity',' ai ','developer','cloud','robot','hardware','data','no-code','accessibility','privacy','open source'])assert.ok(tech.includes(term),term);
});

test('briefs contain no fake dates, contact addresses, unfilled row syntax or imported brands',()=>{
 for(const b of briefs){
  const copy=[b.title,b.subtitle,b.kicker,...b.details,b.cta].join(' ');
  assert.doesNotMatch(copy,/\b20\d{2}\b|https?:|www\.|@|lorem ipsum|undefined|\[object Object\]|\|/i,b.title);
  assert.doesNotMatch(copy,/\b(?:canva|higgsfield|nike|adidas|playstation|xbox)\b/i,b.title);
 }
});

test('the authored catalog is deterministic and portable as plain JSON',()=>{
 assert.deepEqual(load(),topics);
 assert.deepEqual(JSON.parse(JSON.stringify(topics)),topics);
 for(const topic of topics)for(const b of topic.briefs)assert.equal(new Set(b.tags).size,b.tags.length);
});
