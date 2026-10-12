// Small, portable business records. No network requests or account connections.
const businessStatuses=['Draft','In review','Approved','Published'];
function businessText(value,max=160){return String(value??'').trim().slice(0,max)}
function validateCampaign(raw){
  if(!raw||typeof raw!=='object')throw Error('Invalid campaign.');
  const name=businessText(raw.name);if(!name)throw Error('Give the campaign a name.');
  const date=businessText(raw.date,10);if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T12:00:00Z'))||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date))throw Error('Choose a valid date.');
  if(!businessStatuses.includes(raw.status))throw Error('Choose a valid review stage.');
  return {id:businessText(raw.id,100),name,date,status:raw.status,channel:businessText(raw.channel,60),owner:businessText(raw.owner,80),reviewer:businessText(raw.reviewer,80),projectId:businessText(raw.projectId,100),brandId:businessText(raw.brandId,100),notes:businessText(raw.notes,2000)};
}
function validateCampaigns(rows){if(!Array.isArray(rows)||rows.length>200)throw Error('Use up to 200 campaigns.');const result=rows.map(validateCampaign);if(result.some(r=>!r.id)||new Set(result.map(r=>r.id)).size!==result.length)throw Error('Campaign identifiers must be present and unique.');return result}
function campaignLink(raw,source,medium,campaign,content=''){
  let url;try{url=new URL(raw)}catch{throw Error('Enter a complete https:// or http:// URL.');}
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw Error('Use a web URL without embedded passwords.');
  if(url.href.length>4000)throw Error('The destination URL is too long.');
  for(const [key,value] of Object.entries({source,medium,campaign,content})){
    const clean=businessText(value,200);if(key!=='content'&&!clean)throw Error('Add source, medium, and campaign.');
    if(clean)url.searchParams.set('utm_'+key,clean);else url.searchParams.delete('utm_'+key);
  }return url.href;
}
function adReport(data){
  const fields=['campaign','impressions','clicks','spend','conversions','revenue'];
  if(!fields.every(f=>data.headers.includes(f)))throw Error('CSV needs these columns: '+fields.join(', ')+'.');
  const rows=data.rows.map((r,i)=>{const row={campaign:businessText(r.campaign)};if(!row.campaign)throw Error('Row '+(i+2)+': campaign is required.');for(const key of fields.slice(1)){
    const raw=String(r[key]).trim();if(!/^\d+(\.\d+)?$/.test(raw))throw Error('Row '+(i+2)+': '+key+' must be a nonnegative number without currency symbols.');
    const n=Number(raw);if(!Number.isFinite(n)||n>1e12||(['impressions','clicks','conversions'].includes(key)&&!Number.isInteger(n)))throw Error('Row '+(i+2)+': invalid '+key+'.');row[key]=n;
  }return row});
  const totals=Object.fromEntries(fields.slice(1).map(k=>[k,rows.reduce((sum,r)=>sum+r[k],0)]));
  const metrics=r=>({...r,ctr:r.impressions?r.clicks/r.impressions*100:null,cpc:r.clicks?r.spend/r.clicks:null,roas:r.spend?r.revenue/r.spend:null});
  return {rows:rows.map(metrics),totals:metrics(totals)};
}
