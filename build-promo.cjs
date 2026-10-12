const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- PROMO START -->[\s\S]*?<!-- PROMO END -->/,'');
const assets=Object.fromEntries(['nightlife','creator','wellness','fashion'].map(id=>[id,'data:image/jpeg;base64,'+fs.readFileSync('assets/people/'+id+'.jpg').toString('base64')]));
html=html.replace('</body>',()=> '\n<!-- PROMO START -->\n<style>'+fs.readFileSync('promo.css','utf8')+'</style>\n<script>\nconst promoAssets='+JSON.stringify(assets)+';\n'+fs.readFileSync('promo-data.js','utf8')+'\n'+fs.readFileSync('promo-tools.js','utf8')+'\n</script>\n<!-- PROMO END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
fs.writeFileSync('dist/index.html',html);console.log('Built 160 photo templates from 32 campaigns in 5 formats.');
