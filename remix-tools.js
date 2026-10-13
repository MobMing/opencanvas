const remixBaseElements=renderElementResults;
renderElementResults=function(){
 remixBaseElements();
 if(!['All','Shapes','Graphics'].includes(elementCategory))return;
 const q=elementQuery.toLowerCase().trim(),list=remixSymbols.filter(s=>s.join(' ').toLowerCase().includes(q));
 if(!list.length)return;
 const section=document.createElement('section');section.className='remix-symbols';
 section.innerHTML='<div class="section-label">Editable symbols · '+list.length+'</div><p class="subtle">Original geometry. Each part stays editable. Undo removes the whole addition.</p><div class="element-grid">'+list.map(s=>'<button class="element-tile" data-remix-symbol="'+s[0]+'" aria-label="Add editable '+s[1]+'"><canvas width="160" height="160" aria-hidden="true"></canvas><span>'+s[1]+'</span></button>').join('')+'</div>';
 $('#elementResults').prepend(section);$('#elementResults').querySelectorAll(':scope > .element-grid > p.subtle').forEach(p=>p.remove());
 section.querySelectorAll('[data-remix-symbol]').forEach(b=>{
  const c=b.querySelector('canvas');c.style.cssText='width:100%;height:auto;max-height:82px;object-fit:contain';
  drawDocument(c.getContext('2d'),{width:160,height:160,background:'#f5f6f0',elements:remixSymbol(b.dataset.remixSymbol,8,8,144,graphicInk,graphicAccent,'#f5f6f0')});
  b.onclick=()=>{finishInline();const size=Math.min(design.width,design.height)*.32,layers=remixSymbol(b.dataset.remixSymbol,(design.width-size)/2,(design.height-size)/2,size,graphicInk,graphicAccent,design.background);checkpoint();design.elements.push(...layers);selected=layers[0].id;changed();toast('Editable symbol added. Each part is a shape; Undo removes this addition.');};
 });
};
const remixRefreshGraphics=refreshGraphicPreviews;refreshGraphicPreviews=function(){remixRefreshGraphics();$$('[data-remix-symbol]').forEach(b=>{const c=b.querySelector('canvas');drawDocument(c.getContext('2d'),{width:160,height:160,background:'#f5f6f0',elements:remixSymbol(b.dataset.remixSymbol,8,8,144,graphicInk,graphicAccent,'#f5f6f0')});});};
// The sidebar stays light even as the full template library grows.
renderTemplates=function(){
 const root=$('#templateGrid');if(!root)return;
 const items=distinctTemplateConcepts([...peopleTemplates,...templateCatalog().filter(t=>t.collection!=='people')].filter(t=>(filter==='All'||t.category===filter||t.topic===filter||(filter==='Community'&&communityInfo(t.id)))&&matchesCatalog(t,query)));
 root.innerHTML=items.slice(0,24).map(t=>'<div class="community-card"><button class="template-card" data-template="'+esc(t.id)+'"><canvas aria-hidden="true"></canvas><span class="tname">'+esc(t.name)+'</span><span class="ttype">'+esc(t.topic||t.category)+'</span></button>'+(communityInfo(t.id)?'<button class="template-credit" data-credit="'+esc(t.id)+'">Source &amp; license ↗</button>':'')+'</div>').join('')+(items.length>24?'<button class="btn wide" id="remixBrowseAll">Browse all '+items.length+' matches</button>':'')+(!items.length?'<p class="empty">No matches. Try another topic.</p>':'');
 root.querySelectorAll('[data-template]').forEach(b=>{paintTemplateCard(b.querySelector('canvas'),template(b.dataset.template));b.onclick=()=>openTemplate(b.dataset.template);});
 root.querySelectorAll('[data-credit]').forEach(b=>b.onclick=()=>showCommunityCredit(b.dataset.credit));
 if($('#remixBrowseAll'))$('#remixBrowseAll').onclick=()=>openCreateHub('templates',query);
};
renderSidebar();if(homeVisible())renderHomeResults();
