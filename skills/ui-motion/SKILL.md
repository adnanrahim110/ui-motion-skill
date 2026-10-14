---
name: ui-motion
description: >
  Design, implement, or review purposeful UI motion: transitions, micro-interactions,
  dialogs, progressive flows, scroll storytelling, parallax, and pointer effects.
  Use when a task asks for animation or needs motion decisions; ordinary frontend
  work does not require adding animation.
---

# UI motion engineering

Make motion earn its cost. Default to a clear, static interface. Preserve the user's
framework, styling conventions, authorization boundaries, and testing preferences.
This skill supplies decisions and implementation patterns, not permission to
install libraries, launch browsers, or change unrelated configuration.

## Five decision gates

1. **Context.** Marketing motion may explain the offer or demonstrate a workflow.
   Product UI prioritizes speed. Neither context licenses decoration by default.
2. **Frequency and input.** Repeated tabs, filters, typing, and keyboard commands
   update immediately. Do not delay state, navigation, focus, or requests until an
   animation ends. A gesture follows input directly; optional settling starts
   only after release. Frequency is a judgment, not a measured 50-click threshold.
3. **Purpose.** Identify one concrete benefit: explain a complex workflow, confirm
   an action through restrained tactile feedback, reveal complexity progressively,
   or preserve spatial context. If none applies, keep it static.
4. **Removal test.** If removing the effect improves speed or reliability without
   losing meaning, remove it. No generic scroll fades on headings and paragraphs,
   floating badges, unsolicited confetti, or novelty on repeated controls.
5. **Execution.** Specify the contract below, choose the lightest existing tool,
   preserve accessibility, and check lifecycle cleanup and performance assumptions.

For a small change, apply these gates internally; do not produce a ceremony or
long explanation. State a brief motion contract before implementing approved motion:

> Trigger: open dialog. Purpose: preserve context. Entry: 220ms,
> cubic-bezier(0.16, 1, 0.3, 1), opacity + scale 0.96 to 1. Exit: 120ms,
> cubic-bezier(0.4, 0, 1, 1). Reduced motion: immediate state change.
> Interruption: retarget; actions and requests never depend on animation.

Include trigger, properties/range or spring parameters, entry/exit or scroll
mapping, interruption, reduced-motion behavior, and static/unsupported fallback.
Only include applicable parts; scroll progress has a mapping, not a clock duration.

## Implementation boundaries

- Keep controls operable throughout motion. No animation timers for real request
  completion. Abort or ignore stale work on retry, navigation, and unmount.
- Honor reduced motion at first render and when it changes. Remove spatial travel,
  parallax, shaking, tilt, and autoplay. Preserve all information and actions.
  A short opacity change is optional, never a required substitute for movement.
- Gate cursor effects by `(hover: hover) and (pointer: fine)` and the event's
  pointer type. Supply keyboard feedback and a static touch UI.
- Dialogs need a name, deliberate initial focus, contained keyboard focus, Escape,
  background inertness, and return focus. Use a native dialog or an established
  accessible primitive instead of inventing a focus trap.
- Prefer `transform` and `opacity`. Filters, clipping, gradients, and translucent
  layers can cost paint/raster work. No property or library guarantees GPU execution
  or 120fps. Avoid blanket `will-change` and repeated layout reads/writes.
- Keep a static hit target around moving visuals. Do not move the focused control
  or its focus outline away from its interactive footprint.
- Reuse the project's motion system. CSS for simple states; Motion for React layout
  and gestures; native timelines for supported scroll cases; GSAP only when the
  existing stack or meaningful choreography justifies it. Do not add all of them.
- Use small client leaves in server-rendered apps. Follow the host's Tailwind/CSS
  rules. Examples do not override project conventions.

## Timing policy

These are **package defaults, not scientific constants**. Full presets and exceptions
live in [02-timing-easing-and-springs.md](references/02-timing-easing-and-springs.md).
Functional UI generally finishes within 300ms: entry 180–250ms, exit 100–150ms.
High-frequency state changes are 0ms. Direct scroll/drag tracks input without easing
lag. Marketing sequences must be bounded, pausable when applicable, and must not
postpone access to content. A 0.96 overlay entrance is a useful starting point,
not a universal scale floor.

## Load only the relevant reference

| Need | Read |
| --- | --- |
| Rationale, research limits, attribution | [01-philosophy-and-science.md](references/01-philosophy-and-science.md) |
| Curves, springs, duration exceptions | [02-timing-easing-and-springs.md](references/02-timing-easing-and-springs.md) |
| Dialogs, OTP, loading, tables, streaming, logos | [03-microinteractions-and-components.md](references/03-microinteractions-and-components.md) |
| Scroll, storytelling, parallax, pointer, FLIP | [04-scroll-parallax-and-cursor.md](references/04-scroll-parallax-and-cursor.md) |
| Typed examples and integration | [05-code-recipes.md](references/05-code-recipes.md) |
| Exact primary sources and evidence limits | [06-sources.md](references/06-sources.md) |
| Acceptance checks and evaluation scenarios | [07-validation.md](references/07-validation.md) |

## Verification

Run appropriate static checks, builds, and meaningful non-browser tests. Respect
requests that reserve browser testing for the user. Report what was actually checked;
do not claim visual quality, frame rate, cross-device compatibility, or accessibility
conformance from a typecheck. When only an audit was requested, report prioritized
findings without changing code.
