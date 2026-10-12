// Original campaign concepts. The four photo assets depict AI-generated fictional adults.
const promoFormats=[['post','Portrait post',1080,1350,'Social'],['square','Square post',1080,1080,'Social'],['story','Story / reel cover',1080,1920,'Story'],['flyer','Flyer',1275,1650,'Poster'],['cover','Landscape cover',1280,720,'Social']];
const promoCampaigns=[
 ['afterglow','AFTER\nGLOW','Music & DJ','nightlife','Late nights. New frequencies.','FRI 23 OCT / 10 PM','GET TICKETS','edm dj techno rave underground nightclub party neon','#111526','#f0f7a4','#ae85fa','Impact'],
 ['houseparty','HOUSE\nPARTY','Music & DJ','nightlife','A little soul. A lot of groove.','SATURDAY / DOORS 9 PM','JOIN THE FLOOR','house music afro house soulful disco dance club','#efddc7','#35274e','#f28759','Bangers'],
 ['bassline','BASSLINE\nCULTURE','Music & DJ','nightlife','Feel every frequency.','FRIDAY / LATE SESSION','SAVE YOUR SPOT','bass dubstep dnb drum and bass edm concert','#1c2730','#d2f564','#6aafcc','Impact'],
 ['rooftop','ABOVE\nTHE CITY','Music & DJ','nightlife','Golden hour becomes your night.','SUNDAY / 6 PM','RSVP NOW','rooftop sunset lounge summer dj party','#442c58','#fff0cd','#e98b83','Georgia'],
 ['womenondecks','ON THE\nDECKS','Music & DJ','nightlife','A night of selectors worth knowing.','SATURDAY / 8 PM','MEET THE LINEUP','women dj live set lineup music showcase','#efb2c7','#2b1543','#d95732','Impact'],
 ['latenight','AFTER\nHOURS','Entertainment','nightlife','When the city changes tempo.','FRIDAY / MIDNIGHT','GET ON THE LIST','afterhours warehouse underground rave nightclub party','#13151a','#f9ece0','#b2c56f','Bangers'],
 ['openmic','YOUR\nMIC MOMENT','Entertainment','creator','Fresh voices. An open stage.','THURSDAY / 7 PM','TAKE THE STAGE','open mic comedy standup spoken word talent show','#efe0c9','#342427','#dc7954','Bangers'],
 ['podcast','OFF\nSCRIPT','Podcast','creator','Better questions. Honest conversations.','NEW EPISODE / 024','LISTEN NOW','podcast host interview episode spotify talk show','#f1e7d5','#234940','#d07b57','Georgia'],
 ['speaker','THE NEXT\nBIG IDEA','Education','creator','Meet the mind behind the work.','LIVE TALK / 7 PM','RESERVE A SEAT','speaker webinar conference keynote masterclass workshop','#192e4a','#fff0d5','#efa768','Impact'],
 ['masterclass','MAKE YOUR\nNEXT MOVE','Education','creator','Small lessons. Useful progress.','LIVE WORKSHOP / SAT 11 AM','BOOK THE CLASS','course teaching training masterclass coaching seminar','#e5e6ce','#383c2e','#849b72','Georgia'],
 ['creatorlaunch','MADE\nBY ME','Marketing','creator','A new collection. A personal story.','LAUNCHING / THIS FRIDAY','EXPLORE THE DROP','creator ugc launch maker personal brand collaboration','#ead5c3','#423751','#c26946','Impact'],
 ['portfolio','WORK\nIN FOCUS','Photography','creator','The stories behind the images.','PORTFOLIO / NEW SERIES','VIEW THE WORK','photographer portfolio creative freelancer headshot session','#eeece5','#202727','#b98358','Georgia'],
 ['agency','HELLO,\nNEW IDEAS','Marketing','creator','Your next chapter starts with a conversation.','CREATIVE STUDIO / OPEN BRIEF','LET’S TALK','agency branding creative services marketing b2b consultancy','#172f2c','#ece9b8','#f79068','Impact'],
 ['networking','GOOD\nCONNECTIONS','Small Business','creator','Meet people building something good.','THURSDAY / 6 PM','RSVP FREE','networking coworking meetup entrepreneur business community','#eee4d4','#4b323b','#bf7459','Georgia'],
 ['fitness','STRONG\nTOGETHER','Fitness','wellness','Find your pace. Build your strength.','SMALL GROUP / MON WED FRI','BOOK A SESSION','fitness gym trainer bootcamp workout strength group class','#21382d','#e8ecc9','#b4d777','Impact'],
 ['pilates','MOVE\nWITH INTENT','Wellness','wellness','A little movement. A fresh start.','PILATES / NEW CLASSES','FIND YOUR CLASS','pilates mobility stretching balance instructor wellness','#ece6d8','#354b3a','#b5bd98','Georgia'],
 ['yoga','ROOM\nTO BREATHE','Wellness','wellness','Make space for your Sunday reset.','SUNDAY / SLOW FLOW 9 AM','ROLL OUT YOUR MAT','yoga meditation breathwork retreat mindfulness calm','#e7dfcf','#45543e','#c3a178','Georgia'],
 ['dance','FIND YOUR\nRHYTHM','Fitness','wellness','No perfect moves. Just your own.','OPEN DANCE / TUESDAY 7 PM','COME DANCE','dance hiphop choreography workshop movement class studio','#ddd4ef','#462959','#ed996a','Bangers'],
 ['runclub','A LITTLE\nFURTHER','Fitness','wellness','Good company. Your own pace.','SATURDAY / MEET 8 AM','JOIN THE RUN','running run club outdoor community training beginner','#192f41','#eef2bf','#e89460','Impact'],
 ['wellnessday','A DAY\nFOR YOU','Wellness','wellness','Move slowly. Leave a little lighter.','WELLNESS DAY / SATURDAY','SAVE YOUR PLACE','wellness self care retreat wellbeing workshop event','#ecdfd8','#674334','#b9c3a4','Georgia'],
 ['instructor','MEET YOUR\nINSTRUCTOR','Education','wellness','A friendly face for your first class.','NEW SEASON / ENROLLING NOW','EXPLORE CLASSES','instructor teacher introduction coach trainer profile','#e0e8d9','#2f483d','#e4a26e','Impact'],
 ['studioopening','DOORS\nARE OPEN','Small Business','wellness','Your neighborhood’s new space to move.','OPEN WEEKEND / 10 AM–4 PM','COME SAY HELLO','grand opening fitness studio local business opening promotion','#eee2bd','#364538','#ce895a','Bangers'],
 ['beautydrop','EVERYDAY\nICON','Beauty','fashion','A fresh chapter in your daily ritual.','NEW COLLECTION / AVAILABLE NOW','DISCOVER MORE','beauty cosmetics skincare makeup product launch campaign','#f2ceca','#643a43','#c35455','Georgia'],
 ['salon','YOUR NEXT\nLOOK','Beauty','fashion','New energy starts in the chair.','APPOINTMENTS / NOW OPEN','BOOK YOUR VISIT','salon hair beauty stylist haircut appointments promo','#f0e4d7','#452a37','#dc9774','Impact'],
 ['fashionedit','THE\nNEW EDIT','Fashion','fashion','Wear your point of view.','LIMITED COLLECTION / FRIDAY','SHOP THE EDIT','fashion boutique clothing apparel new arrival retail sale','#e7e1d7','#232b30','#d46f68','Georgia'],
 ['styleevent','STYLE\nIN SESSION','Fashion','fashion','A conversation about making it your own.','STYLE WORKSHOP / 2 PM','RESERVE YOUR PLACE','stylist personal style fashion workshop beauty masterclass','#4c2346','#f7e5cb','#e3a976','Georgia'],
 ['collab','BETTER\nIN COMPANY','Marketing','fashion','A creative collaboration worth sharing.','PARTNER SPOTLIGHT / YOUR BRAND','MEET THE COLLAB','collab influencer partnership sponsored ugc creator campaign','#f0b4bb','#4d273b','#eed388','Impact'],
 ['coverstory','THE\nCOVER STORY','Photography','fashion','People. Perspective. Possibility.','PORTRAIT SERIES / ISSUE 01','EXPLORE THE SERIES','editorial magazine portrait photography creative portfolio','#e8e3db','#39352e','#cc9c7a','Georgia'],
 ['popupstyle','HERE FOR\nTHE WEEKEND','Small Business','fashion','Find something with a story.','POP-UP SHOP / SAT–SUN','PLAN YOUR VISIT','popup boutique market shop local fashion retail promotion','#ede8be','#38433b','#dd8479','Bangers'],
 ['saleedit','GOOD\nFINDS','Marketing','fashion','Your next favorite is waiting.','SPECIAL OFFER / ADD YOUR TERMS','SHOP THE OFFER','sale discount retail promotion clearance deal clothing','#253c50','#fff0c6','#ed996c','Impact'],
 ['creativeclub','CREATIVE\nCOMPANY','Entertainment','creator','Bring your idea. Find your people.','MEETUP / FIRST THURSDAY','JOIN THE CLUB','creative club art exhibition artist community gallery meetup','#e4dbd0','#352f58','#d9855c','Georgia'],
 ['livestream','WE’RE\nLIVE','Entertainment','nightlife','Drop in. Stay for the energy.','LIVE SESSION / TONIGHT 8 PM','WATCH THE STREAM','livestream twitch youtube stream dj set gaming entertainment','#172539','#e1f08d','#b0a2ef','Impact']
].map(([key,title,topic,asset,sub,detail,cta,tags,bg,ink,accent,font],i)=>({key,title,topic,asset,sub,detail,cta,tags,bg,ink,accent,font,layout:i%8,style:['Bold','Retro','Neon','Editorial','Playful','Minimal','Bold','Editorial'][i%8]}));
// Alternate subjects in discovery so the first screen spans music, creators, wellness and fashion.
const promoBuckets=['nightlife','creator','wellness','fashion'].map(asset=>promoCampaigns.filter(t=>t.asset===asset));
const promoDiscoveryOrder=Array.from({length:Math.max(...promoBuckets.map(a=>a.length))},(_,i)=>promoBuckets.map(a=>a[i]).filter(Boolean)).flat();
const promoTemplates=promoFormats.flatMap(([format,label,width,height,category])=>promoDiscoveryOrder.map(t=>({...t,id:'promo-'+t.key+'-'+format,name:t.title.replace(/\n/g,' ')+' — '+label,format,formatLabel:label,width,height,category,tags:t.tags+' '+label+' photo people portrait promotion social instagram facebook tiktok youtube',aiImagery:true})));
function promoFilter(items,{query='',topic='All topics',style='All styles',format='all',people=false}={}){return items.filter(t=>matchesCatalog(t,query)&&(topic==='All topics'||t.topic===topic)&&(style==='All styles'||t.style===style)&&(format==='all'||t.format===format)&&(!people||t.aiImagery));}
function makePromoDesign(t,assets){
 const w=t.width,h=t.height,u=Math.min(w,h),d={version:1,id:uid(),name:t.name,width:w,height:h,background:t.bg,elements:[]},a=d.elements;
 const rect=(x,y,ww,hh,color,kind='rect',extra={})=>a.push(shape(x,y,ww,hh,color,kind,extra));
 const text=(value,x,y,ww,hh,size,color=t.ink,font='Arial',extra={})=>a.push(txt(value,x,y,ww,size,color,{h:hh,font,weight:font==='Arial'?'700':'400',...extra}));
 const photo=(x,y,size)=>a.push(base('image',x,y,size,size,{src:assets[t.asset],altText:'AI-generated fictional adult '+t.asset+' portrait. Sample promotional imagery.'}));
 const title=(x,y,ww,hh,sz,color=t.ink)=>text(t.title,x,y,ww,hh,sz,color,t.font);
 text('YOUR BRAND / '+t.topic.toUpperCase(),w*.055,h*.035,w*.89,h*.05,u*.018);
 if(w>h){
   rect(w*.47,h*.12,w*.48,h*.78,t.accent);photo(w*.5,h*.155,h*.69);
   title(w*.055,h*.22,w*.43,h*.43,u*.10);text(t.sub,w*.055,h*.68,w*.38,h*.10,u*.027);
   text(t.detail,w*.055,h*.85,w*.40,h*.04,u*.019);text(t.cta+' ↗',w*.56,h*.895,w*.37,h*.05,u*.026);
 }else{
   const sz=Math.min(w*.77,h*.48),x=(w-sz)/2,y=h*.30;
   if(t.layout===0){title(w*.06,h*.11,w*.88,h*.18,u*.091);photo(x,y,sz);rect(w*.06,h*.80,w*.88,h*.055,t.accent);text(t.sub,w*.09,h*.81,w*.82,h*.045,u*.024,t.bg);}
   if(t.layout===1){rect(w*.04,h*.09,w*.92,h*.70,t.ink);photo(x,h*.115,sz);title(w*.085,h*.62,w*.83,h*.15,u*.085,t.bg);text(t.sub,w*.06,h*.825,w*.88,h*.06,u*.025);}
   if(t.layout===2){rect(w*.05,h*.105,w*.075,h*.72,t.accent);photo(w*.17,h*.20,sz*.95);title(w*.15,h*.66,w*.80,h*.16,u*.094);text(t.sub,w*.15,h*.82,w*.78,h*.06,u*.024);text('VOL. 01',w*.17,h*.12,w*.7,h*.05,u*.035,t.accent,'Courier New');}
   if(t.layout===3){title(w*.06,h*.115,w*.88,h*.18,u*.083);rect(x-12,y-12,sz+24,sz+24,t.ink);photo(x,y,sz);text(t.sub,w*.06,h*.82,w*.88,h*.06,u*.025,t.ink,'Georgia',{align:'center'});}
   if(t.layout===4){rect(w*.05,h*.10,w*.90,h*.735,t.accent);photo(x,h*.255,sz);title(w*.09,h*.115,w*.82,h*.15,u*.082,t.bg);text(t.sub,w*.09,h*.76,w*.82,h*.06,u*.025,t.bg);}
   if(t.layout===5){photo(x,h*.11,sz);text('THE OPEN EDIT / 001',w*.07,h*.64,w*.86,h*.04,u*.018);title(w*.07,h*.69,w*.86,h*.14,u*.075);text(t.sub,w*.07,h*.845,w*.86,h*.05,u*.022);}
   if(t.layout===6){title(w*.06,h*.105,w*.88,h*.18,u*.085);photo(x,y,sz);rect(w*.06,h*.785,w*.15,h*.07,t.accent);text('01',w*.078,h*.797,w*.12,h*.05,u*.036,t.bg,'Impact');text(t.sub,w*.25,h*.80,w*.69,h*.07,u*.025);}
   if(t.layout===7){rect(w*.04,h*.09,w*.92,h*.775,t.ink);photo(x,h*.12,sz);title(w*.085,h*.63,w*.83,h*.14,u*.079,t.bg);text(t.sub,w*.085,h*.795,w*.83,h*.055,u*.024,t.bg);}
   rect(w*.055,h*.905,w*.89,2,t.ink);text(t.detail,w*.055,h*.928,w*.54,h*.045,u*.020);text(t.cta+' ↗',w*.62,h*.928,w*.325,h*.045,u*.022,t.ink,'Arial',{align:'right'});
 }
 return d;
}
