// Original compositions informed by broad poster traditions, not copied template files.
const waveSubjects=[
 ['rave-lasers','Music & DJ','NEON UNDERCURRENT|ROOM ZERO|LASER SOCIAL|NO SLEEP CLUB|THE LOW END|AFTER MIDNIGHT','UNDERGROUND / TECHNO / HOUSE','underground rave techno warehouse laser nightlife',true],
 ['jazz-trio','Entertainment','BRASS & BLUE|BASEMENT SESSIONS|THE LATE SET|THREE IN THE ROOM|AMBER NOTES|SUNDAY SWING','LIVE JAZZ / SOUL / IMPROVISATION','jazz live music concert trio saxophone',true],
 ['garage-band','Entertainment','GARAGE RADIO|LOUD NEIGHBORS|STATIC YOUTH|SMALL STAGE ENERGY|FEEDBACK CLUB|LOUDER TOGETHER','INDIE / ALTERNATIVE / LIVE','indie punk rock band gig concert garage',true],
 ['disco-friends','Music & DJ','MIRRORBALL PEOPLE|DANCE FLOOR DIARIES|GOOD NIGHT OUT|GLITTER HOURS|FRIDAY FEELING|GROOVE TOGETHER','DISCO / FRIENDS / DANCE','disco funk friends nightlife party dance dj',true],
 ['market-makers','Small Business','MADE IN THE NEIGHBORHOOD|THE WEEKEND MARKET|PEOPLE MAKE THINGS|CRAFTED TOGETHER|LOCAL FINDS|MAKERS IN THE SUN','MAKERS / CERAMICS / PRINT / COMMUNITY','market handmade craft pop up small business vendor',true],
 ['dancer-motion','Fitness','MOVE BEYOND|IN FULL MOTION|BODY IN COLOR|THE OPEN FLOOR|DANCE IN BLOOM|FIND YOUR RHYTHM','DANCE / MOVEMENT / WORKSHOP','dance fitness choreography class workshop',true],
 ['chrome-bloom','Photography','LIQUID GARDEN|FUTURE FORMS|CHROME BLOOM|THE SHAPE SHOW|OBJECTS OF TOMORROW|REFLECTED WORLDS','ART / SCULPTURE / NEW PERSPECTIVES','exhibition art gallery chrome futuristic installation',false],
 ['desert-stage','Music & DJ','HORIZON FREQUENCY|DUSK ASSEMBLY|DESERT TRANSMISSION|OPEN AIR SIGNAL|SOUND BEYOND|THE TWILIGHT FIELD','OPEN AIR / ELECTRONIC / FESTIVAL','festival desert open air dj electronic sunset outdoors',false]
];
const waveLayouts=['Offset manifesto','Analog film border','Diagonal color field','Culture newspaper','Wide artist feature','Square sound card','Perforated admission','Gallery arch','Pinned photo note','Vertical night story','Editorial number','Framed color study'];
const waveStyles=['Bold','Retro','Playful','Editorial','Minimal','Neon','Classic','Editorial','Playful','Bold','Minimal','Editorial'];
const wavePalettes=[['#f3eee2','#192743','#e75e3b'],['#171929','#f8e8c9','#c1e85e'],['#efcee1','#4d285d','#d54920'],['#e6e1d6','#292825','#bd442d'],['#152c37','#e4f0e7','#e4a14a'],['#17251c','#e8f5be','#b5a1ee'],['#f9da88','#48293a','#d54224'],['#edf0df','#23483f','#b16444'],['#e1e8fa','#233991','#d46750'],['#341d30','#ffead8','#e888aa'],['#f7e9e1','#8b253b','#c7ad70'],['#1c2b4c','#f3ead9','#67c1cc']];
const waveTemplates=waveSubjects.flatMap(([key,topic,titles,sub,tags,hasPeople],subject)=>titles.split('|').map((title,v)=>{const layout=(subject*5+v*7)%12,[bg,ink,accent]=wavePalettes[(subject*3+v*5)%12],width=layout===4?1280:1080,height=layout===4?720:layout===5||layout===8?1080:layout===9?1920:1350;return{id:'wave-'+key+'-'+v,name:title,title,key,subject,layout,layoutName:waveLayouts[layout],style:waveStyles[layout],topic,sub,tags:tags+' flyer poster social promo event',bg,ink,accent,width,height,format:layout===4?'cover':layout===9?'story':height===1080?'square':'post',category:layout===9?'Story':'Social',asset:'wave-'+key,assetIds:['wave-'+key],collection:'new-wave',aiImagery:true,hasPeople,imagery:hasPeople?'People':key==='chrome-bloom'?'Abstract':'Crowds & places',detail:subject===4?'SATURDAY / 11 AM–5 PM / YOUR MARKET':subject===5?'YOUR DATE / ALL LEVELS / YOUR STUDIO':subject===6?'OPENING NIGHT / YOUR DATE / YOUR GALLERY':'FRIDAY / DOORS 9 PM / YOUR VENUE'};}));
function makeWaveDesign(t,assets,icons){
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements,W=t.width,H=t.height;
 const r=(x,y,w,h,c=t.ink,k='rect',extra={})=>a.push(shape(x,y,w,h,c,k,extra));
 const tx=(text,x,y,w,h,size,c=t.ink,font='Arial',extra={})=>a.push(txt(text,x,y,w,size,c,{h,font,weight:font==='Georgia'||font==='Kalam'?'400':'700',...extra}));
 const title=(x,y,w,h,size,font='Impact',color=t.ink)=>tx(t.title,x,y,w,h,size,color,font);
 const photo=(x,y,s)=>a.push(base('image',x,y,s,s,{src:assets[t.asset],altText:'Original AI-generated fictional promotional scene: '+t.name+'. No real performer or event is depicted.'}));
 const detail=(x,y,w,size=26,c=t.ink)=>tx(t.detail,x,y,w,65,size,c);
 switch(t.layout){
 case 0:tx('THE INDEPENDENT LIST / 01',60,45,960,45,25);title(60,135,550,310,99);r(670,130,350,290,t.accent);tx('FIND\nYOUR\nPEOPLE',700,160,290,230,52,t.bg);photo(370,490,650);tx('ONE\nGOOD\nNIGHT',60,540,260,310,65,t.ink,'Georgia');detail(60,1220,960);break;
 case 1:r(40,40,1000,1270,t.ink);title(100,85,880,190,100,'Impact',t.bg);photo(150,320,780);for(let y=320;y<1100;y+=110){r(70,y,36,65,t.bg);r(974,y,36,65,t.bg);}tx(t.sub,100,1140,880,65,31,t.bg);detail(100,1230,880,23,t.bg);break;
 case 2:r(35,55,1010,230,t.accent);title(60,75,960,180,103,'Impact',t.bg);photo(60,330,780);r(865,330,155,780,t.ink);for(let i=0;i<5;i++)r(895,370+i*145,95,90,t.accent,'triangle');tx(t.sub,60,1150,960,60,30);detail(60,1240,960,24);break;
 case 3:tx('CULTURE / SOUND / COMMUNITY',55,35,970,45,24);r(55,105,970,4);title(55,145,970,190,108,'Georgia');photo(350,380,675);tx('THE\nLOCAL\nEDITION',55,415,250,240,49);tx('A space for\nnew voices.\nA night to\nremember.',55,760,250,220,33,t.ink,'Georgia');r(55,1100,970,4);tx(t.sub,55,1140,970,65,31);detail(55,1240,970,24);break;
 case 4:r(0,0,570,720,t.ink);tx(t.sub,45,45,470,85,24,t.bg);title(45,200,470,280,88,'Georgia',t.bg);detail(45,590,470,22,t.bg);photo(650,80,560);r(600,80,12,560,t.accent);break;
 case 5:title(45,35,990,200,100);photo(45,285,650);r(740,285,295,650,t.accent);tx('FEEL\nTHE\nMOMENT',775,390,225,330,53,t.bg,'Impact');detail(45,980,990,26);break;
 case 6:r(45,45,990,1260,t.accent);r(70,70,940,1210,t.bg);title(110,110,860,200,99);photo(215,365,650);for(let i=0;i<17;i++)r(110+i*51,1070,22,6);detail(110,1120,860,28);tx('ADMIT ONE / GOOD COMPANY INCLUDED',110,1230,860,40,22);break;
 case 7:r(130,80,820,820,t.accent,'ellipse');photo(190,180,700);r(100,920,880,315,t.ink);title(135,945,810,180,90,'Georgia',t.bg);detail(135,1160,810,24,t.bg);tx(t.sub,100,1280,880,35,21);break;
 case 8:r(40,40,1000,1000,t.accent);r(80,80,920,920,t.bg);title(115,110,850,170,87,'Kalam');photo(315,320,620);tx('SEE\nYOU\nTHERE',110,350,180,300,51,t.ink,'Impact');detail(110,950,860,22);break;
 case 9:tx(t.sub,60,65,960,85,31);title(60,220,960,330,143);photo(60,650,960);r(60,1660,960,170,t.accent);detail(90,1705,900,37,t.bg);break;
 case 10:tx('0'+(t.subject+1),55,40,260,220,200,t.accent,'Georgia');title(355,65,670,190,77);photo(200,340,680);r(55,340,95,680,t.ink);tx(t.sub,200,1075,825,100,34);detail(55,1240,970,26);break;
 case 11:r(50,50,980,1250,t.ink);r(75,75,930,1200,t.bg);tx(t.sub,110,110,860,80,27);photo(140,245,800);r(110,1090,860,145,t.accent);title(135,1110,810,100,68,'Georgia',t.bg);detail(110,1240,860,20);break;
 }
 // Lucide graphics are credited separately, never used as a substitute for a photo.
 const iconName=['music-2','radio','mic-vocal','sparkles','ticket','headphones'][t.subject%6];if(icons?.[iconName]){a.push(base('image',W-42,H-42,28,28,{src:icons[iconName][t.ink],altText:'Lucide '+iconName+' icon; ISC license; Lucide contributors (see bundled LICENSE).'}));}
 return d;
}
