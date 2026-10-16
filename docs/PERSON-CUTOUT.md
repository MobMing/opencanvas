# Automatic person cutouts

Photo tools now include **Auto cutout person**. It separates people from a photograph on the user's device, then leaves the result editable with edge strength, edge softness, erase, restore, and undo. Applying the photo uses the existing project undo checkpoint.

The tool starts only when requested. It downloads approximately 30 MB of runtime/model data from this site's own origin; no photograph is sent to a server. Cancelling terminates the worker, including its pending downloads. Closing Photo or switching to another photo/tool also discards an in-flight result. The original pixels stay unchanged on failure or cancellation. Browser caching may avoid subsequent downloads; offline availability is not guaranteed.

This is a **person** model. It is useful for clear portraits and people at similar scale; it is not general object, pet, or product segmentation. Fine hair, fingers, occlusions and difficult lighting need manual cleanup. Processing uses the existing maximum 1600-pixel photo working size. A modern browser with workers, OffscreenCanvas, WebGL2 and WebAssembly SIMD is required. Unsupported browsers retain the manual controls.

## Build integration

Load `cutout-core.js` and `studio-plus-cutout.js` before `studio-plus-media.js` in the Plus module. Run `node build-cutout.cjs` to copy the optional runtime to `dist/cutout`. Publish that directory along with the rest of `dist`. It is deliberately absent from the initial page's script requests.

`assets/cutout/manifest.json` records all upstream sources and SHA-256 hashes. Large binary files are split into parts under 4.5 MB to support the repository publication path; they reconstruct the unmodified upstream bytes in memory. The build validates their hashes, and the browser worker verifies each part before use.

## Components and sources

- Google MediaPipe Tasks Vision **1.1.1**, Apache License 2.0. [Official package](https://www.npmjs.com/package/@mediapipe/tasks-vision), [source repository](https://github.com/google-ai-edge/mediapipe).
- Google Selfie Multiclass **256×256, float32, version 1**, Apache License 2.0. [Model guide](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter), [model card and limitations](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Multiclass%20Segmentation.pdf).
- [Official web integration guide](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter/web_js) recommends worker execution to avoid blocking the interface.

Redistribution notices and license text are included in `assets/cutout` and the built directory. The overall OpenCanvas project license is unchanged. The mask compositing, UI, cancellation and download verification code are original OpenCanvas implementation.

## Validation

`node --test tests/cutout.test.cjs` checks compositing, original alpha preservation, edge interpolation, malformed masks, worker cancellation/late results, download failures/timeouts, and reconstruction of the official asset bytes. Browser validation is also required because inference needs real canvas/WebAssembly support.

Validated in the browser on October 16, 2026 with the existing licensed `portrait-brunette` library photograph: a 960×640 mask retained the person and removed the leafy background. In the editor, cancellation left the original intact, a second run completed, edge strength changed the mask, and undo restored the original photograph. This validates the workflow on that browser/photo; it is not a claim of equal segmentation quality for all subjects or devices.
