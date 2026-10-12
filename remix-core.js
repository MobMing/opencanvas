// Original geometry drawn for OpenCanvas. Reference boards are inspiration only.
const remixSymbols=[
 ['spark','Festival spark','star sparkle festival'],['rays','Sun rays','sun retro burst'],['orbit','Orbital rings','space acid rave planet'],['record','Record badge','vinyl music dj disc'],
 ['checker','Checkerboard','checker grid racing ska'],['dots','Halftone dots','halftone texture print'],['levels','Sound levels','audio music equalizer bars'],['arrow','Direction arrow','arrow direction launch'],
 ['flower','Petal flower','flower floral spring beauty'],['target','Concentric target','circle rings techno'],['steps','Pixel steps','pixel stairs gaming'],['cross','Bold cross','plus geometric swiss'],
 ['asterisk','Asterisk','asterisk editorial star'],['diamonds','Diamond trio','diamond geometric luxury'],['cloud','Soft cloud','cloud wellness dreamy'],['wave','Wave dots','wave sound water'],
 ['frame','Corner marks','frame photo camera crop'],['ticket','Ticket stub','ticket event admission'],['cassette','Cassette tape','cassette retro music'],['speaker','Speaker stack','speaker sound system rave'],
 ['moon','Crescent moon','moon night celestial'],['petals','Leaf sprig','leaf organic eco market'],['windows','Window grid','grid architecture gallery'],['confetti','Confetti','party celebration shapes']
];
function remixSymbol(id,x,y,size,ink,accent,bg){
 const out=[],s=(xx,yy,w,h,color=ink,kind='rect',rotation=0)=>out.push(shape(x+xx*size,y+yy*size,w*size,h*size,color,kind,{rotation}));
 const circle=(xx,yy,w,color=ink)=>s(xx,yy,w,w,color,'ellipse');
 switch(id){
  case 'spark':s(.08,.08,.84,.84,ink,'star');s(.30,.30,.4,.4,accent,'star');break;
  case 'rays':for(let i=0;i<12;i++){let a=i*Math.PI/6;s(.46+Math.cos(a)*.31,.34+Math.sin(a)*.31,.08,.26,i%2?ink:accent,'rect',i*30+90);}circle(.32,.32,.36,bg);break;
  case 'orbit':for(let i=0;i<3;i++)s(.10,.31,.8,.38,ink,'ellipse',i*60);for(let i=0;i<3;i++)s(.15,.35,.7,.30,bg,'ellipse',i*60);circle(.40,.40,.20,accent);break;
  case 'record':circle(.05,.05,.90);circle(.12,.12,.76,accent);circle(.145,.145,.71);circle(.31,.31,.38,accent);circle(.455,.455,.09,bg);break;
  case 'checker':for(let r=0;r<6;r++)for(let c=0;c<6;c++)if((r+c)%2===0)s(.05+c*.15,.05+r*.15,.15,.15);break;
  case 'dots':for(let r=0;r<6;r++)for(let c=0;c<6;c++){let z=.035+(r+c)*.008;circle(.075+c*.145,.075+r*.145,z,(r+c)%3?ink:accent);}break;
  case 'levels':for(let i=0;i<8;i++){let z=[.35,.60,.8,.45,.68,.90,.52,.26][i];s(.055+i*.115,.95-z,.075,z,i%3?ink:accent);}break;
  case 'arrow':s(.12,.41,.58,.18);s(.45,.25,.4,.5,ink,'triangle',90);break;
  case 'flower':for(let i=0;i<8;i++){let a=i*Math.PI/4;circle(.35+Math.cos(a)*.24,.35+Math.sin(a)*.24,.3,i%2?ink:accent);}circle(.35,.35,.30,bg);break;
  case 'target':for(let i=0;i<7;i++)circle(.05+i*.06,.05+i*.06,.9-i*.12,i%2?bg:ink);break;
  case 'steps':for(let i=0;i<5;i++)s(.08+i*.17,.75-i*.14,.17,.17,i%2?accent:ink);break;
  case 'cross':s(.36,.08,.28,.84);s(.08,.36,.84,.28);s(.41,.41,.18,.18,accent);break;
  case 'asterisk':for(let i=0;i<4;i++)s(.45,.16,.1,.68,ink,'rect',i*45);circle(.41,.41,.18,accent);break;
  case 'diamonds':s(.10,.37,.25,.25,ink,'rect',45);s(.36,.25,.35,.35,accent,'rect',45);s(.68,.45,.20,.20,ink,'rect',45);break;
  case 'cloud':circle(.08,.4,.42);circle(.28,.2,.48);circle(.57,.4,.36);s(.2,.50,.60,.3);break;
  case 'wave':for(let i=0;i<15;i++)circle(.05+i*.06,.42+Math.sin(i*.65)*.2,.065,i%3?ink:accent);break;
  case 'frame':for(const [a,b]of[[.08,.08],[.68,.08],[.08,.68],[.68,.68]]){s(a,b,.24,.05);s(a,b,.05,.24);}break;
  case 'ticket':s(.08,.24,.84,.52);for(let i=0;i<7;i++)circle(.74,.26+i*.067,.04,bg);s(.16,.35,.46,.05,accent);s(.16,.48,.3,.05,accent);break;
  case 'cassette':s(.05,.2,.90,.60,ink,'round');s(.13,.28,.74,.29,accent,'round');circle(.20,.34,.16,bg);circle(.64,.34,.16,bg);s(.25,.65,.5,.08,accent);break;
  case 'speaker':s(.22,.06,.56,.88,ink,'round');circle(.34,.15,.32,accent);circle(.29,.49,.42,accent);circle(.40,.60,.20,bg);break;
  case 'moon':circle(.10,.08,.80);circle(.35,.05,.65,bg);s(.68,.66,.20,.20,accent,'star');break;
  case 'petals':s(.46,.2,.06,.73);for(let i=0;i<3;i++){s(.18,.2+i*.19,.29,.16,ink,'ellipse',30);s(.52,.13+i*.19,.29,.16,accent,'ellipse',-30);}break;
  case 'windows':for(let r=0;r<3;r++)for(let c=0;c<3;c++)s(.10+c*.28,.10+r*.28,.22,.22,(r+c)%2?ink:accent);break;
  case 'confetti':for(let i=0;i<10;i++){let a=i*2.4,r=.22+(i%3)*.06;s(.45+Math.cos(a)*r,.45+Math.sin(a)*r,.10,.10,i%2?ink:accent,i%3?'ellipse':'triangle',i*23);}break;
  default:throw Error('Unknown symbol: '+id);
 }
 return out;
}
const remixDirections=[
 {id:'acid',name:'Acid grid',style:'Neon',font:'Impact',colors:['#101c19','#e5ff8d','#9d82f8'],motif:'orbit'},
 {id:'paper',name:'Cut-paper',style:'Playful',font:'Bangers',colors:['#f3dcc6','#301f44','#e65238'],motif:'spark'},
 {id:'swiss',name:'Swiss type',style:'Bold',font:'Impact',colors:['#eceee5','#131b2c','#df4931'],motif:'cross'},
 {id:'stamp',name:'Retro stamp',style:'Retro',font:'Georgia',colors:['#e7c9aa','#4b243a','#bd5539'],motif:'record'},
 {id:'gallery',name:'Gallery frame',style:'Editorial',font:'Georgia',colors:['#ebe9dc','#25392f','#ab614e'],motif:'frame'}
];
const remixThemes=[
 ['pulse','PULSE\nDISTRICT','Music & DJ','warehouse','Underground sounds. Shared energy.','FRIDAY / 11 PM','FIND THE FLOOR','underground rave techno warehouse edm','levels'],
 ['garage','GARAGE\nAFTER DARK','Music & DJ','dj-vinyl','Two-step into the weekend.','SATURDAY / 10 PM','GET TICKETS','uk garage dj two step bass music','checker'],
 ['amapiano','PIANO\nSOCIAL','Music & DJ','dj-disco','Deep grooves. Open dancefloor.','SUNDAY / 5 PM','JOIN THE SESSION','amapiano afro house dj party','flower'],
 ['jungle','JUNGLE\nSIGNAL','Music & DJ','vinyl','Breakbeats from the underground.','FRIDAY / MIDNIGHT','LOCK IN','jungle dnb drum bass breakbeat rave','speaker'],
 ['disco','DISCO\nDAYDREAM','Music & DJ','dj-disco','A little sparkle after sunset.','SATURDAY / 8 PM','COME DANCE','disco funk dj retro party','rays'],
 ['ambient','SLOW\nFREQUENCIES','Music & DJ','chrome','Space to listen. Room to drift.','SUNDAY / 7 PM','TUNE IN','ambient downtempo listening music sound','wave'],
 ['rooftop','GOLDEN\nROOFTOP','Music & DJ','rooftop','Sunset sets above the city.','SATURDAY / 6 PM','RESERVE A PLACE','rooftop afro house sunset dj summer','moon'],
 ['hardtechno','CONCRETE\nCURRENT','Music & DJ','dj-techno','Heavy rhythms. Late arrivals.','SATURDAY / 23:00','ENTER THE ROOM','hard techno underground rave industrial','target'],
 ['synth','NEON\nCASSETTE','Music & DJ','nightlife','Tomorrow sounds like yesterday.','FRIDAY / 9 PM','PRESS PLAY','synthwave retrowave electronic 80s dj','cassette'],
 ['live','SMALL STAGE\nBIG SOUND','Entertainment','performer','Independent voices, up close.','THURSDAY / 7 PM','BOOK A TICKET','live concert singer indie music performance','ticket'],
 ['comedy','LAUGH\nLOCAL','Entertainment','creator','New jokes. Familiar faces.','WEDNESDAY / 8 PM','SAVE YOUR SEAT','comedy standup open mic entertainment','confetti'],
 ['cinema','MIDNIGHT\nSCREENING','Entertainment','chrome','One screen. A shared escape.','FRIDAY / 10 PM','JOIN MOVIE NIGHT','cinema movie film screening club','windows'],
 ['market','SECOND\nSTORY','Small Business','creator-street','Pre-loved finds. New beginnings.','SAT–SUN / 10 AM','EXPLORE THE MARKET','thrift vintage market shop fashion pop up','petals'],
 ['beauty','DAILY\nRITUAL','Beauty','beauty-still','Small moments, beautifully made.','NEW COLLECTION / OUT NOW','DISCOVER THE DROP','beauty skincare product launch social promo','diamonds'],
 ['fashion','STREET\nEDITION','Fashion','creator-street','Wear it your own way.','LIMITED DROP / FRIDAY','SHOP THE EDIT','fashion streetwear clothing retail promotion','asterisk'],
 ['podcast','SIDE\nCONVERSATIONS','Podcast','creator','Good questions lead somewhere.','EPISODE 01 / NOW LIVE','LISTEN NOW','podcast interview host talk episode','cloud'],
 ['creator','YOUR NEXT\nCHAPTER','Marketing','creator-street','A new story for your community.','LAUNCH WEEK / FOLLOW ALONG','MEET THE CREATOR','creator ugc social media launch marketing','arrow'],
 ['sale','THE WEEKEND\nEDIT','Marketing','beauty-still','Your next favorite is waiting.','WEEKEND OFFER / ADD TERMS','SHOP THE OFFER','sale promotion discount retail social media','spark'],
 ['studio','OPEN\nSTUDIO','Photography','fashion','See the process behind the work.','OPEN HOUSE / 12–6 PM','COME INSIDE','photography portfolio studio art exhibition','frame'],
 ['workshop','MAKE\nSOMETHING','Education','creator','A practical session for curious minds.','SATURDAY / 11 AM','BOOK A PLACE','workshop class creative training masterclass','steps'],
 ['fitness','MOVE\nTOGETHER','Fitness','wellness','Your pace. Our community.','MON WED FRI / 7 AM','JOIN THE CLASS','fitness gym workout trainer bootcamp','cross'],
 ['wellness','THE SLOW\nCLUB','Wellness','wellness','A little room to breathe.','SUNDAY / 9 AM','SAVE YOUR SPACE','yoga wellness pilates meditation retreat','flower'],
 ['coffee','COFFEE\n& COMPANY','Food & Drink',null,'A good cup. A better conversation.','WEEKENDS / 9 AM','DROP BY','coffee cafe brunch opening food drink','rays'],
 ['community','NEIGHBOR\nGOOD','Nonprofit',null,'Small actions. Shared possibilities.','COMMUNITY DAY / SATURDAY','GET INVOLVED','nonprofit fundraiser community volunteer local','confetti']
].map(([key,title,topic,asset,sub,detail,cta,tags,symbol])=>({key,title,topic,asset,sub,detail,cta,tags,symbol}));
const remixCombinations=remixThemes.flatMap((t,i)=>remixDirections.map((direction,j)=>({...t,direction,comboId:t.key+'-'+direction.id,edition:i+1,imagery:t.asset&&(j===1||j===4)?promoAssetInfo[t.asset].kind:'Shapes & symbols',hasPeople:!!t.asset&&(j===1||j===4)&&['People','Crowds & places'].includes(promoAssetInfo[t.asset].kind)})));
const remixTemplates=promoFormats.flatMap(([format,label,width,height,category])=>Array.from({length:5},(_,j)=>Array.from({length:24},(_,i)=>remixCombinations[i*5+(j+i)%5])).flat().map(t=>({...t,id:'remix-'+t.comboId+'-'+format,name:t.title.replace(/\n/g,' ')+' / '+t.direction.name+' — '+label,format,formatLabel:label,width,height,category,style:t.direction.style,layoutName:t.direction.name,collection:'remix',aiImagery:!!t.asset&&['paper','gallery'].includes(t.direction.id),tags:t.tags+' '+t.direction.name+' '+t.symbol+' symbols shapes original remix combination '+label})));
function makeRemixDesign(t,assets){
 const w=t.width,h=t.height,u=Math.min(w,h),wide=w>h,[bg,ink,accent]=t.direction.colors,d={version:1,id:uid(),name:t.name,width:w,height:h,background:bg,elements:[]},a=d.elements;
 const rect=(x,y,ww,hh,c=ink)=>a.push(shape(w*x,h*y,w*ww,h*hh,c));
 const text=(value,x,y,ww,hh,size=.03,color=ink,font='Arial',extra={})=>a.push(txt(value,w*x,h*y,w*ww,u*size,color,{h:h*hh,font,weight:font==='Arial'?'700':'400',...extra}));
 const symbol=(id,x,y,size,c=ink,b=accent,back=bg)=>a.push(...remixSymbol(id,w*x,h*y,u*size,c,b,back));
 const photo=(x,y,size)=>{if(t.asset)a.push(base('image',w*x,h*y,u*size,u*size,{src:assets[t.asset],altText:'AI-generated '+promoAssetInfo[t.asset].description+'. Sample imagery.'}));else symbol(t.symbol,x,y,size);};
 const headline=(x,y,ww,hh,size=.12,c=ink)=>text(t.title,x,y,ww,hh,size,c,t.direction.font);
 switch(t.direction.id){
  case 'acid':
   rect(.035,.095,.93,.012,accent);headline(.055,.13,wide?.52:.89,.26,wide?.115:.125);symbol(t.symbol,wide?.64:.20,wide?.20:.43,wide?.54:.44,accent,ink);symbol('dots',.06,wide?.58:.55,wide?.18:.20,ink,accent);text(t.sub,.055,.81,.89,.065,.027);break;
  case 'paper':
   rect(.035,.095,.93,.77,accent);photo(wide?.53:.26,wide?.20:.30,wide?.59:.52);rect(.055,.13,wide?.49:.69,.19,bg);headline(.075,.145,wide?.45:.65,.165,.08);symbol(t.symbol,.065,wide?.47:.51,.25,ink,bg,accent);rect(.075,.76,.83,.08,bg);text(t.sub,.095,.779,.79,.048,.028);break;
  case 'swiss':
   text(String(t.edition).padStart(2,'0'),wide?.77:.70,.11,.22,.13,.115,accent,'Impact');headline(.055,.12,wide?.69:.64,.35,wide?.13:.14);rect(.055,.51,.89,.008);symbol(t.symbol,wide?.73:.65,.60,wide?.22:.26,accent,ink);text(t.sub,.055,.62,wide?.58:.51,.18,.037);break;
  case 'stamp':
   rect(.04,.10,.92,.76,ink);rect(.058,.117,.884,.725,bg);for(let i=0;i<12;i++){rect(.065+i*.073,.12,.025,.016,accent);rect(.065+i*.073,.811,.025,.016,accent);}symbol(t.symbol,wide?.64:.28,wide?.24:.34,wide?.43:.38,ink,accent);headline(.08,.155,wide?.52:.84,wide?.34:.18,.085);text(t.sub,.09,wide?.67:.76,wide?.51:.82,.06,.027);break;
  case 'gallery':
   headline(.055,.12,wide?.46:.89,.20,.09);photo(wide?.57:.055,wide?.20:.38,wide?.59:.49);symbol(t.symbol,wide?.09:.65,wide?.47:.41,wide?.15:.23,accent,ink);text(t.sub,wide?.09:.65,wide?.70:.65,wide?.38:.29,wide?.11:.15,.028);break;
 }
 text('YOUR BRAND / '+t.topic.toUpperCase(),.055,.035,.89,.04,.018);
 rect(.055,.905,.89,.002);text(t.detail,.055,.927,.54,.04,.021);text(t.cta+' ↗',.63,.927,.315,.045,.021,ink,'Arial',{align:'right'});
 return d;
}
