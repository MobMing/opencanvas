function importPageNumbers(value,count){
  if(!value.trim()){if(count>30)throw Error('This PDF has '+count+' pages. Choose up to 30 page numbers.');return Array.from({length:count},(_,i)=>i+1)}
  const result=new Set();
  for(const part of value.split(',')){const match=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!match)throw Error('Use page numbers such as 1, 3-5.');const a=Number(match[1]),b=Number(match[2]||a);if(a<1||b<a||b>count)throw Error('Choose pages between 1 and '+count+'.');if(b-a>=30)throw Error('Import up to 30 pages at a time.');for(let i=a;i<=b;i++)result.add(i);if(result.size>30)throw Error('Import up to 30 pages at a time.');}
  return [...result].sort((a,b)=>a-b);
}
function importCanvasSize(width,height,maxSide=2400){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('This page has an invalid size.');
  const scale=Math.min(maxSide/Math.max(width,height),2);return {width:Math.max(100,Math.round(width*scale)),height:Math.max(100,Math.round(height*scale)),scale};
}
