const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- CREATE HUB START -->[\s\S]*?<!-- CREATE HUB END -->/,'');
const script=fs.readFileSync('catalog-data.js','utf8')+'\n'+fs.readFileSync('create-hub.js','utf8');
new vm.Script(script);
html=html.replace('</body>',()=> '\n<!-- CREATE HUB START -->\n<style>\n'+fs.readFileSync('create-hub.css','utf8')+'\n</style>\n<script>\n'+script+'\n</script>\n<!-- CREATE HUB END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
fs.writeFileSync('dist/index.html',html);console.log('Create hub and niche catalog built.');
