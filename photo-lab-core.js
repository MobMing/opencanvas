/* Original OpenCanvas retouching and compositing; no generative model is used. */
(function(root){
 'use strict';
 function validatePixels(pixels,width,height){if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||pixels.length!==width*height*4)throw Error('Invalid photo dimensions.');}
 function cloneStamp(target,source,width,height,x,y,offsetX,offsetY,radius,strength=1){
  validatePixels(target,width,height);validatePixels(source,width,height);
  if(![x,y,offsetX,offsetY,radius,strength].every(Number.isFinite)||radius<1)throw Error('Choose a valid brush size and sample point.');
  radius=Math.min(200,radius);strength=Math.max(0,Math.min(1,strength));
  for(let py=Math.max(0,Math.floor(y-radius));py<Math.min(height,Math.ceil(y+radius));py++)for(let px=Math.max(0,Math.floor(x-radius));px<Math.min(width,Math.ceil(x+radius));px++){
   const distance=Math.hypot(px+.5-x,py+.5-y)/radius;if(distance>=1)continue;
   const sx=Math.round(px+offsetX),sy=Math.round(py+offsetY);if(sx<0||sx>=width||sy<0||sy>=height)continue;
   const i=(py*width+px)*4,j=(sy*width+sx)*4,t=Math.min(1,(1-distance)/.7),weight=t*t*(3-2*t)*strength;
   const sa=source[j+3]/255*weight,da=target[i+3]/255,alpha=sa+da*(1-sa);if(!alpha)continue;
   for(let c=0;c<3;c++)target[i+c]=(source[j+c]*sa+target[i+c]*da*(1-sa))/alpha;
   target[i+3]=alpha*255;
  }
  return target;
 }
 function cloneLine(target,source,width,height,from,to,offset,radius,strength=1){
  if(![from?.x,from?.y,to?.x,to?.y,offset?.x,offset?.y,radius,strength].every(Number.isFinite)||radius<1)throw Error('Choose a valid brush size and sample point.');
  const steps=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/Math.max(1,radius*.3)));
  for(let i=1;i<=steps;i++)cloneStamp(target,source,width,height,from.x+(to.x-from.x)*i/steps,from.y+(to.y-from.y)*i/steps,offset.x,offset.y,radius,strength);
  return target;
 }
 function composite(foreground,background){
  if(foreground.length!==background.length||foreground.length%4)throw Error('Background dimensions do not match the cutout.');
  const out=new Uint8ClampedArray(foreground.length);
  for(let i=0;i<out.length;i+=4){const a=foreground[i+3]/255,b=background[i+3]/255,alpha=a+b*(1-a);for(let c=0;c<3;c++)out[i+c]=alpha?(foreground[i+c]*a+background[i+c]*b*(1-a))/alpha:0;out[i+3]=alpha*255;}
  return out;
 }
 function coverRect(width,height,targetWidth,targetHeight){if(![width,height,targetWidth,targetHeight].every(n=>Number.isFinite(n)&&n>0))throw Error('Invalid background size.');const scale=Math.max(targetWidth/width,targetHeight/height);return{x:(targetWidth-width*scale)/2,y:(targetHeight-height*scale)/2,w:width*scale,h:height*scale};}
 function transparency(pixels){if(!pixels.length||pixels.length%4)throw Error('Invalid photo pixels.');let clear=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<250)clear++;return clear/(pixels.length/4);}
 const api={cloneStamp,cloneLine,composite,coverRect,transparency};if(typeof module==='object'&&module.exports)module.exports=api;root.OpenCanvasPhotoLab=api;
})(typeof globalThis==='object'?globalThis:this);
