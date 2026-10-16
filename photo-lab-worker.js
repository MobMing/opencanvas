/* Original OpenCanvas MagicTouch adapter. Runtime and model: Google, Apache-2.0. */
'use strict';
self.onmessage=async({data})=>{
 let segmenter,wasmURL,mask;
 const progress=(message,loaded=null,total=null)=>self.postMessage({type:'progress',message,loaded,total});
 try{
  if(!Number.isInteger(data.width)||!Number.isInteger(data.height)||data.width<1||data.height<1||data.width>1600||data.height>1600||data.pixels?.length!==data.width*data.height*4||![data.point?.x,data.point?.y].every(n=>Number.isFinite(n)&&n>=0&&n<=1))throw Error('Choose a point inside the photo.');
  progress('Loading subject selection tools…');importScripts('../cutout/vision_bundle.js');
  if(!await Vision.FilesetResolver.isSimdSupported())throw Error('Subject selection needs a current browser with WebAssembly SIMD. Manual brushes remain available.');
  const getManifest=async url=>{const response=await fetch(url);if(!response.ok)throw Error('The subject selection tools could not be downloaded. Check your connection and retry.');return response.json();};
  const runtime=await getManifest('../cutout/manifest.json'),model=await getManifest('./manifest.json');
  let loaded=0;const total=runtime.wasm.bytes+model.model.bytes;
  const parts=async(record,base)=>{const chunks=[];for(const part of record.parts){if(!/^[a-z0-9-]+\.bin$/.test(part.file)||part.bytes<1||part.bytes>4500000)throw Error('Invalid subject selection package. Reload the website.');const response=await fetch(base+part.file);if(!response.ok)throw Error('A subject model download failed. Check your connection and retry.');const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length!==part.bytes)throw Error('A subject model download was incomplete.');const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes));if(Array.from(digest,n=>n.toString(16).padStart(2,'0')).join('')!==part.sha256)throw Error('A subject model download could not be verified.');chunks.push(bytes);loaded+=bytes.length;progress('Downloading subject selection tools…',loaded,total);}return chunks;};
  const wasm=await parts(runtime.wasm,'../cutout/'),modelParts=await parts(model.model,'./');
  progress('Preparing subject selection…',total,total);wasmURL=URL.createObjectURL(new Blob(wasm,{type:'application/wasm'}));
  const canvas=new OffscreenCanvas(data.width,data.height),source=new OffscreenCanvas(data.width,data.height);source.getContext('2d').putImageData(new ImageData(data.pixels,data.width,data.height),0,0);
  segmenter=await Vision.InteractiveSegmenter.createFromOptions({wasmLoaderPath:new URL('../cutout/vision_wasm_internal.js',self.location.href).href,wasmBinaryPath:wasmURL},{baseOptions:{modelAssetBuffer:new Uint8Array(await new Blob(modelParts).arrayBuffer()),delegate:'CPU'},canvas});
  progress('Finding the selected subject…');segmenter.setImage(source);mask=segmenter.segment([{brushMode:1,point:[data.point],isCompleted:true}]);
  const confidence=new Float32Array(mask.getAsFloat32Array());let count=0;for(const value of confidence){if(!Number.isFinite(value))throw Error('The subject mask could not be read. Try another selection.');if(value>.5)count++;}
  if(count/confidence.length<.001)throw Error('No clear subject found. Click nearer its center or try a clearer photo.');
  self.postMessage({type:'result',confidence,width:mask.width,height:mask.height},[confidence.buffer]);
 }catch(error){self.postMessage({type:'error',message:error?.message||'Subject selection failed. The photo is unchanged.'});}
 finally{mask?.close();segmenter?.close();if(wasmURL)URL.revokeObjectURL(wasmURL);self.close();}
};
