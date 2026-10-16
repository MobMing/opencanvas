const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), vm = require('node:vm');
const { applyPersonMask } = require('../cutout-core.js');
const root = path.join(__dirname, '..');
test('Person mask removes the background, preserves RGB and existing transparency', () => {
  const source = new Uint8ClampedArray([100, 80, 60, 255, 50, 40, 30, 127, 10, 20, 30, 0]);
  const result = applyPersonMask(source, 3, 1, new Float32Array([0, 1, 1]), 3, 1);
  assert.deepEqual([...result.pixels], [100, 80, 60, 0, 50, 40, 30, 127, 10, 20, 30, 0]);
  assert.equal(source[3], 255, 'Source remains untouched for undo');
});
test('Mask scaling interpolates edges and respects a stronger threshold', () => {
  const source = new Uint8ClampedArray(4 * 4).fill(255), mask = new Float32Array([0, 1]);
  const soft = applyPersonMask(source, 4, 1, mask, 2, 1, .5, .4).pixels;
  assert.equal(soft[3], 0); assert.equal(soft[15], 255);
  assert(soft[7] > 0 && soft[7] < soft[11] && soft[11] < 255);
  const strong = applyPersonMask(source, 4, 1, mask, 2, 1, .8, .2).pixels;
  assert(strong[11] < soft[11]);
});
test('Invalid masks cannot silently erase a photograph', () => {
  assert.throws(() => applyPersonMask(new Uint8Array(4), 1, 1, [NaN], 1, 1), /invalid mask/);
  assert.throws(() => applyPersonMask(new Uint8Array(4), 2, 1, [1], 1, 1), /dimensions/);
});
test('Cutout assets reconstruct the pinned upstream model and WASM exactly', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/cutout/manifest.json')));
  assert.equal(manifest.runtimeVersion, '1.1.1'); assert.equal(manifest.license, 'Apache-2.0');
  for (const record of [manifest.wasm, manifest.model]) {
    const pieces = record.parts.map(p => {
      assert(p.bytes <= 4500000);
      const bytes = fs.readFileSync(path.join(root, 'assets/cutout', p.file));
      assert.equal(bytes.length, p.bytes);
      assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), p.sha256);
      return bytes;
    });
    const full = Buffer.concat(pieces);
    assert.equal(full.length, record.bytes);
    assert.equal(crypto.createHash('sha256').update(full).digest('hex'), record.sha256);
  }
});
function runner() {
  const workers = []; let timeout;
  class Worker {
    constructor(url) { this.url = url; workers.push(this); }
    postMessage(data) { this.sent = data; }
    terminate() { this.terminated = true; }
  }
  const c = { Worker, OffscreenCanvas: function(){}, WebAssembly: {}, URL, document: {baseURI:'https://example.test/opencanvas/'}, Uint8ClampedArray, setTimeout: fn => { timeout = fn; return 1; }, clearTimeout() {} };
  vm.createContext(c); vm.runInContext(fs.readFileSync(path.join(root, 'studio-plus-cutout.js'), 'utf8'), c);
  return { c, workers, timeout: () => timeout() };
}
test('Cancelling a cutout terminates work and ignores a late model result', async () => {
  const { c, workers } = runner(), photo = {data: new Uint8ClampedArray([1,2,3,255]), width:1, height:1};
  const job = c.plusStartPersonCutout(photo);
  assert.equal(workers[0].url.href, 'https://example.test/opencanvas/cutout/worker.js?v=1');
  assert.notEqual(workers[0].sent.pixels, photo.data);
  job.cancel(); workers[0].onmessage({ data: { type:'result', confidence:[1] } });
  await assert.rejects(job.result, { name: 'AbortError' }); assert.equal(workers[0].terminated, true);
});
test('Download errors and timeouts preserve the source and stop the worker', async () => {
  for (const reason of ['error', 'timeout']) {
    const r = runner(), photo = {data: new Uint8ClampedArray([1,2,3,255]), width:1, height:1};
    const job = r.c.plusStartPersonCutout(photo);
    if (reason === 'error') r.workers[0].onmessage({data:{type:'error',message:'Download failed'}}); else r.timeout();
    await assert.rejects(job.result, /failed|too long/);
    assert.equal(r.workers[0].terminated, true); assert.equal(photo.data[3], 255);
  }
});
