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

const rl = readline.createInterface({ input, output });

rl.setPrompt('Hello ,please input serveral words below:\n');
rl.prompt();

fs.writeFile(path.join(__dirname, 'output.txt'), '', err => {
  if (err) {
    console.error(err);
  } else {
    console.error('write file successfully');
  }
});

rl.on('line', (input) => {
  if (input === "exit") {
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, "output.txt"), input+'\n');
  }
}).on('close',function(){
  rl.close();
  console.log('Thank you and good bye!');
});
