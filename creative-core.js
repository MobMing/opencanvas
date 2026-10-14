// Original, dependency-free image and layout utilities.
function clearEdgeBackground(data,width,height,hex,tolerance){
  const target=hex.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16)),threshold=(Math.max(0,Math.min(100,tolerance))*4.42)**2;
  const seen=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
  const visit=i=>{if(seen[i])return;seen[i]=1;const k=i*4;if(data[k+3]===0||((data[k]-target[0])**2+(data[k+1]-target[1])**2+(data[k+2]-target[2])**2)<=threshold){queue[tail++]=i;data[k+3]=0;}};
  for(let x=0;x<width;x++){visit(x);visit((height-1)*width+x)}for(let y=0;y<height;y++){visit(y*width);visit(y*width+width-1)}
  while(head<tail){const i=queue[head++],x=i%width;if(x)visit(i-1);if(x<width-1)visit(i+1);if(i>=width)visit(i-width);if(i<(height-1)*width)visit(i+width)}return tail;
}
function adjustPhotoPixels(data,brightness,contrast,saturation){
  const b=brightness/100,c=contrast/100,s=saturation/100;
  for(let i=0;i<data.length;i+=4){const l=.2126*data[i]+.7152*data[i+1]+.0722*data[i+2];for(let k=0;k<3;k++)data[i+k]=Math.max(0,Math.min(255,((l+(data[i+k]-l)*s)*b-128)*c+128));}return data;
}
const photoDuotonePresets=[
 {id:'carbon',name:'Carbon & cream',shadow:'#171719',highlight:'#f5efdb'},
 {id:'electric',name:'Electric violet',shadow:'#24103f',highlight:'#daff4c'},
 {id:'club',name:'Midnight club',shadow:'#09245a',highlight:'#f389ce'},
 {id:'poster',name:'Red poster',shadow:'#38151d',highlight:'#ff654a'},
 {id:'forest',name:'Forest print',shadow:'#153c31',highlight:'#e9daa0'},
 {id:'cobalt',name:'Cobalt paper',shadow:'#164fa0',highlight:'#fff4da'},
 {id:'sepia',name:'Warm archive',shadow:'#3d2723',highlight:'#f1cb95'}
];
function photoStudioSettings(raw={}){
 const number=(key,fallback,min,max)=>{const value=raw[key]??fallback;if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw Error('Invalid photo '+key+'.');return value};
 const color=(key,fallback)=>{const value=raw[key]??fallback;if(typeof value!=='string'||!/^#[a-f0-9]{6}$/i.test(value))throw Error('Invalid photo '+key+'.');return value.toLowerCase()};
 const frame=raw.frame??'none';if(!['none','circle','round','arch'].includes(frame))throw Error('Invalid photo frame.');
 return {brightness:number('brightness',100,20,180),contrast:number('contrast',100,20,180),saturation:number('saturation',100,0,200),flip:raw.flip===true,frame,remove:raw.remove===true,key:color('key','#ffffff'),tolerance:number('tolerance',18,0,65),shadow:color('shadow','#171719'),highlight:color('highlight','#f5efdb'),intensity:number('intensity',0,0,100)};
}
function duotonePhotoPixels(data,shadow,highlight,intensity=100){
 const settings=photoStudioSettings({shadow,highlight,intensity}),a=settings.shadow.match(/[a-f0-9]{2}/g).map(v=>parseInt(v,16)),b=settings.highlight.match(/[a-f0-9]{2}/g).map(v=>parseInt(v,16)),mix=settings.intensity/100;
 if(!mix)return data;
 for(let i=0;i<data.length;i+=4){if(!data[i+3])continue;const tone=(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2])/255;for(let k=0;k<3;k++)data[i+k]=Math.round(data[i+k]*(1-mix)+(a[k]+(b[k]-a[k])*tone)*mix);}return data;
}
function photoSourceFingerprint(src){let hash=2166136261;for(let i=0;i<src.length;i++)hash=Math.imul(hash^src.charCodeAt(i),16777619);return src.length.toString(16)+'-'+(hash>>>0).toString(16).padStart(8,'0');}
function photoStudioMetadata(raw){
 if(!raw||raw.type!=='image'||raw.photoStudio===undefined)return {};
 const record=raw.photoStudio;if(!record||record.version!==1||typeof record.source!=='string'||record.source.length>16*1024*1024||!/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(record.source)||typeof record.result!=='string'||!/^[-a-f0-9]{10,24}$/.test(record.result))throw Error('Invalid original photo data.');
 const settings=photoStudioSettings(record.settings);if(typeof raw.src!=='string'||photoSourceFingerprint(raw.src)!==record.result)return {};
 return {photoStudio:{version:1,source:record.source,result:record.result,settings}};
}
function applyPhotoStudioResult(element,src,record,width,height){
 if(element.type!=='image'||element.locked)throw Error('Choose an unlocked image.');
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<1||height<1)throw Error('Invalid photo size.');
 const previousFrame=photoStudioMetadata(element).photoStudio?.settings.frame||'none',next=photoStudioMetadata({type:'image',src,photoStudio:record}).photoStudio;
 if(!next)throw Error('Invalid photo result.');
 const frame=next.settings.frame;
 if(previousFrame!==frame)element.photoCrop={zoom:1,x:.5,y:.5};
 element.src=src;element.photoStudio=next;
 if(frame!=='none'){const size=Math.min(element.w,element.h);element.x+=(element.w-size)/2;element.y+=(element.h-size)/2;element.w=element.h=size}
 else if(previousFrame!=='none'){const centerX=element.x+element.w/2,centerY=element.y+element.h/2,ratio=Math.min(element.w/width,element.h/height);element.w=Math.max(1,width*ratio);element.h=Math.max(1,height*ratio);element.x=centerX-element.w/2;element.y=centerY-element.h/2}
 return element;
}
function parseChartRows(text){
  const rows=text.trim().split(/\r?\n/).filter(v=>v.trim()).map(line=>{const i=line.lastIndexOf(','),label=line.slice(0,i).trim(),value=Number(line.slice(i+1).trim());if(i<1||!label||label.length>32||!line.slice(i+1).trim()||!Number.isFinite(value)||value<0||value>1e12)throw Error('Use Label, number on each line. Values must be 0–1 trillion; labels up to 32 characters.');return{label,value}});
  if(!rows.length||rows.length>12||!rows.some(r=>r.value>0))throw Error('Add 1–12 rows with at least one positive value.');return rows;
}
function resizePageCopy(source,width,height,label){
  const copy=clone(source);delete copy.pages;delete copy.pageIndex;copy.id=uid();copy.name=source.name+' — '+label;
  const ratio=Math.min(width/source.width,height/source.height),ox=(width-source.width*ratio)/2,oy=(height-source.height*ratio)/2;
  copy.width=width;copy.height=height;copy.elements.forEach(e=>{e.x=e.x*ratio+ox;e.y=e.y*ratio+oy;e.w*=ratio;e.h*=ratio;if(e.size)e.size*=ratio});return copy;
}
const creativeGraphics=[
 ['vinyl','Vinyl record','Music','dj album turntable disc','<circle cx="100" cy="100" r="88"/><g fill="none" stroke="B" stroke-width="2" opacity=".5"><circle cx="100" cy="100" r="70"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="50"/></g><circle cx="100" cy="100" r="29" fill="B"/><circle cx="100" cy="100" r="7" fill="A"/>'],
 ['headphones','Headphones','Music','dj audio sound headphones','<path d="M30 110V90a70 70 0 0 1 140 0v20h-15V90a55 55 0 0 0-110 0v20Z"/><rect x="18" y="95" width="40" height="76" rx="17"/><rect x="142" y="95" width="40" height="76" rx="17"/>'],
 ['note','Music note','Music','audio song sound','<path d="M80 145V30l90-15v113h-16V52L96 64v82Z"/><ellipse cx="62" cy="151" rx="34" ry="25"/><ellipse cx="140" cy="135" rx="30" ry="23"/>'],
 ['equalizer','Sound bars','Music','wave audio dj equalizer','<g stroke="A" stroke-width="15" stroke-linecap="round"><path d="M22 80v40M53 48v104M84 25v150M115 70v60M146 45v110M177 82v36"/></g>'],
 ['ticket','Event ticket','Music','admission concert event','<path d="M18 45h164v35a20 20 0 0 0 0 40v35H18v-35a20 20 0 0 0 0-40Z"/><path d="M137 55v90" stroke="B" stroke-width="4" stroke-dasharray="6 6"/><path d="m72 64 9 20 22 3-16 16 4 22-19-10-20 10 4-22-16-16 23-3Z" fill="B"/>'],
 ['microphone','Microphone','Music','podcast sing audio','<rect x="75" y="15" width="50" height="110" rx="25"/><path d="M55 86v20a45 45 0 0 0 90 0V86M100 150v30M65 181h70" fill="none" stroke="A" stroke-width="12" stroke-linecap="round"/>'],
 ['leaf','Tropical leaf','Botanical','plant jungle monstera nature','<path d="M100 181C14 136 1 48 56 22c18-9 34-2 44 9 17-20 38-21 59-4 48 39 18 106-59 154Z"/><g stroke="B" stroke-width="7" stroke-linecap="round"><path d="M100 176V53M99 94 62 58M100 125 47 87M100 151 55 126M101 79l30-27M101 109l49-42M101 140l52-34"/></g>'],
 ['sprig','Olive sprig','Botanical','leaf branch wellness plant','<path d="m52 183 91-164" stroke="A" stroke-width="6" fill="none"/><g><ellipse cx="65" cy="143" rx="18" ry="30" transform="rotate(-45 65 143)"/><ellipse cx="105" cy="126" rx="18" ry="30" transform="rotate(48 105 126)"/><ellipse cx="91" cy="92" rx="18" ry="30" transform="rotate(-45 91 92)"/><ellipse cx="132" cy="72" rx="18" ry="30" transform="rotate(48 132 72)"/><ellipse cx="123" cy="37" rx="15" ry="24" transform="rotate(-30 123 37)"/></g>'],
 ['flower','Petal flower','Botanical','bloom beauty floral','<g><ellipse cx="100" cy="55" rx="26" ry="43"/><ellipse cx="100" cy="145" rx="26" ry="43"/><ellipse cx="55" cy="100" rx="43" ry="26"/><ellipse cx="145" cy="100" rx="43" ry="26"/></g><circle cx="100" cy="100" r="32" fill="B"/>'],
 ['sunflower','Sunflower','Botanical','flower garden summer','<g>'+Array.from({length:10},(_,i)=>'<ellipse cx="100" cy="49" rx="16" ry="40" transform="rotate('+i*36+' 100 100)"/>').join('')+'</g><circle cx="100" cy="100" r="33" fill="B"/>'],
 ['mountains','Mountains','Nature','travel outdoors landscape','<path d="m6 171 61-130 49 96 32-65 46 99Z"/><path d="m48 82 19-41 21 42-22-12Z" fill="B"/><circle cx="145" cy="33" r="20" fill="B"/>'],
 ['sun','Sun rays','Nature','summer sunshine weather','<circle cx="100" cy="100" r="43"/>'+Array.from({length:12},(_,i)=>'<path d="M100 10v24" stroke="A" stroke-width="9" stroke-linecap="round" transform="rotate('+i*30+' 100 100)"/>').join('')],
 ['rainbow','Rainbow','Nature','kids playful arch','<path d="M20 166V100a80 80 0 0 1 160 0v66h-25v-66a55 55 0 0 0-110 0v66Z"/><path d="M56 166V100a44 44 0 0 1 88 0v66h-24v-66a20 20 0 0 0-40 0v66Z" fill="B"/>'],
 ['wave','Ocean wave','Nature','sea water beach surf','<path d="M8 142c45 0 40-105 109-110-24 31-28 63 2 77 37 17 48-9 73-12-13 59-50 83-96 81-36 0-60-18-88-36Z"/><path d="M91 77c-5 34 7 55 41 59 24 3 40-7 51-17-14 23-38 40-67 32-36-10-47-38-25-74Z" fill="B"/>'],
 ['heart','Heart','Celebrations','love wedding valentines','<path d="M100 179 24 99C-18 44 50-17 100 43c50-60 118 1 76 56Z"/>'],
 ['sparkle','Four-point sparkle','Celebrations','star shine magic','<path d="M100 5 124 76 195 100 124 124 100 195 76 124 5 100 76 76Z"/>'],
 ['confetti','Confetti','Celebrations','party birthday festival','<path d="m35 78 89 90L16 188Z"/><g fill="B"><rect x="48" y="22" width="15" height="32" transform="rotate(-25 48 22)"/><rect x="138" y="41" width="15" height="32" transform="rotate(35 138 41)"/><circle cx="166" cy="120" r="11"/><circle cx="100" cy="33" r="8"/><path d="m111 83 10-17 10 17-10 17Z"/></g>'],
 ['bolt','Lightning bolt','Celebrations','energy gaming electric','<path d="M109 5 38 112h52l-15 83 90-126h-59Z"/>'],
 ['medal','Award medal','Business','winner certificate achievement','<path d="m58 92-18 99 59-27 59 27-18-99Z" fill="B"/><circle cx="100" cy="72" r="58"/><path d="m100 33 12 25 29 4-21 21 5 28-25-13-25 13 5-28-21-21 29-4Z" fill="B"/>'],
 ['chat','Speech bubble','Business','talk message quote social','<path d="M25 20h150a15 15 0 0 1 15 15v100a15 15 0 0 1-15 15H80l-48 35v-35h-7a15 15 0 0 1-15-15V35a15 15 0 0 1 15-15Z"/><g fill="B"><circle cx="55" cy="85" r="10"/><circle cx="100" cy="85" r="10"/><circle cx="145" cy="85" r="10"/></g>'],
 ['arrow','Curved arrow','Business','direction next pointer','<path d="M22 169c0-67 48-97 120-97V31l48 55-48 55v-42c-58 0-89 21-96 70Z"/>'],
 ['coffee','Coffee cup','Lifestyle','cafe food drink','<path d="M29 58h117v84a37 37 0 0 1-37 37H66a37 37 0 0 1-37-37Z"/><path d="M146 69h13a29 29 0 0 1 0 58h-13M59 18v23M88 9v32M117 18v23" stroke="A" stroke-width="10" fill="none" stroke-linecap="round"/>'],
 ['camera','Camera','Lifestyle','photo photography lens','<path d="M18 52h40l14-25h56l14 25h40v119H18Z"/><circle cx="100" cy="112" r="43" fill="B"/><circle cx="100" cy="112" r="29" fill="A"/><circle cx="164" cy="72" r="7" fill="B"/>'],
 ['paw','Pet paw','Lifestyle','dog cat animal','<ellipse cx="101" cy="137" rx="49" ry="40"/><ellipse cx="36" cy="89" rx="20" ry="28" transform="rotate(-25 36 89)"/><ellipse cx="78" cy="49" rx="20" ry="29"/><ellipse cx="127" cy="49" rx="20" ry="29"/><ellipse cx="168" cy="89" rx="20" ry="28" transform="rotate(25 168 89)"/>']
];
function graphicSVG(item,a,b){if(!/^#[a-f0-9]{6}$/i.test(a)||!/^#[a-f0-9]{6}$/i.test(b))throw Error('Invalid artwork color.');return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="800" height="800" fill="'+a+'">'+item[4].replaceAll('"A"','"'+a+'"').replaceAll('"B"','"'+b+'"')+'</svg>';}
