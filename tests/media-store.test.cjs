const test = require('node:test'), assert = require('node:assert/strict'), vm = require('node:vm'), fs = require('node:fs'), crypto = require('node:crypto');
const read = file => fs.readFileSync(file, 'utf8');
function database() {
  const rows = new Map(); let quota = false, blocked = false;
  const db = { objectStoreNames: { contains: () => true }, close() {}, transaction(name, mode) {
    const tx = { error: null, objectStore() { const result = value => { const query = {}; queueMicrotask(() => { if (mode === 'readwrite' && quota) { quota = false; tx.error = Object.assign(Error('quota'), { name: 'QuotaExceededError' }); tx.onabort?.(); return; } query.result = typeof value === 'function' ? value() : value; query.onsuccess?.(); queueMicrotask(() => tx.oncomplete?.()); }); return query; }; return { get: id => result(() => structuredClone(rows.get(id))), getAll: () => result(() => [...rows.values()].map(value => structuredClone(value))), add: row => result(() => { rows.set(row.id, structuredClone(row)); return row.id; }), delete: id => result(() => rows.delete(id)) }; } }; return tx;
  } };
  return { rows, quota() { quota = true; }, block() { blocked = true; }, indexedDB: { open() { const request = {}; queueMicrotask(() => { if (blocked) { blocked = false; request.onblocked?.(); return; } request.result = db; request.onsuccess?.(); }); return request; } } };
}
function boot(memory = database()) {
  const revoked = [], context = { Blob, crypto: crypto.webcrypto, Map, Date, Promise, setTimeout, clearTimeout, indexedDB: memory.indexedDB, URL: { createObjectURL: blob => 'blob:' + blob.size + ':' + crypto.randomUUID(), revokeObjectURL: value => revoked.push(value) } }; vm.createContext(context); vm.runInContext(read('media-store-core.js') + '\n' + read('media-store.js') + '\nglobalThis.store = MotionMediaStore;', context); return { c: context, store: context.store, memory, revoked };
}
function file(kind = 'video') { const blob = new Blob(['original-media-bytes'], { type: kind + '/mp4' }); Object.defineProperty(blob, 'name', { value: 'Original.' + kind }); return blob; }
test('media bytes survive a new store session and URLs are released without deleting files', async () => {
  const first = boot(), media = await first.store.put(file(), { kind: 'video', duration: 12 }), again = boot(first.memory); assert.match(media.id, /^media_/); const saved = await again.store.get(media.id); assert.equal(await saved.blob.text(), 'original-media-bytes'); assert.equal(saved.name, 'Original.video'); const a = await again.store.getURL(media.id), b = await again.store.getURL(media.id); assert.equal(a.url, b.url); a.release(); assert.deepEqual(again.revoked, []); a.release(); assert.deepEqual(again.revoked, []); b.release(); assert.deepEqual(again.revoked, [a.url]); assert.ok(await again.store.get(media.id)); assert.equal((await again.store.list()).length, 1);
});
test('failed durable writes never return an attached reference, and missing files require relinking', async () => {
  const env = boot(); env.memory.quota(); await assert.rejects(env.store.put(file(), { kind: 'video', duration: 12 }), /storage is full/); assert.equal(env.memory.rows.size, 0); const media = await env.store.put(file('audio'), { kind: 'audio', duration: 5 }); await env.store.remove(media.id); assert.equal(await env.store.get(media.id), null); await assert.rejects(env.store.getURL(media.id), /missing.*Relink/); await assert.rejects(env.store.getURL('https://untrusted.invalid/x.mp4'), /Invalid local/);
});
test('blocked database opens report errors and remain retryable', async () => { const env = boot(); env.memory.block(); await assert.rejects(env.store.list(), /blocked/); assert.equal((await env.store.list()).length, 0); });
test('stored metadata and blob mismatches are rejected; waveform peaks reflect actual samples', async () => {
  const env = boot(), media = await env.store.put(file('audio'), { kind: 'audio', duration: 5, peaks: [.1, .8] }); env.memory.rows.get(media.id).blob = new Blob(['bad'], { type: 'audio/mp4' }); await assert.rejects(env.store.get(media.id), /incomplete/); assert.deepEqual(Array.from(env.c.motionMediaPeaks([new Float32Array([.2, -.5, .8, -.9])], 2)).map(n => +n.toFixed(1)), [.5, .9]); for (const duration of [NaN, Infinity, 0, -1]) await assert.rejects(env.store.put(file(), { kind: 'video', duration }), /duration/); await assert.rejects(env.store.put(file(), { kind: 'audio', duration: 3 }), /supported audio/);
});
test('metadata browsing allocates no playback URLs, and deleting a file does not revoke active leases', async () => {
  const env=boot(),media=await env.store.put(file(),{kind:'video',duration:10});let created=0;const before=env.c.URL.createObjectURL;env.c.URL.createObjectURL=blob=>{created++;return before(blob);};
  const metadata=await env.store.metadata(media.id);await env.store.list();assert.equal(created,0);assert.equal('blob' in metadata,false);assert.equal('url' in metadata,false);
  const lease=await env.store.getURL(media.id);assert.equal(created,1);await env.store.remove(media.id);assert.equal(env.revoked.length,0);await assert.rejects(env.store.getURL(media.id),/missing/);lease.release();lease.release();assert.deepEqual(env.revoked,[lease.url]);
});
