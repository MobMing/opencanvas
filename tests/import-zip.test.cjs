const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib');
const ctx=vm.createContext({Uint8Array,ArrayBuffer,DataView,TextDecoder,ReadableStream,DecompressionStream});
vm.runInContext(fs.readFileSync('import-zip.js','utf8'),ctx);
const crc=bytes=>ctx.importZipCRC32(bytes);
function zip(files,comment=''){
  const local=[],central=[];let offset=0;
  for(const file of files){
    const name=Buffer.from(file.name),data=Buffer.from(file.data||''),method=file.method||0,compressed=method===8?zlib.deflateRawSync(data):data,flags=file.flags||0,checksum=crc(data),header=Buffer.alloc(30),directory=Buffer.alloc(46),extra=file.extra||Buffer.alloc(0);
    header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(flags,6);header.writeUInt16LE(method,8);
    if(!(flags&8)){header.writeUInt32LE(checksum,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);}
    header.writeUInt16LE(name.length,26);header.writeUInt16LE(extra.length,28);
    let descriptor=Buffer.alloc(0);
    if(flags&8){const signed=file.signed!==false;descriptor=Buffer.alloc(signed?16:12);let p=0;if(signed){descriptor.writeUInt32LE(0x08074b50);p=4;}descriptor.writeUInt32LE(checksum,p);descriptor.writeUInt32LE(compressed.length,p+4);descriptor.writeUInt32LE(data.length,p+8);}
    directory.writeUInt32LE(0x02014b50);directory.writeUInt16LE(20,4);directory.writeUInt16LE(20,6);directory.writeUInt16LE(flags,8);directory.writeUInt16LE(method,10);directory.writeUInt32LE(checksum,16);directory.writeUInt32LE(compressed.length,20);directory.writeUInt32LE(data.length,24);directory.writeUInt16LE(name.length,28);directory.writeUInt16LE(extra.length,30);directory.writeUInt32LE(offset,42);
    const block=Buffer.concat([header,name,extra,compressed,descriptor]);local.push(block);central.push(Buffer.concat([directory,name,extra]));offset+=block.length;
  }
  const cd=Buffer.concat(central),end=Buffer.alloc(22),note=Buffer.from(comment);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);end.writeUInt16LE(note.length,20);return Buffer.concat([...local,cd,end,note]);
}
const cdOffset=buffer=>buffer.readUInt32LE(buffer.length-6);
const reject=(buffer,pattern,options)=>assert.rejects(ctx.importZIPArchive(buffer,options),pattern);
test('ZIP imports stored, deflated, UTF-8, empty and commented archives',async()=>{
  const archive=zip([{name:'[Content_Types].xml',data:'<Types/>'},{name:'ppt/slides/slide1.xml',data:'<slide>Hello</slide>'.repeat(200),method:8},{name:'ppt/media/caf\u00e9.png',data:'bytes',flags:0x800},{name:'ppt/'}],'archive comment');
  const files=await ctx.importZIPArchive(archive);
  assert.equal(files.size,4);assert.equal(new TextDecoder().decode(files.get('ppt/slides/slide1.xml')),'<slide>Hello</slide>'.repeat(200));assert.equal(files.get('ppt/').length,0);
  assert.equal((await ctx.importZIPArchive(zip([]))).size,0);
  const padded=Buffer.concat([Buffer.alloc(17),archive,Buffer.alloc(13)]);assert.equal((await ctx.importZIPArchive(padded.subarray(17,-13))).size,4);
});
test('ZIP supports both legal data descriptor encodings',async()=>{
  for(const signed of [false,true])assert.equal((await ctx.importZIPArchive(zip([{name:'slide.xml',data:'slide content',method:8,flags:8,signed}]))).get('slide.xml').length,13);
});
test('CRC32 matches the standard check vector',()=>{assert.equal(crc(Buffer.from('123456789')),0xcbf43926)});
test('ZIP rejects unsafe, ambiguous, duplicate, and invalid filename encodings',async()=>{
  for(const name of ['../evil','a/../evil','/absolute','C:/file','a\\file','a//file','a/./file','\0bad',''])await reject(zip([{name}]),/filename/);
  await reject(zip([{name:'a'},{name:'a'}]),/duplicate/);
  await reject(zip([{name:'caf\u00e9'}]),/encoding/);
  const invalid=zip([{name:'ab',flags:0x800}]);invalid[30]=0xff;invalid[cdOffset(invalid)+46]=0xff;await reject(invalid,/filename is invalid/);
});
test('ZIP rejects encryption, unsupported methods, ZIP64, and multipart archives',async()=>{
  for(const flags of [1,64,8192])await reject(zip([{name:'a',flags}]),/password-protected/);
  await reject(zip([{name:'a',method:12}]),/unsupported/);
  const split=zip([{name:'a'}]);split.writeUInt16LE(1,split.length-18);await reject(split,/split/);
  const zip64=zip([{name:'a'}]);zip64.writeUInt32LE(0xffffffff,zip64.length-10);await reject(zip64,/ZIP64/);
  await reject(zip([{name:'a',extra:Buffer.from([1,0,0,0])}]),/ZIP64/);
  const link=zip([{name:'a'}]);link.writeUInt32LE((0xa1ff<<16)>>>0,cdOffset(link)+38);await reject(link,/symbolic/);
});
test('ZIP validates headers, filenames, bounds, descriptors, CRCs, and central count',async()=>{
  const original=zip([{name:'a',data:'hello'}]);
  for(const alter of [b=>b.writeUInt16LE(8,8),b=>b.writeUInt32LE(77,18),b=>b[30]=98,b=>b[31]^=32,b=>b.writeUInt16LE(65535,26),b=>b.writeUInt32LE(999999,cdOffset(b)+42),b=>b.writeUInt16LE(2,b.length-12)]){
    const changed=Buffer.from(original);alter(changed);await reject(changed,/Cannot import/);
  }
  const descriptor=zip([{name:'a',data:'hello',flags:8,method:8}]);descriptor[cdOffset(descriptor)-1]^=1;await reject(descriptor,/descriptor/);
  await reject(original.subarray(0,-1),/directory/);
  await reject(Buffer.concat([original,Buffer.from([0])]),/directory/);
});
test('ZIP limits apply before expansion and stop dishonest expansion sizes',async()=>{
  await reject(new Uint8Array(30*1024*1024+1),/30 MB/);
  await reject(zip([{name:'a'},{name:'b'}]),/too many/,{maxEntries:1});
  await reject(zip([{name:'a',data:'abc'},{name:'b',data:'abc'}]),/expanded/,{maxExpanded:5});
  const bomb=zip([{name:'a',data:'x'.repeat(1000000),method:8}]);bomb.writeUInt32LE(1,22);bomb.writeUInt32LE(1,cdOffset(bomb)+24);await reject(bomb,/declared size/);
  const truncated=zip([{name:'a',data:'short',method:8}]);truncated.writeUInt32LE(8,22);truncated.writeUInt32LE(8,cdOffset(truncated)+24);await reject(truncated,/inconsistent size/);
});
test('ZIP rejects overlapping entries even when the second header is internally consistent',async()=>{
  const inner=zip([{name:'inner',data:'nested file'}]),innerCD=cdOffset(inner),nestedLocal=inner.subarray(0,innerCD);
  const outer=zip([{name:'outer',data:nestedLocal}]),outerCD=cdOffset(outer),innerEntry=Buffer.from(inner.subarray(innerCD,-22));
  innerEntry.writeUInt32LE(35,42);
  const end=Buffer.from(outer.subarray(-22));end.writeUInt16LE(2,8);end.writeUInt16LE(2,10);end.writeUInt32LE(end.readUInt32LE(12)+innerEntry.length,12);
  await reject(Buffer.concat([outer.subarray(0,-22),innerEntry,end]),/overlap/);
});
test('ZIP cancellation interrupts preflight and decompression without returning partial contents',async()=>{
  let checks=0;await reject(zip([{name:'a',data:'hello'}]),/Cancelled/,{check(){if(++checks===2)throw Error('Cancelled');}});
  const compressed=zip([{name:'a',data:'hello'.repeat(500000),method:8}]);checks=0;
  await reject(compressed,/Cancelled/,{check(){if(++checks===8)throw Error('Cancelled');}});
});
