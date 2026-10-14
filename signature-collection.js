// Signature: twenty individually composed, image-free design starting points.
// Every mark is an editable native shape; all type uses bundled open fonts.
const signatureRows=[
 ['SUBTERRANEAN','Music & DJ','Bold','Subway map',1080,1350,'#142b36','#e6faef','#fa5535','underground rave techno warehouse transit night'],
 ['ACID BLOOM','Music & DJ','Neon','Optical bloom',1080,1350,'#181b14','#e8f47d','#a99be4','acid house rave psychedelic dance music'],
 ['THE NIGHT SHIFT','Music & DJ','Editorial','Typesetter ticket',1080,1350,'#eee8db','#221d1b','#e64b31','dj club night ticket techno late afterhours'],
 ['WAX & WANE','Music & DJ','Retro','Listening label',1080,1080,'#e1c7aa','#412f30','#c75335','vinyl record listening disco selectors soul'],
 ['NO FIXED ADDRESS','Music & DJ','Bold','Offset warehouse',1080,1350,'#ecece3','#161c28','#375add','underground rave warehouse diy electronic'],
 ['SLOW / FAST','Music & DJ','Minimal','Frequency study',1080,1350,'#edece6','#282825','#b9452d','ambient electronic experimental listening session'],
 ['OPEN AIR / OPEN MINDS','Entertainment','Playful','Sunset day party',1600,900,'#ef5a32','#283a9b','#f7deb1','day party rooftop summer open air dance'],
 ['BLUE NOTE SOCIAL','Entertainment','Classic','Jazz score',1080,1350,'#132f32','#eee4c7','#c5a06a','jazz soul live music trio listening bar'],
 ['SUNDAY FINDS','Small Business','Retro','Market sticker sheet',1080,1350,'#fae4ba','#314a3b','#c84a30','thrift vintage market makers community shopping'],
 ['A LITTLE RITUAL','Beauty','Classic','Serif beauty invitation',1080,1350,'#e5b7b0','#482f32','#f8ede0','beauty skincare salon appointment launch'],
 ['AFTER THE AFTER','Music & DJ','Neon','Folded club bill',1080,1350,'#f3b8d6','#3a226e','#f7f3a2','afterparty queer club disco nightlife dj'],
 ['FORM IN COMMON','Photography','Editorial','Exhibition blocks',1080,1350,'#f0ede4','#253d99','#cb382b','art exhibition gallery sculpture opening'],
 ['SIDE STAGE','Entertainment','Bold','Festival timetable',1080,1350,'#f2edda','#202c29','#e36b33','independent music festival bands lineup live gig'],
 ['BREAK / PATTERN','Music & DJ','Bold','Diagonal signal',1080,1350,'#db4931','#201e23','#f6e7d0','breakbeat jungle drum bass rave club'],
 ['FRESH DROP','Fashion','Bold','Product launch billboard',1600,900,'#d5e5dd','#233d32','#ed6539','fashion streetwear launch sale social promotion'],
 ['BETTER QUESTIONS','Podcast','Editorial','Conversation punctuation',1080,1080,'#ddd9e8','#382960','#e86342','podcast interview conversations episode marketing'],
 ['THE GOOD NIGHT','Celebrations','Playful','Confetti invitation',1080,1350,'#f2dfc5','#3f3680','#f15c3e','birthday celebration invite party friends'],
 ['WAYS OF MAKING','Marketing','Minimal','Creative workshop index',1080,1350,'#edece8','#212a31','#d4b52a','design creative workshop marketing conference maker'],
 ['NIGHT CURRENT','Music & DJ','Neon','Vertical wave system',1080,1920,'#111d35','#cde75f','#acb7fb','techno rave underground electronic story social dj'],
 ['MEET ME AT THE MARKET','Food & Drink','Classic','Handwritten cafe card',1600,900,'#f4e6ce','#304f42','#c74d34','cafe coffee market brunch food weekend community']
];
const signatureTemplates=signatureRows.map(([title,topic,style,layoutName,width,height,bg,ink,accent,tags],layout)=>({
 id:'signature-'+String(layout+1).padStart(2,'0'),name:title,title,topic,style,layout,layoutName,width,height,bg,ink,accent,
 collection:'signature',assetIds:[],aiImagery:false,hasPeople:false,imagery:'Shapes & symbols',
 format:height===1920?'story':width===1600?'cover':height===1080?'square':'post',category:height===1920?'Story':width===1600||height===1080?'Social':'Poster',
 tags:tags+' signature original editable typography flyer poster promo',description:'Original composition with editable typography and native vector shapes. No generated or stock imagery.'
}));
function makeSignatureDesign(t){
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements;
 const box=(x,y,w,h,c=t.ink,extra={})=>a.push(shape(x,y,w,h,c,'rect',extra));
 const circle=(x,y,s,c=t.ink,extra={})=>a.push(shape(x,y,s,s,c,'ellipse',extra));
 const oval=(x,y,w,h,c=t.ink,extra={})=>a.push(shape(x,y,w,h,c,'ellipse',extra));
 const star=(x,y,s,c=t.accent,extra={})=>a.push(shape(x,y,s,s,c,'star',extra));
 const text=(v,x,y,w,h,size=30,c=t.ink,font='DM Sans',extra={})=>a.push(txt(v,x,y,w,size,c,{h,font,weight:'400',lineHeight:1.08,tracking:0,...extra}));
 const head=(v,x,y,w,h,size,c=t.ink,extra={})=>text(v,x,y,w,h,size,c,'Anton',extra);
 const label=(v,x,y,w,c=t.ink,extra={})=>text(v,x,y,w,56,25,c,'DM Sans',{weight:'700',...extra});
 const line=(x,y,w,c=t.ink,h=2)=>box(x,y,w,h,c);
 const ring=(x,y,s,stroke=8,c=t.ink,paper=t.bg)=>{circle(x,y,s,c);circle(x+stroke,y+stroke,s-stroke*2,paper);};
 const cross=(x,y,s,c=t.ink)=>{box(x+s*.43,y,s*.14,s,c);box(x,y+s*.43,s,s*.14,c);};
 const footer=(date='SAT 14 NOV / 9 PM — LATE',place='YOUR VENUE / YOUR CITY')=>{line(50,d.height-132,d.width-100);label(date,50,d.height-108,d.width-100);label(place,50,d.height-66,d.width-100,t.ink,{size:23});};
 switch(t.layout){
 case 0:{
  label('A BELOW-GROUND CONNECTION',48,35,980,t.ink,{size:24});
  head('SUB',40,105,960,320,285);head('TERRA',40,375,980,300,260);head('NEAN',40,640,980,280,255);
  box(790,120,30,960,t.accent);box(790,1050,200,30,t.accent);box(120,1034,700,30,t.accent);
  for(const [x,y]of[[790,195],[790,480],[790,770],[790,1034],[400,1034],[120,1034]]){circle(x-18,y-18,66,t.accent);circle(x-5,y-5,40,t.bg);}
  box(45,915,645,100,t.bg);label('HOUSE / TECHNO / ALL TOGETHER',50,942,650,t.ink,{size:24});
  label('YOUR SELECTORS + SPECIAL GUESTS',50,1128,950,t.ink,{size:27});footer();break;
 }
 case 1:{
  label('THE OPEN CIRCUIT / CLUB SERIES 02',45,36,990);
  head('ACID',45,110,990,250,225);head('BLOOM',45,340,990,225,198);
  for(let i=0;i<9;i++)ring(210+i*25,570+i*25,660-i*50,12,i%2?t.accent:t.ink,t.bg);
  circle(450,810,180,t.accent);cross(505,865,70,t.bg);
  box(45,1130,990,70,t.ink);label('GROW OUTSIDE THE ORDINARY',65,1150,950,t.bg,{size:26});
  label('FRI 20 NOV / 22:00–05:00',45,1245,650);label('YOUR VENUE',720,1245,315,t.ink,{align:'right'});break;
 }
 case 2:{
  label('INDEPENDENT MUSIC / NO. 008',48,35,820);line(48,96,984,t.ink,4);
  text('THE',48,125,440,100,82,t.ink,'Bebas Neue');head('NIGHT',42,225,995,270,250);head('SHIFT',42,480,995,270,248);
  box(48,778,984,155,t.accent);text('CLOCK IN.',72,798,930,120,98,t.bg,'Bebas Neue');
  label('YOUR HEADLINER',52,976,670,t.ink,{size:32});label('YOUR SUPPORT / YOUR RESIDENTS',52,1026,900,t.ink,{size:25});
  for(let i=0;i<24;i++)box(50+i*41,1117,21,3,t.ink);
  text('14',50,1160,200,135,112,t.accent,'Cormorant Garamond');label('NOVEMBER / SATURDAY',290,1170,740);label('DOORS 10 PM / YOUR VENUE',290,1225,740);break;
 }
 case 3:{
  ring(120,125,840,4);ring(146,151,788,3);ring(172,177,736,2);circle(265,270,550,t.ink);circle(375,380,330,t.accent);circle(513,518,54,t.bg);
  text('WAX & WANE',150,90,780,190,104,t.ink,'Bebas Neue',{curve:95,align:'center'});
  box(70,716,940,205,t.bg);text('A LISTENING SOCIAL',75,735,930,105,77,t.ink,'Bebas Neue',{align:'center'});
  label('DEEP CUTS / WARM GROOVES / ALL VINYL',80,839,920,t.ink,{align:'center',size:23});
  label('SUN 15 NOV / 4–9 PM / YOUR RECORD BAR',50,985,980,t.ink,{align:'center',size:25});break;
 }
 case 4:{
  box(0,0,240,1350,t.accent);text('OPEN\nCIRCUIT\nPRESENTS',28,50,190,160,27,t.bg,'DM Sans',{weight:'700'});
  head('NO',285,50,735,240,215);head('FIXED',285,280,735,235,200);head('ADDRESS',285,510,735,200,135);
  box(285,750,740,325,t.ink);text('LOCATION\nREVEALED\nTO TICKET HOLDERS',315,780,680,250,60,t.bg,'Bebas Neue',{lineHeight:1.1});
  for(let i=0;i<6;i++)box(40,490+i*95,160,45,i%2?t.bg:t.ink);
  label('FRI 20 NOV',285,1120,730,t.ink,{size:31});label('11 PM — 5 AM / YOUR CITY',285,1170,730);label('YOUR TICKET LINK / 18+',285,1260,730,t.accent,{size:24});break;
 }
 case 5:{
  text('slow',50,70,980,235,205,t.ink,'Cormorant Garamond',{italic:true});
  text('FAST',535,310,495,180,148,t.ink,'Bebas Neue');
  for(let i=0;i<35;i++){const h=70+Math.sin(i*.38)**2*310;box(60+i*28,750-h/2,9,h,i%5===0?t.accent:t.ink);}
  label('A STUDY IN TEMPO',55,1035,960,t.accent,{tracking:.13});
  text('Ambient openings.\nElectronic endings.',55,1095,960,105,42,t.ink,'Cormorant Garamond');footer('THU 12 NOV / 7 PM — MIDNIGHT');break;
 }
 case 6:{
  circle(930,60,580,t.accent);circle(1045,175,350,t.bg);box(885,480,670,18,t.ink);
  for(let i=0;i<6;i++)box(920,520+i*38,580,9,t.ink);
  label('YOUR COLLECTIVE PRESENTS / A DAY PARTY',55,35,1380,t.ink,{size:27});
  text('OPEN AIR',45,140,1110,230,198,t.ink,'Bebas Neue');text('open minds',52,365,1030,190,148,t.accent,'Caveat');
  box(50,630,760,158,t.ink);label('SATURDAY / 2 PM UNTIL SUNSET',75,663,710,t.accent,{size:28});label('YOUR ROOFTOP / YOUR CITY',75,716,710,t.accent,{size:25});
  label('HOUSE / DISCO / GOOD COMPANY',55,830,1460,t.ink,{size:25});break;
 }
 case 7:{
  label('THE LISTENING ROOM PRESENTS',52,38,976,t.ink,{tracking:.1});
  text('Blue note',55,125,970,220,170,t.ink,'Cormorant Garamond',{italic:true});head('SOCIAL',52,350,976,200,178);
  for(let i=0;i<5;i++)line(52,670+i*37,976,t.accent,3);
  for(const [x,y]of[[110,640],[375,695],[655,660],[910,715]]){oval(x,y,70,45,t.ink);box(x+57,y-155,8,175,t.ink);}
  text('YOUR TRIO',52,915,976,105,80,t.ink,'Bebas Neue');label('LIVE JAZZ / SOUL / LATE-NIGHT RECORDS',52,1040,976,t.accent,{size:25});footer('THU 19 NOV / FIRST SET 8 PM');break;
 }
 case 8:{
  for(let i=0;i<12;i++)box(i*90,0,45,1350,'#f3d69f');
  box(45,45,990,290,t.ink);head('SUNDAY',70,60,940,160,144,t.bg);text('finds',580,188,410,130,112,t.bg,'Caveat');
  circle(60,405,370,t.accent);text('OLD\nIS GOLD',88,470,310,210,70,t.bg,'Bebas Neue',{align:'center'});
  box(505,425,485,300,t.bg);text('VINTAGE\nRECORDS\nHOMEWARE',530,466,430,220,57,t.ink,'Bebas Neue');
  box(62,820,925,285,t.bg);text('Small sellers.\nGreat discoveries.',90,852,865,160,65,t.ink,'Cormorant Garamond',{italic:true});
  star(835,995,104,t.accent);label('SUN 15 NOV / 10 AM–4 PM',50,1160,980,t.ink,{size:30});label('YOUR MARKET / FREE ENTRY',50,1230,980,t.ink,{size:27});break;
 }
 case 9:{
  box(42,42,996,1266,t.ink);box(49,49,982,1252,t.bg);
  label('YOUR STUDIO / A SEASONAL OPEN HOUSE',80,80,920,t.ink,{size:23,align:'center'});
  text('A little',80,230,920,190,150,t.ink,'Cormorant Garamond',{italic:true,align:'center'});text('RITUAL',80,420,920,205,165,t.ink,'Cormorant Garamond',{align:'center'});
  oval(389,715,302,390,t.accent);oval(464,750,152,265,t.bg);box(524,772,32,300,t.ink);oval(430,810,100,70,t.ink);oval(550,890,100,70,t.ink);
  text('Find a moment\nthat is only yours.',80,1130,920,95,40,t.ink,'Cormorant Garamond',{italic:true,align:'center'});
  label('SAT 14 NOV / 11 AM–5 PM / YOUR STUDIO',65,1250,950,t.ink,{size:22,align:'center'});break;
 }
 case 10:{
  box(40,40,1000,1270,t.ink);box(58,58,964,1234,t.bg);box(535,58,3,1234,t.ink);
  head('AFTER',80,120,920,240,218);text('the',80,390,415,150,135,t.ink,'Caveat');
  head('AFTER',80,570,920,240,218,t.ink,{textEffect:'hollow',effectColor:t.ink,effectAmount:1.8});
  circle(690,370,270,t.accent);text('KEEP\nDANCING',710,420,230,135,48,t.ink,'Bebas Neue',{align:'center'});
  box(80,890,920,155,t.ink);text('ONE MORE RECORD.',105,918,870,110,77,t.bg,'Bebas Neue');
  label('SAT 14 NOV / 2 AM — LATE',80,1110,920,t.ink,{size:30});label('YOUR SELECTORS / YOUR VENUE',80,1180,920,t.ink,{size:24});break;
 }
 case 11:{
  label('YOUR GALLERY / NEW WORK',48,35,980,t.ink,{size:24});head('FORM',43,105,980,255,233);text('in common',48,345,980,145,105,t.ink,'Cormorant Garamond',{italic:true});
  box(48,560,460,450,t.ink);circle(102,614,352,t.bg);box(556,560,475,220,t.accent);box(556,828,225,182,t.ink);circle(835,828,182,t.accent);
  label('A GROUP EXHIBITION',48,1070,984,t.ink,{size:31});text('Sculpture / print / new perspectives',48,1125,984,60,29);footer('OPENING FRI 13 NOV / 6–9 PM');break;
 }
 case 12:{
  label('LOCAL MUSIC / BIG FEELINGS',45,35,990,t.ink,{size:25});head('SIDE',40,95,990,250,230);head('STAGE',40,320,990,240,215);
  box(45,595,990,92,t.accent);label('ONE DAY / TWO ROOMS / EVERYONE IN',65,625,950,t.ink,{size:25});
  const rows=[['16:00','YOUR FIRST BAND'],['18:00','YOUR HEADLINER'],['20:00','YOUR LATE SET'],['22:00','YOUR SELECTORS']];
  rows.forEach(([time,name],i)=>{const y=733+i*99;line(45,y-17,990);text(time,45,y,200,65,42,t.accent,'Bebas Neue');text(name,280,y,755,65,47,t.ink,'Bebas Neue');});
  footer('SAT 21 NOV / YOUR INDEPENDENT VENUE','TICKETS: YOUR WEBSITE / ALL AGES');break;
 }
 case 13:{
  label('RHYTHM WITHOUT THE RULES',48,35,984,t.ink,{size:25});head('BREAK',40,110,1000,240,220);text('/',50,350,260,230,210,t.ink,'DM Sans');head('PATTERN',45,565,985,210,166);
  for(let i=0;i<9;i++)box(70+i*109,850,38,220,i%2?t.accent:t.ink,{rotation:18});
  box(48,1135,984,166,t.ink);label('BREAKS / JUNGLE / DRUM & BASS',70,1158,940,t.accent,{size:25});label('FRI 20 NOV / 10 PM / YOUR VENUE',70,1225,940,t.accent,{size:24});break;
 }
 case 14:{
  box(1120,0,480,900,t.accent);label('YOUR LABEL / COLLECTION 04',55,38,1050,t.ink,{size:28});
  head('FRESH',45,160,1050,270,243);head('DROP',45,405,1050,270,243);
  text('04',1170,170,365,235,205,t.ink,'Cormorant Garamond',{align:'center'});line(1170,470,365,t.ink,4);text('MADE\nTO BE\nWORN',1170,515,365,245,65,t.ink,'Bebas Neue',{align:'center'});
  label('AVAILABLE FRIDAY / YOURWEBSITE.COM',55,804,1040,t.ink,{size:28});break;
 }
 case 15:{
  text('“',25,20,430,400,365,t.accent,'Cormorant Garamond');label('THE INDEPENDENT CONVERSATION',55,45,960,t.ink,{size:23,align:'right'});
  head('BETTER',55,285,970,200,173);head('QUESTIONS',55,490,970,170,140);
  text('Different people.\nUnexpected answers.',55,714,850,115,44,t.ink,'Cormorant Garamond',{italic:true});
  circle(855,755,154,t.accent);text('08',873,780,118,102,78,t.bg,'Bebas Neue',{align:'center'});
  line(55,921,970);label('EPISODE 08 / YOUR GUEST / LISTEN NOW',55,957,970,t.ink,{size:25});break;
 }
 case 16:{
  for(const [x,y,s,c]of[[50,65,74,t.accent],[880,80,90,t.ink],[75,640,52,t.ink],[910,725,70,t.accent],[90,1065,88,t.accent],[900,1090,67,t.ink]])star(x,y,s,c);
  text('You are invited to',120,85,840,100,60,t.ink,'Caveat',{align:'center'});
  text('THE',120,270,840,125,110,t.ink,'Bebas Neue',{align:'center'});head('GOOD',80,430,920,230,205,t.ink,{align:'center'});head('NIGHT',80,655,920,230,205,t.ink,{align:'center'});
  text('with your favorite people',95,955,890,110,60,t.accent,'Caveat',{align:'center'});
  label('SAT 14 NOV / 7 PM / YOUR PLACE',80,1160,920,t.ink,{size:28,align:'center'});label('RSVP: YOUR CONTACT',80,1220,920,t.ink,{size:24,align:'center'});break;
 }
 case 17:{
  label('A PRACTICAL CREATIVE WORKSHOP',50,40,980,t.ink,{size:23});line(50,100,980,t.ink,3);
  text('Ways of',50,160,980,180,135,t.ink,'Cormorant Garamond');text('making',50,335,980,190,153,t.ink,'Cormorant Garamond',{italic:true});
  const steps=[['01','LOOK CLOSER'],['02','TRY SOMETHING'],['03','MAKE IT YOURS']];
  steps.forEach(([n,v],i)=>{const y=630+i*165;circle(50,y,110,t.accent);text(n,67,y+20,76,76,51,t.ink,'Bebas Neue',{align:'center'});text(v,215,y+22,815,87,62,t.ink,'Bebas Neue');line(215,y+125,815);});
  footer('SUN 22 NOV / 10 AM–2 PM','YOUR STUDIO / BOOK: YOUR WEBSITE');break;
 }
 case 18:{
  label('AFTER DARK / UNDER THE SURFACE',55,45,970,t.ink,{size:25});head('NIGHT',45,150,990,240,220);head('CURRENT',45,380,990,220,169);
  for(let i=0;i<16;i++){const y=750+i*50;for(let j=0;j<12;j++){const h=9+Math.sin(j*.64+i*.2)*4;box(60+j*81,y+Math.sin(j*.64+i*.2)*62,61,h,i%4===0?t.ink:t.accent);}}
  box(45,1630,990,232,t.ink);text('YOUR HEADLINER',70,1662,940,82,65,t.bg,'Bebas Neue');label('FRI 20 NOV / 23:00 — 06:00',70,1755,940,t.bg,{size:27});label('YOUR VENUE / TICKETS IN BIO',70,1806,940,t.bg,{size:23});break;
 }
 case 19:{
  for(let i=0;i<20;i++)box(i*80,0,40,900,'#e9d9ba');box(35,35,1530,830,t.bg);box(48,48,1504,804,t.ink);box(54,54,1492,792,t.bg);
  text('Meet me',90,115,910,210,171,t.ink,'Caveat');text('AT THE MARKET',100,350,930,140,116,t.ink,'Bebas Neue');
  ring(1110,220,295,10,t.accent);ring(1160,270,195,8,t.accent);box(1100,500,318,25,t.accent);oval(1407,295,63,110,t.accent);oval(1416,310,42,80,t.bg);
  text('Coffee. Fresh finds. Familiar faces.',100,557,1330,100,57,t.ink,'Cormorant Garamond',{italic:true});line(100,700,1390,t.accent,3);
  label('SUNDAY / 9 AM–2 PM / YOUR NEIGHBORHOOD',100,748,1390,t.ink,{size:29});break;
 }
 }
 return d;
}
