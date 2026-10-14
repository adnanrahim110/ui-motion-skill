#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILL_SOURCE_DIR = path.resolve(__dirname, '../skills/ui-motion');
const HOME = os.homedir();
const CWD = process.cwd();

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  bgCyan: '\x1b[46m\x1b[30m',
};

const AGENTS = [
  {
    id: 'claude',
    name: 'Claude Code',
    vendor: 'Anthropic',
    detectPaths: [path.join(HOME, '.claude'), path.join(CWD, '.claude')],
    globalSkillDir: path.join(HOME, '.claude', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.claude', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, 'CLAUDE.md'),
  },
  {
    id: 'cursor',
    name: 'Cursor',
    vendor: 'Anysphere',
    detectPaths: [path.join(HOME, '.cursor'), path.join(CWD, '.cursor')],
    globalSkillDir: path.join(HOME, '.cursor', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.cursor', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, '.cursorrules'),
  },
  {
    id: 'codex',
    name: 'OpenAI Codex CLI',
    vendor: 'OpenAI',
    detectPaths: [path.join(HOME, '.codex'), path.join(HOME, '.agents'), path.join(CWD, '.codex')],
    globalSkillDir: path.join(HOME, '.codex', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.codex', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, 'AGENTS.md'),
  },
  {
    id: 'antigravity',
    name: 'Google Antigravity',
    vendor: 'Google',
    detectPaths: [
      path.join(HOME, '.gemini', 'antigravity'),
      path.join(HOME, '.antigravity'),
      path.join(CWD, '.agents'),
    ],
    globalSkillDir: path.join(HOME, '.gemini', 'antigravity', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.agents', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, 'AGENTS.md'),
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    vendor: 'Codeium',
    detectPaths: [
      path.join(HOME, '.codeium', 'windsurf'),
      path.join(HOME, '.windsurf'),
      path.join(CWD, '.windsurf'),
    ],
    globalSkillDir: path.join(HOME, '.codeium', 'windsurf', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.windsurf', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, '.windsurfrules'),
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    vendor: 'GitHub',
    detectPaths: [path.join(HOME, '.copilot'), path.join(CWD, '.github')],
    globalSkillDir: path.join(HOME, '.copilot', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.github', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, '.github', 'copilot-instructions.md'),
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    vendor: 'Google',
    detectPaths: [path.join(HOME, '.gemini')],
    globalSkillDir: path.join(HOME, '.gemini', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.gemini', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, 'GEMINI.md'),
  },
  {
    id: 'cline',
    name: 'Cline / Roo Code',
    vendor: 'Open Source',
    detectPaths: [path.join(HOME, '.cline'), path.join(HOME, '.roo'), path.join(CWD, '.clinerules')],
    globalSkillDir: path.join(HOME, '.cline', 'skills', 'ui-motion'),
    projectSkillDir: path.join(CWD, '.cline', 'skills', 'ui-motion'),
    legacyRuleFile: path.join(CWD, '.clinerules'),
  },
];

function detectInstalledAgents() {
  return AGENTS.map((agent) => {
    const detected = agent.detectPaths.some((p) => fs.existsSync(p));
    return { ...agent, detected };
  });
}

function copyDirectoryRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function printBanner() {
  console.clear();
  console.log('');
  console.log(
    `  ${c.bgCyan}${c.bold} UI-MOTION SKILL ${c.reset} ${c.cyan}v1.0.0${c.reset} ${c.dim}• by @adnanrahim110${c.reset}`
  );
  console.log(`  ${c.dim}Science-backed UI/UX animation engineering for AI coding agents${c.reset}`);
  console.log(`  ${c.gray}─────────────────────────────────────────────────────────────────${c.reset}`);
  console.log('');
}

function promptSingleSelect({ step, totalSteps, title, subtitle, options, defaultIndex = 0 }) {
  return new Promise((resolve) => {
    let cursor = defaultIndex;
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    readline.emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    const render = (firstRender = false) => {
      if (!firstRender) {
        readline.moveCursor(process.stdout, 0, -(options.length + 4));
        readline.clearScreenDown(process.stdout);
      }
      console.log(`  ${c.cyan}${c.bold}◆ Step ${step} of ${totalSteps}:${c.reset} ${c.bold}${title}${c.reset}`);
      console.log(`  ${c.gray}│ ${subtitle}${c.reset}`);
      console.log(`  ${c.gray}│${c.reset}`);
      options.forEach((opt, idx) => {
        const isActive = idx === cursor;
        const radio = isActive ? `${c.green}●${c.reset}` : `${c.gray}○${c.reset}`;
        const label = isActive ? `${c.bold}${c.cyan}${opt.label}${c.reset}` : opt.label;
        const hint = opt.hint ? ` ${c.dim}(${opt.hint})${c.reset}` : '';
        console.log(`  ${c.gray}│${c.reset}  ${radio} ${label}${hint}`);
      });
      console.log(`  ${c.gray}└─ Use ↑/↓ arrows, Enter to confirm${c.reset}`);
    };

    render(true);

    const onKeypress = (_, key) => {
      if (!key) return;
      if (key.ctrl && key.name === 'c') {
        cleanup();
        console.log(`\n  ${c.red}✖ Installation cancelled.${c.reset}\n`);
        process.exit(0);
      }
      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + options.length) % options.length;
        render();
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % options.length;
        render();
      } else if (key.name === 'return' || key.name === 'enter') {
        cleanup();
        readline.moveCursor(process.stdout, 0, -(options.length + 4));
        readline.clearScreenDown(process.stdout);
        console.log(`  ${c.green}✔${c.reset} ${c.bold}${title}:${c.reset} ${c.cyan}${options[cursor].label}${c.reset}`);
        console.log(`  ${c.gray}│${c.reset}`);
        resolve(options[cursor].value);
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      rl.close();
    };

    process.stdin.on('keypress', onKeypress);
  });
}

function promptMultiSelect({ step, totalSteps, title, subtitle, items }) {
  return new Promise((resolve) => {
    let cursor = 0;
    const selected = new Set(
      items.map((item, idx) => (item.checked ? idx : -1)).filter((i) => i !== -1)
    );
    if (selected.size === 0) {
      selected.add(0);
      selected.add(1);
      selected.add(2);
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    readline.emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    const render = (firstRender = false) => {
      if (!firstRender) {
        readline.moveCursor(process.stdout, 0, -(items.length + 5));
        readline.clearScreenDown(process.stdout);
      }
      console.log(`  ${c.cyan}${c.bold}◆ Step ${step} of ${totalSteps}:${c.reset} ${c.bold}${title}${c.reset}`);
      console.log(`  ${c.gray}│ ${subtitle}${c.reset}`);
      console.log(`  ${c.gray}│${c.reset}`);
      items.forEach((item, idx) => {
        const isCurrent = idx === cursor;
        const isChecked = selected.has(idx);
        const pointer = isCurrent ? `${c.cyan}❯${c.reset}` : ' ';
        const checkbox = isChecked ? `${c.green}[✓]${c.reset}` : `${c.gray}[ ]${c.reset}`;
        const label = isCurrent ? `${c.bold}${item.label}${c.reset}` : item.label;
        const badge = item.detected
          ? ` ${c.green}${c.dim}● detected on PC${c.reset}`
          : ` ${c.gray}${c.dim}○ not detected${c.reset}`;
        console.log(`  ${c.gray}│${c.reset} ${pointer} ${checkbox} ${label}${badge}`);
      });
      console.log(`  ${c.gray}│${c.reset}`);
      console.log(
        `  ${c.gray}└─ ↑/↓ move • Space toggle • 'a' toggle all • Enter confirm (${selected.size} selected)${c.reset}`
      );
    };

    render(true);

    const onKeypress = (_, key) => {
      if (!key) return;
      if (key.ctrl && key.name === 'c') {
        cleanup();
        console.log(`\n  ${c.red}✖ Installation cancelled.${c.reset}\n`);
        process.exit(0);
      }
      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + items.length) % items.length;
        render();
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % items.length;
        render();
      } else if (key.name === 'space') {
        if (selected.has(cursor)) selected.delete(cursor);
        else selected.add(cursor);
        render();
      } else if (key.name === 'a') {
        if (selected.size === items.length) selected.clear();
        else items.forEach((_, idx) => selected.add(idx));
        render();
      } else if (key.name === 'return' || key.name === 'enter') {
        if (selected.size === 0) return;
        cleanup();
        readline.moveCursor(process.stdout, 0, -(items.length + 5));
        readline.clearScreenDown(process.stdout);
        const chosenNames = Array.from(selected)
          .map((i) => items[i].value.name)
          .join(', ');
        console.log(`  ${c.green}✔${c.reset} ${c.bold}${title}:${c.reset} ${c.cyan}${chosenNames}${c.reset}`);
        console.log(`  ${c.gray}│${c.reset}`);
        resolve(Array.from(selected).map((i) => items[i].value));
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      rl.close();
    };

    process.stdin.on('keypress', onKeypress);
  });
}

async function run() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
  ${c.bold}ui-motion-skill${c.reset} - Science-Backed UI/UX Animation Skill for AI Agents
  ${c.dim}Created by Adnan Rahim (https://github.com/adnanrahim110/ui-motion-skill)${c.reset}

  ${c.bold}Usage:${c.reset}
    npx github:adnanrahim110/ui-motion-skill              Launch interactive setup stepper
    npx github:adnanrahim110/ui-motion-skill --global -y  Install globally to all detected agents
    npx github:adnanrahim110/ui-motion-skill --project -y Install into current project directory
    npx github:adnanrahim110/ui-motion-skill --all -y     Install globally to all supported agents
`);
    process.exit(0);
  }

  if (!fs.existsSync(SKILL_SOURCE_DIR)) {
    console.error(`${c.red}✖ Error: Skill source directory not found at ${SKILL_SOURCE_DIR}${c.reset}`);
    process.exit(1);
  }

  const detectedAgents = detectInstalledAgents();
  const isNonInteractive = args.includes('-y') || args.includes('--yes') || !process.stdin.isTTY;

  let scope = 'global';
  let chosenAgents = [];
  let installMode = 'skill_folder';

  if (isNonInteractive) {
    scope = args.includes('--project') || args.includes('-p') ? 'project' : 'global';
    const installAll = args.includes('--all');
    chosenAgents = installAll ? detectedAgents : detectedAgents.filter((a) => a.detected);
    if (chosenAgents.length === 0) chosenAgents = detectedAgents.slice(0, 4);
  } else {
    printBanner();

    scope = await promptSingleSelect({
      step: 1,
      totalSteps: 3,
      title: 'Where do you want to install this skill?',
      subtitle: 'Global makes the skill available across every project on your PC.',
      options: [
        {
          label: 'Global (PC-wide)',
          hint: 'Recommended • Available in all projects automatically',
          value: 'global',
        },
        {
          label: 'Current Project Only',
          hint: `Installs into ${path.basename(CWD)} for Git team sharing`,
          value: 'project',
        },
        {
          label: 'Both Global & Current Project',
          hint: 'Installs PC-wide + commits into current repo',
          value: 'both',
        },
      ],
      defaultIndex: 0,
    });

    chosenAgents = await promptMultiSelect({
      step: 2,
      totalSteps: 3,
      title: 'Select AI agents to configure',
      subtitle: 'Agents detected on your PC are pre-selected by default.',
      items: detectedAgents.map((agent) => ({
        label: `${agent.name.padEnd(20)} ${c.dim}(${
          scope === 'project'
            ? path.relative(CWD, agent.projectSkillDir)
            : agent.globalSkillDir.replace(HOME, '~')
        })${c.reset}`,
        detected: agent.detected,
        checked: agent.detected,
        value: agent,
      })),
    });

    installMode = await promptSingleSelect({
      step: 3,
      totalSteps: 3,
      title: 'Choose installation format',
      subtitle: 'Modular SKILL.md loads deep reference files on-demand to save context tokens.',
      options: [
        {
          label: 'Modular SKILL.md + Reference Library',
          hint: 'Recommended • Full 5-part reference suite',
          value: 'skill_folder',
        },
        {
          label: 'SKILL.md + Project Root Rules (.cursorrules / CLAUDE.md / AGENTS.md)',
          hint: 'Also appends summary rules to root config files',
          value: 'both_rules',
        },
      ],
      defaultIndex: 0,
    });
  }

  const installedLocations = [];

  for (const agent of chosenAgents) {
    if (scope === 'global' || scope === 'both') {
      copyDirectoryRecursive(SKILL_SOURCE_DIR, agent.globalSkillDir);
      installedLocations.push({
        agent: agent.name,
        scope: 'Global',
        path: agent.globalSkillDir.replace(HOME, '~'),
      });
    }
    if (scope === 'project' || scope === 'both') {
      copyDirectoryRecursive(SKILL_SOURCE_DIR, agent.projectSkillDir);
      installedLocations.push({
        agent: agent.name,
        scope: 'Project',
        path: path.relative(CWD, agent.projectSkillDir),
      });
    }

    if (installMode === 'both_rules') {
      const skillMainContent = fs.readFileSync(path.join(SKILL_SOURCE_DIR, 'SKILL.md'), 'utf8');
      const ruleFile = agent.legacyRuleFile;
      fs.mkdirSync(path.dirname(ruleFile), { recursive: true });
      const marker = '<!-- UI-MOTION-SKILL -->';
      if (fs.existsSync(ruleFile)) {
        const existing = fs.readFileSync(ruleFile, 'utf8');
        if (!existing.includes(marker)) {
          fs.appendFileSync(ruleFile, `\n\n${marker}\n${skillMainContent}\n`);
        }
      } else {
        fs.writeFileSync(ruleFile, `${marker}\n${skillMainContent}\n`, 'utf8');
      }
    }
  }

  if (scope === 'global' || scope === 'both') {
    const universalDir = path.join(HOME, '.agents', 'skills', 'ui-motion');
    copyDirectoryRecursive(SKILL_SOURCE_DIR, universalDir);
  }

  console.log(`  ${c.green}${c.bold}◆ Installation Complete!${c.reset}`);
  console.log(`  ${c.gray}│${c.reset}`);
  for (const loc of installedLocations) {
    console.log(
      `  ${c.gray}│${c.reset}  ${c.green}✔${c.reset} ${c.bold}${loc.agent.padEnd(20)}${c.reset} ${c.dim}[${loc.scope}]${c.reset} → ${c.cyan}${loc.path}${c.reset}`
    );
  }
  console.log(`  ${c.gray}│${c.reset}`);
  console.log(
    `  ${c.gray}└─${c.reset} ${c.bold}How to use:${c.reset} Your agents will auto-activate this skill whenever you build`
  );
  console.log(`     or review animations, or invoke it directly with ${c.cyan}/ui-motion${c.reset}.\n`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
