// Local media references are identifiers, never remote URLs or executable content.
function motionMediaRef(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  if (typeof raw !== 'string' || !/^media_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(raw)) throw Error('Invalid local media reference. Relink this file.');
  return raw;
}
function motionMediaMetadata(raw) {
  const id = motionMediaRef(raw.id), kind = raw.kind;
  if (!id || !['video', 'audio'].includes(kind)) throw Error('Invalid media record.');
  if (typeof raw.mime !== 'string' || !raw.mime.startsWith(kind + '/') || raw.mime.length > 120) throw Error('Choose a supported ' + kind + ' file.');
  const limit = (kind === 'video' ? 200 : 100) * 1048576;
  if (!Number.isSafeInteger(raw.size) || raw.size <= 0 || raw.size > limit) throw Error('Choose ' + kind + ' smaller than ' + limit / 1048576 + ' MB.');
  if (!Number.isFinite(raw.duration) || raw.duration <= 0 || raw.duration > 86400) throw Error('This media file has no usable duration.');
  return { id, kind, mime: raw.mime, name: String(raw.name || 'Untitled ' + kind).slice(0, 200), size: raw.size, duration: raw.duration,
    createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : 0,
    peaks: Array.isArray(raw.peaks) ? raw.peaks.slice(0, 180).map(n => Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0) : [] };
}
function motionMediaPeaks(channels, bins = 120) {
  if (!channels.length || !channels[0]?.length) return [];
  const length = channels[0].length, peaks = [];
  for (let bin = 0; bin < bins; bin++) {
    let peak = 0; const from = Math.floor(bin * length / bins), to = Math.max(from + 1, Math.floor((bin + 1) * length / bins));
    for (const samples of channels) for (let i = from; i < to; i++) peak = Math.max(peak, Math.abs(samples[i] || 0));
    peaks.push(Math.min(1, peak));
  }
  return peaks;
}
