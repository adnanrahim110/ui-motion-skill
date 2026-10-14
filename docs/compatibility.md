# Agent compatibility and installation boundaries

Vendor documentation reviewed 2026-10-15. The installer copies a local skill package;
it does not install an AI agent, enable a disabled feature, or synchronize cloud sessions.
Paths below contain an additional `ui-motion/` directory with `SKILL.md` inside.

| ID | Agent | Global root | Project root | Primary documentation |
| --- | --- | --- | --- | --- |
| `claude` | Claude Code | `~/.claude/skills` | `.claude/skills` | [Claude Code](https://code.claude.com/docs/en/skills) |
| `cursor` | Cursor | `~/.cursor/skills` | `.cursor/skills` | [Cursor](https://cursor.com/help/customization/skills) |
| `codex` | OpenAI Codex | `~/.agents/skills` | `.agents/skills` | [OpenAI](https://learn.chatgpt.com/docs/build-skills) |
| `antigravity` | Antigravity app/IDE | `~/.gemini/config/skills` | `.agents/skills` | [Google](https://antigravity.google/docs/skills?app=antigravity-ide) |
| `windsurf` | Windsurf / Cascade | `~/.codeium/windsurf/skills` | `.windsurf/skills` | [Cascade](https://docs.devin.ai/desktop/cascade/skills) |
| `copilot` | GitHub Copilot | `~/.copilot/skills` | `.github/skills` | [GitHub](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| `gemini` | Gemini CLI | `~/.gemini/skills` | `.gemini/skills` | [Gemini CLI](https://geminicli.com/docs/cli/skills/) |
| `cline` | Cline | `~/.cline/skills` | `.cline/skills` | [Cline](https://docs.cline.bot/customization/skills) |
| `roo` | Roo Code | `~/.roo/skills` | `.roo/skills` | [Roo](https://roocodeinc.github.io/Roo-Code/features/skills/) |

Codex and Antigravity project skills use a **shared discovery root**. Other tools
(including Cursor, Copilot, Gemini CLI, and Roo in documented configurations) may
discover `.agents/skills`. The CLI discloses those destinations; selecting one tool
cannot prevent another compatible tool from reading a shared directory. It does
not silently add a shared root when only private-root targets are selected.

Antigravity CLI is a separate surface: its documented global root is
`~/.gemini/antigravity-cli/skills`. Copy the skill there manually if needed. The
`antigravity` target selects the app/IDE, whose older `~/.gemini/antigravity/skills`
root is also documented as a legacy alias. This revision uses the current root.
Windsurf's `.windsurf/skills` project root remains a documented legacy path in the
current Cascade documentation; `.devin/skills` is its newer project root.

Detection uses command files on PATH, known configuration paths, and installed
editor-extension folders. It reports that evidence honestly; stale folders can
remain after uninstall and portable/remote installations can be missed. Generic
`.github` and `.agents` folders are not agent-installation evidence. Undetected
targets remain manually selectable. Cline and Roo are separate targets.

Reload skills or restart the agent after installation if necessary. Invocation
syntax varies: Codex supports `$ui-motion`, Claude supports `/ui-motion`, and Cascade
supports `@ui-motion`; asking an agent to use the named skill is also an option.
Discovery, automatic selection, and instruction following depend on host settings,
trust controls, versions, and task relevance. They are not guaranteed by copying files.

Older installations are not automatically migrated or deleted. If both an old
`.codex/skills/ui-motion` and the current shared version appear in a selector,
inspect them and remove an unwanted copy manually. No automatic cleanup touches
skills installed by another tool.

## Files, updates, and recovery

The installer checks all planned files before writing. Identical files are skipped;
differing skill files require `--force`. Replacements and changed project rule files
save adjacent `.ui-motion-backup-*` files. Unrelated files are preserved. Rule pointers
use a short marked block, so repeated installation updates that block without
duplicating the whole skill or replacing unrelated project instructions.

Writes are atomic per file. On a write failure, the installer attempts to restore
original files and remove files created by that run; it reports any rollback failure.
Retain backups until you have reviewed the installation. Concurrent installers and
abrupt machine termination are outside that rollback guarantee. Symlinked destination
paths are rejected so updating a selected target does not write through a link.

Run `--dry-run` to inspect destinations and conflicts without writing. To update a
selected installation, use the same scope and agent IDs, adding `--force` only after
reviewing local differences. No automatic migration deletes an older copy.
