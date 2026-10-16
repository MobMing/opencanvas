// 26 original composition families, applied to 26 useful briefs in each topic.
// Four different families per brief: these are editable combinations, not stock-template copies.
const libraryLayoutNames=['Cover story','Split field','Paper gallery','Oversized masthead','Circle spotlight','Contact sheet','The information desk','Framed announcement','Off-center exhibition','Color-block invitation','Vertical issue','Three moments','Open window','Weekend supplement','Studio index','Stacked tickets','The bulletin','Archive label','Corner crop','Photo essay','The schedule','Postage club','Full-frame caption','Side notes','Gallery diptych','Ribbon headline'];
const libraryPalettes=[
 ['#f4f0e5','#242c32','#c34830'],['#172a34','#f5efd7','#d7f85e'],['#e5dbe9','#3b274c','#bd447a'],['#e7ede8','#24443c','#c07943'],
 ['#142d58','#f8f0d8','#ed9778'],['#f4d9bf','#5c302b','#ba4829'],['#f0efdf','#30372a','#8c5536'],['#171718','#f0f0e5','#dfef57'],
 ['#d9e7f3','#203e68','#b8373c'],['#f6d9e1','#602c40','#a93357'],['#ede3cf','#373a59','#a16e44'],['#4b2948','#f4dfbd','#e4a0a8'],
 ['#f1e8d8','#124f4a','#cf693c'],['#d5e2ca','#2c4731','#8f3f2f'],['#e4e1d9','#233f79','#bd4e34'],['#302b42','#f3e8d3','#c0b4f0'],
 ['#efd36d','#312e3a','#9c3034'],['#dfecef','#133b42','#b54539'],['#f6ece5','#622a2e','#b35743'],['#251f29','#f4e7d0','#eb9681']
];
function libraryTokens(value){return String(value||'').toLowerCase().match(/[a-z0-9]+/g)||[];}
function libraryContrast(a,b){const lum=hex=>{const rgb=hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const libraryVisualAliases={puppy:['dog','puppy'],cat:['cat','kitten'],dog:['dog','labrador','puppy'],bird:['bird','parrot','macaw'],fish:['fish','aquarium'],reptile:['reptile','lizard','turtle'],forest:['forest','tree','fern'],coast:['coast','sea','seascape','ocean'],city:['city','architecture','skyline'],architecture:['architecture','facade','building'],portrait:['portrait','headshot'],studio:['studio','photographer'],film:['film','camera'],gallery:['art','painting','sculpture'],couple:['couple','wedding'],product:['product','still life'],pottery:['pottery','ceramic','ceramics'],weaving:['weaving','loom','textile'],knitting:['knitting','yarn','wool'],embroidery:['embroidery','stitch'],fabric:['fabric','textile'],yarn:['yarn','knitting','wool'],printmaking:['printmaking','woodcut','linocut'],wood:['wood','woodworking'],paper:['paper','origami','stationery'],jewelry:['jewelry','jewellery','beads'],beads:['beads','jewelry'],bookbinding:['bookbinding','book'],circuit:['circuit','electronics','motherboard'],chip:['chip','processor','microchip','circuit'],robot:['robot','robotics'],code:['code','programming','keyboard'],computer:['computer','circuit','keyboard'],phone:['phone','smartphone'],network:['network','ethernet'],printer:['printer','3d print'],terminal:['terminal','keyboard'],flowers:['flower','floral','botanical'],leaf:['leaf','leaves','botanical'],stage:['stage','concert'],vinyl:['vinyl','record'],dance:['dance','festival'],guitar:['guitar','music'],running:['running','runner'],coffee:['coffee','cafe']};
function librarySelectAssets(topic,brief,seed,info){
 const directed=typeof libraryDirectedAssets==='function'?libraryDirectedAssets(topic,brief):undefined;
 if(Array.isArray(directed)){if(!directed.length)return [];const ids=directed.filter(id=>(info||[]).some(a=>a.id===id));if(ids.length){const shifted=[...ids.slice(seed%ids.length),...ids.slice(0,seed%ids.length)];return topic==='Pets'&&/find|missing|lost|adopt a|cat adoption/i.test(brief.title+' '+brief.subtitle)?shifted.slice(0,1):shifted.slice(0,3);}}
 const wanted=new Set(libraryTokens([brief.visual,brief.title,...(brief.tags||[])].join(' '))),primary=libraryTokens(brief.visual).flatMap(w=>libraryVisualAliases[w]||[w]),pool=(info||[]).filter(a=>(a.topics||[]).includes(topic)||topic==='Photography'&&a.mediaType==='photo').filter(a=>!(topic==='Photography'&&['portrait','couple','family','fashion'].includes(brief.visual))||a.hasPeople);
 const ranked=pool.map(a=>{const words=new Set(libraryTokens([a.title,a.alt,...(a.tags||[])].join(' '))),matches=primary.filter(w=>w.includes(' ')?[...words].join(' ').includes(w):words.has(w)||words.has(w+'s'));return {a,primary:matches.length,score:matches.length*10+[...words].reduce((n,w)=>n+(wanted.has(w)?1:0),0)};}).filter(x=>x.primary>0&&(topic!=='Pets'||x.a.mediaType!=='artwork')).sort((a,b)=>b.score-a.score||String(a.a.id).localeCompare(String(b.a.id)));
 // A pet-specific subject must match its photograph; never put a dog on a missing-cat notice.
 const species=['cat','dog','rabbit','bird','fish','reptile','horse','hamster','guinea','turtle'];
 const requested=species.filter(s=>wanted.has(s)||wanted.has(s+'s'));
 const usable=ranked.filter(({a})=>topic!=='Pets'||!requested.length||requested.some(s=>{const aliases={bird:['bird','parrot','macaw','budgie','budgerigar'],fish:['fish','goldfish','aquarium'],reptile:['reptile','lizard','turtle']}[s]||[s];return libraryTokens([a.title,a.alt,...(a.tags||[])].join(' ')).some(w=>aliases.some(k=>w===k||w===k+'s'));}));
 if(!usable.length)return [];
 const best=usable[0].score,near=usable.filter(x=>x.score>=Math.max(1,best-5)),choices=near.length?near:usable;
 const selected=[choices[seed%choices.length].a,...choices.filter(x=>x.a.id!==choices[seed%choices.length].a.id).slice(0,2).map(x=>x.a)].map(a=>a.id);
 return topic==='Pets'&&/find|missing|lost|adopt a|cat adoption/i.test(brief.title+' '+brief.subtitle)?selected.slice(0,1):selected;
}
function libraryBuildTemplates(topics,info=[]){
 return topics.flatMap((group,ti)=>group.briefs.flatMap((brief,bi)=>Array.from({length:4},(_,variant)=>{
  const family=(bi*5+variant*7+ti*3)%26,p=libraryPalettes[(bi+variant*5+ti*2)%libraryPalettes.length],assetIds=librarySelectAssets(group.topic,brief,bi+variant,info);
  return {id:'library-'+group.slug+'-'+String(bi+1).padStart(2,'0')+'-'+(variant+1),name:brief.title+' / '+libraryLayoutNames[family],title:brief.title,topic:group.topic,brief,briefIndex:bi,variant,family,
   width:1080,height:1350,category:'Poster',format:'post',layoutName:libraryLayoutNames[family],style:['Editorial','Bold','Classic','Minimal'][variant],bg:p[0],ink:p[1],accent:p[2],
   collection:'open-library',tags:[group.topic,...brief.tags,brief.visual,brief.title,brief.subtitle].join(' '),assetIds,hasPeople:assetIds.some(id=>info.find(a=>a.id===id)?.hasPeople),aiImagery:false,
   imagery:assetIds.length?(info.find(a=>a.id===assetIds[0])?.hasPeople?'People':group.topic==='Photography'?'Art & textures':group.topic==='Pets'?'Animals':group.topic==='Technology'?'Equipment':'Crowds & places'):'Shapes & symbols',detail:'OpenCanvas composition · Editable text and shapes · Credited open artwork'};
 })));
}
const libraryCommunityTitles=['The Open Room','Shared Perspectives','Common Ground','Local Histories','Prints for Everyone','Community Lens','Made Together','The Nature Table','Objects Tell Stories','Our Neighborhood','The Reading Room','Public Art Weekend','The Open Archive','People and Place','The Listening Room','Small Discoveries','An Open Invitation','The Living Collection','Ways of Seeing','Art After Hours','The Exchange','Sunday at the Gallery','The Next Chapter','A Shared Canvas','Found in the Everyday','The Community Edit'];
const libraryCommunityGroup={topic:'Community',slug:'community',briefs:libraryCommunityTitles.map((title,i)=>({title,subtitle:['Art and ideas belong to everyone.','A shared space for a new perspective.','Discover something worth talking about.','Bring your curiosity. Make a connection.'][i%4],kicker:'YOUR COMMUNITY / OPEN COLLECTION',details:['YOUR DATE / YOUR VENUE','OPEN TO ALL / YOUR DETAILS','EXPLORE / DISCUSS / CREATE'],cta:['EXPLORE THE COLLECTION','COME AND TAKE A LOOK','MAKE ROOM FOR ART','JOIN THE CONVERSATION'][i%4],tags:['community','exhibition','open art','public collection'],visual:['nature botanical','architecture city','textile craft','photography landscape','space astronomy','music instrument','animals pet','books library'][i%8]}))};
const libraryTemplates=libraryBuildTemplates([...libraryTopics,libraryCommunityGroup],typeof openLibraryInfo==='undefined'?[]:openLibraryInfo);
function makeLibraryDesign(t,assets={},info=[]){
 const d={version:1,id:uid(),name:t.name,width:1080,height:1350,background:t.bg,elements:[]},a=d.elements,b=t.brief;
 const R=(x,y,w,h,c=t.ink,k='rect',extra={})=>{const e=shape(x,y,w,h,c,k);Object.assign(e,extra);a.push(e);return e;};
 const T=(text,x,y,w,h,size=30,c=t.ink,font='DM Sans',extra={})=>{const surface=[...a].reverse().find(e=>['rect','round'].includes(e.type)&&e.opacity===1&&!e.rotation&&e.x<=x&&e.y<=y&&e.x+e.w>=x+w&&e.y+e.h>=y+h)?.color||t.bg;if(libraryContrast(c,surface)<4.5)c=[t.ink,t.bg,'#111111','#ffffff'].sort((p,q)=>libraryContrast(q,surface)-libraryContrast(p,surface))[0];const e=txt(String(text),x,y,w,Math.min(size,h/1.1),c,{h,font,weight:font==='Cormorant Garamond'?'400':'700',lineHeight:1.04,...extra});a.push(e);return e;};
 const C=(x,y,s,c=t.accent)=>R(x,y,s,s,c,'ellipse');
 const rule=(x,y,w,c=t.ink,h=2)=>R(x,y,w,h,c);
 const title=(x,y,w,h,size=110,c=t.ink,font)=>T(b.title,x,y,w,h,size,c,font||(['Bebas Neue','DM Sans','Cormorant Garamond','Anton'][t.variant]));
 const kicker=(x=60,y=48,w=960,c=t.ink)=>T(b.kicker,x,y,w,38,22,c);
 const sub=(x,y,w,h=100,c=t.ink)=>T(b.subtitle,x,y,w,h,34,c,'DM Sans',{weight:'400',lineHeight:1.18});
 const details=(x,y,w,h=140,c=t.ink)=>T(b.details.join('\n'),x,y,w,h,25,c,'DM Sans',{weight:'400',lineHeight:1.35});
 const cta=(x=60,y=1230,w=960,c=t.ink)=>{rule(x,y-20,w,c);T(b.cta,x,y,w,62,27,c);};
 const note=(label,x,y,w,c=t.ink)=>T(label,x,y,w,36,24,c,'DM Sans',{weight:'400'});
 const badge=(text,x,y,w=240,c=t.accent,ink=t.bg)=>{R(x,y,w,65,c);T(text,x+14,y+13,w-28,43,25,ink);};
 const motif=(x,y,w,h)=>{
  R(x,y,w,h,t.accent,'rect',{opacity:.12});const cx=x+w/2,cy=y+h/2,s=Math.min(w,h)*.58;
  if(t.topic==='Pets'){
   const cat=/cat|kitten/.test(b.visual+' '+b.title),fish=/fish|aquar/.test(b.visual+' '+b.title),bird=/bird/.test(b.visual+' '+b.title);
   if(fish){R(cx-s/2,cy-s/3,s,s*.66,t.ink,'ellipse');R(cx+s*.28,cy-s*.33,s*.5,s*.66,t.accent,'triangle',{rotation:90});C(cx-s*.25,cy-s*.1,s*.07,t.bg);}
   else if(bird){R(cx-s*.3,cy-s*.25,s*.7,s*.6,t.ink,'ellipse');C(cx+s*.1,cy-s*.5,s*.35,t.ink);R(cx+s*.38,cy-s*.35,s*.2,s*.16,t.accent,'triangle',{rotation:90});}
   else if(cat){C(cx-s/2,cy-s/2,s,t.ink);R(cx-s/2,cy-s*.64,s*.38,s*.42,t.ink,'triangle');R(cx+s*.12,cy-s*.64,s*.38,s*.42,t.ink,'triangle');C(cx-s*.26,cy-s*.12,s*.09,t.bg);C(cx+s*.16,cy-s*.12,s*.09,t.bg);R(cx-s*.08,cy+s*.12,s*.16,s*.14,t.accent,'triangle',{rotation:180});}
   else{R(cx-s*.32,cy-s*.02,s*.64,s*.48,t.ink,'ellipse');[[.1,-.38],[.38,-.2],[-.19,-.39],[-.43,-.17]].forEach(([dx,dy])=>C(cx+s*dx-s*.12,cy+s*dy,s*.25,t.ink));}
  }else if(t.topic==='Technology'){
   if(/shield|lock/.test(b.visual)){R(cx-s*.35,cy-s*.4,s*.7,s*.65,t.ink,'round');R(cx-s*.35,cy-s*.05,s*.7,s*.55,t.ink,'triangle',{rotation:180});C(cx-s*.15,cy-s*.17,s*.3,t.bg);R(cx-s*.05,cy,s*.1,s*.2,t.bg);}
   else if(/cloud/.test(b.visual)){C(cx-s*.46,cy-s*.05,s*.42,t.ink);C(cx-s*.15,cy-s*.35,s*.6,t.ink);C(cx+s*.16,cy-s*.04,s*.4,t.ink);R(cx-s*.25,cy+s*.1,s*.6,s*.25,t.ink);}
   else if(/chip|circuit|network/.test(b.visual)){R(cx-s*.3,cy-s*.3,s*.6,s*.6,t.ink);R(cx-s*.2,cy-s*.2,s*.4,s*.4,t.accent);for(let i=0;i<4;i++){const q=-.22+i*.15;R(cx+s*q,cy-s*.5,s*.04,s*.2,t.ink);R(cx+s*q,cy+s*.3,s*.04,s*.2,t.ink);R(cx-s*.5,cy+s*q,s*.2,s*.04,t.ink);R(cx+s*.3,cy+s*q,s*.2,s*.04,t.ink);}}
   else if(/phone/.test(b.visual)){R(cx-s*.28,cy-s*.5,s*.56,s,t.ink,'round');R(cx-s*.22,cy-s*.4,s*.44,s*.72,t.bg);R(cx-s*.16,cy-s*.3,s*.32,s*.28,t.accent,'round');for(let i=0;i<3;i++)rule(cx-s*.15,cy+s*(.06+i*.08),s*.3,t.ink,4);C(cx-s*.04,cy+s*.38,s*.08,t.bg);}
   else if(/robot/.test(b.visual)){R(cx-s*.4,cy-s*.35,s*.8,s*.7,t.ink,'round');C(cx-s*.25,cy-s*.14,s*.16,t.accent);C(cx+s*.09,cy-s*.14,s*.16,t.accent);R(cx-s*.17,cy+s*.15,s*.34,s*.06,t.bg);R(cx-s*.025,cy-s*.55,s*.05,s*.2,t.accent);C(cx-s*.08,cy-s*.65,s*.16,t.accent);}
   else if(/database/.test(b.visual)){R(cx-s*.4,cy-s*.3,s*.8,s*.7,t.ink);C(cx-s*.4,cy-s*.5,s*.8,t.ink);R(cx-s*.4,cy-s*.5,s*.8,s*.3,t.accent,'ellipse');R(cx-s*.4,cy+s*.25,s*.8,s*.3,t.ink,'ellipse');rule(cx-s*.33,cy,s*.66,t.bg,5);rule(cx-s*.33,cy+s*.16,s*.66,t.bg,5);}
   else{R(cx-s*.5,cy-s*.36,s,s*.64,t.ink,'round');R(cx-s*.43,cy-s*.29,s*.86,s*.5,t.bg);for(let i=0;i<5;i++)R(cx-s*.34,cy-s*.19+i*s*.07,s*(.35+(i%3)*.12),s*.018,i%2?t.accent:t.ink);R(cx-s*.14,cy+s*.29,s*.28,s*.1,t.ink);R(cx-s*.32,cy+s*.38,s*.64,s*.04,t.ink);}
  }else if(t.topic==='Crafts'){
   if(/paper|print|card|book/.test(b.visual+' '+b.title)){for(let i=2;i>=0;i--){R(cx-s*.4+i*18,cy-s*.45-i*15,s*.68,s*.82,i%2?t.accent:t.ink);R(cx-s*.34+i*18,cy-s*.39-i*15,s*.56,s*.7,t.bg);}}
   else{R(cx-s*.27,cy-s*.4,s*.54,s*.75,t.ink,'round');R(cx-s*.32,cy-s*.47,s*.64,s*.12,t.accent);R(cx-s*.32,cy+s*.3,s*.64,s*.12,t.accent);for(let i=0;i<9;i++)rule(cx-s*.22,cy-s*.3+i*s*.06,s*.44,t.bg,3);}
  }else if(t.topic==='Real Estate'){
   R(cx-s*.4,cy-s*.1,s*.8,s*.55,t.ink);R(cx-s*.5,cy-s*.5,s,s*.5,t.accent,'triangle');R(cx-s*.09,cy+s*.12,s*.18,s*.33,t.bg);R(cx-s*.31,cy+s*.05,s*.14,s*.15,t.bg);R(cx+s*.17,cy+s*.05,s*.14,s*.15,t.bg);
  }else if(t.topic==='Travel'){
   C(cx-s*.5,cy-s*.5,s,t.ink);C(cx-s*.44,cy-s*.44,s*.88,t.bg);R(cx-s*.18,cy-s*.36,s*.36,s*.72,t.accent,'triangle');C(cx-s*.05,cy-s*.05,s*.1,t.ink);
  }else if(t.topic==='Photography'){
   R(cx-s*.5,cy-s*.33,s,s*.67,t.ink,'round');R(cx-s*.28,cy-s*.45,s*.4,s*.17,t.ink);C(cx-s*.25,cy-s*.25,s*.5,t.accent);C(cx-s*.17,cy-s*.17,s*.34,t.bg);C(cx-s*.1,cy-s*.1,s*.2,t.ink);C(cx+s*.32,cy-s*.2,s*.07,t.bg);
  }else if(['Music & DJ','Podcast','Entertainment'].includes(t.topic)){
   C(cx-s/2,cy-s/2,s,t.ink);C(cx-s*.38,cy-s*.38,s*.76,t.bg);C(cx-s*.34,cy-s*.34,s*.68,t.ink);C(cx-s*.17,cy-s*.17,s*.34,t.accent);C(cx-s*.04,cy-s*.04,s*.08,t.bg);
  }else if(['Books','Education'].includes(t.topic)){
   R(cx-s*.5,cy-s*.4,s,s*.8,t.ink);R(cx-s*.45,cy-s*.34,s*.41,s*.67,t.bg);R(cx+s*.04,cy-s*.34,s*.41,s*.67,t.bg);for(let i=0;i<6;i++){rule(cx-s*.38,cy-s*.22+i*s*.08,s*.27,t.accent,3);rule(cx+s*.1,cy-s*.22+i*s*.08,s*.27,t.accent,3);}
  }else if(['Faith & Community','Nonprofit'].includes(t.topic)){
   for(let i=0;i<3;i++){const px=cx-s*.42+i*s*.3;C(px,cy-s*.42,s*.22,i===1?t.accent:t.ink);R(px-s*.03,cy-s*.13,s*.28,s*.48,i===1?t.accent:t.ink,'round');}rule(cx-s*.45,cy+s*.42,s*.9,t.ink,5);
  }else if(['Fitness','Sports'].includes(t.topic)){
   R(cx-s*.5,cy-s*.3,s*.18,s*.6,t.ink,'round');R(cx+s*.32,cy-s*.3,s*.18,s*.6,t.ink,'round');R(cx-s*.32,cy-s*.06,s*.64,s*.12,t.accent);R(cx-s*.42,cy-s*.4,s*.12,s*.8,t.accent,'round');R(cx+s*.3,cy-s*.4,s*.12,s*.8,t.accent,'round');
  }else if(t.topic==='Gaming'){
   R(cx-s*.5,cy-s*.25,s,s*.55,t.ink,'round');R(cx-s*.32,cy-s*.1,s*.13,s*.3,t.bg);R(cx-s*.4,cy-s*.02,s*.3,s*.13,t.bg);C(cx+s*.18,cy-s*.1,s*.12,t.accent);C(cx+s*.32,cy+s*.05,s*.12,t.accent);
  }else if(t.topic==='Beauty'){
   R(cx-s*.26,cy-s*.25,s*.52,s*.7,t.ink,'round');R(cx-s*.18,cy-s*.44,s*.36,s*.2,t.accent);R(cx-s*.22,cy-s*.02,s*.44,s*.27,t.bg);R(cx+s*.34,cy-s*.02,s*.12,s*.47,t.accent,'round');
  }else if(t.topic==='Food & Drink'){
   R(cx-s*.46,cy-s*.12,s*.92,s*.5,t.ink,'round');R(cx-s*.46,cy-s*.21,s*.92,s*.2,t.accent,'ellipse');for(let i=0;i<3;i++)R(cx+s*(-.25+i*.23),cy-s*.5,s*.045,s*.2,t.ink,'round');
  }else if(t.topic==='Weddings'){
   C(cx-s*.45,cy-s*.25,s*.6,t.ink);C(cx-s*.38,cy-s*.18,s*.46,t.bg);C(cx-s*.08,cy-s*.25,s*.6,t.accent);C(cx-s*.01,cy-s*.18,s*.46,t.bg);
  }else if(t.topic==='Gardening'){
   R(cx-s*.03,cy-s*.35,s*.06,s*.8,t.ink);for(let i=0;i<3;i++){R(cx-s*.36,cy-s*(.3-i*.24),s*.34,s*.18,t.accent,'ellipse');R(cx+s*.03,cy-s*(.42-i*.24),s*.34,s*.18,t.ink,'ellipse');}
  }else if(['Small Business','Marketing'].includes(t.topic)){
   for(let i=0;i<4;i++){const bh=s*(.25+i*.17);R(cx-s*.45+i*s*.24,cy+s*.4-bh,s*.16,bh,i%2?t.accent:t.ink);}rule(cx-s*.5,cy+s*.45,s,t.ink,4);
  }else{for(let i=0;i<8;i++){const angle=i*Math.PI/4;C(cx+Math.cos(angle)*s*.28-s*.15,cy+Math.sin(angle)*s*.28-s*.15,s*.3,i%2?t.ink:t.accent);}C(cx-s*.14,cy-s*.14,s*.28,t.bg);}
 };
 const usedArt=new Set();
 const photo=(x,y,w,h,index=0,extra={})=>{const id=t.assetIds[index%Math.max(1,t.assetIds.length)],src=assets[id];if(!(typeof artworkSourceAllowed==='function'&&artworkSourceAllowed(src))&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(src||'')){motif(x,y,w,h);return;}const credit=info.find(a=>a.id===id);usedArt.add(id);a.push(base('image',x,y,w,h,{src,photoCrop:{zoom:1,x:.5,y:.5},altText:credit?[credit.title,credit.creator,credit.license,credit.sourceUrl,credit.licenseUrl,'Resized, encoded and cropped in this layout.'].join(' · ').slice(0,1000):id,...extra}));};
 // Structural layouts use disjoint text zones; photos are replaceable without flattening type.
 switch(t.family){
 case 0:kicker();title(60,126,960,235,112);photo(60,400,960,590);sub(60,1035,575,125);details(690,1035,330,145);cta();break;
 case 1:R(590,0,490,1350,t.accent);photo(590,0,490,920);kicker(52,52,495);title(52,180,490,420,116);sub(52,685,490,200);details(52,980,490,155);T(b.cta,635,1000,390,240,54,t.bg,'Bebas Neue');break;
 case 2:kicker();R(100,215,880,790,t.ink);R(115,230,850,760,t.bg);photo(150,265,780,565);title(150,862,780,115,70);sub(100,1045,880,100);cta(100,1230,880);break;
 case 3:kicker();title(46,140,988,340,168);photo(395,490,635,610);badge(String(t.briefIndex+1).padStart(2,'0'),50,510,275);sub(50,655,290,205);details(50,895,290,220);cta();break;
 case 4:kicker();title(60,135,960,220,104);C(100,400,880,t.accent);photo(160,460,760,610);R(60,1095,960,220,t.bg);sub(60,1110,600,120);T(b.cta,710,1120,310,150,32);break;
 case 5:kicker();title(60,135,960,230,102);[0,1,2].forEach((n)=>{photo(60+n*326,410,308,390,n);note('FRAME / 0'+(n+1),60+n*326,822,308);});sub(60,930,550,155);details(675,930,345,170);cta();break;
 case 6:R(0,0,1080,1350,t.ink);kicker(60,48,960,t.bg);title(60,135,960,250,125,t.bg);photo(60,430,450,495);sub(560,430,460,155,t.bg);b.details.forEach((v,i)=>{rule(560,630+i*105,460,t.bg);T(v,560,660+i*105,460,70,27,t.bg);});badge(b.cta,60,1035,960,t.accent,t.ink);break;
 case 7:R(32,32,1016,1286,t.ink);R(44,44,992,1262,t.bg);kicker(80,75,920);title(90,180,900,250,116);photo(90,480,900,450);sub(90,985,900,90);details(90,1090,550,150);T(b.cta,700,1110,290,140,36);break;
 case 8:R(0,0,650,1350,t.accent);photo(75,80,780,775);R(390,770,635,475,t.bg);title(435,810,540,190,94);sub(435,1030,540,100);T(b.cta,435,1170,540,52,26);T(b.kicker,75,1055,245,190,28,t.bg);break;
 case 9:R(0,0,1080,450,t.accent);title(60,80,960,290,135,t.bg);photo(60,505,570,660);kicker(680,510,340);sub(680,625,340,230);details(680,905,340,220);cta();break;
 case 10:R(0,0,205,1350,t.ink);T(String(t.briefIndex+1).padStart(2,'0'),28,52,150,150,118,t.bg,'Bebas Neue');T(b.kicker,32,270,142,650,28,t.bg);title(255,80,765,240,118);photo(255,370,765,570);sub(255,990,765,110);cta(255,1225,765);break;
 case 11:kicker();title(60,140,960,250,120);[0,1,2].forEach(n=>{const y=440+n*235;photo(60,y,290,210,n);T('0'+(n+1),395,y+12,100,80,60,t.accent,'Bebas Neue');T(b.details[n],520,y+22,500,115,38);rule(395,y+195,625);});cta();break;
 case 12:R(0,0,1080,1350,t.ink);photo(100,80,880,1040);R(160,140,760,210,t.bg);title(190,165,700,160,86);R(160,805,760,250,t.bg);sub(190,840,700,100);T(b.cta,190,975,700,55,28);note(b.kicker,100,1195,880,t.bg);break;
 case 13:kicker();rule(60,110,960);title(60,145,960,190,97);R(60,385,960,665,t.accent);photo(80,405,920,625);sub(60,1090,600,130);T(b.cta,730,1090,290,150,36);break;
 case 14:T('INDEX / '+String(t.briefIndex+1).padStart(2,'0'),60,50,960,45,24,t.accent);title(60,150,580,280,106);photo(680,150,340,400);photo(60,590,580,530,1);sub(680,630,340,170);details(680,865,340,220);cta();break;
 case 15:kicker();title(60,140,960,270,127);[0,1,2].forEach(n=>{const y=465+n*225;R(60,y,960,195,n%2?t.accent:t.ink);T('0'+(n+1),85,y+35,150,110,86,t.bg,'Bebas Neue');T(b.details[n],285,y+40,690,120,39,t.bg);for(let k=0;k<10;k++)C(238,y+8+k*18,6,t.bg);});T(b.cta,60,1205,960,75,35);break;
 case 16:R(0,0,1080,1350,t.accent);R(65,65,950,1220,t.bg);T(b.kicker,105,105,870,45,23);title(105,210,870,290,125);photo(105,530,870,450);sub(105,1020,870,110);cta(105,1200,870);break;
 case 17:photo(0,0,1080,760);R(0,735,1080,615,t.ink);T(b.kicker,60,790,960,38,23,t.bg);title(60,870,960,200,104,t.bg);sub(60,1110,600,135,t.bg);T(b.cta,730,1110,290,170,33,t.bg);break;
 case 18:kicker();photo(470,145,610,760);title(55,180,510,355,130);R(55,600,495,430,t.accent);sub(90,640,425,130,t.bg);T(b.cta,90,850,425,140,39,t.bg);details(630,990,390,245);break;
 case 19:kicker();title(60,140,960,200,105);photo(60,390,610,650);photo(700,390,320,310,1);photo(700,730,320,310,2);sub(60,1090,620,150);T(b.cta,740,1100,280,160,33);break;
 case 20:kicker();title(60,135,960,240,114);photo(60,430,420,720);b.details.forEach((v,i)=>{const y=430+i*238;badge('0'+(i+1),530,y,135,t.accent,t.bg);T(v,530,y+90,490,115,36);rule(530,y+210,490);});cta();break;
 case 21:R(45,45,990,1260,t.ink);R(60,60,960,1230,t.bg);for(let i=0;i<17;i++){C(30,50+i*74,30,t.bg);C(1020,50+i*74,30,t.bg);}kicker(105,100,870);photo(105,185,870,635);title(105,860,870,195,96);sub(105,1085,550,120);T(b.cta,740,1085,235,150,30);break;
 case 22:photo(0,340,1080,690);R(0,0,1080,340,t.ink);kicker(60,40,960,t.bg);title(60,105,960,210,104,t.bg);R(60,1030,960,245,t.bg);sub(90,1060,550,165);T(b.cta,720,1060,270,165,35);break;
 case 23:kicker();title(60,125,960,240,120);photo(60,420,685,760);T(b.subtitle,800,435,220,240,33);b.details.forEach((v,i)=>{rule(800,740+i*125,220);T(v,800,760+i*125,220,95,24);});cta();break;
 case 24:kicker();title(60,140,960,240,118);photo(60,430,465,575);photo(555,430,465,575,1);note('01 / '+t.topic.toUpperCase(),60,1020,465);note('02 / THE NEW EDIT',555,1020,465);sub(60,1115,600,145);T(b.cta,720,1115,300,150,33);break;
 case 25:R(0,0,1080,345,t.accent);title(60,55,960,235,117,t.bg);photo(60,395,960,540);R(60,975,960,310,t.ink);sub(95,1010,560,175,t.bg);T(b.cta,740,1020,240,170,33,t.bg);kicker(95,1230,880,t.bg);break;
 }
 // Keep the event/service information in every composition, including cover-like layouts.
 const missingDetails=b.details.filter(value=>!a.some(e=>e.type==='text'&&e.text.includes(value)));
 if(missingDetails.length){const reserve=108,scale=(1350-reserve)/1350;a.forEach(e=>{e.y*=scale;e.h*=scale;if(e.type==='text')e.size=Math.max(19,e.size*scale);});R(0,1242,1080,108,t.bg);rule(35,1247,1010,t.ink);missingDetails.forEach((value,i)=>T(value,35+i*342,1263,318,75,25,t.ink,'DM Sans',{weight:'400',lineHeight:1.15}));}
 // Keep required photo attribution in flat exports, as well as portable image metadata.
 const credits=[...usedArt].map(id=>info.find(a=>a.id===id)).filter(x=>x&&/^CC BY/.test(x.license));
 if(credits.length){const reserve=credits.length*64+12,scale=(1350-reserve)/1350;a.forEach(e=>{e.y*=scale;e.h*=scale;if(e.type==='text')e.size=Math.max(18,e.size*scale);});R(0,1350-reserve,1080,reserve,t.bg);credits.forEach((c,i)=>{const y=1350-reserve+7+i*64;T(c.title+' — '+c.creator+' · '+c.license,35,y,1010,29,19,t.ink,'DM Sans',{weight:'400'});T('Source, license & changes: mobming.github.io/opencanvas/credits.html#'+c.id,35,y+30,1010,27,17,t.ink,'DM Sans',{weight:'400',link:'https://mobming.github.io/opencanvas/credits.html#'+c.id});});}
 return d;
}
