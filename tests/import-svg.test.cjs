const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx=vm.createContext({atob:s=>Buffer.from(s,'base64').toString('binary'),Uint8Array});vm.runInContext(fs.readFileSync('import-svg.js','utf8'),ctx);
const plain=value=>JSON.parse(JSON.stringify(value));
test('SVG refuses external XML instructions before parsing',()=>{
 for(const source of ['', '<!DOCTYPE svg SYSTEM "https://evil.test/entity"><svg/>', '<!ENTITY x "abc"><svg/>','<?xml-stylesheet href="https://evil.test/a.css"?><svg/>','<svg>\0</svg>'])assert.throws(()=>ctx.importSVGSourceCheck(source));
 assert.equal(ctx.importSVGSourceCheck('<svg xmlns="http://www.w3.org/2000/svg"/>'),'<svg xmlns="http://www.w3.org/2000/svg"/>');
});
test('SVG CSS supports local paints while blocking escaped and remote resources',()=>{
 for(const style of ['fill:url(https://evil.test/a.svg#paint)','fill:url(//evil.test/a.svg#paint)','fill:url(data:image/svg+xml,evil)','fill:u\\72l(#paint)','fill:u/**/rl(#paint)','font-family:expression(alert(1))','@import "https://evil.test/a.css"','background-image:url(#x)','fill:red;behavior:evil'])assert.throws(()=>ctx.importSVGStyle(style),style);
 assert.deepEqual(plain(ctx.importSVGStyle('fill:url("#paint"); font-weight:700; opacity:.5;')),{'fill':'url("#paint")','font-weight':'700',opacity:'.5'});
 assert.throws(()=>ctx.importSVGStyleSheet('@font-face{font-family:Custom;src:url(https://evil.test/font.woff)}'));
 assert.equal(ctx.importSVGStyleSheet('.headline { fill: #ffffff; font-weight: 700; }'),' .headline { fill: #ffffff; font-weight: 700; }'.trim());
 assert.equal(ctx.importSVGLocalReference('#local-art'), 'local-art');assert.equal(ctx.importSVGLocalReference('https://evil.test/#art'),null);
});
test('SVG transforms compose in SVG order and support rotations around a point',()=>{
 assert.deepEqual(plain(ctx.importSVGTransform('translate(10 20) scale(2)')),[2,0,0,2,10,20]);
 const m=plain(ctx.importSVGTransform('rotate(90, 10, 20)'));assert.ok(Math.abs(m[0])<1e-10);assert.ok(Math.abs(m[1]-1)<1e-10);assert.ok(Math.abs(m[4]-30)<1e-10);assert.ok(Math.abs(m[5]-10)<1e-10);
 for(const raw of ['translate(nope)','matrix(1 2)','scale(1e200)','rotate(1,2)','translate(10) junk','scale(1e7) scale(1e7)'])assert.throws(()=>ctx.importSVGTransform(raw),raw);
});
test('SVG viewBox alignment and transformed layer boxes preserve positions',()=>{
 const v=plain(ctx.importSVGViewBox('20 30 200 100',400,400));assert.deepEqual(v.matrix,[2,0,0,2,-40,40]);
 const none=plain(ctx.importSVGViewBox('0 0 200 100',400,400,'none'));assert.deepEqual(none.matrix,[2,0,0,4,0,0]);
 const box=plain(ctx.importSVGBox([0,2,-2,0,100,50],10,20,30,40));assert.equal(box.x,-10);assert.equal(box.y,60);assert.equal(box.w,60);assert.equal(box.h,80);assert.equal(box.rotation,90);
 assert.equal(ctx.importSVGBox([1,0,.5,1,0,0],0,0,10,10),null);assert.equal(ctx.importSVGBox([-1,0,0,1,0,0],0,0,10,10),null);
 for(const value of ['0 0 0 10','0 0 10 NaN','0 0 100','0 0 -2 10'])assert.throws(()=>ctx.importSVGViewBox(value,100,100));
});
test('SVG dimensions and colors are finite and normalized for the editor',()=>{
 assert.equal(ctx.importSVGLength('1in',300),96);assert.equal(ctx.importSVGLength('72pt',300),96);assert.equal(ctx.importSVGLength('100%',300),300);assert.ok(Number.isNaN(ctx.importSVGNumber('10%')));
 assert.deepEqual(plain(ctx.importSVGColor('#f008')),{color:'#ff0000',opacity:136/255});assert.deepEqual(plain(ctx.importSVGColor('rgb(100%, 0%, 0%)')),{color:'#ff0000',opacity:1});assert.deepEqual(plain(ctx.importSVGColor('rgba(2, 4, 8, .5)')),{color:'#020408',opacity:.5});assert.equal(ctx.importSVGColor('url(#paint)'),null);
});
test('SVG raster resources must have real image headers and bounded decoded pixels',()=>{
 const png=(w,h)=>{const data=Buffer.alloc(24);Buffer.from([137,80,78,71,13,10,26,10]).copy(data);data.write('IHDR',12);data.writeUInt32BE(w,16);data.writeUInt32BE(h,20);return 'data:image/png;base64,'+data.toString('base64');};
 assert.equal(ctx.importSVGRasterInfo(png(320,240)).width,320);assert.equal(ctx.importSVGRasterInfo(png(320,240)).height,240);
 for(const source of [png(0,100),png(16001,100),png(10000,5000),'https://evil.test/photo.png','data:image/svg+xml;base64,PHN2Zz4=','data:image/png;base64,PHNjcmlwdD4='])assert.throws(()=>ctx.importSVGRasterInfo(source));
 const jpeg=Buffer.from([255,216,255,192,0,11,8,0,100,0,200,1,1,0,0,255,217]);assert.equal(ctx.importSVGRasterInfo('data:image/jpeg;base64,'+jpeg.toString('base64')).width,200);
 const webp=Buffer.alloc(30);webp.write('RIFF',0);webp.write('WEBP',8);webp.write('VP8X',12);webp[24]=99;webp[27]=49;assert.equal(ctx.importSVGRasterInfo('data:image/webp;base64,'+webp.toString('base64')).height,50);
});
test('SVG native paints refuse stroke/effect approximations',()=>{
 assert.deepEqual(plain(ctx.importSVGNativePaint({fill:'#abc',opacity:'.5','fill-opacity':'.4'})),{color:'#aabbcc',opacity:.2});
 assert.equal(ctx.importSVGNativePaint({fill:'url(#gradient)'}),null);assert.equal(ctx.importSVGNativePaint({fill:'red',stroke:'blue'}),null);assert.equal(ctx.importSVGNativePaint({fill:'red',filter:'url(#blur)'}),null);
 assert.equal(ctx.importSVGNeedsGroupRaster({opacity:'.5'}),true);assert.equal(ctx.importSVGNeedsGroupRaster({'clip-path':'url(#crop)'}),true);
});
test('SVG reference expansion rejects missing, cyclic and excessive nested artwork',()=>{
 const node=(name,attrs={},children=[])=>({localName:name,attributes:Object.entries(attrs).map(([name,value])=>({name,localName:name,value})),children,getAttribute:name=>attrs[name]??null,querySelectorAll(){return this.children.flatMap(c=>[c,...c.querySelectorAll('*')]);}});
 assert.equal(ctx.importSVGReferences(node('svg',{},[node('defs',{},[node('rect',{id:'tile'})]),node('use',{href:'#tile'})])).size,1);
 assert.throws(()=>ctx.importSVGReferences(node('svg',{},[node('use',{href:'#absent'})])),/missing artwork/);
 assert.throws(()=>ctx.importSVGReferences(node('svg',{},[node('g',{id:'a'},[node('use',{href:'#a'})])])),/circular/);
 assert.throws(()=>ctx.importSVGReferences(node('svg',{},[node('rect',{id:'same'}),node('rect',{id:'same'})])),/duplicate/);
 let nested=node('rect');for(let i=0;i<30;i++)nested=node('g',{},[nested]);assert.throws(()=>ctx.importSVGReferences(node('svg',{},[nested])),/too many repeated/);
 const definitions=[node('rect',{id:'tile0'})];for(let i=1;i<16;i++)definitions.push(node('g',{id:'tile'+i},[node('use',{href:'#tile'+(i-1)}),node('use',{href:'#tile'+(i-1)})]));assert.throws(()=>ctx.importSVGReferences(node('svg',{},[node('defs',{},definitions),node('use',{href:'#tile15'})])),/too many repeated/);
});
