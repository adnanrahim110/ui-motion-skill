import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-motion-package-'));
try {
  assert.ok(process.env.npm_execpath, 'Run this check with npm run test:package.');
  const packed = JSON.parse(execFileSync(process.execPath, [process.env.npm_execpath, 'pack', '--ignore-scripts', '--json', '--pack-destination', temporary], { cwd: root, encoding: 'utf8' }));
  const metadata = Object.values(packed)[0];
  assert.ok(metadata?.filename, 'npm pack did not return a package file.');
  const packageFiles = new Set(metadata.files.map((file) => file.path));
  assert.ok(![...packageFiles].some((file) => file.startsWith('node_modules/')));
  execFileSync('tar', ['-xf', path.join(temporary, metadata.filename), '-C', temporary]);
  const cli = path.join(temporary, 'package', 'bin', 'cli.mjs');
  const project = path.join(temporary, 'project with spaces');
  fs.mkdirSync(project);
  const args = [cli, '--project', '--agent', 'claude,codex,roo', '--rules', '-y'];
  const first = execFileSync(process.execPath, args, { cwd: project, encoding: 'utf8' });
  assert.match(first, /Installation complete/);
  for (const target of ['.claude', '.agents', '.roo']) {
    const skill = path.join(project, target, 'skills', 'ui-motion');
    assert.ok(fs.existsSync(path.join(skill, 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(skill, 'references', '06-sources.md')));
    assert.ok(fs.existsSync(path.join(skill, 'assets', 'react', 'verification-code.tsx')));
  }
  assert.equal(fs.existsSync(path.join(project, '.cursor')), false);
  assert.match(fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8'), /\.agents\/skills\/ui-motion\/SKILL.md/);
  const second = execFileSync(process.execPath, args, { cwd: project, encoding: 'utf8' });
  assert.match(second, /0 file\(s\) changed/);
  console.log(`Packed ${metadata.files.length} files; isolated CLI install and repeat install passed.`);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
