// Square image layers preserve the complete photograph at every output ratio.
// Typography, framing, tickets, lines and accents remain independently editable.
function makePromoDesign(t,assets){
 const w=t.width,h=t.height,u=Math.min(w,h),d={version:1,id:uid(),name:t.name,width:w,height:h,background:t.bg,elements:[]},a=d.elements;
 const rect=(x,y,ww,hh,color,kind='rect',extra={})=>a.push(shape(x,y,ww,hh,color,kind,extra));
 const text=(value,x,y,ww,hh,size,color=t.ink,font='Arial',extra={})=>a.push(txt(value,x,y,ww,size,color,{h:hh,font,weight:font==='Arial'?'700':'400',...extra}));
 const photo=(x,y,size,id=t.asset)=>a.push(base('image',x,y,size,size,{src:assets[id],altText:'AI-generated '+promoAssetInfo[id].description+'. Sample promotional imagery.'}));
 const title=(x,y,ww,hh,sz,color=t.ink)=>text(t.title,x,y,ww,hh,sz,color,t.font);
 const header=()=>text('YOUR BRAND / '+t.topic.toUpperCase(),w*.055,h*.03,w*.89,h*.04,u*.019);
 const sub=(x,y,ww,hh,color=t.ink)=>text(t.sub,x,y,ww,hh,u*.029,color,'Arial',{weight:'400'});
 const footer=()=>{rect(w*.055,h*.90,w*.89,2,t.ink);text(t.detail,w*.055,h*.928,w*.53,h*.045,u*.021);text(t.cta+' ↗',w*.62,h*.928,w*.325,h*.045,u*.022,t.ink,'Arial',{align:'right'});};
 const second=t.secondary||t.asset,third=t.tertiary||second;
 if(w>h){
  // Landscape adaptations retain the family's defining composition.
  switch(t.layout){
   case 0: photo(w-h*.82,h*.09,h*.82);rect(w*.04,h*.18,w*.46,h*.48,t.bg);title(w*.06,h*.20,w*.43,h*.39,u*.115);sub(w*.06,h*.70,w*.40,h*.12);break;
   case 1: photo(w*.055,h*.14,h*.63);title(w*.47,h*.16,w*.47,h*.42,u*.10);rect(w*.47,h*.66,w*.47,h*.16,t.ink);sub(w*.49,h*.69,w*.42,h*.10,t.bg);break;
   case 2: title(w*.05,h*.12,w*.43,h*.42,u*.10);sub(w*.05,h*.66,w*.4,h*.12);photo(w*.52,h*.18,h*.38);photo(w*.75,h*.43,h*.38,second);rect(w*.52,h*.66,w*.13,h*.14,t.accent);break;
   case 3: rect(w*.04,h*.12,w*.92,h*.73,t.ink);photo(w*.065,h*.17,h*.63);title(w*.45,h*.19,w*.47,h*.35,u*.10,t.bg);sub(w*.45,h*.60,w*.44,h*.14,t.bg);for(let i=0;i<14;i++)rect(w*.425,h*(.16+i*.047),2,h*.018,t.bg);break;
   case 4: title(w*.055,h*.13,w*.44,h*.35,u*.10);sub(w*.055,h*.61,w*.40,h*.15);photo(w*.54,h*.19,h*.32);photo(w*.75,h*.19,h*.32,second);text('FEATURED / 01',w*.54,h*.57,w*.19,h*.08,u*.024);text('FEATURED / 02',w*.75,h*.57,w*.19,h*.08,u*.024);break;
   case 5: photo(w*.055,h*.19,h*.30);photo(w*.25,h*.43,h*.30,second);photo(w*.055,h*.54,h*.22,third);title(w*.49,h*.17,w*.46,h*.4,u*.105);sub(w*.49,h*.66,w*.44,h*.14);break;
   case 6: rect(w*.53,h*.13,h*.72,h*.72,t.accent,'ellipse');photo(w*.57,h*.22,h*.54);title(w*.055,h*.16,w*.44,h*.40,u*.115);sub(w*.055,h*.68,w*.40,h*.12);break;
   case 7: rect(w*.055,h*.12,w*.89,2,t.ink);photo(w*.055,h*.19,h*.61);title(w*.46,h*.19,w*.39,h*.35,u*.082);text('01',w*.85,h*.19,w*.1,h*.17,u*.10,t.accent,'Georgia');sub(w*.46,h*.65,w*.44,h*.14);break;
   case 8: title(w*.08,h*.21,w*.46,h*.31,u*.088);sub(w*.08,h*.63,w*.38,h*.14);photo(w*.65,h*.27,h*.44);break;
   case 9: title(w*.055,h*.12,w*.89,h*.22,u*.088);[t.asset,second,third].forEach((id,i)=>photo(w*(.055+i*.32),h*.37,h*.32,id));sub(w*.055,h*.76,w*.89,h*.09);break;
   case 10: rect(w*.62,h*.13,h*.24,h*.24,t.accent,'ellipse');rect(w*.80,h*.59,h*.20,h*.20,t.accent,'star');photo(w*.61,h*.22,h*.54);rect(w*.055,h*.17,w*.48,h*.36,t.ink);title(w*.075,h*.19,w*.44,h*.31,u*.098,t.bg);sub(w*.055,h*.66,w*.43,h*.13);break;
   case 11: title(w*.055,h*.15,w*.68,h*.39,u*.14);sub(w*.055,h*.68,w*.53,h*.14);photo(w*.79,h*.59,h*.23);break;
  }
 }else{
  const midSize=Math.min(w*.72,h*.48);
  switch(t.layout){
   case 0: // Spotlight: large headline, off-center photograph, side caption.
    title(w*.055,h*.105,w*.89,h*.19,u*.112);photo(w*.29,h*.32,Math.min(w*.65,h*.48));rect(w*.055,h*.34,w*.13,h*.16,t.accent);text('VOL.\n01',w*.073,h*.36,w*.10,h*.12,u*.037,t.bg,'Impact');sub(w*.055,h*.73,w*.19,h*.15);break;
   case 1: // Immersive scene between high-contrast headline and footer panels.
    {const s=Math.min(w,h*.77);photo((w-s)/2,h*.11,s);rect(w*.035,h*.115,w*.93,h*.21,t.bg);title(w*.06,h*.125,w*.88,h*.19,u*.108);rect(w*.055,h*.765,w*.89,h*.105,t.bg);sub(w*.075,h*.785,w*.85,h*.07);}break;
   case 2: // Split column: type and caption alongside a large square image.
    rect(w*.04,h*.10,w*.92,h*.77,t.accent);photo(w*.075,h*.35,w*.55);title(w*.08,h*.115,w*.83,h*.19,u*.096,t.bg);text('OPEN\nSESSION',w*.68,h*.40,w*.22,h*.13,u*.045,t.bg,'Impact');sub(w*.68,h*.58,w*.22,h*.21,t.bg);break;
   case 3: // Ticket with a perforated edge and separate admission stub.
    rect(w*.045,h*.10,w*.91,h*.77,t.ink);title(w*.085,h*.13,w*.83,h*.18,u*.088,t.bg);photo(w*.085,h*.34,Math.min(w*.54,h*.44));text('ADMIT\nONE',w*.73,h*.35,w*.18,h*.14,u*.05,t.bg,'Impact');text('No. 001',w*.73,h*.62,w*.18,h*.04,u*.024,t.bg,'Courier New');for(let i=0;i<17;i++)rect(w*.685,h*(.32+i*.031),2,h*.013,t.bg);sub(w*.085,h*.79,w*.53,h*.065,t.bg);break;
   case 4: // Two distinct artist photographs and editable lineup text.
    title(w*.055,h*.11,w*.89,h*.18,u*.11);photo(w*.055,h*.34,w*.40);photo(w*.545,h*.34,w*.40,second);text('ARTIST ONE',w*.055,h*.34+w*.42,w*.42,h*.05,u*.034);text('ARTIST TWO',w*.545,h*.34+w*.42,w*.40,h*.05,u*.034);if(h/w>1.5)text('PLUS SPECIAL GUESTS\nADD YOUR SUPPORT LINEUP',w*.055,h*.66,w*.89,h*.105,u*.036);rect(w*.055,h*.825,w*.89,h*.06,t.ink);sub(w*.075,h*.835,w*.85,h*.045,t.bg);break;
   case 5: // Asymmetric zine collage with independent paper/tape layers.
    title(w*.055,h*.105,w*.89,h*.18,u*.10);rect(w*.045,h*.31,w*.49,w*.49,t.ink);photo(w*.06,h*.32,w*.46);rect(w*.53,h*.41,w*.425,w*.37,t.accent);photo(w*.545,h*.42,w*.35,second);rect(w*.12,h*.30,w*.23,h*.032,t.accent);rect(w*.62,h*.405,w*.20,h*.027,t.ink);sub(w*.055,h*.82,w*.89,h*.06);break;
   case 6: // Record sleeve: concentric circles and square cover artwork.
    rect(w*.09,h*.21,w*.82,w*.64,t.accent,'ellipse');rect(w*.19,h*.25,w*.62,w*.54,t.bg,'ellipse');photo((w-midSize)/2,h*.29,midSize);title(w*.055,h*.105,w*.89,h*.17,u*.104);sub(w*.055,h*.81,w*.89,h*.07);break;
   case 7: // Magazine: slim rules, issue number and small side column.
    rect(w*.055,h*.10,w*.89,3,t.ink);title(w*.055,h*.125,w*.68,h*.17,u*.085);text('01',w*.76,h*.125,w*.19,h*.15,u*.12,t.accent,'Georgia');photo(w*.055,h*.35,w*.60);text('THE\nOPEN\nEDIT',w*.70,h*.38,w*.23,h*.18,u*.045);sub(w*.70,h*.63,w*.23,h*.20);break;
   case 8: // Spacious product/creator editorial with a compact image.
    title(w*.055,h*.13,w*.89,h*.19,u*.084);photo(w*.49,h*.38,w*.45);rect(w*.055,h*.41,w*.12,3,t.ink);sub(w*.055,h*.49,w*.35,h*.18);text('TAKE A\nCLOSER LOOK',w*.055,h*.78,w*.89,h*.07,u*.026);break;
   case 9: // Three-frame contact sheet, editable captions and top typography.
    title(w*.055,h*.105,w*.89,h*.23,u*.109);[t.asset,second,third].forEach((id,i)=>{photo(w*(.055+i*.31),h*.44,w*.27,id);text('FRAME / 0'+(i+1),w*(.055+i*.31),h*.44+w*.29,w*.27,h*.045,u*.018,t.ink,'Courier New');});sub(w*.055,h*.79,w*.89,h*.08);break;
   case 10: // Poster with geometric stickers behind the photograph.
    rect(w*.055,h*.19,w*.24,w*.24,t.accent,'ellipse');rect(w*.73,h*.58,w*.20,w*.20,t.accent,'star');photo(w*.21,h*.29,Math.min(w*.58,h*.48));rect(w*.055,h*.10,w*.89,h*.155,t.ink);title(w*.08,h*.115,w*.84,h*.13,u*.082,t.bg);sub(w*.055,h*.82,w*.89,h*.06);break;
   case 11: // Typography-led: deliberately small image and oversized title.
    title(w*.055,h*.13,w*.89,h*.35,u*.15);rect(w*.055,h*.53,w*.52,h*.09,t.ink);text('INDEPENDENT / 001',w*.075,h*.55,w*.48,h*.05,u*.022,t.bg,'Courier New');photo(w*.64,h*.55,w*.305);sub(w*.055,h*.68,w*.49,h*.15);break;
  }
 }
 header();footer();return d;
}
