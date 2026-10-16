// Only first-party catalog URLs may become portable project data.
function createArtworkLoader(manifest, fetcher, encode, digest) {
 const allowed=new Map(manifest.map(a=>[a.url,a])),pending=new Map();
 function contains(document){return [document,...(document.pages||[])].some(p=>(p.elements||[]).some(e=>e.type==='image'&&allowed.has(e.src)));}
 async function load(url){
  if(!allowed.has(url))throw Error('Unknown artwork source.');
  if(pending.has(url))return pending.get(url);
  const job=(async()=>{const item=allowed.get(url),response=await fetcher(url);if(!response.ok)throw Error('Artwork could not download. Check your connection and try again.');
   const bytes=await response.arrayBuffer();if(bytes.byteLength!==item.bytes||bytes.byteLength>12*1024*1024)throw Error('Artwork download was incomplete. Please try again.');
   if(await digest(bytes)!==item.sha256)throw Error('Artwork verification failed. Refresh the page and try again.');
   return encode(bytes,item.mime);
  })();pending.set(url,job);try{return await job;}finally{pending.delete(url);}
 }
 async function embed(document){
  // Work on a copy: a failed request must never leave a half-prepared project.
  const copy=JSON.parse(JSON.stringify(document)),layers=[copy,...(copy.pages||[])].flatMap(p=>p.elements||[]),sources=[...new Set(layers.filter(e=>e.type==='image'&&allowed.has(e.src)).map(e=>e.src))],resolved=new Map();
  let cursor=0;await Promise.all(Array.from({length:Math.min(4,sources.length)},async()=>{while(cursor<sources.length){const url=sources[cursor++];resolved.set(url,await load(url));}}));
  layers.forEach(e=>{if(e.type==='image'&&resolved.has(e.src))e.src=resolved.get(e.src);});return copy;
 }
 return {allowed:src=>allowed.has(src),contains,embed,load};
}
