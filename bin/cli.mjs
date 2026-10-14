#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { AGENTS, applyPlan, createPlan, detectAgents, parseArgs } from '../lib/installer.mjs';
import { CancelledError, select } from '../lib/prompts.mjs';

const packageInfo = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const help = `
ui-motion-skill ${packageInfo.version} — purposeful motion for AI coding agents

Usage: ui-motion-skill [options]

No options: three-step interactive setup in a terminal.

  -g, --global        Install across local projects (default)
  -p, --project       Install into the current directory
      --both          Install globally and into the current directory
      --agent IDs     Choose IDs, comma-separated or repeated
      --all           Choose every supported target, including undetected ones
  -y, --yes           Skip the interactive wizard
      --dry-run       Preview and check destinations without writing files
      --force         Back up and replace differing skill files
      --rules         Add small project rule pointers (--project/--both only)
      --list          List agent IDs and detection evidence without writing
  -h, --help          Show this help

Examples:
  npx github:adnanrahim110/ui-motion-skill
  ui-motion-skill --project --agent claude,cursor -y
  ui-motion-skill --global --all --dry-run

Detection is a hint from PATH, configuration, and editor extension folders.
Shared .agents/skills paths can also be read by unselected agents.
https://github.com/adnanrahim110/ui-motion-skill
`;

function printPlan(plan) {
  console.log('\nInstall destinations:');
  for (const entry of plan.entries) {
    console.log(`  [${entry.scope}] ${entry.agents.join(', ')}\n    ${entry.destination}`);
    if (entry.shared) console.log('    Shared discovery path: other compatible agents may also load this skill.');
  }
  for (const rule of plan.ruleFiles) console.log(`  Project rule pointer: ${rule.destination}`);
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) { console.log(help); return; }
  const context = { home: os.homedir(), cwd: process.cwd() };
  const detected = detectAgents(context);
  if (options.list) {
    for (const agent of detected) console.log(`${agent.id.padEnd(13)} ${agent.name}: ${agent.evidence.join('; ') || 'no evidence found'}`);
    return;
  }
  let scope = options.scope ?? 'global';
  let agents = options.all ? AGENTS.map((agent) => agent.id) : options.agents.length ? options.agents : detected.filter((agent) => agent.detected).map((agent) => agent.id);
  let rules = options.rules;
  const interactive = process.stdin.isTTY && process.stdout.isTTY && !options.yes && !options.dryRun;
  const source = fileURLToPath(new URL('../skills/ui-motion', import.meta.url));
  if (interactive) {
    console.log(`\nUI-MOTION SKILL v${packageInfo.version} • by @adnanrahim110\n`);
    scope = await select({ step: 1, title: 'Choose installation scope', items: [
      { label: 'Global — available across local projects', value: 'global', checked: scope === 'global' },
      { label: 'Current project — share through version control', value: 'project', checked: scope === 'project' },
      { label: 'Both global and current project', value: 'both', checked: scope === 'both' },
    ] });
    console.log('\nDetected targets are preselected. Configuration evidence does not prove an app is installed.');
    agents = await select({ step: 2, title: 'Select AI agents', multiple: true, items: detected.map((agent) => ({
      label: `${agent.name} (${agent.id}) — ${agent.evidence.join('; ') || 'no evidence; select manually if needed'}`,
      value: agent.id,
      checked: agents.includes(agent.id),
    })) });
    const plan = createPlan({ ...context, source, scope, agents, rules });
    printPlan(plan);
    if (scope !== 'global' && !rules) {
      const withRules = createPlan({ ...context, source, scope, agents, rules: true });
      console.log('\nOptional project rule pointers (if selected below):');
      for (const rule of withRules.ruleFiles) console.log(`  ${rule.destination}`);
    }
    const action = await select({ step: 3, title: 'Review and install', items: [
      { label: rules ? 'Install skill and project rule pointers' : 'Install skill files', value: 'install', checked: true },
      ...(scope !== 'global' && !rules ? [{ label: 'Install skill and add small project rule pointers', value: 'rules' }] : []),
      { label: 'Cancel without writing files', value: 'cancel' },
    ] });
    if (action === 'cancel') throw new CancelledError();
    rules ||= action === 'rules';
  } else if (!options.yes && !options.dryRun) {
    throw new Error('A non-interactive run requires --yes or --dry-run. Run --help for examples.');
  }
  const plan = createPlan({ ...context, source, scope, agents, rules });
  printPlan(plan);
  const result = applyPlan(plan, { force: options.force, dryRun: options.dryRun });
  console.log(`\n${options.dryRun ? 'Preview only' : 'Installation complete'}: ${result.changed} file(s) ${options.dryRun ? 'would change' : 'changed'}, ${result.unchanged} unchanged.`);
  if (result.backups.length) console.log(`Saved ${result.backups.length} adjacent .ui-motion-backup-* file(s).`);
  if (!options.dryRun) console.log('Reload skills or restart the target agent if needed. Ask it to use ui-motion; invocation syntax varies by agent.');
}

run().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = error instanceof CancelledError ? 0 : 1;
});
