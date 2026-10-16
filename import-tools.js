// PDF.js is bundled under Apache-2.0. No design is sent to a remote service.
let importLibraryPromise,importRevision=0,importTask=null,importRenderTask=null,importDraft=null,importFocus=null,importSourceFiles=[],importOpening=false;
function decodeImportAsset(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0))}
async function importPDFLibrary(){
  if(!importLibraryPromise)importLibraryPromise=(async()=>{const source=URL.createObjectURL(new Blob([decodeImportAsset(pdfImportBundle.main)],{type:'text/javascript'}));try{const lib=await import(source);lib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([decodeImportAsset(pdfImportBundle.worker)],{type:'text/javascript'}));return lib}finally{URL.revokeObjectURL(source)}})().catch(e=>{importLibraryPromise=null;throw e});
  return importLibraryPromise;
}
class ImportBinaryDataFactory{async fetch({kind,filename}){const folder={cMapUrl:'cmaps',standardFontDataUrl:'standard_fonts',wasmUrl:'wasm'}[kind],data=pdfImportBundle.assets[folder+'/'+filename];if(!data)throw Error('This PDF needs an unsupported resource. Export it as PNG from Canva instead.');return decodeImportAsset(data)}}
document.body.insertAdjacentHTML('beforeend',`<dialog id="importDialog" aria-labelledby="importTitle"><div class="import-heading"><div><div class="eyebrow">BRING YOUR WORK WITH YOU</div><h2 id="importTitle">From Canva. Into your canvas.</h2></div><button class="iconbtn" id="closeImport" aria-label="Close import">×</button></div><div class="import-layout"><section class="import-guide"><span class="import-badge">PPTX · SVG · PDF · IMAGES</span><h3>Keep creating. Keep your layers.</h3><p class="subtle">In Canva, open your design → Share → Download. Choose the format that fits your work.</p><div class="import-format"><strong>PowerPoint · editable presentation</strong><p>Choose Microsoft PowerPoint (.pptx) for a Canva presentation. Supported text, shapes, and embedded photos become separate layers.</p></div><div class="import-format"><strong>SVG · editable supported objects</strong><p>Simple text and shapes stay editable. Detailed artwork stays as movable images. Outlined lettering cannot become editable text.</p></div><div class="import-format"><strong>PDF or image · preserve appearance</strong><p>Each page stays as one image. Add your own text, images, or shapes over it.</p></div><div class="import-note"><strong>Review before you open</strong><p>Fonts, effects, and complex layouts can change. The preview lists any import limitations. Animation, video, and Canva share links aren’t imported.</p></div><p class="subtle">Available export formats depend on your Canva design and plan. Import files you own or have permission to use. Processing happens on this device.</p><a class="import-help" href="https://www.canva.com/help/download-file-types/" target="_blank" rel="noopener noreferrer">Canva’s export formats ↗</a></section><section class="import-work"><div id="importDrop" class="import-drop"><span aria-hidden="true">↥</span><h3>Your next version starts here.</h3><p>Drop a PowerPoint, SVG, PDF, or images</p><button class="btn primary" id="chooseImport">Choose files</button><small>One design file or up to 30 images · 30 MB total</small></div><input id="importFiles" type="file" accept=".pptx,.svg,.pdf,.png,.jpg,.jpeg,.webp,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/svg+xml,application/pdf,image/png,image/jpeg,image/webp" multiple hidden><div class="import-options"><label class="field">PDF pages / slides<input id="importRange" placeholder="All, or 1, 3-5" aria-label="Pages or slides"></label><label class="field">Import size<select id="importQuality"><option value="2400">High · up to 2400 px</option><option value="1600">Compact · up to 1600 px</option></select></label></div><p class="subtle">Up to 30 pages per project. Review your preview before opening. Your current design stays in Projects.</p><div id="importStatus" role="status" aria-live="polite"></div><div id="importReport" hidden></div><div id="importPreview" class="import-preview"></div><label class="import-backup"><input type="checkbox" id="importBackup" checked> Download a project backup when opening</label><button class="btn primary wide" id="finishImport" disabled>Open in OpenCanvas</button><p class="subtle">After editing, save a .opencanvas project. To reuse your design, open Studio Plus → Layouts, choose layers, then Save selected layers.</p></section></div></dialog>`);
function importSetBusy(busy){for(const id of ['chooseImport','importRange','importQuality','refreshImport']){const control=$('#'+id);if(control)control.disabled=busy;}$('#importDrop').setAttribute('aria-busy',String(busy));}
function cancelImport(){importRevision++;importRenderTask?.cancel();importRenderTask=null;const task=importTask;importTask=null;if(task)task.destroy().catch(()=>{});importDraft=null;$('#importPreview').replaceChildren();$('#importReport').replaceChildren();$('#importReport').hidden=true;$('#finishImport').disabled=true;importSetBusy(false);}
function openDesignImport(){finishInline();if($('#createHub').open)closeCreateHub();importFocus=document.activeElement;cancelImport();importSourceFiles=[];$('#importStatus').textContent='';$('#importRange').value='';$('#importDialog').showModal();$('#chooseImport').focus()}
$('#closeImport').onclick=()=>$('#importDialog').close();$('#importDialog').addEventListener('close',()=>{cancelImport();importFocus?.focus?.()});$('#chooseImport').onclick=()=>$('#importFiles').click();
$('#importDialog').addEventListener('cancel',event=>{if(importOpening)event.preventDefault();});
$('#importFiles').onchange=e=>{const files=[...e.target.files];e.target.value='';if(files.length)prepareDesignImport(files)};
for(const name of ['dragenter','dragover'])$('#importDrop').addEventListener(name,e=>{e.preventDefault();$('#importDrop').classList.add('dragging')});
$('#importDrop').ondragleave=()=>$('#importDrop').classList.remove('dragging');$('#importDrop').ondrop=e=>{e.preventDefault();$('#importDrop').classList.remove('dragging');prepareDesignImport([...e.dataTransfer.files])};
async function prepareDesignImport(files){
  if(importOpening)return;
  cancelImport();importSourceFiles=files;const revision=importRevision;let canvas,pdf,task;const isCurrent=()=>revision===importRevision&&$('#importDialog').open;
  const check=()=>{if(!isCurrent())throw Error('Import cancelled.');};
  try{
    const kind=importCheckFiles(files);
    importSetBusy(true);$('#importStatus').textContent='Reading your file…';
    let pages=[],warnings=[];const maxSide=Number($('#importQuality').value);let pixels=0,bytes=0;
    const addPage=(name)=>{check();pixels+=canvas.width*canvas.height;if(pixels>50000000)throw Error('This import is too large. Choose fewer pages or compact quality.');const src=canvas.toDataURL('image/png');bytes+=src.length;if(bytes>12*1024*1024)throw Error('The rendered pages are too large. Choose fewer pages or compact quality.');pages.push({id:uid(),name:name.slice(0,100),width:canvas.width,height:canvas.height,background:'#ffffff',elements:[base('image',0,0,canvas.width,canvas.height,{src})]});canvas.width=canvas.height=1;};
    if(kind==='pptx'||kind==='svg'){
      const parse=kind==='pptx'?importPPTXFile:importSVGFile;
      const result=await parse(files[0],{maxSide,range:$('#importRange').value,check,progress:message=>{check();$('#importStatus').textContent=String(message)}});
      check();pages=result.pages;warnings=result.warnings||[];
    }else if(kind==='pdf'){
      const lib=await importPDFLibrary();check();const pdfBytes=await files[0].arrayBuffer();check();task=lib.getDocument({data:new Uint8Array(pdfBytes),BinaryDataFactory:ImportBinaryDataFactory,useWorkerFetch:false,isEvalSupported:false,enableXfa:false,stopAtErrors:true,maxImageSize:40000000,canvasMaxAreaInBytes:64000000,verbosity:0});importTask=task;
      pdf=await task.promise;check();const numbers=importPageNumbers($('#importRange').value,pdf.numPages);
      for(let i=0;i<numbers.length;i++){check();$('#importStatus').textContent='Preparing page '+numbers[i]+' ('+(i+1)+' of '+numbers.length+')…';const page=await pdf.getPage(numbers[i]);check();const original=page.getViewport({scale:1}),size=importCanvasSize(original.width,original.height,maxSide),viewport=page.getViewport({scale:size.scale});canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;const renderTask=page.render({canvasContext:canvas.getContext('2d'),viewport,background:'#ffffff'});importRenderTask=renderTask;await renderTask.promise;if(importRenderTask===renderTask)importRenderTask=null;addPage('Page '+numbers[i]);page.cleanup();await new Promise(r=>setTimeout(r,0));}
    }else{
      for(let i=0;i<files.length;i++){check();$('#importStatus').textContent='Preparing image '+(i+1)+' of '+files.length+'…';const bitmap=await createImageBitmap(files[i]);try{check();const size=importCanvasSize(bitmap.width,bitmap.height,maxSide),scale=Math.min(1,size.scale);canvas=document.createElement('canvas');canvas.width=Math.max(100,Math.round(bitmap.width*scale));canvas.height=Math.max(100,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,bitmap.width*scale,bitmap.height*scale);addPage(files[i].name.replace(/\.[^.]+$/,''));}finally{bitmap.close()}await new Promise(r=>setTimeout(r,0));}
    }
    check();const first=pages[0],name=(files.length===1?files[0].name.replace(/\.[^.]+$/,''):'Imported designs').slice(0,100)||'Imported design';importDraft=validateDesign({version:1,id:uid(),name,width:first.width,height:first.height,background:first.background,elements:clone(first.elements),pages,pageIndex:0});
    const editable=kind==='pptx'||kind==='svg',counts=importLayerSummary(importDraft.pages);
    if(editable){
      await fontLibraryReadyFor(importDraft);check();
      const items=[];
      for(const page of importDraft.pages){check();items.push(await importPreviewPage(page,check));}
      check();$('#importPreview').innerHTML=items.join('');
    }else $('#importPreview').innerHTML=pages.map((p,i)=>'<figure><img alt="Preview of '+esc(p.name)+'" src="'+p.elements[0].src+'"><figcaption>'+(i+1)+'. '+esc(p.name)+'<small>'+p.width+' × '+p.height+' px</small></figcaption></figure>').join('');
    $('#importStatus').textContent=pages.length+' page'+(pages.length===1?'':'s')+' ready. '+(editable?counts.text+' text layers · '+counts.shapes+' shapes · '+counts.images+' images.':'Original layers are combined; new elements stay editable.');
    const notes=[...new Set(warnings.map(String))];
    if(editable)notes.unshift('Check the preview against your original. Imported fonts and complex effects may differ.');
    if(editable&&!counts.text)notes.push('No editable text was found. Lettering may be outlined or part of an image; add a new text layer to change it.');
    if(notes.length){$('#importReport').hidden=false;$('#importReport').innerHTML='<strong>Before you open</strong><ul>'+notes.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ul>';}
    $('#finishImport').disabled=false;
  }catch(error){if(isCurrent()){$('#importStatus').textContent=error.name==='PasswordException'?'This PDF is password protected. Export an unlocked copy or use PNG images.':error.name==='InvalidPDFException'?'This PDF could not be read. Download it again from Canva or try PNG.':error.message||'Could not import this file. Try a fresh PDF or PNG export.';importDraft=null;$('#finishImport').disabled=true;}}
  finally{if(canvas)canvas.width=canvas.height=1;if(task){await task.destroy().catch(()=>{});if(importTask===task)importTask=null;}if(isCurrent())importSetBusy(false);}
}
async function importPreviewPage(page,check){
  // Preview pictures never remain in the editor cache after a cancelled import.
  const previewImages=new Map(),previousImages=new Map();
  for(const layer of page.elements){check();if(layer.type==='image'&&!previewImages.has(layer.src)){const picture=new Image();picture.src=layer.src;await picture.decode();check();previewImages.set(layer.src,picture);}}
  const canvas=document.createElement('canvas'),scale=Math.min(320/page.width,320/page.height,1);canvas.width=Math.ceil(page.width*scale);canvas.height=Math.ceil(page.height*scale);
  try{for(const [src,picture]of previewImages){previousImages.set(src,imageCache.get(src));imageCache.set(src,picture);}const context=canvas.getContext('2d');context.scale(scale,scale);drawDocument(context,page);return '<figure><img alt="Preview of '+esc(page.name)+'" src="'+canvas.toDataURL('image/png')+'"><figcaption>'+esc(page.name)+'<small>'+page.elements.length+' layers · '+page.width+' × '+page.height+' px</small></figcaption></figure>';}finally{for(const [src,picture]of previewImages)if(imageCache.get(src)===picture){const previous=previousImages.get(src);if(previous)imageCache.set(src,previous);else imageCache.delete(src);}canvas.width=canvas.height=1;}
}
async function finishDesignImport(){
  if(!importDraft||importOpening)return;
  const ready=importDraft,backup=$('#importBackup').checked,active=design;importOpening=true;$('#finishImport').disabled=true;$('#closeImport').disabled=true;importSetBusy(true);$('#importStatus').textContent='Saving your current project and opening the import…';
  try{
    if(await saveNow()===false)throw Error('Your current project could not be saved. Download a backup or free some browser storage before importing.');
    if(design!==active)throw Error('Your current project changed. Open this import again.');
    await startDesign(ready);
    if(design.id!==ready.id)throw Error('The design did not open. Check your current project’s save status and try again.');
    $('#importDialog').close();switchTab('pages');if(backup)saveFile();toast('Imported. Select a layer to edit, then save your project.');
  }catch(error){$('#importStatus').textContent=error.message||'Could not open this design. Your current project has been kept.';}
  finally{importOpening=false;$('#closeImport').disabled=false;importSetBusy(false);if($('#importDialog').open)$('#finishImport').disabled=!importDraft;}
}
$('#finishImport').onclick=finishDesignImport;
const importRefresh=document.createElement('button');importRefresh.className='btn wide';importRefresh.id='refreshImport';importRefresh.textContent='Update preview';importRefresh.style.marginTop='10px';$('#importDialog .import-options').after(importRefresh);importRefresh.onclick=()=>{if(importSourceFiles.length)prepareDesignImport(importSourceFiles);else $('#importFiles').click()};
$('#importRange').oninput=()=>{if(importSourceFiles.length){cancelImport();$('#importStatus').textContent='Page selection changed. Choose Update preview to apply it.'}};
$('#importQuality').onchange=()=>{if(importSourceFiles.length)prepareDesignImport(importSourceFiles)};
const importLaunch=document.createElement('button');importLaunch.id='importLaunch';importLaunch.innerHTML=icon('upload')+'Import';importLaunch.title='Import from Canva or another design app';importLaunch.onclick=openDesignImport;$('.rail').insertBefore(importLaunch,$('[data-tab="templates"]'));
const importHubContent=renderHubContent;renderHubContent=function(){importHubContent();const actions=$('#hubContent .quick-actions');if(actions){const b=document.createElement('button');b.innerHTML='<span>↥</span>Import from Canva';b.onclick=openDesignImport;actions.prepend(b)}};
const importStageDrop=$('#stage').ondrop;$('#stage').ondrop=e=>{const files=[...e.dataTransfer.files];if(files.some(f=>['pdf','pptx','svg'].includes(importFileKind(f)))){e.preventDefault();openDesignImport();prepareDesignImport(files)}else importStageDrop?.(e)};
