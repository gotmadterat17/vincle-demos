import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const files = [
  'index.html',
  'styles.css',
  'mobile.css',
  'story.css',
  'main.js',
  'mobile.js',
  'story.js',
  'a-motion.js',
  'hero-emblem.js'
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await Promise.all(files.map((file) => cp(join(root, file), join(out, file))));
await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true });
await cp(join(root, 'media'), join(out, 'media'), { recursive: true });
console.log('off-the-script static build:', out);
