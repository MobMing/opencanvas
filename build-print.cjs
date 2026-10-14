const fs=require('node:fs'),vm=require('node:vm');let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- PRINT START -->[\s\S]*?<!-- PRINT END -->/,'');
const js=fs.readFileSync('print-core.js','utf8')+'\n'+fs.readFileSync('print-tools.js','utf8');new vm.Script(js);
html=html.replace('</body>',()=> '\n<!-- PRINT START -->\n<style>'+fs.readFileSync('print.css','utf8')+'</style>\n<script>\n'+js+'\n</script>\n<!-- PRINT END -->\n</body>');
for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);fs.writeFileSync('dist/index.html',html);console.log('Physical print controls, bleed, crop marks and PDF export built.');
