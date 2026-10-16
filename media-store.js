// Files stay in this origin's IndexedDB. Project JSON contains references only.
const MotionMediaStore = (() => {
  let databasePromise; const urls = new Map();
  function failure(error) { return Error(error?.name === 'QuotaExceededError' ? 'Device storage is full. The file was not attached. Free space or choose a smaller file.' : error?.message || 'Local media storage is unavailable. Keep your original files and try another browser.'); }
  function open() {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      let request, finished = false; const timer = setTimeout(() => finish(Error('Media storage is busy. Close other OpenCanvas tabs and try again.')), 12000);
      function finish(error, db) { if (finished) { db?.close(); return; } finished = true; clearTimeout(timer); error ? reject(failure(error)) : resolve(db); }
      try { request = indexedDB.open('opencanvas-local-media', 1); } catch (error) { finish(error); return; }
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('files')) request.result.createObjectStore('files', { keyPath: 'id' }); };
      request.onerror = () => finish(request.error);
      request.onblocked = () => finish(Error('Media storage is blocked by another tab. Close it and retry.'));
      request.onsuccess = () => { const db = request.result; db.onversionchange = () => { db.close(); databasePromise = null; }; finish(null, db); };
    }).catch(error => { databasePromise = null; throw error; });
    return databasePromise;
  }
  async function request(mode, action) {
    const db = await open();
    return new Promise((resolve, reject) => {
      let result, tx; try { tx = db.transaction('files', mode); const query = action(tx.objectStore('files')); query.onsuccess = () => { result = query.result; }; } catch (error) { reject(failure(error)); return; }
      const timer = setTimeout(() => { try { tx.abort(); } catch {} reject(Error('Media storage took too long. Retry with a smaller file.')); }, 20000);
      tx.oncomplete = () => { clearTimeout(timer); resolve(result); }; tx.onabort = tx.onerror = () => { clearTimeout(timer); reject(failure(tx.error)); };
    });
  }
  async function get(id) {
    motionMediaRef(id); const row = await request('readonly', store => store.get(id)); if (!row) return null;
    const metadata = motionMediaMetadata(row);
    if (!(row.blob instanceof Blob) || row.blob.size !== metadata.size || row.blob.type !== metadata.mime) throw Error('This saved media is incomplete. Relink the original file.');
    return { ...metadata, blob: row.blob };
  }
  async function put(file, details) {
    if (!(file instanceof Blob)) throw Error('Choose a local media file.');
    const metadata = motionMediaMetadata({ ...details, id: 'media_' + crypto.randomUUID(), name: file.name, mime: file.type, size: file.size, createdAt: Date.now() });
    await request('readwrite', store => store.add({ ...metadata, blob: file }));
    const saved = await get(metadata.id); if (!saved || saved.size !== file.size) throw Error('The media file could not be verified. It was not attached.');
    return metadata;
  }
  async function getURL(id) {
    const row = await get(id); if (!row) throw Error('A saved media file is missing on this device. Relink the original file in Motion.');
    let entry = urls.get(id); if (!entry) { entry = { url: URL.createObjectURL(row.blob), users: 0 }; urls.set(id, entry); }
    entry.users++; let released = false; const { blob, ...metadata } = row;
    return { ...metadata, url: entry.url, release() { if (released) return; released = true; if (--entry.users === 0) { URL.revokeObjectURL(entry.url); if (urls.get(id) === entry) urls.delete(id); } } };
  }
  async function metadata(id) { const row = await get(id); if (!row) throw Error('A saved media file is missing on this device. Relink the original file in Motion.'); const { blob, ...details } = row; return details; }
  async function list() { return (await request('readonly', store => store.getAll())).map(row => motionMediaMetadata(row)); }
  // Existing playback leases remain valid until their media elements stop.
  async function remove(id) { motionMediaRef(id); await request('readwrite', store => store.delete(id)); }
  return { put, get, getURL, metadata, list, remove };
})();
