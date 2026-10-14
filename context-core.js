function contextLink(value){
 const s=String(value||'').trim();if(!s)return '';if(s.length>2000)throw Error('Keep links under 2,000 characters.');
 let u;try{u=new URL(s)}catch{throw Error('Use a complete https://, http:// or mailto: link.')}
 if(!['https:','http:','mailto:'].includes(u.protocol)||u.username||u.password)throw Error('Use a web or email link without embedded passwords.');return u.href;
}
function contextMetadata(raw){
 const notes=Array.isArray(raw.comments)?raw.comments.slice(0,50).filter(n=>n&&typeof n.text==='string').map(n=>({id:typeof n.id==='string'&&/^[\w-]{1,100}$/.test(n.id)?n.id:uid(),text:n.text.slice(0,2000),resolved:n.resolved===true})):[];
 let link='';try{link=contextLink(raw.link)}catch{}
 return {locked:raw.locked===true,altText:typeof raw.altText==='string'?raw.altText.slice(0,1000):'',link,comments:notes};
}
function contextStyle(element){const keys=['color','opacity'];if(element.type==='text')keys.push('font','size','weight','align','italic','lineHeight','tracking','curve','textEffect','effectColor','effectAmount');return {type:element.type,values:Object.fromEntries(keys.filter(k=>element[k]!==undefined).map(k=>[k,element[k]]))}}
function contextApplyStyle(target,style){const allowed=target.type==='text'&&style.type==='text'?['color','opacity','font','size','weight','align','italic','lineHeight','tracking','curve','textEffect','effectColor','effectAmount']:target.type==='image'?['opacity']:['color','opacity'];for(const k of allowed)if(Object.hasOwn(style.values,k))target[k]=style.values[k];return target}
function contextLayerOrder(elements,id,where){const a=elements.slice(),i=a.findIndex(e=>e.id===id);if(i<0||a[i].locked)return a;const j=where==='front'?a.length-1:where==='back'?0:Math.max(0,Math.min(a.length-1,i+(where==='forward'?1:-1)));const [item]=a.splice(i,1);a.splice(j,0,item);return a}
function contextClone(element){const e=clone(element);e.id=uid();e.locked=false;e.comments=[];e.x=Math.min(16000,e.x+25);e.y=Math.min(16000,e.y+25);return e}
