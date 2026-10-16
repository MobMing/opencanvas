const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const {assets}=require('../assets/open-library/manifest.json');
const evidence=require('../assets/open-library/source-evidence.json').records;

test('open-library images have explicit reusable licenses and matching source evidence',()=>{
 const records=new Map(evidence.map(item=>[item.pageId,item]));
 for(const a of assets){
  assert.match(a.license,/^(CC0|Public domain|CC BY [234]\.[05])$/);
  assert.match(a.licenseUrl,/^https?:\/\/creativecommons\.org\/(licenses\/by\/|publicdomain\/)/);
  assert.equal(new URL(a.sourceUrl).hostname,'commons.wikimedia.org');
  assert.ok(a.creator.length>0 && !/[<>]|&lt;|&gt;/.test(a.creator),a.id+' creator must be readable text');
  assert.equal(a.attributionRequired,a.license.startsWith('CC BY'));
  const source=records.get(a.sourcePageId);
  assert.ok(source,a.id+' missing evidence');
  assert.equal(source.metadata.LicenseShortName.value,a.license,a.id+' license mismatch');
  assert.ok(!source.metadata.Restrictions?.value,a.id+' contains a restriction flag');
  assert.ok(a.changes && a.licenseEvidenceUrl && a.creditLine);
 }
});

test('open-library references resolve to distinct compact WebP files within their asset directory',()=>{
 const names=new Set(),hashes=new Set();
 for(const a of assets){
  assert.ok(!names.has(a.id),a.id+' duplicate ID');names.add(a.id);
  assert.match(a.path,/^assets\/open-library\/[a-z0-9-]+\.webp$/);
  const data=fs.readFileSync(path.join(root,a.path));
  assert.equal(data.toString('ascii',0,4),'RIFF',a.id);
  assert.equal(data.toString('ascii',8,12),'WEBP',a.id);
  assert.ok(data.length>1000 && data.length<=125000,a.id+' image size outside budget');
  const hash=crypto.createHash('sha256').update(data).digest('hex');
  assert.ok(!hashes.has(hash),a.id+' duplicates an existing image');hashes.add(hash);
 }
});

test('priority categories have useful distinct source images and Community retains every credit',()=>{
 for(const topic of ['Pets','Crafts','Photography','Technology']){
  assert.ok(assets.filter(a=>a.topics.includes(topic)).length>=10,topic+' needs diverse sources');
 }
 for(const topic of ['Nonprofit','Faith & Community','Music & DJ','Fitness','Fashion']){
  assert.ok(assets.filter(a=>a.topics.includes(topic)).length>=3,topic+' needs relevant coverage');
 }
 assert.ok(assets.every(a=>a.topics.includes('Community') && a.alt && typeof a.hasPeople==='boolean'));
});
