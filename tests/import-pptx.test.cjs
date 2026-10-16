const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={Uint8Array,DataView,TextDecoder,Math,Number,Map,Set,Error};vm.createContext(c);vm.runInContext(fs.readFileSync('import-pptx.js','utf8'),c);
const plain=v=>JSON.parse(JSON.stringify(v));
function element(localName,attributes={},children=[]){return{localName,children,getAttribute(name){return Object.hasOwn(attributes,name)?attributes[name]:null;},attributes:Object.entries(attributes).map(([name,value])=>({localName:name,value}))};}
test('PPTX internal relationships normalize legitimate parent paths and reject external or escaping paths',()=>{
 assert.equal(c.importPPTXPath('ppt/slides/slide1.xml','../media/image1.png'),'ppt/media/image1.png');
 assert.equal(c.importPPTXPath('ppt/slides/slide1.xml','/ppt/media/image1.png'),'ppt/media/image1.png');
 assert.equal(c.importPPTXPath('ppt/slides/slide1.xml','../media/my%20photo.png'),'ppt/media/my photo.png');
 for(const value of ['https://example.com/a.png','../../../outside','..\\secret','../media/%2E%2E/%2E%2E/%2E%2E/secret','file:C:/secret','x?secret=1','x#fragment','x%00.png','%5c%5cserver/file'])assert.throws(()=>c.importPPTXPath('ppt/slides/slide1.xml',value),/reference|escapes/);
});
test('PPTX affine composition preserves group position, scale and rotation',()=>{
 const m=c.importPPTXMultiply([2,0,0,2,30,50],c.importPPTXTranslate(5,7));assert.deepEqual(plain(c.importPPTXPoint(m,2,4)),{x:44,y:72});
 const b=c.importPPTXBox([2,0,0,2,30,50],10,20,80,30,90);assert.equal(b.w,160);assert.equal(b.h,60);assert.equal(b.x,50);assert.equal(b.y,90);assert.equal(b.rotation,90);assert.equal(b.reflected,false);assert.equal(b.skewed,false);
 const reflected=c.importPPTXBox([1,0,0,1,0,0],0,0,100,80,0,true,false);assert.equal(reflected.reflected,true);assert.equal(Math.abs(reflected.rotation),180);
 const skewed=c.importPPTXBox([2,0,0,1,0,0],0,0,100,80,45);assert.equal(skewed.skewed,true);
});
test('PPTX color decoding uses a safe fixed color model and theme aliases',()=>{
 const solid=element('solidFill',{},[element('srgbClr',{val:'204060'},[element('alpha',{val:'50000'})])]);assert.deepEqual(plain(c.importPPTXColor(solid)),{color:'#204060',opacity:.5});
 const themed=element('solidFill',{},[element('schemeClr',{val:'accent1'},[element('tint',{val:'50000'})])]);assert.equal(c.importPPTXColor(themed,{accent1:'#000000'}).color,'#808080');
 assert.equal(c.importPPTXColor(element('solidFill',{},[element('srgbClr',{val:'url(javascript:bad)'})]),{},'#112233').color,'#112233');
 assert.equal(c.importPPTXColor(element('solidFill',{},[element('sysClr',{lastClr:'abcdef'})])).color,'#abcdef');
});
test('PPTX picture header checks read dimensions before browser decoding',()=>{
 const png=Buffer.alloc(24);png.set([137,80,78,71,13,10,26,10]);png.writeUInt32BE(640,16);png.writeUInt32BE(480,20);assert.deepEqual(plain(c.importPPTXImageInfo(png)),{type:'image/png',width:640,height:480});
 const jpg=Buffer.from([255,216,255,192,0,11,8,1,224,2,128,1,1,17,0]);assert.deepEqual(plain(c.importPPTXImageInfo(jpg)),{type:'image/jpeg',width:640,height:480});
 const webp=Buffer.alloc(30);webp.write('RIFF',0);webp.write('WEBP',8);webp.write('VP8X',12);webp[24]=127;webp[27]=63;assert.deepEqual(plain(c.importPPTXImageInfo(webp)),{type:'image/webp',width:128,height:64});
 const lossless=Buffer.alloc(30);lossless.write('RIFF',0);lossless.write('WEBP',8);lossless.write('VP8L',12);lossless[20]=47;lossless.writeUInt32LE(127|(63<<14),21);assert.deepEqual(plain(c.importPPTXImageInfo(lossless)),{type:'image/webp',width:128,height:64});
 for(const bad of [Buffer.from('<svg onload="bad()"/>'),Buffer.from([255,216,255,192,255,255]),Buffer.alloc(2)])assert.throws(()=>c.importPPTXImageInfo(bad));
});
test('PPTX XML helpers use local names and relationship namespaces',()=>{
 const node=element('root',{},[element('p:sp'),element('sp')]);assert.equal(c.importPPTXChildren(node,'sp').length,1);assert.equal(c.importPPTXChild(node,'missing'),null);
 assert.equal(c.importPPTXRelId({attributes:[{localName:'id',namespaceURI:'evil',value:'no'},{localName:'id',namespaceURI:'http://schemas.openxmlformats.org/officeDocument/2006/relationships',value:'rId2'}]}),'rId2');
});
test('PPTX rejects oversized input and preserves cancellation before reading',async()=>{
 await assert.rejects(()=>c.importPPTXFile({size:31*1024*1024}),/30 MB/);
 await assert.rejects(()=>c.importPPTXFile({size:10},{check(){throw Error('cancelled');}}),/cancelled/);
});
test('PPTX fixture is an internally consistent multi-slide package',async()=>{
 const {makeImportPPTXFixture}=require('./fixtures/import-pptx-fixture.cjs'),context={Uint8Array,DataView,TextDecoder,ReadableStream,DecompressionStream,Blob,Map,Set,Error};vm.createContext(context);vm.runInContext(fs.readFileSync('import-zip.js','utf8'),context);const files=await context.importZIPArchive(makeImportPPTXFixture());assert.equal(files.size,14);assert.match(new TextDecoder().decode(files.get('ppt/slides/slide1.xml')),/EDIT THIS HEADLINE/);assert.match(new TextDecoder().decode(files.get('ppt/slides/slide2.xml')),/ROTATED GROUP/);assert.match(new TextDecoder().decode(files.get('ppt/slides/_rels/slide1.xml.rels')),/TargetMode="External"/);assert.equal(c.importPPTXImageInfo(files.get('ppt/media/picture.png')).width,96);
});
