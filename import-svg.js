// SVG imports are parsed in an inert XML document, never inserted into the page.
// Only a deliberately small, local-resource SVG vocabulary reaches the image decoder.
const importSVGTags=new Set('svg g defs title desc metadata style rect circle ellipse line polyline polygon path text tspan textPath image use symbol clipPath mask linearGradient radialGradient stop pattern filter feGaussianBlur feOffset feColorMatrix feBlend feComposite feFlood feMerge feMergeNode feComponentTransfer feFuncR feFuncG feFuncB feFuncA'.split(' '));
const importSVGAttributes=new Set('id class x y x1 y1 x2 y2 cx cy r rx ry width height viewBox preserveAspectRatio transform fill fill-opacity fill-rule stroke stroke-width stroke-opacity stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset opacity display visibility color font-family font-size font-weight font-style font-variant font-stretch text-anchor dominant-baseline alignment-baseline baseline-shift letter-spacing word-spacing text-decoration direction unicode-bidi writing-mode textLength lengthAdjust dx dy rotate d points clip-path clip-rule mask filter vector-effect shape-rendering text-rendering image-rendering overflow isolation mix-blend-mode gradientUnits gradientTransform spreadMethod offset stop-color stop-opacity patternUnits patternContentUnits patternTransform clipPathUnits maskUnits maskContentUnits filterUnits primitiveUnits in in2 result stdDeviation edgeMode type values mode operator k1 k2 k3 k4 flood-color flood-opacity tableValues slope intercept amplitude exponent'.split(' '));
const importSVGStyleProperties=new Set('fill fill-opacity fill-rule stroke stroke-width stroke-opacity stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset opacity display visibility color font-family font-size font-weight font-style font-variant font-stretch text-anchor dominant-baseline alignment-baseline baseline-shift letter-spacing word-spacing text-decoration direction unicode-bidi writing-mode clip-path clip-rule mask filter vector-effect shape-rendering text-rendering image-rendering overflow isolation mix-blend-mode stop-color stop-opacity flood-color flood-opacity'.split(' '));
function importSVGError(message){return Error(message+' Try a PDF export to preserve its appearance.');}
function importSVGSourceCheck(text){
 if(typeof text!=='string'||!text.trim())throw importSVGError('The SVG file is empty.');
 if(text.length>30*1024*1024)throw Error('Choose an SVG smaller than 30 MB.');
 if(/<!\s*(?:DOCTYPE|ENTITY)|<\?xml-stylesheet|\u0000/i.test(text))throw importSVGError('This SVG contains external XML instructions that cannot be imported safely.');
 return text;
}
function importSVGLocalReference(value){const m=String(value).trim().match(/^#([A-Za-z_][\w.:-]{0,159})$/);return m?m[1]:null;}
function importSVGValueCheck(value){
 const s=String(value);
 // CSS escapes and comments can hide protocols or url(). Neither is needed by this importer.
 if(s.length>500000||/[\\\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s)||/\/\*|\*\/|@|expression\s*\(|(?:https?|file|javascript|vbscript|data)\s*:/i.test(s))throw importSVGError('This SVG contains unsupported or external styling.');
 let cleaned=s.replace(/url\(\s*(['"]?)#([A-Za-z_][\w.:-]{0,159})\1\s*\)/gi,'');
 if(/url\s*\(|[<>]/i.test(cleaned))throw importSVGError('Only local SVG artwork references are supported.');
 return s;
}
function importSVGStyle(value){
 const result={};importSVGValueCheck(value);
 for(const declaration of String(value).split(';')){
  if(!declaration.trim())continue;const colon=declaration.indexOf(':');
  if(colon<1)throw importSVGError('This SVG has unsupported styles.');
  const name=declaration.slice(0,colon).trim().toLowerCase(),v=declaration.slice(colon+1).trim();
  if(!importSVGStyleProperties.has(name)||!v)throw importSVGError('This SVG uses an unsupported style ('+name.slice(0,40)+').');
  result[name]=importSVGValueCheck(v.replace(/\s*!important\s*$/i,''));
 }
 return result;
}
function importSVGStyleSheet(value){
 importSVGValueCheck(value);let rest=String(value).trim(),count=0;
 while(rest){const m=rest.match(/^([^{}]+)\{([^{}]*)\}\s*/);if(!m||++count>500||m[1].length>200||!/^[\w\s.#,*-]+$/.test(m[1]))throw importSVGError('This SVG stylesheet is too complex to import safely.');importSVGStyle(m[2]);rest=rest.slice(m[0].length);}
 return value;
}
function importSVGNumber(value,fallback=0){if(value==null||value==='')return fallback;const s=String(value).trim();if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?(?:px)?$/i.test(s))return NaN;const n=Number(s.replace(/px$/i,''));return Number.isFinite(n)&&Math.abs(n)<=1e7?n:NaN;}
function importSVGLength(value,fallback){
 if(value==null||value==='')return fallback;const m=String(value).trim().match(/^([+]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*(px|pt|pc|in|cm|mm)?$/i);
 if(!m)return fallback;const n=Number(m[1])*({px:1,pt:96/72,pc:16,in:96,cm:96/2.54,mm:96/25.4}[m[2]?.toLowerCase()||'px']);return Number.isFinite(n)&&n>0&&n<=1e7?n:fallback;
}
function importSVGMultiply(a,b){return [a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];}
function importSVGTransform(value){
 let out=[1,0,0,1,0,0],rest=String(value||'').trim(),count=0;
 while(rest){const m=rest.match(/^(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^()]*)\)\s*,?\s*/);if(!m||++count>40)throw importSVGError('This SVG has an unsupported transform.');
  const tokens=m[2].trim().split(/[\s,]+/).filter(Boolean),v=tokens.map(n=>importSVGNumber(n)),name=m[1];if(v.some(n=>!Number.isFinite(n)))throw importSVGError('This SVG has an invalid transform.');let next;
  if(name==='matrix'&&v.length===6)next=v;
  else if(name==='translate'&&v.length>=1&&v.length<=2)next=[1,0,0,1,v[0],v[1]||0];
  else if(name==='scale'&&v.length>=1&&v.length<=2)next=[v[0],0,0,v[1]??v[0],0,0];
  else if(name==='rotate'&&(v.length===1||v.length===3)){const rad=v[0]*Math.PI/180,c=Math.cos(rad),s=Math.sin(rad);next=[c,s,-s,c,0,0];if(v.length===3)next=importSVGMultiply(importSVGMultiply([1,0,0,1,v[1],v[2]],next),[1,0,0,1,-v[1],-v[2]]);}
  else if(/^skew/.test(name)&&v.length===1){const skew=Math.tan(v[0]*Math.PI/180);next=name==='skewX'?[1,0,skew,1,0,0]:[1,skew,0,1,0,0];}
  else throw importSVGError('This SVG has an invalid transform.');
  out=importSVGMultiply(out,next);if(out.some(n=>!Number.isFinite(n)||Math.abs(n)>1e9))throw importSVGError('This SVG transform is too large.');rest=rest.slice(m[0].length);
 }
 return out;
}
function importSVGViewBox(raw,width,height,preserve='xMidYMid meet'){
 const values=raw?String(raw).trim().split(/[\s,]+/).map(Number):[0,0,width,height];
 if(values.length!==4||values.some(n=>!Number.isFinite(n)||Math.abs(n)>1e7)||values[2]<=0||values[3]<=0)throw importSVGError('This SVG has an invalid viewBox.');
 const [x,y,w,h]=values,p=String(preserve||'xMidYMid meet').trim().replace(/^defer\s+/,'');let sx=width/w,sy=height/h,ox=0,oy=0;
 if(p!=='none'){const m=p.match(/^x(Min|Mid|Max)Y(Min|Mid|Max)(?:\s+(meet|slice))?$/);if(!m)throw importSVGError('This SVG has an unsupported page alignment.');sx=sy=m[3]==='slice'?Math.max(sx,sy):Math.min(sx,sy);ox=(width-w*sx)*({Min:0,Mid:.5,Max:1}[m[1]]);oy=(height-h*sy)*({Min:0,Mid:.5,Max:1}[m[2]]);}
 return {values,matrix:[sx,0,0,sy,ox-x*sx,oy-y*sy]};
}
function importSVGBox(matrix,x,y,w,h){
 const [a,b,c,d,e,f]=matrix,sx=Math.hypot(a,b),sy=Math.hypot(c,d);
 if(![x,y,w,h,sx,sy].every(Number.isFinite)||w<=0||h<=0||sx<1e-8||sy<1e-8||a*d-b*c<=0||Math.abs(a*c+b*d)>sx*sy*1e-6)return null;
 const width=w*sx,height=h*sy,cx=a*(x+w/2)+c*(y+h/2)+e,cy=b*(x+w/2)+d*(y+h/2)+f,box={x:cx-width/2,y:cy-height/2,w:width,h:height,rotation:Math.atan2(b,a)*180/Math.PI,sx,sy};
 return width>=1&&height>=1&&width<=16000&&height<=16000&&Math.abs(box.x)<=16000&&Math.abs(box.y)<=16000?box:null;
}
function importSVGColor(value){
 const names={black:'#000000',white:'#ffffff',red:'#ff0000',green:'#008000',blue:'#0000ff',yellow:'#ffff00',orange:'#ffa500',purple:'#800080',pink:'#ffc0cb',gray:'#808080',grey:'#808080',navy:'#000080',lime:'#00ff00',teal:'#008080',aqua:'#00ffff',fuchsia:'#ff00ff',maroon:'#800000',silver:'#c0c0c0',olive:'#808000'};let s=String(value||'black').trim().toLowerCase();
 if(s==='none'||s==='transparent')return {color:'#000000',opacity:0};if(names[s])s=names[s];
 if(/^#[\da-f]{3,4}$/.test(s))s='#'+[...s.slice(1)].map(c=>c+c).join('');
 if(/^#[\da-f]{6}(?:[\da-f]{2})?$/.test(s))return {color:s.slice(0,7),opacity:s.length===9?parseInt(s.slice(7),16)/255:1};
 const m=s.match(/^rgba?\(\s*([\d.]+)(%)?\s*,\s*([\d.]+)(%)?\s*,\s*([\d.]+)(%)?(?:\s*,\s*([\d.]+)(%)?)?\s*\)$/);
 if(m){const rgb=[1,3,5].map(i=>Math.max(0,Math.min(255,Math.round(Number(m[i])*(m[i+1]?2.55:1))))),alpha=m[7]===undefined?1:Math.max(0,Math.min(1,Number(m[7])/(m[8]?100:1)));return {color:'#'+rgb.map(n=>n.toString(16).padStart(2,'0')).join(''),opacity:alpha};}return null;
}
function importSVGRasterInfo(source){
 const m=String(source).match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/i);if(!m||m[2].length>30*1024*1024||m[2].length%4!==0)throw importSVGError('SVG photos must be embedded PNG, JPEG or WebP images.');
 let bytes;try{bytes=Uint8Array.from(atob(m[2]),c=>c.charCodeAt(0));}catch{throw importSVGError('An embedded SVG photo is invalid.');}
 const be32=i=>(bytes[i]*16777216+bytes[i+1]*65536+bytes[i+2]*256+bytes[i+3])>>>0,le24=i=>bytes[i]+bytes[i+1]*256+bytes[i+2]*65536,ascii=(i,n)=>String.fromCharCode(...bytes.slice(i,i+n));let width,height;
 if(m[1].toLowerCase()==='png'&&bytes.length>=24&&ascii(1,3)==='PNG'&&bytes[0]===137&&ascii(12,4)==='IHDR'){width=be32(16);height=be32(20);}
 else if(m[1].toLowerCase()==='jpeg'&&bytes[0]===255&&bytes[1]===216){let i=2;while(i+8<bytes.length){if(bytes[i++]!==255)break;while(bytes[i]===255)i++;const marker=bytes[i++];if(marker===217||marker===218)break;if(marker===1||(marker>=208&&marker<=215))continue;const len=bytes[i]*256+bytes[i+1];if(len<2||i+len>bytes.length)break;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){height=bytes[i+3]*256+bytes[i+4];width=bytes[i+5]*256+bytes[i+6];break;}i+=len;}}
 else if(m[1].toLowerCase()==='webp'&&bytes.length>=30&&ascii(0,4)==='RIFF'&&ascii(8,4)==='WEBP'){const type=ascii(12,4);if(type==='VP8X'){width=le24(24)+1;height=le24(27)+1;}else if(type==='VP8 '&&ascii(23,3)==='\x9d\x01\x2a'){width=(bytes[26]+bytes[27]*256)&16383;height=(bytes[28]+bytes[29]*256)&16383;}else if(type==='VP8L'&&bytes[20]===47){width=1+bytes[21]+((bytes[22]&63)<<8);height=1+(bytes[22]>>6)+(bytes[23]<<2)+((bytes[24]&15)<<10);}}
 if(!width||!height||width>16000||height>16000||width*height>40000000)throw importSVGError('An embedded SVG photo is invalid or exceeds the 40-megapixel limit.');return {width,height,bytes:bytes.length};
}
function importSVGReferences(root){
 const ids=new Map(),all=[root,...root.querySelectorAll('*')];for(const node of all){const id=node.getAttribute('id');if(id){if(!/^[A-Za-z_][\w.:-]{0,159}$/.test(id)||ids.has(id))throw importSVGError('This SVG has invalid or duplicate artwork identifiers.');ids.set(id,node);}}
 const refs=node=>{const out=[];for(const a of node.attributes){if(a.localName==='href'){const id=importSVGLocalReference(a.value);if(id)out.push(id);}for(const m of a.value.matchAll(/url\(\s*['"]?#([A-Za-z_][\w.:-]{0,159})['"]?\s*\)/gi))out.push(m[1]);}if(node.localName==='style')for(const m of node.textContent.matchAll(/url\(\s*['"]?#([A-Za-z_][\w.:-]{0,159})['"]?\s*\)/gi))out.push(m[1]);return out;};
 let expanded=0;const walk=(node,stack,depth)=>{if(depth>24||++expanded>15000)throw importSVGError('This SVG has too many repeated artwork references.');for(const id of refs(node)){const target=ids.get(id);if(!target)throw importSVGError('This SVG refers to missing artwork.');if(stack.has(target))throw importSVGError('This SVG contains a circular artwork reference.');const next=new Set(stack);next.add(target);walk(target,next,depth+1);}for(const child of node.children)walk(child,stack,depth+1);};
 walk(root,new Set([root]),0);return ids;
}
function importSVGSanitize(text){
 importSVGSourceCheck(text);const doc=new DOMParser().parseFromString(text,'image/svg+xml'),root=doc.documentElement;
 if(root.localName!=='svg'||root.namespaceURI!=='http://www.w3.org/2000/svg'||doc.querySelector('parsererror'))throw importSVGError('This file is not a valid SVG design.');
 const nodes=[root,...root.querySelectorAll('*')];if(nodes.length>5000)throw importSVGError('This SVG contains more than 5,000 artwork pieces.');let pixels=0,photos=0,pathChars=0,filters=0,styleSheet=false;
 for(const node of nodes){if(node!==root&&!root.contains(node))continue;const tag=node.localName;
  if(node.namespaceURI!=='http://www.w3.org/2000/svg'||!importSVGTags.has(tag))throw importSVGError('This SVG contains unsupported active or embedded content ('+tag.slice(0,40)+').');
  if(tag==='filter'&&++filters>20)throw importSVGError('This SVG contains too many effects.');
  if(tag==='metadata'){node.remove();continue;}
  if(tag==='style'){importSVGStyleSheet(node.textContent);styleSheet=true;}
  if(tag==='path'){pathChars+=(node.getAttribute('d')||'').length;if(pathChars>1500000)throw importSVGError('This SVG has too much detailed vector artwork.');}
  for(const attribute of [...node.attributes]){const name=attribute.name,local=attribute.localName,value=attribute.value;
   if(/^on/i.test(name))throw importSVGError('Scripts and event handlers are not allowed in imported SVG files.');
   if(name==='xmlns'||name==='xmlns:xlink'){if(!['http://www.w3.org/2000/svg','http://www.w3.org/1999/xlink'].includes(value))throw importSVGError('This SVG uses an unsupported namespace.');continue;}
   if(name==='xml:space'){if(!['preserve','default'].includes(value))node.removeAttribute(name);continue;}
   if(local==='href'){
    if(attribute.namespaceURI&&attribute.namespaceURI!=='http://www.w3.org/1999/xlink')throw importSVGError('This SVG uses an unsupported link namespace.');
    if(tag==='image'){const info=importSVGRasterInfo(value);pixels+=info.width*info.height;if(++photos>500||pixels>80000000)throw importSVGError('This SVG contains too many embedded photo pixels.');}
    else if(!['use','textPath','linearGradient','radialGradient','pattern'].includes(tag)||!importSVGLocalReference(value))throw importSVGError('External SVG links and images are not supported.');
    continue;
   }
   if(name==='style'){importSVGStyle(value);continue;}
   if(/^(?:aria-|data-)/.test(name)||name==='role'){node.removeAttribute(name);continue;}
   if(attribute.namespaceURI||!importSVGAttributes.has(name))throw importSVGError('This SVG uses an unsupported attribute ('+name.slice(0,40)+').');
   importSVGValueCheck(value);if(name==='transform'||name==='gradientTransform'||name==='patternTransform')importSVGTransform(value);
  }
  if(tag==='image'&&!node.hasAttribute('href')&&!node.hasAttributeNS('http://www.w3.org/1999/xlink','href'))throw importSVGError('An SVG photo is missing its embedded image.');
  if(tag==='feGaussianBlur'){const values=(node.getAttribute('stdDeviation')||'0').trim().split(/[\s,]+/).map(Number);if(values.length>2||values.some(n=>!Number.isFinite(n)||n<0||n>100))throw importSVGError('This SVG uses an oversized blur effect.');}
  if(tag==='filter'){
   // User-space or very large effect buffers can allocate much more memory than
   // the visible page. Keep only the ordinary, bounded object-box filter region.
   if(node.getAttribute('filterUnits')==='userSpaceOnUse')throw importSVGError('This SVG uses a large custom effect region.');
   for(const key of ['x','y','width','height'])if(node.hasAttribute(key)){const raw=node.getAttribute(key).trim(),value=raw.endsWith('%')?importSVGNumber(raw.slice(0,-1))/100:importSVGNumber(raw);if(!Number.isFinite(value)||(key==='width'||key==='height'?value<=0||value>2:Math.abs(value)>1))throw importSVGError('This SVG uses an oversized effect region.');}
   if(node.children.length>20)throw importSVGError('This SVG effect contains too many processing steps.');
  }
 }
 const ids=importSVGReferences(root);let sharedReferences=false;
 for(const node of [root,...root.querySelectorAll('*')])for(const attribute of node.attributes){const references=[...attribute.value.matchAll(/url\(\s*['"]?#([A-Za-z_][\w.:-]{0,159})['"]?\s*\)/gi)].map(m=>m[1]);if(attribute.localName==='href'){const id=importSVGLocalReference(attribute.value);if(id)references.push(id);}if(references.some(id=>!ids.get(id)?.closest('defs')))sharedReferences=true;}
 return {doc,root,styleSheet,sharedReferences};
}
function importSVGComputed(node,parent={}){
 const inherited=['fill','fill-opacity','fill-rule','stroke','stroke-width','stroke-opacity','color','font-family','font-size','font-weight','font-style','font-variant','font-stretch','text-anchor','dominant-baseline','alignment-baseline','letter-spacing','word-spacing','text-decoration','direction','unicode-bidi','writing-mode','visibility'];const out={};for(const key of inherited)if(parent[key]!==undefined)out[key]=parent[key];for(const a of node.attributes)if(importSVGStyleProperties.has(a.name))out[a.name]=a.value;out._space=node.getAttributeNS('http://www.w3.org/XML/1998/namespace','space')||parent._space||'default';Object.assign(out,importSVGStyle(node.getAttribute('style')||''));return out;
}
function importSVGNeedsGroupRaster(style){return ['clip-path','mask','filter'].some(k=>style[k]&&style[k]!=='none')||style['mix-blend-mode']&&style['mix-blend-mode']!=='normal'||style.isolation==='isolate'||(style.opacity!==undefined&&Number(style.opacity)!==1);}
function importSVGNativePaint(style){
 if(importSVGNeedsGroupRaster({...style,opacity:1})||(style.stroke&&style.stroke!=='none'&&importSVGNumber(style['stroke-width'],1)!==0))return null;const color=importSVGColor(style.fill==='currentColor'?style.color:style.fill);if(!color)return null;
 const opacity=color.opacity*importSVGNumber(style.opacity,1)*importSVGNumber(style['fill-opacity'],1);return Number.isFinite(opacity)&&opacity>=0&&opacity<=1?{color:color.color,opacity}:null;
}
function importSVGFont(style,warnings){
 const available=typeof fonts!=='undefined'?fonts:['Arial','Georgia','Times New Roman','Courier New','Verdana','Impact'];const requested=String(style['font-family']||'serif').split(',').map(f=>f.trim().replace(/^['"]|['"]$/g,'')),generic={'sans-serif':'Arial',serif:'Georgia',monospace:'Courier New',cursive:'Georgia',fantasy:'Impact'};
 for(const name of requested){const match=available.find(f=>f.toLowerCase()===(generic[name]||name).toLowerCase());if(match){if(name===requested[0]&&!generic[name])return match;if(generic[name])return match;warnings.add('Some SVG fonts were substituted with fonts available in OpenCanvas. Check text spacing before exporting.');return match;}}
 warnings.add('Some SVG fonts were substituted with Arial. Check text spacing before exporting.');return 'Arial';
}
async function importSVGNative(node,matrix,style,state){
 if(style.visibility==='hidden'||style.visibility==='collapse')return [];const tag=node.localName,n=(key,fallback=0)=>importSVGNumber(node.getAttribute(key),fallback),paint=importSVGNativePaint(style);let box,type;
 if(['rect','circle','ellipse'].includes(tag)&&paint){
  let x,y,w,h;if(tag==='rect'){x=n('x');y=n('y');w=n('width');h=n('height');const rx=n('rx',n('ry')),ry=n('ry',rx);if(rx||ry){if(Math.abs(rx-Math.min(w,h)*.12)>.01||Math.abs(ry-rx)>.01)return null;type='round';}else type='rect';}
  else{x=n('cx')-n(tag==='circle'?'r':'rx');y=n('cy')-n(tag==='circle'?'r':'ry');w=n(tag==='circle'?'r':'rx')*2;h=n(tag==='circle'?'r':'ry')*2;type='ellipse';}
  if(w===0||h===0||paint.opacity===0)return [];box=importSVGBox(matrix,x,y,w,h);if(!box||type==='round'&&Math.abs(box.sx-box.sy)>Math.max(box.sx,box.sy)*1e-6)return null;state.stats.shapes++;return [base(type,box.x,box.y,box.w,box.h,{rotation:box.rotation,...paint})];
 }
 if(tag==='image'&&!importSVGNeedsGroupRaster(style)){
  const source=(node.getAttribute('href')||node.getAttributeNS('http://www.w3.org/1999/xlink','href')).replace(/^data:image\/(png|jpeg|webp);base64,/i,(_,format)=>'data:image/'+format.toLowerCase()+';base64,'),info=importSVGRasterInfo(source);let x=n('x'),y=n('y'),w=n('width'),h=n('height');const p=(node.getAttribute('preserveAspectRatio')||'xMidYMid meet').trim();
  if(p!=='none'){const match=p.match(/^x(Min|Mid|Max)Y(Min|Mid|Max)(?:\s+meet)?$/);if(!match)return null;const scale=Math.min(w/info.width,h/info.height),nw=info.width*scale,nh=info.height*scale;x+=(w-nw)*({Min:0,Mid:.5,Max:1}[match[1]]);y+=(h-nh)*({Min:0,Mid:.5,Max:1}[match[2]]);w=nw;h=nh;}
  box=importSVGBox(matrix,x,y,w,h);if(!box)return null;state.bytes+=source.length;if(state.bytes>12*1024*1024)throw Error('The imported SVG exceeds the 12 MB project image limit. Try a smaller export.');state.stats.images++;return [base('image',box.x,box.y,box.w,box.h,{rotation:box.rotation,src:source,opacity:1})];
 }
 if(tag==='text'&&paint&&![...node.children].some(c=>!['title','desc'].includes(c.localName))){
  if(['textLength','lengthAdjust','rotate'].some(k=>node.hasAttribute(k))||['letter-spacing','word-spacing','baseline-shift'].some(k=>style[k]&&style[k]!=='normal'&&Number(style[k])!==0)||style['text-decoration']&&style['text-decoration']!=='none'||style['writing-mode']&&style['writing-mode']!=='horizontal-tb'||style.direction==='rtl'||style['font-stretch']&&style['font-stretch']!=='normal'||style['font-variant']&&style['font-variant']!=='normal'||style['dominant-baseline']&&!['auto','alphabetic'].includes(style['dominant-baseline'])||style['alignment-baseline']&&!['auto','alphabetic'].includes(style['alignment-baseline']))return null;
  let text=[...node.childNodes].filter(c=>c.nodeType===3||c.nodeType===4).map(c=>c.nodeValue).join('');if(style._space!=='preserve')text=text.replace(/\s+/g,' ').trim();if(!text)return [];if(text.length>20000||/[\r\n\t]/.test(text))return null;
  const size=importSVGNumber(style['font-size'],16),font=importSVGFont(style,state.warnings),weight=style['font-weight']==='bold'||Number(style['font-weight'])>=600?'700':'400',italic=['italic','oblique'].includes(style['font-style']);if(!Number.isFinite(size)||size<=0)return null;
  if(document.fonts?.load)await document.fonts.load((italic?'italic ':'')+weight+' '+Math.min(size,1600)+'px "'+font+'"');state.check();
  const c=state.measure;c.font=(italic?'italic ':'')+weight+' '+size+'px "'+font+'"';c.textBaseline='alphabetic';const measured=c.measureText(text),anchor=style['text-anchor']||'start';if(!['start','middle','end'].includes(anchor))return null;const width=Math.max(1,measured.width+1),x=n('x')+n('dx')-(anchor==='middle'?measured.width/2:anchor==='end'?measured.width:0),baseline=n('y')+n('dy');const a=c.measureText('Hg').actualBoundingBoxAscent;c.textBaseline='top';const t=c.measureText('Hg').actualBoundingBoxAscent,offset=Number.isFinite(a)&&Number.isFinite(t)?a-t:size*.8;
  box=importSVGBox(matrix,x,baseline-offset,width,size*1.25);if(!box||Math.abs(box.sx-box.sy)>Math.max(box.sx,box.sy)*1e-6||size*box.sy<1||size*box.sy>1600)return null;
  state.stats.text++;return [base('text',box.x,box.y,box.w,box.h,{rotation:box.rotation,text,size:size*box.sy,font,weight,italic,align:'left',lineHeight:1.15,...paint})];
 }
 return null;
}
function importSVGFragment(root,node,ancestors){
 const copy=root.cloneNode(false);for(const defs of root.querySelectorAll('defs'))if(!defs.parentElement?.closest('defs')&&!node.contains(defs))copy.append(defs.cloneNode(true));let parent=copy;for(const ancestor of ancestors){const wrapper=ancestor.cloneNode(false);parent.append(wrapper);parent=wrapper;}parent.append(node.cloneNode(true));return copy;
}
async function importSVGRasterLayer(root,state){
 state.check();state.progress('Preserving SVG artwork…');const source=new XMLSerializer().serializeToString(root),url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));let image,canvas,crop;
 try{image=await new Promise((resolve,reject)=>{const im=new Image(),timer=setTimeout(()=>{im.src='';reject(importSVGError('This SVG took too long to render.'));},15000);im.onload=()=>{clearTimeout(timer);resolve(im);};im.onerror=()=>{clearTimeout(timer);reject(importSVGError('This SVG artwork could not be rendered.'));};im.src=url;});state.check();
  canvas=document.createElement('canvas');canvas.width=state.width;canvas.height=state.height;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0,state.width,state.height);const pixels=c.getImageData(0,0,state.width,state.height).data;let left=state.width,top=state.height,right=-1,bottom=-1;
  for(let y=0;y<state.height;y++){for(let x=0;x<state.width;x++)if(pixels[(y*state.width+x)*4+3]){if(x<left)left=x;if(x>right)right=x;if(y<top)top=y;if(y>bottom)bottom=y;}if(y%200===0){await new Promise(resolve=>setTimeout(resolve,0));state.check();}}
  if(right<left)return null;crop=document.createElement('canvas');crop.width=right-left+1;crop.height=bottom-top+1;crop.getContext('2d').drawImage(canvas,left,top,crop.width,crop.height,0,0,crop.width,crop.height);const src=crop.toDataURL('image/png');state.bytes+=src.length;if(state.bytes>12*1024*1024)throw Error('The imported SVG exceeds the 12 MB project image limit. Try a smaller export.');state.stats.images++;state.stats.flattened++;return base('image',left,top,crop.width,crop.height,{src});
 }finally{if(canvas){canvas.width=0;canvas.height=0;}if(crop){crop.width=0;crop.height=0;}if(image)image.src='';URL.revokeObjectURL(url);}
}
async function importSVGFile(file,{maxSide=2400,check=()=>{},progress=()=>{}}={}){
 if(!file||typeof file.text!=='function'||file.size>30*1024*1024)throw Error('Choose an SVG file smaller than 30 MB.');check();progress('Reading SVG artwork…');const parsed=importSVGSanitize(await file.text());check();const root=parsed.root,view=root.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number),rawWidth=importSVGLength(root.getAttribute('width'),view?.[2]||300),rawHeight=importSVGLength(root.getAttribute('height'),view?.[3]||150),limit=Math.max(100,Math.min(2400,Number(maxSide)||2400)),scale=Math.min(1,limit/Math.max(rawWidth,rawHeight));
 const width=Math.max(100,Math.round(rawWidth*scale)),height=Math.max(100,Math.round(rawHeight*scale)),viewBox=importSVGViewBox(root.getAttribute('viewBox')||'0 0 '+rawWidth+' '+rawHeight,width,height,root.getAttribute('preserveAspectRatio'));
 root.setAttribute('width',String(width));root.setAttribute('height',String(height));root.setAttribute('viewBox',viewBox.values.join(' '));
 const state={width,height,bytes:0,warnings:new Set(),stats:{text:0,shapes:0,images:0,flattened:0,editable:0},measure:document.createElement('canvas').getContext('2d'),check,progress},chunks=[],rootStyle=importSVGComputed(root);if(rootStyle.display==='none')throw Error('This SVG has no visible artwork to import.');let whole=parsed.styleSheet||parsed.sharedReferences||importSVGNeedsGroupRaster(rootStyle)||root.hasAttribute('transform'),visited=0;
 if(!whole){const visit=async(node,matrix,inherited,ancestors)=>{if(++visited%20===0)await new Promise(resolve=>setTimeout(resolve,0));check();const tag=node.localName;if(['defs','title','desc','metadata','style'].includes(tag))return;const style=importSVGComputed(node,inherited);if(style.display==='none')return;const transform=importSVGMultiply(matrix,importSVGTransform(node.getAttribute('transform')));
   if(tag==='g'&&!importSVGNeedsGroupRaster(style)){for(const child of node.children)await visit(child,transform,style,[...ancestors,node]);return;}
   if(['g','svg','use','symbol'].includes(tag)){chunks.push({node,ancestors});return;}const native=await importSVGNative(node,transform,style,state);if(native)chunks.push(...native.map(element=>({element})));else chunks.push({node,ancestors});
  };for(const child of root.children)await visit(child,viewBox.matrix,rootStyle,[]);
  const rasterCount=chunks.filter(c=>c.node).length;whole=chunks.length>500||rasterCount*width*height>48000000;
 }
 let elements=[];if(whole){state.stats={text:0,shapes:0,images:0,flattened:0,editable:0};state.bytes=0;const layer=await importSVGRasterLayer(root,state);if(layer)elements.push(layer);state.warnings.add('This SVG uses shared styling, effects or a complex layout. It was kept as one movable image to preserve its appearance; its original text and shapes are not individually editable.');}
 else for(const chunk of chunks){check();if(chunk.element)elements.push(chunk.element);else{const layer=await importSVGRasterLayer(importSVGFragment(root,chunk.node,chunk.ancestors),state);if(layer)elements.push(layer);}}
 if(!elements.length)throw Error('This SVG has no visible artwork to import.');if(!whole&&state.stats.flattened)state.warnings.add('Curves, outlined lettering and effects were preserved as movable image layers. Their internal artwork is not editable.');if(state.stats.text)state.warnings.add('SVG text remains editable. Review font spacing and line breaks against your original design.');
 state.stats.editable=state.stats.text+state.stats.shapes+state.stats.images;check();const name=String(file.name||'Imported SVG').replace(/\.svg$/i,'').slice(0,150)||'Imported SVG';return {pages:[{id:uid(),name,width,height,background:'#ffffff',elements}],warnings:[...state.warnings],stats:state.stats};
}
