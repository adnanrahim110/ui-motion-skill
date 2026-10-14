<div align="center">

# ⚡ `ui-motion-skill`

**Science-Backed UI/UX Animation & Motion Engineering Skill for AI Coding Agents**

[![Version](https://img.shields.io/badge/version-1.0.0-00e5ff?style=flat-square)](https://github.com/adnanrahim110/ui-motion-skill)
[![SKILL.md Standard](https://img.shields.io/badge/standard-SKILL.md-10b981?style=flat-square)](https://github.com/adnanrahim110/ui-motion-skill)
[![Author](https://img.shields.io/badge/author-@adnanrahim110-8b5cf6?style=flat-square)](https://github.com/adnanrahim110)
[![License: MIT](https://img.shields.io/badge/license-MIT-f59e0b?style=flat-square)](./LICENSE)

**Works across every major AI coding agent on your PC:**

`Claude Code` • `Cursor` • `OpenAI Codex` • `Google Antigravity` • `Windsurf` • `GitHub Copilot` • `Gemini CLI` • `Cline / Roo`

</div>

---

## Why This Skill Exists

When you ask an AI coding agent to add animations, it defaults to generic slop: unprompted scroll fade-ins on every paragraph, `scale(0)` entrances, linear easings, slow modal exits, and bloated motion inside post-login dashboards where users just want speed.

**`ui-motion-skill`** implants the decision-making brain of top design engineers and HCI scientists directly into your AI agents:

- **Manu Arora** (*Aceternity UI / Vibrant.design*): Marketing vs. Post-Login context routing, the 50-clicks-a-day rule, gradual revelation in morphing modals, the Removal Test, and asymmetric entry/exit timing.
- **Emil Kowalski** (*Linear / Vercel / Animations.dev*): Physical scale floors (`scale >= 0.94`), origin-aware popovers, blur-bridged icon morphing, sub-300ms UI budgets, and custom cubic-beziers.
- **Rauno Freiberg** (*Vercel / Invisible Details of Interaction Design*): Mid-flight interruptibility, input-device fidelity (`Cmd+K` mechanical speed vs. gesture momentum), and spatial metaphors.
- **Benji Taylor** (*Family / SpaceX*): The Delight-Impact Curve, progressive disclosure, and zero element duplication (object permanence).
- **Google Chrome Team & Apple HIG**: Native CSS `scroll()` / `view()` compositor timelines, FLIP layout morphs, and velocity-preserving spring physics.
- **HCI Cognitive Laws**: Walter Doherty's `<400ms` threshold, Jakob Nielsen's Change Blindness prevention, Fitts's Law hit-area expansion, and Hick's Law.

---

## 🚀 Quick Install (Interactive Terminal Stepper)

Run a single command in your terminal using your favorite package manager. The interactive stepper automatically detects which AI agents are installed on your PC and pre-selects them for you:

### `npx`
```bash
npx github:adnanrahim110/ui-motion-skill
# Or via npm:
npx ui-motion-skill
```

### `pnpm`
```bash
pnpm dlx github:adnanrahim110/ui-motion-skill
```

### `bun`
```bash
bunx github:adnanrahim110/ui-motion-skill
```

### Universal `skills` CLI
```bash
npx skills add adnanrahim110/ui-motion-skill -g --all
```

---

## 🖥️ Interactive Terminal Setup Preview

When you run the installer, it guides you through a 3-step terminal wizard:

```text
  UI-MOTION SKILL  v1.0.0 • by @adnanrahim110
  Science-backed UI/UX animation engineering for AI coding agents
  ─────────────────────────────────────────────────────────────────

  ✔ Where do you want to install this skill?: Global (PC-wide)
  │
  ◆ Step 2 of 3: Select AI agents to configure
  │ Agents detected on your PC are pre-selected by default.
  │
  │ ❯ [✓] Claude Code          (~/.claude/skills/ui-motion)           ● detected on PC
  │   [✓] Cursor               (~/.cursor/skills/ui-motion)           ● detected on PC
  │   [✓] OpenAI Codex CLI     (~/.codex/skills/ui-motion)            ● detected on PC
  │   [✓] Google Antigravity   (~/.gemini/antigravity/skills/...)     ● detected on PC
  │   [ ] Windsurf             (~/.codeium/windsurf/skills/...)       ○ not detected
  │   [ ] GitHub Copilot       (~/.copilot/skills/ui-motion)          ○ not detected
  │
  └─ ↑/↓ move • Space toggle • 'a' toggle all • Enter confirm (4 selected)
```

### Non-Interactive One-Liner Flags (CI / Dotfiles)

```bash
# Install globally to all detected agents on your PC without prompts
npx github:adnanrahim110/ui-motion-skill --global -y

# Install into the current repository only (for Git team sharing)
npx github:adnanrahim110/ui-motion-skill --project -y

# Force install globally across all 8 supported agent directories
npx github:adnanrahim110/ui-motion-skill --all -y
```

---

## 🧠 How the Agent Decision Engine Works

Every time your coding agent touches frontend UI, it runs this strict 5-Gate Pipeline before writing a single line of motion code:

```text
User Prompt / UI Task
  │
  ├─► Gate 1: Context Routing
  │     ├── Marketing / Landing Page? ──► 10-15s impression window: Allow animated Bento grids,
  │     │                                  4-item logo flippers, & Crafa scroll storytelling.
  │     └── Post-Login Dashboard / App? ─► Strip decorative motion. Speed & utility win.
  │
  ├─► Gate 2: Frequency & Input Filter
  │     ├── Clicked 50+ times/day or Cmd+K shortcut? ──► STOP (0ms instant state change).
  │     └── Occasional or milestone interaction? ──────► Proceed to Gate 3.
  │
  ├─► Gate 3: The 4 Valid Purposes Check
  │     ├── 1. Explain something complex visually?
  │     ├── 2. Add tactile delight & immediate trust?
  │     ├── 3. Gradual revelation (progressive disclosure)?
  │     └── 4. Maintain spatial continuity / prevent change blindness?
  │         (If NONE match ──► REJECT ANIMATION)
  │
  ├─► Gate 4: The Removal Test
  │     └── "If I delete this animation, does the app feel faster and cleaner without
  │          losing clarity?" (If YES ──► DELETE IT)
  │
  └─► Gate 5: Physics & Compositor Execution
        ├── Sub-300ms UI budget (Entry: 180-250ms | Exit: 100-150ms)
        ├── Scale floor: Never scale(0), enter from scale(0.94-0.97) + opacity(0)
        ├── Origin-aware transform-origin on popovers/dropdowns
        ├── Blur-bridged icon/state morphs (filter: blur(2px))
        └── Mandatory @media (prefers-reduced-motion: reduce) & pointer gating
```

---

## ✨ Full-Spectrum Animation Coverage

| Category | What the Skill Teaches Your Agent | Reference File |
| :--- | :--- | :--- |
| **Philosophy & HCI Science** | Manu Arora's Removal Test, Benji Taylor's Delight-Impact Curve, Doherty Threshold (`<400ms`), Fitts's Law static hit-boxes, Change Blindness. | `01-philosophy-and-science.md` |
| **Timing, Easing & Springs** | Custom `--ease-out-quint` & `--ease-drawer` curves, duration budgets per component, asymmetric entry/exit math, Framer Motion spring presets. | `02-timing-easing-and-springs.md` |
| **Micro-Interactions** | Cobra.systems OTP input (shimmer + green pulse + error shake), single-modal gradual revelation, pill-collapsing resizable tables, streaming text gradients. | `03-microinteractions-and-components.md` |
| **Scroll, Parallax & Cursor** | Native CSS `scroll()` & `view()` timelines, Crafa before/after pinned scrollytelling, GPU `translate3d` parallax ratios, magnetic buttons, spotlight cards. | `04-scroll-parallax-and-cursor.md` |
| **Production Code Recipes** | Ready-to-drop React, Tailwind CSS, and Framer Motion (`motion/react`) components. | `05-code-recipes.md` |

---

## 🔄 Before vs. After Installing `ui-motion-skill`

| Scenario | Without `ui-motion-skill` (Default AI Output) | With `ui-motion-skill` Installed |
| :--- | :--- | :--- |
| **Multi-step Meal Tracker Modal** | Dumps 8 inputs into one tall modal or opens a second modal on submit with `transition: all 0.5s ease-in`. | Morphs a single container in-place (`ResizeObserver` + spring height), cross-fades steps with `blur(3px)`, adds an inline back button, and exits in `120ms`. |
| **Dashboard Sidebar & Buttons** | Adds bouncy `350ms` hover/click transitions to tabs clicked 50 times a day. | Enforces `0ms` instant tab switching and crisp `100ms` `scale(0.97)` tactile press feedback. |
| **OTP Verification Input** | Renders 6 static `<input>` boxes with browser default outlines. | Implements sliding layout focus ring, `140ms` digit entry, verification shimmer sweep, emerald success state, and `320ms` horizontal error shake. |
| **Scroll Effects** | Attaches `window.addEventListener('scroll')` and fades in every `<p>` tag on the page. | Rejects paragraph fade-ins; uses compositor-thread CSS `animation-timeline: view()` or pinned before/after product storytelling. |

---

## 📂 Where Skills Are Installed on Your PC

| AI Agent | Global PC Path | Project Path |
| :--- | :--- | :--- |
| **Claude Code** | `~/.claude/skills/ui-motion/` | `.claude/skills/ui-motion/` |
| **Cursor** | `~/.cursor/skills/ui-motion/` | `.cursor/skills/ui-motion/` |
| **OpenAI Codex** | `~/.codex/skills/ui-motion/` | `.codex/skills/ui-motion/` |
| **Google Antigravity** | `~/.gemini/antigravity/skills/ui-motion/` | `.agents/skills/ui-motion/` |
| **Windsurf** | `~/.codeium/windsurf/skills/ui-motion/` | `.windsurf/skills/ui-motion/` |
| **GitHub Copilot** | `~/.copilot/skills/ui-motion/` | `.github/skills/ui-motion/` |
| **Gemini CLI** | `~/.gemini/skills/ui-motion/` | `.gemini/skills/ui-motion/` |
| **Cline / Roo Code** | `~/.cline/skills/ui-motion/` | `.cline/skills/ui-motion/` |

---

## Author & Credits

Created and maintained by **Adnan Rahim** ([@adnanrahim110](https://github.com/adnanrahim110)).

Built upon the public engineering work and research of **Manu Arora** ([Vibrant.design](https://vibrant.design), [Aceternity UI](https://ui.aceternity.com)), **Harsh** ([Cobra.systems](https://cobra.systems)), **Emil Kowalski** ([Animations.dev](https://animations.dev)), **Rauno Freiberg** (*Invisible Details of Interaction Design*), **Benji Taylor** ([Family Values](https://benji.org/family-values)), **Transitions.dev**, **Clerk.com**, and the **Google Chrome Rendering Team**.
