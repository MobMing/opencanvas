function importPageNumbers(value,count){
  if(!value.trim()){if(count>30)throw Error('This file has '+count+' pages. Choose up to 30 page numbers.');return Array.from({length:count},(_,i)=>i+1)}
  const result=new Set();
  for(const part of value.split(',')){const match=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!match)throw Error('Use page numbers such as 1, 3-5.');const a=Number(match[1]),b=Number(match[2]||a);if(a<1||b<a||b>count)throw Error('Choose pages between 1 and '+count+'.');if(b-a>=30)throw Error('Import up to 30 pages at a time.');for(let i=a;i<=b;i++)result.add(i);if(result.size>30)throw Error('Import up to 30 pages at a time.');}
  return [...result].sort((a,b)=>a-b);
}
function importFileKind(file){
  const name=String(file?.name||'').toLowerCase(),type=String(file?.type||'').toLowerCase();
  if(/\.pptx$/.test(name)||type==='application/vnd.openxmlformats-officedocument.presentationml.presentation')return 'pptx';
  if(/\.svg$/.test(name)||type==='image/svg+xml')return 'svg';
  if(/\.pdf$/.test(name)||type==='application/pdf')return 'pdf';
  if(/\.(png|jpe?g|webp)$/.test(name)||/^image\/(png|jpeg|webp)$/.test(type))return 'image';
  return '';
}
function importCheckFiles(files){
  if(!files.length||files.length>30)throw Error('Choose one PDF, PowerPoint, or SVG, or up to 30 images.');
  if(files.some(f=>!Number.isFinite(f.size)||f.size<=0))throw Error('This file is empty or unreadable. Download it again.');
  if(files.reduce((n,f)=>n+f.size,0)>30*1024*1024)throw Error('Choose files totaling no more than 30 MB.');
  const kinds=files.map(importFileKind);
  if(kinds.some(k=>!k))throw Error('Choose PPTX, SVG, PDF, PNG, JPG, or WebP files. Canva links and .canva files cannot be imported.');
  if(kinds.some(k=>k!=='image')&&files.length!==1)throw Error('Import one PDF, PowerPoint, or SVG at a time, or choose images only.');
  return kinds[0];
}
function importLayerSummary(pages){
  const counts={text:0,shapes:0,images:0};
  for(const page of pages)for(const layer of page.elements){if(layer.type==='text')counts.text++;else if(layer.type==='image')counts.images++;else counts.shapes++;}
  return counts;
}
function importCanvasSize(width,height,maxSide=2400){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('This page has an invalid size.');
  const scale=Math.min(maxSide/Math.max(width,height),2);return {width:Math.max(100,Math.round(width*scale)),height:Math.max(100,Math.round(height*scale)),scale};
}
