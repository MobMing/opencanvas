function typeStyle(raw={}){
  const number=(key,fallback,min,max)=>{const n=raw[key]??fallback;if(typeof n!=='number'||!Number.isFinite(n)||n<min||n>max)throw Error('Invalid text '+key+'.');return n};
  const effect=raw.textEffect??'none';if(!['none','shadow','outline','hollow','glow'].includes(effect))throw Error('Invalid text effect.');
  return {italic:raw.italic===true,lineHeight:number('lineHeight',1.15,.8,2.5),tracking:number('tracking',0,-.03,.3),textEffect:effect,effectColor:/^#[0-9a-f]{6}$/i.test(raw.effectColor||'')?raw.effectColor:'#203e36',effectAmount:number('effectAmount',5,1,15)};
}
function typeFont(e){return (e.italic?'italic ':'')+e.weight+' '+e.size+'px "'+e.font+'"'}
function typeWidth(c,text,e){if(!e.tracking)return c.measureText(text).width;const chars=Array.from(text);return chars.reduce((n,ch)=>n+c.measureText(ch).width,0)+Math.max(0,chars.length-1)*e.tracking*e.size}
function typeLines(c,e){const result=[];for(const paragraph of e.text.split('\n')){if(!paragraph){result.push('');continue}let line='';for(const word of paragraph.split(' ')){const next=line?line+' '+word:word;if(typeWidth(c,next,e)>e.w&&line){result.push(line);line=word}else line=next}result.push(line)}return result}
function paintType(c,e){
  c.save();c.globalAlpha=e.opacity;c.translate(e.x+e.w/2,e.y+e.h/2);c.rotate(e.rotation*Math.PI/180);c.translate(-e.w/2,-e.h/2);c.font=typeFont(e);c.textBaseline='top';c.textAlign='left';c.fillStyle=e.color;c.strokeStyle=e.effectColor||'#203e36';c.lineJoin='round';
  const amount=e.size*(e.effectAmount||5)/100,effect=e.textEffect||'none';c.lineWidth=amount;
  const paint=(text,x,y,stroke)=>{if(!e.tracking){c[stroke?'strokeText':'fillText'](text,x,y);return}for(const ch of Array.from(text)){c[stroke?'strokeText':'fillText'](ch,x,y);x+=c.measureText(ch).width+e.tracking*e.size}};
  typeLines(c,e).forEach((line,i)=>{const w=typeWidth(c,line,e),x=e.align==='center'?(e.w-w)/2:e.align==='right'?e.w-w:0,y=i*e.size*(e.lineHeight||1.15);
    if(effect==='shadow'){c.fillStyle=e.effectColor;paint(line,x+amount,y+amount,false);c.fillStyle=e.color}
    if(effect==='glow'){c.shadowColor=e.effectColor;c.shadowBlur=amount*3;paint(line,x,y,false);c.shadowBlur=0}
    if(effect==='outline'||effect==='hollow')paint(line,x,y,true);
    if(effect!=='hollow')paint(line,x,y,false);
  });c.restore();
}
function typeCombination(preset,width,height,headline='',subtitle=''){
  const factor=Math.min(width/1000,height/700),w=width*.82,parts=preset.parts.map((p,i)=>{const text=(i===0?headline:subtitle).trim()||p.text;return {...p,text:text.slice(0,2000),size:p.size*factor,w,h:p.size*factor*(p.lineHeight||1.15),x:(width-w)/2,y:0,rotation:0,opacity:1,type:'text',align:'center',weight:p.weight||'400',...typeStyle(p)}});
  const total=parts.reduce((n,e)=>n+e.h,0)+Math.max(0,parts.length-1)*14*factor;let y=(height-total)/2;for(const e of parts){e.y=y;y+=e.h+14*factor}return parts;
}
const typePresets=[
 {id:'loud',name:'Loud & clear',category:'Bold',parts:[{text:'MAKE SOME',font:'Bangers',size:128,color:'#ef5b2a',textEffect:'shadow',effectColor:'#173e4e',effectAmount:5},{text:'NOISE',font:'Bangers',size:152,color:'#173e4e'}]},
 {id:'night',name:'Night stories',category:'Spooky',parts:[{text:'AFTER DARK',font:'Creepster',size:132,color:'#7933b2',textEffect:'shadow',effectColor:'#edb54c'},{text:'a little midnight magic',font:'Kalam',size:48,color:'#7933b2'}]},
 {id:'good',name:'Good energy',category:'Playful',parts:[{text:'GOOD',font:'Bangers',size:138,color:'#f39c21',textEffect:'outline',effectColor:'#c94381'},{text:'energy only',font:'Kalam',size:62,color:'#c94381'}]},
 {id:'hand',name:'Human touch',category:'Handwritten',parts:[{text:'made by hand',font:'Kalam',size:98,color:'#275b4a'},{text:'MADE WITH HEART',font:'Arial',size:30,color:'#275b4a',tracking:.18}]},
 {id:'editorial',name:'Quiet confidence',category:'Classic',parts:[{text:'Less, but better.',font:'Georgia',size:84,color:'#483c36',italic:true},{text:'A NOTE FROM THE STUDIO',font:'Arial',size:25,color:'#483c36',tracking:.2}]},
 {id:'electric',name:'Electric nights',category:'Bold',parts:[{text:'ELECTRIC',font:'Impact',size:113,color:'#263c84',textEffect:'outline',effectColor:'#dd57a1',effectAmount:7},{text:'NIGHTS / GOOD PEOPLE',font:'Courier New',size:32,color:'#263c84'}]},
 {id:'boo',name:'Little monsters',category:'Spooky',parts:[{text:'BOO CREW',font:'Creepster',size:130,color:'#f47928',textEffect:'outline',effectColor:'#733daa',effectAmount:5},{text:'come for the treats',font:'Kalam',size:51,color:'#733daa'}]},
 {id:'fresh',name:'Fresh start',category:'Playful',parts:[{text:'FRESH',font:'Bangers',size:150,color:'#23716a',textEffect:'shadow',effectColor:'#c4cd61'},{text:'perspective',font:'Georgia',size:62,color:'#23716a',italic:true}]},
 {id:'weekend',name:'Weekend notes',category:'Handwritten',parts:[{text:'the weekend edit',font:'Kalam',size:85,color:'#ac4936'},{text:'SLOW DAYS. GOOD COMPANY.',font:'Verdana',size:24,color:'#ac4936',tracking:.08}]},
 {id:'outline',name:'Open possibilities',category:'Bold',parts:[{text:'WHAT IF?',font:'Impact',size:130,color:'#203e36',textEffect:'hollow',effectColor:'#203e36',effectAmount:2},{text:'MAKE ROOM FOR POSSIBILITY',font:'Arial',size:27,color:'#203e36',tracking:.12}]},
 {id:'paper',name:'Paper & ink',category:'Classic',parts:[{text:'A story worth telling.',font:'Georgia',size:70,color:'#273c57'},{text:'CHAPTER ONE / YOUR NEXT ADVENTURE',font:'Courier New',size:26,color:'#273c57'}]},
 {id:'spark',name:'Small sparks',category:'Handwritten',parts:[{text:'a little spark',font:'Kalam',size:100,color:'#b94365',textEffect:'shadow',effectColor:'#f3d4bd',effectAmount:4},{text:'CAN CHANGE EVERYTHING',font:'Trebuchet MS',size:30,color:'#b94365',tracking:.1}]}
];
// Original display pairings for editable editorial, club and culture graphics.
typePresets.push(
 {id:'atelier-headliner',name:'The headliner',category:'Bold',parts:[{text:'AFTERHOURS',font:'Anton',size:112,color:'#b3f144',lineHeight:.95},{text:'INDEPENDENT SOUNDS / OPEN MINDS',font:'DM Sans',size:24,color:'#26322d',tracking:.12}]},
 {id:'atelier-editorial',name:'Editorial contrast',category:'Classic',parts:[{text:'The new perspective',font:'Cormorant Garamond',size:92,color:'#902e39',italic:true},{text:'ART / CULTURE / IDEAS',font:'DM Sans',size:25,color:'#902e39',tracking:.18}]},
 {id:'atelier-volume',name:'Maximum volume',category:'Bold',parts:[{text:'TURN IT UP',font:'Bebas Neue',size:156,color:'#202520',lineHeight:.95},{text:'a little louder this time',font:'Caveat',size:57,color:'#dc4732'}]},
 {id:'atelier-soul',name:'Soul session',category:'Handwritten',parts:[{text:'Soul after sundown',font:'Caveat',size:102,color:'#882a36'},{text:'LIVE / INTIMATE / ONE NIGHT ONLY',font:'Bebas Neue',size:38,color:'#882a36',tracking:.06}]},
 {id:'atelier-archive',name:'The culture journal',category:'Classic',parts:[{text:'NO ORDINARY DAY',font:'Anton',size:100,color:'#282722'},{text:'Notes from a different kind of weekend.',font:'Cormorant Garamond',size:48,color:'#282722',italic:true}]},
 {id:'atelier-runway',name:'Street edition',category:'Bold',parts:[{text:'OFF DUTY',font:'Bebas Neue',size:155,color:'#2150bd',lineHeight:.9},{text:'The city is your runway.',font:'DM Sans',size:31,color:'#20242a'}]},
 {id:'atelier-letter',name:'A personal note',category:'Handwritten',parts:[{text:'Made for you',font:'Caveat',size:113,color:'#be3b36'},{text:'A LITTLE THANK YOU FROM OUR STUDIO',font:'DM Sans',size:24,color:'#352c2b',tracking:.08}]},
 {id:'atelier-gallery',name:'Gallery invitation',category:'Classic',parts:[{text:'Ways of seeing',font:'Cormorant Garamond',size:112,color:'#242723'},{text:'NEW WORKS / OPEN STUDIO',font:'Bebas Neue',size:39,color:'#242723',tracking:.15}]}
);
