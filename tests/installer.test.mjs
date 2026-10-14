import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { AGENTS, applyPlan, createPlan, detectAgents, parseArgs } from '../lib/installer.mjs';

const cli = fileURLToPath(new URL('../bin/cli.mjs', import.meta.url));
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-motion-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const context = { home: path.join(root, 'home'), cwd: path.join(root, 'project'), source: path.join(root, 'source') };
  Object.values(context).forEach((directory) => fs.mkdirSync(directory, { recursive: true }));
  fs.writeFileSync(path.join(context.source, 'SKILL.md'), 'source skill');
  fs.mkdirSync(path.join(context.source, 'references'));
  fs.writeFileSync(path.join(context.source, 'references', 'detail.md'), 'reference');
  return context;
}

test('flags validate scopes, selections, and unknown values before writes', () => {
  assert.deepEqual(parseArgs(['--agent', 'claude,roo', '--agent=roo', '-p', '-y']).agents, ['claude', 'roo']);
  for (const args of [['--project', '--global'], ['--all', '--agent', 'claude'], ['--agent'], ['--agent=,'], ['--agent=typo'], ['--typo'], ['--global', '--rules']]) {
    assert.throws(() => parseArgs(args));
  }
});

test('shared generic folders do not imply every agent is installed', (t) => {
  const context = fixture(t);
  for (const name of ['.agents', '.github', '.gemini']) fs.mkdirSync(path.join(context.home, name));
  const result = detectAgents({ ...context, env: { PATH: '' } });
  assert.equal(result.filter((agent) => agent.detected).length, 0);
  assert.throws(() => createPlan({ ...context, agents: [] }), /No agent evidence/);
});

test('command, config, and extension evidence are explicit and Roo is independent of Cline', (t) => {
  const context = fixture(t);
  fs.mkdirSync(path.join(context.home, '.claude'));
  const extensions = path.join(context.home, '.vscode/extensions');
  fs.mkdirSync(path.join(extensions, 'rooveterinaryinc.roo-cline-1.0.0'), { recursive: true });
  const bin = path.join(context.home, 'bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'codex.cmd'), '@exit');
  const result = detectAgents({ ...context, env: { PATH: bin }, platform: 'win32' });
  assert.equal(result.find((agent) => agent.id === 'roo').detected, true);
  assert.equal(result.find((agent) => agent.id === 'cline').detected, false);
  assert.match(result.find((agent) => agent.id === 'claude').evidence[0], /configuration/);
  assert.match(result.find((agent) => agent.id === 'codex').evidence[0], /PATH/);
});

test('a selected private target does not silently write a shared directory', (t) => {
  const context = fixture(t);
  const plan = createPlan({ ...context, agents: ['claude'] });
  applyPlan(plan);
  assert.equal(fs.readFileSync(path.join(context.home, '.claude/skills/ui-motion/SKILL.md'), 'utf8'), 'source skill');
  assert.equal(fs.existsSync(path.join(context.home, '.agents')), false);
  assert.equal(fs.existsSync(path.join(context.cwd, '.claude')), false);
});

test('shared destinations are disclosed and deduplicated', (t) => {
  const context = fixture(t);
  const plan = createPlan({ ...context, scope: 'both', agents: ['codex', 'antigravity'] });
  assert.equal(plan.entries.length, 3);
  assert.equal(plan.entries.filter((entry) => entry.shared).length, 2);
  assert.equal(plan.entries.find((entry) => entry.scope === 'project').agents.length, 2);
});

test('dry run is read-only and repeated installation is idempotent', (t) => {
  const context = fixture(t);
  const plan = createPlan({ ...context, scope: 'project', agents: ['roo'] });
  assert.equal(applyPlan(plan, { dryRun: true }).changed, 2);
  assert.deepEqual(fs.readdirSync(context.cwd), []);
  assert.equal(applyPlan(plan).changed, 2);
  assert.equal(applyPlan(plan).changed, 0);
});

test('a conflict in a later target stops all writes; force backs up local edits', (t) => {
  const context = fixture(t);
  const plan = createPlan({ ...context, agents: ['claude', 'roo'] });
  const roo = plan.entries[1].destination;
  fs.mkdirSync(roo, { recursive: true });
  fs.writeFileSync(path.join(roo, 'SKILL.md'), 'local edits');
  assert.throws(() => applyPlan(plan), /Existing file differs/);
  assert.equal(fs.existsSync(plan.entries[0].destination), false);
  const result = applyPlan(plan, { force: true });
  assert.equal(result.backups.length, 1);
  assert.equal(fs.readFileSync(result.backups[0], 'utf8'), 'local edits');
  assert.equal(fs.readFileSync(path.join(roo, 'SKILL.md'), 'utf8'), 'source skill');
});

test('project rule pointers preserve unrelated text and update without duplication', (t) => {
  const context = fixture(t);
  fs.writeFileSync(path.join(context.cwd, 'AGENTS.md'), '# Team rules\nKeep these.\n');
  const plan = createPlan({ ...context, scope: 'project', agents: ['codex', 'antigravity'], rules: true });
  assert.equal(plan.ruleFiles.length, 1);
  applyPlan(plan);
  const content = fs.readFileSync(path.join(context.cwd, 'AGENTS.md'), 'utf8');
  assert.ok(content.startsWith('# Team rules\nKeep these.\n'));
  assert.ok(content.includes('.agents/skills/ui-motion/SKILL.md'));
  assert.equal(applyPlan(plan).changed, 0);
  assert.equal(content.split('<!-- ui-motion:start -->').length, 2);
});

test('incomplete rule blocks fail before installing any files', (t) => {
  const context = fixture(t);
  fs.writeFileSync(path.join(context.cwd, 'AGENTS.md'), '<!-- ui-motion:start -->');
  assert.throws(() => applyPlan(createPlan({ ...context, scope: 'project', agents: ['codex'], rules: true })), /Incomplete/);
  assert.equal(fs.existsSync(path.join(context.cwd, '.agents')), false);
});

test('writing through a linked destination is rejected', (t) => {
  const context = fixture(t);
  const external = path.join(context.home, 'external');
  fs.mkdirSync(external);
  fs.symlinkSync(external, path.join(context.cwd, '.claude'), process.platform === 'win32' ? 'junction' : 'dir');
  const plan = createPlan({ ...context, scope: 'project', agents: ['claude'] });
  assert.throws(() => applyPlan(plan), /symbolic link/);
  assert.deepEqual(fs.readdirSync(external), []);
});

test('a write failure restores previous files and removes newly created files', (t) => {
  const context = fixture(t);
  const plan = createPlan({ ...context, scope: 'project', agents: ['claude'] });
  applyPlan(plan);
  const skillFile = path.join(plan.entries[0].destination, 'SKILL.md');
  fs.writeFileSync(skillFile, 'local edits');
  fs.writeFileSync(path.join(context.source, 'new.md'), 'new file');
  let renames = 0;
  const failingFs = { ...fs, renameSync: (...args) => {
    if (++renames === 2) throw new Error('simulated disk failure');
    fs.renameSync(...args);
  } };
  assert.throws(() => applyPlan(plan, { force: true, fsImpl: failingFs }), /rolled back/);
  assert.equal(fs.readFileSync(skillFile, 'utf8'), 'local edits');
  assert.equal(fs.existsSync(path.join(plan.entries[0].destination, 'new.md')), false);
});

test('the published CLI help runs, and invalid input fails without installation', () => {
  const help = spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /--dry-run/);
  const invalid = spawnSync(process.execPath, [cli, '--agent', 'does-not-exist', '-y'], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Unknown agent/);
  assert.equal(AGENTS.length, 9);
});
