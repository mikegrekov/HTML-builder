import path from 'node:path';
import fs from 'node:fs/promises';
import fsnp from 'node:fs';
import { fileURLToPath } from 'url';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
// import { async } from 'fast-glob';
// import { async } from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dstPath = path.join(__dirname, 'project-dist');
const dstPathAssets = path.join(dstPath, 'assets');
const dstPathCSS = path.join(__dirname, 'project-dist', 'style.css');
const dstPathHTML = path.join(__dirname, 'project-dist', 'index.html');
const srcPathCSS = path.join(__dirname, 'styles');
const srcPathAssets = path.join(__dirname, 'assets');
const htmlTemplate = path.join(__dirname, 'template.html');

console.log('Hello, starting building project...');
await createFolder(dstPath);
await createFolder(dstPathAssets);
await copyFiles(srcPathAssets, dstPathAssets);
await mergeStyles(srcPathCSS, dstPathCSS);

async function createFolder(dst) {
  try {
    await fs.access(dst, fs.constants.F_OK);
  } catch (error) {
    console.log(`Directory ${dst} created...`);
    fs.mkdir(dst, { recursive: true }, (err) => {
      if (err) console.log('Error<!>:', err);
    });
  }
}

//copy Assets
async function copyFiles(src, dst) {
  const dstfiles = await fs.readdir(dst);
  
  for (const file of dstfiles) {
    const currentPath = path.join(dst, file);
    const fileStat = await fs.stat(currentPath);
    // console.log('Deleting ...', currentPath);
    if (fileStat.isFile() === true) {
      fs.unlink(currentPath, (err) => {
        if (err) throw err;
      });
    } else if (fileStat.isDirectory === true) {
      fs.rmdir(currentPath, (err) => {
        if (err) throw err;
      });
    }

  }

  const srcfiles = await fs.readdir(src);
  for (const file of srcfiles) {
    const srcFilePath = path.join(src, file);
    const dstFilePath = path.join(dst, file);
    const fileStat = await fs.stat(srcFilePath);
    // console.log('fileStat if a FILE = >>>: ',fileStat.isFile());
    if (fileStat.isFile() === true) {
      // console.log('Coping file: ', srcFilePath);
      fsnp
        .createReadStream(srcFilePath)
        .pipe(fsnp.createWriteStream(dstFilePath));
    } else if (fileStat.isDirectory() === true) {
      // console.log('>>>Coping folder: ', srcFilePath, ' to folder: ', dstFilePath);
      fs.mkdir(dstFilePath, { recursive: true });
      await copyFiles(srcFilePath, dstFilePath);
    }
  }
  console.log('Coping files for folder', src, ' is done');
}

//buld CSS
async function mergeStyles(srcPath, dstPath) {
  const files = await fs.readdir(srcPath, { withFileTypes: true });

  try {
    // create bundle.css
    await fs.writeFile(dstPath, '', err => {
      if (err) {
        console.error(err);
      } else {
        // console.error('Write bundle.css file successfully with no content');
      }
    });
    //read .css
    for (const file of files) {
      let filePath = path.join(file.path, file.name);
      let fileStat = await fs.stat(filePath)
      if (file.isFile() && path.extname(filePath) === '.css') {
        const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
        await fs.appendFile(dstPath, fileContent);
        console.log(`Merging style file ${path.basename(filePath, path.extname(filePath))}`);
      } 
    };
    console.log('styles.css is done');
  } catch (error) {
    console.log('error: ', error);
  }
}

await buildHTML(htmlTemplate, dstPathHTML);
// build html
async function buildHTML(templatePath, dstPath) {
  let data = "";
  const htmlTemplateContent = await fs.readFile(templatePath, { encoding: 'utf8' });
  const htmlSections = htmlTemplateContent.match(/\{\{([^}]+)\}\}/g);
  let htmlTargetContent = htmlTemplateContent;

  for (const htmlSection of htmlSections) {
    let htmlFilePath = path.join(__dirname, 'components', htmlSection.replaceAll(/[{}]/g, '').concat('.html'));
    console.log('>>>>>>>!!>>>>>>>',htmlFilePath);
    const htmlComponentContent = await fs.readFile(htmlFilePath, { encoding: 'utf8' });
    htmlTargetContent = htmlTargetContent.replace( `{{${htmlSection.replaceAll(/[{}]/g, '')}}}`, htmlComponentContent);
  }
  // console.log(htmlTargetContent);
  await fs.writeFile(dstPath, htmlTargetContent, err => {
    if (err) {
      console.error(err);
    } else {
      console.error('HTML is created, please verify');
    }
  });
}
