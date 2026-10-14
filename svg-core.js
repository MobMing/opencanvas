// Standalone SVG serialization. Image layers are supplied as embedded raster pixels;
// text, geometry, gradients, descriptions and links stay native to SVG.
function svgEscape(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));}
function svgNumber(value){if(!Number.isFinite(Number(value)))throw Error('A layer has invalid dimensions.');return String(Math.round(Number(value)*10000)/10000);}
function svgColor(value){if(!/^#[0-9a-f]{6}$/i.test(value||''))throw Error('A layer has an invalid color.');return value;}
function svgSafeLink(value){if(!value)return '';try{const u=new URL(value);return ['https:','http:','mailto:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
function svgFontRule(family,source,weight='400',style='normal'){
 // Export only embedded binary fonts; never preserve a network URL or arbitrary CSS.
 const match=String(source||'').trim().match(/^url\(\s*(["']?)(data:(?:font\/(?:ttf|otf|woff2?)|application\/font-woff);base64,[A-Za-z0-9+/]+={0,2})\1\s*\)(?:\s+format\(\s*(["'])(truetype|opentype|woff2?)\3\s*\))?$/i);
 if(!match||typeof family!=='string'||!family||family.length>160||/[\u0000-\u001f\u007f]/.test(family))return '';
 const escaped=family.replace(/\\/g,'\\\\').replace(/"/g,'\\"'),validWeight=/^\d{1,4}(?: \d{1,4})?$/.test(weight)&&weight.split(' ').every(n=>Number(n)>=1&&Number(n)<=1000),safeWeight=validWeight||['normal','bold'].includes(weight)?weight:'400',safeStyle=['normal','italic','oblique'].includes(style)?style:'normal';
 return '@font-face{font-family:"'+escaped+'";src:url("'+match[2]+'")'+(match[4]?' format("'+match[4]+'")':'')+';font-weight:'+safeWeight+';font-style:'+safeStyle+'}';
}
function svgShape(e){const w=svgNumber(e.w),h=svgNumber(e.h);if(e.type==='ellipse')return '<ellipse cx="'+svgNumber(e.w/2)+'" cy="'+svgNumber(e.h/2)+'" rx="'+svgNumber(e.w/2)+'" ry="'+svgNumber(e.h/2)+'"/>';
 if(e.type==='triangle')return '<polygon points="'+svgNumber(e.w/2)+',0 '+w+','+h+' 0,'+h+'"/>';
 if(e.type==='star'){const points=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12-Math.PI/2,r=i%2?.3:.5;return svgNumber(e.w/2+Math.cos(a)*e.w*r)+','+svgNumber(e.h/2+Math.sin(a)*e.h*r);});return '<polygon points="'+points.join(' ')+'"/>';}
 if(!['rect','round'].includes(e.type))throw Error('SVG export does not support the '+e.type+' layer type.');
 return '<rect width="'+w+'" height="'+h+'"'+(e.type==='round'?' rx="'+svgNumber(Math.min(e.w,e.h)*.12)+'"':'')+'/>';
}
function svgGradientDefinition(raw,base,w,h,id){
 if(!raw||raw.baseColor!==base)return null;const colors=raw.colors;if(!['linear','radial'].includes(raw.type)||!Array.isArray(colors)||colors.length<2||colors.length>3)return null;
 const stops=colors.map((c,i)=>'<stop offset="'+svgNumber(i/(colors.length-1))+'" stop-color="'+svgColor(c)+'"/>').join('');
 if(raw.type==='linear'){const a=Number(raw.angle)*Math.PI/180,c=Math.cos(a),s=Math.sin(a),span=(Math.abs(c)*w+Math.abs(s)*h)/2;return '<linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="'+svgNumber(w/2-c*span)+'" y1="'+svgNumber(h/2-s*span)+'" x2="'+svgNumber(w/2+c*span)+'" y2="'+svgNumber(h/2+s*span)+'">'+stops+'</linearGradient>';}
 const x=Number(raw.cx)*w,y=Number(raw.cy)*h,r=Math.max(...[[0,0],[w,0],[0,h],[w,h]].map(([a,b])=>Math.hypot(x-a,y-b)));return '<radialGradient id="'+id+'" gradientUnits="userSpaceOnUse" cx="'+svgNumber(x)+'" cy="'+svgNumber(y)+'" r="'+svgNumber(r)+'">'+stops+'</radialGradient>';
}
function svgText(e,c,id){
 c.font=typeFont(e);c.textAlign='left';const fill=svgColor(e.color),effect=e.textEffect||'none',ink=svgColor(e.effectColor||'#203e36'),amount=e.size*(e.effectAmount||5)/100;
 const attrs=' font-family="'+svgEscape(e.font)+'" font-size="'+svgNumber(e.size)+'" font-weight="'+svgEscape(e.weight)+'" font-style="'+(e.italic?'italic':'normal')+'" xml:space="preserve"';
 const text=(word,x,y,extra='')=>'<text x="'+svgNumber(x)+'" y="'+svgNumber(y)+'"'+attrs+extra+'>'+svgEscape(word)+'</text>';
 const paint=(word,x,y)=>{let out='';if(effect==='shadow')out+=text(word,x+amount,y+amount,' fill="'+ink+'"');if(effect==='glow')out+=text(word,x,y,' fill="'+fill+'" filter="url(#'+id+'-glow)"');if(effect==='outline'||effect==='hollow')out+=text(word,x,y,' fill="none" stroke="'+ink+'" stroke-width="'+svgNumber(amount)+'" stroke-linejoin="round"');if(effect!=='hollow')out+=text(word,x,y,' fill="'+fill+'"');return out;};
 let out='';if(e.curve){const layout=typeCurveLayout(c,e),fit=Math.min(1,Math.max(1,e.h)/layout.height),offset=e.align==='center'?(e.w-e.w*fit)/2:e.align==='right'?e.w-e.w*fit:0;out+='<g transform="translate('+svgNumber(offset)+' 0) scale('+svgNumber(fit)+')">';for(const line of layout.lines){out+='<g transform="translate('+svgNumber(line.x)+' '+svgNumber(line.y)+') scale('+svgNumber(line.scale)+') translate('+svgNumber(-line.minX+line.padding)+' '+svgNumber(-line.minY+line.padding)+')">';for(const glyph of line.glyphs)out+='<g transform="translate('+svgNumber(glyph.x)+' '+svgNumber(glyph.y)+') rotate('+svgNumber(glyph.rotation*180/Math.PI)+')">'+paint(glyph.text,-glyph.width/2,0)+'</g>';out+='</g>';}out+='</g>';}
 else{c.textBaseline='alphabetic';const a=c.measureText('Hg').actualBoundingBoxAscent;c.textBaseline='top';const t=c.measureText('Hg').actualBoundingBoxAscent;const baseline=Number.isFinite(a)&&Number.isFinite(t)?a-t:e.size*.8;typeLines(c,e).forEach((line,i)=>{const width=typeWidth(c,line,e);let x=e.align==='center'?(e.w-width)/2:e.align==='right'?e.w-width:0;const y=i*e.size*(e.lineHeight||1.15)+baseline;if(e.tracking){for(const ch of Array.from(line)){out+=paint(ch,x,y);x+=c.measureText(ch).width+e.tracking*e.size;}}else out+=paint(line,x,y);});}
 const def=effect==='glow'?'<filter id="'+id+'-glow" x="-100%" y="-100%" width="300%" height="300%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="'+svgNumber(amount*1.5)+'" result="blur"/><feFlood flood-color="'+ink+'"/><feComposite in2="blur" operator="in"/></filter>':'';return {body:out,def};
}
function makeDesignSVG(page,context,options={}){
 if(!page||!Array.isArray(page.elements)||page.elements.length>500||page.width<1||page.height<1)throw Error('Choose a valid design page.');
 const defs=[],body=[],images=options.images||{},title=page.name||options.title||'OpenCanvas design';
 if(!options.transparent){const g=svgGradientDefinition(page.backgroundGradient,page.background,page.width,page.height,'page-gradient');if(g)defs.push(g);body.push('<rect width="100%" height="100%" fill="'+(g?'url(#page-gradient)':svgColor(page.background))+'"/>');}
 page.elements.forEach((e,index)=>{const id='layer-'+index;let content='',gradient;
  if(e.type==='text'){const text=svgText(e,context,id);content=text.body;if(text.def)defs.push(text.def);}
  else if(e.type==='image'){const src=images[e.id];if(typeof src!=='string'||!/^data:image\/(?:png|jpeg|webp);base64,[a-z\d+/=]+$/i.test(src))throw Error('An image could not be embedded.');content='<image width="'+svgNumber(e.w)+'" height="'+svgNumber(e.h)+'" preserveAspectRatio="none" href="'+svgEscape(src)+'"/>';}
  else{gradient=svgGradientDefinition(e.fillGradient,e.color,e.w,e.h,id+'-gradient');if(gradient)defs.push(gradient);content='<g fill="'+(gradient?'url(#'+id+'-gradient)':svgColor(e.color))+'">'+svgShape(e)+'</g>';}
  const label=e.altText||e.text||e.type;content='<g id="'+id+'" opacity="'+svgNumber(e.opacity??1)+'" transform="translate('+svgNumber(e.x+e.w/2)+' '+svgNumber(e.y+e.h/2)+') rotate('+svgNumber(e.rotation||0)+') translate('+svgNumber(-e.w/2)+' '+svgNumber(-e.h/2)+')"><title>'+svgEscape(label)+'</title>'+content+'</g>';
  const link=svgSafeLink(e.link);if(link)content='<a href="'+svgEscape(link)+'">'+content+'</a>';body.push(content);
 });
 if(options.fontCSS)defs.unshift('<style>'+svgEscape(options.fontCSS)+'</style>');
 return '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="'+svgNumber(page.width)+'" height="'+svgNumber(page.height)+'" viewBox="0 0 '+svgNumber(page.width)+' '+svgNumber(page.height)+'" role="img" aria-labelledby="design-title design-desc"><title id="design-title">'+svgEscape(title)+'</title><desc id="design-desc">'+svgEscape(options.description||'Created with OpenCanvas. Text and shapes are vector objects; photographs and drawn artwork are embedded images.')+'</desc><defs>'+defs.join('')+'</defs>'+body.join('')+'</svg>';
}
