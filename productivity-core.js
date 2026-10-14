// Local promotional tools. QR generation uses the bundled MIT-licensed encoder.
function promotionHash(value){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16)+':'+value.length;}
function promotionLuminance(hex){const a=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2];}
function qrSettings(raw={}){
 const kind=raw.kind==='text'?'text':'url';let value=String(raw.value??'');if(kind==='url')value=value.trim();
 if(!value.trim())throw Error('Enter a website address or some text.');
 if(kind==='url'){let u;try{u=new URL(/^www\./i.test(value)?'https://'+value:value)}catch{throw Error('Use a complete https:// website address.');}if(!['https:','http:'].includes(u.protocol)||u.username||u.password)throw Error('Use a web address without embedded login details.');value=u.href;}
 if(new TextEncoder().encode(value).length>1000)throw Error('Keep QR content under 1,000 UTF-8 bytes for a readable code.');
 const ink=raw.ink??'#172b29',paper=raw.paper??'#ffffff';if(!/^#[0-9a-f]{6}$/i.test(ink)||!/^#[0-9a-f]{6}$/i.test(paper))throw Error('Choose valid QR colors.');
 const dark=promotionLuminance(ink),light=promotionLuminance(paper);if(dark>=light||(light+.05)/(dark+.05)<4.5)throw Error('Use dark ink on light paper with stronger contrast.');
 return {kind,value,ink:ink.toLowerCase(),paper:paper.toLowerCase()};
}
function qrMatrix(raw){const settings=qrSettings(raw),code=qrcode(0,'M');code.addData(settings.value,'Byte');code.make();const count=code.getModuleCount();return {settings,count,quiet:4,cells:Array.from({length:count},(_,y)=>Array.from({length:count},(_,x)=>code.isDark(y,x)))};}
function qrPixels(raw,scale=6){
 if(!Number.isInteger(scale)||scale<2||scale>16)throw Error('Choose a QR pixel scale from 2 to 16.');
 const m=qrMatrix(raw),side=(m.count+8)*scale,rgba=new Uint8ClampedArray(side*side*4),rgb=h=>h.slice(1).match(/../g).map(c=>parseInt(c,16)),paper=rgb(m.settings.paper),ink=rgb(m.settings.ink);
 for(let y=0;y<side;y++)for(let x=0;x<side;x++){const row=Math.floor(y/scale)-4,col=Math.floor(x/scale)-4,c=row>=0&&col>=0&&row<m.count&&col<m.count&&m.cells[row][col]?ink:paper,i=(y*side+x)*4;rgba[i]=c[0];rgba[i+1]=c[1];rgba[i+2]=c[2];rgba[i+3]=255;}
 return {...m,side,rgba};
}
function productivityMetadata(raw){if(raw.type!=='image'||!raw.qrCode||raw.qrCode.version!==1||typeof raw.src!=='string'||raw.qrCode.result!==promotionHash(raw.src))return {};try{return {qrCode:{version:1,...qrSettings(raw.qrCode),result:raw.qrCode.result}}}catch{return {}};}
function photoPalette(data,count=6){
 if(!data||data.length%4||data.length>4000000||!Number.isInteger(count)||count<2||count>8)throw Error('Use a sampled image and choose 2–8 palette colors.');
 const histogram=new Map(),stride=Math.max(1,Math.floor(data.length/4/24000));
 for(let i=0;i<data.length;i+=4*stride){if(data[i+3]<128)continue;const key=(data[i]>>4)*256+(data[i+1]>>4)*16+(data[i+2]>>4),weight=data[i+3]/255,p=histogram.get(key)||{rgb:[0,0,0],weight:0};p.rgb[0]+=data[i]*weight;p.rgb[1]+=data[i+1]*weight;p.rgb[2]+=data[i+2]*weight;p.weight+=weight;histogram.set(key,p);}
 if(!histogram.size)throw Error('This image is transparent. Choose a photo with visible colors.');
 const entries=[...histogram.values()].map(p=>({rgb:p.rgb.map(x=>x/p.weight),weight:p.weight})),boxes=[entries];
 const span=b=>[0,1,2].map(a=>Math.max(...b.map(p=>p.rgb[a]))-Math.min(...b.map(p=>p.rgb[a])));
 while(boxes.length<count){let at=-1,best=-1;for(let i=0;i<boxes.length;i++){if(boxes[i].length<2)continue;const score=Math.max(...span(boxes[i]))*Math.sqrt(boxes[i].reduce((n,p)=>n+p.weight,0));if(score>best){at=i;best=score;}}if(at<0)break;const b=boxes[at],ranges=span(b),axis=ranges.indexOf(Math.max(...ranges)),sorted=b.slice().sort((a,b)=>a.rgb[axis]-b.rgb[axis]),half=sorted.reduce((n,p)=>n+p.weight,0)/2;let sum=0,cut=1;for(let i=0;i<sorted.length-1;i++){sum+=sorted[i].weight;cut=i+1;if(sum>=half)break;}boxes.splice(at,1,sorted.slice(0,cut),sorted.slice(cut));}
 return [...new Set(boxes.map(b=>{const weight=b.reduce((n,p)=>n+p.weight,0);return '#'+[0,1,2].map(i=>Math.round(b.reduce((n,p)=>n+p.rgb[i]*p.weight,0)/weight).toString(16).padStart(2,'0')).join('')}))].sort((a,b)=>promotionLuminance(a)-promotionLuminance(b));
}
function photoPaletteKit(colors,name,heading='Arial',body='Arial'){
 if(!Array.isArray(colors)||!colors.length||colors.some(c=>!/^#[a-f0-9]{6}$/i.test(c)))throw Error('Extract a photo palette first.');
 const sorted=[...new Set(colors)].sort((a,b)=>promotionLuminance(a)-promotionLuminance(b)),paper=sorted.at(-1),ink=sorted[0],middle=sorted.slice(1,-1);
 return {name:String(name||'Photo palette').trim().slice(0,80)||'Photo palette',paper,ink,accent:middle[0]||ink,secondary:middle.at(-1)||paper,heading,body};
}
