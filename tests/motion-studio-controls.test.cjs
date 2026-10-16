// Exercise the actual panel's generated controls and registered change handlers.
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8'),mediaId='media_11111111-1111-1111-1111-111111111111';
function panel(){
 let children=[],saved=null,id=0;const notices=[],undos=[],redos=[];
 function element(tag,attrs,content=''){
  const attributes=Object.fromEntries([...attrs.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(match=>[match[1],match[2]??'']));
  const dataset={};for(const [name,value]of Object.entries(attributes))if(name.startsWith('data-'))dataset[name.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]=value;
  return {tagName:tag.toUpperCase(),attributes,dataset,id:attributes.id,value:attributes.value??(tag==='textarea'?content:tag==='select'?(content.match(/<option value="([^"]*)" selected/)||content.match(/<option value="([^"]*)"/))?.[1]||'':''),checked:'checked'in attributes,disabled:'disabled'in attributes,isConnected:true,addEventListener(){},getAttribute:name=>attributes[name]};
 }
 const root={set innerHTML(html){for(const child of children)child.isConnected=false;children=[...html.matchAll(/<(input|button|canvas|output|progress|div|p|span)\b([^>]*)>|<(textarea|select)\b([^>]*)>([\s\S]*?)<\/\3>/g)].map(match=>element(match[1]||match[3],match[2]||match[4],match[5]));},get innerHTML(){return'';}};
 const dialog={open:true,addEventListener(){}};
 const selectAll=selector=>children.filter(child=>selector.startsWith('#')?child.id===selector.slice(1):[...selector.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)].every(([,name,value])=>name in child.attributes&&(value===undefined||child.attributes[name]===value)));
 const $=selector=>selector==='#plusBody'?root:selector==='#plusDialog'?dialog:selectAll(selector)[0];
 const page={id:'page',name:'Scene',width:500,height:600,background:'#ffffff',elements:[],motion:{duration:4}};
 const c={AbortController,setTimeout,clearTimeout,Map,Set,Promise,clone:structuredClone,validateDesign:structuredClone,design:{...structuredClone(page),id:'project',pages:[page],pageIndex:0,motionStudio:{tracks:[{id:'music',mediaId,at:0,start:0,end:4,volume:1,fadeIn:0,fadeOut:0}],captions:[{id:'caption',start:0,end:2,text:'Before'}]}},plusSection:'Motion',plusMotionStop:null,$,$$:selectAll,window:{MediaRecorder:{isTypeSupported:()=>false}},esc:String,plusMessage:text=>notices.push(text),uid:()=>`new-${++id}`,syncPage(){},ensurePages:d=>d.pages,adoptPage(){},checkpoint(){undos.push(structuredClone(c.design));redos.length=0;},changed(){saved=structuredClone(c.design);},undo(){if(undos.length){redos.push(structuredClone(c.design));c.design=undos.pop();}},redo(){if(redos.length){undos.push(structuredClone(c.design));c.design=redos.pop();}},MotionMediaStore:{metadata:async()=>({id:mediaId,name:'Music',kind:'audio',duration:10,peaks:[]})}};
 vm.createContext(c);for(const file of ['motion-upgrade-core.js','media-store-core.js','motion-studio-core.js','motion-studio.js'])vm.runInContext(read(file),c);vm.runInContext('motionStudioPaintTimeline=()=>{};motionStudioScrub=async()=>{};',c);c.plusMotionPanel();return{c,$,notices,get saved(){return saved;},change(selector,value){const input=$(selector);assert.equal(typeof input.onchange,'function',selector+' is wired');input.value=String(value);input.onchange({target:input});}};
}
test('native number changes persist track placement, trim, percent volume and fades after reopening the panel',()=>{
 const r=panel();for(const [key,value]of [['at',1],['start',.5],['end',3.5],['volume',35],['fadeIn',.7],['fadeOut',.9]])r.change('[data-ms-track="0"][data-ms-key="'+key+'"]',value);
 r.c.plusMotionPanel();const track=r.c.design.motionStudio.tracks[0];assert.equal(track.volume,.35);assert.equal(track.at,1);assert.equal(track.start,.5);assert.equal(track.end,3.5);assert.equal(track.fadeIn,.7);assert.equal(track.fadeOut,.9);assert.equal(r.$('[data-ms-track="0"][data-ms-key="volume"]').value,'35');assert.equal(r.saved.motionStudio.tracks[0].volume,.35);assert.equal(r.notices.length,0);
 r.$('#motionStudioUndo').onclick();assert.equal(r.c.design.motionStudio.tracks[0].fadeOut,0);r.$('#motionStudioRedo').onclick();assert.equal(r.c.design.motionStudio.tracks[0].fadeOut,.9);
});
test('caption time/text/style controls update actual project metadata and survive validation',()=>{
 const r=panel();r.change('[data-ms-cue="0"][data-ms-key="start"]',.5);r.change('[data-ms-cue="0"][data-ms-key="end"]',3);r.change('[data-ms-cue="0"][data-ms-key="text"]','Edited caption');r.change('#motionStudioCaptionSize',5);r.change('#motionStudioCaptionPosition','top');const clean=r.c.validateDesign(JSON.parse(JSON.stringify(r.saved)));assert.equal(clean.motionStudio.captions[0].start,.5);assert.equal(clean.motionStudio.captions[0].end,3);assert.equal(clean.motionStudio.captions[0].text,'Edited caption');assert.equal(clean.motionStudio.captionStyle.size,5);assert.equal(clean.motionStudio.captionStyle.position,'top');r.c.plusMotionPanel();assert.equal(r.$('[data-ms-cue="0"][data-ms-key="text"]').value,'Edited caption');
});
test('invalid caption and audio ranges report an error without replacing the last saved settings',()=>{
 const r=panel();r.change('[data-ms-track="0"][data-ms-key="end"]',0);assert.equal(r.c.design.motionStudio.tracks[0].end,4);assert.match(r.notices.at(-1),/Audio clips/);r.change('[data-ms-cue="0"][data-ms-key="end"]',0);assert.equal(r.c.design.motionStudio.captions[0].end,2);assert.match(r.notices.at(-1),/Caption end/);
});
