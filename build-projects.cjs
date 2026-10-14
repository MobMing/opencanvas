const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8');
const old="window.addEventListener('beforeunload',saveNow);renderSidebar();renderInspector();updateControls();fit();saveNow();";
const replacement="/* PROJECT STARTUP: IndexedDB restores before the first save. */renderSidebar();renderInspector();updateControls();fit();";
if(html.includes(old))html=html.replace(old,replacement);
else if(!html.includes(replacement))throw Error('Project startup anchor not found; refusing to leave the legacy startup saver active.');
for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
fs.writeFileSync('dist/index.html',html);console.log('Project startup uses the restored workspace, without saving a phantom starter.');
