/* Bounded, on-device ZIP reader for presentation imports. No files are extracted. */
function importZipCRC32(bytes,check=()=>{}){
  let crc=0xffffffff;
  for(let i=0;i<bytes.length;i++){
    if((i&65535)===0)check();
    crc^=bytes[i];
    for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
  }
  return (crc^0xffffffff)>>>0;
}
async function importZIPArchive(input,{check=()=>{},maxExpanded=80*1024*1024,maxEntries=2000}={}){
  const fail=message=>{throw Error('Cannot import this presentation: '+message);};
  if(typeof check!=='function')throw TypeError('The import cancellation check must be a function.');
  if(!Number.isSafeInteger(maxExpanded)||maxExpanded<0||maxExpanded>80*1024*1024||!Number.isSafeInteger(maxEntries)||maxEntries<0||maxEntries>2000)throw RangeError('Invalid ZIP import limits.');
  let bytes;
  if(ArrayBuffer.isView(input)&&input.BYTES_PER_ELEMENT===1)bytes=new Uint8Array(input.buffer,input.byteOffset,input.byteLength);
  else if(Object.prototype.toString.call(input)==='[object ArrayBuffer]')bytes=new Uint8Array(input);
  else throw TypeError('The presentation must be an ArrayBuffer or byte array.');
  check();
  if(bytes.length>30*1024*1024)fail('the file exceeds the 30 MB limit.');
  if(bytes.length<22)fail('the ZIP archive is incomplete.');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),u16=offset=>view.getUint16(offset,true),u32=offset=>view.getUint32(offset,true);
  const fits=(offset,length,end=bytes.length)=>Number.isSafeInteger(offset)&&Number.isSafeInteger(length)&&offset>=0&&length>=0&&offset<=end&&length<=end-offset;
  let end=-1;
  for(let i=bytes.length-22,min=Math.max(0,bytes.length-22-65535);i>=min;i--){
    if(u32(i)===0x06054b50&&i+22+u16(i+20)===bytes.length){end=i;break;}
  }
  if(end<0)fail('the ZIP directory is missing or incomplete.');
  if(end>=20&&u32(end-20)===0x07064b50)fail('ZIP64 archives are not supported.');
  const count=u16(end+10),directorySize=u32(end+12),directoryOffset=u32(end+16);
  if(count===0xffff||directorySize===0xffffffff||directoryOffset===0xffffffff)fail('ZIP64 archives are not supported.');
  if(u16(end+4)!==0||u16(end+6)!==0||u16(end+8)!==count)fail('split ZIP archives are not supported.');
  if(count>maxEntries)fail('the archive contains too many files.');
  if(!fits(directoryOffset,directorySize,end)||directoryOffset+directorySize!==end)fail('the ZIP directory is invalid.');
  const extra=(offset,length)=>{
    const limit=offset+length;
    while(offset<limit){
      if(!fits(offset,4,limit))fail('a ZIP extra field is incomplete.');
      const id=u16(offset),size=u16(offset+2);offset+=4;
      if(!fits(offset,size,limit))fail('a ZIP extra field is incomplete.');
      if(id===1)fail('ZIP64 archives are not supported.');
      offset+=size;
    }
  };
  const decodeName=(offset,length,flags)=>{
    const raw=bytes.subarray(offset,offset+length);
    if(!(flags&0x800)&&raw.some(byte=>byte>127))fail('an archive filename uses an unsupported encoding.');
    let name;
    try{name=new TextDecoder('utf-8',{fatal:true}).decode(raw);}catch{fail('an archive filename is invalid.');}
    if(!name||/[\u0000-\u001f\u007f\\:]/.test(name)||name.startsWith('/'))fail('an archive filename is unsafe.');
    const parts=name.split('/');
    if(parts.some((part,index)=>part==='.'||part==='..'||(!part&&index!==parts.length-1)))fail('an archive filename is unsafe.');
    return name;
  };
  const entries=[],names=new Set();let position=directoryOffset,expanded=0;
  for(let index=0;index<count;index++){
    check();
    if(!fits(position,46,end)||u32(position)!==0x02014b50)fail('the ZIP directory entry is incomplete.');
    const needed=u16(position+6),flags=u16(position+8),method=u16(position+10),crc=u32(position+16),compressedSize=u32(position+20),size=u32(position+24),nameLength=u16(position+28),extraLength=u16(position+30),commentLength=u16(position+32),disk=u16(position+34),attributes=u32(position+38),localOffset=u32(position+42);
    if(size===0xffffffff||compressedSize===0xffffffff||localOffset===0xffffffff)fail('ZIP64 archives are not supported.');
    if(disk!==0)fail('split ZIP archives are not supported.');
    if(flags&(1|64|8192))fail('password-protected presentations are not supported.');
    if(needed>20||(flags&~0x80e)||(method!==0&&method!==8)||(method===0&&(flags&6)))fail('the archive uses an unsupported ZIP feature.');
    if(!fits(position,46+nameLength+extraLength+commentLength,end))fail('the ZIP directory entry is incomplete.');
    const name=decodeName(position+46,nameLength,flags);
    if(names.has(name))fail('the archive contains duplicate filenames.');
    names.add(name);
    if(((attributes>>>16)&0xf000)===0xa000)fail('symbolic links are not supported.');
    if((name.endsWith('/')&&size!==0)||((attributes&16)&&!name.endsWith('/')))fail('an archive directory entry is invalid.');
    extra(position+46+nameLength,extraLength);
    if(size>maxExpanded-expanded)fail('the expanded presentation exceeds the size limit.');
    expanded+=size;
    if(method===0&&compressedSize!==size)fail('a stored ZIP entry has inconsistent sizes.');
    if(!fits(localOffset,30,directoryOffset)||u32(localOffset)!==0x04034b50)fail('a local ZIP header is invalid.');
    if(u16(localOffset+4)!==needed||u16(localOffset+6)!==flags||u16(localOffset+8)!==method||u32(localOffset+10)!==u32(position+12))fail('ZIP headers disagree.');
    const localCRC=u32(localOffset+14),localCompressed=u32(localOffset+18),localSize=u32(localOffset+22),localNameLength=u16(localOffset+26),localExtraLength=u16(localOffset+28);
    if(localSize===0xffffffff||localCompressed===0xffffffff)fail('ZIP64 archives are not supported.');
    if(flags&8){
      if((localCRC!==0&&localCRC!==crc)||(localCompressed!==0&&localCompressed!==compressedSize)||(localSize!==0&&localSize!==size))fail('ZIP headers disagree.');
    }else if(localCRC!==crc||localCompressed!==compressedSize||localSize!==size)fail('ZIP headers disagree.');
    if(!fits(localOffset,30+localNameLength+localExtraLength,directoryOffset)||localNameLength!==nameLength)fail('a local ZIP header is incomplete.');
    for(let j=0;j<nameLength;j++)if(bytes[localOffset+30+j]!==bytes[position+46+j])fail('ZIP filenames disagree.');
    extra(localOffset+30+localNameLength,localExtraLength);
    const dataOffset=localOffset+30+localNameLength+localExtraLength;
    if(!fits(dataOffset,compressedSize,directoryOffset))fail('a ZIP file is incomplete.');
    let dataEnd=dataOffset+compressedSize;
    if(flags&8){
      const descriptorMatches=offset=>fits(offset,12,directoryOffset)&&u32(offset)===crc&&u32(offset+4)===compressedSize&&u32(offset+8)===size;
      if(fits(dataEnd,4,directoryOffset)&&u32(dataEnd)===0x08074b50&&descriptorMatches(dataEnd+4))dataEnd+=16;
      else if(descriptorMatches(dataEnd))dataEnd+=12;
      else fail('a ZIP data descriptor is invalid.');
    }
    entries.push({name,method,crc,size,compressedSize,localOffset,dataOffset,dataEnd});
    position+=46+nameLength+extraLength+commentLength;
  }
  if(position!==end)fail('the ZIP directory size is inconsistent.');
  const ordered=[...entries].sort((a,b)=>a.localOffset-b.localOffset);let previousEnd=0;
  for(const entry of ordered){
    if(entry.localOffset<previousEnd)fail('ZIP file ranges overlap.');
    previousEnd=entry.dataEnd;
  }
  const result=new Map();
  for(const entry of entries){
    check();
    const compressed=bytes.subarray(entry.dataOffset,entry.dataOffset+entry.compressedSize);let output;
    if(entry.method===0)output=compressed.slice();
    else{
      if(typeof DecompressionStream!=='function'||typeof ReadableStream!=='function')fail('this browser cannot decompress presentations. Please use a current browser.');
      let decompressor;
      try{decompressor=new DecompressionStream('deflate-raw');}catch{fail('this browser cannot decompress presentations. Please use a current browser.');}
      output=new Uint8Array(entry.size);let sourceOffset=0,writeOffset=0,done=false;
      const source=new ReadableStream({pull(controller){check();if(sourceOffset===compressed.length){controller.close();return;}const next=Math.min(sourceOffset+65536,compressed.length);controller.enqueue(compressed.subarray(sourceOffset,next));sourceOffset=next;}});
      const reader=source.pipeThrough(decompressor).getReader();
      try{
        while(true){
          check();const chunk=await reader.read();check();
          if(chunk.done){done=true;break;}
          if(chunk.value.length>entry.size-writeOffset)fail('a compressed file exceeds its declared size.');
          output.set(chunk.value,writeOffset);writeOffset+=chunk.value.length;
        }
        if(writeOffset!==entry.size)fail('a compressed file has an inconsistent size.');
      }finally{
        if(!done)await reader.cancel().catch(()=>{});
        reader.releaseLock();
      }
    }
    if(importZipCRC32(output,check)!==entry.crc)fail('a file failed its ZIP integrity check.');
    result.set(entry.name,output);
  }
  check();return result;
}
