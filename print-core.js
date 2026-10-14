// Physical print geometry and a small RGB raster PDF writer. No browser dependencies.
const printPaperSizes={a3:[297,420],a4:[210,297],a5:[148,210],letter:[215.9,279.4],postcard:[101.6,152.4]};
const printLimits={side:8192,pixels:24000000,totalPixels:96000000,bytes:80*1024*1024,pages:30};
function printSettings(raw={}){
 const number=(key,fallback,min,max)=>{const n=Number(raw[key]??fallback);if(!Number.isFinite(n)||n<min||n>max)throw Error('Choose a valid '+key.replace(/([A-Z])/g,' $1').toLowerCase()+'.');return n};
 const paper=raw.paper||'source';if(!['source','custom',...Object.keys(printPaperSizes)].includes(paper))throw Error('Choose a supported paper size.');
 const fit=raw.fit||'contain';if(!['contain','cover'].includes(fit))throw Error('Choose Fit or Fill for the artwork.');
 return{paper,dpi:number('dpi',300,72,600),widthMm:number('widthMm',210,10,1000),heightMm:number('heightMm',297,10,1000),landscape:raw.landscape===true,fit,bleed:raw.bleed===true,marks:raw.marks===true,safeMm:number('safeMm',5,0,25),guides:raw.guides!==false};
}
function printPageNumbers(value,count,current=0,mode='all'){
 if(!Number.isInteger(count)||count<1||count>printLimits.pages)throw Error('Print supports 1–30 pages.');
 if(mode==='all')return Array.from({length:count},(_,i)=>i);
 if(mode==='current'){if(!Number.isInteger(current)||current<0||current>=count)throw Error('The current page is unavailable.');return[current]}
 if(mode!=='custom')throw Error('Choose which pages to print.');
 const text=String(value||'').trim();if(!text||text.length>200)throw Error('Enter page numbers, for example 1, 3–5.');
 const selected=new Set();for(const part of text.split(',')){const match=part.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?$/);if(!match)throw Error('Use page numbers and ranges, for example 1, 3–5.');const a=Number(match[1]),b=Number(match[2]||match[1]);if(a<1||b<a||b>count)throw Error('Choose pages between 1 and '+count+'.');for(let n=a;n<=b;n++)selected.add(n-1)}
 return [...selected].sort((a,b)=>a-b);
}
function printPagePlan(page,raw={}){
 const s=printSettings(raw),sourceW=Number(page.width),sourceH=Number(page.height);if(!Number.isFinite(sourceW)||!Number.isFinite(sourceH)||sourceW<1||sourceH<1||sourceW>16000||sourceH>16000)throw Error('This page has invalid canvas dimensions.');
 let widthMm,heightMm;if(s.paper==='source'){widthMm=sourceW/s.dpi*25.4;heightMm=sourceH/s.dpi*25.4}else if(s.paper==='custom'){widthMm=s.widthMm;heightMm=s.heightMm}else{[widthMm,heightMm]=printPaperSizes[s.paper];if(s.landscape)[widthMm,heightMm]=[heightMm,widthMm]}
 if(widthMm>1000||heightMm>1000)throw Error('Keep the finished page at or below 1000 mm on each side.');
 const mm=72/25.4,trimW=widthMm*mm,trimH=heightMm*mm,bleedMm=s.bleed?3:0,bleedPt=bleedMm*mm,markMargin=s.marks?6*mm:0;
 const mediaW=trimW+2*(bleedPt+markMargin),mediaH=trimH+2*(bleedPt+markMargin),trimBox=[markMargin+bleedPt,markMargin+bleedPt,markMargin+bleedPt+trimW,markMargin+bleedPt+trimH],bleedBox=[markMargin,markMargin,mediaW-markMargin,mediaH-markMargin];
 const trimPixelsW=Math.max(1,Math.round(widthMm/25.4*s.dpi)),trimPixelsH=Math.max(1,Math.round(heightMm/25.4*s.dpi)),bleedPixels=Math.ceil(bleedMm/25.4*s.dpi),rasterW=trimPixelsW+2*bleedPixels,rasterH=trimPixelsH+2*bleedPixels;
 if(rasterW>printLimits.side||rasterH>printLimits.side||rasterW*rasterH>printLimits.pixels)throw Error('This size and resolution need too much memory. Choose a lower DPI or smaller paper size.');
 return{settings:s,widthMm,heightMm,trimW,trimH,bleedMm,bleedPt,mediaW,mediaH,mediaBox:[0,0,mediaW,mediaH],trimBox,bleedBox,trimPixelsW,trimPixelsH,bleedPixels,rasterW,rasterH,safePt:Math.min(s.safeMm*mm,Math.min(trimW,trimH)/2),sourceW,sourceH};
}
function printBatchPlans(pages,settings){if(!Array.isArray(pages)||!pages.length||pages.length>printLimits.pages)throw Error('Choose 1–30 pages to export.');const plans=pages.map(p=>printPagePlan(p,settings));if(plans.reduce((sum,p)=>sum+p.rasterW*p.rasterH,0)>printLimits.totalPixels)throw Error('This export is too large. Choose fewer pages or a lower DPI.');return plans;}
function printArtworkPlacement(sourceW,sourceH,targetW,targetH,fit='contain'){const scale=(fit==='cover'?Math.max:Math.min)(targetW/sourceW,targetH/sourceH);return{scale,x:(targetW-sourceW*scale)/2,y:(targetH-sourceH*scale)/2,w:sourceW*scale,h:sourceH*scale};}
function printCropLines(plan){if(!plan.settings.marks)return[];const [left,bottom,right,top]=plan.trimBox,[bl,bb,br,bt]=plan.bleedBox,gap=72/25.4,length=4*72/25.4;return[[left,bb-gap-length,left,bb-gap],[right,bb-gap-length,right,bb-gap],[left,bt+gap,left,bt+gap+length],[right,bt+gap,right,bt+gap+length],[bl-gap-length,bottom,bl-gap,bottom],[bl-gap-length,top,bl-gap,top],[br+gap,bottom,br+gap+length,bottom],[br+gap,top,br+gap+length,top]];}
function makePrintPDF(pages){
 if(!Array.isArray(pages)||!pages.length||pages.length>printLimits.pages)throw Error('Print PDFs support 1–30 pages.');
 const encoder=new TextEncoder(),chunks=[],offsets=[0];let length=0,totalBytes=0;
 const put=value=>{const bytes=typeof value==='string'?encoder.encode(value):value;chunks.push(bytes);length+=bytes.length},number=n=>{if(!Number.isFinite(n))throw Error('Invalid PDF measurement.');return Number(n.toFixed(5)).toString()},box=a=>a.map(number).join(' '),object=(id,body)=>{offsets[id]=length;put(id+' 0 obj\n'+body+'\nendobj\n')};
 put('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Count '+pages.length+' /Kids ['+pages.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>');
 pages.forEach((p,i)=>{
  if(!(p.bytes instanceof Uint8Array)||!p.bytes.length||!Number.isInteger(p.pixelWidth)||!Number.isInteger(p.pixelHeight)||p.pixelWidth<1||p.pixelHeight<1||p.pixelWidth>printLimits.side||p.pixelHeight>printLimits.side||p.pixelWidth*p.pixelHeight>printLimits.pixels)throw Error('Invalid print page image.');
  totalBytes+=p.bytes.length;if(totalBytes>printLimits.bytes)throw Error('This PDF exceeds 80 MB. Export fewer pages.');
  const plan=p.plan;if(!plan||![plan.mediaBox,plan.trimBox,plan.bleedBox].every(a=>Array.isArray(a)&&a.length===4&&a.every(Number.isFinite)))throw Error('Invalid print page boxes.');
  const [mx,my,mw,mh]=plan.mediaBox,[bx,by,br,bt]=plan.bleedBox,[tx,ty,tr,tt]=plan.trimBox;
  if(mx!==0||my!==0||mw<=0||mh<=0||mw>3000||mh>3000||bx<0||by<0||br>mw||bt>mh||br<=bx||bt<=by||tx<bx||ty<by||tr>br||tt>bt||tr<=tx||tt<=ty)throw Error('Print page boxes must be nested inside the sheet.');
  const id=3+i*3,lines=printCropLines(plan),commands='q\n'+number(br-bx)+' 0 0 '+number(bt-by)+' '+number(bx)+' '+number(by)+' cm\n/Im0 Do\nQ\n'+(lines.length?'q\n0 G\n0.25 w\n'+lines.map(([x1,y1,x2,y2])=>[number(x1),number(y1),'m',number(x2),number(y2),'l S'].join(' ')).join('\n')+'\nQ\n':'');
  object(id,'<< /Type /Page /Parent 2 0 R /MediaBox ['+box(plan.mediaBox)+'] /CropBox ['+box(plan.mediaBox)+'] /TrimBox ['+box(plan.trimBox)+'] /BleedBox ['+box(plan.bleedBox)+'] /Resources << /XObject << /Im0 '+(id+2)+' 0 R >> >> /Contents '+(id+1)+' 0 R >>');
  object(id+1,'<< /Length '+encoder.encode(commands).length+' >>\nstream\n'+commands+'endstream');
  offsets[id+2]=length;put((id+2)+' 0 obj\n<< /Type /XObject /Subtype /Image /Width '+p.pixelWidth+' /Height '+p.pixelHeight+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+p.bytes.length+' >>\nstream\n');put(p.bytes);put('\nendstream\nendobj\n');
 });
 const xref=length;put('xref\n0 '+offsets.length+'\n0000000000 65535 f \n');for(const offset of offsets.slice(1))put(String(offset).padStart(10,'0')+' 00000 n \n');put('trailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n');return new Blob(chunks,{type:'application/pdf'});
}
