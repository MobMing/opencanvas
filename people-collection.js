// Twenty individually composed designs; photographs, typography and accents stay editable.
const peopleConcepts=[
 ['backroom','BACKROOM','Music & DJ','duo','Club billboard','Neon','#061b26','#ecffea','Underground rave / two selectors / one room','FRI 30 OCT • 10 PM — LATE','dj techno warehouse underground rave b2b',1350],
 ['body-language','BODY\nLANGUAGE','Fitness','dancer','Movement cover','Bold','#e7e6e2','#163fdb','OPEN FLOOR / DANCE WORKSHOP','ALL LEVELS • SATURDAY 2 PM','dance hiphop choreography class',1350],
 ['velvet-sessions','Velvet\nsessions','Entertainment','singer','Live performance','Editorial','#401514','#ffe4b8','SOUL / JAZZ / LIVE','THURSDAY • DOORS AT 8','live music jazz rnb soul concert singer',1350],
 ['between-us','between us.','Podcast','podcast-pair','Conversation cover','Playful','#fff1e1','#973f30','THE CONVERSATIONS WE KEEP COMING BACK TO','NEW EPISODE EVERY TUESDAY','podcast women interview creator talk show',1080],
 ['silver-hour','SILVER\nHOUR','Beauty','beauty-editorial','Beauty masthead','Editorial','#2b1028','#f9e9d9','THE AFTER-DARK BEAUTY EDIT','MAKEUP MASTERCLASS / BOOK NOW','beauty makeup cosmetics salon editorial',1350],
 ['out-tonight','OUT\nTONIGHT?','Entertainment','night-friends','Nightlife snapshot','Bold','#13141c','#f7f0dc','YOUR PEOPLE. YOUR NIGHT.','FRIDAY / YOUR VENUE / 9 PM','party nightlife friends club social media promo',1350],
 ['good-material','GOOD\nMATERIAL','Entertainment','comedian','Comedy playbill','Retro','#f6c85d','#4c1b1b','A SMALL ROOM. BIG LAUGHS.','STAND-UP / SATURDAY / 8 PM','comedy standup open mic entertainment',1350],
 ['studio-notes','studio notes','Marketing','creative-founder','Founder profile','Minimal','#f6f5ef','#203e67','MEET THE MIND BEHIND THE WORK','CREATIVE CONVERSATIONS / ISSUE 01','founder agency creative entrepreneur social media promo',1350],
 ['redline','REDLINE','Music & DJ','dj-techno','Industrial warning','Bold','#dc352e','#140e18','NO DISTRACTIONS. JUST TECHNO.','WAREHOUSE SESSION / 11 PM','techno industrial underground rave dj',1350],
 ['sundown-social','Sundown\nsocial','Music & DJ','rooftop','Sunset postcard','Retro','#fae3b7','#9d3d2b','A LITTLE HIGHER. A LITTLE LONGER.','ROOFTOP / SUNDAY / 5 PM','rooftop friends sunset summer party dj',1080],
 ['deep-cuts','DEEP\nCUTS','Music & DJ','dj-vinyl','Record club sleeve','Classic','#173d3c','#f2d7a7','ALL VINYL. ALL NIGHT.','LISTENING BAR / FRIDAY 9 PM','vinyl selectors house disco dj listening',1080],
 ['centre-stage','CENTRE\nSTAGE','Entertainment','performer','Concert marquee','Bold','#171333','#ffba76','ONE VOICE. A WHOLE ROOM.','LIVE IN CONCERT / SATURDAY','singer live music concert soul performer',1350],
 ['street-cast','STREET\nCAST','Fashion','creator-street','Streetwear journal','Editorial','#f1f0e8','#122448','THE CITY IS YOUR RUNWAY','NEW COLLECTION / DROP 02','streetwear fashion clothing creator social media promo',1350],
 ['frequency','FREQUENCY','Music & DJ','nightlife','Broadcast story','Neon','#162b49','#a9e7ff','TUNE IN. TURN IT UP.','LIVE DJ SET / TONIGHT 10 PM','dj livestream radio house edm underground rave',1920],
 ['soft-strength','soft\nstrength','Wellness','wellness','Wellness diptych','Minimal','#e7e8d8','#3d5948','MOVE WITH CARE. GROW AT YOUR PACE.','SMALL GROUP CLASSES / JOIN US','pilates yoga fitness wellness instructor',1080],
 ['the-muse','THE MUSE','Fashion','fashion','Fashion front page','Editorial','#f7e8e0','#972d4a','STYLE IS A POINT OF VIEW.','THE PORTRAIT ISSUE / NO. 04','fashion beauty portrait magazine',1350],
 ['open-studio','OPEN\nSTUDIO','Photography','creator','Open studio invitation','Playful','#ecd3b7','#43325d','COME FOR THE ART. STAY FOR THE PEOPLE.','SATURDAY 12–6 / FREE ENTRY','art exhibition photography creative studio',1350],
 ['disco-heat','DISCO\nHEAT','Music & DJ','dj-disco','Disco window','Retro','#d74319','#ffe5a1','GOLD RECORDS. WARM NIGHTS.','SATURDAY / BOOGIE UNTIL LATE','disco funk boogie dj dance party',1350],
 ['below-ground','BELOW\nGROUND','Music & DJ','warehouse','Warehouse panorama','Neon','#0a211c','#a8fe92','FOLLOW THE SOUND','SECRET LOCATION / FRIDAY / 23:00','underground rave warehouse techno crowd',1350],
 ['signal-noise','SIGNAL / NOISE','Music & DJ','vinyl','Equipment editorial','Editorial','#e8ecf1','#1737a3','AN EXPERIMENT IN SOUND','SELECTOR SERIES / VOLUME 01','vinyl experimental electronic music dj',1080]
].map(([key,title,topic,asset,layoutName,style,bg,ink,sub,detail,tags,height],layout)=>({key,title,topic,asset,layoutName,style,bg,ink,sub,detail,tags,height,layout}));
const peopleTemplates=peopleConcepts.map(t=>({...t,id:'people-'+t.key,name:t.title.replace(/\n/g,' '),width:1080,format:t.height===1080?'square':t.height===1920?'story':'post',category:t.height===1920?'Story':'Social',collection:'people',aiImagery:true,hasPeople:!['warehouse','vinyl'].includes(t.asset),imagery:t.asset==='warehouse'?'Crowds & places':t.asset==='vinyl'?'Equipment':'People',tags:t.tags+' promotion instagram social media',assetIds:[t.asset]}));
function makePeopleDesign(t,assets){
 const d={version:1,id:uid(),name:t.name,width:1080,height:t.height,background:t.bg,elements:[]},a=d.elements;
 const r=(x,y,w,h,c=t.ink,kind='rect',extra={})=>a.push(shape(x,y,w,h,c,kind,extra));
 const p=(x,y,s)=>a.push(base('image',x,y,s,s,{src:assets[t.asset],altText:'AI-generated fictional promotional scene: '+t.name+'.'}));
 const tx=(v,x,y,w,h,size,c=t.ink,font='Arial',extra={})=>a.push(txt(v,x,y,w,size,c,{h,font,weight:font==='Arial'?'700':'400',...extra}));
 const title=(x,y,w,h,size,c=t.ink,font='Impact')=>tx(t.title,x,y,w,h,size,c,font);
 const caption=(y,c=t.ink)=>tx(t.detail,56,y,968,55,27,c);
 switch(t.layout){
 case 0:p(0,140,1080);r(0,0,1080,230);title(45,26,990,160,168,t.bg);r(0,1090,1080,260,t.bg);tx('02 SELECTORS / 01 ROOM',50,1115,980,65,46);caption(1220);break;
 case 1:p(0,215,1080);title(50,20,980,270,140);r(0,1200,1080,150,t.ink);tx(t.detail,50,1240,980,75,33,t.bg);tx('MOVE / 01',710,1090,320,60,43);break;
 case 2:p(0,0,1080);r(0,970,1080,380,t.bg);title(60,970,960,235,110,t.ink,'Georgia');caption(1250);tx('LIVE AT YOUR VENUE',55,35,960,55,27);break;
 case 3:title(45,30,990,125,115,t.ink,'Georgia');p(205,190,680);r(0,900,1080,180,t.ink);tx(t.sub,50,922,970,60,31,t.bg);tx(t.detail,50,1000,970,45,25,t.bg);r(40,365,140,140,t.ink,'ellipse');tx('EP\n028',60,385,100,105,35,t.bg);break;
 case 4:p(0,180,1080);title(50,20,980,280,144,t.ink,'Georgia');r(0,1175,1080,175,t.bg);tx(t.sub,50,1210,980,45,28);tx(t.detail,50,1270,980,40,24);break;
 case 5:title(45,20,990,275,145);p(40,350,1000);r(40,1140,1000,170,t.ink);tx(t.sub,65,1155,950,60,40,t.bg);tx(t.detail,65,1245,950,40,25,t.bg);break;
 case 6:title(55,30,970,300,145);p(170,390,740);r(45,345,990,8);tx('COMEDY CLUB / ONE NIGHT ONLY',55,1135,970,65,37);caption(1250);break;
 case 7:title(50,35,980,120,95,t.ink,'Georgia');r(50,180,980,2);p(60,225,960);r(60,1020,530,165,t.bg);tx('Ideas begin\nwith people.',85,1045,485,130,50,t.ink,'Georgia');caption(1260);break;
 case 8:tx('UNDERGROUND / 003',50,35,980,70,35);p(60,180,960);r(0,965,1080,230,t.bg);title(40,980,1000,180,180);caption(1260);for(let i=0;i<10;i++)r(60+i*98,115,60,18);break;
 case 9:title(48,30,980,235,95,t.ink,'Georgia');p(290,290,760);r(30,350,205,480,t.ink);tx('SUN\nSET\nCLUB',52,410,170,330,65,t.bg);r(260,900,790,150,t.bg);tx(t.detail,280,942,740,65,30);break;
 case 10:r(40,40,1000,1000,t.ink,'ellipse');p(225,225,630);r(40,45,570,265,t.bg);title(65,55,550,230,120);r(80,870,920,160,t.bg);tx(t.sub,100,880,880,55,37);caption(975);break;
 case 11:title(45,20,990,300,145);p(40,340,1000);r(30,1180,1020,135,t.ink);tx(t.detail,60,1215,960,70,34,t.bg);break;
 case 12:tx('INDEPENDENT STYLE JOURNAL / ISSUE 02',45,28,990,45,24);title(45,90,990,250,150);p(150,385,900);r(30,395,90,865,t.ink);tx('02',40,425,70,70,45,t.bg);r(150,1170,900,115,t.bg);tx(t.detail,175,1200,850,55,30);break;
 case 13:tx('ON AIR / LIVE FROM THE CITY',55,70,970,60,35);title(55,200,970,160,130);p(0,500,1080);r(50,1620,980,170,t.ink);tx(t.sub,80,1640,920,65,44,t.bg);tx(t.detail,80,1730,920,45,28,t.bg);r(55,420,310,15);break;
 case 14:p(400,100,680);r(0,100,455,700,t.bg);title(50,200,620,280,110,t.ink,'Georgia');tx(t.sub,50,830,980,90,38,t.ink,'Georgia');caption(990);break;
 case 15:title(45,30,990,165,165,t.ink,'Georgia');p(0,250,1080);r(0,1120,1080,230,t.bg);tx(t.sub,55,1150,970,70,45,t.ink,'Georgia');caption(1270);break;
 case 16:p(280,130,770);r(35,45,610,260,t.ink);title(55,60,570,230,114,t.bg,'Bangers');r(35,960,1010,340,t.ink);tx(t.sub,70,1005,920,110,46,t.bg,'Georgia');tx(t.detail,70,1200,920,55,32,t.bg);break;
 case 17:title(45,20,990,280,150,t.ink,'Bangers');r(45,350,990,880,t.ink,'round');p(90,385,900);r(90,1125,900,160,t.bg);tx(t.sub,115,1150,850,60,40);caption(1290);break;
 case 18:p(0,130,1080);r(0,0,1080,180,t.bg);tx('WAREHOUSE / AFTER HOURS',45,40,990,80,46);r(0,960,1080,390,t.bg);title(45,980,990,245,145);caption(1270);break;
 case 19:p(20,20,780);r(740,20,320,780,t.ink);tx('01\n—\n33',785,100,230,490,130,t.bg);title(40,845,1000,105,95);tx(t.detail,40,995,1000,45,27);break;
 }
 return d;
}
// Filter before grouping: a search for a title, palette or format must still find its variant.
// Reference combinations reuse a family composition. Keep different photographs and calendar
// months, but don't fill category pages with the same composition in twelve color schemes.
// Individually composed collections keep their own IDs, even when layout names are shared.
function distinctTemplateConcepts(items){
 const seen=new Set();
 return items.filter(t=>{
  let key=t.collection==='remix'?'remix-'+t.key:t.id.startsWith('promo-')?'promo-'+t.key:t.id;
  if(t.collection==='reference'&&t.family){
   const assets=t.assetIds?.length?t.assetIds:t.asset?[t.asset]:[];
   key=JSON.stringify(['reference',t.topic,t.layoutName||t.family,assets,t.family==='calendar'?t.variant:null]);
  }
  if(seen.has(key))return false;
  seen.add(key);return true;
 });
}

