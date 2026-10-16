/* Original OpenCanvas mask compositing. Kept separate from the optional model runtime. */
(function (root) {
  'use strict';
  function applyPersonMask(pixels, width, height, confidence, maskWidth, maskHeight, threshold = .5, softness = .15) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 ||
        !Number.isInteger(maskWidth) || !Number.isInteger(maskHeight) || maskWidth < 1 || maskHeight < 1 ||
        pixels.length !== width * height * 4 || confidence.length !== maskWidth * maskHeight) throw Error('Invalid cutout dimensions.');
    threshold = Math.max(.1, Math.min(.9, Number.isFinite(threshold) ? threshold : .5));
    softness = Math.max(.01, Math.min(.4, Number.isFinite(softness) ? softness : .15));
    const out = new Uint8ClampedArray(pixels), low = threshold - softness, span = softness * 2;
    let visible = 0;
    for (let y = 0; y < height; y++) {
      const sy = Math.max(0, Math.min(maskHeight - 1, (y + .5) * maskHeight / height - .5));
      const y0 = Math.floor(sy), y1 = Math.min(maskHeight - 1, y0 + 1), fy = sy - y0;
      for (let x = 0; x < width; x++) {
        const sx = Math.max(0, Math.min(maskWidth - 1, (x + .5) * maskWidth / width - .5));
        const x0 = Math.floor(sx), x1 = Math.min(maskWidth - 1, x0 + 1), fx = sx - x0;
        const a = confidence[y0 * maskWidth + x0] * (1 - fx) + confidence[y0 * maskWidth + x1] * fx;
        const b = confidence[y1 * maskWidth + x0] * (1 - fx) + confidence[y1 * maskWidth + x1] * fx;
        const value = a * (1 - fy) + b * fy;
        if (!Number.isFinite(value)) throw Error('The cutout model returned an invalid mask.');
        const t = Math.max(0, Math.min(1, (value - low) / span));
        const i = (y * width + x) * 4 + 3;
        out[i] = Math.round(pixels[i] * t * t * (3 - 2 * t));
        if (out[i] > 127) visible++;
      }
    }
    return { pixels: out, visibleFraction: visible / (width * height) };
  }
  const api = { applyPersonMask };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.OpenCanvasCutoutCore = api;
})(typeof globalThis === 'object' ? globalThis : this);
