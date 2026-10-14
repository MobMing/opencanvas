// Portable layout metadata. Guides are editor aids and never paint into exports.
function layoutGradient(raw,base){
 if(!raw||raw.version!==1||!['linear','radial'].includes(raw.type)||!Array.isArray(raw.colors)||raw.colors.length<2||raw.colors.length>3||!raw.colors.every(c=>typeof c==='string'&&/^#[a-f\d]{6}$/i.test(c))||raw.baseColor!==base)return null;
 if(!Number.isFinite(raw.angle)||raw.angle<0||raw.angle>360||!Number.isFinite(raw.cx)||raw.cx<0||raw.cx>1||!Number.isFinite(raw.cy)||raw.cy<0||raw.cy>1)return null;
 return {version:1,type:raw.type,angle:raw.angle,cx:raw.cx,cy:raw.cy,colors:raw.colors.map(c=>c.toLowerCase()),baseColor:base};
}
function layoutGradientGeometry(g,w,h){
 if(!g||!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)throw Error('Invalid gradient dimensions.');
 if(g.type==='radial'){const x=g.cx*w,y=g.cy*h;return {x,y,r:Math.max(Math.hypot(x,y),Math.hypot(w-x,y),Math.hypot(x,h-y),Math.hypot(w-x,h-y))};}
 const a=g.angle*Math.PI/180,x=Math.cos(a),y=Math.sin(a),span=(Math.abs(x)*w+Math.abs(y)*h)/2;return {x1:w/2-x*span,y1:h/2-y*span,x2:w/2+x*span,y2:h/2+y*span};
}
function layoutPaint(c,raw,base,w,h){const g=layoutGradient(raw,base);if(!g)return base;const p=layoutGradientGeometry(g,w,h),paint=g.type==='radial'?c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r):c.createLinearGradient(p.x1,p.y1,p.x2,p.y2);g.colors.forEach((color,i)=>paint.addColorStop(i/(g.colors.length-1),color));return paint;}
function layoutElementPaint(c,e){return ['rect','round','ellipse','triangle','star'].includes(e.type)?layoutPaint(c,e.fillGradient,e.color,e.w,e.h):e.color;}
function layoutDocumentPaint(c,d){return layoutPaint(c,d.backgroundGradient,d.background,d.width,d.height);}
function layoutGuides(raw,w,h){if(!Array.isArray(raw))return [];const ids=new Set();return raw.slice(0,30).filter(g=>{if(!g||typeof g.id!=='string'||!/^[-\w]{1,100}$/.test(g.id)||ids.has(g.id)||!['x','y'].includes(g.axis)||!Number.isFinite(g.value)||g.value<0||g.value>(g.axis==='x'?w:h))return false;ids.add(g.id);return true;}).map(g=>({id:g.id,axis:g.axis,value:Math.round(g.value*100)/100}));}
function layoutView(raw){return {rulers:raw?.rulers===true,guides:raw?.guides!==false,snap:raw?.snap!==false};}
function layoutPageMetadata(d){const out={},gradient=layoutGradient(d.backgroundGradient,d.background);if(gradient)out.backgroundGradient=gradient;if(d.layoutGuides!==undefined)out.layoutGuides=layoutGuides(d.layoutGuides,d.width,d.height);if(d.layoutView!==undefined)out.layoutView=layoutView(d.layoutView);return out;}
function layoutDocumentMetadata(raw,w,h){return layoutPageMetadata({...raw,width:w,height:h});}
function layoutElementMetadata(raw){const gradient=['rect','round','ellipse','triangle','star'].includes(raw.type)&&layoutGradient(raw.fillGradient,raw.color);return gradient?{fillGradient:gradient}:{};}
function layoutAdoptPage(d){const p=d.pages[d.pageIndex];for(const key of ['backgroundGradient','layoutGuides','layoutView']){if(p[key]!==undefined)d[key]=JSON.parse(JSON.stringify(p[key]));else delete d[key];}}
function layoutRulerTicks(length,scale){if(!Number.isFinite(length)||length<=0||!Number.isFinite(scale)||scale<=0)return [];const desired=65/scale,power=10**Math.floor(Math.log10(desired)),step=[1,2,5,10].map(n=>n*power).find(n=>n>=desired),minor=step/5,out=[];for(let i=0;i<=Math.floor(length/minor);i++)out.push({value:Math.round(i*minor*1000)/1000,major:i%5===0});return out;}
function layoutNearestGuide(bounds,guides,tolerance){const result={x:null,y:null};for(const axis of ['x','y']){const start=axis==='x'?bounds.x:bounds.y,size=axis==='x'?bounds.w:bounds.h;for(const g of guides.filter(g=>g.axis===axis))for(const point of [start,start+size/2,start+size]){const delta=g.value-point;if(Math.abs(delta)<=tolerance&&(!result[axis]||Math.abs(delta)<Math.abs(result[axis].delta)))result[axis]={delta,target:g.value};}}return result;}
