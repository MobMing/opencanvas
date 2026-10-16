const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({});
vm.runInContext(read('library-briefs.js') + '\n' + read('library-art-direction.js'), context);
const topics = JSON.parse(JSON.stringify(vm.runInContext('libraryTopics', context)));
const directions = JSON.parse(JSON.stringify(vm.runInContext('libraryArtDirections', context)));
const choose = (topic, brief) => context.libraryDirectedAssets(topic, brief);
const manifest = JSON.parse(read('assets/open-library/manifest.json'));
const assets = new Map(manifest.assets.map(asset => [asset.id, asset]));
const communityTitles = Array.from(vm.runInNewContext(read('library-layouts.js').match(/const libraryCommunityTitles=(\[[^;]+);/)[1]));

test('every category has intentional photo direction, including Community', () => {
 assert.deepEqual(Object.keys(directions).sort(), [...topics.map(t => t.topic), 'Community'].sort());
 for (const topic of topics) {
  const allowed = new Set(topic.briefs.flatMap(b => [b.title, b.visual]));
  for (const key of Object.keys(directions[topic.topic])) {
   assert.ok(allowed.has(key), `${topic.topic}: unused or misspelled brief key ${key}`);
  }
  assert.ok(topic.briefs.filter(b => choose(topic.topic, b)?.length).length >= 5, topic.topic);
 }
 assert.deepEqual(Object.keys(directions.Community).sort(), communityTitles.sort());
});

test('every suggested photograph exists locally with source and license attribution', () => {
 let used = new Set();
 for (const [topic, group] of Object.entries(directions)) {
  for (const [key, ids] of Object.entries(group)) {
   assert.ok(Array.isArray(ids), `${topic} / ${key}`);
   assert.equal(new Set(ids).size, ids.length, `${topic} / ${key}: repeated candidate`);
   for (const id of ids) {
    const asset = assets.get(id);
    assert.ok(asset, `Unknown artwork ${id}`);
    assert.ok(fs.existsSync(path.join(root, asset.path)), `Missing local artwork ${id}`);
    assert.ok(asset.creator && asset.license, `Missing credit for ${id}`);
    assert.match(asset.sourceUrl, /^https:\/\//, id);
    assert.match(asset.licenseUrl, /^https?:\/\//, id);
    used.add(id);
   }
  }
 }
 assert.ok(used.size >= 80, `Only ${used.size} distinct subjects`);
 assert.ok([...used].filter(id => assets.get(id).mediaType === 'photo').length / used.size > .95);
});

test('priority categories gain semantic photo breadth instead of one generic subject', () => {
 const minimums = {
  Nonprofit: [20, 20], Celebrations: [15, 12], Marketing: [18, 18],
  Fitness: [9, 9], 'Food & Drink': [12, 8], Weddings: [20, 5],
  Pets: [20, 10], Crafts: [12, 15], Photography: [22, 35], Technology: [16, 5]
 };
 for (const [topic, [briefMinimum, subjectMinimum]] of Object.entries(minimums)) {
  const matching = topics.find(t => t.topic === topic).briefs.map(b => choose(topic, b) || []);
  assert.ok(matching.filter(ids => ids.length).length >= briefMinimum, `${topic}: too few photo briefs`);
  assert.ok(new Set(matching.flat()).size >= subjectMinimum, `${topic}: insufficient subject variety`);
 }
});

test('pet photographs preserve species and unsupported animal ages stay unillustrated', () => {
 const bySpecies = {
  dog: new Set(['labrador-closeup', 'dog-budapest', 'shiba-yawning', 'shiba-window']),
  cat: new Set(['tabby-blue-eyes', 'cat-in-grass']),
  rabbit: new Set(['bunny-basket', 'mini-rabbit']),
  bird: new Set(['yellow-budgie']), fish: new Set(['goldfish']),
  hamster: new Set(), reptile: new Set(), puppy: new Set(), carrier: new Set()
 };
 const pets = topics.find(t => t.topic === 'Pets').briefs;
 for (const brief of pets) {
  const allowed = bySpecies[brief.visual];
  if (!allowed) continue;
  for (const id of choose('Pets', brief) || []) {
   assert.ok(allowed.has(id), `${brief.title}: ${id} does not represent ${brief.visual}`);
  }
 }
 for (const title of ['Small Pet Care', 'Senior Companions', 'Puppy Class', 'Reptile Room', 'Pet Travel Notes']) {
  assert.equal(choose('Pets', pets.find(b => b.title === title)).length, 0, title);
 }
});

test('craft material choices use the actual medium rather than unrelated stock imagery', () => {
 const required = {
  pottery: ['craft-ceramics', 'pottery-jugs', 'ceramic-bowl'],
  weaving: ['weaving-loom'], embroidery: ['embroidery-floss', 'grey-yarns'],
  knitting: ['knitting-yarn', 'orange-yarn', 'wool-bobbins'], leather: ['leather-craft'],
  wood: ['wood-carving', 'woodwork-apron', 'woodwork-shop']
 };
 for (const [medium, expected] of Object.entries(required)) {
  assert.deepEqual(Array.from(choose('Crafts', { title: '', visual: medium })), expected);
 }
 const wildlife = topics.find(t => t.topic === 'Photography').briefs.find(b => b.title === 'Wildlife Field Notes');
 assert.equal(choose('Photography', wildlife).length, 0, 'Companion budgie must not stand in for wild birds');
});

test('specific brief choices override visual fallback, including intentional empty choices', () => {
 assert.equal(choose('Unknown category', { title: 'Unknown', visual: 'dog' }), undefined);
 assert.equal(choose('Pets', { title: 'Unknown', visual: 'unknown' }), undefined);
 assert.equal(choose('Pets', { title: 'Senior Companions', visual: 'dog' }).length, 0);
 assert.deepEqual(Array.from(choose('Pets', { title: 'Cat Adoption', visual: 'dog' })), ['tabby-blue-eyes', 'cat-in-grass']);
 const choice = choose('Pets', { title: 'Adopt A Dog', visual: 'dog' });
 choice.length = 0;
 assert.equal(choose('Pets', { title: 'Adopt A Dog', visual: 'dog' }).length, 4, 'Callers must not mutate shared selections');
});
