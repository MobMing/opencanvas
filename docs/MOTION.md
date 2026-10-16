# Motion scenes

Open **Studio Plus → Motion**. Each project page becomes a scene lasting 1–30 seconds, with fade, slide or no transition and a separate text entrance.

Select a local video for a scene, then enter its start and end in seconds. The scene length follows that trim range. The selected range must be within the source video and last 1–30 seconds. Removing the video returns the scene to page artwork. Videos are shown in the available canvas area with their proportions preserved; source audio is muted. Existing image layers are replaced by the scene video, while editable text and shapes remain overlaid.

Add one soundtrack, choose its starting position and adjust volume from 0–100%. The selected volume is applied to previews and recorded audio. Playback stops when the scene sequence ends; a shorter soundtrack ends naturally. This version does not offer multiple soundtrack tracks, waveforms, automatic captions or source-video audio mixing.

Trim, transition, text entrance and soundtrack settings save with the editable project and workspace backup. Video and audio files remain local to the current browser session and must be selected again after reload. Separate projects retain their own soundtrack selections during a session.

## Exports

OpenCanvas queries the browser's `MediaRecorder` support and only offers supported formats. WebM remains the default when available. MP4 appears only when the browser reports a supported MP4 encoder; recording can still fail due to browser or device resource limits, in which case the error is shown and no successful download is claimed. The downloaded extension follows the actual recorded MIME type.

Export takes real time and is limited to three minutes, 30 frames per second and 1280 pixels on the longest side. Keep OpenCanvas visible while it records. Hiding the tab, closing Motion or pressing Stop cancels the run without downloading a partial recording. Playback errors, unrecognized files and empty recordings show an error. File loading and seeking have time limits rather than waiting indefinitely.

The browser compatibility check is based on [MediaRecorder.isTypeSupported](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static); it is not a promise that every browser can create MP4.
