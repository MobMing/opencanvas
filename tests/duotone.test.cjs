const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c={URL,Uint8Array,Uint8ClampedArray,Int32Array,uid:()=>crypto.randomUUID(),clone:structuredClone,fonts:['Arial','Georgia','Impact']};
vm.createContext(c);for(const f of ['creative-core.js','type-core.js','context-core.js','pages-core.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const html=fs.readFileSync('dist/index.html','utf8');vm.runInContext(html.slice(html.indexOf('const base='),html.indexOf('function template(key)')),c);vm.runInContext(html.slice(html.indexOf('function validateDesign('),html.indexOf("$('#projectInput').onchange")),c);
const src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lTYAAAAASUVORK5CYII=',original='data:image/jpeg;base64,/9j/2Q==';
const image=()=>({id:'photo1',type:'image',x:20,y:20,w:400,h:400,src,photoStudio:{version:1,source:original,result:c.photoSourceFingerprint(src),settings:{shadow:'#102030',highlight:'#f0e0d0',intensity:70,brightness:110,frame:'circle'}}});
const design=()=>({id:'design1',name:'Photo treatment',width:1080,height:1350,background:'#ffffff',elements:[image()]});

test('duotone maps dark and light pixels to exact chosen ink and paper',()=>{
 const p=new Uint8ClampedArray([0,0,0,255,255,255,255,255,128,128,128,255]);c.duotonePhotoPixels(p,'#102030','#f0e0d0');
 assert.deepEqual([...p.slice(0,8)],[16,32,48,255,240,224,208,255]);
 assert.deepEqual([...p.slice(8)],[128,128,128,255]);
});
test('intensity blends with original channels and zero leaves all pixels intact',()=>{
 const p=new Uint8ClampedArray([80,100,120,230]),old=[...p];c.duotonePhotoPixels(p,'#000000','#ffffff',0);assert.deepEqual([...p],old);
 const expected=old.slice();const tone=.2126*80+.7152*100+.0722*120;for(let k=0;k<3;k++)expected[k]=Math.round(old[k]*.5+tone*.5);
 c.duotonePhotoPixels(p,'#000000','#ffffff',50);assert.deepEqual([...p],expected);
});
test('duotone preserves alpha edges and does not recolor fully transparent data',()=>{
 const p=new Uint8ClampedArray([20,40,60,0,20,40,60,17]);c.duotonePhotoPixels(p,'#123456','#fedcba',100);
 assert.deepEqual([...p.slice(0,4)],[20,40,60,0]);assert.equal(p[7],17);assert.notEqual(p[4],20);
});
test('photo settings reject invalid colors, nonfinite numbers and unsupported frames',()=>{
 for(const bad of [{shadow:'red'},{highlight:'url(https://bad)'},{intensity:-1},{intensity:101},{intensity:NaN},{brightness:200},{frame:'external-mask'}])assert.throws(()=>c.photoStudioSettings(bad));
 assert.equal(c.photoStudioSettings().intensity,0);assert.equal(c.photoStudioSettings({shadow:'#AABBCC'}).shadow,'#aabbcc');
});
test('retained source and settings survive actual project validation and JSON export/import',()=>{
 const first=c.validateDesign(design()),second=c.validateDesign(JSON.parse(JSON.stringify(first)));
 assert.equal(second.elements[0].src,src);assert.equal(second.elements[0].photoStudio.source,original);
 assert.equal(second.elements[0].photoStudio.settings.intensity,70);assert.equal(second.elements[0].photoStudio.settings.frame,'circle');
 assert.equal(second.elements[0].photoStudio.settings.brightness,110);
});
test('multipage validation retains each page original and uses selected page metadata',()=>{
 const d=design(),other={...design(),id:'page2',elements:[{...image(),id:'photo2'}]};other.elements[0].photoStudio.settings.intensity=30;
 d.pages=[{...design(),id:'page1'},other];d.pageIndex=1;const clean=c.validateDesign(d);
 assert.equal(clean.elements[0].id,'photo2');assert.equal(clean.elements[0].photoStudio.settings.intensity,30);
 assert.equal(clean.pages[0].elements[0].photoStudio.settings.intensity,70);assert.equal(clean.pages[1].elements[0].photoStudio.settings.intensity,30);
});
test('replaced or externally edited pixels discard stale original-edit metadata',()=>{
 const e=image();e.src=original;assert.equal(c.photoStudioMetadata(e).photoStudio,undefined);
 const d=design();d.elements[0]=e;assert.equal(c.validateDesign(d).elements[0].photoStudio,undefined);
});
test('original image metadata rejects external sources and malformed records',()=>{
 for(const source of ['https://example.com/photo.jpg','data:image/svg+xml;base64,AAAA','data:text/html;base64,AAAA']){const e=image();e.photoStudio.source=source;assert.throws(()=>c.photoStudioMetadata(e));}
 const invalid=image();invalid.photoStudio.version=2;assert.throws(()=>c.photoStudioMetadata(invalid));
 assert.deepEqual(Object.keys(c.photoStudioMetadata({type:'image',src})),[]);
});
test('Photo Studio restores saved controls and Original resets every adjustment',()=>{
 const controls=new Map(),ui={...c,$:id=>{if(!controls.has(id))controls.set(id,{value:'',checked:false,textContent:''});return controls.get(id)}};
 vm.createContext(ui);vm.runInContext(fs.readFileSync('creative-core.js','utf8'),ui);
 const tools=fs.readFileSync('creative-tools.js','utf8');vm.runInContext(tools.slice(tools.indexOf('function readPhotoControls()'),tools.indexOf('async function openPhotoTool(')),ui);
 ui.resetPhotoControls('none',{brightness:115,contrast:80,saturation:60,flip:true,frame:'arch',remove:true,key:'#eeeeee',tolerance:12,shadow:'#24103f',highlight:'#daff4c',intensity:45});
 let settings=ui.readPhotoControls();assert.equal(settings.brightness,115);assert.equal(settings.frame,'arch');assert.equal(settings.flip,true);assert.equal(settings.intensity,45);assert.equal(controls.get('#photoDuotonePreset').value,'electric');
 ui.resetPhotoControls();settings=ui.readPhotoControls();assert.equal(settings.brightness,100);assert.equal(settings.frame,'none');assert.equal(settings.flip,false);assert.equal(settings.remove,false);assert.equal(settings.intensity,0);assert.equal(controls.get('#photoDuotonePreset').value,'none');
});
test('changing photo frames clears zoom and pan so transparent mask edges remain visible',()=>{
 const e=image();e.photoStudio.settings.frame='none';e.w=600;e.h=400;e.photoCrop={zoom:3,x:.1,y:.9};
 const next={...e.photoStudio,settings:{...e.photoStudio.settings,frame:'arch'}};
 c.applyPhotoStudioResult(e,src,next,400,400);
 assert.deepEqual(JSON.parse(JSON.stringify(e.photoCrop)),{zoom:1,x:.5,y:.5});assert.equal(e.w,400);assert.equal(e.h,400);assert.equal(e.x,120);assert.equal(e.y,20);
 e.photoCrop={zoom:2,x:1,y:0};const reset={...e.photoStudio,settings:{...e.photoStudio.settings,frame:'none'}};
 c.applyPhotoStudioResult(e,src,reset,600,400);
 assert.deepEqual(JSON.parse(JSON.stringify(e.photoCrop)),{zoom:1,x:.5,y:.5});assert.ok(Math.abs(e.w/e.h-1.5)<1e-10);assert.equal(e.x+e.w/2,320);assert.equal(e.y+e.h/2,220);
});
test('duotone-only changes preserve the existing photo zoom and pan',()=>{
 const e=image();e.photoStudio.settings.frame='none';e.photoCrop={zoom:2.4,x:.2,y:.8};const geometry=[e.x,e.y,e.w,e.h];
 const next={...e.photoStudio,settings:{...e.photoStudio.settings,intensity:25}};c.applyPhotoStudioResult(e,src,next,800,800);
 assert.deepEqual(JSON.parse(JSON.stringify(e.photoCrop)),{zoom:2.4,x:.2,y:.8});assert.deepEqual([e.x,e.y,e.w,e.h],geometry);assert.equal(e.photoStudio.settings.intensity,25);
});
