# Philosophy, evidence, and limits

## What comes from whom

The starting brief was Manu Arora's [When Does Website Animation Become Too Much?](https://www.youtube.com/watch?v=9bPGg3PhyeU), as discussed in the user's
[shared conversation](https://share.gemini.google/EmmaeZX5YHni). Treat that conversation
as requirements and a secondary summary, not a verified verbatim transcript.
Do not attribute extra numeric thresholds to Manu without a primary citation.

[Emil Kowalski's purposeful-animation essay](https://emilkowal.ski/ui/you-dont-need-animations)
supports choosing motion for a useful outcome and reducing novelty on frequent actions.
[His practical tips](https://emilkowal.ski/ui/7-practical-animation-tips) inform modest
press feedback, trigger-aware origins, and tooltip groups. These are expert heuristics;
exact scales, blur amounts, and milliseconds in this package are our presets.

[Benji Taylor's Family Values](https://benji.org/family-values) explains progressive
disclosure, continuity between states, and selective emphasis. Keep persistent
elements identifiable and avoid gratuitous duplication. This is not a universal
inverse-frequency formula or a conversion guarantee.

[Rauno Freiberg's interaction-design essay](https://rauno.me/craft/interaction-design)
is a craft reference for input-sensitive, interruptible interactions. Keep keyboard
commands immediate; let gestures follow input and settle from release velocity.
[Apple's Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/)
provides further rationale for responsive gesture-driven systems.

## Research models versus product decisions

| Evidence | Useful inference | Do not claim |
| --- | --- | --- |
| [MacKenzie's HCI review of Fitts' law](https://www.yorku.ca/mack/hci1992.html) models pointing time using distance and target size. | Keep target geometry predictable; move an inner visual rather than the hit target. | A universal magnetic radius or pseudo-element makes every moving button accessible. |
| [Nielsen's response-time guidance](https://www.nngroup.com/articles/response-times-3-important-limits/) distinguishes immediate response, continuity, and attention. | Give feedback promptly; separate network work from transition duration. | Every request needs a shimmer at exactly 150ms, or every sub-400ms animation improves productivity. |
| [W3C interaction-animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) addresses disabling non-essential motion. | Provide a static path preserving function. | One media query proves accessibility compliance. |

Hick's law and the Doherty threshold are historical models, not a license to label
arbitrary presets as proven science. This package does not rely on an exact 400ms
engagement guarantee or claim that fewer fields always increase conversions.
Use progressive steps when they reduce actual complexity: a short familiar form
can be clearer as one screen. Validate product outcomes using the user's own evidence.

## Apply the removal test concretely

- A dashboard filter updates results immediately. A delayed tab fade adds no information.
- A complex upload may benefit from one persistent dialog shell, a step label, and
  Back. Content and focus must still update when motion is off.
- A before/after illustration may clarify a process. Explanatory copy remains
  readable and usable without scrolling through choreography.
- Validation needs text and recovery. Color, motion, sound, or a vanishing input
  cannot be the sole explanation.

Showcases such as Clerk, Cobra.systems, Transitions.dev, and Vibrant.design are
inspiration, not normative specifications, performance evidence, or permission to
copy their assets.
