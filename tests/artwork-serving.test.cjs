const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const bundles = [...html.matchAll(/<script\b([^>]*)\bsrc="(artwork-[^"]+)"([^>]*)><\/script>/g)]
  .map(match => ({tag: match[0], attributes: match[1] + match[3], url: match[2], index: match.index}));
const collections = [
  ['people', 'promoAssets', 'assets/people/PROVENANCE.json', 'image/jpeg'],
  ['atelier', 'atelierAssets', 'assets/atelier/PROVENANCE.json', 'image/webp'],
  ['gaming', 'gamingAssets', 'assets/gaming/PROVENANCE.json', 'image/webp'],
  ['library', 'openLibraryAssets', 'assets/open-library/manifest.json', 'image/webp'],
  ['signal', 'signalArtworkAssets', 'assets/signal/PROVENANCE.json', 'image/webp'],
];

test('artwork bundles load synchronously before their consumers with content-based cache keys', () => {
  assert.ok(bundles.length >= collections.length, 'every artwork collection needs an emitted bundle');
  const promoStart = html.indexOf('<!-- PROMO START -->');
  const promoEnd = html.indexOf('<!-- PROMO END -->');
  const consumerStart = html.indexOf('<script>', promoStart);
  assert.ok(promoStart >= 0 && consumerStart > promoStart && promoEnd > consumerStart);
  assert.ok(html.slice(consumerStart, promoEnd).includes('openLibraryAssets'), 'the checked block must contain artwork consumers');
  const filenames = bundles.map(bundle => bundle.url.split('?')[0]);
  assert.equal(new Set(filenames).size, filenames.length, 'a script must not load twice');
  assert.deepEqual([...filenames].sort(), fs.readdirSync(dist).filter(name => /^artwork-.*\.js$/.test(name)).sort(), 'all emitted artwork files must be referenced');
  for (const bundle of bundles) {
    assert.ok(bundle.index > promoStart && bundle.index < consumerStart, bundle.url + ' must precede the consumer script');
    assert.doesNotMatch(bundle.attributes, /\b(?:async|defer|type)\b/i, bundle.url + ' must remain a synchronous classic script');
    const match = /^(artwork-[a-z]+-\d+\.js)\?v=([a-f0-9]{12})$/.exec(bundle.url);
    assert.ok(match, bundle.url + ' needs a local filename and content hash');
    const bytes = fs.readFileSync(path.join(dist, match[1]));
    assert.ok(bytes.length > 0 && bytes.length <= 8_100_000, match[1] + ' exceeds the upload budget');
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12), match[2], match[1] + ' cache key is stale');
  }
});

test('all classic artwork scripts execute in page order without duplicate assignments or missing original images', () => {
  const assigned = new WeakMap();
  const context = vm.createContext({Object: {assign(target, source) {
    const seen = assigned.get(target) || new Set();
    for (const id of Object.keys(source)) {
      assert.ok(!seen.has(id), id + ' is assigned by more than one artwork chunk');
      seen.add(id);
    }
    assigned.set(target, seen);
    return Object.assign(target, source);
  }}});
  for (const bundle of bundles) {
    const filename = bundle.url.split('?')[0];
    vm.runInContext(fs.readFileSync(path.join(dist, filename), 'utf8'), context, {filename});
  }
  const loaded = vm.runInContext('({promoAssets,atelierAssets,gamingAssets,openLibraryAssets,signalArtworkAssets})', context);
  for (const [name, variable, manifestPath, mime] of collections) {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, manifestPath), 'utf8')).assets;
    const ids = manifest.map(asset => asset.id);
    assert.equal(new Set(ids).size, ids.length, name + ' manifest contains duplicate IDs');
    assert.deepEqual(Object.keys(loaded[variable]).sort(), [...ids].sort(), name + ' assets differ from their source manifest');
    assert.equal(assigned.get(loaded[variable]).size, manifest.length, name + ' assignment count');
    const collectionBundles = bundles.filter(bundle => bundle.url.startsWith('artwork-' + name + '-'));
    assert.ok(collectionBundles.length > 0, name + ' is not emitted');
    assert.deepEqual(collectionBundles.map(bundle => Number(/-(\d+)\.js/.exec(bundle.url)[1])), collectionBundles.map((_, i) => i + 1), name + ' chunks must load in sequence');
    for (const asset of manifest) {
      const src = loaded[variable][asset.id];
      const prefix = 'data:' + mime + ';base64,';
      assert.ok(typeof src === 'string' && src.startsWith(prefix), asset.id + ' has the wrong data URL type');
      const original = fs.readFileSync(path.join(root, asset.path));
      const encoded = src.slice(prefix.length);
      assert.equal(encoded, original.toString('base64'), asset.id + ' was truncated, changed, or assigned the wrong image');
      assert.deepEqual(Buffer.from(encoded, 'base64'), original, asset.id + ' must decode to the original image bytes');
    }
  }
});
