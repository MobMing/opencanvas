// Original, category-specific compositions. Every mark is an editable native layer.
// No downloaded artwork, generated portraits, or external image/font requests.
const categoryCollectionRows=[
 ['room-003','ROOM 003','Music & DJ','Industrial room plan','Bold',1080,1350,'#171b1c','#f1f0db','#e76736','dj techno underground rave warehouse set times line up club music'],
 ['between-chapters','Between Chapters','Podcast','Overlapping conversation','Editorial',1080,1080,'#e9e4dc','#343558','#dd7957','podcast cover interview books conversation episode audio'],
 ['first-5k','Your First 5K','Fitness','Race bib and route','Bold',1080,1350,'#eef2d9','#193f46','#e76542','running run club fitness beginner 5k training workout'],
 ['small-reset','The Small Reset','Wellness','Four-step pause card','Minimal',1080,1080,'#dce8e0','#284a40','#b77056','wellness mindfulness breathing pause rest routine reminder'],
 ['shade-lab','The Shade Lab','Beauty','Nail swatch appointment','Playful',1080,1350,'#f8e6e3','#572847','#d96873','beauty nail salon manicure color appointment booking'],
 ['night-market','Night Market Bites','Food & Drink','Noodle bar menu','Retro',1080,1350,'#f5edcc','#1d5349','#d84932','food restaurant menu noodles night market pop up dinner ramen'],
 ['co-op-quest','Co-op Quest','Gaming','Tabletop adventure map','Playful',1080,1350,'#e8d8ae','#243d42','#a34f37','gaming tabletop board games cooperative game night community quest'],
 ['science-club','Science After School','Education','Lab bench bulletin','Bold',1080,1350,'#ddecf0','#143d61','#ffac35','education science after school stem experiment club children workshop'],
 ['open-doors','Open Doors','Real Estate','Property floor-plan listing','Minimal',1080,1350,'#f3efe7','#334d5e','#b9784f','real estate open house listing apartment floor plan property realtor home'],
 ['garden-vows','Mina & Leo','Weddings','Botanical arch invitation','Classic',1080,1350,'#faf4e8','#4f5e42','#b98c67','wedding invitation garden botanical marriage ceremony reception rsvp'],
 ['longer-table','A Longer Table','Faith & Community','Shared-table invitation','Retro',1080,1350,'#f5dfb7','#624337','#7b8860','faith community potluck gathering neighbors fellowship meal church'],
 ['pantry-full','Keep the Pantry Full','Nonprofit','Donation basket checklist','Bold',1080,1350,'#f0eeda','#223e62','#db6849','nonprofit food pantry donation charity community collection drive volunteer'],
 ['lost-companion','Help Milo Get Home','Pets','Lost companion notice','Minimal',1080,1350,'#fff8e6','#243c4c','#d38b39','pets lost cat missing animal rescue neighborhood flyer contact'],
 ['mend-make','Mend & Make','Crafts','Stitched sampler workshop','Retro',1080,1350,'#f2e9d7','#403d63','#c36543','crafts sewing visible mending repair textile workshop handmade embroidery'],
 ['afterword','The Afterword','Books','Library spine reading club','Editorial',1080,1350,'#292d44','#ece3cb','#d5925e','books reading book club literature library monthly discussion fiction'],
 ['lisbon-weekend','48 Hours in Lisbon','Travel','Tram route city itinerary','Editorial',1440,900,'#f4e5b7','#265276','#c96546','travel lisbon portugal city weekend itinerary walking tram guide tourism'],
 ['light-study','Light Study','Photography','Studio contact-sheet frames','Minimal',1080,1350,'#e6e5df','#292f38','#b04d42','photography studio portrait mini session photographer booking contact sheet'],
 ['good-neighbors','Good Neighbors Club','Small Business','Neighborhood loyalty card','Playful',1080,1080,'#eadbd2','#603b4b','#9eaa72','small business loyalty coffee shop card rewards stamp local retail cafe'],
 ['build-night','Build Night','Technology','Terminal event board','Bold',1080,1350,'#172a3e','#dfebda','#a9dd6d','technology tech coding meetup hackathon developers demo workshop software'],
 ['court-culture','Court Culture','Sports','Half-court game poster','Bold',1080,1350,'#e47c49','#202d48','#f4e7c9','sports basketball court pickup community tournament game training'],
 ['cuttings-company','Cuttings & Company','Gardening','Propagation exchange labels','Classic',1080,1350,'#e7edda','#365541','#d08a55','gardening plants cuttings propagation swap exchange garden leaves'],
 ['forty-flourishing','Forty & Flourishing','Celebrations','Candle garden invitation','Playful',1080,1350,'#f5dfd9','#7b3b55','#bf723f','celebrations birthday forty 40 milestone invitation dinner party'],
 ['curtain-up','Curtain Up','Entertainment','Theatre seat and ticket','Classic',1080,1350,'#382c41','#f7dfb6','#c36857','entertainment theatre theater stage play performance opening night tickets'],
 ['made-to-launch','Made to Launch','Marketing','Campaign launch dashboard','Editorial',1440,900,'#e9edf0','#253f59','#dc7551','marketing campaign launch content strategy brief social media promo planner'],
 ['rework-edit','The Rework Edit','Fashion','Garment construction lookbook','Editorial',1080,1350,'#e9e1d3','#333b36','#8e5c48','fashion upcycle rework clothing collection lookbook sustainable garment pop up'],
 ['grow-note','The Weekly Grow Note','Gardening','Plant-care notebook','Minimal',1080,1350,'#f3efd9','#405445','#b49b54','gardening plant care weekly log notebook watering light propagation notes']
];
const categoryTemplates=categoryCollectionRows.map(([key,name,topic,layoutName,style,width,height,bg,ink,accent,tags])=>({
 id:'category-'+key,key,name,title:name,topic,layoutName,style,width,height,bg,ink,accent,tags,
 category:width>height?'Social':height===width?'Social':'Poster',
 format:width>height?'cover':height===width?'square':'post',collection:'category-stories',
 aiImagery:false,hasPeople:false,imagery:'Shapes & symbols',assetIds:[],
 detail:'Original category-specific composition · Editable text and illustrations'
}));
function makeCategoryDesign(t){
 if(!t||!categoryTemplates.some(item=>item.id===t.id))throw Error('Unknown category template.');
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements;
 const R=(x,y,w,h,c=t.ink,k='rect',extra={})=>{const e=shape(x,y,w,h,c,k);Object.assign(e,extra);a.push(e);return e;};
 const C=(x,y,s,c=t.ink)=>R(x,y,s,s,c,'ellipse');
 const T=(v,x,y,w,h,size=30,c=t.ink,font='DM Sans',extra={})=>{const lineHeight=extra.lineHeight||1.05,fitted=Math.min(size,h/(String(v).split('\n').length*lineHeight));const e=txt(v,x,y,w,fitted,c,{h,font,weight:font==='Cormorant Garamond'?'400':'700',lineHeight,...extra});a.push(e);return e;};
 const rule=(x,y,w,c=t.ink,h=2)=>R(x,y,w,h,c);
 const dots=(x,y,count,gap=25,c=t.ink)=>{for(let i=0;i<count;i++)C(x+i*gap,y,7,c);};
 const line=(x1,y1,x2,y2,c=t.ink,thickness=3)=>{const len=Math.hypot(x2-x1,y2-y1);return R((x1+x2)/2-len/2,(y1+y2)/2-thickness/2,len,thickness,c,'rect',{rotation:Math.atan2(y2-y1,x2-x1)*180/Math.PI});};
 const leaf=(x,y,w,h,c=t.ink,angle=0)=>R(x,y,w,h,c,'ellipse',{rotation:angle});
 const tag=(text,x,y,w,c=t.accent,ink=t.bg)=>{R(x,y,w,51,c);T(text,x+14,y+10,w-28,33,23,ink);};
 const footer=(text='YOUR DETAILS / YOUR WEBSITE',y=d.height-72)=>{rule(58,y-18,d.width-116);T(text,58,y,d.width-116,40,24);};
 switch(t.key){
 case 'room-003':{
  T('THE INDEPENDENT SOUND SERIES',60,48,960,40,23,t.accent);T('ROOM',54,128,970,170,165,t.ink,'Anton');
  T('003',52,300,530,310,295,t.accent,'Anton');T('FRI\n23 OCT\n22:00',650,333,370,220,61,t.ink,'Bebas Neue');
  rule(60,634,960,t.ink,4);R(60,680,338,318,t.ink);R(77,697,304,284,t.bg);
  for(const [x,y,s]of[[103,720,105],[242,720,105],[142,850,160]]){C(x,y,s,t.ink);C(x+15,y+15,s-30,t.bg);C(x+s/2-9,y+s/2-9,18,t.accent);}
  T('LOW END\nHIGH INTENT',450,684,570,150,68,t.ink,'Bebas Neue');T('22:00   OPENING SELECTORS\n00:00   RESIDENT SESSION\n02:00   THE CLOSING SET',450,870,570,130,30,t.ink,'DM Sans',{weight:'400',lineHeight:1.3});
  tag('HOUSE / TECHNO / ALL NIGHT',60,1060,960);T('YOUR WAREHOUSE / YOUR CITY',60,1150,960,50,36);footer('TICKETS + ACCESS INFORMATION / YOUR WEBSITE');break;}
 case 'between-chapters':{
  T('A PODCAST ABOUT THE STORIES WE KEEP',70,55,940,40,22);R(70,150,725,350,'#c9c8df','round');R(300,370,710,335,'#e7b09a','round');
  R(150,425,100,80,'#c9c8df','triangle',{rotation:180});R(800,630,100,90,'#e7b09a','triangle',{rotation:180});
  T('Between',105,195,850,140,116,t.ink,'Cormorant Garamond',{style:'italic'});T('CHAPTERS',330,430,640,145,100,t.ink,'Bebas Neue');
  for(let i=0;i<29;i++){const h=12+Math.abs(Math.sin(i*1.37))*75;R(100+i*31,770-h/2,12,h,t.ink,'round');}
  T('WITH YOUR HOST NAME',70,875,940,45,30);T('NEW CONVERSATIONS / EVERY TUESDAY',70,955,940,42,25,t.ink,'DM Sans',{weight:'400'});break;}
 case 'first-5k':{
  tag('YOUR NEIGHBORHOOD RUN CLUB',60,55,960,t.ink);T('YOUR\nFIRST 5K',60,170,960,305,140,t.ink,'Anton');
  R(60,515,505,405,'#ffffff','round');T('YOU BELONG\nAT THE START.',95,555,435,95,42);T('005K',95,700,435,150,130,t.accent,'Bebas Neue');
  for(const p of [[670,535,920,535],[920,535,920,705],[920,705,700,705],[700,705,700,900]])line(...p,t.accent,15);
  for(const [x,y,n]of[[646,511,'1'],[896,681,'2'],[676,876,'3']]){C(x,y,52,t.ink);T(n,x,y+9,52,38,28,t.bg,'DM Sans',{align:'center'});}
  T('WALK / JOG / RUN',60,985,960,60,52,t.ink,'Bebas Neue');T('SATURDAY / 8:30 AM\nMEET AT YOUR LOCAL PARK',60,1070,960,100,36,t.ink,'DM Sans',{weight:'400'});footer('ALL PACES WELCOME / SIGN UP: YOUR WEBSITE');break;}
 case 'small-reset':{
  T('A MOMENT YOU CAN MAKE YOUR OWN',65,48,950,35,22);T('The small\nreset.',65,120,600,235,108,t.ink,'Cormorant Garamond');
  C(760,155,230,'#b8cfbd');C(815,210,120,t.bg);C(860,255,30,t.accent);
  const rows=[['01','Pause','Put down what can wait.'],['02','Notice','Find one thing around you.'],['03','Breathe','Take a comfortable breath.'],['04','Begin','Choose one small next step.']];
  rows.forEach(([n,title,body],i)=>{const x=65+i%2*485,y=430+Math.floor(i/2)*235;R(x,y,465,215,i%3===0?'#f3f0df':'#c9dbcf','round');T(n,x+24,y+24,70,45,31,t.accent);T(title,x+100,y+24,330,60,48);T(body,x+24,y+118,415,65,27,t.ink,'DM Sans',{weight:'400'});});
  T('SAVE THIS FOR A BUSY DAY',65,970,950,40,25);break;}
 case 'shade-lab':{
  T('YOUR NAIL STUDIO / THE COLOR EDIT',60,45,960,40,24);T('THE\nSHADE LAB',60,135,960,270,135,t.ink,'Bebas Neue');
  const colors=['#c46477','#b3724d','#7e8b67','#a49cc0'];
  colors.forEach((c,i)=>{R(75+i*245,490,205,400,c,'round');R(92+i*245,507,27,180,'#f8e6e3','round',{opacity:.26});T(['ROSE','CLAY','SAGE','LILAC'][i],75+i*245,925,205,45,28,t.ink,'DM Sans',{align:'center'});});
  rule(60,1020,960);T('Fresh sets.\nYour kind of color.',60,1070,650,125,52,t.ink,'Cormorant Garamond');tag('BOOK NOW',745,1085,275,t.ink);footer('APPOINTMENTS OPEN / YOUR BOOKING LINK');break;}
 case 'night-market':{
  T('YOUR POP-UP KITCHEN PRESENTS',55,43,970,40,24);T('NIGHT\nMARKET',55,115,970,250,124,t.ink,'Anton');tag('SMALL PLATES. LATE PLANS.',55,405,970);
  R(125,535,830,250,t.accent,'round');R(125,535,830,52,t.ink,'ellipse');R(163,543,754,28,'#e6bd79','ellipse');
  for(let i=0;i<10;i++)R(210+i*67,585,18,95,t.bg,'round');line(290,510,820,460,t.ink,12);line(320,530,848,485,t.ink,12);
  T('THE MENU',60,845,420,60,43,t.ink,'Bebas Neue');T('Chili noodles\nCrispy tofu bites\nSeasonal dumplings',60,925,650,145,35,t.ink,'DM Sans',{weight:'400',lineHeight:1.3});T('$12\n$8\n$10',835,925,190,145,35,t.ink,'DM Sans',{align:'right',lineHeight:1.3});
  T('FRIDAY / 6–10 PM / YOUR MARKET',60,1145,960,60,35);footer('EDIT MENU, PRICES + ALLERGEN INFORMATION FOR YOUR EVENT');break;}
 case 'co-op-quest':{
  T('THE TABLE IS BETTER TOGETHER',60,45,960,40,24);T('CO-OP\nQUEST',60,132,960,255,144,t.ink,'Bebas Neue');
  const path=[[140,505],[440,505],[440,695],[850,695],[850,930],[230,930]];for(let i=1;i<path.length;i++)line(...path[i-1],...path[i],t.accent,10);
  path.forEach(([x,y],i)=>{C(x-31,y-31,62,t.ink);T(String(i+1),x-31,y-22,62,48,35,t.bg,'DM Sans',{align:'center'});});
  R(630,440,240,160,t.ink,'round');T('ADVENTURE\nFOR EVERYONE',650,472,200,105,33,t.bg,'Bebas Neue');
  R(75,650,205,205,t.bg,'round');R(87,662,181,181,t.ink,'round');for(const [x,y]of[[118,695],[207,695],[162,740],[118,785],[207,785]])C(x,y,25,t.bg);
  T('BOARD GAMES / NEW FRIENDS / NO EXPERIENCE NEEDED',60,1050,960,105,35);footer('THURSDAY / 6:30 PM / YOUR COMMUNITY ROOM');break;}
 case 'science-club':{
  tag('AGES 9–12 / HANDS-ON DISCOVERY',60,55,960,t.ink);T('SCIENCE\nAFTER SCHOOL',60,150,960,235,108,t.ink,'Bebas Neue');
  R(80,455,530,430,'#ffffff','round');R(232,505,175,78,t.ink);R(250,570,139,90,t.ink);R(180,650,280,175,t.ink,'round');R(200,680,240,125,t.accent,'round');C(245,710,27,'#ffffff');C(345,755,19,'#ffffff');C(305,595,18,t.accent);
  for(const angle of [0,60,120])R(655,555,335,140,t.accent,'ellipse',{rotation:angle});C(770,600,75,t.ink);T('ASK.\nTEST.\nDISCOVER.',650,785,360,175,55,t.ink,'Bebas Neue');
  T('WEDNESDAYS / 3:30–4:45 PM',60,1010,960,55,40);T('YOUR LEARNING CENTER\nRegister with your parent or caregiver.',60,1105,960,95,31,t.ink,'DM Sans',{weight:'400'});footer('BOOK A PLACE / YOUR WEBSITE');break;}
 case 'open-doors':{
  T('YOUR REAL ESTATE STUDIO',60,45,960,40,25);T('OPEN\nDOORS',60,140,960,230,124,t.ink,'Cormorant Garamond');tag('SUNDAY / 12–3 PM',660,250,360);
  R(60,445,960,545,'#e3e7e5');for(let i=0;i<17;i++)rule(80,465+i*30,920,'#c7d0ce',1);
  const walls=[[135,510,810,12],[135,915,810,12],[135,510,12,405],[933,510,12,405],[505,510,12,270],[505,858,12,70],[505,660,430,12],[735,660,12,255]];walls.forEach(v=>R(...v,t.ink));
  R(180,560,260,95,t.bg,'round');R(182,815,230,45,t.accent);R(550,545,155,75,t.bg);R(785,720,100,150,t.bg);
  T('LIVING',200,700,250,55,30);T('KITCHEN',550,580,170,40,20);T('BEDROOM',540,765,185,40,23);T('BATH',785,785,120,40,23);T('ILLUSTRATIVE PLAN / REPLACE WITH YOUR LISTING',75,955,930,25,18);
  T('YOUR ADDRESS HERE',60,1040,960,70,45);T('2 BED / 1 BATH / 1,080 SQ FT',60,1138,960,50,34,t.ink,'DM Sans',{weight:'400'});footer('CONTACT YOUR AGENT / YOUR PHONE + WEBSITE');break;}
 case 'garden-vows':{
  R(160,100,760,1130,'#e7e7d1','round');R(182,122,716,1086,t.bg,'round');
  for(let side=0;side<2;side++){const x=side?920:110;line(x,320,x-20,1040,t.ink,5);for(let i=0;i<7;i++){leaf(x-65,370+i*90,95,30,t.ink,side?-35:35);leaf(x-8,405+i*90,75,24,'#899578',side?35:-35);}}
  T('TOGETHER WITH THEIR FAMILIES',235,260,610,65,24,t.ink,'DM Sans',{align:'center'});T('Mina\n& Leo',235,390,610,275,125,t.ink,'Cormorant Garamond',{align:'center'});
  T('INVITE YOU TO CELEBRATE\nTHEIR WEDDING',235,735,610,75,27,t.ink,'DM Sans',{align:'center',weight:'400'});T('18 JUNE',235,875,610,80,58,t.accent,'Cormorant Garamond',{align:'center'});T('4 O’CLOCK IN THE AFTERNOON\nYOUR GARDEN VENUE\nRECEPTION TO FOLLOW',235,990,610,130,26,t.ink,'DM Sans',{align:'center',weight:'400',lineHeight:1.4});break;}
 case 'longer-table':{
  T('YOUR COMMUNITY / ALL ARE WELCOME',60,50,960,40,24);T('A longer\ntable.',60,145,960,240,126,t.ink,'Cormorant Garamond');
  R(135,505,810,405,t.accent,'round');for(let i=0;i<4;i++){R(195+i*190,450,75,35,t.ink,'round');R(195+i*190,930,75,35,t.ink,'round');}
  for(let i=0;i<3;i++){C(195+i*260,565,165,t.bg);C(215+i*260,585,125,'#e8c593');C(248+i*260,618,59,t.accent);}
  for(let i=0;i<4;i++){R(215+i*180,790,9,68,t.bg);R(240+i*180,790,9,68,t.bg);}
  T('COMMUNITY POTLUCK',60,1020,960,65,54,t.ink,'Bebas Neue');T('SUNDAY / 5 PM / YOUR COMMUNITY HALL',60,1110,960,60,31);footer('BRING A DISH IF YOU CAN / DIETARY + ACCESS DETAILS: YOUR WEBSITE');break;}
 case 'pantry-full':{
  tag('YOUR NEIGHBORHOOD FOOD DRIVE',60,55,960,t.ink);T('KEEP THE\nPANTRY FULL',60,165,960,235,113,t.ink,'Anton');
  R(65,475,450,480,'#d5dfda','round');R(145,545,110,200,t.accent,'round');R(285,590,125,170,t.ink);T('RICE',297,648,100,50,32,t.bg,'Bebas Neue');R(105,765,365,120,t.ink,'round');for(let i=0;i<7;i++)R(128+i*47,786,20,76,t.bg);
  T('MOST NEEDED',570,485,450,60,42,t.ink,'Bebas Neue');['Unopened pantry staples','Canned vegetables','Rice, pasta + cereal','Baby-care essentials'].forEach((v,i)=>{R(570,594+i*90,26,26,t.accent);T(v,615,582+i*90,405,65,29,t.ink,'DM Sans',{weight:'400'});});
  T('DROP OFF / SATURDAY / 10 AM–2 PM',60,1060,960,55,35);T('YOUR COLLECTION POINT',60,1145,960,55,36);footer('CHECK ACCEPTED ITEMS + DATES / YOUR WEBSITE');break;}
 case 'lost-companion':{
  T('MISSING CAT / YOUR NEIGHBORHOOD',60,45,960,40,25);T('HELP MILO\nGET HOME',60,145,960,225,112,t.ink,'Bebas Neue');
  R(60,430,540,610,'#e4dbbd','round');R(160,500,340,330,t.ink,'ellipse');R(172,465,130,150,t.ink,'triangle',{rotation:-18});R(365,465,130,150,t.ink,'triangle',{rotation:18});C(240,655,30,t.bg);C(385,655,30,t.bg);R(305,715,45,35,t.accent,'triangle',{rotation:180});R(185,830,290,155,t.ink,'round');
  T('REPLACE ILLUSTRATION WITH YOUR PET’S PHOTO',85,1000,490,30,16);T('LAST SEEN',645,450,375,55,39,t.ink,'Bebas Neue');T('YOUR STREET\nYOUR DATE\n\nDETAILS\nTabby coat\nGreen collar\nMicrochipped',645,535,375,370,31,t.ink,'DM Sans',{weight:'400',lineHeight:1.3});
  T('SEEN MILO? PLEASE CALL',60,1095,960,50,35);T('YOUR PHONE NUMBER',60,1175,960,65,51,t.accent,'Bebas Neue');break;}
 case 'mend-make':{
  for(let i=0;i<27;i++){R(35+i*38,35,18,4,t.accent);R(35+i*38,1310,18,4,t.accent);}for(let i=0;i<33;i++){R(35,55+i*38,4,18,t.accent);R(1037,55+i*38,4,18,t.accent);}
  T('A VISIBLE MENDING WORKSHOP',82,90,916,40,23);T('Mend\n& make.',82,190,916,245,124,t.ink,'Cormorant Garamond');
  R(110,520,405,345,'#d19c79');R(135,545,355,295,'#7a839b');for(let i=0;i<9;i++)rule(154,568+i*30,316,t.bg,3);for(let i=0;i<10;i++)R(160+i*33,560,3,260,t.bg);
  R(680,530,185,270,t.accent);R(655,510,235,35,t.ink,'round');R(655,790,235,35,t.ink,'round');for(let i=0;i<12;i++)rule(690,550+i*19,165,t.bg,4);line(600,850,935,645,t.ink,8);
  T('BRING A WORN PIECE.\nLEAVE WITH A NEW SKILL.',82,940,916,130,48,t.ink,'Bebas Neue');T('SATURDAY / 2–4 PM / YOUR STUDIO',82,1130,916,55,30);T('MATERIALS PROVIDED / BOOK: YOUR WEBSITE',82,1220,916,40,25);break;}
 case 'afterword':{
  T('THE NEIGHBORHOOD READING ROOM',60,52,960,40,23,t.accent);T('The\nAfterword',60,165,960,240,118,t.ink,'Cormorant Garamond');
  const spines=[['FICTION',100,575,130,370,t.accent],['ESSAYS',245,515,110,430,'#8e9c87'],['POETRY',370,610,130,335,'#c1b08f'],['IDEAS',515,550,100,395,'#aa8091'],['STORIES',630,490,145,455,'#677c95'],['ONE MORE',790,595,185,350,t.accent]];
  spines.forEach(([label,x,y,w,h,c])=>{R(x,y,w,h,c);rule(x+14,y+20,w-28,t.bg,3);T(label,x+12,y+65,w-24,h-90,25,t.bg,'Bebas Neue',{align:'center'});});rule(65,954,950,t.ink,8);
  T('ONE BOOK. MANY PERSPECTIVES.',60,1030,960,55,43,t.accent,'Bebas Neue');T('FIRST WEDNESDAY / 6:30 PM\nTHIS MONTH’S BOOK: YOUR TITLE HERE',60,1120,960,115,32,t.ink,'DM Sans',{weight:'400',lineHeight:1.3});break;}
 case 'lisbon-weekend':{
  T('THE SLOW CITY GUIDE / YOUR TRAVEL JOURNAL',55,42,1330,35,23);T('48 HOURS\nIN LISBON',55,130,720,230,116,t.ink,'Bebas Neue');
  R(55,430,520,305,t.accent,'round');R(85,460,460,165,t.bg,'round');for(let i=0;i<4;i++)R(106+i*110,481,86,120,t.ink,'round');C(115,705,70,t.ink);C(445,705,70,t.ink);line(150,430,280,370,t.ink,5);line(280,370,410,430,t.ink,5);T('28',65,650,500,70,54,t.bg,'Bebas Neue',{align:'center'});
  line(820,165,820,740,t.accent,8);const stops=[['01','ALFAMA','Walk the lanes. Find a café.'],['02','THE RIVER','An unhurried afternoon by the water.'],['03','MIRADOURO','Save time for the evening view.']];stops.forEach(([n,title,sub],i)=>{const y=155+i*220;C(793,y,55,t.ink);T(n,793,y+10,55,40,26,t.bg,'DM Sans',{align:'center'});T(title,885,y,490,65,49,t.ink,'Bebas Neue');T(sub,885,y+80,490,90,30,t.ink,'DM Sans',{weight:'400'});});footer('EDIT WITH YOUR FAVORITE STOPS / SAVE FOR YOUR NEXT WEEKEND',824);break;}
 case 'light-study':{
  T('YOUR PHOTOGRAPHY STUDIO',60,45,960,40,23);T('Light study',60,135,960,150,117,t.ink,'Cormorant Garamond');T('PORTRAIT MINI SESSIONS / AUTUMN EDITION',60,315,960,50,28);
  const frames=[[60,425,565,470,'#b6bab2'],[650,425,370,225,'#cbb6a0'],[650,675,370,470,'#afb9c3']];frames.forEach(([x,y,w,h,c],i)=>{R(x,y,w,h,t.ink);R(x+13,y+13,w-26,h-26,c);R(x+35,y+30,w*.4,h-60,t.bg,'rect',{opacity:.55});T(String(i+1).padStart(2,'0'),x+28,y+30,110,60,36);});
  C(195,505,260,t.ink);C(215,525,220,'#b6bab2');for(let i=0;i<6;i++){const angle=i*Math.PI/3;line(325,635,325+95*Math.cos(angle),635+95*Math.sin(angle),t.ink,13);}
  T('20 MINUTES\nONE GOOD LIGHT\nYOUR OWN STORY',60,955,540,180,43,t.ink,'Bebas Neue');footer('REPLACE THE GRAPHIC FRAMES WITH YOUR WORK / BOOK: YOUR WEBSITE');break;}
 case 'good-neighbors':{
  T('YOUR LOCAL COFFEE SHOP',65,48,950,40,24);T('Good\nneighbors\nclub.',65,135,620,300,104,t.ink,'Cormorant Garamond');C(750,180,235,t.accent);T('A LITTLE\nTHANK YOU',780,235,175,105,33,t.ink,'Bebas Neue',{align:'center'});
  for(let i=0;i<10;i++){const x=75+i%5*195,y=535+Math.floor(i/5)*175;C(x,y,155,t.accent);C(x+9,y+9,137,t.bg);if(i<3){R(x+52,y+35,52,83,t.ink,'ellipse',{rotation:28});line(x+68,y+48,x+82,y+103,t.bg,4);}else T(String(i+1),x,y+43,155,65,43,t.ink,'Cormorant Garamond',{align:'center'});}
  T('TEN STAMPS / ONE HOUSE COFFEE',65,930,950,50,35,t.ink,'Bebas Neue');T('YOUR REWARD TERMS HERE',65,1010,950,30,22);break;}
 case 'build-night':{
  T('YOUR LOCAL DEVELOPER COMMUNITY',60,50,960,45,24,t.accent);T('BUILD\nNIGHT',60,145,960,240,132,t.ink,'Bebas Neue');
  R(60,445,960,500,'#0d1c29','round');R(60,445,960,60,'#35506a','round');for(let i=0;i<3;i++)C(85+i*40,466,18,['#d57865','#e4bd62','#9abf76'][i]);T('ideas / tonight',300,462,650,36,23,t.ink,'Courier New');
  T('> bring_an_idea();\n> find_a_collaborator();\n> make_a_small_thing();\n\n// all experience levels\n// welcome here',100,560,880,315,39,t.accent,'Courier New',{weight:'400',lineHeight:1.3});
  T('18:00  HELLO + IDEAS\n18:30  BUILD TOGETHER\n20:30  FIVE-MINUTE DEMOS',60,1000,960,155,35,t.ink,'DM Sans',{weight:'400',lineHeight:1.35});footer('THURSDAY / YOUR WORKSPACE / RSVP: YOUR WEBSITE');break;}
 case 'court-culture':{
  T('COMMUNITY BASKETBALL / OPEN RUN',60,45,960,40,24);T('COURT\nCULTURE',60,140,960,235,125,t.ink,'Anton');
  R(60,450,960,525,t.ink);R(76,466,928,493,t.bg);R(386,466,308,285,t.ink);R(399,466,282,272,t.bg);C(390,602,300,t.ink);C(402,614,276,t.bg);R(399,466,282,280,t.bg);rule(447,505,186,t.ink,6);C(504,529,72,t.ink);C(514,539,52,t.bg);rule(76,930,928,t.ink,5);
  T('SATURDAY / 10 AM–1 PM',60,1030,960,60,46,t.ink,'Bebas Neue');T('YOUR COMMUNITY COURTS\nPICKUP GAMES / ALL SKILL LEVELS',60,1125,960,110,32,t.ink,'DM Sans',{weight:'400',lineHeight:1.35});T('REGISTER YOUR SPOT / YOUR WEBSITE',60,1270,960,40,24);break;}
 case 'cuttings-company':{
  T('A NEIGHBORHOOD PLANT EXCHANGE',60,50,960,45,24);T('Cuttings\n& company',60,140,960,245,113,t.ink,'Cormorant Garamond');
  const pots=[[105,595,220,300],[430,520,220,375],[755,635,220,260]];
  pots.forEach(([x,y,w,h],i)=>{R(x,y+115,w,h-115,'#bdc9ac','round');R(x+16,y+130,w-32,h-146,t.bg,'round');line(x+w/2,y+145,x+w/2,y-100,t.ink,7);leaf(x+20,y-20,120,42,t.ink,-30);leaf(x+95,y-100,125,44,'#748867',30);leaf(x+95,y+15,112,38,t.ink,30);T(['ROOTED','READY','SHARE'][i],x-10,940,w+20,55,35,t.ink,'Bebas Neue',{align:'center'});});
  T('BRING A CUTTING.\nTAKE HOME A NEW FAVORITE.',60,1045,960,120,43);footer('SUNDAY / 10 AM–NOON / YOUR COMMUNITY GARDEN');break;}
 case 'forty-flourishing':{
  T('YOU’RE INVITED TO CELEBRATE',65,55,950,45,24,t.ink,'DM Sans',{align:'center'});T('Forty &\nflourishing',65,150,950,245,110,t.ink,'Cormorant Garamond',{align:'center'});
  for(let i=0;i<9;i++){const x=105+i*100,y=580+(i%3)*55,h=405-(i%3)*55;R(x,y,70,h,[t.accent,t.ink,'#b29b97'][i%3],'round');for(let j=0;j<5;j++)rule(x+8,y+38+j*57,54,t.bg,5);R(x+23,y-50,24,35,'#d99f4a','ellipse');}
  T('YOUR NAME / YOUR CELEBRATION',65,1060,950,55,36,t.ink,'Bebas Neue',{align:'center'});T('SATURDAY / 7 PM\nYOUR PLACE / RSVP TO YOUR CONTACT',65,1150,950,100,29,t.ink,'DM Sans',{align:'center',weight:'400',lineHeight:1.35});break;}
 case 'curtain-up':{
  T('YOUR LOCAL THEATRE COMPANY',60,50,960,40,24);T('CURTAIN\nUP',60,145,960,250,139,t.ink,'Bebas Neue');
  R(60,455,960,510,t.accent);R(95,490,890,300,t.ink);T('YOUR\nPRODUCTION',145,545,790,160,83,t.bg,'Bebas Neue');
  for(let row=0;row<3;row++)for(let col=0;col<9;col++)R(123+col*94,820+row*37,55,22,t.bg,'round');
  tag('OPENING NIGHT / FRIDAY / 7:30 PM',60,1030,960,t.ink,t.bg);T('YOUR THEATRE / YOUR CITY',60,1135,960,55,37);footer('RESERVE YOUR SEAT / YOUR BOX OFFICE LINK');break;}
 case 'made-to-launch':{
  T('YOUR BRAND / CAMPAIGN WORKSHOP',55,42,1330,35,23);T('MADE TO\nLAUNCH',55,145,670,230,121,t.ink,'Bebas Neue');
  T('A SMALL PLAN FOR\nA BIG FIRST IMPRESSION.',55,445,590,100,40);T('PRODUCT / YOUR PRODUCT\nLAUNCH DATE / YOUR DATE\nOWNER / YOUR TEAM',55,625,580,150,31,t.ink,'DM Sans',{weight:'400',lineHeight:1.4});
  const rows=[['01','TEASE','One clear reason to care.'],['02','REVEAL','Show the thing. Tell the story.'],['03','INVITE','Give people a next step.']];rows.forEach(([n,title,body],i)=>{const y=135+i*210;R(760,y,625,185,i===1?'#cfdae2':'#f7f7ef','round');tag(n,785,y+25,80,t.accent);T(title,895,y+23,460,60,44,t.ink,'Bebas Neue');T(body,895,y+98,455,70,28,t.ink,'DM Sans',{weight:'400'});});footer('USE AS A CAMPAIGN BRIEF / ADD YOUR CHANNELS, DATES + LINKS',824);break;}
 case 'rework-edit':{
  T('YOUR STUDIO / LIMITED RUN / VOL. 01',60,45,960,40,24);T('THE\nREWORK EDIT',60,140,960,245,120,t.ink,'Bebas Neue');
  R(60,450,600,650,'#c7c5b2');line(195,540,470,540,t.ink,5);line(195,540,330,460,t.ink,5);line(470,540,330,460,t.ink,5);
  R(205,585,250,420,t.accent,'round');R(135,585,105,185,t.accent,'rect',{rotation:16});R(425,585,105,185,t.accent,'rect',{rotation:-16});R(285,570,100,65,'#c7c5b2','ellipse');rule(330,650,3,t.bg,330);for(let i=0;i<5;i++)C(344,690+i*57,12,t.bg);
  T('OLD PIECES.\nNEW POINT\nOF VIEW.',710,470,310,230,61,t.ink,'Bebas Neue');T('REPAIRED\nRECUT\nREIMAGINED',710,810,310,160,36,t.ink,'DM Sans',{weight:'400',lineHeight:1.4});footer('EXPLORE YOUR COLLECTION / YOUR STUDIO OR WEBSITE');break;}
 case 'grow-note':{
  T('YOUR PLANT JOURNAL / WEEK OF __________',60,45,960,40,23);T('The weekly\ngrow note',60,140,960,225,112,t.ink,'Cormorant Garamond');
  line(865,390,865,590,t.ink,6);leaf(780,405,110,38,t.ink,-30);leaf(865,455,105,38,t.accent,30);R(792,580,145,95,t.accent,'round');
  T('PLANT NAME',60,445,650,40,26);rule(60,525,650,t.ink);T('LIGHT + LOCATION',60,580,650,40,26);rule(60,660,650,t.ink);
  const cols=[60,335,610,885],labels=['CHECK','WATER','SOIL','NOTES'];labels.forEach((label,i)=>T(label,cols[i],735,i===3?135:245,45,26));
  ['MON','WED','SAT'].forEach((day,i)=>{const y=815+i*115;rule(60,y-18,960,'#bdc5af');T(day,60,y,230,45,29);R(350,y,34,34,t.ink);R(354,y+4,26,26,t.bg);T('DRY / DAMP',610,y,260,50,27,t.ink,'DM Sans',{weight:'400'});rule(885,y+40,135,t.ink,1);});
  T('ONE THING I NOTICED',60,1190,960,40,26);rule(60,1270,960,t.ink);break;}
 }
 return d;
}
