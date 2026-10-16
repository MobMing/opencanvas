const fs=require('node:fs'),vm=require('node:vm');
const crypto=require('node:crypto');
// Ship small cacheable artwork bundles; projects still embed their selected images.
function artworkScripts(name,variable,assets){
 const groups=[];let group={},size=0;
 for(const [id,data] of Object.entries(assets)){const bytes=Buffer.byteLength(JSON.stringify([id,data]));if(size+bytes>8_000_000&&Object.keys(group).length){groups.push(group);group={};size=0;}group[id]=data;size+=bytes;}groups.push(group);
 return groups.map((entries,i)=>{const body=(i===0?'const '+variable+'={};\n':'')+'Object.assign('+variable+','+JSON.stringify(entries)+');\n',file='artwork-'+name+'-'+(i+1)+'.js',hash=crypto.createHash('sha256').update(body).digest('hex').slice(0,12);new vm.Script(body);fs.writeFileSync('dist/'+file,body);return '<script src="'+file+'?v='+hash+'"></script>';}).join('\n');
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
html=html.replace('</body>',()=> '\n<!-- PROMO START -->\n<style>'+fs.readFileSync('promo.css','utf8')+'</style>\n'+artworkTags+'\n<script>\nconst waveIcons='+JSON.stringify(icons)+';\nconst openLibraryInfo='+JSON.stringify(openInfo)+';\n'+fs.readFileSync('promo-scenes.js','utf8')+'\n'+fs.readFileSync('promo-data.js','utf8')+'\n'+fs.readFileSync('promo-layouts.js','utf8')+'\n'+fs.readFileSync('remix-core.js','utf8')+'\n'+fs.readFileSync('people-collection.js','utf8')+'\n'+fs.readFileSync('studio-collection.js','utf8')+'\n'+fs.readFileSync('reference-collection.js','utf8')+'\n'+fs.readFileSync('city-collection.js','utf8')+'\n'+fs.readFileSync('discovery-collection.js','utf8')+'\n'+fs.readFileSync('wave-collection.js','utf8')+'\n'+fs.readFileSync('flyer-collection.js','utf8')+'\n'+fs.readFileSync('atelier-collection.js','utf8')+'\n'+fs.readFileSync('signature-collection.js','utf8')+'\n'+fs.readFileSync('gaming-collection.js','utf8')+'\n'+fs.readFileSync('category-collection.js','utf8')+'\n'+fs.readFileSync('category-browse.js','utf8')+'\n'+fs.readFileSync('library-briefs.js','utf8')+'\n'+fs.readFileSync('library-art-direction.js','utf8')+'\n'+fs.readFileSync('library-layouts.js','utf8')+'\n'+fs.readFileSync('signal-collection.js','utf8')+'\n'+fs.readFileSync('promo-tools.js','utf8')+'\n'+fs.readFileSync('library-tools.js','utf8')+'\n'+fs.readFileSync('remix-tools.js','utf8')+'\n</script>\n<!-- PROMO END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
require('./build-artwork-credits.cjs');
fs.writeFileSync('dist/index.html',html);console.log('Built the expanded collection with '+Object.keys(assets).length+' generated assets.');
