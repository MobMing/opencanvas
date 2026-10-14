const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n\/\* FONT LIBRARY CORE START \*\/[\s\S]*?\/\* FONT LIBRARY CORE END \*\/\n?/,'').replace(/\n<!-- FONT LIBRARY START -->[\s\S]*?<!-- FONT LIBRARY END -->\n?/,'');
if(!html.includes('/* FONT LIBRARY VALIDATION */')){
 const start='function validateDesign(raw){';
 if(!html.includes(start))throw Error('Font library: project validator anchor not found.');
 html=html.replace(start,start+"/* FONT LIBRARY VALIDATION */if(typeof fontLibraryPrepareDocument==='function')raw=fontLibraryPrepareDocument(raw);");
 const family="font:fonts.includes(o.font)?o.font:'Arial'";
 if(!html.includes(family))throw Error('Font library: font validator anchor not found.');
 html=html.replace(family,"font:typeof fontLibraryResolveFamily==='function'?fontLibraryResolveFamily(o.font,raw.fontLibrary,fonts):(fonts.includes(o.font)?o.font:'Arial')");
 const finish='return validatePages(raw,d,validateDesign)';
 if(!html.includes(finish))throw Error('Font library: multipage validator anchor not found.');
 html=html.replace(finish,"return typeof fontLibraryFinalizeDocument==='function'?fontLibraryFinalizeDocument(validatePages(raw,d,validateDesign),raw):validatePages(raw,d,validateDesign)");
}
html=html.replace("if(!fonts.includes(raw[key]))throw Error('Unsupported font');","if(!fonts.includes(raw[key])&&!(typeof fontLibraryIsFamily==='function'&&fontLibraryIsFamily(raw[key])))throw Error('Unsupported font');");
html=html.replace('if(!fonts.includes(e.font))throw Error();',"if(!fonts.includes(e.font)&&!(typeof fontLibraryIsFamily==='function'&&fontLibraryIsFamily(e.font)))throw Error();");
if(!html.includes('const fonts='))throw Error('Font library: early core anchor not found.');
html=html.replace('const fonts=',()=> '\n/* FONT LIBRARY CORE START */\n'+fs.readFileSync('font-library-core.js','utf8')+'\n/* FONT LIBRARY CORE END */\nconst fonts=');
html=html.replace('</body>',()=> '\n<!-- FONT LIBRARY START -->\n<style>'+fs.readFileSync('font-library.css','utf8')+'</style>\n<script>\n'+fs.readFileSync('font-library-tools.js','utf8')+'\n</script>\n<!-- FONT LIBRARY END -->\n</body>');
for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
fs.writeFileSync('dist/index.html',html);console.log('Local font library and portable project fonts built.');
