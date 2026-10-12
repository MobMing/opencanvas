const fs=require('node:fs'),vm=require('node:vm');
let html=fs.readFileSync('dist/index.html','utf8').replace(/\n<!-- IMPORT START -->[\s\S]*?<!-- IMPORT END -->/,'');
const bundle={main:fs.readFileSync('vendor/pdfjs/pdf.min.mjs').toString('base64'),worker:fs.readFileSync('vendor/pdfjs/pdf.worker.min.mjs').toString('base64'),assets:JSON.parse(fs.readFileSync('vendor/pdfjs/assets.json','utf8'))};
const script='const pdfImportBundle='+JSON.stringify(bundle)+';\n'+fs.readFileSync('import-core.js','utf8')+'\n'+fs.readFileSync('import-tools.js','utf8');new vm.Script(script);
const notices=fs.readdirSync('vendor/pdfjs').filter(n=>n.includes('LICENSE')).map(n=>'PDF.js '+n+'\n'+fs.readFileSync('vendor/pdfjs/'+n,'utf8')).join('\n\n').replace(/-->/g,'-- >');
html=html.replace('</body>',()=> '\n<!-- IMPORT START -->\n<!-- Bundled third-party notices\n'+notices+'\n-->\n<style>\n'+fs.readFileSync('import-tools.css','utf8')+'\n</style>\n<script>\n'+script+'\n</script>\n<!-- IMPORT END -->\n</body>');
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);fs.writeFileSync('dist/index.html',html);console.log('Self-contained PDF and image importer built.');
