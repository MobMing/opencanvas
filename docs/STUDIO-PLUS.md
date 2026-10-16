# Studio Plus

Open **Studio Plus** from Home, the editor rail, or Tools.

## Recovery

Projects migrate from the small localStorage area to IndexedDB. The migration verifies the stored workspace before removing the old project storage key. Current projects, up to ten automatic recovery versions per project, and reusable layouts stay on the device. Changed designs produce versions at most once every ten seconds. Versions do not constitute an off-device backup.

Download a verified workspace backup for independent safekeeping. Version 3 includes projects, folders, Trash, reusable layouts, custom fonts, brand kits, campaign plans, text styles, starred projects and saved-template bookmarks. It checks file integrity before restore, imports copies with new identifiers and remaps their references. Existing projects and settings are not replaced. You can choose whether to add fonts and settings; older version 1/2 files remain supported. Local recovery history, account tokens and original audio/video bytes from the separate local media library are excluded. Saved timing, captions and media references remain in project metadata; keep original media files independently.

In supported browsers, **Choose backup folder** creates an immediate dated backup and schedules another five minutes after subsequent design saves while the editor stays open. Files are closed and read back before being reported as verified. Existing backups are kept. Permission or disk errors appear in Recovery; **Back up now**, **Stop folder backups**, and manual download remain available. Choosing a folder does not set up or verify cloud synchronization.

The storage panel shows the browser's approximate origin-wide usage and allowance and offers a browser storage-retention request. Storage can still be cleared by the user or browser. Projects and layouts restore together, but fonts/settings use separate stores: if those stores fail, the imported projects remain and the panel reports what was not added. See [Recovery](RECOVERY.md) for limits and partial-restore behavior.

## Photo

Choose a photo layer, zoom and pan within its existing frame, replace the photo without moving the frame, and mark its central area for overlap checking. **Auto cutout person** downloads approximately 30 MB of runtime/model files on demand. **Select a subject** adds click-selected pets, products, people and other prominent objects using Google Magic Touch, approximately 44 MB on first use with a shared runtime. Both run on the device without uploading the photo.

Refine either result with edge strength/softness, erase/restore brushes and undo. Edge-connected background-color removal remains available. Cancel terminates the current model job without changing the photo. Processing is limited to 1600 pixels; fine hair/fur, transparent objects, clutter and difficult lighting may need manual refinement. Single-point selection is supported, not multi-point positive/negative refinement.

**Clone & blend** lets you choose a clean sample and brush matching pixels over a small unwanted object. It is non-generative retouching with soft edges and undo per stroke. It cannot invent hidden detail. **Replace the background** previews a solid color, an uploaded photo, or a blurred original scene behind a cutout. Preview changes nothing until **Use this background**; applying flattens the composite, and Undo restores the cutout. Reset restores the panel's original image and is also undoable. Finish with **Apply photo changes** to update the design. [Photo Lab controls and limits](PHOTO-LAB.md), [person cutouts](PERSON-CUTOUT.md).

## Layouts

Choose layers to group, ungroup, lock, unlock, move or scale together. Drag a group on the canvas; use Layouts to scale it. Duplicate and Delete apply to the selected group. Save any selected combination as a reusable layout and insert independent editable copies. Saved layouts are not synchronized instances. Group and photo-framing metadata survive project export/import.

## Campaign

Enter a title, artist, lineup, date, venue and ticket link once. Optional photo and color choices create a square post, vertical Story, landscape banner and portrait flyer, saved in Projects. Adaptive resizing creates a new design and repositions groups by their relative positions while maintaining proportions. Review every result before publishing; this does not infer semantic layout intent.

## Design check

Checks the current page for off-page layers, text overflow, small text, estimated contrast, enlarged images and overlaps in protected photo areas. Each issue selects its layer. Contrast estimates use simple underlying panels; photographs, gradients, transparency and real-world print conditions require visual inspection. Subject protection checks a central rectangle chosen by the user; it is not face detection.

## Motion

Each page is a 1–30 second scene with a fade, slide or no entrance. Text can rise, fade or remain static. Scrub with the timeline or Playhead slider, split a scene into two parts of at least one second each, reorder scenes, and undo/redo timeline edits. Add a local video and choose its start/end in seconds; scene length follows the trim range. The video is a backdrop behind all image, text and shape layers. Source audio starts muted and can be mixed with **Video sound (%)**. Mixed page sizes fit within the first page's output aspect ratio.

Add up to eight soundtrack clips with independent timeline positions, source trims, volumes and fades. Waveforms use decoded samples for files up to 25 MB and ten minutes; a plain block remains when waveform decoding is unavailable. Import SRT/VTT or enter captions manually, edit their timing/text/style, and burn them into exported video. Captions support up to 300 cues within three minutes; imports are capped at 250 KB. There is no automatic transcription or paid speech service.

The local media library verifies saved original audio/video files before attaching them. They survive reloads on this browser and address. Projects, workspace backups, cloud copies and live sharing carry their references and settings, **not the video/audio bytes**. Keep originals separately and use Add or relink on another device. The library can show usage and download originals; deleting a saved file can break references in other projects. Audio imports are capped at 100 MB and video at 200 MB.

Preview or export using the formats supported by the browser. WebM is the default when available; MP4 is offered only when the browser reports a supported encoder. Recording may still fail due to device or browser limits, in which case an error is shown. The file extension follows the actual recorded format.

Exports run in real time, up to three minutes, 30 frames per second and 1280 pixels on the longest edge. Keep the tab visible. Stop, closing Motion or hiding the tab cancels without a partial download. Play from playhead begins at the inspected position; Export whole video starts at the beginning. Audio/captions retain absolute timing after scene reorder, so review the result. Frame-accurate offline rendering and automatic transcription are not included. See [Motion Studio](MOTION.md).

## Connect

The optional Node workspace server supports explicit cloud project copies, shared access, version conflicts, role-based comments/reviews and scheduled Bluesky image posts. **Edit together** adds live shared editing, teammate presence and cursors. Joining is explicit; editor changes are then shared automatically until leaving. Independent field changes merge, while overlapping changes produce a conflict without partially applying the proposed update. Reviewers can watch and review but cannot write the design.

Live documents are limited to 10 MiB of canonical JSON. Defaults allow 16 streams overall, eight per project and four per account. Same-field concurrent text is conflict-checked rather than merged character by character; local media bytes are not shared. GitHub Pages alone cannot run these services. [Live collaboration details](LIVE-COLLABORATION.md).

A managed Render hosting plan and optional encrypted Cloudflare R2 database backups are prepared, not activated. The owner must review costs before enabling services or billing. Server backup and restore tooling is tested with local files and a mock provider; a real provider restore drill remains part of activation. Production accounts, hosting, social credentials and email account recovery are not configured by this repository update. See [managed hosting and estimated costs](MANAGED-HOSTING.md) and [connected workspace setup](CONNECTED-SETUP.md).

## Validation

Automated checks cover migration verification, backup integrity, restore references and failures, folder permissions/writes, photo compositing/retouch/preview/undo, crop geometry, group transforms, locks, campaign bounds, design checks, local media storage, scene splits/audio/captions, recording errors, live merges/streams/presence, authentication, permissions, reviews and scheduling. Browser validation remains necessary for real file permissions, model inference, media encoders and collaborative rendering; mocked checks do not establish MP4 support or identical behavior on every device. See the linked feature guides and [development notes](DEVELOPMENT.md) for integration and limits.
