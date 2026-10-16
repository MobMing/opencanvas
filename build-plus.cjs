const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- PLUS START -->[\s\S]*?<!-- PLUS END -->/,'');
html=html.replace('</body>',()=> '\n<!-- PLUS START -->\n<style>'+fs.readFileSync('studio-plus.css','utf8')+'</style>\n<script>\n'+['studio-plus-core.js','recovery-core.js','studio-plus-storage.js','studio-plus-tools.js','cutout-core.js','studio-plus-cutout.js','studio-plus-media.js','motion-upgrade-core.js','motion-upgrade.js','studio-plus-connect.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\n</script>\n<!-- PLUS END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);fs.writeFileSync('dist/index.html',html);console.log('Studio Plus built.');
