# UI Motion Skill for AI Coding Agents

**Teach your coding agent when to animate, what to animate, and when to keep the interface still.**

`ui-motion-skill` is a reusable Agent Skill for UI animation and motion design. It
combines a decision framework, primary-source references, and typed React patterns
for accessible micro-interactions, dialogs, scroll storytelling, parallax, and pointer effects.

**Claude Code · Codex · Cursor · Antigravity · Windsurf · GitHub Copilot · Gemini CLI · Cline · Roo Code**

[![MIT license](https://img.shields.io/badge/license-MIT-171717?style=flat-square)](LICENSE)
[![Installer runtime](https://img.shields.io/badge/installer-Node.js_18%2B-171717?style=flat-square)](package.json)
[![Runtime dependencies](https://img.shields.io/badge/runtime_dependencies-0-171717?style=flat-square)](package.json)

[Install](#install) · [Use the skill](#use-the-skill) · [Motion decisions](#motion-decisions) · [Code assets](#code-assets) · [References](#references) · [Development](#development)

## Install

Run this in your terminal:

```sh
npx github:adnanrahim110/ui-motion-skill
```

The installer asks where to install, which agents to configure, and which files
to write. Targets with command, configuration, or extension evidence are selected
by default. You can select undetected agents or deselect any suggested target.

```text
Step 1 of 3: Choose installation scope
> (*) Global — available across local projects
  ( ) Current project — share through version control
  ( ) Both global and current project

Step 2 of 3: Select AI agents
> [x] Claude Code (claude) — configuration found: ~/.claude
  [ ] Roo Code (roo) — no evidence; select manually if needed

Step 3 of 3: Review and install
```

Use arrow keys to move, Space to select agents, `a` to toggle all, Enter to continue,
or Escape/Ctrl+C to cancel. Choose project scope from the directory where you want
the skill installed. The installer requires Node.js 18+; GitHub package installation
also requires Git.

<details>
<summary>Other package managers and installation methods</summary>

With pnpm:

```sh
pnpm dlx github:adnanrahim110/ui-motion-skill
```

With Bun:

```sh
bunx github:adnanrahim110/ui-motion-skill
```

Install the CLI globally with npm, then run the wizard:

```sh
npm install --global github:adnanrahim110/ui-motion-skill
ui-motion-skill
```

Or use the separate [Agent Skills CLI](https://github.com/vercel-labs/skills), which
manages its own agent selection and destination paths:

```sh
npx skills add adnanrahim110/ui-motion-skill --skill ui-motion -g
```

Package-name commands such as `npx ui-motion-skill` require a published npm release.
The GitHub commands above install from this repository.

</details>

### Choose targets explicitly

Preview destinations without writing files:

```sh
npx github:adnanrahim110/ui-motion-skill --global --all --dry-run
```

Install into the current project for selected agents:

```sh
npx github:adnanrahim110/ui-motion-skill --project --agent claude,cursor -y
```

| Option | Behavior |
| --- | --- |
| `--global`, `--project`, `--both` | Choose installation scope. Global is the default. |
| `--agent claude,codex` | Select IDs explicitly; the flag can be repeated. |
| `--all` | Select all nine supported targets, including undetected ones. |
| `--yes`, `-y` | Run without the wizard; use detected targets when none are specified. |
| `--dry-run` | Check the planned files and report changes without writing. |
| `--force` | Back up and replace differing skill files. |
| `--rules` | Add short pointers to project rule files with `--project` or `--both`. |
| `--list`, `--help` | Inspect detection evidence or command help. |

Conflicting local files stop installation unless replacement is requested. Identical
files are skipped, and failed writes trigger a rollback attempt. See
[installation safety, paths, and host limitations](docs/compatibility.md).

Some hosts use shared `.agents/skills` paths; another compatible agent may discover
those files too. Detection is a hint, and local installation does not sync cloud sessions.

## Use the skill

Ask your agent to use `ui-motion` on a specific interaction. Invocation depends on
the host: `$ui-motion` in Codex, `/ui-motion` in Claude Code, or `@ui-motion` in Cascade.
Reload skills or restart the host if the new skill does not appear.

**Review an existing interaction**

> Use ui-motion to audit this dashboard filter. It is used repeatedly throughout the
> day. Identify motion that adds delay or obscures the selected state. Report findings
> before changing code.

**Build a progressive flow**

> Use ui-motion for this upload, review, and confirmation dialog. Keep one shell,
> preserve Back state, cancel stale work, and define the motion contract before coding.

**Explain a workflow on a landing page**

> Use ui-motion to show how this workflow changes from manual review to an organized
> process. Keep the explanation readable on mobile and with reduced motion.

Automatic selection depends on the host, its configuration, and the task. The skill
supplies guidance; your application's design system and requirements remain authoritative.

## Motion decisions

Every proposed effect passes five gates:

```text
Context → Frequency and input → Useful purpose → Removal test → Execution contract
```

| Situation | Decision |
| --- | --- |
| A filter, tab, or command used repeatedly | Change state immediately. |
| A complex multi-step operation | Keep one dialog, preserve context, and manage actual focus. |
| A marketing workflow that is hard to explain | Use a bounded demonstration with a complete static narrative. |
| A hover effect on a hybrid touch laptop | Check pointer capability and the actual input event. |
| A reduced-motion preference | Preserve information and actions while removing spatial movement. |

When motion helps, the agent specifies the trigger, properties, timing or scroll
mapping, easing, interruption behavior, reduced-motion behavior, and fallback.
For example, an occasional dialog may enter over 220ms with
`cubic-bezier(0.16, 1, 0.3, 1)` and close immediately. These are chosen defaults,
not scientific constants.

## Code assets

The assets are small, typed components with explicit responsibilities. They contain
no stock landing-page sections, invented customer logos, simulated server delays,
or client-side OTP secrets. Copy the relevant pattern and adapt it to your application.

| Asset | What it handles |
| --- | --- |
| [Progressive dialog](skills/ui-motion/assets/react/progressive-dialog.tsx) | Your content and step state; native modal behavior, focus handoff, resize motion, and an inline fallback. |
| [Verification code](skills/ui-motion/assets/react/verification-code.tsx) | Native paste/autofill, server verification callback, duplicate prevention, cancellation, and recovery. |
| [Magnetic button](skills/ui-motion/assets/react/magnetic-button.tsx) | A fixed hit target, bounded inner movement, pointer gating, and cleanup. |
| [Scroll story](skills/ui-motion/assets/react/scroll-story.tsx) | Your narrative, crawlable step links, readable content, and a section progress rail. |
| [Reading progress](skills/ui-motion/assets/react/scroll-progress.tsx) | Document progress with layout-change tracking and reduced-motion handling. |

Shared helpers handle [media preferences](skills/ui-motion/assets/react/motion-policy.ts)
and [scroll timeline cleanup](skills/ui-motion/assets/react/scroll-timeline.ts).
The [integration guide](skills/ui-motion/references/05-code-recipes.md) documents each
contract, dependencies, and the responsibilities that stay with the consuming app.

React examples use TypeScript, Tailwind utilities, and Motion where it helps. Other
frameworks can use the decision and engineering references without adopting React
or changing their existing animation stack.

## References

The entrypoint [SKILL.md](skills/ui-motion/SKILL.md) loads only the relevant reference.

| Guide | Coverage |
| --- | --- |
| [Philosophy and evidence](skills/ui-motion/references/01-philosophy-and-science.md) | Purpose, interaction frequency, research models, and attribution limits. |
| [Timing, easing, and springs](skills/ui-motion/references/02-timing-easing-and-springs.md) | Functional budgets, custom curves, interruption, and exceptions. |
| [Micro-interactions](skills/ui-motion/references/03-microinteractions-and-components.md) | OTP, dialogs, loading, streaming text, responsive tables, and logo cycles. |
| [Scroll, parallax, and pointer effects](skills/ui-motion/references/04-scroll-parallax-and-cursor.md) | Native timelines, scrollytelling, magnetic/spotlight/tilt effects, FLIP, and view transitions. |
| [Code integration](skills/ui-motion/references/05-code-recipes.md) | Runnable source, motion contracts, and application boundaries. |
| [Primary sources](skills/ui-motion/references/06-sources.md) | Exact references and what each supports. |
| [Validation](skills/ui-motion/references/07-validation.md) | Acceptance checks and realistic evaluation scenarios. |

The brief began with Manu Arora's restraint-first animation principles. Further
references include Emil Kowalski, Rauno Freiberg, Benji Taylor, Apple, W3C, and Chrome
engineering guidance. Attribution does not imply endorsement.

## Development

Use Node.js 22.18+ or 24.11+ for development. The installer runtime supports Node.js 18+.

```sh
npm ci
npm run check
npm run lint
npm run typecheck
npm test
npm run test:package
```

Checks cover source structure, local links, strict types, installer behavior,
React behavior in Node/jsdom, and installation from the packed artifact. CI is
configured for Windows/Linux checks plus a Node.js 18 runtime job. Visual rendering,
native focus containment, real autofill, and frame rate require application-level
browser verification. No browser is launched by these commands.

Changes should include a concrete use case and verification for the behavior they
affect. Keep defaults separate from research claims and preserve the static experience.
Maintainers can preview and apply the repository description/topics using the
[discoverability guide](docs/discoverability.md).

## Updating or removing an installation

Rerun the installer with the same targets. If local files differ, inspect them before
using `--force`; replacements save adjacent `.ui-motion-backup-*` files. Unrelated
files and older installations are preserved. See [compatibility notes](docs/compatibility.md)
for migration and recovery details.

To uninstall, inspect local edits, remove the selected `ui-motion` folder, and remove
its marked rule-pointer block if one was installed. Then refresh the agent's skill list.

Created by [Adnan Rahim](https://github.com/adnanrahim110). [MIT licensed](LICENSE).
