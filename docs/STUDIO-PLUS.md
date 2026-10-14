# Studio Plus

Open **Studio Plus** from Home, the editor rail, or Tools.

## Recovery

Projects migrate from the small localStorage area to IndexedDB. The migration verifies the stored workspace before removing the old project storage key. Current projects, up to ten automatic recovery versions per project, and reusable layouts stay on the device. Changed designs produce versions at most once every ten seconds. Versions do not constitute an off-device backup.

Download workspace backups for independent safekeeping. Restore imports project and layout copies without overwriting existing work. Brand/campaign settings are included in the JSON for reference; this restore flow does not overwrite those settings. The storage panel shows the browser's approximate origin-wide usage and allowance and offers a browser storage-retention request. Storage can still be cleared by the user or browser.

## Photo

Choose a photo layer, zoom and pan within its existing frame, replace the photo without moving the frame, and mark its central area for overlap checking. Cutout controls provide erase/restore brushes, eight-stroke undo, edge-connected background-color removal and a one-pixel edge softening pass. Applying a cutout creates a PNG; editor Undo restores the previous photo. Cutout processing is limited to 1600 pixels. It does not perform AI hair/subject recognition.

## Layouts

Choose layers to group, ungroup, lock, unlock, move or scale together. Drag a group on the canvas; use Layouts to scale it. Duplicate and Delete apply to the selected group. Save any selected combination as a reusable layout and insert independent editable copies. Saved layouts are not synchronized instances. Group and photo-framing metadata survive project export/import.

## Campaign

Enter a title, artist, lineup, date, venue and ticket link once. Optional photo and color choices create a square post, vertical Story, landscape banner and portrait flyer, saved in Projects. Adaptive resizing creates a new design and repositions groups by their relative positions while maintaining proportions. Review every result before publishing; this does not infer semantic layout intent.

## Design check

Checks the current page for off-page layers, text overflow, small text, estimated contrast, enlarged images and overlaps in protected photo areas. Each issue selects its layer. Contrast estimates use simple underlying panels; photographs, gradients, transparency and real-world print conditions require visual inspection. Subject protection checks a central rectangle chosen by the user; it is not face detection.

## Motion

Each page is a timed scene with a fade, slide or no entrance. Text can rise, fade or remain static. Add a local video to a scene and a local soundtrack, then preview or export WebM. Text/shapes overlay a scene video; still image layers are omitted in that scene. Source video audio is muted; the selected soundtrack supplies audio. Mixed page sizes fit within the first page's output aspect ratio.

Exports run in real time, up to three minutes and at most 1280 pixels on the longest edge. Keep the tab open. Stop cancels the download. Page timings and transitions save in the project; uploaded audio/video files must be reselected after reloading. MP4, trimming, waveform editing, audio mixing and automatic captions are not included.

## Connect

See [connected workspace setup](CONNECTED-SETUP.md). The implementation is ready for a separately hosted Node server. Shared projects, version conflicts, role-based comments/reviews and scheduled Bluesky image posts were tested locally. Production accounts, hosting and social credentials are not configured by this repository update.

## Validation

Automated checks cover crop geometry, group transforms, locks, campaign bounds, reflow, design-check warnings, timeline boundaries, authentication, authorization, version conflicts, comments/reviews and scheduling. Browser checks cover storage migration, reload persistence, backup downloads, photo framing, reusable layouts, actual WebM export and connected saving/comments/approval against a local test server.
