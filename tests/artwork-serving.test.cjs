const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const manifest=JSON.parse(/const artworkManifest=(\[[^\n]+\]);/.exec(html)[1]);
const collections=[['promoAssets','assets/people/PROVENANCE.json'],['atelierAssets','assets/atelier/PROVENANCE.json'],['gamingAssets','assets/gaming/PROVENANCE.json'],['openLibraryAssets','assets/open-library/manifest.json'],['signalArtworkAssets','assets/signal/PROVENANCE.json']];
const digest=bytes=>crypto.createHash('sha256').update(Buffer.from(bytes)).digest('hex');
const c=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'artwork-core.js'),'utf8'),c);
test('all gallery artwork is separate and matches its source and immutable cache filename',()=>{
 assert.doesNotMatch(html,/<script[^>]+src="artwork-/);
 assert.equal(new Set(manifest.map(a=>a.url)).size,manifest.length);
 for(const [variable,source]of collections){const values=JSON.parse(new RegExp('const '+variable+'=(\\{[^\\n]+\\});').exec(html)[1]),assets=JSON.parse(fs.readFileSync(path.join(root,source),'utf8')).assets;
  assert.deepEqual(Object.keys(values).sort(),assets.map(a=>a.id).sort());
  for(const a of assets){const url=values[a.id],item=manifest.find(m=>m.url===url),bytes=fs.readFileSync(path.join(dist,url));assert.ok(item);assert.match(url,/^artwork\/[\w-]+-[a-f0-9]{12}\.(jpg|webp)$/);assert.deepEqual(bytes,fs.readFileSync(path.join(root,a.path||'assets/people/'+a.id+'.jpg')));assert.equal(item.bytes,bytes.length);assert.equal(item.sha256,digest(bytes));assert.ok(url.includes(item.sha256.slice(0,12)));}
 }
 assert.deepEqual(fs.readdirSync(path.join(dist,'artwork')).sort(),manifest.map(a=>a.url.slice(8)).sort());
});
function loader(fetcher){return c.createArtworkLoader(manifest,fetcher,(bytes,mime)=>'data:'+mime+';base64,'+Buffer.from(bytes).toString('base64'),digest);}
function response(item,bytes){const b=bytes||fs.readFileSync(path.join(dist,item.url));return {ok:true,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};}
test('chosen artwork alone is embedded, deduplicated across pages and remains portable',async()=>{
 const items=manifest.slice(0,2),requests=[];const l=loader(async url=>{requests.push(url);return response(manifest.find(a=>a.url===url));}),original={elements:[{type:'image',src:items[0].url}],pages:[{elements:[{type:'image',src:items[0].url},{type:'image',src:items[1].url}]}]};
 assert.equal(l.contains(original),true);const prepared=await l.embed(original);assert.equal(requests.length,2);assert.equal(l.contains(prepared),false);assert.equal(original.elements[0].src,items[0].url);assert.match(prepared.elements[0].src,/^data:image\/jpeg;base64,/);assert.equal(prepared.pages[0].elements[0].src,prepared.elements[0].src);assert.deepEqual(Buffer.from(prepared.elements[0].src.split(',')[1],'base64'),fs.readFileSync(path.join(dist,items[0].url)));
});
test('failed and corrupt downloads leave the original design intact and can retry',async()=>{
 const item=manifest[0],original={elements:[{type:'image',src:item.url}]};let mode='offline';const l=loader(async()=>{if(mode==='offline')return {ok:false};const b=fs.readFileSync(path.join(dist,item.url));if(mode==='corrupt')b[20]^=1;return response(item,b);});
 await assert.rejects(l.embed(original),/could not download/);mode='corrupt';await assert.rejects(l.embed(original),/verification failed/);mode='ok';assert.match((await l.embed(original)).elements[0].src,/^data:/);assert.equal(original.elements[0].src,item.url);await assert.rejects(l.load('https://example.com/image.jpg'),/Unknown artwork/);
});
test('concurrent readers share a request, but a saved design needs no network',async()=>{
 let calls=0,release;const gate=new Promise(resolve=>release=resolve),item=manifest[0];const l=loader(async()=>{calls++;await gate;return response(item);});const a=l.load(item.url),b=l.load(item.url);release();assert.equal(await a,await b);assert.equal(calls,1);const saved={elements:[{type:'image',src:await a}]};assert.equal(l.contains(saved),false);await l.embed(saved);assert.equal(calls,1);
});
