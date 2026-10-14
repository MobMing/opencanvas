// Twenty native gaming compositions and four credited illustration-led designs.
// All titles remain editable; embedded images never require network requests.
const gamingRows=[
 ['NIGHT MODE','Neon','Controller channel banner',1600,900,'#101123','#f5f1ff','#c58bff','channel banner controller gaming youtube twitch neon purple','gaming-controller-night'],
 ['RANKED RIVALS','Bold','Rivalry tournament bill',1080,1350,'#0b2330','#e5fff4','#d8fa62','esports tournament competitive team versus cyan lime'],
 ['INSERT COIN','Retro','Arcade cabinet social',1080,1080,'#20243b','#fff1c9','#ff8a66','retro arcade pixel invader game night coin'],
 ['THE FINAL FOUR','Minimal','Four-team tournament bracket',1600,900,'#f2f0e4','#203c84','#f0543c','tournament bracket playoffs finals esports teams'],
 ['STREAM STARTING SOON','Neon','Circuit waiting screen',1600,900,'#151c34','#f6ebff','#71f0d2','stream waiting screen starting soon twitch live circuit'],
 ['WASD WEEKEND','Editorial','Keyboard LAN poster',1080,1350,'#eae6d9','#24283a','#cb513b','lan party keyboard wasd pc gaming weekend'],
 ['NEON NIGHTS','Neon','Vertical controller glow',1080,1920,'#0c1230','#ebf8ff','#71f2e2','gaming story neon controller community stream tournament','gaming-neon-arena'],
 ['CHECKMATE CLUB','Classic','Chess club editorial',1080,1350,'#f2ead7','#17372e','#b36242','chess club tournament strategy tabletop board games'],
 ['ROLL FOR ADVENTURE','Classic','Tabletop campaign map',1080,1080,'#203d40','#f3dfab','#d5986c','tabletop dice rpg campaign roleplaying d20 adventure'],
 ['RESPAWN COLLECTIVE','Bold','Original esports crest',1080,1080,'#1e1b2e','#fff0dc','#ff7042','esports team badge crest logo gaming squad recruitment'],
 ['PATCH NOTES','Minimal','Game update bulletin',1080,1350,'#cdeedc','#17352d','#ed764f','game development update patch notes indie developer release'],
 ['PIXEL PICNIC','Playful','Pixel landscape meetup',1080,1080,'#c8c5ed','#35335f','#ef825c','indie games cozy pixel community meetup social'],
 ['BOSS RUSH','Bold','Comic challenge poster',1080,1350,'#c23643','#1e1a29','#ffe394','boss rush gaming challenge fighting game comic','gaming-boss-creature'],
 ['BEAT YOUR BEST','Bold','Speedrun record banner',1600,900,'#ed683d','#152f35','#f7ebcb','speedrun personal best racing timer record livestream'],
 ['SQUAD WANTED','Bold','Role-based recruiting story',1080,1920,'#203e78','#f2efdc','#fca359','gaming esports squad recruitment teammates roles story'],
 ['COZY QUEST','Classic','Warm gaming room invitation',1080,1080,'#f3e7d2','#345347','#bd765e','cozy games community stream relaxing gaming room','gaming-cozy-room'],
 ['THIS WEEK LIVE','Retro','Weekly stream timetable',1080,1350,'#eab356','#193e42','#f4e6ca','stream schedule twitch youtube live gaming calendar'],
 ['HOW WELL DO YOU GAME?','Playful','Gaming trivia show card',1600,900,'#f4d465','#2a2550','#e35e78','gaming trivia quiz show community challenge social'],
 ['BOARD GAME SOCIAL','Playful','Winding tabletop path',1080,1350,'#2c5749','#f4e6c9','#edb3c7','board game night tabletop dice community family games'],
 ['DAILY CHALLENGE','Neon','Terminal maze challenge',1080,1080,'#111f25','#c6f4a1','#f5b66a','retro terminal puzzle maze daily challenge gaming pixel'],
 ['AFTER DARK / GAME ON','Neon','Controller night promotion',1080,1080,'#0c1025','#f4f2ff','#9ce6fa','controller gaming night cyber neon channel promo','neon-controller'],
 ['ARCTIC SQUAD','Bold','Lynx esports recruitment',1080,1350,'#030f1d','#ecfbff','#63daf7','esports mascot lynx team squad tryouts tournament badge','arctic-lynx'],
 ['NEXT WORLD','Neon','Cinematic portal premiere',1600,900,'#0d1520','#f2fbff','#75f0ea','gaming cinematic science fiction pilot stream premiere channel cover','portal-pilot'],
 ['ANOTHER LITTLE ADVENTURE','Playful','Cozy pixel world story',1080,1920,'#3d3568','#f8e8d2','#f2b699','cozy gaming pixel world adventure indie stream story','cozy-arcade']
];
const gamingTemplates=gamingRows.map(([title,style,layoutName,width,height,bg,ink,accent,tags,assetSlot],layout)=>({
 id:'gaming-'+String(layout+1).padStart(2,'0'),name:title,title,topic:'Gaming',style,layout,layoutName,width,height,bg,ink,accent,
 collection:'gaming',asset:layout>=20?assetSlot:undefined,assetIds:layout>=20?[assetSlot]:[],aiImagery:layout>=20,hasPeople:layout===22,imagery:layout===20?'Equipment':layout===22?'People':layout>=20?'Illustration':'Shapes & symbols',assetSlot:assetSlot||null,
 format:height===1920?'story':width===1600?'cover':height===1080?'square':'post',category:height===1920?'Story':width===1600||height===1080?'Social':'Poster',
 tags:tags+' gaming original editable flyer poster promo stream',description:layout>=20?'Original composition with credited generated illustration and editable typography.':'Original gaming composition with editable text and native vector motifs.'
}));
function gamingAssetSource(assets,key){const value=assets?.[key],src=typeof value==='string'?value:value?.src;return typeof src==='string'&&src.length<=25*1024*1024&&/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(src)?src:null;}
function makeGamingDesign(t,assets={}){
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements;
 const box=(x,y,w,h,c=t.ink,extra={})=>a.push(shape(x,y,w,h,c,'rect',extra));
 const round=(x,y,w,h,c=t.ink,extra={})=>a.push(shape(x,y,w,h,c,'round',extra));
 const ellipse=(x,y,w,h,c=t.ink,extra={})=>a.push(shape(x,y,w,h,c,'ellipse',extra));
 const circle=(x,y,s,c=t.ink,extra={})=>ellipse(x,y,s,s,c,extra);
 const tri=(x,y,w,h,c=t.ink,extra={})=>a.push(shape(x,y,w,h,c,'triangle',extra));
 const star=(x,y,s,c=t.accent,extra={})=>a.push(shape(x,y,s,s,c,'star',extra));
 const text=(v,x,y,w,h,size=30,c=t.ink,font='DM Sans',extra={})=>a.push(txt(v,x,y,w,size,c,{h,font,weight:'400',lineHeight:1.08,tracking:0,...extra}));
 const head=(v,x,y,w,h,size,c=t.ink,extra={})=>text(v,x,y,w,h,size,c,'Anton',extra);
 const label=(v,x,y,w,c=t.ink,extra={})=>text(v,x,y,w,52,25,c,'DM Sans',{weight:'700',...extra});
 const mono=(v,x,y,w,h=52,size=25,c=t.ink,extra={})=>text(v,x,y,w,h,size,c,'Courier New',extra);
 const ring=(x,y,s,width=8,c=t.accent,paper=t.bg)=>{circle(x,y,s,c);circle(x+width,y+width,s-width*2,paper);};
 const cross=(x,y,s,c=t.ink)=>{box(x+s*.36,y,s*.28,s,c);box(x,y+s*.36,s,s*.28,c);};
 const motif=draw=>{const start=a.length;draw();const groupId=uid();for(const e of a.slice(start))e.groupId=groupId;};
 // Original controller silhouette assembled from editable body, grip and button shapes.
 const controller=(x,y,w,c=t.accent,paper=t.bg,detail=t.ink)=>motif(()=>{const s=w/600;
  ellipse(x,y+45*s,210*s,270*s,c);ellipse(x+390*s,y+45*s,210*s,270*s,c);round(x+70*s,y,460*s,230*s,c);
  ellipse(x+22*s,y+68*s,154*s,206*s,paper);ellipse(x+424*s,y+68*s,154*s,206*s,paper);round(x+86*s,y+18*s,428*s,198*s,paper);
  cross(x+135*s,y+60*s,100*s,detail);circle(x+398*s,y+63*s,34*s,detail);circle(x+440*s,y+105*s,34*s,detail);circle(x+356*s,y+105*s,34*s,detail);circle(x+398*s,y+147*s,34*s,detail);
  ring(x+238*s,y+145*s,65*s,10*s,c,paper);ring(x+311*s,y+145*s,65*s,10*s,c,paper);box(x+276*s,y+73*s,48*s,12*s,c);
 });
 const alien=(x,y,p,c=t.accent)=>motif(()=>{const rows=['001000100','000101000','001111100','011010110','111111111','101111101','101000101','000101000'];rows.forEach((row,j)=>[...row].forEach((bit,i)=>{if(bit==='1')box(x+i*p,y+j*p,p,p,c);}));});
 const crest=(x,y,s,c=t.accent,inner=t.bg)=>motif(()=>{tri(x,y+s*.42,s,s*.58,c,{rotation:180});box(x,y,s,s*.48,c);tri(x+s*.06,y+s*.45,s*.88,s*.46,inner,{rotation:180});box(x+s*.06,y+s*.06,s*.88,s*.41,inner);star(x+s*.25,y+s*.14,s*.5,c);});
 const pawn=(x,y,s,c=t.ink)=>motif(()=>{circle(x+s*.27,y,s*.46,c);tri(x+s*.15,y+s*.32,s*.7,s*.78,c);round(x,y+s*.95,s,s*.18,c);});
 const dice=(x,y,s,c=t.accent,paper=t.bg)=>motif(()=>{round(x,y,s,s,c);for(const [u,v]of[[.2,.2],[.65,.2],[.425,.425],[.2,.65],[.65,.65]])circle(x+u*s,y+v*s,s*.14,paper);});
 const pixel=(x,y,p,rows,c)=>motif(()=>rows.forEach((row,j)=>[...row].forEach((bit,i)=>{if(bit==='1')box(x+i*p,y+j*p,p,p,c);})));
 const footer=(top,bottom,y=d.height-118)=>{box(48,y-22,d.width-96,2);label(top,48,y,d.width-96);label(bottom,48,y+48,d.width-96,t.ink,{size:23});};
 const art=(key,x,y,w,h,fallback)=>{const src=gamingAssetSource(assets,key);if(src)a.push(base('image',x,y,w,h,{src}));else fallback();};
 switch(t.layout){
 case 0:{
  for(let i=0;i<5;i++)box(0,760+i*24,1600,2,'#282a4e');
  circle(1010,145,480,'#25234d');ring(1030,165,440,3,'#6b53ab','#25234d');ring(1062,197,376,2,'#a478dd','#25234d');
  label('INDEPENDENT PLAY / YOUR CHANNEL',60,48,1350,t.ink,{size:26,tracking:.06});
  head('NIGHT',55,185,880,235,212,t.ink,{textEffect:'glow',effectColor:'#9968dd',effectAmount:3});
  head('MODE',55,410,830,230,212,t.ink,{textEffect:'hollow',effectColor:t.accent,effectAmount:1.8});
  art(t.assetSlot,916,215,624,440,()=>controller(916,275,624,t.accent,'#17192e',t.ink));
  box(60,722,650,7,t.accent);label('LIVE TUE + THU / 8 PM YOUR TIME',60,782,1390,t.ink,{size:29});label('FOLLOW @YOURCHANNEL',60,835,1390,t.accent,{size:24});break;
 }
 case 1:{
  box(0,0,1080,18,t.accent);label('YOUR COMMUNITY / OPEN TOURNAMENT',48,47,984,t.ink,{size:23});
  head('RANKED',45,126,990,210,192);head('RIVALS',45,328,990,210,192,t.accent);
  crest(80,595,330,t.accent,t.bg);crest(670,595,330,'#60cfe2',t.bg);
  text('VS',435,685,210,132,112,t.ink,'Bangers',{align:'center'});
  label('YOUR TEAM A',60,963,420,t.ink,{align:'center'});label('YOUR TEAM B',600,963,420,t.ink,{align:'center'});
  box(48,1060,984,88,t.accent);label('REGISTER YOUR SQUAD / LIMITED SPOTS',65,1088,950,t.bg,{size:25});
  footer('SAT 14 NOV / CHECK-IN 5 PM','YOUR VENUE + YOUR STREAM LINK',1215);break;
 }
 case 2:{
  for(let i=0;i<9;i++)box(50+i*116,26,44,8,i%2?t.accent:t.ink);
  text('INSERT COIN',48,65,984,160,134,t.ink,'Bangers',{textEffect:'shadow',effectColor:'#c64e6a',effectAmount:4,align:'center'});
  box(245,270,590,625,t.accent);box(270,294,540,75,t.ink);mono('ONE CREDIT / ALL NIGHT',290,314,500,40,26,t.bg,{align:'center'});
  box(290,398,500,305,t.bg);alien(392,450,32,'#b1eccf');
  box(270,735,540,72,'#be5369');circle(351,750,42,t.ink);box(368,774,8,55,t.ink);circle(600,752,33,t.ink);circle(661,752,33,t.ink);box(470,844,140,16,t.bg);
  label('RETRO ARCADE SOCIAL',48,942,984,t.ink,{align:'center',size:28});label('FRI 13 NOV / 7 PM / YOUR ARCADE',48,994,984,t.accent,{align:'center',size:24});break;
 }
 case 3:{
  head('THE FINAL FOUR',50,40,1500,175,147);label('YOUR LEAGUE / PLAYOFF NIGHT',55,228,1490,t.ink,{tracking:.08,size:26});
  const match=(name,x,y)=>{box(x,y,360,84,t.ink);label(name,x+20,y+29,320,t.bg,{size:24});};
  match('TEAM NORTH',55,365);match('TEAM SOUTH',55,585);match('TEAM EAST',1185,365);match('TEAM WEST',1185,585);
  box(415,407,90,4);box(505,407,4,224);box(415,627,90,4);box(505,516,180,4);
  box(1095,407,90,4);box(1091,407,4,224);box(1095,627,90,4);box(915,516,180,4);
  circle(675,395,250,t.accent);star(731,435,138,t.bg);text('FINAL',700,582,200,70,54,t.ink,'Bebas Neue',{align:'center'});
  box(55,740,1490,3);label('SAT 21 NOV / SEMIFINALS 6 PM / FINAL 8 PM',55,786,1450,t.ink,{size:28});label('WATCH: YOUR STREAM LINK',55,840,1450,t.ink,{size:23});break;
 }
 case 4:{
  for(const [x,y,w,h]of[[40,40,1520,3],[40,40,3,820],[40,857,1520,3],[1557,40,3,820]])box(x,y,w,h,'#446372');
  for(let i=0;i<4;i++){const y=150+i*135;box(65,y,185,3,t.accent);box(247,y,3,75,t.accent);circle(235,y+68,27,t.accent);box(1375,y+58,160,3,'#ae93d1');box(1372,y,3,60,'#ae93d1');circle(1361,y-12,27,'#ae93d1');}
  label('YOUR CHANNEL IS COMING ONLINE',300,133,1000,t.accent,{align:'center',tracking:.12,size:26});
  head('STREAM',285,265,1030,190,171,t.ink,{align:'center'});head('STARTING SOON',280,458,1040,140,108,t.ink,{align:'center'});
  mono('LIVE AT 20:00',360,663,880,80,57,t.accent,{align:'center'});label('CHAT OPEN / SAY HELLO / @YOURCHANNEL',245,788,1110,t.ink,{align:'center',size:25});break;
 }
 case 5:{
  label('BRING YOUR RIG / FIND YOUR PEOPLE',50,40,980,t.ink,{size:25});head('WASD',45,115,990,225,205);text('weekend',50,340,980,145,113,t.accent,'Caveat');
  const key=(v,x,y,active)=>{round(x+10,y+12,200,190,t.ink);round(x,y,200,190,active?t.accent:'#f7f0dc');text(v,x,y+40,200,110,84,active?'#fff0d6':t.ink,'DM Sans',{align:'center',weight:'700'});};
  key('W',440,555,true);key('A',215,774,true);key('S',440,774,true);key('D',665,774,true);
  label('LOCAL AREA / ALL TOGETHER',50,1060,980,t.ink,{size:28});footer('SAT + SUN / 10 AM–10 PM','YOUR LAN SPACE / RSVP: YOUR LINK');break;
 }
 case 6:{
  box(40,40,1000,1840,'#1e2550');box(46,46,988,1828,t.bg);label('YOUR COMMUNITY PRESENTS',70,85,940,t.ink,{align:'center',size:25,tracking:.08});
  head('NEON',60,230,960,240,218,t.ink,{align:'center',textEffect:'glow',effectColor:'#8b58ce',effectAmount:3});head('NIGHTS',60,474,960,230,200,t.accent,{align:'center'});
  art(t.assetSlot,90,795,900,660,()=>{ring(205,810,670,8,'#8a60d5');ring(249,854,582,4,t.accent);controller(110,1000,860,t.accent,t.bg,t.ink);});
  label('PLAY / WATCH / CONNECT',75,1533,930,t.ink,{align:'center',size:35});box(85,1640,910,132,t.accent);label('SAT 14 NOV / 8 PM — LATE',105,1685,870,t.bg,{align:'center',size:29});label('YOUR GAMING LOUNGE / LINK IN BIO',75,1815,930,t.ink,{align:'center',size:23});break;
 }
 case 7:{
  text('CHECKMATE',45,70,990,170,137,t.ink,'Cormorant Garamond',{weight:'700'});head('CLUB',48,257,984,180,158);
  for(let y=0;y<4;y++)for(let x=0;x<8;x++)box(48+x*123,550+y*123,123,123,(x+y)%2?'#d5d1b5':'#749581');
  pawn(185,643,170,t.bg);pawn(670,601,200,t.ink);label('GOOD MOVES / BETTER COMPANY',48,460,984,t.accent,{size:26});
  label('BEGINNERS + REGULARS WELCOME',48,1095,984,t.ink,{size:26});footer('SUN 15 NOV / 3–6 PM','YOUR CLUB / BRING A BOARD OR BORROW ONE');break;
 }
 case 8:{
  for(const [x,y]of[[45,45],[1005,45],[45,1005],[1005,1005]])star(x,y,30,t.accent);
  box(42,42,996,3,t.ink);box(42,1035,996,3,t.ink);box(42,42,3,996,t.ink);box(1035,42,3,996,t.ink);
  text('Roll for',90,110,900,145,120,t.ink,'Cormorant Garamond',{italic:true,align:'center'});text('ADVENTURE',90,270,900,140,107,t.ink,'Cormorant Garamond',{align:'center',weight:'700'});
  dice(415,455,250,t.ink,t.bg);for(let i=0;i<8;i++){box(125+i*29,585,15,3,t.accent);box(732+i*29,585,15,3,t.accent);}star(155,750,55,t.accent);star(875,745,55,t.accent);
  label('NEW CAMPAIGNS / ONE-SHOTS / OPEN TABLES',72,805,936,t.ink,{align:'center',size:24});label('FRI 20 NOV / 6 PM / YOUR GAME SHOP',72,887,936,t.ink,{align:'center',size:25});label('SAVE A SEAT: YOUR SIGN-UP LINK',72,952,936,t.accent,{align:'center',size:23});break;
 }
 case 9:{
  label('YOUR TEAM / EST. 2026',50,40,980,t.ink,{align:'center',size:24,tracking:.12});
  crest(315,150,450,t.accent,t.bg);for(let i=0;i<3;i++){box(115+i*36,260+i*62,200-i*36,24,t.accent);box(765,260+i*62,200-i*36,24,t.accent);}
  head('RESPAWN',50,660,980,165,140,t.ink,{align:'center'});text('COLLECTIVE',50,825,980,88,66,t.accent,'Bebas Neue',{align:'center',tracking:.12});
  label('PLAY TOGETHER. RISE TOGETHER.',50,959,980,t.ink,{align:'center',size:25});break;
 }
 case 10:{
  box(0,0,1080,82,t.ink);mono('YOUR GAME / DEVELOPMENT LOG',40,27,1000,40,25,t.bg);
  head('PATCH',45,133,990,195,180);head('NOTES',45,325,990,195,180);mono('VERSION 02.4',50,551,980,55,34,t.ink);
  const entries=[['01 / NEW','A NEW WAY TO PLAY','Describe your new feature here.'],['02 / IMPROVED','SMOOTHER SESSIONS','Describe a player-facing improvement.'],['03 / FIXED','BACK IN THE GAME','Explain the fix in everyday language.']];
  entries.forEach(([k,h,b],i)=>{const y=665+i*180;box(48,y,984,2,t.ink);mono(k,48,y+26,275,45,24,t.ink);text(h,345,y+22,685,56,39,t.ink,'Bebas Neue');text(b,345,y+85,665,63,25,t.ink);});
  box(48,1220,984,83,t.accent);label('READ THE UPDATE: YOUR WEBSITE',70,1248,940,t.ink,{size:26});break;
 }
 case 11:{
  circle(760,130,180,'#f4d97a');pixel(90,170,22,['00111100','01111110','11111111','11111111'],'#f3e9dc');pixel(700,375,18,['00111100','01111110','11111111'],'#f3e9dc');
  head('PIXEL',50,40,760,155,137,t.ink);text('picnic',50,225,850,145,124,t.accent,'Bangers',{textEffect:'shadow',effectColor:t.ink,effectAmount:2.5});
  box(0,760,1080,320,'#719d75');box(0,760,1080,28,t.ink);alien(120,530,24,t.ink);alien(650,550,22,t.accent);
  for(const x of [50,310,490,930]){box(x,710,15,50,'#3d6c5e');box(x-12,730,39,11,'#3d6c5e');}
  box(48,844,984,170,'#f3e9dc');label('INDIE GAMES / GOOD COMPANY',70,875,940,t.ink,{align:'center',size:28});label('SUN 15 NOV / 2–6 PM / YOUR SPACE',70,947,940,t.ink,{align:'center',size:23});break;
 }
 case 12:{
  star(65,75,935,t.accent);star(110,118,850,'#de6f58');box(40,45,1000,78,t.ink);label('YOUR CHANNEL / COMMUNITY CHALLENGE',60,69,960,t.accent,{align:'center',size:24});
  text('BOSS',100,175,880,200,181,t.accent,'Bangers',{align:'center',textEffect:'shadow',effectColor:t.ink,effectAmount:3});text('RUSH',100,365,880,200,181,t.accent,'Bangers',{align:'center',textEffect:'shadow',effectColor:t.ink,effectAmount:3});
  art(t.assetSlot,130,600,820,390,()=>{alien(255,600,62,t.ink);box(180,1150,720,6,t.accent);});
  box(95,1060,890,66,t.ink);for(let i=0;i<10;i++)box(110+i*86,1075,70,36,i<7?t.accent:'#63404b');
  footer('FRI 20 NOV / LIVE AT 8 PM','JOIN THE RUN: @YOURCHANNEL',1220);break;
 }
 case 13:{
  box(0,0,22,900,t.ink);for(let i=0;i<10;i++)box(22+i*157,0,78,22,t.ink);label('YOUR CHANNEL / SPEEDRUN SESSION',60,55,1460,t.ink,{size:26});
  text('BEAT YOUR BEST',50,170,1500,170,147,t.ink,'Bebas Neue');
  box(55,405,1000,235,t.ink);mono('00:24:18',80,440,950,170,135,t.accent,{weight:'700'});
  circle(1170,395,280,t.accent);text('PB',1170,440,280,145,105,t.ink,'Bangers',{align:'center'});box(1120,693,410,5,t.ink);
  label('ONE ROUTE. ONE MORE TRY.',60,699,980,t.ink,{size:31});label('SAT 14 NOV / 6 PM / WATCH @YOURCHANNEL',60,815,1470,t.ink,{size:28});break;
 }
 case 14:{
  box(48,48,984,80,t.accent);label('YOUR TEAM IS RECRUITING',70,75,940,t.bg,{align:'center',size:26});head('SQUAD',45,215,990,220,200);head('WANTED',45,435,990,210,174);
  const roles=[['01','SHOT CALLER'],['02','STRATEGIST'],['03','FLEX PLAYER'],['04','GOOD TEAMMATE']];
  roles.forEach(([n,v],i)=>{const y=785+i*187;box(50,y,980,140,i%2?'#284b88':'#315794');circle(75,y+25,90,t.accent);text(n,85,y+39,70,62,45,t.bg,'Bebas Neue',{align:'center'});text(v,210,y+39,770,82,58,t.ink,'Bebas Neue');});
  label('ALL SKILL LEVELS / RESPECT REQUIRED',50,1590,980,t.accent,{align:'center',size:25});label('TRYOUTS SAT 21 NOV / 7 PM',50,1700,980,t.ink,{align:'center',size:32});label('APPLY: YOUR COMMUNITY LINK',50,1800,980,t.ink,{align:'center',size:26});break;
 }
 case 15:{
  text('Cozy quest',60,65,960,175,145,t.ink,'Cormorant Garamond',{italic:true,align:'center'});
  art(t.assetSlot,90,290,900,530,()=>{round(155,290,770,530,'#c8cfb5');round(180,315,720,480,'#f9efd9');box(200,670,680,30,t.ink);box(485,340,16,330,'#c8cfb5');box(200,482,680,16,'#c8cfb5');circle(650,345,115,'#eac477');controller(295,565,470,t.accent,'#f9efd9',t.ink);star(225,350,55,t.accent);});
  label('SLOW GAMES / WARM COMPANY',55,870,970,t.ink,{align:'center',size:27});label('SUN 15 NOV / 4 PM / @YOURCHANNEL',55,947,970,t.accent,{align:'center',size:24});break;
 }
 case 16:{
  label('YOUR CHANNEL / SAVE THE SCHEDULE',48,42,984,t.ink,{size:24});text('THIS WEEK',42,128,996,182,160,t.ink,'Bebas Neue');head('LIVE',42,310,996,200,183);
  const rows=[['TUE','20:00','CO-OP NIGHT'],['THU','19:30','INDIE DISCOVERIES'],['SUN','16:00','COMMUNITY PICKS']];
  rows.forEach(([day,time,v],i)=>{const y=603+i*187;box(48,y,984,145,i===1?t.ink:t.accent);const ink=i===1?t.accent:t.ink;text(day,70,y+30,180,70,52,ink,'Bebas Neue');mono(time,290,y+39,240,55,34,ink);text(v,570,y+37,435,76,37,ink,'Bebas Neue');});
  label('TIMES IN YOUR TIME ZONE',50,1196,980,t.ink,{align:'center',size:24});label('FOLLOW + SET A REMINDER / @YOURCHANNEL',50,1260,980,t.ink,{align:'center',size:23});break;
 }
 case 17:{
  for(let i=0;i<7;i++)for(let j=0;j<4;j++)circle(1305+i*35,55+j*35,9,t.ink);
  label('YOUR COMMUNITY / GAME KNOWLEDGE NIGHT',55,48,1450,t.ink,{size:25});
  text('HOW WELL',45,155,1510,160,142,t.ink,'Bangers');text('DO YOU GAME?',45,320,1510,180,155,t.ink,'Bangers');
  const options=[['A','RETRO EXPERT'],['B','LORE MASTER'],['C','LUCKY GUESSER']];options.forEach(([n,v],i)=>{const x=55+i*505;box(x,568,475,150,i===1?t.accent:t.ink);circle(x+22,600,85,t.bg);text(n,x+22,608,85,70,55,t.ink,'Bangers',{align:'center'});text(v,x+132,615,320,66,35,t.bg,'Bebas Neue');});
  label('FRI 20 NOV / 7 PM / YOUR GAME CAFE',55,795,1490,t.ink,{size:29});label('TEAMS OF UP TO FOUR / BOOK YOUR TABLE',55,847,1490,t.ink,{size:24});break;
 }
 case 18:{
  text('Board game',50,45,980,165,132,t.ink,'Caveat',{align:'center'});head('SOCIAL',50,224,980,185,166,t.accent,{align:'center'});
  const route=[[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[3,2],[2,2],[1,2],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4]];
  route.forEach(([x,y],i)=>{const px=180+x*145,py=480+y*123;round(px,py,124,102,i%3===0?t.accent:t.ink);if(i===0)text('GO',px,py+20,124,60,42,t.bg,'Bebas Neue',{align:'center'});else if(i===route.length-1)star(px+31,py+21,60,t.bg);else circle(px+51,py+40,22,t.bg);});
  pawn(675,603,90,t.accent);dice(350,853,100,t.accent,t.bg);
  label('NEW PLAYERS / NEW FRIENDS',48,1150,984,t.ink,{align:'center',size:28});label('SAT 14 NOV / 6–10 PM / YOUR GAME SHOP',48,1235,984,t.ink,{align:'center',size:23});break;
 }
 case 19:{
  box(25,25,1030,1030,t.ink);box(32,32,1016,1016,t.bg);mono('> YOUR COMMUNITY / DAILY PLAY',55,64,970,48,25,t.ink);
  head('DAILY',50,154,980,155,140);head('CHALLENGE',50,310,980,153,126,t.accent);
  const maze=['111111111111111','100000100010001','101110101010101','100010001000101','111011111110101','100010000010001','101110111011101','100000100000001','111111111111111'];
  pixel(350,525,42,maze,t.ink);circle(410,578,20,t.accent);star(889,827,28,t.accent);
  mono('LEVEL\n008',65,545,245,135,42,t.ink);mono('FIND\nYOUR\nWAY',65,755,245,120,29,t.ink);
  label('SHARE YOUR TIME / TAG @YOURCHANNEL',55,961,970,t.ink,{align:'center',size:23});break;
 }
 case 20:{
  art(t.assetSlot,0,0,1080,1080,()=>{circle(570,350,450,'#252349');controller(310,510,730,'#c284ed',t.bg,t.accent);});
  label('YOUR CHANNEL / AFTER HOURS',48,38,984,t.accent,{size:24,tracking:.06});
  head('AFTER',45,135,650,150,130);head('DARK',45,280,650,150,130);
  text('GAME ON.',48,467,500,80,63,t.accent,'Bebas Neue');
  box(35,950,1010,95,t.bg,{opacity:.9});label('FRI 20 NOV / LIVE AT 9 PM / @YOURCHANNEL',55,986,970,t.ink,{size:23,align:'center'});break;
 }
 case 21:{
  label('YOUR TEAM / OPEN TRYOUTS',50,38,980,t.accent,{align:'center',size:25,tracking:.1});
  head('ARCTIC SQUAD',45,110,990,155,126,t.ink,{align:'center'});
  art(t.assetSlot,100,280,880,880,()=>crest(270,380,540,t.accent,t.bg));
  box(50,1190,980,3,t.accent);label('SAT 21 NOV / TRYOUTS 7 PM',50,1220,980,t.ink,{align:'center',size:28});label('YOUR COMMUNITY LINK / ALL ROLES WELCOME',50,1280,980,t.accent,{align:'center',size:23});break;
 }
 case 22:{
  art(t.assetSlot,0,0,900,900,()=>{ring(135,100,650,20,t.accent,t.bg);box(130,760,650,12,'#a779d4');});
  box(900,0,700,900,t.bg);box(930,48,620,4,t.accent);label('YOUR CHANNEL / A NEW SERIES',945,84,610,t.accent,{size:23});
  head('NEXT',945,207,610,177,160);head('WORLD',945,393,610,165,132);
  text('Your next adventure\nstarts here.',945,591,610,98,37,t.ink,'DM Sans');
  box(945,728,610,78,t.accent);label('PREMIERE / FRI 20 NOV / 8 PM',962,754,575,t.bg,{size:23});label('WATCH @YOURCHANNEL',945,839,610,t.ink,{size:24});break;
 }
 case 23:{
  label('YOUR CHANNEL / SMALL WORLDS, BIG JOY',50,65,980,t.ink,{align:'center',size:24});
  text('Another little',55,190,970,175,143,t.accent,'Caveat',{align:'center'});text('ADVENTURE',50,380,980,145,114,t.ink,'Bebas Neue',{align:'center'});
  art(t.assetSlot,0,570,1080,1080,()=>{circle(760,670,115,t.accent);box(160,1000,760,440,'#84699d');alien(280,1090,40,t.ink);star(815,785,65,t.accent);});
  box(50,1700,980,142,t.accent);label('COZY GAMES / FRIENDLY CHAT',70,1728,940,t.bg,{align:'center',size:27});label('SUN 15 NOV / 4 PM / @YOURCHANNEL',70,1791,940,t.bg,{align:'center',size:23});break;
 }
 }
 return d;
}
