import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const root = fileURLToPath(new URL('../', import.meta.url));
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? entry.name === 'dist' ? [] : walk(filename) : [filename];
  });
}
const modules = ['bin', 'lib', 'scripts', 'tests', 'demo'].flatMap((dir) => walk(path.join(root, dir))).filter((filename) => filename.endsWith('.mjs'));
for (const filename of modules) {
  const result = spawnSync(process.execPath, ['--check', filename], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || `Syntax check failed: ${filename}`);
}
const codeFiles = [...modules, path.join(root, 'eslint.config.mjs'), ...walk(path.join(root, 'skills')), ...walk(path.join(root, 'tests')), ...walk(path.join(root, 'demo/src'))]
  .filter((filename) => /\.(?:mjs|tsx?|jsx?)$/.test(filename));
for (const filename of new Set(codeFiles)) {
  const content = fs.readFileSync(filename, 'utf8');
  const source = parse(content, { sourceType: 'module', plugins: /\.tsx?$/.test(filename) ? ['typescript', 'jsx'] : ['jsx'] });
  if (source.comments.length) throw new Error(`Remove code comments from ${path.relative(root, filename)}.`);
}
const documents = [path.join(root, 'README.md'), ...walk(path.join(root, 'docs')), ...walk(path.join(root, 'skills'))].filter((filename) => filename.endsWith('.md'));
for (const filename of documents) {
  const content = fs.readFileSync(filename, 'utf8');
  for (const match of content.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1];
    if (/^(?:https?:|#)/.test(target)) continue;
    const local = path.resolve(path.dirname(filename), decodeURIComponent(target.split('#')[0]));
    if (!fs.existsSync(local)) throw new Error(`Broken local link in ${path.relative(root, filename)}: ${target}`);
  }
}
const skill = fs.readFileSync(path.join(root, 'skills/ui-motion/SKILL.md'), 'utf8');
if (!/^---\r?\nname: ui-motion\r?\ndescription: >\r?\n[\s\S]+?\r?\n---\r?\n/.test(skill)) throw new Error('Invalid skill frontmatter.');
console.log(`Checked ${modules.length} JavaScript modules, ${documents.length} Markdown files, and skill frontmatter.`);
