import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前模块的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = path.join(__dirname, '../fanyikc/dist');
const targetDir = path.join(__dirname, 'my_modules/fanyikc');

fs.copy(sourceDir, targetDir, { overwrite: true }, err => {
  if (err) {
    console.error('Error copying local package:', err);
  } else {
    console.log('Local package copied successfully!');
  }
});
