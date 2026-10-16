// Gallery images remain cacheable files; selected projects embed the exact pixels.
const artworkLoader=createArtworkLoader(artworkManifest,url=>fetch(url),async(bytes,mime)=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Could not prepare this artwork.'));reader.readAsDataURL(new Blob([bytes],{type:mime}));}),async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join(''));
function artworkSourceAllowed(src){return artworkLoader.allowed(src);}
const artworkLoadImage=loadImage;
loadImage=function(src){const previous=imageCache.get(src);if(artworkSourceAllowed(src)&&previous?.complete&&!previous.naturalWidth)imageCache.delete(src);return artworkLoadImage(src);};
const artworkPaintCard=paintTemplateCard;
const artworkThumbnailJobs=new WeakMap();
const artworkObserved=new Set();
const artworkObserver=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const job=artworkThumbnailJobs.get(entry.target);artworkObserver.unobserve(entry.target);artworkObserved.delete(entry.target);artworkThumbnailJobs.delete(entry.target);if(job&&entry.target.isConnected)job();}},{rootMargin:'220px'});
paintTemplateCard=function(canvas,document){
 canvas.width=300;canvas.height=Math.round(300*document.height/document.width);canvas.style.aspectRatio=document.width+' / '+document.height;
 const paint=()=>artworkPaintCard(canvas,document);
 if(!artworkObserver){paint();return;}for(const old of artworkObserved)if(!old.isConnected){artworkObserver.unobserve(old);artworkObserved.delete(old);artworkThumbnailJobs.delete(old);}artworkThumbnailJobs.set(canvas,paint);artworkObserved.add(canvas);artworkObserver.observe(canvas);
};
const artworkStartDesign=startDesign;
let artworkOpening=false;
startDesign=function(next,options={}){
 if(!artworkLoader.contains(next))return artworkStartDesign(next);
 if(artworkOpening){toast('Preparing your design. Please wait.');return Promise.resolve(false);}
 artworkOpening=true;const previous=design,signature=JSON.stringify(design);toast('Preparing your design and its images…');
 return artworkLoader.embed(next).then(async ready=>{
  if(options.isCurrent?.()===false||design!==previous||JSON.stringify(design)!==signature){toast('Your current design changed. Choose the template again when you are ready.');return false;}
  // Do not replace an edited project if its local save failed.
  const saving=saveNow(),savedSignature=JSON.stringify(design);if(await saving===false)throw Error('Save your current project backup before opening another design.');if(options.isCurrent?.()===false||design!==previous||JSON.stringify(design)!==savedSignature)return false;
  artworkStartDesign(ready);return true;
 }).catch(error=>{toast(error.message);return false;}).finally(()=>{artworkOpening=false;});
};
// The sidebar and gallery share the same preview/preparation path.
openTemplate=function(id){openTemplatePreview(id,document.activeElement);};
