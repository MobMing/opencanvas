const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- PRODUCTIVITY START -->[\s\S]*?<!-- PRODUCTIVITY END -->/g,'').replace(/\n\/\* PRODUCTIVITY CORE START \*\/[\s\S]*?\/\* PRODUCTIVITY CORE END \*\/\n/g,'');
const marker="let design=template('bold')";if(!html.includes(marker))throw Error('Editor initialization was not found.');
html=html.replace(marker,()=> '\n/* PRODUCTIVITY CORE START */\n'+fs.readFileSync('productivity-core.js','utf8')+'\n/* PRODUCTIVITY CORE END */\n'+marker);
const hook='Object.assign(e,contextMetadata(o));';if(!html.includes('Object.assign(e,productivityMetadata(o));')){if(!html.includes(hook))throw Error('Project metadata validation was not found.');html=html.replace(hook,hook+"if(typeof productivityMetadata==='function')Object.assign(e,productivityMetadata(o));");}
html=html.replace('</body>',()=> '\n<!-- PRODUCTIVITY START -->\n<style>'+fs.readFileSync('productivity.css','utf8')+'</style>\n<script>\n'+['vendor/qrcode/qrcode.js','vendor/qrcode/qrcode_UTF8.js','productivity-tools.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\n</script>\n<!-- PRODUCTIVITY END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);fs.writeFileSync('dist/index.html',html);console.log('QR codes and photo palettes built.');
