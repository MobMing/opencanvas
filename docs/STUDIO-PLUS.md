# Studio Plus

Open **Studio Plus** from Home, the editor rail, or Tools.

## Recovery

Projects migrate from the small localStorage area to IndexedDB. The migration verifies the stored workspace before removing the old project storage key. Current projects, up to ten automatic recovery versions per project, and reusable layouts stay on the device. Changed designs produce versions at most once every ten seconds. Versions do not constitute an off-device backup.

Download a verified workspace backup for independent safekeeping. Version 3 includes projects, folders, Trash, reusable layouts, custom fonts, brand kits, campaign plans, text styles, starred projects and saved-template bookmarks. It checks file integrity before restore, imports copies with new identifiers and remaps their references. Existing projects and settings are not replaced. You can choose whether to add fonts and settings; older version 1/2 files remain supported. Local recovery history, account tokens and session-only audio/video files are excluded.

In supported browsers, **Choose backup folder** creates an immediate dated backup and schedules another five minutes after subsequent design saves while the editor stays open. Files are closed and read back before being reported as verified. Existing backups are kept. Permission or disk errors appear in Recovery; **Back up now**, **Stop folder backups**, and manual download remain available. Choosing a folder does not set up or verify cloud synchronization.

The storage panel shows the browser's approximate origin-wide usage and allowance and offers a browser storage-retention request. Storage can still be cleared by the user or browser. Projects and layouts restore together, but fonts/settings use separate stores: if those stores fail, the imported projects remain and the panel reports what was not added. See [Recovery](RECOVERY.md) for limits and partial-restore behavior.

## Photo

Choose a photo layer, zoom and pan within its existing frame, replace the photo without moving the frame, and mark its central area for overlap checking. **Auto cutout person** downloads approximately 30 MB of runtime/model files on demand and processes the photo on the device without uploading it. It requires a compatible browser and is intended for people; it is not a general pet or product cutout tool.

Refine the result with edge strength/softness, erase/restore brushes and undo. Edge-connected background-color removal remains available. Cancel or close leaves the photo unchanged; applying a cutout creates a PNG and editor Undo restores the previous photo. Processing is limited to a 1600-pixel working image. Fine hair, fingers, clutter and difficult lighting may need manual refinement. See [Person cutouts](PERSON-CUTOUT.md) for browser requirements and the manual fallback.

## Layouts

Choose layers to group, ungroup, lock, unlock, move or scale together. Drag a group on the canvas; use Layouts to scale it. Duplicate and Delete apply to the selected group. Save any selected combination as a reusable layout and insert independent editable copies. Saved layouts are not synchronized instances. Group and photo-framing metadata survive project export/import.

## Campaign

Enter a title, artist, lineup, date, venue and ticket link once. Optional photo and color choices create a square post, vertical Story, landscape banner and portrait flyer, saved in Projects. Adaptive resizing creates a new design and repositions groups by their relative positions while maintaining proportions. Review every result before publishing; this does not infer semantic layout intent.

## Design check

Checks the current page for off-page layers, text overflow, small text, estimated contrast, enlarged images and overlaps in protected photo areas. Each issue selects its layer. Contrast estimates use simple underlying panels; photographs, gradients, transparency and real-world print conditions require visual inspection. Subject protection checks a central rectangle chosen by the user; it is not face detection.

## Motion

Each page is a 1–30 second scene with a fade, slide or no entrance. Text can rise, fade or remain static. Add a local video and choose its start/end in seconds; scene length follows the trim range. Add one soundtrack with a starting position and volume from 0–100%. Text/shapes overlay a scene video; still image layers are omitted in that scene. Source video audio is muted; the selected soundtrack supplies audio. Mixed page sizes fit within the first page's output aspect ratio.

Preview or export using the formats supported by the browser. WebM is the default when available; MP4 is offered only when the browser reports a supported encoder. Recording may still fail due to device or browser limits, in which case an error is shown. The file extension follows the actual recorded format.

Exports run in real time, up to three minutes, 30 frames per second and 1280 pixels on the longest edge. Keep the tab visible. Stop, closing Motion or hiding the tab cancels without a partial download. Page timings, trims, transitions and soundtrack settings save in the project; audio/video files must be reselected after reloading. Waveforms, multiple soundtrack tracks, source-video audio mixing and automatic captions are not included. See [Motion scenes](MOTION.md).

## Connect

The optional Node workspace server supports explicit cloud project copies, shared access, version conflicts, role-based comments/reviews and scheduled Bluesky image posts. GitHub Pages alone provides none of these connected services, and the server does not provide live collaborative editing or automatic local-to-cloud synchronization.

A managed Render hosting plan and optional encrypted Cloudflare R2 database backups are prepared, not activated. The owner must review costs before enabling services or billing. Server backup and restore tooling is tested with local files and a mock provider; a real provider restore drill remains part of activation. Production accounts, hosting, social credentials and email account recovery are not configured by this repository update. See [managed hosting and estimated costs](MANAGED-HOSTING.md) and [connected workspace setup](CONNECTED-SETUP.md).

## Validation

Automated checks cover migration verification, backup integrity, restore references and failures, folder permissions/writes, cutout compositing, crop geometry, group transforms, locks, campaign bounds, design checks, motion trims and recording errors, authentication, permissions, version conflicts, reviews and scheduling. Browser validation is still required for real file permissions, model inference and media encoders; mocked recording checks do not establish MP4 support on every browser. See the linked feature guides and [development notes](DEVELOPMENT.md) for integration and limits.
