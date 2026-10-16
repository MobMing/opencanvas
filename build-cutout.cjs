const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const source = path.join(__dirname, 'assets/cutout'), target = path.join(__dirname, 'dist/cutout');
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json'), 'utf8'));
fs.mkdirSync(target, { recursive: true });
for (const part of [...manifest.wasm.parts, ...manifest.model.parts]) {
  const bytes = fs.readFileSync(path.join(source, part.file));
  if (bytes.length !== part.bytes || crypto.createHash('sha256').update(bytes).digest('hex') !== part.sha256) throw Error('Invalid cutout asset: ' + part.file);
}
for (const file of fs.readdirSync(source)) fs.copyFileSync(path.join(source, file), path.join(target, file));
fs.copyFileSync(path.join(__dirname, 'cutout-worker.js'), path.join(target, 'worker.js'));
console.log('Optional person cutout tools built (downloaded only when requested).');
