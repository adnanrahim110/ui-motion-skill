# Scroll, storytelling, parallax, and pointer engineering

Use these effects only when they convey something meaningful. Never override native
wheel/touch scrolling, put parallax on body text, or make content depend on a reveal.

## Choose a scroll mechanism

| Mechanism | Appropriate use | Failure/static path |
| --- | --- | --- |
| Native `scroll()` / `view()` timeline | Progress and bounded transforms in supported browsers | Feature-detect with CSS `@supports`; original content stays visible. |
| Motion `scroll(animation)` | Existing Motion stack; progress, parallax, bounded stories | Cleanup both the subscription and animation; static content when motion is off. |
| IntersectionObserver | Starting/stopping a short demonstration as it enters/leaves | Disconnect on unmount; keep original markup visible. |
| GSAP ScrollTrigger | Existing GSAP stack or a justified multi-track sequence | Use context/matchMedia cleanup; keep a static narrative and native scroll. |

Native timelines can run suitable animations off the main thread, but this depends on
the properties and browser. Neither Motion hooks nor a CSS timeline guarantee 120fps.
See [Chrome's timeline guide](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
and [Motion's scroll API](https://motion.dev/docs/scroll). Set `animation-timeline`
after `animation`, whose shorthand can reset it. Progress typically uses linear
input mapping; time-based easing would misrepresent the scroll position.

## Progress indicators

Map root progress 0–1 to a decorative bar's `scaleX(0–1)` with a left transform origin.
Hide that decorative bar from screen readers; use a separate semantic progress value
only when the task needs it. Disable its movement for reduced motion. Reserve the
bar's geometry so it does not shift content. A document that cannot scroll should
not produce divide-by-zero math. Recompute when dynamic content changes scroll range.

## Pinned before/after storytelling

Keep a short textual explanation and both states in the DOM. The effect should help
understanding without replacing the offer or primary action.

Example mapping (package defaults): 0–0.2 holds the problem; 0.2–0.8 aligns a few visual
objects into a clear structure; 0.8–1 holds the result. Use sticky positioning on an
inner stage and enough outer scroll distance. Animate inner visuals, not the measured
track. A 200vh track is a starting layout, not a conversion rule.

On narrow or short screens, enlarged text, reduced motion, or unsupported APIs,
render a normal stacked narrative. Do not trap the user in pinned content. Remove
unnecessary sticky/track height in that path. Keep focusable links outside transformed
artwork; tab order follows the readable narrative. Avoid large canvas/video sequences
unless their explanation warrants the download, decoding, and fallback cost.

## Parallax

Start with 8–16px of total visual travel on a decorative layer, not a percentage speed
that changes unpredictably with section height. The primary reading plane stays still.
Use transforms with reserved image dimensions and a clipping wrapper that cannot
create page-level overflow. Disable spatial displacement for reduced motion and
on narrow screens when space is insufficient. Stop work offscreen and clean up
subscriptions. Do not attach layout reads and writes to every raw scroll event.

## Pointer, magnetic, spotlight, and tilt

All pointer effects need fine-pointer/hover capability, an actual mouse/pen event,
and a reduced-motion check. A touch event can occur on a laptop with a mouse attached.

| Pattern | Trigger and range | Return behavior | Accessibility/static path |
| --- | --- | --- | --- |
| Magnetic visual | Pointer within a stationary button; offset × 0.2, capped at 8px | 120ms `cubic-bezier(0.22,1,0.36,1)` to zero; replace prior controller | Outer button and focus ring never move. |
| Spotlight card | Pointer within card; small radial overlay follows local coordinates | Opacity exit ≤100ms; stop RAF/listeners | Text contrast cannot depend on the highlight. No tracking on touch. |
| Tilt card | Pointer within stable wrapper; rotate inner artwork ≤4deg | 120–180ms using the change curve | Do not rotate interactive text/form fields; static on keyboard/reduced motion. |
| Cursor follower | Only when it explains drag/drop or another spatial task | Stop on leave, hidden tab, preference change, unmount | Keep system cursor; no essential information solely on follower. |

Read the stable wrapper's bounds on pointer entry; refresh on resize/scroll rather
than alternating layout reads/writes in every move handler. Batch pointer updates
in one RAF and avoid React state on each move. Clean up RAF, observers, media-query
listeners, and animations. Never keep polling after the pointer leaves.

## FLIP and view transitions

[Paul Lewis's FLIP article](https://aerotwist.com/blog/flip-your-animations/) describes
measuring First and Last geometry, Inverting the difference, and Playing a transform
back to the final layout. Batch all measurements before mutations; avoid animating
both layout and its correction twice. Preserve semantic identity and focus. Large
scale changes can distort text; prefer translating a wrapper or leaving text static.

The [View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions)
can help preserve context around a DOM update. Feature-detect it, skip it for reduced
motion and frequent navigation, and always perform the DOM update if unsupported.
Use unique names only for the participating elements. Snapshots are presentation;
the live DOM still owns keyboard interaction, focus, and state. Do not wait for a
transition to finish before starting navigation or data work.
