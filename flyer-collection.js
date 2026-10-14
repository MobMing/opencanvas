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
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements,accentInk=flyerAccentInk(t);
 const r=(x,y,w,h,c=t.ink,kind='rect',extra={})=>a.push(shape(x,y,w,h,c,kind,extra));
 const tx=(text,x,y,w,h,size,c=t.ink,font='Arial',extra={})=>a.push(txt(text,x,y,w,size,c,{h,font,weight:font==='Georgia'?'400':'700',...extra}));
 const title=(x,y,w,h,size,font='Impact',c=t.ink)=>tx(t.title,x,y,w,h,size,c,font);
 const photo=(i,x,y,s)=>a.push(base('image',x,y,s,s,{src:assets[t.assetIds[i]],altText:'Original AI-generated fictional scene: '+t.assetIds[i]+'. No real person, performer or event is represented. Source details: assets/people/PROVENANCE.json.'}));
 const detail=(x,y,w,h=65,size=27,c=t.ink)=>tx(t.detail,x,y,w,h,size,c);
 const rules=(y,w=960,x=60,c=t.ink)=>r(x,y,w,4,c);
 const record=(x,y,s)=>{r(x,y,s,s,t.ink,'ellipse');for(let n=1;n<=6;n++){const inset=n*s*.055;r(x+inset,y+inset,s-inset*2,s-inset*2,n%2?t.accent:t.ink,'ellipse');}r(x+s*.45,y+s*.45,s*.1,s*.1,t.bg,'ellipse');};
 switch(t.layout){
 case 0:
  tx('INDEPENDENT SOUNDS / SHARED SPACE',60,45,960,45,26);title(60,130,960,270,115);photo(0,60,450,450);photo(1,570,600,450);r(570,450,450,100,t.accent);tx('BACK TO BACK',595,470,400,65,37,accentInk);tx('01 / 02',60,960,450,65,56,t.ink,'Georgia');rules(1105);tx(t.sub,60,1150,960,75,31);detail(60,1250,960);break;
 case 1:
  tx('THE LISTENING DEPARTMENT',45,35,990,45,23);title(45,115,630,240,100);tx('33\nRPM',790,135,240,190,72,t.ink,'Georgia');record(560,450,460);photo(0,45,400,480);r(45,920,990,5);tx(t.sub,45,945,990,45,28);detail(45,1010,990,45,23);break;
 case 2:
  title(60,55,960,240,105,'Georgia');tx(t.sub,60,325,960,70,28);photo(0,60,460,300);photo(1,390,560,300);photo(2,720,660,300);tx('01',60,790,300,60,42);tx('02',390,890,300,60,42);tx('03',720,990,300,60,42);r(60,1080,960,95,t.accent);tx('A LITTLE MORE LIFE IN YOUR WEEKEND',85,1095,910,65,32,accentInk);detail(60,1240,960);break;
 case 3:
  tx('THE PROGRAM / SAVE THE DATE',55,45,970,45,24);title(55,130,970,275,120);r(55,450,970,120,t.accent);tx(t.sub,80,475,920,80,31,accentInk);for(const [i,time,label]of[[0,'21:00','THE WARM-UP'],[1,'23:00','THE MAIN ROOM'],[2,'01:00','THE LATE SESSION']]){const y=630+i*165;tx(time,60,y,270,95,64,t.ink,'Georgia');tx(label,370,y+10,640,80,46);rules(y+115);}detail(60,1200,960,95,32);break;
 case 4:
  r(0,0,660,900,t.ink);tx(t.sub,55,45,550,100,24,t.bg);title(55,230,550,360,102,'Georgia',t.bg);detail(55,710,550,100,25,t.bg);photo(0,730,65,300);photo(1,1065,400,300);r(730,405,285,295,t.accent);tx('GOOD\nTHINGS\nHAPPEN\nHERE',755,435,235,235,42,accentInk);tx('MEET YOU THERE',730,770,635,70,40);break;
 case 5:
  r(40,40,1000,1270,t.ink);r(60,60,960,1230,t.bg);title(100,105,880,220,100);photo(0,100,390,650);r(800,390,180,650,t.accent);tx('YOUR\nNAME\nHERE',820,450,140,220,36,accentInk);tx('001',820,880,140,90,55,accentInk,'Georgia');for(let i=0;i<18;i++)r(100+i*50,1090,20,5);tx(t.sub,100,1140,880,60,28);detail(100,1230,880,45,23);break;
 case 6:
  tx('A STORY IN THREE FRAMES',60,45,960,50,27);title(60,145,960,300,125);photo(0,60,540,450);photo(1,570,880,450);photo(2,60,1220,450);tx('01 / BEGIN',570,585,450,90,42);tx('02 / EXPLORE',60,1040,450,90,42);tx('03 / CONNECT',570,1450,450,90,42);r(60,1720,960,140,t.accent);detail(85,1760,910,65,32,accentInk);break;
 case 7:
  r(50,50,980,980,t.ink);r(75,75,930,930,t.bg);tx(t.sub,110,110,860,90,26);for(const [x,y,s]of[[120,260,290],[670,260,290],[395,430,290]]){r(x,y,s,s,t.accent,'ellipse');r(x+36,y+36,s-72,s-72,t.bg,'ellipse');r(x+s*.42,y+s*.42,s*.16,s*.16,t.ink,'ellipse');}r(110,720,860,210,t.bg);title(110,720,860,195,79);detail(110,950,860,40,22);break;
 case 8:
  tx('THE INTIMATE SERIES / LIVE MUSIC',60,45,960,45,25);rules(115);title(60,165,960,240,108,'Georgia');photo(0,60,475,660);tx('LISTEN\nA LITTLE\nCLOSER',780,500,240,250,44,t.ink,'Georgia');r(780,865,240,240,t.accent,'ellipse');tx('LIVE',800,945,200,70,44,accentInk);detail(60,1230,960);break;
 case 9:
  title(60,50,960,230,108);photo(0,60,335,600);photo(1,720,635,300);r(720,335,300,230,t.accent);tx('THE\nLOCAL\nSCENE',745,360,250,175,47,accentInk);tx('CULTURE IS\nBETTER SHARED.',60,990,960,100,44,t.ink,'Georgia');rules(1150);detail(60,1240,960);break;
 case 10:
  tx('YOUR WEEKEND, REIMAGINED',60,45,960,45,25);title(60,130,960,260,116);r(35,405,935,8);r(35,405,8,799);r(35,1196,935,8);r(35,530,25,8);r(35,1080,25,8);for(const [x,y,n,label]of[[60,430,'01','DISCOVER'],[660,670,'02','CONNECT'],[60,980,'03','CELEBRATE']]){r(x,y,200,200,t.accent,'ellipse');tx(n,x+40,y+55,120,95,67,accentInk,'Georgia');tx(label,x===60?300:150,y+65,430,80,48);}detail(60,1240,960);break;
 case 11:
  tx(t.sub,55,35,1330,50,26);photo(0,55,150,450);photo(1,550,350,450);title(1040,155,345,420,74,'Georgia');r(550,150,450,140,t.accent);tx('THE WEEKEND EDIT',575,185,400,65,35,accentInk);tx('GO SOMEWHERE.\nFEEL SOMETHING.',55,650,450,115,35);detail(1040,700,345,135,25);break;
 }
 return d;
}
