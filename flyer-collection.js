// Original editable compositions. Photo sources remain in assets/people/PROVENANCE.json.
const flyerLayouts=['Back-to-back bill','Record-shop sleeve','Three-frame dispatch','After-hours timetable','Wide community bulletin','Detachable guest pass','Vertical artist diary','Orbit sound system','Acoustic editorial','Asymmetric culture zine','Festival wayfinding','Weekend diptych'];
const flyerFamilies=[
 {style:'Bold',size:[1080,1350],rows:[
  ['TWO ROOMS\nONE NIGHT','Music & DJ',['duo','dj-techno'],'HOUSE / TECHNO / BACK-TO-BACK','underground rave dj b2b'],
  ['MIC CHECK\nDOUBLE BILL','Entertainment',['performer','singer'],'TWO VOICES / ONE SHARED STAGE','soul singer concert live music'],
  ['CONVERSATIONS\nAFTER DARK','Podcast',['podcast-pair','comedian'],'LIVE TALK / BIG IDEAS / GOOD COMPANY','podcast panel comedy talk']]},
 {style:'Retro',size:[1080,1080],rows:[
  ['SIDE B\nSOCIETY','Music & DJ',['dj-vinyl'],'VINYL SELECTORS / DEEP CUTS','dj vinyl listening bar jazz'],
  ['THE GROOVE\nEXCHANGE','Music & DJ',['dj-disco'],'FUNK / BOOGIE / DANCE','disco funk record music'],
  ['INDEPENDENT\nFREQUENCIES','Music & DJ',['vinyl'],'RECORD FAIR / LISTENING SESSION','record market vinyl independent']]},
 {style:'Editorial',size:[1080,1350],rows:[
  ['THREE WAYS\nTO STAY OUT','Music & DJ',['night-friends','wave-disco-friends','rooftop'],'FRIENDS / MUSIC / CITY LIGHTS','party nightlife disco social'],
  ['LIVE FROM\nTHE BLOCK','Entertainment',['wave-garage-band','studio-concert','wave-jazz-trio'],'GUITARS / HORNS / EVERYONE WELCOME','concert jazz rock band festival'],
  ['THE CREATIVE\nNEIGHBORHOOD','Small Business',['wave-market-makers','creative-founder','creator-street'],'MAKERS / ARTISTS / LOCAL IDEAS','market makers creative pop up community']]},
 {style:'Bold',size:[1080,1350],graphic:true,rows:[
  ['LATE SHIFT\nASSEMBLY','Music & DJ',[],'A NIGHT BUILT AROUND THE SOUND','underground rave techno warehouse schedule'],
  ['FRESH CUTS\nWEEKENDER','Music & DJ',[],'INDEPENDENT SELECTORS / OPEN MINDS','dj festival house lineup schedule'],
  ['CULTURE\nAFTER HOURS','Entertainment',[],'SPOKEN WORD / LIVE SETS / NEW WORK','culture poetry performance event schedule']]},
 {style:'Minimal',size:[1440,900],rows:[
  ['YOUR CITY.\nYOUR PEOPLE.','Marketing',['city-winston-salem','creator-street'],'A LOCAL CREATIVE MEETUP','city local community networking social promo'],
  ['ROOTED\nIN THE WEEKEND','Small Business',['wave-market-makers','life-harvest'],'SMALL MAKERS / BIG DISCOVERIES','farmers market artisan handmade community'],
  ['SOUND\nWITH A VIEW','Music & DJ',['city-chicago','wave-desert-stage'],'OPEN-AIR SESSIONS / SUNSET SELECTORS','dj festival open air city rooftop']]},
 {style:'Classic',size:[1080,1350],rows:[
  ['BASEMENT\nINVITATION','Music & DJ',['nightlife'],'PERSONAL FAVORITES / NEW CONNECTIONS','dj house underground club guest list'],
  ['FRONT ROW\nFRIDAY','Entertainment',['wave-jazz-trio'],'LIVE MUSIC / EVERY SEAT IS A GOOD ONE','jazz concert trio gig soul'],
  ['STUDIO\nOPEN HOUSE','Photography',['studio-portrait'],'NEW WORK / NEW PERSPECTIVES','gallery exhibition studio photography art']]},
 {style:'Editorial',size:[1080,1920],rows:[
  ['MOVEMENT\nIS A LANGUAGE','Fitness',['dancer','wave-dancer-motion','wellness'],'OPEN CLASS / ALL LEVELS / YOUR STUDIO','dance movement workshop fitness story'],
  ['A WEEKEND\nIN COLOR','Fashion',['fashion','beauty-editorial','studio-portrait'],'STYLE / SELF-EXPRESSION / NEW WORK','fashion beauty editorial social story'],
  ['TOGETHER\nON THE LINEUP','Music & DJ',['dj-techno','duo','dj-disco'],'INDEPENDENT SOUNDS / SHARED SPACE','dj artist lineup rave techno disco story']]},
 {style:'Neon',size:[1080,1080],graphic:true,rows:[
  ['TRANSMIT\nSOMETHING GOOD','Music & DJ',[],'LOW FREQUENCIES / HIGH SPIRITS','rave techno electronic orbit underground'],
  ['INNER\nCIRCLE SOCIAL','Music & DJ',[],'COME EARLY / STAY CURIOUS','house dj party dance social'],
  ['SOLAR\nLISTENING CLUB','Music & DJ',[],'SUNSET SELECTORS / OPEN AIR','disco sunset festival summer vinyl']]},
 {style:'Classic',size:[1080,1350],rows:[
  ['A ROOM\nFULL OF SONGS','Entertainment',['singer'],'AN INTIMATE EVENING OF LIVE SOUL','soul acoustic concert singer gig'],
  ['SOFT LIGHT\nLOUD HEARTS','Entertainment',['performer'],'NEW VOICES / LIVE AND UP CLOSE','singer live music acoustic concert'],
  ['BETWEEN\nTHE NOTES','Entertainment',['wave-jazz-trio'],'IMPROVISATION / CONVERSATION / JAZZ','jazz live trio music improvisation']]},
 {style:'Playful',size:[1080,1350],rows:[
  ['OUTSIDE\nTHE ORDINARY','Fashion',['creator-street','studio-duo'],'A STREET CULTURE EDITION','fashion streetwear creative pop up'],
  ['MADE HERE\nSHARED HERE','Small Business',['wave-market-makers','creative-founder'],'A NEIGHBORHOOD CREATIVE FAIR','market small business maker craft pop up'],
  ['THE GOOD\nNOISE ISSUE','Entertainment',['wave-garage-band','night-friends'],'LOCAL BANDS / BIG FEELINGS','rock band punk zine gig concert']]},
 {style:'Playful',size:[1080,1350],graphic:true,rows:[
  ['FOLLOW\nTHE SOUND','Music & DJ',[],'THREE STAGES / ONE GREAT DAY','music festival wayfinding dj rave open air'],
  ['THE LOCAL\nLOOP','Small Business',[],'DISCOVER YOUR NEXT FAVORITE MAKER','community craft market pop up fair'],
  ['CREATIVE\nCROSSROADS','Marketing',[],'MEET / MAKE / SHARE','creative marketing networking workshop community']]},
 {style:'Editorial',size:[1440,900],rows:[
  ['SUN DOWN.\nVOLUME UP.','Music & DJ',['rooftop','wave-desert-stage'],'A SUMMER SOUND SERIES','dj outdoor festival summer sunset promo'],
  ['TAKE A\nCULTURE BREAK','Travel',['city-paris','studio-botanical'],'ART / SLOW STREETS / NEW PERSPECTIVES','city culture travel art weekend promo'],
  ['OPEN TABLE\nOPEN MINDS','Food & Drink',['mix-picnic','studio-friends'],'GOOD FOOD / NEW FRIENDS / SHARED STORIES','food picnic supper community meetup promo']]}
];
const flyerPalettes=[['#f2ecdf','#20221e','#b5d753'],['#261c30','#fff1dc','#eb8eae'],['#e7e8e0','#1e3a68','#df692f'],['#f5dcaa','#3d252b','#bc482c'],['#142d2d','#f8edda','#b5c8fa'],['#e5d5e8','#392654','#e8ae37'],['#dae9e2','#243b37','#c85f41'],['#171a25','#f3eccd','#d3ed62'],['#efdfcf','#582c32','#d6a648'],['#e4e9f4','#24386c','#d95e48'],['#f9e8c0','#3d365e','#8ebcb0'],['#233f53','#f6eddf','#dcb979']];
const flyerNonPeople=new Set(['vinyl','city-winston-salem','city-chicago','city-paris','life-harvest','wave-desert-stage','studio-botanical','mix-picnic']);
const flyerTemplates=flyerFamilies.flatMap((family,layout)=>family.rows.map(([title,topic,assetIds,sub,tags],variant)=>{const [width,height]=family.size,[bg,ink,accent]=flyerPalettes[(layout+variant*4)%12],hasPeople=assetIds.some(a=>!flyerNonPeople.has(a));return{id:'flyer-lab-'+layout+'-'+variant,name:title.replace(/\n/g,' '),title,topic,assetIds,asset:assetIds[0]||'',sub,tags:tags+' flyer poster social media promotion '+flyerLayouts[layout],layout,layoutName:flyerLayouts[layout],style:family.style,variant,width,height,bg,ink,accent,collection:'flyer-lab',format:width>height?'cover':height===1920?'story':width===height?'square':'post',category:height===1920?'Story':width>height?'Social':'Poster',aiImagery:assetIds.length>0,hasPeople,imagery:assetIds.length?(hasPeople?'People':assetIds.every(id=>id==='vinyl')?'Equipment':'Crowds & places'):'Shapes & symbols',detail:topic==='Small Business'?'SATURDAY / 12–6 PM / YOUR MARKET':topic==='Fitness'?'YOUR DATE / ALL LEVELS / YOUR STUDIO':topic==='Music & DJ'||topic==='Entertainment'?'YOUR DATE / DOORS 9 PM / YOUR VENUE':'YOUR DATE / YOUR PLACE / JOIN US'};}));
function flyerAccentInk(t){const lum=h=>{const rgb=h.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};const score=c=>{const a=lum(c),b=lum(t.accent);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};return[t.ink,t.bg,'#000000','#ffffff'].sort((a,b)=>score(b)-score(a))[0];}
function makeFlyerDesign(t,assets){
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements,accentInk=flyerAccentInk(t),v=t.variant;
 const r=(x,y,w,h,c=t.ink,kind='rect',extra={})=>a.push(shape(x,y,w,h,c,kind,extra));
 const tx=(text,x,y,w,h,size,c=t.ink,font='DM Sans',extra={})=>a.push(txt(text,x,y,w,size,c,{h,font,weight:'400',lineHeight:1,tracking:0,...extra}));
 const title=(x,y,w,h,size,font='Anton',c=t.ink,extra={})=>tx(t.title,x,y,w,h,size,c,font,extra);
 const small=(text,x,y,w,c=t.ink,extra={})=>tx(text,x,y,w,80,27,c,'DM Sans',{weight:'700',lineHeight:1.15,...extra});
 const photo=(i,x,y,w,h,extra={})=>a.push(base('image',x,y,w,h,{src:assets[t.assetIds[i]],photoCrop:{zoom:1,x:.5,y:.35},altText:'Original AI-generated fictional scene: '+t.assetIds[i]+'. No real person, performer or event is represented. Source details: assets/people/PROVENANCE.json.',...extra}));
 const detail=(x,y,w,c=t.ink,extra={})=>small(t.detail,x,y,w,c,extra);
 const line=(x,y,w,c=t.ink,h=2)=>r(x,y,w,h,c);
 const disc=(x,y,s,ink=t.ink,accent=t.accent)=>{r(x,y,s,s,ink,'ellipse');for(let k=0;k<8;k++){const inset=20+k*s*.042;if(s-inset*2>0)r(x+inset,y+inset,s-inset*2,s-inset*2,k%2?ink:accent,'ellipse');}r(x+s*.45,y+s*.45,s*.1,s*.1,t.bg,'ellipse');};
 const bars=(x,y,w,h,c=t.ink)=>{for(let offset=0,i=0;offset<w-8;i++){const s=[3,7,2,5,3][i%5];r(x+offset,y,s,h,c);offset+=s+4;}};
 switch(t.layout){
 case 0:{
  const split=510+v*25;photo(0,0,405,split,785,{photoCrop:{zoom:1,x:.5,y:0}});photo(1,split+12,405,1068-split,785,{photoCrop:{zoom:1,x:.5,y:0}});r(0,0,1080,405,t.ink);
  small('INDEPENDENT SOUNDS / SHARED SPACE',45,35,990,t.bg);title(43,125,990,255,118,'Anton',t.bg);r(45,955,430,180,t.accent);
  tx('BACK\nTO BACK',65,978,390,135,61,accentInk,'Bebas Neue');r(735,1020,310,110,'#111111','rect',{opacity:.65});tx('01 / 02',760,1038,270,95,72,'#ffffff','Cormorant Garamond',{align:'right'});
  r(0,1190,1080,160,t.ink);small(t.sub,45,1214,990,t.bg,{h:48,size:26});detail(45,1280,990,t.bg,{h:40,size:23});break;
 }
 case 1:{
  photo(0,0,355,1080,570,{photoCrop:{zoom:1,x:.5,y:0}});r(0,355,1080,570,'#172126','rect',{opacity:.34});r(0,0,1080,355,'#172126');
  small('THE LISTENING DEPARTMENT',40,30,1000,'#fff2da',{h:50,size:22});title(38,110,1000,230,105,'Anton','#fff2da');
  const s=360+v*45,x=v===1?40:1040-s,y=500-v*20;disc(x,y,s,t.ink,t.accent);
  const textX=v===1?570:40;tx('33\nRPM',textX,605,380,220,93,'#fff2da','Cormorant Garamond');
  r(0,925,1080,155,'#172126');small(t.sub,40,946,1000,'#fff2da',{h:45,size:27});detail(40,1016,1000,'#fff2da',{h:42,size:21});break;
 }
 case 2:{
  const split=510+v*35;photo(0,0,0,split,450,{photoCrop:{zoom:1,x:.5,y:0}});photo(1,split+12,0,1068-split,450,{photoCrop:{zoom:1,x:.5,y:0}});photo(2,0,760,1080,590,{photoCrop:{zoom:1,x:.5,y:0}});
  r(36,450,1008,310,t.bg);small('THE CULTURE DISPATCH / ISSUE 0'+(v+1),60,475,950,t.ink,{h:40,size:23});title(56,545,965,190,88,'Anton');
  r(36,1020,605,170,t.accent);tx('A LITTLE MORE\nLIFE IN YOUR\nWEEKEND.',60,1040,555,145,43,accentInk,'Bebas Neue');
  r(0,1230,1080,120,t.ink);detail(40,1270,1000,t.bg,{h:48,size:25});break;
 }
 case 3:{
  r(0,0,1080,1350,t.ink);title(40,80,1000,360,154,'Anton',t.bg);small('THE PROGRAM / SAVE THE DATE',45,30,990,t.bg,{h:40,size:22});
  r(40,475,1000,120,t.accent);small(t.sub,64,507,952,accentInk,{h:67,size:32});
  for(const [i,time,label]of[[0,'21:00','THE WARM-UP'],[1,'23:00','THE MAIN ROOM'],[2,'01:00','THE LATE SESSION']]){const y=645+i*170,numberX=v%2?825:45,timeX=v%2?45:310;tx('0'+(i+1),numberX,y,210,130,110,t.bg,'Anton',{textEffect:'hollow',effectColor:t.bg,effectAmount:1.3});tx(time,timeX,y+5,420,80,63,t.bg,'Cormorant Garamond');small(label,timeX,y+83,470,t.bg,{h:43,size:25});line(45,y+145,990,t.bg,1);}
  detail(45,1240,990,t.bg,{h:70,size:27});break;
 }
 case 4:{
  const split=600+v*35;photo(0,split,0,1440-split,900);r(0,0,split+30,900,t.ink);small(t.sub,40,30,split-40,t.bg,{h:80,size:23});title(40,155,split-45,355,111,'Anton',t.bg);
  photo(1,40,570,270,275);r(350,570,split-360,275,t.accent);tx('GOOD\nTHINGS\nHAPPEN\nHERE',368,590,split-396,230,47,accentInk,'Bebas Neue');
  r(split+65,715,1440-split-105,135,t.bg);detail(split+85,745,1440-split-145,t.ink,{h:80,size:25});break;
 }
 case 5:{
  const pw=735-v*20;photo(0,0,338,pw,857,{photoCrop:{zoom:1,x:.5,y:0}});r(pw,0,1080-pw,1350,t.bg);
  r(35,48,1010,290,t.ink);title(58,70,965,245,112,'Anton',t.bg);tx('ADMIT',pw+25,400,1030-pw,80,57,t.ink,'Bebas Neue');tx('ONE',pw+25,485,1030-pw,100,90,t.ink,'Bebas Neue');
  small('YOUR\nNAME\nHERE',pw+25,645,1030-pw,t.ink,{h:185,size:40});tx('00'+(v+1),pw+25,900,1030-pw,120,89,t.ink,'Cormorant Garamond');bars(pw+25,1070,1030-pw,80);
  r(0,1195,1080,155,t.ink);small(t.sub,40,1218,1000,t.bg,{h:46,size:25});detail(40,1285,1000,t.bg,{h:40,size:21});break;
 }
 case 6:{
  photo(0,0,460,1080,730,{photoCrop:{zoom:1,x:.5,y:0}});r(0,0,1080,460,t.ink);small('A STORY IN THREE FRAMES',45,40,990,t.bg,{h:50,size:25});title(42,140,995,280,120,'Anton',t.bg);
  r(40,965,1000,190,t.accent);small(t.sub,65,1000,950,accentInk,{h:110,size:40});
  const y2=1225+v*25;photo(1,40,y2,480,490);photo(2,560,1225,480,490);small('02 / THE DETAILS',40,1780,480,t.ink,{h:40,size:23});small('03 / THE PEOPLE',560,1780,480,t.ink,{h:40,size:23});line(40,1840,1000);detail(40,1860,1000,t.ink,{h:45,size:25});break;
 }
 case 7:{
  r(0,0,1080,1080,t.ink);const cx=410+v*30;for(let k=0;k<13;k++){const w=610-k*39;r(cx+k*19.5,80+k*19.5,w,w,k%2?t.ink:t.accent,'ellipse');}
  title(40,95,635,340,142,'Anton',t.bg);r(40,500,405,130,t.accent);small('A SIGNAL\nWORTH FOLLOWING',62,520,365,accentInk,{h:95,size:31});
  r(65,770,225,45,t.bg);r(265,715,155,155,t.bg,'triangle',{rotation:90});small(t.sub,445,730,590,t.bg,{h:150,size:35});line(40,963,1000,t.bg);detail(40,996,1000,t.bg,{h:50,size:22});break;
 }
 case 8:{
  photo(0,0,470,1080,640,{photoCrop:{zoom:1,x:.5,y:0}});r(0,470,1080,640,'#172126','rect',{opacity:.25});r(0,0,1080,470,'#172126');r(0,1110,1080,240,'#172126');
  small('THE INTIMATE SERIES / LIVE MUSIC',45,40,990,'#fff3df',{h:50,size:23});title(45,145,990,320,137,v===1?'Caveat':'Cormorant Garamond','#fff3df',{italic:v!==1});
  tx('listen a little closer',55,950,940,120,100,'#fff3df','Caveat',{rotation:-2,textEffect:'shadow',effectColor:'#172126',effectAmount:2});small(t.sub,45,1160,990,'#fff3df',{h:75,size:31});detail(45,1267,990,'#fff3df',{h:50,size:25});break;
 }
 case 9:{
  photo(0,0,365,730+v*20,870,{photoCrop:{zoom:1,x:.5,y:0}});r(745+v*20,0,335-v*20,1350,t.accent);photo(1,585,600,455,565);
  r(35,65,1010,300,t.ink);title(55,85,970,260,115,'Anton',t.bg);tx('THE\nLOCAL\nSCENE',793,400,230,165,47,accentInk,'Bebas Neue');
  r(35,965,500,230,t.bg);tx('Culture is\nbetter shared.',57,1000,455,160,64,t.ink,'Caveat');r(0,1235,1080,115,t.ink);detail(40,1272,1000,t.bg,{h:50,size:24});break;
 }
 case 10:{
  const dark=v!==1;if(dark)r(0,0,1080,1350,t.ink);const fg=dark?t.bg:t.ink,baseColor=dark?t.ink:t.bg;
  small('YOUR WEEKEND / REIMAGINED',45,35,990,fg,{h:50,size:23});title(40,130,1000,300,130,'Anton',fg);
  r(45,500,990,680,t.accent);const labels=['DISCOVER','CONNECT','CELEBRATE'];for(let i=0;i<3;i++){const y=545+i*205;tx('0'+(i+1),70,y,225,165,135,accentInk,'Anton');tx(labels[i],325,y+25,650,105,70,accentInk,'Bebas Neue');if(i<2)line(70,y+175,935,accentInk,2);}
  small(t.sub,45,1210,990,fg,{h:42,size:25});detail(45,1280,990,fg,{h:40,size:22});break;
 }
 case 11:{
  photo(0,0,0,1440,900);r(0,0,1440,900,'#101c24','rect',{opacity:.5});small(t.sub,40,35,1360,'#fff3df',{h:60,size:25});title(40,160,815,400,153,'Anton','#fff3df');
  const pw=400+v*25;photo(1,1400-pw,210,pw,520);r(40,670,775,180,t.accent);tx('GO SOMEWHERE.\nFEEL SOMETHING.',62,697,730,125,54,accentInk,'Bebas Neue');r(925,752,495,118,'#101c24','rect',{opacity:.9});detail(945,773,455,'#fff3df',{h:85,size:25});break;
 }
 }
 return d;
}


