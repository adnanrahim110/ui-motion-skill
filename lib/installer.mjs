import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const AGENTS = [
  { id: 'claude', name: 'Claude Code', global: '.claude/skills', project: '.claude/skills', configs: ['.claude'], commands: ['claude'], rule: 'CLAUDE.md' },
  { id: 'cursor', name: 'Cursor', global: '.cursor/skills', project: '.cursor/skills', configs: ['.cursor'], commands: ['cursor'], rule: '.cursorrules' },
  { id: 'codex', name: 'OpenAI Codex', global: '.agents/skills', project: '.agents/skills', configs: ['.codex'], commands: ['codex'], rule: 'AGENTS.md' },
  { id: 'antigravity', name: 'Google Antigravity (app/IDE)', global: '.gemini/config/skills', project: '.agents/skills', configs: ['.antigravity', '.gemini/antigravity', '.gemini/config'], commands: ['antigravity'], rule: 'AGENTS.md' },
  { id: 'windsurf', name: 'Windsurf / Cascade', global: '.codeium/windsurf/skills', project: '.windsurf/skills', configs: ['.codeium/windsurf'], commands: ['windsurf'], rule: '.windsurfrules' },
  { id: 'copilot', name: 'GitHub Copilot', global: '.copilot/skills', project: '.github/skills', configs: ['.copilot'], commands: ['copilot'], extension: /^github\.copilot(?:-chat)?-/, rule: '.github/copilot-instructions.md' },
  { id: 'gemini', name: 'Gemini CLI', global: '.gemini/skills', project: '.gemini/skills', configs: ['.gemini/settings.json'], commands: ['gemini'], rule: 'GEMINI.md' },
  { id: 'cline', name: 'Cline', global: '.cline/skills', project: '.cline/skills', configs: ['.cline'], commands: ['cline'], extension: /^saoudrizwan\.claude-dev-/, rule: '.clinerules/ui-motion.md' },
  { id: 'roo', name: 'Roo Code', global: '.roo/skills', project: '.roo/skills', configs: ['.roo'], commands: [], extension: /^rooveterinaryinc\.roo-cline-/, rule: '.roo/rules/ui-motion.md' },
];

export function parseArgs(args) {
  const options = { scope: undefined, agents: [], all: false, yes: false, dryRun: false, force: false, rules: false, help: false, list: false };
  const scopes = new Map([['--global', 'global'], ['-g', 'global'], ['--project', 'project'], ['-p', 'project'], ['--both', 'both']]);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (scopes.has(arg)) {
      const scope = scopes.get(arg);
      if (options.scope && options.scope !== scope) throw new Error('Choose only one of --global, --project, or --both.');
      options.scope = scope;
    } else if (arg === '--agent' || arg.startsWith('--agent=')) {
      const value = arg === '--agent' ? args[++i] : arg.slice('--agent='.length);
      if (!value || value.startsWith('-')) throw new Error('--agent needs a comma-separated list of agent IDs.');
      const ids = value.split(',').map((id) => id.trim()).filter(Boolean);
      if (!ids.length) throw new Error('--agent needs at least one agent ID.');
      options.agents.push(...ids);
    } else {
      const flags = { '--all': 'all', '--yes': 'yes', '-y': 'yes', '--dry-run': 'dryRun', '--force': 'force', '--rules': 'rules', '--help': 'help', '-h': 'help', '--list': 'list' };
      if (!Object.hasOwn(flags, arg)) throw new Error(`Unknown option: ${arg}. Run --help for supported flags.`);
      options[flags[arg]] = true;
    }
  }
  options.agents = [...new Set(options.agents)];
  const unknown = options.agents.filter((id) => !AGENTS.some((agent) => agent.id === id));
  if (unknown.length) throw new Error(`Unknown agent(s): ${unknown.join(', ')}. Run --list for IDs.`);
  if (options.all && options.agents.length) throw new Error('Use --all or --agent, not both.');
  if (options.rules && options.scope === 'global') throw new Error('--rules requires --project or --both; it only edits project rule files.');
  return options;
}

export function detectAgents({ home, cwd, env = process.env, platform = process.platform }) {
  const pathDirs = (env.PATH ?? env.Path ?? '').split(path.delimiter).filter(Boolean).map((entry) => entry.replace(/^"|"$/g, ''));
  const extensions = platform === 'win32' ? ['', '.exe', '.cmd', '.bat', '.ps1'] : [''];
  const editorExtensions = ['.vscode/extensions', '.vscode-insiders/extensions', '.cursor/extensions', '.windsurf/extensions']
    .flatMap((dir) => {
      try { return fs.readdirSync(path.join(home, dir)); } catch { return []; }
    });
  return AGENTS.map((agent) => {
    const evidence = [];
    const command = agent.commands.find((name) => pathDirs.some((dir) => extensions.some((ext) => {
      try {
        const candidate = path.join(dir, name + ext);
        if (!fs.statSync(candidate).isFile()) return false;
        if (platform !== 'win32') fs.accessSync(candidate, fs.constants.X_OK);
        return true;
      } catch { return false; }
    })));
    if (command) evidence.push(`${command} on PATH`);
    if (agent.extension && editorExtensions.some((name) => agent.extension.test(name.toLowerCase()))) evidence.push('editor extension found');
    const config = agent.configs.find((name) => fs.existsSync(path.join(home, name)));
    if (config) evidence.push(`configuration found: ~/${config}`);
    if (!config && agent.project !== '.agents/skills' && fs.existsSync(path.join(cwd, agent.project, 'ui-motion', 'SKILL.md'))) evidence.push('project skill already present');
    return { ...agent, detected: evidence.length > 0, evidence };
  });
}

export function createPlan({ home, cwd, source, scope = 'global', agents, rules = false }) {
  if (!['global', 'project', 'both'].includes(scope)) throw new Error(`Invalid scope: ${scope}`);
  if (!agents.length) throw new Error('No agent evidence found. Select targets with --agent <IDs> or --all; nothing was installed.');
  if (rules && scope === 'global') throw new Error('--rules requires --project or --both.');
  const entries = new Map();
  const ruleFiles = new Map();
  for (const id of agents) {
    const agent = AGENTS.find((item) => item.id === id);
    if (!agent) throw new Error(`Unknown agent: ${id}`);
    for (const tier of scope === 'both' ? ['global', 'project'] : [scope]) {
      const root = path.resolve(tier === 'global' ? home : cwd);
      const destination = path.join(root, agent[tier], 'ui-motion');
      const key = path.normalize(destination);
      if (!entries.has(key)) entries.set(key, { root, destination, scope: tier, agents: [], shared: agent[tier] === '.agents/skills' });
      const entry = entries.get(key);
      entry.agents.push(agent.name);
      if (tier === 'project' && rules) {
        const rulePath = path.join(root, agent.rule);
        if (!ruleFiles.has(rulePath)) ruleFiles.set(rulePath, { root, destination: rulePath, links: new Set() });
        const link = path.relative(path.dirname(rulePath), path.join(destination, 'SKILL.md')).split(path.sep).join('/');
        ruleFiles.get(rulePath).links.add(link);
      }
    }
  }
  return { source: path.resolve(source), entries: [...entries.values()], ruleFiles: [...ruleFiles.values()] };
}

function assertSafe(root, target, io) {
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error(`Destination escapes its install root: ${target}`);
  let current = root;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    try {
      if (io.lstatSync(current).isSymbolicLink()) throw new Error(`Refusing to overwrite through a symbolic link: ${current}`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

function sourceFiles(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isSymbolicLink()) throw new Error(`Skill source must not contain symbolic links: ${entry.name}`);
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) return sourceFiles(path.join(directory, entry.name), relative);
    if (!entry.isFile()) throw new Error(`Unsupported source entry: ${relative}`);
    return [{ relative, content: fs.readFileSync(path.join(directory, entry.name)) }];
  });
}

export function applyPlan(plan, { force = false, dryRun = false, fsImpl: io = fs } = {}) {
  if (!fs.existsSync(path.join(plan.source, 'SKILL.md'))) throw new Error('The package is incomplete: skills/ui-motion/SKILL.md is missing.');
  const files = sourceFiles(plan.source);
  const writes = [];
  let unchanged = 0;
  const prepare = (root, destination, content, isRule = false) => {
    assertSafe(root, destination, io);
    const previous = io.existsSync(destination) ? io.readFileSync(destination) : undefined;
    if (previous?.equals(content)) { unchanged++; return; }
    if (previous && !force && !isRule) throw new Error(`Existing file differs: ${destination}\nUse --force to back it up and replace it, or keep your local edits.`);
    writes.push({ root, destination, content, previous });
  };
  for (const entry of plan.entries) {
    for (const file of files) prepare(entry.root, path.join(entry.destination, file.relative), file.content);
  }
  for (const rule of plan.ruleFiles) {
    assertSafe(rule.root, rule.destination, io);
    const previous = io.existsSync(rule.destination) ? io.readFileSync(rule.destination, 'utf8') : '';
    const start = '<!-- ui-motion:start -->';
    const end = '<!-- ui-motion:end -->';
    const block = `${start}\nFor motion tasks, read ${[...rule.links].map((link) => `[ui-motion](${link})`).join(' or ')} and load only relevant references. Follow project requirements first.\n${end}`;
    const startIndex = previous.indexOf(start);
    const endIndex = previous.indexOf(end);
    if ((startIndex < 0) !== (endIndex < 0) || (startIndex >= 0 && endIndex < startIndex)) throw new Error(`Incomplete ui-motion rule markers in ${rule.destination}; repair them before retrying.`);
    const content = startIndex < 0
      ? `${previous}${previous && !previous.endsWith('\n') ? '\n' : ''}${previous ? '\n' : ''}${block}\n`
      : previous.slice(0, startIndex) + block + previous.slice(endIndex + end.length);
    prepare(rule.root, rule.destination, Buffer.from(content), true);
  }
  const summary = { changed: writes.length, unchanged, backups: [] };
  if (dryRun) return summary;
  const createdDirectories = [];
  const completed = [];
  const mkdir = (directory) => {
    if (io.existsSync(directory)) return;
    mkdir(path.dirname(directory));
    io.mkdirSync(directory);
    createdDirectories.push(directory);
  };
  const atomicWrite = (destination, content) => {
    const temporary = path.join(path.dirname(destination), `.ui-motion-${randomUUID()}.tmp`);
    try {
      io.writeFileSync(temporary, content, { flag: 'wx' });
      io.renameSync(temporary, destination);
    } finally {
      if (io.existsSync(temporary)) io.unlinkSync(temporary);
    }
  };
  try {
    for (const write of writes) {
      mkdir(path.dirname(write.destination));
      assertSafe(write.root, write.destination, io);
      if (write.previous) {
        const backup = `${write.destination}.ui-motion-backup-${randomUUID()}`;
        io.writeFileSync(backup, write.previous, { flag: 'wx' });
        summary.backups.push(backup);
      }
      atomicWrite(write.destination, write.content);
      completed.push(write);
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const write of completed.reverse()) {
      try {
        if (write.previous) atomicWrite(write.destination, write.previous);
        else io.unlinkSync(write.destination);
      } catch (rollbackError) { rollbackErrors.push(rollbackError.message); }
    }
    for (const backup of summary.backups) {
      if (rollbackErrors.length) break;
      try { io.unlinkSync(backup); } catch (rollbackError) { rollbackErrors.push(rollbackError.message); }
    }
    for (const directory of createdDirectories.reverse()) {
      try { io.rmdirSync(directory); } catch (rollbackError) {
        if (rollbackError.code !== 'ENOTEMPTY') rollbackErrors.push(rollbackError.message);
      }
    }
    throw new Error(`${error.message}\n${rollbackErrors.length ? `Rollback needs attention: ${rollbackErrors.join('; ')}` : 'Changes from this run were rolled back.'}`, { cause: error });
  }
  return summary;
}
