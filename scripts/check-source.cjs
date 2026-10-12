const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
for(const name of ['README.md','CREDITS.md','RIGHTS.md','THIRD_PARTY_NOTICES.md','ROADMAP.md','community-sources/PROVENANCE.json'])if(!fs.existsSync(path.join(root,name)))throw Error('Missing '+name);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');let count=0;
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)){new vm.Script(match[1],{filename:'dist/index.html script '+(++count)});}
if(!count)throw Error('No application scripts found.');
if(/appgprj_[a-f0-9]+|openai-site-verification=|C:\\Users\\/i.test(html))throw Error('Private deployment or local-path metadata found in application.');
console.log('Checked '+count+' embedded scripts and required repository documentation.');
