const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('promo-tools.js','utf8'),helpers=source.slice(0,source.indexOf('// END PURE GALLERY HELPERS')),core={};vm.createContext(core);vm.runInContext(helpers,core);

test('saved templates survive malformed storage and retain only bounded template identifiers',()=>{
 assert.deepEqual([...core.promoReadSaved('not json')],[]);
 assert.deepEqual([...core.promoReadSaved('{"unexpected":true}')],[]);
 assert.deepEqual([...core.promoReadSaved(JSON.stringify(['atelier-1','flyer-lab-2','atelier-1',null,2,'<script>','x'.repeat(141)]))],['atelier-1','flyer-lab-2']);
 const many=Array.from({length:2010},(_,i)=>'saved-'+i);assert.equal(core.promoReadSaved(JSON.stringify(many)).size,2000);assert.equal([...core.promoReadSaved(JSON.stringify(many))][0],'saved-10');
});

test('bookmark persistence succeeds atomically and reports storage failure without losing saved items',()=>{
 let fail=false,stored='',message='';const c={promoSaved:new Set(['existing']),promoSavedOnly:false,localStorage:{setItem(key,value){assert.equal(key,'opencanvas-saved-templates');if(fail)throw Error('quota');stored=value}},promoSyncSaved(){},toast(text){message=text}};vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function promoToggleSaved('),source.indexOf('templateCardMarkup=function')),c);
 c.promoToggleSaved('atelier-01');assert.deepEqual(JSON.parse(stored),['existing','atelier-01']);assert.equal(c.promoSaved.has('atelier-01'),true);
 fail=true;c.promoToggleSaved('existing');assert.equal(c.promoSaved.has('existing'),true);assert.match(message,/could not be saved/);
 fail=false;c.promoToggleSaved('existing');assert.deepEqual(JSON.parse(stored),['atelier-01']);assert.equal(c.promoSaved.has('existing'),false);
});

test('featured art direction stays diverse without losing or adding catalog entries',()=>{
 const items=Array.from({length:24},(_,i)=>({id:'atelier-'+i,collection:'atelier',layout:Math.floor(i/2),layoutName:'Direction '+Math.floor(i/2),asset:'photo-'+Math.floor(i/2)}));items.push({id:'older-1',collection:'flyer-lab'},{id:'older-2',collection:'reference'});
 const before=JSON.stringify(items),mixed=core.promoFeatureAtelier(items),first=mixed.slice(0,6);assert.equal(new Set(first.map(t=>t.layoutName)).size,6);assert.equal(new Set(first.map(t=>t.asset)).size,6);assert.equal(JSON.stringify(items),before);assert.deepEqual(new Set(mixed.map(t=>t.id)),new Set(items.map(t=>t.id)));assert.equal(mixed.length,items.length);
 const narrow=[items[5],items.at(-1)];assert.deepEqual(new Set(core.promoFeatureAtelier(narrow).map(t=>t.id)),new Set(narrow.map(t=>t.id)));assert.deepEqual(core.promoFeatureAtelier(items).map(t=>t.id),mixed.map(t=>t.id));
});

test('masonry uses available columns without overlap or changing the curated reading order',()=>{
 const heights=[330,210,460,180,360,270,430,150,290,320,400,200];
 for(const [columns,width] of [[1,320],[2,420],[3,840],[4,1100]]){
  const before=JSON.stringify(heights),result=core.promoGalleryPositions(heights,columns,width,20);
  assert.equal(JSON.stringify(heights),before);assert.equal(result.positions.length,heights.length);
  for(let i=0;i<heights.length;i++){
   const a=result.positions[i];assert.ok(a.left>=0&&a.left+a.width<=width+.0001);assert.ok(a.top+heights[i]<=result.height+.0001);
   if(i)assert.ok(a.top>=result.positions[i-1].top,'Visual starting heights must follow DOM order');
   for(let j=0;j<i;j++){const b=result.positions[j];assert.ok(a.left+a.width<=b.left+.001||b.left+b.width<=a.left+.001||a.top>=b.top+heights[j]||b.top>=a.top+heights[i],'Cards must never overlap');}
  }
 }
 assert.equal(core.promoGalleryPositions([],3,900).height,0);
 const packed=core.promoGalleryPositions(heights,3,840).height;
 const rows=Math.max(...heights.slice(0,3))+Math.max(...heights.slice(3,6))+Math.max(...heights.slice(6,9))+Math.max(...heights.slice(9,12))+60;
 assert.ok(packed<rows,'Packing should remove the empty space created by uniform rows');
});

function previewHarness(){
 const nodes=new Map();const node=()=>({textContent:'',innerHTML:'',dataset:{},style:{},open:false,isConnected:true,disabled:false,focusCount:0,setAttribute(){},focus(){this.focusCount++},showModal(){this.open=true},close(){this.open=false},getContext(){return{setTransform(){}}}});
 const $=id=>{if(id==='#previewCommunityCredit')return null;if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 let resolveFonts;const stats={built:0,started:0,painted:0},trigger=node(),fonts=new Promise(resolve=>resolveFonts=resolve);
 const c={$,document:{activeElement:trigger,querySelectorAll:()=>[]},promoFontsReady:fonts,promoPreviewRevision:0,promoPreviewId:'',promoPreviewFocus:null,promoRefreshOnClose:false,promoCollectionNames:{atelier:'Art directed'},templateCatalog:()=>[{id:'atelier-0',name:'Night Assembly',topic:'Music & DJ',layoutName:'Oversized type',collection:'atelier'}],template:()=>{stats.built++;return{width:1080,height:1350,elements:[{type:'text'},{type:'text'},{type:'image',src:'photo'},{type:'rect'}]}},communityInfo:()=>null,promoSyncSaved(){},promoToggleSaved(){},showCommunityCredit(){},drawDocument(){stats.painted++},loadImage:()=>({decode:()=>Promise.resolve()}),startDesign(){stats.started++},renderHubContent(){}};
 vm.createContext(c);vm.runInContext(helpers,c);vm.runInContext(source.slice(source.indexOf('function closeTemplatePreview('),source.indexOf("$('#templatePreviewBack').onclick")),c);
 return{c,$,trigger,stats,resolveFonts};
}

test('preview waits for fonts, reports actual layers, and applies only after explicit Use',async()=>{
 const h=previewHarness(),pending=h.c.openTemplatePreview('atelier-0',h.trigger);
 assert.equal(h.$('#templatePreview').open,true);assert.equal(h.stats.built,0);assert.equal(h.stats.started,0);assert.equal(h.$('#templatePreviewUse').disabled,true);
 h.resolveFonts();await pending;
 assert.equal(h.stats.built,1);assert.equal(h.stats.started,0);assert.equal(h.$('#templatePreviewDimensions').textContent,'1080 × 1350 px');
 assert.match(h.$('#templatePreviewFacts').innerHTML,/<b>2<\/b> editable text layers/);assert.match(h.$('#templatePreviewFacts').innerHTML,/<b>1<\/b> image layer/);assert.match(h.$('#templatePreviewFacts').innerHTML,/<b>1<\/b> editable shape/);
 assert.equal(h.$('#templatePreviewUse').disabled,false);assert.equal(h.$('#templatePreviewCanvas').height,1400);
 h.$('#templatePreviewUse').onclick();assert.equal(h.stats.started,1);assert.equal(h.stats.built,2);assert.equal(h.$('#templatePreview').open,false);
});

test('closing a pending preview preserves the current project and restores focus',async()=>{
 const h=previewHarness(),pending=h.c.openTemplatePreview('atelier-0',h.trigger);h.c.closeTemplatePreview();h.resolveFonts();await pending;
 assert.equal(h.stats.started,0);assert.equal(h.stats.built,0);assert.equal(h.stats.painted,0);assert.equal(h.trigger.focusCount,1);assert.equal(h.$('#templatePreview').open,false);
});

test('reopening the same template invalidates older asynchronous preview work',async()=>{
 const h=previewHarness(),first=h.c.openTemplatePreview('atelier-0',h.trigger);h.c.closeTemplatePreview();const second=h.c.openTemplatePreview('atelier-0',h.trigger);h.resolveFonts();await Promise.all([first,second]);
 assert.equal(h.stats.built,1);assert.equal(h.stats.started,0);assert.equal(h.$('#templatePreview').open,true);
});
