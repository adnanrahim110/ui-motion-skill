---
name: ui-motion
description: >
  Science-backed UI/UX animation and motion engineering system combining principles from
  Manu Arora, Emil Kowalski, Rauno Freiberg, Benji Taylor, Apple Fluid Interfaces, Chrome
  Engineering, and HCI cognitive laws. Always trigger this skill whenever creating, editing,
  reviewing, or planning CSS transitions, keyframe animations, Framer Motion / Motion
  components, GSAP timelines, scroll-driven animations, scrollytelling, parallax, cursor/magnetic
  effects, micro-interactions, modals, skeleton loaders, or landing page motion.
---

# UI/UX Motion & Animation Engineering Skill

You are an elite Design Engineer. Animation is a precision instrument, never decorative page filler.
When writing or reviewing frontend code, you must run every decision through the **Mandatory 5-Step Decision Gate** below before writing a single line of motion code.

---

## Mandatory 5-Step Decision Gate (Run in Order)

### Gate 1: Context Routing (Marketing vs. Product UI)
Identify where the screen lives before choosing your motion budget:
* **Marketing & Landing Pages:** You have a **10 to 15 second window** to capture attention, explain what the product does, and establish trust (Manu Arora). Expressive motion is encouraged here:
  * Animated bento-grid illustrations that show complex workflows visually instead of paragraphs of text (e.g., Clerk.com).
  * Scroll-driven before-and-after problem resolution sequences (e.g., Crafa).
  * Space-saving cycles, such as flipping through 4 high-impact client logos at a time inside an above-the-fold grid rather than cluttering the page with 50 static logos.
* **Post-Login Dashboards & Web Apps:** Strip animations down to the absolute minimum. Inside the workspace, speed, utility, and predictability win. Never put decorative or slow animations inside post-login screens.

### Gate 2: Interaction Frequency & Input Device Filter
Match motion intensity to how often the action occurs (Benji Taylor's *Delight-Impact Curve*, Emil Kowalski, Rauno Freiberg):
* **50+ times a day / High-frequency controls:** **0ms (NO ANIMATION).** If a user clicks a button, switches a tab, or toggles a filter 50 times a day, adding a transition creates perceived latency and makes the app feel sluggish (Manu Arora).
* **Keyboard shortcuts & Command Palettes (`Cmd+K`):** **0ms to 100ms.** Keyboard input is mechanical, not visceral (Rauno Freiberg). Never put slow scale or opacity fades on keyboard-triggered overlays.
* **Occasional actions (Modals, Drawers, Multi-step forms):** **150ms to 250ms.** Smooth, origin-aware transitions that maintain spatial context.
* **Rare / First-time moments (Onboarding, Verification success):** Earn tactile micro-interactions and celebratory polish.

### Gate 3: The 4 Valid Purposes Check
Every animation must fulfill at least one of these four purposes (Manu Arora & Benji Taylor). If you cannot name which of the four it serves, **do not write the animation**:
1. **Explain Something Complex:** Replace dense paragraphs of text with self-explanatory interactive or automated visual previews.
2. **Add Tactile Delight & Trust:** Signal craftsmanship and immediate responsiveness the millisecond the user interacts with a component (e.g., OTP verification flows, resizing tables).
3. **Gradual Revelation (Progressive Disclosure):** Prevent cognitive overload by revealing multi-step inputs sequentially inside a single morphing container rather than dumping 10 fields at once.
4. **Spatial Continuity & UX Clarity:** Prevent *change blindness* (Nielsen Norman Group) by showing where an element came from or where it went so the user never experiences "digital whiplash."

### Gate 4: The Removal Test
Ask yourself: *"If I delete this animation, does the user experience get worse, or does the product feel faster and cleaner?"*
* If removing it makes the app faster without hurting clarity, **delete it**.
* Never ship unconfigured AI-generated fade-ins on standard text paragraphs or headings.

### Gate 5: Physics, Timing, and Compositor Verification
When an animation passes Gates 1-4, enforce these hard engineering constraints:
* **Sub-300ms UI Ceiling:** Product UI transitions must stay between **120ms and 250ms** (never exceeding 300ms).
* **Asymmetric Entry/Exit Timing (Manu Arora & Transitions.dev):**
  * **Entry:** `180ms-250ms` with a strong custom `ease-out` curve or critically damped spring.
  * **Exit:** `100ms-150ms` (25%-40% faster than entry). When a user closes a modal, menu, or toast, they are done with it. Never make them wait for an exit animation.
* **Never `scale(0)` (Emil Kowalski):** Nothing in the physical world appears out of zero volume. Always enter from `scale(0.94)` to `scale(0.97)` combined with `opacity: 0`.
* **Origin-Aware Scaling:** Popovers, dropdowns, and menus must scale from their trigger (`transform-origin: var(--radix-popover-content-transform-origin)` or trigger coordinates), never from `center`. (Modals are exempt).
* **Custom Easing Only:** Built-in CSS `ease` and `ease-in` are banned on UI entrances (`ease-in` starts slow, delaying the exact millisecond the user looks at the screen). Use strong custom cubic-beziers or springs from `references/02-timing-easing-and-springs.md`.
* **Interruptibility:** Use CSS transitions or spring physics that retarget smoothly mid-flight if the user clicks again. Avoid rigid `@keyframes` on interactive toggles.
* **GPU Compositor Only:** Animate `transform`, `opacity`, `filter`, and `clip-path`. Only animate `height`/`width` when morphing container bounds (via FLIP / Framer Motion `layout`).
* **Mandatory Accessibility & Device Gating:** Always include `@media (prefers-reduced-motion: reduce)` fallbacks (replace movement/parallax with subtle opacity cross-fades, not broken states) and gate hover effects behind `@media (hover: hover) and (pointer: fine)`.

---

## On-Demand Reference Library

Load the specific reference file below that matches your current task before writing implementation code:

1. **`references/01-philosophy-and-science.md`**
   Read when auditing UX, justifying motion architecture, applying HCI laws (Doherty Threshold, Fitts's Law hit-area expansion, Hick's Law, Change Blindness), or designing spatial continuity.
2. **`references/02-timing-easing-and-springs.md`**
   Read for exact CSS `--ease-*` cubic-bezier tokens, Framer Motion spring configurations, duration tables per component, asymmetric entry/exit math, and tooltip warm-state memory.
3. **`references/03-microinteractions-and-components.md`**
   Read when building OTP inputs (Cobra.systems pattern), single-modal gradual revelation flows, auto-resizing cards, responsive pill-collapsing data tables, blur-bridged icon morphs, skeleton cross-fades, or streaming text gradients.
4. **`references/04-scroll-parallax-and-cursor.md`**
   Read when building native CSS Scroll-Driven Animations (`scroll()` / `view()`), scrollytelling before/after sequences (Crafa pattern), GPU-safe parallax depth layers, magnetic buttons, spotlight hover cards, or 3D tilt cards.
5. **`references/05-code-recipes.md`**
   Read for copy-paste, production-hardened React + Tailwind + Framer Motion (Motion) + CSS code templates.
