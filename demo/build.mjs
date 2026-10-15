import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('./dist/', import.meta.url));
fs.mkdirSync(output, { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: ['demo/src/main.tsx'],
  outfile: 'demo/dist/app.js',
  bundle: true,
  minify: true,
  sourcemap: false,
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
});
execFileSync(process.execPath, ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'demo/src/globals.css', '-o', 'demo/dist/app.css', '--minify'], { cwd: root, stdio: 'inherit' });
fs.copyFileSync(new URL('./index.html', import.meta.url), new URL('./dist/index.html', import.meta.url));
console.log('Built the UI Motion demo.');
