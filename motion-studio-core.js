// Timeline editing and caption parsing without browser dependencies.
function motionStudioNumber(value, min, max, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw Error('Choose a valid ' + label + '.');
  return value;
}
function motionStudioScene(raw = {}) {
  const scene = { ...motionUpgradeSettings(raw), mediaId: motionMediaRef(raw.mediaId), sourceVolume: motionUpgradeNumber(raw.sourceVolume, 0, 1, 0) };
  if (scene.mediaId && scene.trimEnd !== null) scene.duration = motionStudioNumber(scene.trimEnd - scene.trimStart, 1, 30, 'video trim length (1–30 seconds)');
  return scene;
}
function motionStudioTrack(raw) {
  if (!raw || typeof raw.id !== 'string' || !/^[\w-]{1,100}$/.test(raw.id)) throw Error('Invalid soundtrack clip.');
  const at = motionStudioNumber(raw.at ?? 0, 0, 180, 'audio placement'), start = motionStudioNumber(raw.start ?? 0, 0, 86400, 'audio start'), end = motionStudioNumber(raw.end, 0, 86400, 'audio end');
  if (end - start < .05 || end - start > 180) throw Error('Audio clips must last at least 0.05 and at most 180 seconds.');
  return { id: raw.id, mediaId: motionMediaRef(raw.mediaId), at, start, end, volume: motionUpgradeNumber(raw.volume, 0, 1, 1), fadeIn: motionUpgradeNumber(raw.fadeIn, 0, Math.min(30, end - start), 0), fadeOut: motionUpgradeNumber(raw.fadeOut, 0, Math.min(30, end - start), 0) };
}
function motionStudioCaption(raw) {
  if (!raw || typeof raw.id !== 'string' || !/^[\w-]{1,100}$/.test(raw.id)) throw Error('Invalid caption.');
  const start = motionStudioNumber(raw.start, 0, 180, 'caption start'), end = motionStudioNumber(raw.end, 0, 180, 'caption end');
  if (end <= start) throw Error('Caption end must follow its start.');
  const text = String(raw.text || '').replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim();
  if (!text || text.length > 500) throw Error('Captions need 1–500 characters.');
  return { id: raw.id, start, end, text };
}
function motionStudioState(raw = {}) {
  if (raw.tracks !== undefined && (!Array.isArray(raw.tracks) || raw.tracks.length > 8)) throw Error('Use at most eight soundtrack clips.');
  if (raw.captions !== undefined && (!Array.isArray(raw.captions) || raw.captions.length > 300)) throw Error('Use at most 300 captions.');
  const tracks = (raw.tracks || []).map(motionStudioTrack), captions = (raw.captions || []).map(motionStudioCaption);
  for (const rows of [tracks, captions]) if (new Set(rows.map(row => row.id)).size !== rows.length) throw Error('Duplicate timeline item IDs.');
  return { version: 1, tracks, captions, captionStyle: { size: motionUpgradeNumber(raw.captionStyle?.size, 2, 9, 4), position: ['top', 'middle', 'bottom'].includes(raw.captionStyle?.position) ? raw.captionStyle.position : 'bottom', color: /^#[a-f\d]{6}$/i.test(raw.captionStyle?.color || '') ? raw.captionStyle.color : '#ffffff', background: raw.captionStyle?.background !== false } };
}
function motionStudioTimeline(pages) {
  let time = 0; return pages.map((page, index) => { const duration = motionStudioScene(page.motion).duration, start = time; time += duration; return { id: page.id, index, start, end: time, duration }; });
}
function motionStudioSplit(pages, index, localTime, makeId) {
  if (pages.length >= 30) throw Error('A project can contain up to 30 scenes.');
  if (!pages[index]) throw Error('Choose a scene to split.');
  const next = JSON.parse(JSON.stringify(pages)), first = next[index], settings = motionStudioScene(first.motion);
  if (!Number.isFinite(localTime) || localTime < 1 || settings.duration - localTime < 1) throw Error('Split at least one second from either end of a scene.');
  const second = JSON.parse(JSON.stringify(first)); second.id = makeId(); second.name = (first.name || 'Scene') + ' · split';
  const groups = new Map(); for (const element of second.elements) { element.id = makeId(); if (element.groupId) { if (!groups.has(element.groupId)) groups.set(element.groupId, makeId()); element.groupId = groups.get(element.groupId); } }
  first.motion = { ...settings, duration: localTime, trimEnd: settings.mediaId ? settings.trimStart + localTime : null };
  second.motion = { ...settings, duration: settings.duration - localTime, trimStart: settings.mediaId ? settings.trimStart + localTime : 0, trimEnd: settings.mediaId ? settings.trimStart + settings.duration : null, transition: 'none', textEntrance: 'none' };
  next.splice(index + 1, 0, second); return next;
}
function motionStudioReorder(pages, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || !pages[from] || !pages[to]) throw Error('Choose valid scene positions.');
  const next = pages.slice(), [page] = next.splice(from, 1); next.splice(to, 0, page); return next;
}
function motionStudioGain(track, time) {
  const elapsed = time - track.at, duration = track.end - track.start;
  if (elapsed < 0 || elapsed >= duration) return 0;
  return track.volume * Math.min(1, track.fadeIn > 0 ? elapsed / track.fadeIn : 1, track.fadeOut > 0 ? (duration - elapsed) / track.fadeOut : 1);
}
function motionStudioTimecode(value) {
  const match = String(value).trim().match(/^(?:(\d{1,2}):)?(\d{2}):(\d{2})[.,](\d{3})$/);
  if (!match || Number(match[2]) > 59 || Number(match[3]) > 59) throw Error('Caption times must use HH:MM:SS.mmm or MM:SS.mmm.');
  return (Number(match[1] || 0) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000);
}
function motionStudioParseCaptions(text, makeId) {
  if (typeof text !== 'string' || text.length > 250000) throw Error('Choose a caption file smaller than 250 KB.');
  const blocks = text.replace(/^\uFEFF/, '').replace(/\r/g, '').trim().split(/\n\s*\n/), captions = [];
  for (const block of blocks) {
    const lines = block.split('\n'); if (/^(WEBVTT|NOTE|STYLE|REGION)(\s|$)/.test(lines[0])) continue;
    const index = lines.findIndex(line => line.includes('-->')); if (index < 0) throw Error('A caption block has no timing line.');
    const match = lines[index].match(/^\s*(\S+)\s+-->\s+(\S+)(?:\s+.*)?$/); if (!match) throw Error('Invalid caption timing.');
    captions.push(motionStudioCaption({ id: makeId(), start: motionStudioTimecode(match[1]), end: motionStudioTimecode(match[2]), text: lines.slice(index + 1).join('\n') }));
  }
  if (!captions.length || captions.length > 300) throw Error('Import between 1 and 300 captions within three minutes.');
  return captions;
}
function motionStudioCaptionAt(captions, time) { return captions.filter(caption => time >= caption.start && time < caption.end).map(caption => caption.text).join('\n'); }
