// Portable backup validation. No account credentials or connection tokens are included.
const recoverySettingKeys=['opencanvas-brand-kits','opencanvas-campaigns','opencanvas-starred-projects','opencanvas-text-styles','opencanvas-saved-templates'];
const recoveryMaxBytes=100*1024*1024;
function recoveryPayload(raw){const copy={...raw};delete copy.integrity;return JSON.stringify(copy);}
async function recoveryDigest(text){if(!globalThis.crypto?.subtle)throw Error('Backup verification needs a secure browser connection. Open the HTTPS website or localhost.');const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');}
async function recoverySeal(raw){const payload=recoveryPayload(raw);if(new TextEncoder().encode(payload).length>recoveryMaxBytes-200)throw Error('This workspace is larger than the 100 MB backup limit. Save individual projects separately.');return {...raw,integrity:{algorithm:'SHA-256',value:await recoveryDigest(payload)}};}
async function recoveryValidate(raw){
 if(!raw||raw.format!=='opencanvas-workspace'||!Array.isArray(raw.projects)||raw.projects.length>500)throw Error('Not a supported OpenCanvas workspace backup.');
 if(raw.version!==undefined&&![1,2,3].includes(raw.version))throw Error('This backup uses a newer format. Update OpenCanvas before restoring it.');
 for(const [key,limit]of [['components',500],['fonts',20]])if(raw[key]!==undefined&&(!Array.isArray(raw[key])||raw[key].length>limit))throw Error('This backup contains too many or invalid '+key+'.');
 if(raw.version===3){if(raw.integrity?.algorithm!=='SHA-256'||! /^[a-f0-9]{64}$/.test(raw.integrity.value||''))throw Error('The backup verification record is missing. Choose the original downloaded file.');if(await recoveryDigest(recoveryPayload(raw))!==raw.integrity.value)throw Error('This backup is incomplete or has changed since it was created. No projects were restored.');}
 if(raw.organization?.trash!==undefined&&(!Array.isArray(raw.organization.trash)||raw.organization.trash.length>500))throw Error('Invalid or oversized backup Trash.');
 const ids=new Set();for(const p of [...raw.projects,...(raw.organization?.trash||[]).map(row=>row?.project)]){if(!p||typeof p.id!=='string'||!p.id||ids.has(p.id))throw Error('Backup project identifiers must be present and unique.');ids.add(p.id);}
 if(raw.settings!==undefined&&(!raw.settings||typeof raw.settings!=='object'||Array.isArray(raw.settings)))throw Error('Invalid backup settings.');
 return raw;
}
function recoverySettingRows(settings,key,limit){const value=settings?.[key];if(value===null||value===undefined)return [];if(!Array.isArray(value)||value.length>limit)throw Error('Invalid or oversized backup setting: '+key.replace('opencanvas-','')+'.');return value;}
function recoveryMergeUnique(existing,incoming,limit){const rows=[...new Set([...existing,...incoming])];if(rows.length>limit)throw Error('Restoring these settings would exceed the '+limit+' item limit. Restore projects only, or make room first.');return rows;}
async function recoveryWriteFile(handle,name,contents){const file=await handle.getFileHandle(name,{create:true}),stream=await file.createWritable();try{await stream.write(contents);await stream.close();}catch(error){try{await stream.abort();}catch{}throw error;}const check=await file.getFile();if(await check.text()!==contents)throw Error('The backup could not be verified after writing. Your previous backup is unchanged.');return file;}
