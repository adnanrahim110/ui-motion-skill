# Install UI Motion

Run the bundled installer with Node.js 18+ and Git:

```sh
npx github:adnanrahim110/ui-motion-skill
```

The wizard asks for a scope, agent selection, and final review. Use the arrow keys
to move, Space to select agents, `a` to toggle all, and Enter to continue.
Escape or Ctrl+C cancels. For a project installation, start in that project's directory.

## Select agents and scope

Preview all supported destinations without writing files:

```sh
npx github:adnanrahim110/ui-motion-skill --global --all --dry-run
```

Install for Claude Code and Cursor in the current project:

```sh
npx github:adnanrahim110/ui-motion-skill --project --agent claude,cursor -y
```

| Option | What it does |
| --- | --- |
| `--global`, `--project`, `--both` | Set the scope. Global is the default. |
| `--agent claude,codex` | Select agent IDs. You can repeat the flag. |
| `--all` | Select all nine targets, including undetected agents. |
| `--yes`, `-y` | Skip the wizard. Use detected agents if none are specified. |
| `--dry-run` | Check destinations and report planned changes without writing. |
| `--force` | Back up and replace skill files that differ. |
| `--rules` | Add pointers to project rule files with `--project` or `--both`. |
| `--list`, `--help` | Show detection evidence or command help. |

| Agent | ID |
| --- | --- |
| Claude Code | `claude` |
| Cursor | `cursor` |
| Codex | `codex` |
| Antigravity app/IDE | `antigravity` |
| Windsurf / Cascade | `windsurf` |
| GitHub Copilot | `copilot` |
| Gemini CLI | `gemini` |
| Cline | `cline` |
| Roo Code | `roo` |

Detection uses command, configuration, and extension evidence. You can select an
agent the installer doesn't find. Shared `.agents/skills` paths may also be read by
other compatible agents. See [paths and host limitations](compatibility.md).

## Other installation methods

With pnpm:

```sh
pnpm dlx github:adnanrahim110/ui-motion-skill
```

With Bun:

```sh
bunx github:adnanrahim110/ui-motion-skill
```

Install the CLI globally with npm:

```sh
npm install --global github:adnanrahim110/ui-motion-skill
ui-motion-skill
```

The separate [Skills CLI](https://github.com/vercel-labs/skills) manages its own
agent selection and paths:

```sh
npx skills add adnanrahim110/ui-motion-skill --skill ui-motion -g
```

Use the GitHub commands above until the package has an npm release. A package-name
command such as `npx ui-motion-skill` requires publication to npm.

## Update or remove

Rerun the installer with the same targets to update. Identical files are skipped.
Differing files stop installation; inspect the differences before using `--force`.
Replacements save adjacent `.ui-motion-backup-*` files. Failed writes trigger a
rollback attempt. [Recovery details](compatibility.md#files-updates-and-recovery)
explain the boundaries of that behavior.

To remove the skill, inspect local edits, delete the selected `ui-motion` folder,
and remove its marked rule-pointer block if installed. Refresh the agent's skill
list afterward. Older copies and cloud sessions aren't changed automatically.

[Back to the README](../README.md)
