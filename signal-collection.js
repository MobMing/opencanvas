// Signal Lab: fifteen original composition systems, each with four composed editions.
// Chrome artwork is a separate square image; all typography, tickets and diagrams edit normally.
const signalDirections=['Signal takeover','Split transmission','Orbital specimen','Two-room dispatch','Frequency blueprint','Admission strip','Type pressure','Oblique current','Gallery specimen','Oscillator field','Night receipt','Wide transmission','Modular assembly','Release dossier','Vertical relay'];
const signalEditions=[
 ['LIQUID CURRENT','PHASE SHIFT','LOW FREQUENCY','LATE TRANSMISSION'],
 ['OPEN CIRCUIT','NIGHT SYSTEM','ZERO STATIC','AFTER HOURS'],
 ['SOUND OBJECT','ORBIT THEORY','CHROME STUDY','FORM RESEARCH'],
 ['DUAL CHANNEL','CROSS SIGNAL','ROOM TWO','STEREO SERVICE'],
 ['FREQUENCY LAB','SIGNAL TEST','WAVE ANALYSIS','FUTURE FREQUENCY'],
 ['ENTER TONIGHT','ACCESS GRANTED','ALL NIGHTER','GUEST FREQUENCY'],
 ['MAXIMUM VOLUME','DEEP PRESSURE','TOTAL IMMERSION','PURE RESONANCE'],
 ['CURRENT FLOW','OFF AXIS','PARALLEL MOTION','NEW DIRECTION'],
 ['FLUID MATTER','LIGHT STUDY','METAL MEMORY','OBJECT FUTURE'],
 ['WAVE THEORY','PULSE ROOM','SONIC FIELD','PHASE PATTERN'],
 ['NIGHT ORDER','SELECTOR SERVICE','AFTER DARK','ONE MORE TRACK'],
 ['FUTURE PROTOCOL','LIVE TRANSMISSION','OPEN FREQUENCY','NEXT SIGNAL'],
 ['NEW COMPONENT','BUILD TOGETHER','MODULAR FUTURE','DESIGN SYSTEM'],
 ['FIRST CONTACT','ALTERNATE FORM','SOFT MACHINE','UNKNOWN MATERIAL'],
 ['TOMORROW CALLS','FOLLOW SOUND','STAY CONNECTED','THE NEXT WAVE']
];
const signalPalettes=[['#0d0e12','#e7ff57','#a98bff'],['#171020','#f0e7ff','#ff7849'],['#071f26','#c8f7f1','#b7ff57'],['#191422','#f5d5e9','#9dafff']];
const signalAssets=['atelier-chrome','signal-orbit','signal-ribbon','signal-spike','signal-glass'];
const signalTemplates=signalEditions.flatMap((titles,layout)=>titles.map((title,variant)=>{
 const palette=signalPalettes[(layout+variant)%4],topic=[2,8,13].includes(layout)?'Photography':[4,12].includes(layout)?'Technology':layout===3?'Entertainment':'Music & DJ';
 const width=layout===11?1600:1080,height=layout===11?900:layout===12?1080:layout===14?1920:1350,asset=signalAssets[(layout*2+variant)%signalAssets.length];
 const descriptor=topic==='Photography'?'SCULPTURE / LIGHT / NEW PERSPECTIVES':topic==='Technology'?'DESIGN / EXPERIMENT / SHARE':topic==='Entertainment'?'TWO ROOMS / LIVE PERFORMANCE / OPEN MINDS':'LEFTFIELD / ELECTRONIC / ALL NIGHT';
 return{id:'signal-lab-'+String(layout*4+variant+1).padStart(2,'0'),name:title,title,topic,style:layout===8||layout===13?'Editorial':'Neon',layout,variant,layoutName:signalDirections[layout]+' / '+['A','B','C','D'][variant],collection:'signal-lab',width,height,format:layout===11?'cover':layout===12?'square':layout===14?'story':'post',category:layout===11||layout===12?'Social':layout===14?'Story':'Poster',bg:palette[0],ink:palette[1],accent:palette[2],asset,assetIds:[asset],aiImagery:true,hasPeople:false,imagery:'Art & textures',descriptor,tags:'liquid signal chrome metallic sculptural neon futuristic flyer poster '+signalDirections[layout]+' '+(topic==='Photography'?'art gallery exhibition sculpture photography':topic==='Technology'?'technology launch meetup design conference demo workshop':topic==='Entertainment'?'performance concert live entertainment':'dj techno underground rave acid club music nightlife'),description:'An original Signal Lab composition with editable typography and a separate credited chrome-art layer.',sourceCredit:'OpenCanvas original layout. Generated artwork credited in assets/signal/PROVENANCE.json and assets/atelier/PROVENANCE.json.'};
}));
function signalAssetSource(assets,key){const v=assets?.[key],src=typeof v==='string'?v:v?.src;return typeof src==='string'&&src.length<=25*1024*1024&&/^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(src)?src:null;}
function makeSignalDesign(t,assets={}){
 if(!signalTemplates.some(x=>x.id===t.id))throw new Error('Unknown Signal Lab template');
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements,v=t.variant;
 const r=(x,y,w,h,c=t.ink,kind='rect',extra={})=>a.push(shape(x,y,w,h,c,kind,extra));
 const text=(s,x,y,w,h,size=28,c=t.ink,font='DM Sans',extra={})=>a.push(txt(s,x,y,w,size,c,{h,font,weight:'400',lineHeight:1,tracking:0,...extra}));
 const label=(s,x,y,w=970,c=t.ink,extra={})=>text(s,x,y,w,64,26,c,'DM Sans',{weight:'700',lineHeight:1.1,...extra});
 const head=(s,x,y,w,h,size=150,c=t.ink,extra={})=>text(s,x,y,w,h,size,c,'Anton',extra);
 const outline=(s,x,y,w,h,size=150)=>head(s,x,y,w,h,size,t.ink,{textEffect:'hollow',effectColor:t.ink,effectAmount:1.6});
 const rule=(x,y,w,c=t.ink,h=2)=>r(x,y,w,h,c);
 const ring=(x,y,s,thickness=3,c=t.accent,paper=t.bg)=>{r(x,y,s,s,c,'ellipse');r(x+thickness,y+thickness,s-2*thickness,s-2*thickness,paper,'ellipse');};
 const cross=(x,y,s,c=t.accent)=>{r(x+s*.44,y,s*.12,s,c);r(x,y+s*.44,s,s*.12,c);};
 const barcode=(x,y,w,h,c=t.ink)=>{let dx=0,k=0;while(dx+8<w){const b=[2,7,3,4,2,6][k%6];r(x+dx,y,b,h,c);dx+=b+[3,2,4,3,6][k%5];k++;}};
 const dots=(x,y,n,space=23,c=t.accent)=>{for(let i=0;i<n;i++)r(x+space*i,y,7,7,c,'ellipse');};
 const art=(x,y,s)=>{const src=signalAssetSource(assets,t.asset);if(src)a.push(base('image',x,y,s,s,{src,photoCrop:{zoom:1,x:.5,y:.5},altText:'Original generated chrome sculpture for Signal Lab. Artwork: '+t.asset+'. See artwork credits.'}));else{ring(x+s*.08,y+s*.08,s*.84,Math.max(4,s*.035));ring(x+s*.22,y+s*.22,s*.56,Math.max(3,s*.025),t.ink);cross(x+s*.39,y+s*.39,s*.22);}};
 const pieces=t.title.split(' '),first=pieces.slice(0,-1).join(' '),last=pieces.at(-1),serial=String(t.layout*4+v+1).padStart(2,'0');
 const date=t.topic==='Photography'?'YOUR DATES / YOUR GALLERY':t.topic==='Technology'?'YOUR DATE / YOUR WORKSPACE':'YOUR DATE / YOUR VENUE';
 const detail=t.topic==='Photography'?'OPENING VIEW / 6–9 PM':t.topic==='Technology'?'DOORS 6 PM / DEMOS 7 PM':'DOORS 10 PM / UNTIL LATE';
 const bottom=(y=d.height-112)=>{rule(48,y-20,d.width-96);label(date,48,y,d.width-96,t.ink,{size:24});label(detail,48,y+43,d.width-96,t.accent,{size:24});};
 const mast=(s='INDEPENDENT TRANSMISSIONS')=>{label(s,42,30,d.width-270,t.ink,{size:23});label('VOL. '+serial,d.width-220,30,176,t.ink,{size:23,align:'right'});};
 switch(t.layout){
 case 0:{
  mast();
  const plans=[{hx:38,hy:130,hw:1000,hs:206,ax:260,ay:410,s:770,px:48,py:700},{hx:48,hy:790,hw:980,hs:177,ax:160,ay:90,s:820,px:52,py:440},{hx:52,hy:140,hw:960,hs:185,ax:50,ay:490,s:780,px:815,py:700},{hx:66,hy:145,hw:950,hs:178,ax:200,ay:420,s:730,px:52,py:1000}][v];
  head(first,plans.hx,plans.hy,plans.hw,230,plans.hs);outline(last,plans.hx,plans.hy+215,plans.hw,230,plans.hs);art(plans.ax,plans.ay,plans.s);
  r(plans.px,plans.py,210,180,t.ink);head(serial,plans.px+16,plans.py+5,178,126,112,t.bg);label('EDITION',plans.px+18,plans.py+139,174,t.bg,{size:22,h:32});
  if(v===1)cross(880,710,105);if(v===2)dots(650,1140,12);if(v===3)for(let i=0;i<4;i++)rule(48,1215-i*7,985,t.accent,3);
  barcode(48,1250,190,55);label(date+'\n'+detail,355,1247,675,t.ink,{align:'right',size:23,h:70});break;
 }
 case 1:{
  mast('A DIFFERENT SIDE OF THE NIGHT');const left=v%2===0,split=v<2?365:440,x=left?0:1080-split;
  r(x,110,split,1085,t.accent);const tx=left?32:1080-split+30,tw=split-60;
  text(first+'\n'+last,tx,170,tw,420,v<2?92:110,t.bg,'Bebas Neue',{lineHeight:1.05});label('SELECTORS\nYOUR ARTISTS\nYOUR CREW',tx,780,tw,t.bg,{h:190,size:29});barcode(tx,1100,tw,50,t.bg);
  art(left?split-80:0,250,v<2?760:700);const ex=left?split+25:45,ew=1080-split-70;
  label(t.descriptor,ex,v<2?1070:1120,ew,t.ink,{size:24,h:75});if(v>=2){ring(left?790:85,145,160,3);head(serial,left?835:132,185,80,75,64);}
  bottom();break;
 }
 case 2:{
  mast('OBJECTS / SOUND / EXPERIMENT');const cx=[160,260,70,185][v],cy=[440,260,380,470][v],s=[760,670,820,710][v];
  ring(cx-12,cy-12,s+24,3);art(cx,cy,s);cross(56,615,72);cross(946,615,72);
  if(v===0){head(first,44,123,990,180,168);outline(last,44,300,990,168,155);}
  else if(v===1){head(first,50,995,980,140,129);outline(last,50,1135,980,130,120);label('A SERIES OF MATERIAL EXPERIMENTS',50,125,980);}
  else if(v===2){text(first+'\n'+last,60,130,900,210,110,t.ink,'Bebas Neue',{align:'right'});label('FORM / 0'+serial,60,1160,900,t.accent,{align:'right'});}
  else{head(first,48,140,980,190,174);text(last,55,325,950,120,106,t.accent,'Cormorant Garamond',{italic:true});dots(56,1185,18);}
  label(date,48,1290,984,t.ink,{size:24,h:38});break;
 }
 case 3:{
  mast('TWO ROOMS / ONE SHARED FREQUENCY');const high=v%2===0;
  r(40,140,1000,high?910:730,t.accent);r(54,154,972,high?882:702,t.bg);
  const s=[620,560,630,570][v],ay=high?320:170;art(v%2?455:30,ay,s);art(v%2?70:510,ay+270,s*.78);
  const hy=high?165:920;head(first,58,hy,950,154,138);outline(last,58,hy+145,950,154,138);
  r(53,high?1082:785,445,100,t.ink);r(580,high?1082:785,445,100,t.accent);label('01 / YOUR LINEUP',70,high?1115:818,410,t.bg,{size:27});label('02 / YOUR GUESTS',597,high?1115:818,410,t.bg,{size:27});
  bottom();break;
 }
 case 4:{
  for(let x=40;x<1080;x+=125)r(x,110,1,1100,t.accent,'rect',{opacity:.25});for(let y=110;y<1220;y+=110)rule(40,y,1000,t.accent,1);
  mast('OPEN LAB / IDEAS IN MOTION');const s=[670,620,750,650][v],ax=[340,50,280,70][v],ay=[405,470,310,235][v];
  art(ax,ay,s);const hx=v%2?500:52,hy=v===3?960:135,hw=v%2?530:950;
  text(first+'\n'+last,hx,hy,hw,v%2?275:245,v%2?100:117,t.ink,'Bebas Neue',{lineHeight:1});
  const px=v%2?65:50,py=v===3?900:785;r(px,py,230,250,t.bg);text('01\nEXPLORE\n02\nBUILD',px+15,py+10,205,215,40,t.accent,'Bebas Neue');
  cross(v%2?900:85,540,82);label('YOUR SPEAKERS / YOUR COLLECTIVE',50,1164,980,t.ink,{size:24});bottom();break;
 }
 case 5:{
  mast('ADMIT ONE / INVITE EVERYONE');const bandY=[200,885,540,1120][v];
  const ax=[170,230,60,300][v],ay=[430,110,120,260][v],s=[800,760,720,710][v];art(ax,ay,s);
  r(42,bandY,996,v===3?112:235,t.ink);head(v===3?t.title:first,62,bandY+14,956,v===3?90:112,v===3?83:102,t.bg);
  if(v!==3)text(last,67,bandY+120,930,90,78,t.bg,'Bebas Neue');
  const py=v===1?680:80;barcode(55,py,220,70);label('NO. '+serial,805,py+20,220,t.accent,{align:'right'});
  for(let y=145;y<1240;y+=28){r(28,y,8,10,t.accent);r(1044,y,8,10,t.accent);}label('YOUR GUESTS / YOUR TIME / YOUR CITY',55,1262,970,t.ink,{size:24});break;
 }
 case 6:{
  mast('FEEL THE WEIGHT OF THE SOUND');const sizes=[165,145,155,135],y=[150,320,170,190][v];
  const word=v%2?last:first;for(let i=0;i<4;i++){if((i+v)%3)outline(word,40,y+i*175,1000,165,sizes[v]);else head(word,40,y+i*175,1000,165,sizes[v]);}
  art([350,0,270,120][v],[440,520,450,320][v],[700,730,770,840][v]);
  const by=[1045,150,1080,1100][v];r(40,by,1000,118,t.accent);text(v%2?first:last,58,by+17,965,90,80,t.bg,'Bebas Neue');
  bottom();break;
 }
 case 7:{
  mast('MOVEMENT BEYOND THE ORDINARY');const slope=v%2?135:45;
  for(let i=0;i<6;i++){const xx=v%2?70+i*145:60+i*145,yy=v%2?350+i*70:800-i*75;r(xx,yy,120,9,t.accent,'rect',{rotation:slope});}
  art([300,70,230,30][v],[380,420,130,240][v],[730,790,750,790][v]);
  const ht=[130,150,860,835][v];head(first,45,ht,980,170,150);outline(last,45,ht+160,980,170,150);
  const dx=v%2?800:50,dy=v<2?1000:170;r(dx,dy,210,150,t.ink);head(serial,dx+15,dy+12,180,120,110,t.bg);bottom();break;
 }
 case 8:{
  mast('AN EXHIBITION OF MATERIAL POSSIBILITIES');const fy=[340,140,350,350][v],fh=[735,810,740,730][v];
  r(55,fy,970,fh,t.ink);r(65,fy+10,950,fh-20,t.bg);art([240,155,80,220][v],fy+25,[700,760,710,725][v]);
  if(v===1){head(first,60,970,960,125,114);text(last,60,1095,960,105,90,t.ink,'Cormorant Garamond',{italic:true});}
  else{head(first,58,v===3?100:130,960,130,118);text(last,60,v===3?220:260,960,100,86,t.accent,'Cormorant Garamond',{italic:true});}
  label('YOUR ARTIST / YOUR CURATOR',65,v===1?85:1140,940,t.ink,{size:24});bottom();break;
 }
 case 9:{
  mast('A FIELD GUIDE TO NEW SOUNDS');const yc=[420,450,215,340][v];
  for(let i=0;i<18;i++){const hh=70+((i*47+v*31)%170);r(40+i*56,yc+200-hh/2,8,hh,t.accent,'rect',{opacity:.55});}
  ring([160,280,90,245][v],yc-35,[770,660,840,690][v],2,t.ink);art([180,300,110,265][v],yc-15,[730,620,800,650][v]);
  const hy=v===2?885:130;head(first,48,hy,980,v===2?150:180,v===2?138:158);outline(last,48,hy+(v===2?145:170),980,v===2?150:180,v===2?138:158);
  label('A CONTINUOUS NIGHT / YOUR SELECTORS',50,v===2?160:1155,980,t.ink,{size:25});bottom();break;
 }
 case 10:{
  const px=[75,45,140,100][v],pw=[930,900,850,880][v];r(px,40,pw,1270,t.ink);
  for(let y=55;y<1300;y+=28){r(px-9,y,18,12,t.bg);r(px+pw-9,y,18,12,t.bg);}
  label('THE NIGHT DEPARTMENT',px+30,78,pw-60,t.bg,{align:'center',size:26});rule(px+30,150,pw-60,t.bg);
  const hy=v%2?935:190;head(first,px+35,hy,pw-70,150,130,t.bg);text(last,px+35,hy+145,pw-70,110,97,t.bg,'Bebas Neue');
  r(px+30,v%2?235:505,pw-60,650,t.bg);art(px+(pw-610)/2,v%2?255:525,610);
  label('TABLE / '+serial+'     PARTY / YOUR PEOPLE',px+35,v%2?180:450,pw-70,t.bg,{size:22,h:38});
  barcode(px+40,1220,pw-80,40,t.bg);label('YOUR DATE / YOUR VENUE / ALL NIGHT',px+35,1270,pw-70,t.bg,{size:22,h:32,align:'center'});break;
 }
 case 11:{
  mast('BROADCAST FROM YOUR CORNER OF THE WORLD');const left=v%2===0,ax=left?(v<2?820:780):20,ay=v<2?92:20,s=v<2?760:800;
  art(ax,ay,s);const hx=left?52:750,hw=left?1000:800,hy=v<2?195:330;
  head(first,hx,hy,hw,180,v<2?152:128);outline(last,hx,hy+172,hw,180,v<2?152:128);
  const ly=v<2?685:130;label('YOUR CHANNEL / YOUR NEXT EVENT',hx,ly,hw,t.ink,{size:28});
  if(v>=2){rule(50,240,1495,t.accent,3);dots(70,275,14);label('YOUR DATE / STREAM STARTS 8 PM',50,830,1500,t.accent,{size:25,h:40});}else{barcode(hx,795,215,55);label('YOUR DATE / STREAM STARTS 8 PM',left?380:1000,805,left?1150:550,t.accent,{size:left?26:22});}break;
 }
 case 12:{
  mast('MAKE / TEST / SHARE');const cells=[[[50,375,470],[580,130,440]],[[55,160,600],[720,550,280]],[[65,475,480],[570,165,450]],[[430,260,595],[50,660,300]]][v];
  for(let i=0;i<cells.length;i++){const [x,y,s]=cells[i];r(x,y,s,s,i?t.accent:t.ink);r(x+8,y+8,s-16,s-16,t.bg);art(x+12,y+12,s-24);}
  const hx=v%2?55:60,hy=v===0?135:v===1?780:v===2?150:115,hw=v===0?500:v===1?960:v===2?500:950;
  text(first+'\n'+last,hx,hy,hw,v===1?190:245,v===1?90:hw<600?92:105,t.ink,'Bebas Neue',{lineHeight:1});cross(v%2?85:890,v%2?460:705,90);
  label('YOUR COMMUNITY / YOUR NEXT DEMO',50,990,980,t.accent,{size:24,h:45});label(date,50,1040,980,t.ink,{size:22,h:30});break;
 }
 case 13:{
  mast('FORM ARCHIVE / NEW WORK IN PROGRESS');const px=v%2?50:650,py=v<2?170:710,pw=v%2?350:380;
  r(px,py,pw,435,t.accent);text('SPECIMEN\n'+serial,px+20,py+25,pw-40,140,50,t.bg,'Bebas Neue');
  label('MATERIAL\nFORM\nLIGHT\nREFLECTION',px+22,py+190,pw-44,t.bg,{h:190,size:25,lineHeight:1.4});
  art(v%2?340:0,v<2?365:70,v%2?700:760);
  const hy=v<2?1000:1210,hx=v%2?420:48,hw=v%2?610:960;
  if(v<2){head(first,hx,hy,hw,125,110);text(last,hx,hy+120,hw,110,95,t.ink,'Cormorant Garamond',{italic:true});}
  else{text(first+' / '+last,45,1165,990,105,76,t.ink,'Bebas Neue');}
  label(date,48,1293,980,t.ink,{size:22,h:35});break;
 }
 case 14:{
  mast('THE NEXT FREQUENCY IS YOURS');const ay=[580,250,690,500][v],s=[980,920,890,960][v],ax=[50,80,95,60][v];
  for(let i=0;i<5;i++)rule(50,175+i*350,980,t.accent,2);art(ax,ay,s);
  const hy=v===1?1220:220;head(first,45,hy,990,230,190);outline(last,45,hy+230,990,240,190);
  r(50,v===1?150:1640,980,130,t.ink);label('YOUR LINEUP / YOUR COMMUNITY',75,v===1?195:1685,930,t.bg,{size:30});
  barcode(50,1795,240,70);label(date,390,1808,635,t.ink,{size:27,align:'right'});label(detail,390,1850,635,t.accent,{size:25,align:'right'});break;
 }
 }
 return d;
}
