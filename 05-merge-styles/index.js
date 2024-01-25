import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
const dstPath = path.join(__dirname, 'project-dist','bundle.css');
const srcPath = path.join(__dirname, 'styles');

console.log('Hello, starting copy .css styles...');


try {
  // create bundle.css
  const files = await fs.readdir(srcPath, { withFileTypes: true });

  await fs.writeFile(dstPath, '', err => {
    if (err) {
      console.error(err);
    } else {
      console.error('Write bundle.css file successfully with no content');
    }
  });
  //read .css
  for (const file of files) {
    console.log('dirent >>>>>>>>',srcPath, file.name);
    let filePath = path.join(srcPath, file.name);
    // let filePath = path.join(file.path, file.name);
    let fileStat = await fs.stat(filePath)
    if (file.isFile() && path.extname(filePath) === '.css') {
      const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
      await fs.appendFile(dstPath, fileContent);
      
      console.log(`${path.basename(filePath, path.extname(filePath))} - ${path.extname(filePath).substring(1)} - ${fileStat.size}b`);
    } 
  };
  console.log('bundle.css is done');
} catch (error) {
  console.log('Heppened error: ', error);
}


