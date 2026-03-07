import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distStatic = path.join(__dirname, '..', 'dist', 'static');
const distRoot = path.join(__dirname, '..', 'dist');

if (fs.existsSync(path.join(distStatic, 'index.html'))) {
  fs.renameSync(path.join(distStatic, 'index.html'), path.join(distRoot, 'index.html'));
  fs.rmSync(distStatic, { recursive: true });
}
