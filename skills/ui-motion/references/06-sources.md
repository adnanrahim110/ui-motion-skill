# Primary sources and evidence ledger

Reviewed 2026-10-15. Links below were retrieved during this revision unless explicitly
marked otherwise. Summaries are interpretations; presets are package decisions.

| Source | Supports | Boundary |
| --- | --- | --- |
| [Emil Kowalski — You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) | Purpose, frequency, restraint | Expert practice, not a numerical law. |
| [Emil Kowalski — 7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips) | Press feedback, tooltip grouping, origin and scale considerations | Exact package values are defaults. |
| [Benji Taylor — Family Values](https://benji.org/family-values) | Progressive disclosure, continuity, selective delight | Product examples do not prove conversion lift. |
| [Rauno Freiberg — Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design) | Input-sensitive interaction craft | Apply contextually. |
| [Apple WWDC18 — Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/) | Responsive gestures and fluid transitions | Platform examples need web adaptation. |
| [I. Scott MacKenzie — Fitts' Law as a Research and Design Tool in HCI (1992)](https://www.yorku.ca/mack/hci1992.html) | Pointing models and applicability limits | Does not prescribe magnetic effects. |
| [Jakob Nielsen — Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/) | Usability response-time heuristics | Not a universal animation duration study. |
| [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Disabling non-essential interaction motion; SC 2.3.3 is Level AAA | This skill does not certify WCAG conformance. |
| [W3C — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | User controls for applicable automatic motion | Conditions and exceptions matter. |
| [WAI APG — Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Naming, focus, keyboard operation | Pattern guidance is not a complete audit. |
| [MDN — dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | Native modal lifecycle and behavior | Check the consuming application's browser targets. |
| [web.dev — High-performance CSS animations](https://web.dev/articles/animations-guide) | Prefer transforms/opacity; inspect rendering costs | Compositing is conditional. |
| [Bramus / Chrome — Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) | Scroll/view timelines, progress and support | No unconditional frame-rate guarantee. |
| [Paul Lewis — FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/) | Batched geometry and transform correction | Does not remove measurement costs. |
| [Chrome — View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions) | Progressive DOM-update transitions | Feature detection and live-DOM behavior still matter. |
| [Motion — scroll](https://motion.dev/docs/scroll), [useAnimate](https://motion.dev/docs/react-use-animate), [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) | Supported APIs, cleanup, preference adaptation | Library behavior is version-specific. |
| [Tailwind — theme](https://tailwindcss.com/docs/theme), [state variants](https://tailwindcss.com/docs/hover-focus-and-other-states) | Tokens and motion/pointer variants | Preserve the host's installed major version. |

The requested Manu Arora video and [shared Gemini discussion](https://share.gemini.google/EmmaeZX5YHni)
are the origin of the brief. The video transcript was not independently retrieved
in this revision; do not present Gemini's summary or its timestamps as verified quotes.
The brief's four purposes and removal test are also consistent with the primary
craft references above. Historical Hick/Doherty numeric claims from the earlier
version were not retained as empirical guarantees.

Agent discovery paths and their vendor references are maintained separately in
the repository's `docs/compatibility.md`. Do not infer host compatibility from the
open skill format alone. A successful copy is distinct from the host loading it.
