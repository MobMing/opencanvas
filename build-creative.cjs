const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- CREATIVE START -->[\s\S]*?<!-- CREATIVE END -->/,'').replace(/\n\/\* CREATIVE CORE START \*\/[\s\S]*?\/\* CREATIVE CORE END \*\/\n/,'');
const core=fs.readFileSync('creative-core.js','utf8'),js=fs.readFileSync('creative-tools.js','utf8');new vm.Script(core+'\n'+js);
const stateMarker="let design=template('bold')";if(!html.includes(stateMarker))throw Error('Original editor initialization was not found.');
html=html.replace(stateMarker,()=> '\n/* CREATIVE CORE START */\n'+core+'\n/* CREATIVE CORE END */\n'+stateMarker);
if(!html.includes("if(e.type==='image'&&typeof photoStudioMetadata==='function')Object.assign(e,photoStudioMetadata(o));")){
 const validationMarker='Object.assign(e,contextMetadata(o));return e';if(!html.includes(validationMarker))throw Error('Image validation hook was not found.');
 html=html.replace(validationMarker,"Object.assign(e,contextMetadata(o));if(e.type==='image'&&typeof photoStudioMetadata==='function')Object.assign(e,photoStudioMetadata(o));return e");
}
html=html.replace('</body>',()=> '\n<!-- CREATIVE START -->\n<style>\n'+fs.readFileSync('creative-tools.css','utf8')+'\n</style>\n<script>\n'+js+'\n</script>\n<!-- CREATIVE END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);fs.writeFileSync('dist/index.html',html);console.log('Creative tools built.');
