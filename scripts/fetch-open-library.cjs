/* Curated openly licensed media. Run --discover to refresh candidates; default
 * mode downloads only manifest-listed sources, never an arbitrary stock crawl. */
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'assets', 'open-library');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const textOnly = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#160;|&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
async function json(url) {
  const response = await fetch(url, {headers: {'User-Agent': 'OpenCanvas-OpenLibrary/1.0 (https://github.com/MobMing/opencanvas)'}});
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}
const queries = [
 ['dog portrait', ['Pets']], ['cat portrait', ['Pets']], ['rabbit pet', ['Pets']], ['budgerigar', ['Pets']], ['goldfish aquarium', ['Pets']], ['guinea pig', ['Pets']],
 ['pottery wheel', ['Crafts']], ['wool yarn', ['Crafts']], ['weaving textile', ['Crafts']], ['wood carving tools', ['Crafts']], ['origami paper', ['Crafts']], ['ceramic bowl', ['Crafts']],
 ['mountain landscape', ['Photography', 'Travel']], ['seascape sunset', ['Photography', 'Travel']], ['forest sunlight', ['Photography', 'Gardening']], ['modern architecture facade', ['Photography', 'Real Estate']], ['flower macro', ['Photography', 'Gardening']], ['waterfall landscape', ['Photography', 'Travel']],
 ['circuit board closeup', ['Technology']], ['computer keyboard', ['Technology', 'Gaming']], ['robotics', ['Technology', 'Education']], ['NASA nebula', ['Technology', 'Education']], ['NASA earth space', ['Technology', 'Travel']],
 ['vinyl record', ['Music & DJ']], ['microphone studio', ['Podcast', 'Entertainment']], ['coffee beans', ['Food & Drink', 'Small Business']], ['bread bakery', ['Food & Drink']], ['running shoes', ['Fitness', 'Sports']], ['yoga silhouette', ['Wellness', 'Fitness']], ['books library', ['Books', 'Education']], ['wedding bouquet', ['Weddings', 'Celebrations']], ['sewing machine', ['Crafts', 'Fashion']], ['botanical illustration', ['Gardening', 'Beauty']], ['city skyline night', ['Travel', 'Marketing']], ['vintage poster art', ['Community', 'Entertainment']]
];
async function discover() {
 const candidates = process.argv.includes('--more') ? JSON.parse(await fs.readFile(path.join(out,'candidates.json'),'utf8')) : [];
 const more = [
 ['rabbit incategory:"CC-Zero"', ['Pets']], ['guinea pig incategory:"CC-Zero" -specimen', ['Pets']], ['dog incategory:"CC-Zero" -painting -portrait', ['Pets']],
 ['pottery incategory:"CC-Zero"', ['Crafts']], ['woodworking incategory:"CC-Zero"', ['Crafts']], ['embroidery incategory:"CC-Zero"', ['Crafts', 'Fashion']],
 ['forest incategory:"CC-Zero"', ['Photography', 'Travel', 'Gardening']], ['flower macro incategory:"CC-Zero"', ['Photography', 'Gardening']],
 ['portrait incategory:"CC-Zero" -painting -illustration -President -politician -minister', ['Photography']], ['waterfall incategory:"CC-Zero"', ['Travel', 'Photography']],
 ['basketball incategory:"CC-Zero"', ['Sports', 'Fitness']], ['meditation incategory:"CC-Zero"', ['Wellness']], ['bread incategory:"CC-Zero"', ['Food & Drink']],
 ['camera incategory:"CC-Zero"', ['Photography']], ['books incategory:"CC-Zero"', ['Books', 'Education']]
 ];
 const social = [
 ['concert incategory:"CC-Zero"', ['Music & DJ', 'Entertainment']], ['music festival incategory:"CC-Zero"', ['Music & DJ', 'Entertainment']],
 ['fashion incategory:"CC-Zero" -cover -magazine', ['Fashion', 'Beauty']], ['running incategory:"CC-Zero"', ['Fitness', 'Sports']],
 ['volunteers incategory:"CC-Zero"', ['Nonprofit', 'Faith & Community']], ['farmers market incategory:"CC-Zero"', ['Food & Drink', 'Small Business', 'Faith & Community']],
 ['community garden incategory:"CC-Zero"', ['Gardening', 'Nonprofit', 'Faith & Community']], ['street musicians incategory:"CC-Zero"', ['Music & DJ', 'Entertainment']],
 ['fashion textile incategory:"CC-Zero"', ['Fashion', 'Crafts']]
 ];
 for (const [query, topics] of (process.argv.includes('--social') ? social : process.argv.includes('--more') ? more : queries)) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({action:'query',format:'json',generator:'search',gsrsearch:`${query} filetype:bitmap`,gsrnamespace:6,gsrlimit:12,prop:'imageinfo',iiprop:'url|extmetadata|size',iiurlwidth:768}).forEach(([k,v])=>u.searchParams.set(k,v));
  try {
   const data = await json(u);
   for (const page of Object.values(data.query?.pages || {}).sort((a,b)=>a.index-b.index)) {
    const info = page.imageinfo?.[0], m = info?.extmetadata || {};
    const license = m.LicenseShortName?.value || '';
    if (!/^(CC0|Public domain|CC BY [234]\.[05])$/.test(license) || m.Restrictions?.value) continue;
    if (/AI.generated|Stable.Diffusion|Midjourney|DALL.E|generative.ai/i.test(JSON.stringify(m))) continue;
    if (candidates.some(x=>x.pageId===page.pageid)) continue;
    candidates.push({pageId:page.pageid,query,topics,title:textOnly(m.ObjectName?.value||page.title.replace(/^File:/,'')),creator:textOnly(m.Artist?.value||'Unknown creator'),sourceUrl:info.descriptionurl,downloadUrl:(info.thumburl||info.url).split('?')[0],originalUrl:info.url.split('?')[0],license,licenseUrl:m.LicenseUrl?.value||(license==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':'https://creativecommons.org/publicdomain/mark/1.0/'),description:textOnly(m.ImageDescription?.value),width:info.width,height:info.height,metadata:m});
   }
   console.log(query, candidates.filter(x=>x.query===query).length);
  } catch(error) { console.error(query, error.message); }
  await delay(500);
 }
 await fs.mkdir(out,{recursive:true});
 await fs.writeFile(path.join(out,'candidates.json'),JSON.stringify(candidates,null,2));
 console.log('Candidate records',candidates.length);
}
async function download() {
 // Optional maintenance dependency; the shipped application needs no packages.
 // OPENCANVAS_SHARP_PATH can point to an existing Sharp installation.
 const sharp = require(process.env.OPENCANVAS_SHARP_PATH || 'sharp');
 const manifest = JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));
 for (const asset of manifest.assets) {
  const target = path.join(root,asset.path);
  try { await fs.access(target); continue; } catch {}
  let response;
  for(let attempt=0;attempt<3;attempt++) {
   response = await fetch(asset.downloadUrl, {headers:{'User-Agent':'OpenCanvas-OpenLibrary/1.0 (https://github.com/MobMing/opencanvas)'}});
   if(response.status!==429 && response.status<500) break;
   await delay(Math.max(15000,Number(response.headers.get('retry-after')||0)*1000));
  }
  if(!response.ok) throw new Error(`${response.status} ${asset.downloadUrl}`);
  const raw = Buffer.from(await response.arrayBuffer());
  let encoded = await sharp(raw).rotate().resize({width:960,height:960,fit:'inside',withoutEnlargement:true}).webp({quality:75,effort:5}).toBuffer();
  for(const quality of [70,60,50]) {
   if(encoded.length<=120000) break;
   encoded = await sharp(raw).rotate().resize({width:768,height:768,fit:'inside',withoutEnlargement:true}).webp({quality,effort:5}).toBuffer();
  }
  await fs.writeFile(target,encoded);
  console.log(asset.id);
  await delay(1000);
 }
}
(process.argv.includes('--discover') ? discover() : download()).catch(error=>{console.error(error);process.exitCode=1;});
