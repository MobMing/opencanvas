const promoAssetInfo={
 nightlife:{kind:'People',description:'fictional woman DJ in blue and magenta club lighting'},
 creator:{kind:'People',description:'fictional creative professional in a sunlit studio'},
 wellness:{kind:'People',description:'fictional fitness instructor beside a studio window'},
 fashion:{kind:'People',description:'fictional fashion model in a cream blazer'},
 'dj-vinyl':{kind:'People',description:'fictional male vinyl selector in an amber listening bar'},
 'dj-techno':{kind:'People',description:'fictional silver-haired woman DJ in an industrial basement'},
 warehouse:{kind:'Crowds & places',description:'fictional warehouse dancefloor crowd and green lasers'},
 vinyl:{kind:'Equipment',description:'vinyl records, turntable and headphones on cobalt blue'},
 rooftop:{kind:'Crowds & places',description:'fictional friends at a golden-hour rooftop gathering'},
 performer:{kind:'People',description:'fictional singer on a red and blue live stage'},
 'creator-street':{kind:'People',description:'fictional creative duo in expressive streetwear'},
 'beauty-still':{kind:'Products',description:'unbranded skincare and soap still life in warm sunlight'},
 'dj-disco':{kind:'People',description:'fictional curly-haired male DJ in a colorful disco room'},
 chrome:{kind:'Abstract',description:'iridescent liquid-chrome ring on black'}
};
const promoLayoutNames=['Spotlight','Scene poster','Split column','Ticket','Artist lineup','Zine collage','Record sleeve','Magazine','Minimal editorial','Contact sheet','Geometric poster','Type-led'];
function expandPromoCampaigns(campaigns){
 const assignments={afterglow:['dj-techno',0],houseparty:['dj-disco',6],bassline:['vinyl',11],rooftop:['rooftop',1],womenondecks:['nightlife',4,'dj-techno'],latenight:['warehouse',1],openmic:['performer',3],podcast:['creator',7],speaker:['creator-street',2],masterclass:['creator',11],creatorlaunch:['creator-street',5,'creator'],portfolio:['fashion',9,'creator-street','performer'],agency:['chrome',11],networking:['rooftop',9,'creator-street','creator'],fitness:['wellness',0],pilates:['wellness',8],yoga:['wellness',7],dance:['performer',10],runclub:['wellness',2],wellnessday:['beauty-still',8],instructor:['wellness',3],studioopening:['wellness',6],beautydrop:['beauty-still',8],salon:['fashion',0],fashionedit:['creator-street',7],styleevent:['fashion',2],collab:['creator-street',5,'fashion'],coverstory:['fashion',7],popupstyle:['creator-street',9,'fashion','beauty-still'],saleedit:['beauty-still',10],creativeclub:['creator-street',4,'creator'],livestream:['dj-vinyl',3]};
 for(const t of campaigns){const [asset,layout,secondary,tertiary]=assignments[t.key];Object.assign(t,{asset,layout,secondary,tertiary});}
 const additions=[
  ['warehouse-signal','WAREHOUSE\nSIGNAL','warehouse',1,'One room. One shared frequency.','SAT / 11 PM—LATE','FIND THE FLOOR','underground rave techno industrial warehouse lasers','#101810','#d8fa99','#6f9c55'],
  ['selector-session','SELECTOR\nSESSIONS','dj-vinyl',7,'Deep cuts from the listening bar.','FRIDAY / 8 PM','RESERVE YOUR SPOT','dj vinyl jazz soul listening bar disco selectors','#e4cfab','#25221d','#ac5937'],
  ['back-to-back','BACK\nTO BACK','dj-techno',4,'Two selectors. No boundaries.','SATURDAY / 10 PM','MEET THE LINEUP','dj b2b back to back techno rave lineup underground','#14161c','#f1efde','#ff634d','dj-vinyl'],
  ['acid-orbit','ACID\nORBIT','chrome',11,'Signals from the next dimension.','FRIDAY / MIDNIGHT','ENTER THE ORBIT','underground rave acid techno psychedelic futuristic abstract','#080909','#d5fc58','#a37de5'],
  ['disco-social','DISCO\nSOCIAL','dj-disco',10,'Good records. Better company.','SATURDAY / 9 PM','JOIN THE DANCE','dj disco funk boogie retro party social','#e9a2bb','#4c1841','#fff0b1'],
  ['vinyl-only','VINYL\nONLY','vinyl',6,'All analog. All night.','THURSDAY / 8 PM','COME LISTEN','dj vinyl records turntable house music equipment','#084ccd','#f2f2db','#1a202d'],
  ['basement-pass','BASEMENT\nPASS','dj-techno',3,'A ticket to the deeper end.','SAT / 23:00','GET YOUR PASS','underground rave basement techno ticket industrial','#e3422f','#161916','#eacdb1'],
  ['floor-report','FLOOR\nREPORT','warehouse',9,'Scenes from a night to remember.','WEEKEND RECAP / VOL 01','SHARE YOUR MOMENT','underground rave social media promo recap crowd event photo dump','#12171d','#edeed9','#9bc88b','dj-disco','vinyl'],
  ['sunset-selects','SUNSET\nSELECTS','rooftop',5,'Your golden-hour soundtrack.','SUNDAY / 5 PM','SAVE THE DATE','dj rooftop sunset afro house amapiano social promo','#eee0c4','#5e3430','#d97240','dj-vinyl'],
  ['live-room','THE\nLIVE ROOM','performer',0,'A voice. A room. A moment.','FRIDAY / 7 PM','BOOK YOUR TICKET','live singer concert performance entertainment social media promo','#221b36','#ead0ad','#db4544'],
  ['creator-takeover','CREATOR\nTAKEOVER','creator-street',5,'Fresh perspectives, front and center.','THIS WEEK / ON OUR FEED','FOLLOW ALONG','social media promo creator ugc takeover collaboration brand marketing','#dedcd0','#2d4938','#8d60b8','fashion'],
  ['drop-day','DROP\nDAY','beauty-still',8,'The next good thing in your routine.','NEW ARRIVAL / FRIDAY','EXPLORE THE DROP','social media promo product launch skincare sale beauty marketing','#f1d4bd','#783c2c','#b8a1c4'],
  ['guest-mix','GUEST\nMIX 001','dj-vinyl',2,'A new selector in your headphones.','NEW MIX / LISTEN TODAY','PRESS PLAY','dj guest mix soundcloud podcast music social media promo','#cfdfdc','#253c3b','#e09b5c'],
  ['rave-transmission','RAVE\nTRANSMISSION','chrome',6,'Tune out. Lock in.','SATURDAY / 11 PM','TUNE IN','underground rave techno edm electronic acid abstract','#11131c','#d3fa73','#aa90de'],
  ['crew-culture','CREW\nCULTURE','creator-street',9,'The people behind the next wave.','COMMUNITY SPOTLIGHT / 01','MEET THE CREW','social media promo collective crew streetwear community marketing','#d7ddaf','#302b4c','#db805c','performer','dj-disco'],
  ['last-entry','LAST\nENTRY','warehouse',11,'One more night before sunrise.','TONIGHT / DOORS 11 PM','LAST CALL','underground rave techno last minute ticket sale social media promo','#141914','#e6f5c8','#8bbb64']
 ];
 additions.forEach(([key,title,asset,layout,sub,detail,cta,tags,bg,ink,accent,secondary,tertiary])=>campaigns.push({key,title,asset,layout,sub,detail,cta,tags,bg,ink,accent,secondary,tertiary,topic:['creator-takeover','drop-day','crew-culture'].includes(key)?'Marketing':'Music & DJ',font:layout===7||layout===8?'Georgia':'Impact'}));
 for(const t of campaigns){
  t.secondary=t.secondary||({People:'creator-street','Crowds & places':'dj-disco',Equipment:'chrome',Products:'beauty-still',Abstract:'vinyl'}[promoAssetInfo[t.asset].kind]);
  if(t.secondary===t.asset)t.secondary=t.asset==='creator'?'fashion':'creator';
  t.tertiary=t.tertiary||(['Music & DJ','Entertainment'].includes(t.topic)?['vinyl','warehouse','dj-disco']:['creator','fashion','creator-street']).find(id=>id!==t.asset&&id!==t.secondary);
  t.layoutName=promoLayoutNames[t.layout];
  t.style=['Bold','Neon','Bold','Retro','Bold','Editorial','Retro','Editorial','Minimal','Editorial','Playful','Bold'][t.layout];
  // Only count secondary images for layouts which actually display them.
  t.assetIds=[t.asset,...([2,4,5,9].includes(t.layout)?[t.secondary]:[]),...(t.layout===9?[t.tertiary]:[])];
  t.imagery=promoAssetInfo[t.asset].kind;
  t.hasPeople=t.assetIds.some(id=>['People','Crowds & places'].includes(promoAssetInfo[id].kind));
  t.tags+=' '+t.layoutName+' '+t.imagery+' '+(t.hasPeople?'people':'no people');
 }
}

function promoTemplateImagery(t,format){
 const multi=format==='cover'?[2,4,5,9].includes(t.layout):[4,5,9].includes(t.layout);
 const three=format==='cover'?[5,9].includes(t.layout):t.layout===9;
 const assetIds=[t.asset,...(multi?[t.secondary]:[]),...(three?[t.tertiary]:[])];
 return {assetIds,hasPeople:assetIds.some(id=>['People','Crowds & places'].includes(promoAssetInfo[id].kind))};
}
