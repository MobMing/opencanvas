// Portable scene timing and export capability helpers.
function motionUpgradeNumber(value,min,max,fallback){return typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;}
function motionUpgradeSettings(raw={}){
 const start=motionUpgradeNumber(raw.trimStart,0,86400,0),end=raw.trimEnd===null||raw.trimEnd===undefined?null:motionUpgradeNumber(raw.trimEnd,0,86400,null);
 if(end!==null&&end<=start)throw Error('The video trim end must be after its start.');
 return {duration:motionUpgradeNumber(raw.duration,1,30,4),transition:['fade','slide','none'].includes(raw.transition)?raw.transition:'fade',textEntrance:['rise','fade','none'].includes(raw.textEntrance)?raw.textEntrance:'rise',trimStart:start,trimEnd:end};
}
function motionUpgradeAudio(raw={}){return {start:motionUpgradeNumber(raw.start,0,86400,0),volume:motionUpgradeNumber(raw.volume,0,1,1)};}
function motionUpgradeClip(raw,sourceDuration){
 const settings=motionUpgradeSettings(raw);if(!Number.isFinite(sourceDuration)||sourceDuration<1)throw Error('Choose a video at least one second long.');
 const start=settings.trimStart,end=settings.trimEnd===null?Math.min(sourceDuration,start+settings.duration):settings.trimEnd;
 if(start>=sourceDuration||end>sourceDuration+.001)throw Error('The trim range extends beyond this video. Choose times within its duration.');
 const duration=end-start;if(duration<1-.001||duration>30+.001)throw Error('Each trimmed scene must be between 1 and 30 seconds.');
 return {...settings,trimStart:start,trimEnd:Math.min(end,sourceDuration),duration};
}
function motionUpgradeFormats(recorder){
 if(typeof recorder?.isTypeSupported!=='function')return [];
 const formats=[['webm',['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm']],['mp4',['video/mp4;codecs=avc1.42001E,mp4a.40.2','video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4']]];
 return formats.flatMap(([key,types])=>{const mime=types.find(type=>{try{return recorder.isTypeSupported(type);}catch{return false;}});return mime?[{key,mime,label:key.toUpperCase()}]:[];});
}
function motionUpgradeRecordingType(actual,requested){const mime=String(actual||requested||'').toLowerCase();if(mime.startsWith('video/mp4'))return {mime,extension:'mp4'};if(mime.startsWith('video/webm'))return {mime,extension:'webm'};throw Error('The browser produced an unsupported recording format.');}
function motionUpgradeApplyMetadata(target,source){if(source.motion)target.motion=motionUpgradeSettings(source.motion);if(source.motionAudio)target.motionAudio=motionUpgradeAudio(source.motionAudio);for(let i=0;i<(target.pages||[]).length;i++)motionUpgradeApplyMetadata(target.pages[i],source.pages[i]);return target;}
function motionUpgradeAwait(promise,signal,timeout=20000){return new Promise((resolve,reject)=>{let settled=false;const finish=(fn,value)=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',abort);fn(value);},abort=()=>finish(reject,Error('Motion stopped.')),timer=setTimeout(()=>finish(reject,Error('Media took too long to load. Try a smaller file.')),timeout);if(signal?.aborted)return abort();signal?.addEventListener('abort',abort,{once:true});Promise.resolve(promise).then(value=>finish(resolve,value),error=>finish(reject,error));});}
