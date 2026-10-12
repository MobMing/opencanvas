const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- PAGES START -->[\s\S]*?<!-- PAGES END -->/,'').replace(/\/\* PAGE CORE START \*\/[\s\S]*?\/\* PAGE CORE END \*\/\n?/,'');
const core=fs.readFileSync('pages-core.js','utf8');new vm.Script(core);
html=html.replace('function validateDesign(raw){',()=> '/* PAGE CORE START */\n'+core+'\n/* PAGE CORE END */\nfunction validateDesign(raw){');
html=html.replace("throw Error('Duplicate element IDs.');return d}","throw Error('Duplicate element IDs.');return validatePages(raw,d,validateDesign)}");
const script=fs.readFileSync('pages-features.js','utf8');new vm.Script(script);
html=html.replace('</body>',()=> '\n<!-- PAGES START -->\n<style>\n'+fs.readFileSync('pages-features.css','utf8')+'\n</style>\n<script>\n'+script+'\n</script>\n<!-- PAGES END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);fs.writeFileSync('dist/index.html',html);console.log('Pages, presentation view, and PDF export built.');
