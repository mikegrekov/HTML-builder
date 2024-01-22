// const fs = require('fs');
import fs from 'node:fs';
import path from 'node:path';

let data = "";

const readableStream = fs.createReadStream(path.join("01-read-file", "text.txt"), "utf-8");
readableStream.on("data", (chunk) => console.log(data += chunk));