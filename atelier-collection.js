// Twenty-four original art-directed compositions. Every headline and shape is editable.
// The source photographs, transparent artwork, and open fonts have separate provenance.
const atelierDirections=['Portrait takeover','Chrome signal','Festival broadsheet','Taped editorial','After-dark photograph','Soul in script','Fashion masthead','Guest-list ephemera','Gallery archive','Artist dossier','Record culture','Cinematic campaign'];
const atelierRows=[
 ['AFTERIMAGE','Music & DJ','Bold',['atelier-dj-cutout'],'#e6e4df','#191916','#d93622','Portrait-led electronic music / Friday club session','dj electronic underground portrait techno'],
 ['CLOSER','Entertainment','Editorial',['atelier-singer-cutout'],'#efced1','#551824','#fff1df','A voice. A room. An intimate live session.','soul singer acoustic concert live performance'],
 ['LIQUID SIGNAL','Music & DJ','Neon',['atelier-chrome'],'#101014','#e4ff54','#ad87fa','A new frequency for late-night people','rave acid techno warehouse chrome underground'],
 ['CHROME HOURS','Music & DJ','Neon',['atelier-chrome','atelier-rave'],'#191328','#e5d9ff','#eb5d18','Leftfield sounds / open minds / all night','electronic house techno chrome club night'],
 ['NOISE IN PRINT','Entertainment','Editorial',['atelier-paper','wave-garage-band'],'#ede8d9','#171713','#dc3826','Independent bands. Unfiltered sound.','festival rock punk gig grunge newspaper'],
 ['LOCAL FREQUENCY','Music & DJ','Bold',['atelier-paper','dj-vinyl'],'#f0e9d8','#172023','#2562a5','An independent music and record gathering','vinyl record fair local independent festival'],
 ['SOFT FOCUS','Photography','Classic',['beauty-editorial','atelier-paper'],'#52252b','#fff0de','#bdadb0','Portraits from an unfinished summer','photography art portrait editorial gallery'],
 ['PRIVATE VIEW','Fashion','Editorial',['fashion','studio-portrait'],'#e3e8e4','#183d37','#db532c','A collection of personal perspectives','fashion exhibition editorial portrait launch'],
 ['HOUR OF BLUE','Music & DJ','Neon',['atelier-rave'],'#080f22','#faf7ec','#96b5ff','The city sleeps. The room comes alive.','rave techno dance underground club party'],
 ['ROOM FOR EVERYONE','Entertainment','Bold',['wave-disco-friends'],'#182826','#fff3d5','#f4a8c9','Good records. Good people. Good night.','disco dance friends social party nightlife'],
 ['Golden hour','Entertainment','Classic',['atelier-singer-cutout'],'#693a26','#ffecd2','#eaa44d','Soul music in the last light of the day','soul live singer concert rooftop acoustic'],
 ['The soul side','Entertainment','Retro',['wave-jazz-trio'],'#eee4cd','#204638','#bb452d','A listening-room special / live jazz and soul','jazz live trio listening bar concert soul'],
 ['NOWHERE ELSE','Fashion','Bold',['atelier-fashion-cutout'],'#e6ebd8','#16349e','#d94b29','Independent style / a new street edition','fashion streetwear clothing launch creative'],
 ['FORM / FUNCTION','Fashion','Minimal',['atelier-fashion-cutout','creator-street'],'#e7e4df','#161616','#d74523','The everyday collection, reconsidered','fashion creative streetwear collection designer'],
 ['YOU ARE ON THE LIST','Music & DJ','Playful',['night-friends'],'#eaa6bc','#4d1738','#fff0cf','Your invitation to a very good night','party guest list birthday invitation social'],
 ['ONE LAST DANCE','Music & DJ','Retro',['dj-disco'],'#e9edb8','#253321','#e15e30','The closing party / one more for the road','disco dance vinyl closing party invitation'],
 ['FLUID FORMS','Photography','Minimal',['atelier-chrome'],'#e9e8e4','#191c1e','#244ba1','An exhibition of shape, light, and motion','art exhibition gallery sculpture modern design'],
 ['NEW PERSPECTIVES','Photography','Editorial',['studio-botanical','beauty-editorial'],'#e2dcd3','#2d382b','#af503b','A contemporary photography exhibition','art gallery photography exhibition botanical portrait'],
 ['COLOR HAS A SOUND','Entertainment','Bold',['wave-dancer-motion'],'#f26929','#21172d','#f5df66','An interdisciplinary night of movement and music','dance movement culture music creative performance'],
 ['MATTER IN MOTION','Marketing','Editorial',['atelier-fashion-cutout'],'#d9e5fb','#1b328b','#f44234','A creative industry conversation','creative marketing talk design conference workshop'],
 ['HEAVY ROTATION','Music & DJ','Retro',['dj-vinyl'],'#d73b2d','#fff1d3','#182c35','Deep cuts / warm grooves / all vinyl','vinyl disco record listening dj selectors'],
 ['THE B SIDE','Music & DJ','Classic',['vinyl'],'#f0c26d','#272035','#f8ead3','A record-listening social for curious ears','vinyl jazz soul record listening bar social'],
 ['A LOUDER CITY','Music & DJ','Bold',['city-chicago','atelier-dj-cutout'],'#e5e1d5','#151922','#f2ff45','Independent sounds in unexpected places','city dj festival outdoor culture campaign chicago'],
 ['ECHOES OF SUMMER','Travel','Classic',['wave-desert-stage','studio-friends'],'#1b3334','#f5e9cf','#ed864d','One weekend. Stories for the whole year.','summer festival outdoor travel friends campaign']
];
const atelierTemplates=atelierRows.map(([title,topic,style,assetIds,bg,ink,accent,sub,tags],i)=>{
 const layout=Math.floor(i/2),variant=i%2,width=layout===11?1600:1080,height=layout===11?900:layout===10?1080:1350;
 const hasPeople=assetIds.some(id=>!['atelier-chrome','atelier-paper','studio-botanical','vinyl','city-chicago','wave-desert-stage'].includes(id));
 return{id:'atelier-'+String(i+1).padStart(2,'0'),name:title,title,topic,style,assetIds,asset:assetIds.find(id=>id!=='atelier-paper')||assetIds[0],bg,ink,accent,sub,tags:tags+' flyer poster social media original atelier studio '+atelierDirections[layout],layout,variant,layoutName:atelierDirections[layout],collection:'atelier',width,height,format:layout===11?'cover':layout===10?'square':'post',category:layout===11?'Social':layout===10?'Social':'Poster',aiImagery:true,hasPeople,imagery:hasPeople?'People':assetIds.includes('atelier-chrome')?'Art & textures':'Equipment'};
});
function makeAtelierDesign(t,assets){
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements;
 const r=(x,y,w,h,c=t.ink,kind='rect',extra={})=>a.push(shape(x,y,w,h,c,kind,extra));
 const tx=(text,x,y,w,h,size,c=t.ink,font='DM Sans',extra={})=>a.push(txt(text,x,y,w,size,c,{h,font,weight:'400',lineHeight:1,tracking:0,...extra}));
 const small=(text,x,y,w,c=t.ink,extra={})=>tx(text,x,y,w,72,25,c,'DM Sans',{weight:'700',lineHeight:1.15,...extra});
 const cap=(text,x,y,w,h,size,c=t.ink,extra={})=>tx(text,x,y,w,h,size,c,'Anton',extra);
 const photo=(id,x,y,w,h,extra={})=>a.push(base('image',x,y,w,h,{src:assets[id],photoCrop:{zoom:1,x:.5,y:.5},altText:'Original generated artwork: '+id+'. Fictional people and scenes. See artwork credits for source details.',...extra}));
 const cut=(id,x,y,s,extra={})=>photo(id,x,y,s,s,{photoCrop:{zoom:1,x:.5,y:.5},...extra});
 const rule=(x,y,w,c=t.ink,thickness=2)=>r(x,y,w,thickness,c);
 const paper=(opacity=.18)=>photo('atelier-paper',0,0,d.width,d.height,{opacity});
 const barcode=(x,y,w,h,c=t.ink)=>{let offset=0,i=0;while(offset<w-5){const bw=[3,7,2,4,2,6,3][i%7];r(x+offset,y,bw,h,c);offset+=bw+[3,2,5,2,4][i%5];i++;}};
 const cross=(x,y,s,c=t.ink)=>{r(x+s*.45,y,s*.1,s,c);r(x,y+s*.45,s,s*.1,c);};
 const star=(x,y,s,c=t.accent)=>r(x,y,s,s,c,'star');
 const tape=(x,y,w,angle=0)=>r(x,y,w,42,'#f0dcb9','rect',{opacity:.8,rotation:angle});
 const footer=(text='FRIDAY / DOORS 9 PM / YOUR VENUE',color=t.ink,y=1260)=>{rule(50,y-22,980,color);small(text,50,y,980,color,{h:54});};
 switch(t.layout){
 case 0:
  if(!t.variant){
   small('OPEN CIRCUIT PRESENTS',48,38,700);small('001 / CLUB SERIES',750,38,280,t.ink,{align:'right'});
   cap('AFTER',38,110,1000,280,260);cap('IMAGE',38,350,1000,300,260);
   r(40,700,1000,480,t.accent);cut('atelier-dj-cutout',220,360,800);
   tx('A NEW\nPERSPECTIVE\nON NIGHTLIFE.',65,770,250,180,38,'#fff3de','Bebas Neue');
   small('FRI\n14.11',845,880,160,'#fff3de',{size:48,h:130,align:'right'});
   cap('YOUR ARTIST',52,1170,800,70,64);small('21:00 — LATE',770,1187,260,t.ink,{align:'right'});footer('HOUSE / LEFTFIELD / OPEN MINDS');
  }else{
   r(37,38,1006,1268,t.ink);r(49,50,982,1244,t.bg);
   tx('closer',76,100,930,300,260,t.ink,'Cormorant Garamond',{italic:true,tracking:-.03});
   small('AN INTIMATE LIVE SESSION',82,380,850,t.ink,{tracking:.15});
   r(90,525,900,660,t.accent,'ellipse');cut('atelier-singer-cutout',170,395,850);
   tx('A voice.\nA room.\nA feeling.',80,725,285,200,53,t.ink,'Cormorant Garamond',{italic:true,lineHeight:1.05});
   r(65,1165,950,110,t.bg);small('YOUR ARTIST & SPECIAL GUESTS',80,1180,920,t.ink,{h:45});small('SATURDAY / 7 PM / YOUR VENUE',80,1230,920,t.ink,{h:50});
  }break;
 case 1:
  if(!t.variant){
   small('TRANSMISSION 003',42,35,700);small('NO SIGNAL LOST',750,35,288,t.ink,{align:'right'});
   cap('LIQUID',30,130,1020,250,244);cap('SIGNAL',30,350,1020,270,242,t.ink,{textEffect:'hollow',effectColor:t.ink,effectAmount:1.5});
   cut('atelier-chrome',220,390,790);r(42,660,230,230,t.ink);cap('03',55,674,206,160,155,t.bg);small('ALL NIGHT',58,851,200,t.bg,{h:40,size:22});
   tx('ENTER\nTHE NEW\nFREQUENCY',51,980,440,182,50,t.ink,'Bebas Neue');small('YOUR SELECTORS\nYOUR CREW\nYOUR VENUE',690,1030,340,t.ink,{h:140,align:'right'});
   barcode(50,1240,230,60);small('FRIDAY / 22:00 — 05:00',420,1250,610,t.ink,{h:44,align:'right'});
  }else{
   photo('atelier-rave',0,0,1080,1350);r(0,0,1080,1350,t.bg,'rect',{opacity:.72});
   for(let i=0;i<14;i++)rule(40,110+i*81,1000,t.accent,1);
   small('OPEN ALL NIGHT / CLOSED TO THE ORDINARY',45,40,990,t.ink);
   cap('CHROME',45,170,990,230,205);cut('atelier-chrome',100,330,880);
   cap('HOURS',48,950,990,230,217,t.ink);r(40,1215,1000,90,t.accent);small('YOUR LINEUP  /  SAT 15.11  /  10 PM',65,1242,950,'#16111c',{h:50});
  }break;
 case 2:
  paper(.55);
  if(!t.variant){
   small('THE INDEPENDENT MUSIC PAPER',38,30,680);small('VOL. 01 / FREE TO FEEL',730,30,310,t.ink,{align:'right'});rule(38,92,1004,t.ink,4);
   cap('NOISE',35,120,1010,265,255);cap('IN PRINT',35,355,1010,200,184);
   photo('wave-garage-band',40,590,620,480);r(40,590,620,480,'#eee7d8','rect',{opacity:.2});
   small('ONE NIGHT.\nNO FILTER.',700,596,310,t.accent,{size:35,h:115});
   tx('YOUR BAND\nTHE OPENERS\nLOCAL STATIC\nGUEST SELECTORS',700,760,320,220,46,t.ink,'Bebas Neue',{lineHeight:1.1});
   r(40,1110,1000,90,t.ink);cap('LIVE / LOUD / LOCAL',60,1125,960,70,57,t.bg);footer('SATURDAY / 7 PM / YOUR INDEPENDENT VENUE');
  }else{
   r(0,0,1080,100,t.ink);small('A RECORD FAIR & INDEPENDENT MUSIC GATHERING',40,34,1000,t.bg,{h:45});
   cap('LOCAL',37,130,650,240,218);cap('FREQ.',37,340,650,240,218);r(744,135,288,420,t.accent);tx('33',785,205,205,145,112,'#f8eed7','Cormorant Garamond',{align:'center'});small('RPM',790,385,200,'#f8eed7',{size:37,align:'center'});
   rule(40,610,990,t.ink,4);photo('dj-vinyl',510,650,520,490);tx('BUY\nSELL\nLISTEN\nREPEAT',40,660,420,340,70,t.ink,'Bebas Neue',{lineHeight:1.02});
   small('DEEP CUTS.\nNEW CONNECTIONS.',40,1045,430,t.accent,{h:100,size:33});barcode(48,1195,190,80);small('SUNDAY / 12–6 PM\nYOUR LOCAL RECORD SHOP',340,1215,680,t.ink,{h:85,align:'right'});
  }break;
 case 3:
  if(!t.variant){
   paper(.12);small('STUDIES IN LIGHT / AN OPEN STUDIO',55,40,970,t.ink,{tracking:.1});
   tx('Soft',70,110,900,180,170,t.ink,'Cormorant Garamond',{italic:true});tx('focus',490,240,540,175,155,t.ink,'Cormorant Garamond',{italic:true});
   r(176,400,728,688,'#f1e8d9','rect',{rotation:-3});photo('beauty-editorial',199,418,680,630,{rotation:-3});
   tape(145,407,260,-9);tape(727,1018,250,-8);tx('Portraits from an\nunfinished summer.',70,1120,580,100,39,t.ink,'Cormorant Garamond',{italic:true});small('01—30\nNOVEMBER',760,1150,260,t.ink,{h:95,align:'right'});small('YOUR GALLERY / FREE ENTRY',70,1270,940,t.ink,{h:42});
  }else{
   small('PRIVATE VIEW / EDITION 04',45,40,900);rule(45,98,990);
   photo('fashion',50,180,560,740);photo('studio-portrait',560,565,470,600);r(610,180,420,320,t.accent);
   cap('PERSONAL',68,1020,945,140,118);tx('perspectives',82,1150,935,125,105,t.ink,'Caveat');
   tx('04',670,190,305,170,158,'#fff0dc','Cormorant Garamond');small('THE NEW\nCOLLECTION',650,387,335,'#fff0dc',{h:90,size:30});
   tape(88,152,230,-4);tape(754,1140,220,5);small('FRIDAY / 6 PM / YOUR STUDIO',45,1293,990,t.ink,{h:42,size:23});
  }break;
 case 4:
  if(!t.variant){
   photo('atelier-rave',0,0,1080,1350);r(0,0,1080,480,'#071020','rect',{opacity:.68});r(0,1060,1080,290,'#071020','rect',{opacity:.85});
   small('THE AFTER-DARK SOCIAL CLUB',45,40,990,t.ink,{tracking:.16});cap('HOUR',40,125,1000,255,237);tx('of blue',480,310,550,150,130,t.accent,'Caveat');
   tx('MAKE ROOM\nFOR THE NIGHT.',50,720,610,185,77,t.ink,'Bebas Neue');cross(925,840,100,t.accent);
   small('YOUR ARTIST  /  YOUR SELECTORS\nSATURDAY  /  22:00 UNTIL LATE',50,1120,980,t.ink,{h:110,size:34});rule(50,1260,980,t.accent);small('YOUR VENUE / YOUR CITY',50,1280,980,t.ink,{h:40,size:22});
  }else{
   photo('wave-disco-friends',0,0,1080,1350);r(0,0,1080,1350,'#192824','rect',{opacity:.35});
   r(42,47,996,200,t.accent);cap('ROOM FOR',65,72,950,155,143,'#2b1620');
   cap('EVERYONE',45,960,990,185,161,t.ink,{textEffect:'shadow',effectColor:'#203328',effectAmount:4});
   small('GOOD RECORDS.\nGOOD PEOPLE.',60,300,430,t.ink,{h:130,size:36});r(690,1160,335,135,t.accent);small('FRIDAY\n9 PM — LATE',715,1183,285,'#2b1620',{h:95,size:29});small('DISCO / HOUSE / BOOGIE\nYOUR VENUE',55,1190,590,t.ink,{h:95,size:29});
  }break;
 case 5:
  if(!t.variant){
   r(53,50,974,1250,'#e0a84c','ellipse');r(73,70,934,1210,t.bg,'ellipse');
   tx('Golden',63,105,955,210,190,t.ink,'Caveat',{align:'center'});cap('HOUR',100,300,880,235,210,t.accent,{align:'center'});
   cut('atelier-singer-cutout',220,460,800);tx('Soul in the\nlast light.',60,690,320,180,52,t.ink,'Cormorant Garamond',{italic:true});
   r(80,1120,920,170,t.bg);small('YOUR ARTIST / LIVE IN CONCERT',100,1150,880,t.ink,{h:70,size:32,align:'center'});small('SUNDAY / 6 PM / YOUR ROOFTOP',105,1232,870,t.ink,{h:50,align:'center'});
  }else{
   tx('The',65,50,300,110,98,t.ink,'Caveat');tx('soul side',54,150,980,210,180,t.ink,'Caveat');
   r(50,385,980,615,t.ink);photo('wave-jazz-trio',76,411,928,560);star(850,330,145,t.accent);tx('Live',750,1010,280,100,85,t.accent,'Caveat');
   cap('YOUR JAZZ TRIO',50,1060,980,120,90);small('A LISTENING-ROOM SPECIAL',50,1205,980,t.ink,{h:45,tracking:.12});small('THURSDAY / 8 PM / YOUR VENUE',50,1274,980,t.ink,{h:42});
  }break;
 case 6:
  if(!t.variant){
   small('THE INDEPENDENT STYLE EDITION',40,35,980,t.ink,{tracking:.12});cap('NOWHERE',28,120,1030,250,225);cap('ELSE',27,360,1030,300,280);
   r(35,737,1007,480,t.accent);cut('atelier-fashion-cutout',155,400,870);
   tx('Wear it\nyour way.',55,825,350,180,67,'#fff3da','Cormorant Garamond',{italic:true});small('DROP\nNO. 01',842,1000,160,'#fff3da',{h:130,size:40,align:'right'});small('YOUR BRAND / NEW COLLECTION / AVAILABLE NOW',40,1273,1000,t.ink,{h:45});
  }else{
   r(32,32,1016,1286,t.ink);r(45,45,990,1260,t.bg);cap('FORM',65,100,950,270,240);tx('/ FUNCTION',65,390,950,110,85,t.accent,'DM Sans',{weight:'700',tracking:-.02});
   photo('creator-street',70,610,350,520);cut('atelier-fashion-cutout',310,490,710);
   small('EVERYDAY OBJECTS.\nUNEXPECTED ATTITUDE.',65,520,470,t.ink,{h:80,size:28});rule(65,1170,950);small('YOUR BRAND\nTHE EVERYDAY COLLECTION',65,1210,690,t.ink,{h:85});small('EST.\n2026',845,1210,165,t.ink,{h:85,align:'right'});
  }break;
 case 7:
  if(!t.variant){
   r(75,40,930,1270,t.accent);for(let y=44;y<1290;y+=26){r(61,y,27,16,t.bg);r(992,y,27,16,t.bg);}
   small('THE GOOD NIGHT DEPARTMENT',120,82,840,t.ink,{align:'center'});rule(120,160,840);tx('GUEST CHECK',120,190,840,110,82,t.ink,'Bebas Neue',{align:'center'});small('TABLE 01     DATE: YOUR DATE     PARTY: EVERYONE',125,310,830,t.ink,{size:19,h:42});
   photo('night-friends',122,420,836,460,{photoCrop:{zoom:1,x:.5,y:.08}});rule(120,370,840,t.ink,1);for(let y=940;y<=1130;y+=95)rule(120,y,840,t.ink,1);
   tx('You are\non the list.',145,895,810,220,104,t.ink,'Caveat',{rotation:-4,align:'center'});small('BRING YOUR PEOPLE / WE WILL BRING THE MUSIC',120,1170,840,t.ink,{h:65,size:24,align:'center'});barcode(280,1255,520,42);
  }else{
   r(43,44,994,1262,t.ink);r(57,58,966,1234,t.bg);cap('ONE LAST',85,105,910,210,184);tx('dance',150,295,780,220,200,t.accent,'Caveat',{align:'center'});
   photo('dj-disco',85,560,650,580);r(770,560,220,580,t.ink);tx('ADMIT\nONE\nMORE',798,610,165,250,54,t.bg,'Bebas Neue',{align:'center'});small('NO.\n0001',802,1000,160,t.bg,{h:100,size:38,align:'center'});
   for(let x=90;x<995;x+=30)r(x,1188,12,3,t.ink);small('THE CLOSING PARTY / SATURDAY / 10 PM',85,1230,910,t.ink,{h:50,size:26});
  }break;
 case 8:
  if(!t.variant){
   for(let x=40;x<=1040;x+=250)r(x,40,1,1270,'#a8aaa4');for(let y=40;y<=1300;y+=210)rule(40,y,1000,'#a8aaa4',1);
   small('A CONTEMPORARY EXHIBITION',65,65,950,t.ink,{tracking:.1});cap('FLUID',65,160,950,240,217);cap('FORMS',65,375,950,240,217);
   cut('atelier-chrome',275,475,740);tx('SHAPE\nLIGHT\nMOTION',70,755,320,190,56,t.accent,'Bebas Neue');
   r(40,1180,1000,130,t.bg);small('20—23\nNOVEMBER',65,1200,350,t.ink,{h:105,size:33});small('YOUR GALLERY\n11 AM — 8 PM / FREE ENTRY',510,1220,505,t.ink,{h:85,size:25,align:'right'});
  }else{
   small('YOUR GALLERY / ISSUE 002',45,35,990);tx('New',45,130,800,200,174,t.ink,'Cormorant Garamond');tx('perspectives',45,310,995,170,126,t.ink,'Cormorant Garamond',{italic:true,tracking:-.03});
   photo('studio-botanical',45,550,430,600);photo('beauty-editorial',590,490,445,580);r(500,750,58,58,t.accent,'ellipse');
   tx('Looking closer\nchanges everything.',590,1112,440,95,35,t.ink,'Cormorant Garamond',{italic:true});rule(45,1223,990);small('A PHOTOGRAPHY EXHIBITION',45,1255,640,t.ink,{h:50});small('01 / 30 NOV',760,1255,275,t.ink,{h:50,align:'right'});
  }break;
 case 9:
  if(!t.variant){
   small('INTERDISCIPLINARY / INDEPENDENT / IN PERSON',40,35,1000,t.ink,{size:22});cap('COLOR HAS',35,130,1010,200,176);cap('A SOUND',35,330,1010,200,190);
   photo('wave-dancer-motion',350,560,690,690);r(40,560,260,610,t.ink);tx('MOVE\nTO\nYOUR\nOWN\nRHYTHM',62,590,220,480,72,t.accent,'Bebas Neue',{lineHeight:1.1});
   r(510,1125,500,100,t.accent);small('DANCE / LIVE MUSIC / NEW WORK',530,1155,460,t.ink,{size:24,h:60});small('YOUR CULTURE SPACE / FRIDAY / 7 PM',40,1285,1000,t.ink,{size:25,h:45});
  }else{
   cap('MATTER',38,87,1000,230,215);cap('IN MOTION',40,310,1000,180,160);rule(45,535,990,t.ink,5);
   tx('A CREATIVE\nINDUSTRY\nCONVERSATION',45,580,475,200,58,t.ink,'Bebas Neue');cut('atelier-fashion-cutout',325,510,710);
   r(50,860,360,290,t.accent);small('IDEAS\nBECOME\nREAL HERE.',73,905,315,'#fff0df',{size:43,h:180});small('YOUR SPEAKERS\nYOUR STUDIO / YOUR CITY',540,1180,490,t.ink,{h:85,align:'right'});barcode(45,1245,320,55);
  }break;
 case 10:
  if(!t.variant){
   cap('HEAVY',35,55,1010,200,190);cap('ROTATION',35,245,1010,190,173);
   r(45,470,550,550,t.accent,'ellipse');for(let k=0;k<7;k++){const s=510-k*48;r(65+k*24,490+k*24,s,s,k%2?t.accent:t.ink,'ellipse');}r(260,685,120,120,t.bg,'ellipse');r(308,733,24,24,t.ink,'ellipse');
   photo('dj-vinyl',635,470,400,400);tx('DEEP CUTS\nWARM GROOVES\nALL VINYL',635,900,400,125,38,t.ink,'Bebas Neue');small('FRIDAY / 8 PM / YOUR LISTENING BAR',45,1014,550,t.ink,{h:42,size:18});
  }else{
   photo('vinyl',0,0,1080,1080);r(0,0,1080,1080,'#252033','rect',{opacity:.58});r(35,35,1010,1010,t.bg,'rect',{opacity:.9});
   tx('The',70,65,890,110,95,t.ink,'Caveat');cap('B SIDE',70,195,940,300,280);
   r(75,540,390,390,t.ink,'ellipse');r(220,685,100,100,t.accent,'ellipse');r(258,723,24,24,t.bg,'ellipse');tx('A record\nlistening\nsocial.',570,555,440,245,68,t.ink,'Cormorant Garamond',{italic:true});
   small('CURIOUS EARS WELCOME.',570,870,430,t.ink,{h:60,size:29});rule(70,975,940);small('SUNDAY / 4 PM / YOUR RECORD ROOM',70,1002,940,t.ink,{h:45,size:24});
  }break;
 case 11:
  if(!t.variant){
   photo('city-chicago',660,0,940,900);r(660,0,940,900,'#20262b','rect',{opacity:.3});r(0,0,740,900,t.bg);
   small('OPEN CANVAS CULTURE SERIES / YOUR CITY',40,35,700,t.ink,{size:23});cap('A LOUDER',36,140,890,230,202);cap('CITY',36,350,900,325,295);
   cut('atelier-dj-cutout',835,175,700);r(40,708,650,140,t.accent);small('INDEPENDENT SOUNDS\nIN UNEXPECTED PLACES',65,735,600,t.ink,{h:90,size:31});small('YOUR ARTIST / SATURDAY / YOUR VENUE',875,825,680,'#fff4dc',{h:45,size:25,align:'right'});
  }else{
   photo('wave-desert-stage',0,0,1600,900);r(0,0,1600,900,t.bg,'rect',{opacity:.48});
   tx('Echoes',55,70,1150,220,200,t.ink,'Cormorant Garamond',{italic:true});tx('of summer',320,275,1200,230,200,t.ink,'Cormorant Garamond',{italic:true});
   r(55,585,360,260,t.ink);photo('studio-friends',69,599,332,232);small('ONE WEEKEND.\nSTORIES FOR THE\nWHOLE YEAR.',485,640,580,t.ink,{h:155,size:39});star(1370,605,145,t.accent);small('YOUR FESTIVAL\n20—22 JUNE / YOUR LOCATION',1100,780,450,t.ink,{h:90,size:27,align:'right'});
  }break;
 }
 return d;
}
