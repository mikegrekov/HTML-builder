import path from 'node:path';
import fs from 'node:fs/promises';
import fsnp from 'node:fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dstPath = path.join(__dirname, 'files-copy');
const srcPath = path.join(__dirname, 'files');

console.log('Hello, validating folder ...');

try {
  await fs.access(dstPath, fs.constants.F_OK);
} catch (error) {
  console.log('Directory created...');
  fs.mkdir(dstPath, { recursive: true }, (err) => {
    if (err) console.log('Error<!>:', err);
});
}

async function copyFiles(src, dst) {
  const dstfiles = await fs.readdir(dst);
  for (const file of dstfiles) {
    fs.unlink(path.join(dst, file), (err) => {
      if (err) throw err;
    })
  }

  const srcfiles = await fs.readdir(src);
  for (const file of srcfiles) {
    const srcFilePath = path.join(src, file);
    const dstFilePath = path.join(dst, file);
    if ((await fs.stat(srcFilePath)).isFile) {
      console.log('Coping file: ', file);
      fsnp.createReadStream(srcFilePath).pipe(fsnp.createWriteStream(dstFilePath));
    } else if (stat.isDirectory()) {
      fs.mkdir(dstFilePath, { recursive: true });
      copyFiles(srcFilePath, dstFilePath);
    }
  }
  console.log('File coping is done');
}

copyFiles(srcPath, dstPath);

