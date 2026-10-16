/* The model is optional: no cutout runtime or model bytes load until this is called. */
function plusStartPersonCutout(imageData, onProgress = () => {}) {
  let worker, settled = false, timer, resolveResult, rejectResult;
  const result = new Promise((resolve, reject) => { resolveResult = resolve; rejectResult = reject; });
  const finish = (error, value) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    worker?.terminate();
    if (error) rejectResult(error); else resolveResult(value);
  };
  try {
    if (typeof Worker !== 'function' || typeof OffscreenCanvas !== 'function' || typeof WebAssembly !== 'object') throw Error('Automatic person cutout needs a recent browser with canvas worker support. You can still use the erase and restore brushes.');
    worker = new Worker(new URL('cutout/worker.js?v=1', document.baseURI));
    worker.onmessage = ({ data }) => {
      if (settled) return;
      if (data.type === 'progress') onProgress(data);
      else if (data.type === 'result') finish(null, data);
      else if (data.type === 'error') finish(Error(data.message || 'Automatic cutout failed. The photo has not changed.'));
    };
    worker.onerror = () => finish(Error('The cutout tool could not start. Check your connection, try again, or use the erase and restore brushes.'));
    timer = setTimeout(() => finish(Error('The cutout tool took too long. Your photo is unchanged. Try again with a stable connection.')), 180000);
    // Transfer a copy so cancellation never consumes the editor's original pixels.
    const pixels = new Uint8ClampedArray(imageData.data);
    worker.postMessage({ width: imageData.width, height: imageData.height, pixels }, [pixels.buffer]);
  } catch (error) { finish(error); }
  return { result, cancel() { const error = Error('Cutout cancelled. Your photo is unchanged.'); error.name = 'AbortError'; finish(error); } };
}

function plusBindPersonCutout(state, preview, remember) {
  const start = $('#plusAutoCutout'), cancel = $('#plusAutoCutoutCancel'), status = $('#plusAutoCutoutStatus'), progress = $('#plusAutoCutoutProgress');
  const edge = $('#plusAutoCutoutEdge'), softness = $('#plusAutoCutoutSoftness');
  const current = () => plusPhotoState === state && plusSection === 'Photo' && $('#plusDialog').open && design.id === state.projectId;
  const controls = ['plusPhotoLayer', 'plusPhotoApply', 'plusPhotoReplace', 'plusMaskUndo', 'plusMaskRemove', 'plusMaskFeather', 'plusBrush', 'plusBrushSize'];
  const busy = active => {
    if (!current()) return;
    start.disabled = active; cancel.hidden = !active; cancel.style.display = active ? '' : 'none';
    for (const id of controls) if ($('#' + id)) $('#' + id).disabled = active;
    $('#plusMask').style.pointerEvents = active ? 'none' : '';
    edge.disabled = softness.disabled = active || !state.autoMask;
    progress.hidden = !active;
  };
  const paintResult = () => {
    if (!state.autoMask || !current()) return;
    const mask = state.autoMask;
    const applied = OpenCanvasCutoutCore.applyPersonMask(mask.source.data, state.raw.width, state.raw.height, mask.confidence, mask.width, mask.height, Number(edge.value), Number(softness.value));
    state.raw.getContext('2d').putImageData(new ImageData(applied.pixels, state.raw.width, state.raw.height), 0, 0);
    state.dirty = true; preview();
  };
  start.onclick = async () => {
    if (state.autoJob || !current()) return;
    let source;
    try { source = state.raw.getContext('2d').getImageData(0, 0, state.raw.width, state.raw.height); }
    catch { status.textContent = 'This photo cannot be processed. Download it and upload a local PNG, JPEG or WebP, then try again.'; return; }
    const job = plusStartPersonCutout(source, update => {
      if (!current()) { job.cancel(); return; }
      status.textContent = update.message;
      if (Number.isFinite(update.total) && update.total > 0) { progress.max = update.total; progress.value = update.loaded; }
      else progress.removeAttribute('value');
    });
    state.autoJob = job; busy(true); status.textContent = 'Loading person cutout tools…'; progress.removeAttribute('value');
    try {
      const mask = await job.result;
      if (!current()) return;
      // Validate before taking an undo snapshot or changing any editor pixels.
      OpenCanvasCutoutCore.applyPersonMask(source.data, state.raw.width, state.raw.height, mask.confidence, mask.width, mask.height);
      remember();
      state.autoMask = { ...mask, source };
      edge.value = '.5'; softness.value = '.15'; paintResult();
      status.textContent = 'Person cutout ready. Adjust the edge or refine with the brushes, then apply your photo changes.';
    } catch (error) { if (current()) status.textContent = error.message; }
    finally { state.autoJob = null; busy(false); }
  };
  cancel.onclick = () => state.autoJob?.cancel();
  edge.oninput = softness.oninput = () => { if (!state.autoMask || !current()) return; remember(true); paintResult(); };
  busy(false);
}
