const fs=require('node:fs'),vm=require('node:vm');
const crypto=require('node:crypto');
// Keep the initial page small and let browsers cache each image independently.
const artworkManifest=[];
function artworkScripts(name,variable,assets){
 fs.mkdirSync('dist/artwork',{recursive:true});const urls={};
 for(const [id,src] of Object.entries(assets)){
  const [,mime,encoded]=/^data:([^;]+);base64,(.+)$/.exec(src),bytes=Buffer.from(encoded,'base64'),sha256=crypto.createHash('sha256').update(bytes).digest('hex'),ext=mime==='image/jpeg'?'jpg':mime.split('/')[1],url='artwork/'+name+'-'+id+'-'+sha256.slice(0,12)+'.'+ext;
  fs.writeFileSync('dist/'+url,bytes);urls[id]=url;artworkManifest.push({url,mime,bytes:bytes.length,sha256});
 }
 return 'const '+variable+'='+JSON.stringify(urls)+';';
}
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- PROMO START -->[\s\S]*?<!-- PROMO END -->/,'');
html=html.replace(/Array\.from\(new Set\(nicheTemplates\.map\(t=>t\.topic\)\)\)(?:\.filter\(t=>t!=="Community"\))*/g,'Array.from(new Set(nicheTemplates.map(t=>t.topic))).filter(t=>t!=="Community")');
const assets=Object.fromEntries(JSON.parse(fs.readFileSync('assets/people/PROVENANCE.json','utf8')).assets.map(a=>a.id).map(id=>[id,'data:image/jpeg;base64,'+fs.readFileSync('assets/people/'+id+'.jpg').toString('base64')]));
const icons=JSON.parse(fs.readFileSync('assets/lucide/rendered.json','utf8'));
const atelier=Object.fromEntries(JSON.parse(fs.readFileSync('assets/atelier/PROVENANCE.json','utf8')).assets.map(a=>[a.id,'data:image/webp;base64,'+fs.readFileSync(a.path).toString('base64')]));
const openInfo=JSON.parse(fs.readFileSync('assets/open-library/manifest.json','utf8')).assets;
const openAssets=Object.fromEntries(openInfo.map(a=>[a.id,'data:image/webp;base64,'+fs.readFileSync(a.path).toString('base64')]));
const signalArtworkAssets=Object.fromEntries(JSON.parse(fs.readFileSync('assets/signal/PROVENANCE.json','utf8')).assets.map(a=>[a.id,'data:image/webp;base64,'+fs.readFileSync(a.path).toString('base64')]));
const gaming=Object.fromEntries(JSON.parse(fs.readFileSync('assets/gaming/PROVENANCE.json','utf8')).assets.map(a=>[a.id,'data:image/webp;base64,'+fs.readFileSync(a.path).toString('base64')]));
const artworkTags=[artworkScripts('people','promoAssets',assets),artworkScripts('atelier','atelierAssets',atelier),artworkScripts('gaming','gamingAssets',gaming),artworkScripts('library','openLibraryAssets',openAssets),artworkScripts('signal','signalArtworkAssets',signalArtworkAssets)].join('\n');
const keep=new Set(artworkManifest.map(a=>a.url.slice(8)));for(const file of fs.readdirSync('dist/artwork'))if(!keep.has(file))fs.unlinkSync('dist/artwork/'+file);for(const file of fs.readdirSync('dist'))if(/^artwork-[a-z]+-\d+\.js$/.test(file))fs.unlinkSync('dist/'+file);
html=html.replace('</body>',()=> '\n<!-- PROMO START -->\n<style>'+fs.readFileSync('promo.css','utf8')+'</style>\n<script>\n'+artworkTags+'\nconst artworkManifest='+JSON.stringify(artworkManifest)+';\n'+fs.readFileSync('artwork-core.js','utf8')+'\n'+fs.readFileSync('artwork-tools.js','utf8')+'\nconst waveIcons='+JSON.stringify(icons)+';\nconst openLibraryInfo='+JSON.stringify(openInfo)+';\n'+fs.readFileSync('promo-scenes.js','utf8')+'\n'+fs.readFileSync('promo-data.js','utf8')+'\n'+fs.readFileSync('promo-layouts.js','utf8')+'\n'+fs.readFileSync('remix-core.js','utf8')+'\n'+fs.readFileSync('people-collection.js','utf8')+'\n'+fs.readFileSync('studio-collection.js','utf8')+'\n'+fs.readFileSync('reference-collection.js','utf8')+'\n'+fs.readFileSync('city-collection.js','utf8')+'\n'+fs.readFileSync('discovery-collection.js','utf8')+'\n'+fs.readFileSync('wave-collection.js','utf8')+'\n'+fs.readFileSync('flyer-collection.js','utf8')+'\n'+fs.readFileSync('atelier-collection.js','utf8')+'\n'+fs.readFileSync('signature-collection.js','utf8')+'\n'+fs.readFileSync('gaming-collection.js','utf8')+'\n'+fs.readFileSync('category-collection.js','utf8')+'\n'+fs.readFileSync('category-browse.js','utf8')+'\n'+fs.readFileSync('library-briefs.js','utf8')+'\n'+fs.readFileSync('library-art-direction.js','utf8')+'\n'+fs.readFileSync('library-layouts.js','utf8')+'\n'+fs.readFileSync('signal-collection.js','utf8')+'\n'+fs.readFileSync('promo-tools.js','utf8')+'\n'+fs.readFileSync('library-tools.js','utf8')+'\n'+fs.readFileSync('remix-tools.js','utf8')+'\n</script>\n<!-- PROMO END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
require('./build-artwork-credits.cjs');
fs.writeFileSync('dist/index.html',html);console.log('Built the expanded collection with '+Object.keys(assets).length+' generated assets.');
