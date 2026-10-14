// 240 original editable combinations across twenty reference-inspired layout families.
const referenceFamilies=[
 ['exhibition','Chrome exhibition',0,'Photography','studio-chrome chrome','FORM & LIGHT|NEW PERSPECTIVES|OPEN SPACE|AFTER IMAGE|MATERIAL WORLD|SOFT GEOMETRY|ART IN MOTION|THE SHAPE OF NOW|STUDIO VISIONS|BEYOND THE FRAME|CURIOUS FORMS|LIGHT STUDIES','CONTEMPORARY ART / OPEN TO EVERYONE','EXHIBITION / YOUR GALLERY','art exhibition chrome gallery'],
 ['editorial','Portrait editorial',3,'Fashion','studio-portrait fashion beauty-editorial creator-street','Quiet confidence|The portrait edit|Everyday muse|A different light|Modern heirloom|The style journal|Personal expression|Soft focus|The city edition|New classics|Beyond the look|A point of view','STYLE / STORIES / PEOPLE','YOUR JOURNAL / ISSUE 01','fashion editorial portrait magazine'],
 ['vinyl','Vinyl night',10,'Music & DJ','','DEEP ROTATION|AFTERHOURS WAX|HOUSE OF GROOVE|SOUL CIRCLES|MIDNIGHT PRESSING|DISCO ARCHIVE|BASS & NEEDLES|WARM FREQUENCIES|RARE FINDS|SUNSET SELECTORS|THE LISTENING ROOM|ALL NIGHT ANALOG','HOUSE / DISCO / RARE GROOVES','FRIDAY / 9 PM / YOUR VENUE','dj underground rave vinyl disco music'],
 ['gothic','Skeleton invitation',16,'Celebrations','studio-skeletons studio-gothic','MOONLIGHT BALL|DANCE WITH SHADOWS|THE MIDNIGHT CLUB|BONES & BLOOMS|HAUNTED GARDEN|GHOSTLIGHT GALA|WITCHING HOUR|AFTER DARK SOCIAL|THE LAST WALTZ|AUTUMN SPELL|SPOOKY SOIRÉE|DUSK TILL DAWN','COSTUMES / COCKTAILS / DANCING','31 OCT / 9 PM / YOUR VENUE','halloween skeleton spooky invitation'],
 ['horror','Horror headline',17,'Celebrations','studio-fangs studio-gothic studio-skeletons','NIGHT BITES|FANGS AFTER DARK|SCREAM SOCIAL|HAUNT THE HOUSE|DARK DELIGHT|FULL MOON FEVER|FREAKY FRIDAY|SHADOW PARTY|THE NIGHT SHIFT|NOCTURNAL|FEAR & FUN|MIDNIGHT MISCHIEF','A LITTLE FRIGHT. A VERY GOOD NIGHT.','HALLOWEEN / DOORS AT 8 PM','halloween vampire horror party'],
 ['stripe','Striped brand card',24,'Small Business','','COAST & CANDLE|SUNDAY SOAP|TIDAL CERAMICS|SALTWATER STUDIO|RIBBON & ROSE|OLIVE PAPER|LITTLE LOOM|GOLDEN HOUR GOODS|WILLOW & WAX|PEBBLE PRINT|BLUEBIRD BAKERY|CLOVER CRAFT','THOUGHTFULLY MADE / EVERY DAY','YOUR INDEPENDENT BRAND / EST. 2026','branding logo small business handmade stripes'],
 ['birthday','Birthday portrait',29,'Celebrations','life-birthday life-creator creator comedian creative-founder studio-portrait','HELLO, TWENTY ONE!|CHEERS TO THIRTY!|FORTY & FABULOUS|GOLDEN BIRTHDAY|MAKE A WISH|ANOTHER GREAT YEAR|BIRTHDAY WEEKEND|LET’S CELEBRATE|PARTY WITH US|YOUR DAY TO SHINE|GOOD TIMES AHEAD|A VERY HAPPY BIRTHDAY','YOU’RE INVITED TO CELEBRATE','SATURDAY / 7 PM / YOUR PLACE','birthday invitation portrait confetti party'],
 ['creator','Creator notebook',30,'Marketing','life-creator creator creator-street creative-founder wellness comedian','Meet Alex|Notes from Maya|Hello, Jordan|The creative life|A little about me|Behind the work|Stories by Riley|The daily journal|Made by Morgan|Meet your creator|Ideas with Sam|My corner of the world','CREATOR / STORYTELLER / CURIOUS MIND','LET’S CREATE TOGETHER / HELLO@EXAMPLE.COM','creator influencer profile media kit journal'],
 ['identity','Studio wordmark',31,'Small Business','','olio.|morrow.|kindred.|pollen.|loft.|moss.|woven.|gather.|flint.|sora.|north.|luma.','INDEPENDENT IDEAS / CAREFULLY MADE','YOUR STUDIO / BRAND IDENTITY','logo branding wordmark studio minimalist'],
 ['resume','Career résumé',32,'Small Business','','ALEX MORGAN|JAMIE PARK|TAYLOR REED|RILEY CHEN|JORDAN BLAKE|CASEY RIVERA|MORGAN LEE|ROWAN ELLIS|SAM PATEL|DREW COLLINS|CAMERON FOX|Avery Brooks','YOUR ROLE / YOUR SPECIALISM','HELLO@EXAMPLE.COM / PORTFOLIO.EXAMPLE','resume cv career professional job portfolio'],
 ['game','Board-game path',33,'Gaming','','ROLL TOGETHER|THE GAME ROOM|YOUR NEXT MOVE|DICE & FRIENDS|TABLETOP SOCIAL|PLAY AFTER DARK|FRIDAY GAME CLUB|BOARD TOGETHER|GAME ON|PLAY THE NIGHT|ONE MORE ROUND|MEET AT THE TABLE','BRING YOUR FRIENDS / LEARN A NEW GAME','FRIDAY / 7–10 PM / COMMUNITY ROOM','board game night tabletop gaming dice'],
 ['schedule','Event schedule',35,'Entertainment','','THE WEEKEND EDIT|COMMUNITY WEEK|CREATIVE CALENDAR|YOUR LOCAL LINEUP|THE SOCIAL AGENDA|GOOD DAYS AHEAD|WHAT’S ON|THREE DAYS TOGETHER|THE CULTURE GUIDE|NEIGHBORHOOD NOTES|SAVE THE WEEKEND|MAKE SOME PLANS','MUSIC / MAKERS / MOMENTS','YOUR LOCAL COLLECTIVE / UPCOMING EVENTS','event schedule agenda community music'],
 ['picnic','Picnic invitation',36,'Celebrations','mix-picnic','Picnic in the park|A blanket & good company|The Sunday spread|Lunch under the trees|A little outdoor party|The strawberry social|Gather in the garden|Good food, good friends|Meet me in the meadow|A sunny celebration|Bring your favorite dish|The weekend picnic','BRING SOMETHING TO SHARE','SUNDAY / 1 PM / THE PARK','picnic birthday invitation food gathering'],
 ['harvest','Seasonal market',38,'Food & Drink','life-harvest studio-botanical beauty-still','AUTUMN MARKET|COZY CORNER|HARVEST TABLE|WARM & LOCAL|THE FALL EDIT|PUMPKIN WEEKEND|SEASONAL FINDS|GATHER & GLOW|SMALL BATCH SOCIAL|THE MAKERS TABLE|NOVEMBER NOTES|SLOW SEASON','LOCAL MAKERS / WARM DRINKS / GOOD COMPANY','SATURDAY / 10 AM–4 PM / TOWN SQUARE','autumn fall market harvest seasonal invitation'],
 ['calendar','Monthly planner',null,'Education','','JANUARY 2027|FEBRUARY 2027|MARCH 2027|APRIL 2027|MAY 2027|JUNE 2027|JULY 2027|AUGUST 2027|SEPTEMBER 2027|OCTOBER 2027|NOVEMBER 2027|DECEMBER 2027','MAKE SPACE FOR WHAT MATTERS','GOALS / NOTES / LITTLE WINS','calendar monthly planner schedule dates'],
 ['signup','Sign-up sheet',null,'Faith & Community','','VOLUNTEER CREW|COMMUNITY WORKSHOP|BOOK CLUB|OPEN MIC NIGHT|GARDEN DAY|MAKERS MEETUP|NEIGHBORHOOD CLEANUP|DANCE CLASS|SUNDAY WALK|ART CLUB|SKILL SHARE|COMMUNITY PICNIC','SIGN-UP SHEET','EVENT DATE: __________ / ORGANIZER: __________','sign-up signup registration form volunteer table'],
 ['travel','Travel cover',null,'Travel','mix-beach studio-city life-forest rooftop','ISLAND DAYS|CITY STORIES|INTO THE GREEN|GOLDEN HOUR|THE COASTAL EDIT|WANDER NOTES|SLOW TRAVEL|WEEKEND ESCAPE|OFF THE MAP|POSTCARD MOMENTS|THE SCENIC ROUTE|OUTSIDE AGAIN','TRAVEL JOURNAL / CHAPTER 01','YOUR NEXT ADVENTURE STARTS HERE','travel vlog cover nature beach city forest'],
 ['restaurant','Restaurant seal',null,'Food & Drink','','CASA LIMONE|OLIVE & SALT|SUNDAY TABLE|LITTLE BASIL|THE GARDEN KITCHEN|CIAO CLUB|ROSEMARY ROOM|PASTA SOCIAL|FIG & FLOUR|THE LOCAL PLATE|LEMON COURT|TABLE FOR TWO','GOOD FOOD / WARM WELCOME','YOUR NEIGHBORHOOD RESTAURANT','restaurant cafe branding logo menu food stripes'],
 ['glitch','Analog broadcast',7,'Gaming','','SIGNAL FOUND|STAY TUNED|NEXT LEVEL|PLAY LOADING|AFTER THE STATIC|LIVE TONIGHT|NEW FREQUENCY|THE LATE STREAM|INSERT COIN|SYSTEM ONLINE|NIGHT MODE|PRESS START','A NEW TRANSMISSION IS COMING','LIVE STREAM / TONIGHT / 9 PM','glitch gaming stream broadcast techno edm'],
 ['scrapbook','Photo scrapbook',22,'Travel','studio-friends night-friends podcast-pair rooftop studio-duo life-creator','Our kind of weekend|Days to remember|The friendship edit|Little adventures|Life lately|Postcards from us|Snapshots & stories|The good company club|A weekend well spent|Collecting the moments|Out with our people|The memory book','LITTLE MOMENTS / BIG MEMORIES','YOUR JOURNAL / MAKE IT YOURS','scrapbook collage friends travel social media']
].map(([key,layoutName,baseLayout,topic,pool,titles,sub,detail,tags])=>({key,layoutName,baseLayout,topic,pool:pool?pool.split(' '):[],titles:titles.split('|'),sub,detail,tags}));
const referencePalettes=[
 ['Ivory & ink','#f7f1df','#253b37','#d49b65','Editorial'],
 ['Lilac & plum','#eee5f5','#482644','#bd81ad','Playful'],
 ['Ocean blue','#deebf7','#214d75','#79b7ca','Minimal'],
 ['Midnight gold','#1c2534','#ffebba','#ca9662','Bold'],
 ['Rose paper','#f5e0dc','#8a303c','#d9938a','Classic'],
 ['Forest cream','#173f36','#f8e9c6','#93b8a3','Retro'],
 ['Citrus punch','#f9dfa1','#8a341b','#e89145','Playful'],
 ['Cobalt chalk','#274b93','#fff1d8','#a5c9ea','Bold'],
 ['Sage linen','#e7eadb','#3e5842','#b1b58a','Minimal'],
 ['Cherry vanilla','#f5eddb','#a52732','#d8a293','Retro'],
 ['Violet night','#34254e','#f8e3b9','#b4a0d0','Editorial'],
 ['Terracotta sky','#f2d4b9','#5e352e','#96b6b5','Classic']
];
const referencePeopleAssets=new Set(['studio-portrait','fashion','beauty-editorial','creator-street','life-birthday','life-creator','creator','comedian','creative-founder','wellness','studio-friends','night-friends','podcast-pair','rooftop','studio-duo']);
const referenceTemplates=[];
for(let v=0;v<12;v++)for(const f of referenceFamilies){
 const original=f.baseLayout===null?null:studioTemplates.find(t=>t.layout===f.baseLayout),pal=referencePalettes[['calendar','signup','resume'].includes(f.key)?[0,2,8,4,6,9,11,1,3,5,7,10][v]:(v+referenceFamilies.indexOf(f)*5)%12],asset=f.pool.length?f.pool[v%f.pool.length]:null;
 const assetIds=asset?[asset]:[];if(f.key==='scrapbook')assetIds.push(v%2?'mix-beach':'studio-city');
 const imagery=!asset?'Shapes & symbols':referencePeopleAssets.has(asset)?'People':['studio-gothic','studio-skeletons','studio-fangs','mix-picnic','life-harvest'].includes(asset)?'Illustration':['mix-beach','studio-city','life-forest'].includes(asset)?'Crowds & places':asset.includes('chrome')?'Abstract':'Products';
 const width=['calendar','travel'].includes(f.key)?1280:original?.width||1080,height=['calendar','travel'].includes(f.key)?720:original?.height||1350;
 referenceTemplates.push({...original,id:'reference-'+f.key+'-'+String(v+1).padStart(2,'0'),key:f.key+'-'+v,family:f.key,variant:v,title:f.titles[v],name:f.titles[v]+' · '+pal[0],sub:f.sub,detail:f.detail,topic:f.topic,layoutName:f.layoutName,layout:f.baseLayout,width,height,format:width>height?'cover':height===1080?'square':'post',category:width>height?'Social':'Poster',collection:'reference',bg:pal[1],ink:pal[2],accent:pal[3],style:pal[4],paletteName:pal[0],asset,assetIds,hasPeople:assetIds.some(id=>referencePeopleAssets.has(id)),aiImagery:!!asset,imagery,tags:f.tags+' '+pal[0]+' reference remix original editable combination'});
}
function makeReferenceDesign(t,assets){
 let d=t.layout===null?{version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]}:makeStudioDesign(t,assets);
 const a=d.elements,r=(x,y,w,h,c=t.ink,kind='rect',extra={})=>a.push(shape(x,y,w,h,c,kind,extra)),tx=(v,x,y,w,h,size,c=t.ink,font='Arial',extra={})=>a.push(txt(v,x,y,w,size,c,{h,font,weight:font==='Arial'?'700':'400',...extra}));
 const photo=(x,y,s,id=t.asset)=>a.push(base('image',x,y,s,s,{src:assets[id],altText:'AI-generated sample artwork for '+t.layoutName+'.'}));
 if(t.family==='calendar'){
  tx(t.title,55,25,1170,90,58,t.ink,['Arial','Georgia','Kalam'][t.variant%3]);
  tx(t.sub,55,120,1170,40,23);
  const start=new Date(Date.UTC(2027,t.variant,1)).getUTCDay(),days=new Date(Date.UTC(2027,t.variant+1,0)).getUTCDate();
  const cellW=125,cellH=72,left=55,top=225;
  ['SUN','MON','TUE','WED','THU','FRI','SAT'].forEach((day,i)=>tx(day,left+i*cellW,185,cellW,35,19));
  for(let y=0;y<=6;y++)r(left,top+y*cellH,875,2,t.accent);
  for(let x=0;x<=7;x++)r(left+x*cellW,top,2,432,t.accent);
  for(let day=1;day<=days;day++){const n=start+day-1;tx(String(day),left+n%7*cellW+8,top+Math.floor(n/7)*cellH+7,95,40,23);}
  tx('NOTES',975,185,250,35,21);for(let i=0;i<11;i++)r(975,240+i*38,250,2,t.accent);
  tx(t.detail,55,680,1170,30,18);
 }else if(t.family==='signup'){
  tx(t.title,60,55,960,200,80,t.ink,['Impact','Georgia','Bangers'][t.variant%3]);
  tx(t.sub,60,280,960,70,42);tx(t.detail,60,395,960,50,24);
  r(60,520,960,65,t.ink);const cols=[60,120,390,750,1020];
  ['#','NAME','EMAIL / CONTACT','ROLE / NOTES'].forEach((h,i)=>tx(h,cols[i]+10,539,cols[i+1]-cols[i]-20,30,19,t.bg));
  for(let i=0;i<=8;i++)r(60,585+i*75,960,2,t.accent);
  for(const x of cols)r(x,585,2,600,t.accent);
  for(let i=1;i<=8;i++)tx(String(i),75,603+(i-1)*75,35,40,21);
  tx('THANK YOU FOR TAKING PART',60,1240,960,45,25);
 }else if(t.family==='travel'){
  photo(560,0,720);r(0,0,560,720,t.bg);tx(t.sub,50,50,470,80,25);
  tx(t.title,50,205,450,290,105,t.ink,['Kalam','Georgia','Impact'][t.variant%3]);r(50,550,420,3,t.accent);tx(t.detail,50,610,450,65,24);
 }else if(t.family==='restaurant'){
  for(let i=0;i<12;i++)r(i*90,0,40,1350,t.accent,'rect',{opacity:.4});
  r(90,210,900,900,t.ink,'ellipse');r(105,225,870,870,t.bg,'ellipse');r(125,245,830,830,t.ink,'ellipse');r(130,250,820,820,t.bg,'ellipse');
  tx(t.sub,220,390,640,80,28);tx(t.title,190,555,700,230,88,t.ink,['Georgia','Kalam','Bangers'][t.variant%3]);tx(t.detail,225,855,630,100,25);
 }else if(t.family==='picnic'){
  // Replace the simple plate motif with original picnic line art, preserving editable copy and border.
  const keep=a.filter(e=>e.type==='text'||(e.type!=='image'&&e.w>950));a.splice(0,a.length,...keep);photo(250,560,580);
 }else if(t.family==='scrapbook'){
  const imgs=a.filter(e=>e.type==='image');imgs[1].src=assets[t.assetIds[1]];imgs[1].altText='AI-generated travel scene.';
 }
 // Give each combination independent typography, frame treatment and geometry.
 const title=a.find(e=>e.type==='text'&&e.text===t.title);
 if(title&&!['calendar','signup','travel','restaurant'].includes(t.family)){title.font=(['gothic','horror'].includes(t.family)?['Creepster','Georgia','Bangers']:['Impact','Georgia','Bangers','Kalam','Arial','Georgia'])[(t.variant+referenceFamilies.findIndex(f=>f.key===t.family))%(['gothic','horror'].includes(t.family)?3:6)];title.weight=title.font==='Arial'?'700':'400';if((t.variant+referenceFamilies.findIndex(f=>f.key===t.family))%3===1)title.align='center';}
 for(let i=a.length-1;i>=0;i--){const e=a[i];if(e.type!=='image')continue;
  const inset=[0,14,24,8][t.variant%4];if(inset){const frame=shape(e.x,e.y,e.w,e.h,t.variant%2?t.bg:t.accent,'rect');a.splice(i,0,frame);e.x+=inset;e.y+=inset;e.w-=inset*2;e.h-=inset*2;}
 }
 // Recolor decorative accents, leaving light paper and text contrast intact.
 for(const e of a){if(e.type==='image'||e.type==='text')continue;if(['#dc80ad','#cbdcf4','#7298ce','#f4cc75','#c8b2df','#f0b6a3','#e4b2a0'].includes(e.color))e.color=t.accent;}

 // Keep copy readable on the fixed paper and colored panels inherited from the base compositions.
 for(const e of a){
  if(e.type!=='text'&&['#fcf4e2','#f9efce','#e5ceca'].includes(e.color))e.color=t.bg;
  if(t.family==='schedule'&&e.type==='text'&&e.y>=500&&e.y<1200)e.color='#283144';
 }
 if(t.family==='gothic'&&title){const rgb=t.accent.match(/\w\w/g).map(x=>parseInt(x,16));const lin=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});title.color=(lin[0]*.2126+lin[1]*.7152+lin[2]*.0722)>.179?'#21131e':'#fff5df';}
 if(t.family==='exhibition'&&title){const n=a.indexOf(title);a.splice(n,0,shape(title.x-10,title.y-5,title.w+20,title.h+10,t.bg,'rect',{opacity:.94}));}
 return d;
}
