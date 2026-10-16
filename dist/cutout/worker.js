/* Original OpenCanvas worker; optional MediaPipe runtime is licensed separately. */
'use strict';
self.onmessage = async ({ data }) => {
  let segmenter, wasmURL;
  const progress = (message, loaded = null, total = null) => self.postMessage({ type: 'progress', message, loaded, total });
  try {
    if (!Number.isInteger(data.width) || !Number.isInteger(data.height) || data.width < 1 || data.height < 1 || data.width > 1600 || data.height > 1600 || data.pixels?.length !== data.width * data.height * 4) throw Error('Choose a photo no larger than 1600 pixels for cutout editing.');
    progress('Loading person cutout tools…');
    importScripts('./vision_bundle.js');
    if (!await Vision.FilesetResolver.isSimdSupported()) throw Error('This browser does not support the cutout model. Use a current Chrome, Edge, Firefox or Safari browser, or use the manual brushes.');
    const response = await fetch('./manifest.json');
    if (!response.ok) throw Error('The cutout tools could not be downloaded. Check your connection and retry.');
    const manifest = await response.json();
    let loaded = 0;
    const total = [...manifest.wasm.parts, ...manifest.model.parts].reduce((n, p) => n + p.bytes, 0);
    const readParts = async record => {
      const chunks = [];
      for (const part of record.parts) {
        if (!/^[a-z0-9-]+\.bin$/.test(part.file) || !Number.isInteger(part.bytes) || part.bytes < 1 || part.bytes > 5000000) throw Error('Invalid cutout package. Reload the website.');
        const r = await fetch('./' + part.file);
        if (!r.ok) throw Error('A cutout download failed. Check your connection and try again.');
        const bytes = new Uint8Array(await r.arrayBuffer());
        if (bytes.length !== part.bytes) throw Error('A cutout download was incomplete. Reload and try again.');
        const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
        const hash = Array.from(digest, b => b.toString(16).padStart(2, '0')).join('');
        if (hash !== part.sha256) throw Error('A cutout download could not be verified. Reload and try again.');
        chunks.push(bytes); loaded += bytes.length;
        progress('Downloading person cutout tools…', loaded, total);
      }
      return chunks;
    };
    const wasm = await readParts(manifest.wasm), model = await readParts(manifest.model);
    progress('Preparing person cutout…', total, total);
    wasmURL = URL.createObjectURL(new Blob(wasm, { type: 'application/wasm' }));
    const modelBuffer = new Uint8Array(await new Blob(model).arrayBuffer());
    const canvas = new OffscreenCanvas(data.width, data.height);
    const source = new OffscreenCanvas(data.width, data.height);
    source.getContext('2d').putImageData(new ImageData(data.pixels, data.width, data.height), 0, 0);
    segmenter = await Vision.ImageSegmenter.createFromOptions({
      wasmLoaderPath: new URL('./vision_wasm_internal.js', self.location.href).href,
      wasmBinaryPath: wasmURL
    }, {
      baseOptions: { modelAssetBuffer: modelBuffer, delegate: 'CPU' }, canvas,
      runningMode: 'IMAGE', outputConfidenceMasks: true, outputCategoryMask: false
    });
    progress('Finding the person and refining the edges…');
    segmenter.segment(source, result => {
      const background = result.confidenceMasks?.[0];
      if (!background || result.confidenceMasks.length !== 6) throw Error('The model did not return a person mask.');
      const values = background.getAsFloat32Array();
      const confidence = new Float32Array(values.length);
      let foreground = 0;
      for (let i = 0; i < values.length; i++) {
        confidence[i] = Math.max(0, Math.min(1, 1 - values[i]));
        if (confidence[i] > .5) foreground++;
      }
      if (foreground / values.length < .005) throw Error('No clear person was found. Try a closer portrait or use the erase and restore brushes.');
      self.postMessage({ type: 'result', confidence, width: background.width, height: background.height }, [confidence.buffer]);
    });
  } catch (error) {
    self.postMessage({ type: 'error', message: error?.message || 'Automatic cutout failed. Your photo is unchanged.' });
  } finally {
    segmenter?.close();
    if (wasmURL) URL.revokeObjectURL(wasmURL);
    self.close();
  }
};
