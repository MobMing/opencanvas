# Local Photo Lab

Photo Lab extends Studio Plus → Photo. The existing portrait cutout, erase and
restore brushes, edge-connected background removal, crop controls and design undo
remain available.

## What works

- **Select a subject:** click inside a pet, product, person or other prominent
  object. Google MediaPipe Magic Touch returns a foreground mask. Adjust the same
  Edge strength and Edge softness controls used by person cutout, then refine with
  erase/restore. Processing runs in a cancellable worker on the user's device.
- **Clone & blend:** choose a clean sample in the photo, then brush over a small
  unwanted object. Soft-edged sampling copies nearby pixels. Every stroke is
  separately undoable. The source pixels are frozen for a stroke, so the brush
  does not recursively smear its own output. This is non-generative retouching,
  not content-aware reconstruction or a promise to remove any object perfectly.
- **Replace the background:** preview a solid color, an uploaded photo fitted to
  cover, or a blurred version of the pre-cutout scene. Preview does not modify the
  photo. “Use this background” creates one undoable edit. A preview made before a
  later edit cannot overwrite that later edit. A cutout is required first.
- **Reset photo edits:** restores the image opened in the panel (or its most recent
  replacement). Reset itself is undoable. “Apply photo changes” is still required
  to update the design; design-level Undo restores its previous photo.

The editor keeps up to eight photo-edit snapshots while the panel is open. Photo
editing is capped at 1600 pixels on the longest side. Local image inputs accept
PNG, JPEG and WebP up to 10 MB. Background composition flattens the subject and
background into one photo; it does not add separate editable canvas layers.

## Integration

Include `photo-lab-core.js` and `photo-lab-tools.js` after `studio-plus-media.js`
(and after the existing `cutout-core.js` / `studio-plus-cutout.js` helpers).
`plusPhotoPanel` calls `photoLabEnhance(state, preview, remember)` if available.
The hook also uses `state.editRevision` to guard background preview application.

Build the existing cutout assets first, then run:

```text
node build-photo-lab.cjs
```

This copies the model, manifest, license and adapter into `dist/photo-lab/`.
The worker uses `../cutout/vision_bundle.js`, `vision_wasm_internal.js` and the
existing cutout WASM parts; these must be deployed alongside it. No build step
downloads executable code or model weights. Building verifies the checked-in
model part digests.

## Pinned model, runtime and provenance

- Runtime: Google `@mediapipe/tasks-vision` **1.1.1**, shared with person cutout.
- Model: [official Magic Touch v2 int8 model, version 1](https://storage.googleapis.com/mediapipe-models/interactive_segmenter_v2/magic_touch/int8/1/interactive_segmentation.task).
- Original model length: **30,525,312 bytes**.
- SHA-256: `38431bc66b883404e8397f74c3579404315b9b52b04a46c6346fe906a7309b03`.
- The original binary is split into seven parts of at most 4.5 MB for repository
  transport. `assets/photo-lab/manifest.json` records their exact order and hashes.
- Shared WASM is **13,519,922 bytes**. The first subject selection downloads about
  **44 MB** of WASM and model data, plus a small JS runtime. The shared runtime may
  already be in the browser cache after person cutout. Nothing loads until the
  user chooses a subject and clicks the photo.
- Model/runtime: Apache-2.0. See `assets/photo-lab/LICENSE`, `NOTICE.txt` and the
  corresponding files in `assets/cutout/`.
- [Official task overview](https://developers.google.com/edge/mediapipe/solutions/vision/interactive_segmenter)
  and [web guide](https://developers.google.com/edge/mediapipe/solutions/vision/interactive_segmenter/web_js).
- The official overview links a [Magic Touch model card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MagicTouch.pdf).
  That card describes an earlier model; its size and latency figures should not
  be presented as measurements of this v2 package.

The adapter uses the current split API: `InteractiveSegmenter.setImage()`, then
`segment()` with one completed positive point stroke. It uses the CPU delegate
inside an `OffscreenCanvas` worker. It does not use the deprecated legacy API.

## Privacy, cancellation and limits

Runtime requests are only for self-hosted static assets. Photos are not uploaded
to Google or any other service. There is no API key, paid activation, account or
backend dependency. Downloads are checked against SHA-256 before inference.

Cancel terminates the worker, including an in-progress download/inference.
Changing panels, changing photo layers or closing the dialog also cancels the
current job through the existing photo lifecycle. Invalid masks, download errors,
unsupported browser features and a three-minute timeout leave the original photo
unchanged. Edits occur only after a mask passes validation and an undo snapshot
is recorded. A replacement photo that finishes decoding after the panel changed
is discarded instead of modifying the new panel's state.

Subject selection is approximate. Difficult lighting, transparent objects, tiny
subjects, thin fur/hair and overlapping subjects can need manual cleanup. One
positive point is supported in this first version; there is no multi-point
positive/negative refinement UI. Blur cannot recover an original background from
an image that was already transparent on import. Clone & blend works best on
small areas with nearby matching texture; it cannot reconstruct hidden detail.

## Verification

```text
node --test tests/photo-lab*.test.cjs tests/cutout.test.cjs
```

Twenty-six targeted tests cover subject model reconstruction, lazy worker startup,
download errors, timeout/cancellation, invalid clicks, alpha compositing,
background fit, clone sampling and continuous strokes, immutable preview,
stale-preview rejection, reset/undo, sample selection without accidental
erasing, late inference results after leaving Photo, and out-of-order image/background decodes without overwriting intervening edits.

Real inference was also verified in the app browser using the existing licensed
`cat-in-grass.webp` fixture: a 960 × 640 output mask, 33% of pixels removed, and
5.6 seconds for the test run including initialization. Visual inspection confirmed
the cat remained while the grass/background became transparent. This is a local
test observation, not a promised latency or a quality guarantee for other photos.
