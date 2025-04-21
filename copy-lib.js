// this file is a postbuild fix to copy files from outside fanscale/ into dist/

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, './lib');
const dest = path.resolve(__dirname, 'fanscale/dist/lib');

console.log(`Copying from ${src} to ${dest}...`);

fs.copy(src, dest)
  .then(() => console.log('✅ /lib copied to /dist/lib'))
  .catch(err => {
    console.error('❌ Failed to copy /lib:', err);
    process.exit(1);
  });
