// Original AI city scenes with three editable compositions per destination.
const cityDestinations=[
 ['new-york','NEW YORK','United States','nyc new york city manhattan newyork usa america','#eff0e8','#213b4b','#b76437'],
 ['chicago','CHICAGO','United States','chicago windy city illinois usa america','#e1eaf2','#1c375e','#c49254'],
 ['miami','MIAMI','United States','miami florida south beach art deco usa america','#f6e1d3','#14646a','#c56d74'],
 ['london','LONDON','United Kingdom','london uk united kingdom england britain thames','#ede5d9','#333d50','#a34b41'],
 ['paris','PARIS','France','paris france french eiffel europe','#eee2d4','#634138','#b18670'],
 ['tokyo','TOKYO','Japan','tokyo japan japanese shinjuku asia','#15172b','#f0e9db','#a786d3'],
 ['barcelona','BARCELONA','Spain','barcelona spain spanish catalonia mediterranean europe','#f3dfb6','#326460','#c56b3d'],
 ['winston-salem','WINSTON-SALEM','North Carolina','winston salem winston-salem ws nc north carolina triad downtown usa america','#eee5d8','#47362e','#ab6145']
].map(([key,title,country,aliases,bg,ink,accent])=>({key,title,country,aliases,bg,ink,accent,asset:'city-'+key}));
const cityLayoutNames=['City portrait poster','City social flyer','City travel cover'];
const cityTemplates=[];
for(let layout=0;layout<3;layout++)for(const city of cityDestinations){
 const width=layout===2?1280:1080,height=layout===0?1350:layout===1?1080:720;
 cityTemplates.push({...city,id:'cities-'+city.key+'-'+layout,name:city.title+' · '+['City poster','Afterhours social','Travel journal'][layout],layout,layoutName:cityLayoutNames[layout],width,height,format:layout===2?'cover':layout===1?'square':'post',category:layout===0?'Poster':'Social',topic:layout===1?'Entertainment':'Travel',collection:'cities',style:['Editorial','Bold','Minimal'][layout],aiImagery:true,hasPeople:false,imagery:'Crowds & places',assetIds:[city.asset],tags:city.aliases+' city cities urban skyline skylines architecture travel destination tourism downtown '+['poster print photography','nightlife party dj event promo social media','vlog cover travel journal weekend itinerary'][layout]});
}
function makeCityDesign(t,assets){
 const d={version:1,id:uid(),name:t.name,width:t.width,height:t.height,background:t.bg,elements:[]},a=d.elements;
 const r=(x,y,w,h,c,kind='rect')=>a.push(shape(x,y,w,h,c,kind));
 const tx=(text,x,y,w,h,size,c=t.ink,font='Arial',extra={})=>a.push(txt(text,x,y,w,size,c,{h,font,weight:font==='Arial'?'700':'400',...extra}));
 const p=(x,y,s)=>a.push(base('image',x,y,s,s,{src:assets[t.asset],altText:'AI-generated illustrative city scene inspired by '+t.title+'. Not a verified documentary photograph.'}));
 if(t.layout===0){
  tx('THE CITY COLLECTION / '+t.country.toUpperCase(),55,40,970,55,25);
  r(45,145,990,990,t.ink);p(60,160,960);
  r(45,1000,990,305,t.bg);tx(t.title,65,1030,950,150,112,t.ink,'Georgia');
  tx('YOUR NEXT CITY STORY',65,1220,950,50,30);
 }else if(t.layout===1){
  r(40,40,1000,1000,t.ink);p(390,95,600);
  r(75,130,640,280,t.bg);tx(t.title,95,150,600,130,86,t.ink,'Impact');
  tx('AFTERHOURS SOCIAL',95,310,600,60,37);
  r(75,720,930,280,t.bg);tx('GOOD PEOPLE.\nYOUR CITY. YOUR NIGHT.',100,750,880,120,46);
  tx('YOUR DATE / YOUR VENUE / DOORS 9 PM',100,930,880,45,25);
 }else{
  p(560,0,720);r(0,0,560,720,t.bg);
  tx('WEEKEND JOURNAL',45,45,470,55,29);
  tx(t.title,45,205,470,230,94,t.ink,'Georgia');
  r(45,490,410,3,t.accent);tx(t.country.toUpperCase(),45,530,470,60,30);
  tx('A NEW PLACE. A FRESH PERSPECTIVE.',45,640,470,50,22);
 }
 return d;
}
