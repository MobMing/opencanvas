const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
const html=fs.readFileSync('dist/index.html','utf8'),c={uid:()=>crypto.randomUUID(),clone:o=>JSON.parse(JSON.stringify(o)),fonts:['Arial','Georgia','Verdana','Trebuchet MS','Courier New','Impact','Bangers','Creepster','Kalam','Anton','Bebas Neue','DM Sans','Cormorant Garamond','Caveat']};vm.createContext(c);c.URL=URL;vm.runInContext(fs.readFileSync('context-core.js','utf8'),c);vm.runInContext(fs.readFileSync('type-core.js','utf8')+'\nthis.presets=typePresets;',c);vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);vm.runInContext(fs.readFileSync('pages-core.js','utf8'),c);vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
test('all font combinations remain editable and round-trip their effects through multipage projects',()=>{for(const p of c.presets){const elements=c.typeCombination(p,1080,1350).map(e=>({...e,id:crypto.randomUUID()})),d={id:'project',name:p.name,width:1080,height:1350,background:'#ffffff',elements};c.ensurePages(d);const out=c.validateDesign(JSON.parse(JSON.stringify(d)));assert.equal(out.elements.length,p.parts.length);for(let i=0;i<elements.length;i++){assert.equal(out.elements[i].font,elements[i].font);assert.equal(out.elements[i].textEffect,elements[i].textEffect);assert.equal(out.elements[i].tracking,elements[i].tracking);assert.ok(out.elements[i].type==='text')}}});
test('legacy text has neutral styling and invalid style data cannot enter projects',()=>{const s=c.typeStyle({});assert.equal(s.lineHeight,1.15);assert.equal(s.textEffect,'none');assert.equal(s.curve,0);for(const x of [{tracking:Infinity},{tracking:1},{lineHeight:0},{effectAmount:50},{textEffect:'unknown'},{curve:Infinity},{curve:NaN},{curve:181},{curve:-181},{curve:'90'}])assert.throws(()=>c.typeStyle(x));assert.equal(c.typeStyle({effectColor:'url(x)'}).effectColor,'#203e36')});
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

function curveContext(){return{font:'',measureText(text){const size=Number(this.font.match(/([\d.]+)px/)?.[1]||40),width=Array.from(text).length*size*.55;return{width,actualBoundingBoxLeft:size*.02,actualBoundingBoxRight:width+size*.02,actualBoundingBoxAscent:size*.78,actualBoundingBoxDescent:size*.18};}};}
const curveText={type:'text',text:'FOLLOW THE SOUND',x:30,y:20,w:720,h:450,font:'Anton',weight:'400',size:72,lineHeight:1.15,tracking:.05,curve:110,align:'center',rotation:0,opacity:.85,color:'#203e36',textEffect:'none',effectColor:'#eaa044',effectAmount:5};

test('positive and negative arc text use opposite tangent rotations and measured bounds within the box',()=>{
 for(const curve of [-180,-90,-.01,.01,90,180])for(const w of [20,180,720])for(const effect of ['none','outline','hollow','shadow','glow']){
  const ctx=curveContext(),e={...curveText,text:'ARCS',curve,w,textEffect:effect},layout=c.typeCurveLayout(ctx,e);assert.ok(Number.isFinite(layout.height)&&layout.height>0);
  for(const line of layout.lines){assert.ok(line.x>=-.001&&line.x+line.width<=w+.001);assert.ok(line.y>=0&&line.y+line.height<=layout.height+.001);
   const gs=line.glyphs;if(gs.length>1){assert.equal(Math.sign(gs[0].rotation),-Math.sign(curve));assert.equal(Math.sign(gs.at(-1).rotation),Math.sign(curve));}
   for(const g of gs){const cos=Math.cos(g.rotation),sin=Math.sin(g.rotation);for(const [x,y]of[[g.left,g.top],[g.right,g.top],[g.right,g.bottom],[g.left,g.bottom]]){const px=line.x+(g.x+x*cos-y*sin-line.minX+line.padding)*line.scale,py=line.y+(g.y+x*sin+y*cos-line.minY+line.padding)*line.scale;assert.ok(px>=-.001&&px<=w+.001);assert.ok(py>=-.001&&py<=layout.height+.001);}}
  }
 }
});

test('arc wrapping preserves explicit blank lines, grapheme clusters and connected-script words',()=>{
 const ctx=curveContext(),e={...curveText,text:'ONE TWO\n\nTHREE FOUR',size:40,w:130},lines=Array.from(c.typeLines(ctx,e));
 const layout=c.typeCurveLayout(ctx,e);assert.deepEqual(Array.from(layout.lines,l=>l.text),lines);assert.ok(layout.lines.some(l=>l.text===''&&l.height>0));
 for(let i=1;i<layout.lines.length;i++)assert.ok(layout.lines[i].y>=layout.lines[i-1].y+layout.lines[i-1].height,'wrapped arcs never overlap');
 assert.deepEqual(Array.from(c.typeCurveUnits('A👨‍👩‍👧‍👦é')),['A','👨‍👩‍👧‍👦','é']);assert.deepEqual(Array.from(c.typeCurveUnits('سلام دنیا')),['سلام',' ','دنیا']);
 assert.equal(c.typeTextHeight(ctx,e),layout.height);assert.equal(c.typeTextHeight(ctx,{...e,curve:0}),lines.length*e.size*e.lineHeight);
});

test('arc geometry measures from the alphabetic baseline and restores the caller baseline',()=>{
 const ctx=curveContext(),measure=ctx.measureText;ctx.textBaseline='top';ctx.measureText=function(text){assert.equal(this.textBaseline,'alphabetic');return measure.call(this,text);};
 const layout=c.typeCurveLayout(ctx,curveText);assert.ok(layout.height>0);assert.equal(ctx.textBaseline,'top');
});

test('arc amount, effects and tracking survive editable multipage save and import without changing words',()=>{
 const elements=[{...curveText,id:'arc-up'},{...curveText,id:'arc-down',curve:-150,text:'KEEP\nTHESE WORDS',textEffect:'outline',tracking:.14}],d={id:'curved-project',name:'Curved text',width:1080,height:1350,background:'#ffffff',elements};c.ensurePages(d);const out=c.validateDesign(JSON.parse(JSON.stringify(d)));
 for(const page of [out,...out.pages])for(let i=0;i<2;i++){assert.equal(page.elements[i].curve,elements[i].curve);assert.equal(page.elements[i].text,elements[i].text);assert.equal(page.elements[i].textEffect,elements[i].textEffect);assert.equal(page.elements[i].tracking,elements[i].tracking);assert.equal(page.elements[i].type,'text');}
 const bad=structuredClone(d);bad.elements[0].curve=300;assert.throws(()=>c.validateDesign(bad));
});

test('canvas arc renderer rotates editable glyphs, preserves every effect and restores its drawing state',()=>{
 for(const textEffect of ['none','shadow','outline','hollow','glow']){
  const calls=[],stack=[],ctx={...curveContext(),globalAlpha:1,save(){stack.push(true)},restore(){assert.ok(stack.pop())},translate(x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y));},scale(x,y){assert.ok(Number.isFinite(x)&&x>0&&Number.isFinite(y)&&y>0);calls.push(['scale',x,y])},rotate(a){assert.ok(Number.isFinite(a));calls.push(['rotate',a])},fillText(text,x,y){calls.push(['fill',text,x,y])},strokeText(text,x,y){calls.push(['stroke',text,x,y])}};
  const e={...curveText,text:'ARC',h:25,textEffect};c.paintType(ctx,e);assert.equal(stack.length,0);
  assert.ok(calls.some(call=>call[0]==='scale'&&call[1]<1),'short imported boxes fit the complete arc instead of clipping it');
  assert.ok(calls.some(call=>call[0]==='rotate'&&call[1]>0)&&calls.some(call=>call[0]==='rotate'&&call[1]<0));
  const fills=calls.filter(call=>call[0]==='fill'),strokes=calls.filter(call=>call[0]==='stroke');assert.equal(strokes.length,['outline','hollow'].includes(textEffect)?3:0);assert.equal(fills.length,textEffect==='hollow'?0:['shadow','glow'].includes(textEffect)?6:3);assert.equal(e.text,'ARC');assert.equal(e.size,curveText.size);
 }
});

test('curve inspector groups a slider gesture into one undo checkpoint and Straight is separately undoable',()=>{
 const controls=new Map(),history=[],e={...curveText,curve:0},ctx=curveContext();ctx.save=ctx.restore=()=>{};
 const node=id=>{if(!controls.has(id))controls.set(id,{value:'0',validity:{valid:true},after(section){this.section=section;}});return controls.get(id)};
 const ui={design:{height:1350,elements:[e]},getSelected:()=>e,renderInspector:()=>{},document:{createElement:()=>({innerHTML:''})},$:node,$$:()=>[],checkpoint:()=>history.push(structuredClone(e)),finishInline:()=>{},changed:()=>{},toast:message=>{throw Error(message)},ctx};vm.createContext(ui);vm.runInContext(fs.readFileSync('type-core.js','utf8'),ui);vm.runInContext('measureTextHeight=e=>typeTextHeight(ctx,e)',ui);
 const tools=fs.readFileSync('type-tools.js','utf8');vm.runInContext(tools.slice(tools.indexOf('const typeOldInspector='),tools.indexOf("document.body.insertAdjacentHTML('beforeend','<dialog id=\"typeCredits\"")),ui);ui.renderInspector();
 const slider=node('#typeCurve');slider.onpointerdown();slider.value='80';slider.oninput();slider.value='120';slider.oninput();slider.onpointerup();assert.equal(history.length,1);assert.equal(history[0].curve,0);assert.equal(e.curve,120);
 node('#typeCurveReset').onclick();assert.equal(history.length,2);assert.equal(history[1].curve,120);assert.equal(e.curve,0);assert.equal(e.text,curveText.text);
 e.locked=true;slider.value='90';slider.oninput();assert.equal(history.length,2);assert.equal(e.curve,0,'locked text rejects curvature changes');
});
