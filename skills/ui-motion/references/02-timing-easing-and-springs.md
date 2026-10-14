# Timing, easing, and springs

All numbers here are starting presets, not biological laws. A project's established
system and the user's instructions take priority.

## One consistent functional budget

| Interaction | Entry/change | Exit/release | Guidance |
| --- | --- | --- | --- |
| Repeated tabs, filters, typing | 0ms | 0ms | Update state immediately. |
| Keyboard command surface | 0–80ms | 0–60ms | Prefer immediate focus and content. |
| Occasional tactile button | 80–100ms | 100–140ms | Inner visual only; no delayed action. |
| Tooltip | 120–160ms | 80–100ms | First-hover delay is separate. |
| Popover/menu | 160–200ms | 100–120ms | Use trigger-aware origin. |
| Dialog/drawer | 200–250ms | 100–150ms | Never hold an action for the transition. |
| Step/layout morph | 180–240ms | 100–150ms | Avoid content distortion. |
| Error emphasis | 160–200ms total | No additional exit | Optional small shake; no shaking for reduced motion. |
| Skeleton/content handoff | 120–180ms | 80–120ms | Content is usable immediately. |

These resolve the old contradictory 320ms drawer/shake examples. The 300ms ceiling
is a functional UI default. It excludes idle intervals, actual network work,
user-driven scroll/drag, and a justified, bounded marketing demonstration. None
of those exceptions let high-frequency controls wait on animation.

## Exact curves

```ts
export const MOTION = {
  enter: [0.16, 1, 0.3, 1],
  change: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
  layout: [0.65, 0, 0.35, 1],
} satisfies Record<string, [number, number, number, number]>;
```

Use the entrance curve for surfaces and the exit curve on their shorter exits.
Use the layout curve for a bounded morph, not a delay before responding. In Tailwind,
use complete inline classes such as `ease-[cubic-bezier(0.16,1,0.3,1)]
motion-reduce:transition-none`. Do not invent one-use tokens. Useful shared tokens
belong in the existing token mechanism (`@theme` in Tailwind v4).

Linear mapping is appropriate for scroll progress whose position must match input.
It is not the default easing for a timed UI entrance. A spinner can use uniform
rotation; prefer static status when that is clearer.

## Springs and interruption

A layout starting spring is `{ type: 'spring', stiffness: 450, damping: 36, mass: 1 }`.
It is near critically damped, not an exact solution for every library's units.
Settling time depends on displacement, velocity, and rest thresholds; these parameters
do not guarantee exactly 220ms. Use a timed curve for a fixed exit budget.

Keep one controller per moving visual. Retarget a spring or replace/cancel the
previous animation rather than queueing stale transitions. Clean up on unmount,
preference changes, and interrupted flows. Animation completion must never be the
only path to committing business state.

## Tooltip groups, scale, and blur

A first tooltip can wait roughly 350ms to avoid accidental discovery. Adjacent
tooltips can open immediately within a 400ms warm window. These are chosen defaults.
Keyboard focus also exposes descriptions; retain Escape. Reuse an accessible
primitive's group instead of adding a second timer system.

Scale contextual overlays modestly from the trigger edge. A centered dialog has a
different spatial relationship. A 0.96 entrance is an example, not a universal floor.
A progress-bar fill can validly grow from zero. Blur bridging is optional, may cost
paint/raster work, and must not soften essential text. Start without blur or overshoot.

Sources: [Emil's tips](https://emilkowal.ski/ui/7-practical-animation-tips),
[Motion transitions](https://motion.dev/docs/react-transitions),
[animation performance](https://web.dev/articles/animations-guide).
