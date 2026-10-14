// Local font validation and portable project packaging. No DOM or storage access.
const fontLibraryLimits={fileBytes:2*1024*1024,libraryCount:20,libraryBytes:24*1024*1024,projectCount:8,projectBytes:12*1024*1024};
const fontLibraryPrepared=Symbol('validated-font-document');
const fontLibraryTrusted=new WeakSet();
function fontLibraryName(value){if(typeof value!=='string')throw Error('Give your font a name.');const name=value.trim();if(!name||name.length>64||/[\u0000-\u001f\u007f]/.test(name))throw Error('Use a font name with 1–64 printable characters.');return name;}
function fontLibraryFormat(bytes){
 if(!(bytes instanceof Uint8Array)||bytes.length<12||bytes.length>fontLibraryLimits.fileBytes)throw Error('Choose a font file no larger than 2 MB.');
 const tag=String.fromCharCode(...bytes.slice(0,4));
 if(tag==='wOFF'&&bytes.length>=44)return 'woff';if(tag==='wOF2'&&bytes.length>=48)return 'woff2';if(tag==='OTTO')return 'otf';
 if((bytes[0]===0&&bytes[1]===1&&bytes[2]===0&&bytes[3]===0)||tag==='true')return 'ttf';
 throw Error('Choose a valid TTF, OTF, WOFF, or WOFF2 font. Font collections and SVG fonts are not supported.');
}
function fontLibraryId(bytes){let a=2166136261,b=2246822519;for(let i=0;i<bytes.length;i++){a=Math.imul(a^bytes[i],16777619);b=Math.imul(b^(bytes[i]+i),3266489917);}return 'ocf-'+(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')+'-'+bytes.length.toString(16);}
function fontLibraryIsFamily(value){return typeof value==='string'&&/^OpenCanvas Custom ocf-[a-f0-9]{16}-[a-f0-9]{1,6}$/.test(value);}
function fontLibraryEncode(bytes){let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary);}
function fontLibraryDecode(data){if(typeof data!=='string'||data.length>Math.ceil(fontLibraryLimits.fileBytes/3)*4||!data.length||data.length%4||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data))throw Error('Invalid embedded font data.');let decoded;try{decoded=atob(data)}catch{throw Error('Invalid embedded font data.')}return Uint8Array.from(decoded,ch=>ch.charCodeAt(0));}
function fontLibraryMakeAsset(bytes,name,filename=''){
 const format=fontLibraryFormat(bytes),ext=filename.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
 if(filename&&(!['ttf','otf','woff','woff2'].includes(ext)||ext!==format))throw Error('The font file extension does not match its contents.');
 const id=fontLibraryId(bytes);return {id,family:'OpenCanvas Custom '+id,name:fontLibraryName(name),format,data:fontLibraryEncode(bytes),bytes:bytes.length};
}
function fontLibraryValidateAsset(raw){
 if(raw&&typeof raw==='object'&&fontLibraryTrusted.has(raw))return raw;
 if(!raw||typeof raw!=='object')throw Error('Invalid font record.');const bytes=fontLibraryDecode(raw.data),format=fontLibraryFormat(bytes),id=fontLibraryId(bytes);
 if(raw.id!==id||raw.family!=='OpenCanvas Custom '+id||raw.format!==format||raw.bytes!==bytes.length)throw Error('The embedded font does not match its record.');
 const result=Object.freeze({id,family:raw.family,name:fontLibraryName(raw.name),format,data:raw.data,bytes:bytes.length});fontLibraryTrusted.add(result);return result;
}
function fontLibraryValidateList(raw,scope='project'){
 if(raw===undefined)return [];const count=scope==='library'?fontLibraryLimits.libraryCount:fontLibraryLimits.projectCount,limit=scope==='library'?fontLibraryLimits.libraryBytes:fontLibraryLimits.projectBytes;
 if(!Array.isArray(raw)||raw.length>count)throw Error('Keep '+scope+' fonts to '+count+' or fewer.');
 const list=raw.map(fontLibraryValidateAsset);if(new Set(list.map(a=>a.id)).size!==list.length)throw Error('Duplicate embedded font records.');if(list.reduce((n,a)=>n+a.bytes,0)>limit)throw Error('The '+scope+' font files exceed '+Math.round(limit/1024/1024)+' MB.');return Object.freeze(list);
}
function fontLibraryMerge(...groups){const byFamily=new Map();for(const list of groups)for(const asset of list||[]){const old=byFamily.get(asset.family);if(old&&old.data!==asset.data)throw Error('Conflicting custom font files.');if(!old)byFamily.set(asset.family,asset);}return [...byFamily.values()];}
function fontLibraryUsedFamilies(d){const used=new Set();const read=page=>{for(const e of page?.elements||[])if(e.type==='text'&&fontLibraryIsFamily(e.font))used.add(e.font)};read(d);for(const p of d?.pages||[])read(p);return used;}
function fontLibraryPrepareDocument(raw){
 if(!raw||typeof raw!=='object')return raw;if(raw[fontLibraryPrepared])return raw;
 const inherited=fontLibraryValidateList(raw.fontLibrary),all=fontLibraryMerge(inherited,...(Array.isArray(raw.pages)?raw.pages.map(p=>fontLibraryValidateList(p?.fontLibrary)):[]));
 const assets=fontLibraryValidateList(all),prepare=(p,withPages)=>{if(!p||typeof p!=='object')return p;const out={...p,fontLibrary:assets};Object.defineProperty(out,fontLibraryPrepared,{value:true});if(withPages&&Array.isArray(p.pages))out.pages=p.pages.map(page=>prepare(page,false));return out;};return prepare(raw,true);
}
function fontLibraryResolveFamily(family,assets,builtins){if(typeof family==='string'&&family.startsWith('OpenCanvas Custom ')){if(!fontLibraryIsFamily(family)||!(assets||[]).some(a=>a.family===family))throw Error('This project is missing a valid embedded custom font.');return family;}return builtins.includes(family)?family:'Arial';}
function fontLibraryFinalizeDocument(d,raw){const used=fontLibraryUsedFamilies(d),assets=(raw.fontLibrary||[]).filter(a=>used.has(a.family));if(assets.length)d.fontLibrary=assets;else delete d.fontLibrary;for(const p of d.pages||[])delete p.fontLibrary;return d;}
function fontLibraryAssetsFor(d,available=[]){
 const embedded=fontLibraryMerge(fontLibraryValidateList(d?.fontLibrary),...(d?.pages||[]).map(p=>fontLibraryValidateList(p.fontLibrary))),all=fontLibraryMerge(embedded,available),used=fontLibraryUsedFamilies(d),result=[];
 for(const family of used){const asset=all.find(a=>a.family===family);if(!asset)throw Error('A custom font is unavailable. Restore its font file or choose another font.');result.push(asset);}return fontLibraryValidateList(result);
}
function fontLibraryEmbed(d,available=[]){const assets=fontLibraryAssetsFor(d,available);if(assets.length)d.fontLibrary=assets;else delete d.fontLibrary;for(const p of d.pages||[])delete p.fontLibrary;return d;}
async function fontLibraryActivate(assets,adapter){
 const clean=fontLibraryValidateList(assets,'library'),faces=await Promise.all(clean.map(asset=>adapter.load(asset)));
 try{await adapter.commit(clean,faces);return clean}catch(error){try{await adapter.rollback?.(clean,faces)}catch{}throw error;}
}
