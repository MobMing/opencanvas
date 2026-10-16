# Motion Studio

Open **Studio Plus → Motion**. Each project page becomes a scene lasting 1–30 seconds, with fade, slide or no transition and a separate text entrance. The timeline shows scenes, placed audio clips and captions. Click it or use the keyboard-accessible Playhead slider to inspect a frame. **Play from playhead** previews from that position; **Export whole video** always starts at the beginning.

## Scenes and video

Select a local video for a scene, then enter its start and end in seconds. The scene length follows that trim range. The selected range must be within the source video and last 1–30 seconds. Removing the video returns the scene to page artwork. Video sits behind the page's image, text and shape layers, with its proportions preserved. An opaque full-page image layer may hide it; adjust that layer in the editor. Source audio starts muted. Set **Video sound (%)** to include it in the preview and export mix.

**Split scene** divides at the entered time within that scene. Both parts must last at least one second. It duplicates the editable page with fresh page/layer IDs, keeps the same saved video reference and uses adjacent source ranges. The second half starts without repeating the entrance animation. The total sequence length stays unchanged. Projects support up to 30 scenes.

Use **Move earlier/later** to reorder scenes. Soundtracks and captions retain their absolute timeline positions; review them after a reorder. **Undo timeline edit** and **Redo** use the editor's project history. Removing a scene attachment does not delete its saved media, so Undo and other projects can still use it.

## Audio clips

Add up to eight soundtrack clips. Each has a timeline position, source-file start/end, volume from 0–100%, and independent fade-in/fade-out durations. Clips can overlap; their sound is mixed with any enabled source-video audio. Volume and fades apply to both preview and export. The mix stops at the end of the scene sequence. Loud overlapping clips can distort; lower their levels when necessary.

Waveforms are derived from decoded samples, not decorative graphics. Waveform decoding is attempted for audio up to 25 MB and ten minutes; larger files and unsupported decoders keep a plain clip block while normal audio playback can still work. Source audio imports support up to 100 MB; videos support up to 200 MB. Actual decoding depends on the browser's codecs.

## Editable captions

Import `.srt` or `.vtt` captions, or choose **Add caption at playhead**. The imported cues are appended to the list and remain editable. Set each cue's start, end and text, plus shared caption position, size, color and background. Captions are shown in the preview and permanently burned into exported video pixels.

Imports accept up to 300 cues within three minutes and files up to 250 KB. Markup is removed; VTT positioning/style directives are not imported. Overlapping cues are displayed together. Long text wraps and is reduced to fit, but short cues are easier to read. Automatic transcription, translation and speech recognition are not included; no paid API is called.

## Saved media and portability

Video and audio files are verified in a separate local IndexedDB library before being attached. They survive reloads on the same browser and website address. Missing files, denied storage or quota failures are reported rather than silently falling back to a temporary attachment. **Add or relink** reconnects an original file and retains existing trim settings where they fit the new file.

The editable project and workspace backup retain media references, trims, audio placement/fades, transitions and captions. **They do not embed the original video/audio bytes.** Opening them on another browser/device/address requires relinking those files. This also applies to cloud project copies. Keep your originals independently; browser storage can be cleared or evicted.

Open **Local media library → Show saved files** to see usage and download original media files. Deleting a library file explicitly asks for confirmation because other projects and recovery versions may still reference it. Removing an attachment or audio clip does not automatically delete media. Existing timing and soundtrack metadata from earlier projects is retained.

## Exports

OpenCanvas queries the browser's `MediaRecorder` support and only offers supported formats. WebM remains the default when available. MP4 appears only when the browser reports a supported MP4 encoder; recording can still fail due to browser or device resource limits, in which case the error is shown and no successful download is claimed. The downloaded extension follows the actual recorded MIME type.

Export takes real time and is limited to three minutes, 30 frames per second and 1280 pixels on the longest side. Keep OpenCanvas visible while it records. Hiding the tab, closing Motion or pressing Stop cancels the run without downloading a partial recording. Playback errors, missing media, unrecognized files and empty recordings show an error. File loading and seeking have time limits rather than waiting indefinitely. Native video editing, frame-accurate offline rendering, animated source-image formats and automatic transcription are outside this workflow.

The browser compatibility check is based on [MediaRecorder.isTypeSupported](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static); it is not a promise that every browser can create MP4.

## Integration and validation

Load `media-store-core.js`, `media-store.js`, `motion-studio-core.js`, `motion-studio.js` and `motion-studio-playback.js` after `motion-upgrade.js`. `motionStudio` is project-level metadata and must participate in the Home draft signature. Per-scene media references stay inside `motion`, using the existing page snapshot/adopt path. No new paid service or network API is needed.

Tests cover IndexedDB transaction/reload behavior with an adapter, quota/blocked/missing files, reference validation, waveform samples, split/reorder IDs and offsets, SRT/VTT parsing, metadata persistence, timed audio gains, source audio, burned captions and cancellation/failure cleanup. Real browser validation remains necessary for file codecs, permission/storage behavior, audio output and MP4/WebM encoding.
