// Index once per catalog revision; browsing thousands of designs stays responsive.
const libraryCurateBase=curateTemplates,libraryCuratedCache=new Map();
curateTemplates=function(items){const key=items.map(t=>t.id).join('|');if(libraryCuratedCache.has(key))return [...libraryCuratedCache.get(key)];const out=libraryCurateBase(items);if(libraryCuratedCache.size>=6)libraryCuratedCache.delete(libraryCuratedCache.keys().next().value);libraryCuratedCache.set(key,out);return [...out];};
let libraryCatalogCache=null,libraryCatalogCount=-1,libraryNicheCount=-1;
templateCatalog=function(){
 if(libraryCatalogCache&&libraryCatalogCount===templates.length&&libraryNicheCount===nicheTemplates.length)return libraryCatalogCache;
 const byId=new Map(nicheTemplates.map(t=>[t.id,t])),community=new Map(communityTemplates.map(t=>[t.id,t]));
 libraryCatalogCache=templates.map(([id,name,category])=>{const n=byId.get(id),c=community.get(id);return n||{id,name,category,topic:c?'Community':'General',style:c?(c.style||'Classic'):'Original',tags:c?'community cc0 '+c.originalTitle+' '+(c.tags||'')+' '+(c.sourceChannel||''):'original social creative design',author:c?.author};});
 libraryCatalogCount=templates.length;libraryNicheCount=nicheTemplates.length;return libraryCatalogCache;
};
const libraryCardBase=templateCardMarkup;
templateCardMarkup=function(t){const html=libraryCardBase(t);return t.collection==='open-library'?html.replace('</div></article>','<button class="template-credit" data-library-credit="'+esc(t.id)+'">Artwork &amp; license ↗</button></div></article>'):html;};
function showLibraryCredit(id){const t=promoLibraryTemplates.find(t=>t.id===id);if(!t)return;const info=t.assetIds.map(id=>openLibraryInfo.find(a=>a.id===id)).filter(Boolean);$('#communityTitle').textContent=t.title+' — artwork credits';$('#communityCreditBody').innerHTML='<p>Original OpenCanvas composition with editable text and shapes.</p>'+(!info.length?'<p>This template uses native editable illustrations. You can replace them with your own photos.</p>':info.map(a=>'<section><h3>'+esc(a.title)+'</h3><p>By '+esc(a.creator)+' · '+esc(a.license)+'</p><p>'+esc(a.changes)+' Images may be cropped by the template frame.</p><p><a href="'+esc(a.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Original source ↗</a> · <a href="'+esc(a.licenseUrl)+'" target="_blank" rel="noopener noreferrer">License ↗</a></p></section>').join(''))+'<p class="subtle">CC BY artwork includes an editable credit line for exports. Keep that attribution when using the supplied image. Replace the photo with your own to use your own credits.</p>';$('#communityCreditDialog').showModal();}
const libraryWireCards=wireTemplateCards;wireTemplateCards=function(root){libraryWireCards(root);root.querySelectorAll('[data-library-credit]').forEach(b=>b.onclick=()=>showLibraryCredit(b.dataset.libraryCredit));};
const libraryOpenPreview=openTemplatePreview;openTemplatePreview=async function(id,focus){await libraryOpenPreview(id,focus);if(promoPreviewId!==id||!$('#templatePreview').open)return;const t=templateCatalog().find(t=>t.id===id);if(t?.collection==='open-library'){$('#templatePreviewSource').innerHTML='<button class="text-link" id="previewLibraryCredit">Artwork &amp; license ↗</button>';$('#previewLibraryCredit').onclick=()=>showLibraryCredit(id);}else if(t?.collection==='signal-lab')$('#templatePreviewSource').innerHTML='<a href="https://github.com/MobMing/opencanvas/blob/main/docs/LIQUID-SIGNAL.md" target="_blank" rel="noopener noreferrer">Sculpture artwork &amp; credits ↗</a>';};
// Keep the original community artwork browser available alongside the new designs.
let libraryLegacyCommunity=false;
const libraryRenderHub=renderHubContent;renderHubContent=function(){
 if(hubMode==='templates'&&hubCategory==='Community'&&libraryLegacyCommunity){promoBaseHub();const back=document.createElement('button');back.className='btn';back.textContent='← Back to all community designs';back.onclick=()=>{libraryLegacyCommunity=false;renderHubContent();};$('#hubContent').prepend(back);return;}
 libraryRenderHub();if(hubMode==='templates'&&hubCategory==='Community'){const b=document.createElement('button');b.className='btn';b.textContent='Browse the original community artwork collection';b.onclick=()=>{libraryLegacyCommunity=true;renderHubContent();};$('#hubContent').querySelector('.promo-hero')?.append(b);}
};
// Rotate briefs before their alternate compositions, then vary the surrounding layouts.
// Cache the complete sequence; loading another page must never reorder earlier cards.
const libraryFreshCache=new Map();
function libraryFreshSequence(items){
 const key=items.map(t=>t.id).join('|');if(libraryFreshCache.has(key))return [...libraryFreshCache.get(key)];
 const titleKey=t=>String(t.title||t.brief?.title||t.name||t.id).trim().toLowerCase(),familyKey=t=>t.layoutName||String(t.family??t.style??''),used=new Map(),out=[];
 const pool=items.map((t,index)=>({t,index,title:titleKey(t),family:familyKey(t)}));
 while(pool.length){let best=0,bestScore=-Infinity;
  for(let i=0;i<pool.length;i++){const candidate=pool[i],t=candidate.t;let score=-(used.get(candidate.title)||0)*1000-candidate.index*.0001;
   for(let j=Math.max(0,out.length-8);j<out.length;j++){const previous=out[j],weight=1/(out.length-j);if(candidate.family===previous.family)score-=(j===out.length-1?300:40)*weight;if(t.style&&t.style===previous.t.style)score-=8*weight;if(t.bg&&t.bg===previous.t.bg)score-=6*weight;if(t.assetIds?.some(id=>previous.t.assetIds?.includes(id)))score-=12*weight;}
   if(score>bestScore){bestScore=score;best=i;}
  }
  const [next]=pool.splice(best,1);next.round=used.get(next.title)||0;out.push(next);used.set(next.title,next.round+1);
 }
 // The last choices in a round can share a layout. Swap only within that round,
 // preserving the one-of-each-brief rotation without creating another repeat.
 for(let pass=0;pass<2;pass++)for(let i=1;i<out.length;i++){
  if(out[i].family!==out[i-1].family&&out[i].title!==out[i-1].title)continue;
  for(let j=0;j<out.length;j++){
   if(out[j].round!==out[i].round||Math.abs(j-i)<2)continue;
   const at=k=>k===i?out[j]:k===j?out[i]:out[k],edges=[i-1,i,j-1,j];
   if(edges.some(k=>k>=0&&k+1<out.length&&(at(k).family===at(k+1).family||at(k).title===at(k+1).title)))continue;
   [out[i],out[j]]=[out[j],out[i]];break;
  }
 }
 const ordered=out.map(x=>x.t);if(libraryFreshCache.size>=6)libraryFreshCache.delete(libraryFreshCache.keys().next().value);libraryFreshCache.set(key,ordered);return [...ordered];
}
const libraryFeatureBase=categoryFeature;categoryFeature=function(items,topic){
 const base=libraryFeatureBase(items,topic);if(topic==='Gaming')return base;
 const fresh=libraryFreshSequence(base.filter(t=>t.collection==='open-library'||t.collection==='signal-lab')),older=base.filter(t=>t.collection!=='open-library'&&t.collection!=='signal-lab'),out=[];
 for(let i=0;i<Math.max(fresh.length,older.length);i++){if(fresh[i])out.push(fresh[i]);if(i<6&&older[i])out.push(older[i]);}out.push(...older.slice(6));return out;
};
const libraryFeatureHomeBase=promoFeatureSignature;promoFeatureSignature=function(items,count=6){
 const previous=libraryFeatureHomeBase(items,count),picks=['signal-lab','open-library'].flatMap(c=>{const topics=new Set();return items.filter(t=>t.collection===c&&!topics.has(t.topic)&&topics.add(t.topic)).slice(0,c==='signal-lab'?2:4);});
 const chosen=new Set(picks.map(t=>t.id));return [...picks,...previous.filter(t=>!chosen.has(t.id))];
};
// Keep keyboard focus on the category/filter the visitor just used after a refresh.
function libraryFocusIdentity(){const e=document.activeElement;if(!e||!$('#createHub').contains(e))return null;const attributes=['data-hub-category','data-category-query'];for(const attribute of attributes)if(e.hasAttribute(attribute))return {attribute,value:e.getAttribute(attribute),node:e};return e.id?{id:e.id,node:e}:null;}
function libraryRestoreFocus(previous){if(!previous||previous.node.isConnected||!$('#createHub').open)return;let next=previous.id?document.getElementById(previous.id):[...$('#createHub').querySelectorAll('['+previous.attribute+']')].find(e=>e.getAttribute(previous.attribute)===previous.value);if(!next&&previous.id==='promoMore')next=$('#promoResults');if(next){if(next.id==='promoResults')next.tabIndex=-1;next.focus({preventScroll:true});}}
const libraryFocusHub=renderHub;renderHub=function(){const previous=libraryFocusIdentity();libraryFocusHub();libraryRestoreFocus(previous);};
const libraryFocusContent=renderHubContent;renderHubContent=function(){const previous=libraryFocusIdentity();libraryFocusContent();libraryRestoreFocus(previous);};
