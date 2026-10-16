// Real-time canvas recording with one audio graph for soundtrack and source audio.
plusRunMotion = async function(record) {
  if (plusMotionStop) return;
  const abort = new AbortController(), projectId = design.id, disabled = [], videos = new Map(), audio = [], leases = [], graph = new Map();
  let stopped = false, stopReason = 'Stopped. No recording was downloaded.', stream, recorder, audioContext, destination, frameId, recorderDone, recorderError;
  plusMotionStop = () => { stopped = true; abort.abort(); };
  const active = () => !stopped && $('#plusDialog')?.open && plusSection === 'Motion' && design.id === projectId;
  const hidden = () => { if (document.hidden) { stopReason = 'Playback stopped because the tab was hidden. No recording was downloaded.'; plusMotionStop?.(); } };
  document.addEventListener('visibilitychange', hidden);
  try {
    syncPage(design); const pages = clone(design.pages), state = motionStudioState(design.motionStudio), timeline = motionStudioTimeline(pages), total = timeline.at(-1).end, offset = record ? 0 : Math.min(motionStudioCursor, total - .001);
    if (total > 180) throw Error('Keep the scene sequence at or below three minutes before playback or export.');
    const canvas = $('#plusMotionCanvas'), context = canvas.getContext('2d'), formats = motionUpgradeFormats(window.MediaRecorder), format = formats.find(item => item.key === $('#plusMotionFormat').value);
    if (record && (!format || !canvas.captureStream)) throw Error('This recording format is not supported in your browser.');
    for (const control of $$('#plusBody input, #plusBody select, #plusBody textarea, #plusBody button')) { if (control.id === 'plusMotionCancel') continue; disabled.push([control, control.disabled]); control.disabled = true; }
    motionStudioStopScrub(); const scale = Math.min(1, 1280 / design.width, 1280 / design.height); canvas.width = Math.round(design.width * scale); canvas.height = Math.round(design.height * scale);
    const hasSound = state.tracks.length || pages.some(page => motionStudioScene(page.motion).mediaId && motionStudioScene(page.motion).sourceVolume > 0);
    if (hasSound) { const Context = window.AudioContext || window.webkitAudioContext; if (!Context) throw Error('This browser cannot mix audio. Remove soundtrack clips and mute scene video sound, or try another browser.'); audioContext = new Context(); await motionUpgradeAwait(audioContext.resume(), abort.signal, 10000); }
    if (record) { stream = canvas.captureStream(30); if (audioContext) { destination = audioContext.createMediaStreamDestination(); for (const track of destination.stream.getAudioTracks()) stream.addTrack(track); } }
    const connect = (media, volume) => { if (!audioContext) { media.muted = true; return; } const gain = audioContext.createGain(); gain.gain.value = volume; audioContext.createMediaElementSource(media).connect(gain); gain.connect(audioContext.destination); if (destination) gain.connect(destination); graph.set(media, gain); media.muted = false; media.volume = 1; };
    plusMessage('Loading saved media…'); await motionUpgradeAwait(document.fonts.ready, abort.signal);
    await motionUpgradeAwait(Promise.all(pages.flatMap(page => page.elements.filter(element => element.type === 'image').map(element => loadImage(element.src).decode()))), abort.signal);
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i], settings = motionStudioScene(page.motion); page.motion = settings;
      if (!settings.mediaId) continue;
      const media = await motionUpgradeAwait(motionStudioAcquire(settings.mediaId, abort.signal, media => leases.push(media)), abort.signal); if (media.kind !== 'video') throw Error('Scene ' + (i + 1) + ' needs a video file. Relink it.');
      const video = document.createElement('video'); video.playsInline = true; video.loop = false; video.muted = true; videos.set(page.id, video); await motionUpgradeLoad(video, media.url, abort.signal);
      Object.assign(settings, motionUpgradeClip(settings, video.duration)); const position = Math.max(0, Math.min(settings.duration - .001, offset - timeline[i].start)); await motionUpgradeSeek(video, settings.trimStart + position, abort.signal); connect(video, 0);
    }
    for (const track of state.tracks) {
      const media = await motionUpgradeAwait(motionStudioAcquire(track.mediaId, abort.signal, media => leases.push(media)), abort.signal); if (media.kind !== 'audio') throw Error('A soundtrack reference is not an audio file. Relink it.');
      const element = document.createElement('audio'); audio.push({ track, element, playing: false }); await motionUpgradeLoad(element, media.url, abort.signal);
      if (track.end > element.duration + .001) throw Error('An audio trim extends beyond its source file. Adjust its end time.');
      await motionUpgradeSeek(element, Math.min(track.end - .001, track.start + Math.max(0, offset - track.at)), abort.signal); connect(element, 0);
    }
    if (!active() || document.hidden) { hidden(); throw Error('Motion stopped.'); }
    const atStart = plusTimelineAt(pages.map(page => page.motion), offset); motionUpgradeDraw(context, canvas, pages[atStart.index], videos.get(pages[atStart.index].id), atStart.local); motionStudioPaintCaptions(context, canvas, state, offset);
    const chunks = [];
    if (record) {
      recorder = new window.MediaRecorder(stream, { mimeType: format.mime }); recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorderDone = new Promise(resolve => { recorder.onstop = resolve; recorder.onerror = event => { recorderError = event.error || Error('Video encoding failed. Try another supported format.'); resolve(); }; }); recorder.start(250);
    }
    plusMessage(record ? 'Recording ' + format.label + ' with captions and audio… Keep this tab visible.' : 'Playing from ' + offset.toFixed(2) + ' seconds…');
    let previous = -1; const started = performance.now();
    await new Promise((resolve, reject) => {
      let finished = false; const finish = error => { if (finished) return; finished = true; abort.signal.removeEventListener('abort', onAbort); error ? reject(error) : resolve(); }, onAbort = () => finish(); abort.signal.addEventListener('abort', onAbort, { once: true });
      const play = element => { element.play().catch(finish); };
      const tick = () => {
        if (finished) return;
        try {
          if (!active()) { stopped = true; finish(); return; } if (document.hidden) { hidden(); finish(); return; } if (recorderError) throw recorderError;
          const time = offset + (performance.now() - started) / 1000; if (time >= total) { finish(); return; }
          const at = plusTimelineAt(pages.map(page => page.motion), time), page = pages[at.index], video = videos.get(page.id);
          if (previous !== at.index) { for (const other of videos.values()) { other.pause(); if (graph.has(other)) graph.get(other).gain.value = 0; } if (video) { if (graph.has(video)) graph.get(video).gain.value = page.motion.sourceVolume; play(video); } previous = at.index; }
          if (video && video.currentTime >= page.motion.trimEnd) video.pause();
          for (const clip of audio) { const playing = time >= clip.track.at && time < clip.track.at + clip.track.end - clip.track.start; graph.get(clip.element).gain.value = motionStudioGain(clip.track, time); if (playing && !clip.playing) play(clip.element); else if (!playing && clip.playing) clip.element.pause(); clip.playing = playing; }
          motionUpgradeDraw(context, canvas, page, video, at.local); motionStudioPaintCaptions(context, canvas, state, time);
          motionStudioCursor = time; $('#motionStudioScrub').value = time; $('#motionStudioTime').textContent = time.toFixed(2) + ' / ' + total.toFixed(2) + 's'; $('#plusMotionProgress').value = time / total; motionStudioPaintTimeline(); frameId = requestAnimationFrame(tick);
        } catch (error) { finish(error); }
      }; tick();
    });
    if (recorder) { if (recorder.state === 'recording') recorder.stop(); await motionUpgradeAwait(recorderDone, null, 10000); if (recorderError) throw recorderError; if (!stopped) { const type = motionUpgradeRecordingType(recorder.mimeType || chunks.find(chunk => chunk.type)?.type, format.mime), blob = new Blob(chunks, { type: type.mime }); if (!blob.size) throw Error('The browser returned an empty recording.'); download(blob, filename() + '.' + type.extension); plusMessage(type.extension.toUpperCase() + ' download requested.'); } }
    if (stopped) plusMessage(stopReason); else { motionStudioCursor = 0; if (!record) plusMessage('Preview complete.'); $('#plusMotionProgress').value = 1; }
  } catch (error) { plusMessage(stopped ? stopReason : error.message); }
  finally { abort.abort(); document.removeEventListener('visibilitychange', hidden); cancelAnimationFrame(frameId); try { if (recorder?.state === 'recording') recorder.stop(); } catch {} videos.forEach(motionUpgradeRelease); audio.forEach(clip => motionUpgradeRelease(clip.element)); leases.forEach(lease => lease.release()); stream?.getTracks().forEach(track => track.stop()); try { await audioContext?.close(); } catch {} plusMotionStop = null; for (const [control, value] of disabled) if (control.isConnected !== false) control.disabled = value; }
};
