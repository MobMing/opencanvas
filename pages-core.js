// Portable document helpers. The editor keeps the selected page at the top level.
function pageSnapshot(d, previous={}) {
  return {id:previous.id||uid(),name:previous.name||'Page 1',width:d.width,height:d.height,background:d.background,elements:clone(d.elements),communityTemplateId:d.communityTemplateId};
}
function ensurePages(d) {
  if(!Array.isArray(d.pages)||!d.pages.length){d.pages=[pageSnapshot(d)];d.pageIndex=0;}
  if(!Number.isInteger(d.pageIndex)||d.pageIndex<0||d.pageIndex>=d.pages.length)d.pageIndex=0;
  return d.pages;
}
function syncPage(d){ensurePages(d);d.pages[d.pageIndex]=pageSnapshot(d,d.pages[d.pageIndex]);return d.pages;}
function selectDocumentPage(d,index){if(index<0||index>=ensurePages(d).length)return;syncPage(d);d.pageIndex=index;adoptPage(d);}
function adoptPage(d){const p=d.pages[d.pageIndex];for(const key of ['width','height','background','elements','communityTemplateId'])d[key]=clone(p[key]??(key==='communityTemplateId'?null:p[key]));}
function validatePages(raw,d,validate){
  if(raw.pages===undefined)return d;
  if(!Array.isArray(raw.pages)||!raw.pages.length||raw.pages.length>30)throw Error('Choose a project with 1–30 pages.');
  if(!Number.isInteger(raw.pageIndex)||raw.pageIndex<0||raw.pageIndex>=raw.pages.length)throw Error('Invalid selected page.');
  d.pages=raw.pages.map(p=>{if(!p||p.pages!==undefined)throw Error('Nested pages are not supported.');return validate(p);});
  if(d.pages.reduce((n,p)=>n+p.elements.length,0)>3000)throw Error('Projects support up to 3,000 elements across all pages.');
  if(new Set(d.pages.map(p=>p.id)).size!==d.pages.length)throw Error('Duplicate page IDs.');
  d.pageIndex=raw.pageIndex;adoptPage(d);return d;
}
function makePagePDF(pages){
  if(!pages.length||pages.length>30)throw Error('PDF exports support 1–30 pages.');
  const encoder=new TextEncoder(),chunks=[],offsets=[0];let length=0;
  const put=s=>{const bytes=typeof s==='string'?encoder.encode(s):s;chunks.push(bytes);length+=bytes.length;};
  const object=(id,body)=>{offsets[id]=length;put(id+' 0 obj\n'+body+'\nendobj\n');};
  put('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');
  object(2,'<< /Type /Pages /Count '+pages.length+' /Kids ['+pages.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>');
  pages.forEach((p,i)=>{
    if(!(p.bytes instanceof Uint8Array)||!Number.isFinite(p.width)||!Number.isFinite(p.height)||p.width<1||p.height<1)throw Error('Invalid PDF page.');
    const id=3+i*3,w=p.width*.75,h=p.height*.75,commands='q\n'+w+' 0 0 '+h+' 0 0 cm\n/Im0 Do\nQ\n';
    object(id,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+w+' '+h+'] /Resources << /XObject << /Im0 '+(id+2)+' 0 R >> >> /Contents '+(id+1)+' 0 R >>');
    object(id+1,'<< /Length '+encoder.encode(commands).length+' >>\nstream\n'+commands+'endstream');
    offsets[id+2]=length;put((id+2)+' 0 obj\n<< /Type /XObject /Subtype /Image /Width '+p.width+' /Height '+p.height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+p.bytes.length+' >>\nstream\n');put(p.bytes);put('\nendstream\nendobj\n');
  });
  const xref=length;put('xref\n0 '+offsets.length+'\n0000000000 65535 f \n');for(const o of offsets.slice(1))put(String(o).padStart(10,'0')+' 00000 n \n');put('trailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n');return new Blob(chunks,{type:'application/pdf'});
}
