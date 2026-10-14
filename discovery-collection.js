// Stable editorial sequencing: variety without reshuffling while people browse.
function discoveryHash(s){let n=2166136261;for(const ch of s)n=Math.imul(n^ch.charCodeAt(0),16777619);return n>>>0;}
function curateTemplates(items){
 const pool=[...new Map(items.map(t=>[t.id,t])).values()].sort((a,b)=>discoveryHash(a.id)-discoveryHash(b.id)||a.id.localeCompare(b.id)),out=[],counts=new Map(),usedAssets=new Map();
 const assets=t=>t.assetIds?.length?t.assetIds:t.asset?[t.asset]:[];
 while(pool.length){
  let best=0,bestScore=-Infinity;const candidates=Math.min(pool.length,96);
  for(let i=0;i<candidates;i++){
   // Sample the entire remaining catalog; similar ID prefixes must not monopolize a page.
   const index=candidates===1?0:Math.floor(i*(pool.length-1)/(candidates-1)),t=pool[index],collection=t.collection||'original',photoIds=assets(t);
   let score=-(counts.get(collection)||0)*1.2+discoveryHash(t.id)/4294967296+(['crossovers','new-wave'].includes(collection)?.65:0)-photoIds.reduce((sum,id)=>sum+(usedAssets.get(id)||0)*5,0);
   for(let j=Math.max(0,out.length-12);j<out.length;j++){
    const p=out[j],distance=out.length-j,w=1/distance;
    if(t.topic===p.topic)score-=5*w;
    if((t.layoutName||t.style)===(p.layoutName||p.style))score-=8*w;
    if(t.style===p.style)score-=2*w;
    if(t.bg&&t.bg===p.bg)score-=4*w;
    if(photoIds.some(id=>assets(p).includes(id)))score-=24*w;
    if(t.collection===p.collection)score-=3*w;
   }
   if(score>bestScore){bestScore=score;best=index;}
  }
  const [t]=pool.splice(best,1);out.push(t);const key=t.collection||'original';counts.set(key,(counts.get(key)||0)+1);
  for(const id of assets(t))usedAssets.set(id,(usedAssets.get(id)||0)+1);
 }
 return out;
}
const crossoverFamilies=[
 ['Window masthead','Editorial',['AFTER THE SET','LOCAL VOICES','SLOW SUNDAY','THE STREET EDIT'],['duo','podcast-pair','wellness','creator-street'],['Music & DJ','Podcast','Wellness','Fashion']],
 ['Offset contact sheet','Playful',['NIGHT PEOPLE','MADE TO MOVE','STUDIO OPEN','MEET THE MAKER'],['night-friends','dancer','creator','creative-founder'],['Entertainment','Fitness','Photography','Marketing']],
 ['Sidecar playbill','Bold',['SUB LEVEL','SOUL ROOM','THE LAUGH LAB','FUTURE BEAUTY'],['dj-techno','singer','comedian','beauty-editorial'],['Music & DJ','Entertainment','Entertainment','Beauty']],
 ['Postcard journal','Classic',['ABOVE THE CITY','A FOREST PAUSE','COASTAL NOTES','PARIS ON PAPER'],['rooftop','life-forest','mix-beach','city-paris'],['Travel','Wellness','Travel','Travel']],
 ['Framed feature','Minimal',['PORTRAIT OF NOW','NEW IDEAS CLUB','THE GLOW EDIT','AT THE TABLE'],['fashion','life-creator','studio-portrait','mix-picnic'],['Fashion','Marketing','Beauty','Food & Drink']],
 ['Stacked scene','Retro',['WAX SOCIAL','DISCO PEOPLE','TAKE THE STAGE','TOKYO AFTER DARK'],['dj-vinyl','dj-disco','performer','city-tokyo'],['Music & DJ','Music & DJ','Entertainment','Travel']],
 ['Graphic ticket','Bold',['BASS DEPARTMENT','MAKERS WEEKEND','OPEN MIC CLUB','PLAY ALL NIGHT'],['','','',''],['Music & DJ','Small Business','Entertainment','Gaming']],
 ['Orbit typography','Playful',['SIGNAL GARDEN','GOOD THINGS FAIR','CREATIVE CIRCLES','SUNDAY LISTENING'],['','','',''],['Music & DJ','Small Business','Marketing','Music & DJ']]
];
const crossoverPalettes=[['#f3eee3','#19283a','#e25534'],['#211d36','#fff0d8','#c3e77c'],['#f9d9cb','#662c46','#ff6942'],['#dce7e1','#203e38','#cf5834'],['#efe7db','#30233f','#b795cb'],['#122e48','#f8e7bc','#e6a04b'],['#e7edbf','#183f42','#ed6a39'],['#522c37','#fff0d9','#dcaaed']];
const crossoverTemplates=crossoverFamilies.flatMap(([layoutName,style,titles,assets,topics],layout)=>titles.map((title,i)=>{const [bg,ink,accent]=crossoverPalettes[(layout*3+i*5)%8],asset=assets[i];return{id:'crossovers-'+layout+'-'+i,name:title,title,layout,layoutName,style,topic:topics[i],asset,assetIds:asset?[asset]:[],bg,ink,accent,width:1080,height:1350,format:'post',category:'Poster',collection:'crossovers',aiImagery:!!asset,hasPeople:!!asset&&!['rooftop','life-forest','mix-beach','city-paris','city-tokyo','mix-picnic'].includes(asset),imagery:asset?(['rooftop','life-forest','mix-beach','city-paris','city-tokyo','mix-picnic'].includes(asset)?'Crowds & places':'People'):'Shapes & symbols',tags:topics[i]+' social media promo flyer poster '+(topics[i]==='Music & DJ'?'underground rave house techno disco event nightlife ':'')+layoutName,detail:topics[i]==='Travel'?'YOUR NEXT DESTINATION / YOUR STORY':topics[i]==='Music & DJ'?'FRIDAY / DOORS 10 PM / YOUR VENUE':'YOUR DATE / YOUR PLACE / JOIN US'};}));
function makeCrossoverDesign(t,assets){
 const d={version:1,id:uid(),name:t.name,width:1080,height:1350,background:t.bg,elements:[]},a=d.elements;
 const r=(x,y,w,h,c=t.ink,k='rect')=>a.push(shape(x,y,w,h,c,k));
 const tx=(v,x,y,w,h,size,c=t.ink,font='Arial')=>a.push(txt(v,x,y,w,size,c,{h,font,weight:font==='Georgia'?'400':'700'}));
 const photo=(x,y,s)=>a.push(base('image',x,y,s,s,{src:assets[t.asset],altText:'AI-generated illustrative scene for '+t.title+'. People, where present, are fictional.'}));
 const title=(x,y,w,h,size,font='Impact',color=t.ink)=>tx(t.title,x,y,w,h,size,color,font);
 switch(t.layout){
 case 0:tx(t.topic.toUpperCase()+' / THE LOCAL EDIT',55,38,970,45,24);title(55,110,970,210,116);photo(130,350,820);r(55,350,35,820,t.accent);tx(t.detail,55,1235,970,60,27);break;
 case 1:title(55,60,970,210,103,'Georgia');r(42,300,760,760,t.accent);photo(70,328,704);r(810,328,216,704,t.ink);tx('01\n\n02\n\n03',850,380,130,560,62,t.bg);tx('A NEW PERSPECTIVE',70,1120,930,65,40);tx(t.detail,70,1240,930,55,25);break;
 case 2:r(0,0,300,1350,t.accent);tx('OPEN\nTO\nYOU',35,90,230,300,68,t.bg,'Impact');photo(330,70,700);title(330,810,690,300,106);tx(t.detail,330,1200,690,85,29);tx('VOL. 01',35,1210,230,65,32,t.bg);break;
 case 3:r(40,40,1000,1270,t.ink);r(55,55,970,1240,t.bg);tx('FIELD NOTES / WEEKEND EDITION',100,90,880,55,26);photo(100,210,880);title(100,1120,880,95,74,'Georgia');tx(t.detail,100,1240,880,40,22);break;
 case 4:tx('THE INDEPENDENT SERIES',60,50,960,55,25);title(60,165,580,250,87,'Georgia');r(700,170,300,165,t.accent);tx('ISSUE\n01',730,180,240,145,51,t.bg);photo(240,450,600);r(60,450,120,600,t.ink);tx('LOOK CLOSER.\nMAKE IT YOURS.',240,1090,760,95,35);tx(t.detail,60,1250,960,45,25);break;
 case 5:r(0,0,1080,220,t.ink);title(45,35,990,150,96,'Impact',t.bg);photo(130,260,820);r(0,1120,1080,230,t.accent);tx('SAVE YOUR SPOT',55,1150,970,65,48,t.ink);tx(t.detail,55,1260,970,45,25);break;
 case 6:r(55,55,970,1240,t.ink);r(80,80,920,1190,t.bg);tx('ADMIT ONE / EVERYONE WELCOME',115,115,850,60,25);title(115,265,850,300,136);r(115,625,850,180,t.accent);tx('GOOD PEOPLE.\nGREAT PLANS.',145,645,790,130,47);for(let i=0;i<16;i++)r(115+i*53,895,25,5,t.ink);tx(t.detail,115,960,850,95,34);tx('NO. 001',115,1160,850,65,40);break;
 case 7:for(const [x,y,s]of[[75,80,270],[720,90,270],[370,440,340],[80,900,220],[760,970,220]]){r(x,y,s,s,t.accent,'ellipse');r(x+35,y+35,s-70,s-70,t.bg,'ellipse');}r(45,340,990,95,t.ink);tx('COME AS YOU ARE',70,355,940,65,42,t.bg);r(45,790,990,160,t.bg);title(60,790,960,155,98,'Georgia');r(45,1210,990,85,t.ink);tx(t.detail,65,1225,950,55,26,t.bg);break;
 }
 return d;
}
