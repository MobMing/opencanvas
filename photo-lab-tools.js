/* Optional, local photo tools. Existing portrait and manual cutouts remain available. */
function photoLabStartSubjectCutout(imageData, point, onProgress = () => {}) {
  let worker, settled = false, timer, resolveResult, rejectResult;
  const result = new Promise((resolve, reject) => { resolveResult = resolve; rejectResult = reject; });
  const finish = (error, value) => {
    if (settled) return;
    settled = true; clearTimeout(timer); worker?.terminate();
    if (error) rejectResult(error); else resolveResult(value);
  };
  try {
    if (typeof Worker !== 'function' || typeof OffscreenCanvas !== 'function' || typeof WebAssembly !== 'object') throw Error('Subject selection needs a recent browser with canvas worker support. Manual brushes remain available.');
    worker = new Worker(new URL('photo-lab/worker.js?v=1', document.baseURI));
    worker.onmessage = ({ data }) => {
      if (settled) return;
      if (data.type === 'progress') onProgress(data);
      else if (data.type === 'result') finish(null, data);
      else if (data.type === 'error') finish(Error(data.message || 'Subject selection failed. The photo is unchanged.'));
    };
    worker.onerror = () => finish(Error('Subject selection could not start. Check your connection or use the manual brushes.'));
    timer = setTimeout(() => finish(Error('Subject selection took too long. Your photo is unchanged. Try again with a stable connection.')), 180000);
    const pixels = new Uint8ClampedArray(imageData.data);
    worker.postMessage({ width: imageData.width, height: imageData.height, pixels, point: { x: point.x, y: point.y } }, [pixels.buffer]);
  } catch (error) { finish(error); }
  return { result, cancel() { const error = Error('Subject selection cancelled. Your photo is unchanged.'); error.name = 'AbortError'; finish(error); } };
}

function photoLabEnhance(state, preview, remember) {
  const body = $('#plusBody'), mask = $('#plusMask'), raw = state.raw, original = state.original;
  const current = () => plusPhotoState === state && plusSection === 'Photo' && $('#plusDialog').open && design.id === state.projectId;
  const context = () => raw.getContext('2d', { willReadFrequently: true });
  const pixels = () => context().getImageData(0, 0, raw.width, raw.height);
  const lab = state.lab = { armed: null, sample: null, stroke: null, selectionSource: null, background: null, pending: null, backgroundRequest: 0 };
  const selection = document.createElement('section');
  selection.className = 'plus-card'; selection.id = 'photoLabSelection';
  selection.innerHTML = '<h3>Select any subject</h3><p class="plus-note">Click inside a pet, product or person to keep it and remove its surroundings. Google Magic Touch runs on this device. About 44 MB downloads on first use; photos stay here. Small details may need brush cleanup.</p><div class="plus-row"><button class="btn primary" id="photoLabSelect">Select a subject</button><button class="btn" id="photoLabCancel" style="display:none">Cancel selection</button></div><progress id="photoLabProgress" hidden aria-label="Subject tool download"></progress><p id="photoLabStatus" class="plus-note" role="status" aria-live="polite"></p>';
  mask.closest('.plus-card').insertBefore(selection, mask.closest('.plus-card').firstChild);
  const retouch = document.createElement('section');
  retouch.className = 'plus-card'; retouch.id = 'photoLabRetouch';
  retouch.innerHTML = '<h3>Clone &amp; blend</h3><p class="plus-note">Cover a small unwanted object using nearby texture. Choose a clean sample in the photo above, then brush over the area. This copies pixels with soft edges; it does not invent missing detail.</p><div class="plus-row"><button class="btn" id="photoLabSample">Choose sample point</button><button class="btn" id="photoLabReset">Reset photo edits</button></div><label class="field">Blend strength<input id="photoLabStrength" type="range" min="20" max="100" value="100"></label><p id="photoLabRetouchStatus" class="plus-note" role="status" aria-live="polite">Use the brush size above to control the area.</p>';
  mask.closest('.plus-card').append(retouch);
  $('#plusBrush').insertAdjacentHTML('beforeend', '<option value="clone">Clone &amp; blend</option>');
  const backgrounds = document.createElement('section');
  backgrounds.className = 'plus-card'; backgrounds.id = 'photoLabBackgrounds';
  backgrounds.innerHTML = '<h3>Replace the background</h3><p class="plus-note">Make a cutout first, then preview a new background. Using a background combines it with the cutout; Undo photo edit brings the cutout back.</p><label class="field">Background style<select id="photoLabBackgroundMode"><option value="solid">Solid color</option><option value="image">Your own photo</option><option value="blur">Blur the original scene</option></select></label><label class="field" id="photoLabColorField">Background color<input id="photoLabColor" type="color" value="#efeae2"></label><label class="field" id="photoLabUploadField" style="display:none">Background photo<input id="photoLabUpload" type="file" accept="image/png,image/jpeg,image/webp"></label><label class="field" id="photoLabBlurField" style="display:none">Background blur<input id="photoLabBlur" type="range" min="4" max="45" value="18"></label><button class="btn" id="photoLabPreview">Preview background</button><p id="photoLabBackgroundStatus" class="plus-note" role="status" aria-live="polite"></p><div id="photoLabBackgroundPreview" style="display:none"><div class="plus-preview"><canvas id="photoLabBackgroundCanvas" aria-label="New background preview"></canvas></div><div class="plus-row"><button class="btn primary" id="photoLabUseBackground">Use this background</button><button class="btn" id="photoLabDiscardBackground">Discard preview</button></div></div>';
  body.append(backgrounds);
  const status = message => { if (current()) $('#photoLabStatus').textContent = message; };
  const retouchStatus = message => { if (current()) $('#photoLabRetouchStatus').textContent = message; };
  const backgroundStatus = message => { if (current()) $('#photoLabBackgroundStatus').textContent = message; };
  const discard = () => { lab.pending = null; $('#photoLabBackgroundPreview').style.display = 'none'; };
  const disarm = () => { lab.armed = null; mask.style.cursor = ''; $('#photoLabSelect').textContent = 'Select a subject'; $('#photoLabSample').textContent = 'Choose sample point'; };
  const controls = () => [...body.querySelectorAll('button,input,select')].filter(e => !['photoLabCancel','plusAutoCutoutCancel'].includes(e.id));
  let disabledBefore = [];
  const busy = active => {
    if (!current()) return;
    if (active) { disabledBefore = controls().map(element => [element, element.disabled]); disabledBefore.forEach(([element]) => element.disabled = true); }
    else { disabledBefore.forEach(([element, disabled]) => element.disabled = disabled); disabledBefore = []; $('#plusAutoCutoutEdge').disabled = $('#plusAutoCutoutSoftness').disabled = !state.autoMask; }
    mask.style.pointerEvents = active ? 'none' : '';
    $('#photoLabCancel').style.display = active ? '' : 'none'; $('#photoLabProgress').hidden = !active;
  };
  const applySubject = async point => {
    if (state.autoJob || !current()) return;
    let source;
    try { source = pixels(); } catch { status('This photo cannot be processed. Upload a local PNG, JPEG or WebP and retry.'); return; }
    disarm(); discard();
    const job = photoLabStartSubjectCutout(source, point, update => {
      if (!current()) { job.cancel(); return; }
      status(update.message); const progress = $('#photoLabProgress');
      if (Number.isFinite(update.total) && update.total > 0) { progress.max = update.total; progress.value = update.loaded; } else progress.removeAttribute('value');
    });
    state.autoJob = job; busy(true); status('Loading subject selection tools…'); $('#photoLabProgress').removeAttribute('value');
    try {
      const result = await job.result; if (!current()) return;
      const applied = OpenCanvasCutoutCore.applyPersonMask(source.data, raw.width, raw.height, result.confidence, result.width, result.height);
      remember(); lab.selectionSource = source; state.autoMask = { ...result, source };
      context().putImageData(new ImageData(applied.pixels, raw.width, raw.height), 0, 0);
      $('#plusAutoCutoutEdge').value = '.5'; $('#plusAutoCutoutSoftness').value = '.15'; preview();
      status('Subject cutout ready. Adjust Edge strength or Edge softness above the brushes. Refine details, replace the background, then apply your photo changes.');
    } catch (error) { status(error.message); }
    finally { state.autoJob = null; busy(false); }
  };
  $('#photoLabSelect').onclick = () => {
    if (state.autoJob) return;
    if (lab.armed === 'subject') { disarm(); status('Selection stopped. Your photo is unchanged.'); return; }
    disarm(); lab.armed = 'subject'; mask.style.cursor = 'crosshair'; $('#photoLabSelect').textContent = 'Stop selecting';
    status('Click inside the subject on the editing photo below. A point near the center usually works best.'); mask.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  $('#photoLabCancel').onclick = () => state.autoJob?.cancel();
  $('#photoLabSample').onclick = () => {
    if (state.autoJob) return;
    if (lab.armed === 'sample') { disarm(); retouchStatus('Sample selection stopped.'); return; }
    disarm(); lab.armed = 'sample'; mask.style.cursor = 'crosshair'; $('#photoLabSample').textContent = 'Stop choosing';
    retouchStatus('Click a clean area on the editing photo, then brush over the object you want to cover.'); mask.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  const position = event => { const bounds = mask.getBoundingClientRect(); return { x: Math.max(0, Math.min(raw.width - 1, (event.clientX - bounds.left) * raw.width / bounds.width)), y: Math.max(0, Math.min(raw.height - 1, (event.clientY - bounds.top) * raw.height / bounds.height)) }; };
  const oldDown = mask.onpointerdown, oldMove = mask.onpointermove, oldUp = mask.onpointerup, oldCancel = mask.onpointercancel;
  mask.onpointerdown = event => {
    if (state.autoJob || !current()) return;
    if (lab.armed === 'subject') { const point = position(event); event.preventDefault(); applySubject({ x: point.x / raw.width, y: point.y / raw.height }); return; }
    if (lab.armed === 'sample') { lab.sample = position(event); disarm(); $('#plusBrush').value = 'clone'; retouchStatus('Sample chosen. Brush over the unwanted area. Each stroke starts from this sample; choose a fresh sample as the texture changes.'); event.preventDefault(); return; }
    if ($('#plusBrush').value !== 'clone') { discard(); return oldDown?.call(mask, event); }
    if (!lab.sample) { retouchStatus('Choose a sample point before painting.'); return; }
    try {
      const point = position(event), source = pixels(), target = new ImageData(new Uint8ClampedArray(source.data), raw.width, raw.height);
      remember(); discard(); lab.stroke = { source, target, last: point, offset: { x: lab.sample.x - point.x, y: lab.sample.y - point.y } };
      mask.setPointerCapture(event.pointerId); event.preventDefault();
      OpenCanvasPhotoLab.cloneStamp(target.data, source.data, raw.width, raw.height, point.x, point.y, lab.stroke.offset.x, lab.stroke.offset.y, Number($('#plusBrushSize').value), Number($('#photoLabStrength').value)/100);
      context().putImageData(target, 0, 0); preview();
    } catch (error) { lab.stroke = null; retouchStatus(error.message); }
  };
  mask.onpointermove = event => {
    if (state.autoJob || !current()) return;
    if (!lab.stroke) return oldMove?.call(mask, event);
    const stroke = lab.stroke, point = position(event);
    OpenCanvasPhotoLab.cloneLine(stroke.target.data, stroke.source.data, raw.width, raw.height, stroke.last, point, stroke.offset, Number($('#plusBrushSize').value), Number($('#photoLabStrength').value)/100);
    stroke.last = point; context().putImageData(stroke.target, 0, 0); preview();
  };
  mask.onpointerup = event => { if (lab.stroke) { lab.stroke = null; retouchStatus('Retouch stroke added. Undo photo edit reverses the last stroke.'); } oldUp?.call(mask, event); };
  mask.onpointercancel = event => { lab.stroke = null; oldCancel?.call(mask, event); };
  $('#plusBrush').onchange = () => { disarm(); lab.stroke = null; };
  $('#photoLabReset').onclick = () => {
    if (state.autoJob || !current()) return;
    remember(); context().clearRect(0,0,raw.width,raw.height); context().drawImage(original,0,0);
    lab.selectionSource = null; lab.sample = null; lab.stroke = null; disarm(); discard(); preview();
    status('Photo edits reset to the image opened in this panel.'); retouchStatus('Photo edits reset. Undo photo edit restores your previous edit.');
  };
  const personStart = $('#plusAutoCutout').onclick;
  $('#plusAutoCutout').onclick = async event => {
    if (state.autoJob || !current()) return;
    disarm(); discard(); const labControls = [...body.querySelectorAll('[id^="photoLab"]')].filter(e => 'disabled' in e).map(e => [e,e.disabled]);
    labControls.forEach(([e]) => e.disabled = true);
    try { await personStart(event); if (current() && state.autoMask) lab.selectionSource = state.autoMask.source; }
    finally { if (current()) labControls.forEach(([e, disabled]) => e.disabled = disabled); }
  };
  const undo = $('#plusMaskUndo').onclick;
  $('#plusMaskUndo').onclick = event => { if (state.autoJob) return; disarm(); discard(); lab.stroke = null; state.editRevision++; undo(event); };
  const replace = $('#plusPhotoReplace').onchange;
  $('#plusPhotoReplace').onchange = async event => { const replaced = await replace(event); if (!current() || !replaced) return; lab.selectionSource = lab.sample = lab.stroke = null; disarm(); discard(); status('Photo replaced. Choose a subject or retouch the new photo.'); };
  $('#photoLabBackgroundMode').onchange = () => {
    const mode = $('#photoLabBackgroundMode').value; discard();
    $('#photoLabColorField').style.display = mode === 'solid' ? '' : 'none'; $('#photoLabUploadField').style.display = mode === 'image' ? '' : 'none'; $('#photoLabBlurField').style.display = mode === 'blur' ? '' : 'none';
  };
  for (const id of ['photoLabColor','photoLabBlur']) $('#' + id).oninput = discard;
  $('#photoLabUpload').onchange = async event => {
    const request = ++lab.backgroundRequest; discard(); lab.background = null;
    const file = event.target.files[0]; if (!file) { backgroundStatus('No background photo selected.'); return; }
    const latest = () => current() && lab.backgroundRequest === request;
    let bitmap;
    try {
      if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 10*1048576) throw Error('Choose a PNG, JPEG or WebP under 10 MB.');
      bitmap = await createImageBitmap(file); if (!latest()) return;
      const scale = Math.min(1,1600/Math.max(bitmap.width,bitmap.height)), canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width*scale); canvas.height = Math.round(bitmap.height*scale); canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height); lab.background = canvas;
      backgroundStatus('Background loaded. Preview it with your cutout.');
    } catch (error) { if (latest()) { lab.background = null; backgroundStatus(error.message); } }
    finally { bitmap?.close(); }
  };
  $('#photoLabPreview').onclick = () => {
    if (state.autoJob || !current()) return;
    try {
      const foreground = pixels(); if (OpenCanvasPhotoLab.transparency(foreground.data) < .005) throw Error('Create a cutout first so the new background can show through.');
      const canvas = document.createElement('canvas'); canvas.width = raw.width; canvas.height = raw.height; const ctx = canvas.getContext('2d'), mode = $('#photoLabBackgroundMode').value;
      if (mode === 'solid') { ctx.fillStyle = $('#photoLabColor').value; ctx.fillRect(0,0,canvas.width,canvas.height); }
      else if (mode === 'image') {
        if (!lab.background) throw Error('Choose a background photo first.');
        const rect = OpenCanvasPhotoLab.coverRect(lab.background.width,lab.background.height,raw.width,raw.height); ctx.drawImage(lab.background,rect.x,rect.y,rect.w,rect.h);
      } else {
        if (!('filter' in ctx)) throw Error('This browser cannot blur canvas backgrounds. Choose a solid color or your own background photo.');
        const source = state.autoMask?.source || lab.selectionSource || original.getContext('2d').getImageData(0,0,original.width,original.height);
        if (OpenCanvasPhotoLab.transparency(source.data) > .01) throw Error('The original scene is already transparent. Choose a solid color or your own background photo.');
        const scene = document.createElement('canvas'); scene.width = source.width; scene.height = source.height; scene.getContext('2d').putImageData(source,0,0);
        const blur = Number($('#photoLabBlur').value), margin = blur * 3;
        ctx.filter = 'blur(' + blur + 'px)'; ctx.drawImage(scene,-margin,-margin,canvas.width+margin*2,canvas.height+margin*2); ctx.filter = 'none';
      }
      const combined = new ImageData(OpenCanvasPhotoLab.composite(foreground.data,ctx.getImageData(0,0,canvas.width,canvas.height).data),raw.width,raw.height);
      const shown = $('#photoLabBackgroundCanvas'); shown.width = raw.width; shown.height = raw.height; shown.getContext('2d').putImageData(combined,0,0);
      lab.pending = { pixels: combined, revision: state.editRevision }; $('#photoLabBackgroundPreview').style.display = '';
      backgroundStatus('Preview only. Use this background to add it to your photo edits.');
    } catch (error) { discard(); backgroundStatus(error.message); }
  };
  $('#photoLabUseBackground').onclick = () => {
    if (state.autoJob || !current() || !lab.pending) return;
    if (lab.pending.revision !== state.editRevision) { discard(); backgroundStatus('The cutout changed. Preview the background again before using it.'); return; }
    const combined = lab.pending.pixels; remember(); context().putImageData(combined,0,0); discard(); preview(); backgroundStatus('Background added. Apply photo changes to update the design, or Undo photo edit to restore the cutout.');
  };
  $('#photoLabDiscardBackground').onclick = () => { discard(); backgroundStatus('Preview discarded. Your photo is unchanged.'); };
}
