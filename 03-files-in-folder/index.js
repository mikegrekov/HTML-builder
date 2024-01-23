import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'url';
import * as readline from 'node:readline/promises';
import {
  stdin as input,
  stdout as output,
} from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderPath = path.join(__dirname, 'secret-folder');

const rl = readline.createInterface({ input, output });

rl.setPrompt('Hello ,statistics of the secret-folder is below:\n');
rl.prompt();
const files = await fs.readdir(folderPath, { withFileTypes: true });
try {
  for (const file of files) {
    let filePath = path.join(file.path, file.name);
    let fileStat = await fs.stat(filePath)
    if (file.isFile()) console.log(`${path.basename(filePath, path.extname(filePath))} - ${path.extname(filePath).substring(1)} - ${fileStat.size}b`);
  };
  rl.close();
} catch (error) {
  console.log('error: ', error);
}
