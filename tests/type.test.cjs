const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
const html=fs.readFileSync('dist/index.html','utf8'),c={uid:()=>crypto.randomUUID(),clone:o=>JSON.parse(JSON.stringify(o)),fonts:['Arial','Georgia','Verdana','Trebuchet MS','Courier New','Impact','Bangers','Creepster','Kalam','Anton','Bebas Neue','DM Sans','Cormorant Garamond','Caveat']};vm.createContext(c);c.URL=URL;vm.runInContext(fs.readFileSync('context-core.js','utf8'),c);vm.runInContext(fs.readFileSync('type-core.js','utf8')+'\nthis.presets=typePresets;',c);vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);vm.runInContext(fs.readFileSync('pages-core.js','utf8'),c);vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
test('all font combinations remain editable and round-trip their effects through multipage projects',()=>{for(const p of c.presets){const elements=c.typeCombination(p,1080,1350).map(e=>({...e,id:crypto.randomUUID()})),d={id:'project',name:p.name,width:1080,height:1350,background:'#ffffff',elements};c.ensurePages(d);const out=c.validateDesign(JSON.parse(JSON.stringify(d)));assert.equal(out.elements.length,p.parts.length);for(let i=0;i<elements.length;i++){assert.equal(out.elements[i].font,elements[i].font);assert.equal(out.elements[i].textEffect,elements[i].textEffect);assert.equal(out.elements[i].tracking,elements[i].tracking);assert.ok(out.elements[i].type==='text')}}});
test('legacy text has neutral styling and invalid style data cannot enter projects',()=>{const s=c.typeStyle({});assert.equal(s.lineHeight,1.15);assert.equal(s.textEffect,'none');for(const x of [{tracking:Infinity},{tracking:1},{lineHeight:0},{effectAmount:50},{textEffect:'unknown'}])assert.throws(()=>c.typeStyle(x));assert.equal(c.typeStyle({effectColor:'url(x)'}).effectColor,'#203e36')});
test('letter spacing and wrapping use the same width, with blank lines preserved',()=>{const ctx={measureText:s=>({width:Array.from(s).length*10})},e={size:100,tracking:.1,w:55,text:'ab cd\n\nef'};assert.equal(c.typeWidth(ctx,'ab',e),30);assert.deepEqual(Array.from(c.typeLines(ctx,e)),['ab','cd','','ef']);assert.equal(c.typeWidth(ctx,'ab',{...e,tracking:0}),20)});
test('custom headline replaces only requested wording and does not mutate preset',()=>{const p=c.presets[0],old=p.parts[0].text,parts=c.typeCombination(p,800,600,'My headline','');assert.equal(parts[0].text,'My headline');assert.equal(parts[1].text,p.parts[1].text);assert.equal(p.parts[0].text,old)});

test('oversized catalog headlines fit using tracking and actual line height without a fixed shrink limit',()=>{
 c.ctx={font:'',measureText(text){const size=Number(this.font.match(/([\d.]+)px/)?.[1]||10);return{width:text.length*size*.55}}};
 vm.runInContext(fs.readFileSync('create-hub.js','utf8').split('\n').find(line=>line.startsWith('function fitCatalogText')),c);
 const e={type:'text',text:'A VERY LONG HEADLINE\nSECOND LINE',font:'Anton',weight:'400',size:500,w:400,h:145,tracking:.2,lineHeight:1.7};
 c.fitCatalogText({elements:[e]});c.ctx.font=c.typeFont(e);
 assert.ok(e.size<380,'must shrink more than the old 120-step limit');assert.ok(e.size>=8);
 assert.ok(c.typeLines(c.ctx,e).length*e.size*e.lineHeight<=e.h+.1);
 assert.ok(e.text.split(/\s+/).every(word=>c.typeWidth(c.ctx,word,e)<=e.w+.1));assert.equal(e.font,'Anton');
});

test('catalog fit preserves a short title size and text geometry when it already fits',()=>{
 const e={type:'text',text:'NIGHT',font:'Bebas Neue',weight:'400',size:100,w:400,h:105,tracking:0,lineHeight:1};
 c.fitCatalogText({elements:[e]});assert.equal(e.size,100);assert.equal(e.w,400);assert.equal(e.h,105);
});
