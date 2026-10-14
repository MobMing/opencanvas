const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={Blob,Uint8Array,TextEncoder};vm.createContext(c);vm.runInContext(fs.readFileSync('print-core.js','utf8'),c);
const close=(a,b)=>assert.ok(Math.abs(a-b)<.00001,a+' should equal '+b),page=(width=1080,height=1350)=>({width,height,elements:[{type:'text',text:'Keep the original'}]});

test('paper sizes and DPI produce exact physical trim dimensions without changing artwork',()=>{
 const d=page(),before=JSON.stringify(d),a4=c.printPagePlan(d,{paper:'a4',dpi:300});close(a4.trimW,210/25.4*72);close(a4.trimH,297/25.4*72);assert.equal(a4.trimPixelsW,2480);assert.equal(a4.trimPixelsH,3508);assert.equal(JSON.stringify(d),before);
 const landscape=c.printPagePlan(d,{paper:'letter',landscape:true,dpi:150});close(landscape.widthMm,279.4);close(landscape.trimW,792);close(landscape.trimH,612);
 const pixels=c.printPagePlan(page(1200,1800),{paper:'source',dpi:300});close(pixels.widthMm,101.6);close(pixels.heightMm,152.4);assert.equal(pixels.trimPixelsW,1200);assert.equal(pixels.trimPixelsH,1800);
 const custom=c.printPagePlan(d,{paper:'custom',widthMm:85,heightMm:55,dpi:300});close(custom.trimW,85/25.4*72);close(custom.trimH,55/25.4*72);
});

test('3 mm bleed and crop marks use correctly nested MediaBox, TrimBox and BleedBox',()=>{
 for(const bleed of[false,true])for(const marks of[false,true]){
  const p=c.printPagePlan(page(),{paper:'a4',dpi:150,bleed,marks}),mm=72/25.4,[tl,tb,tr,tt]=p.trimBox,[bl,bb,br,bt]=p.bleedBox;
  close(tl-bl,bleed?3*mm:0);close(tb-bb,bleed?3*mm:0);close(br-tr,bleed?3*mm:0);close(bt-tt,bleed?3*mm:0);close(bl,marks?6*mm:0);close(bb,marks?6*mm:0);close(p.mediaW,210*mm+2*(bleed?3*mm:0)+2*(marks?6*mm:0));
  const lines=c.printCropLines(p);assert.equal(lines.length,marks?8:0);for(const [x1,y1,x2,y2] of lines){assert.ok(x1>=0&&x2<=p.mediaW&&y1>=0&&y2<=p.mediaH);assert.ok(Math.max(x1,x2)<bl||Math.min(x1,x2)>br||Math.max(y1,y2)<bb||Math.min(y1,y2)>bt,'crop marks must sit outside artwork and bleed');}
 }
});

test('page ranges deduplicate, preserve document order and reject invalid numbers',()=>{
 assert.deepEqual(Array.from(c.printPageNumbers('',5,2,'all')),[0,1,2,3,4]);assert.deepEqual(Array.from(c.printPageNumbers('',5,2,'current')),[2]);assert.deepEqual(Array.from(c.printPageNumbers('5, 1, 3–4, 3',5,0,'custom')),[0,2,3,4]);
 for(const range of['','0','6','4-2','1.5','1,,2','x','1-1000000'])assert.throws(()=>c.printPageNumbers(range,5,0,'custom'));
 assert.throws(()=>c.printPageNumbers('',31));assert.throws(()=>c.printPageNumbers('',2,7,'current'));
});

test('fit and fill preserve proportions while showing the expected margins or crop',()=>{
 const fit=c.printArtworkPlacement(1000,500,800,800,'contain');close(fit.w,800);close(fit.h,400);close(fit.x,0);close(fit.y,200);
 const fill=c.printArtworkPlacement(1000,500,800,800,'cover');close(fill.w,1600);close(fill.h,800);close(fill.x,-400);close(fill.y,0);
});

test('canvas and total export limits reject excessive allocations before rendering',()=>{
 for(const settings of[{paper:'a3',dpi:600},{paper:'custom',widthMm:1000,heightMm:1000,dpi:300},{paper:'a4',dpi:Infinity},{paper:'custom',widthMm:0},{dpi:0}])assert.throws(()=>c.printPagePlan(page(),settings));
 assert.throws(()=>c.printPagePlan({width:Infinity,height:1000}));assert.throws(()=>c.printBatchPlans(Array.from({length:20},()=>page()),{paper:'a4',dpi:300}));assert.throws(()=>c.printBatchPlans([]));assert.equal(c.printBatchPlans([page(),page()],{paper:'a4',dpi:300}).length,2);
});

test('multipage PDF preserves physical sizes, exact stream lengths and byte offsets',async()=>{
 const bytes=new Uint8Array([255,216,255,10,0,128,255,217]),plans=[c.printPagePlan(page(),{paper:'a4',dpi:150,bleed:true,marks:true}),c.printPagePlan(page(1200,1800),{paper:'source',dpi:300})],pdf=c.makePrintPDF(plans.map(plan=>({plan,pixelWidth:plan.rasterW,pixelHeight:plan.rasterH,bytes}))),buffer=Buffer.from(await pdf.arrayBuffer()),text=buffer.toString('latin1');
 assert.equal(pdf.type,'application/pdf');assert.match(text,/\/Count 2/);assert.match(text,/\/ColorSpace \/DeviceRGB/);assert.match(text,/\/TrimBox \[/);assert.match(text,/\/BleedBox \[/);assert.match(text,/\/MediaBox \[0 0 288 432\]/);assert.match(text,/0\.25 w/);
 const trimBoxes=[...text.matchAll(/\/TrimBox \[([^\]]+)\]/g)].map(m=>m[1].split(' ').map(Number));for(let i=0;i<2;i++)for(let j=0;j<4;j++)close(trimBoxes[i][j],plans[i].trimBox[j]);
 const xref=Number(text.match(/startxref\n(\d+)/)[1]);assert.equal(text.slice(xref,xref+4),'xref');const rows=text.slice(xref).split('\n').slice(3,11);rows.forEach((row,i)=>assert.ok(text.slice(Number(row.slice(0,10))).startsWith((i+1)+' 0 obj')));
 for(const match of text.matchAll(/\/Length (\d+) >>\nstream\n/g)){const start=match.index+match[0].length,n=Number(match[1]);assert.ok(text.slice(start+n).startsWith('endstream')||text.slice(start+n).startsWith('\nendstream'),'stream length must count exact binary bytes');}
 assert.throws(()=>c.makePrintPDF([]));assert.throws(()=>c.makePrintPDF([{plan:plans[0],pixelWidth:100000,pixelHeight:20,bytes}]));const bad={...plans[0],trimBox:[-10,0,200,200]};assert.throws(()=>c.makePrintPDF([{plan:bad,pixelWidth:20,pixelHeight:20,bytes}]));
});

test('preview guide visibility does not affect PDF production geometry',async()=>{
 const p=page(),a=c.printPagePlan(p,{paper:'postcard',dpi:150,marks:true,guides:true,safeMm:5}),b=c.printPagePlan(p,{paper:'postcard',dpi:150,marks:true,guides:false,safeMm:20}),bytes=new Uint8Array([255,216,255,217]);
 const encode=async plan=>Buffer.from(await c.makePrintPDF([{plan,pixelWidth:plan.rasterW,pixelHeight:plan.rasterH,bytes}]).arrayBuffer());assert.deepEqual(await encode(a),await encode(b),'safe and trim guides are never burned into the PDF');
});
