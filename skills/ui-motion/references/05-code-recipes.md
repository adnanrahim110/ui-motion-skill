# Typed examples and integration

The maintained code is in `../assets/react/`, not duplicated in Markdown. Copy only
the relevant component and its local imports. These are functional starting points,
not a claim of tested compatibility with every browser, framework, or application.

| File | Behavior | Dependencies |
| --- | --- | --- |
| [motion-policy.ts](../assets/react/motion-policy.ts) | SSR-safe live media preferences and shared curves | React |
| [progressive-dialog.tsx](../assets/react/progressive-dialog.tsx) | A controlled shell for your real content: native modal semantics, focus, Escape, bounded height morph, usable inline fallback | React, Motion |
| [verification-code.tsx](../assets/react/verification-code.tsx) | One native OTP input, paste/autofill, server callback, duplicate guard, abort and retry | React |
| [magnetic-button.tsx](../assets/react/magnetic-button.tsx) | Stable hit target, bounded inner motion, input gating and cleanup | React, Motion |
| [scroll-progress.tsx](../assets/react/scroll-progress.tsx) | Root progress animation with dynamic content tracking | React, Motion |
| [scroll-story.tsx](../assets/react/scroll-story.tsx) | Your readable narrative, linked sections, and a scroll-linked progress rail | React, Motion |
| [scroll-timeline.ts](../assets/react/scroll-timeline.ts) | Shared binding, resize tracking, no-scroll behavior, and cleanup | Motion |

## Motion contracts for the supplied code

| Example | Trigger / purpose | Entry/change | Exit / cleanup | Reduced-motion/static path |
| --- | --- | --- | --- | --- |
| Dialog | Open/step resize / maintain context | 220ms opacity + scale 0.96–1 with enter curve; 220ms height morph with change curve | Native close is immediate; cancel animations/observer and restore focus | No entrance or height animation; same steps/actions. |
| Verification | Submit / communicate request state | Immediate text and border updates | Abort request on unmount; Retry restores real input focus | Entirely static. Digit/shake effects were removed by the removal test. |
| Magnetic button | Eligible pointer / optional tactile feedback | 80ms bounded translation; change curve | 120ms return using change curve; replace old controller | Stable native button and focus indicator. |
| Progress | Root scroll / orient the reader | Scroll progress maps linearly to scaleX; no clock duration | Cancel subscription and animation on cleanup | Decorative indicator omitted. |
| Story | Section scroll / orient the reader within a process | Scroll progress maps linearly to the rail's scaleY; text never animates | Cancel on cleanup or preference change | The full narrative and native anchor links remain usable. |

The dialog uses an immediate close intentionally: the 100–150ms exit budget is an
upper starting range, not a requirement to retain an already dismissed modal.
The story animates only its progress indicator. It does not move decorative cards
or impose a particular product, number of steps, or fake transformation.
The story avoids mandatory pinning so long text and small screens remain readable.
Use the pinned architecture from reference 04 only when the real story needs it.

## Integration requirements

- React examples use TypeScript and inline Tailwind classes on a 4px spacing rhythm.
  Do not paste an entire example file into a Server Component page; import a small
  client leaf. Preserve the installed React, router, Tailwind, and Motion versions.
- Install `motion` in the consuming project only when that example warrants it.
  The installer itself has no runtime dependencies. React/Motion in this repository
  are development dependencies used to check the example source.
- Connect `verify` and the consuming application's submission handler to authorized server operations. Validate and authorize
  on the server. No demo OTP secret, synthetic timeout, or client success flag proves
  an operation succeeded. The verification callback receives AbortSignal; the server operation
  may still complete after cancellation, so use server idempotency where necessary.
- `VerificationCode` can report its current success state through `onVerifiedChange`.
  Use it when a surrounding flow enables a next action after verification. Clearing
  or editing the code resets that state. This is UI coordination; the server still
  authorizes protected operations independently.
- `ProgressiveDialog` accepts `title`, `description`, `stepKey`, and your `children`.
  The parent owns step state, input values, request cancellation, and success/error
  rendering. Update `stepKey` for deliberate focus handoff; changing content alone
  must not steal focus. Set `open` to false in `onClose`. This unmounts the contents,
  so child effects can cancel outstanding work. No project-specific form or fake
  save operation is embedded in the shell.
- `ProgressiveDialog` uses native `showModal()` where available. Without it, real
  content renders as a named inline section with usable actions; it does not pretend
  to supply modal containment. Test that fallback in the consuming page's layout.
- Native dialog supplies modal containment/background inertness. The example supplies
  name, first focus, Escape handling, step focus, and return focus. Verify those in
  the application's real navigation and nested-overlay context when browser checks
  are authorized. Pass `initialFocusRef` for the relevant field, otherwise the
  heading receives focus. Pass `returnFocusRef` when the launch control may be removed;
  it supplies a logical connected fallback focus target.
- Use `className` overrides through the consuming project's centralized `cn` helper.
  Examples deliberately avoid exposing overridable classes and an unnecessary helper
  dependency. Native controls retain their intended semantics.

## Verification in this repository

`npm run typecheck` checks the actual example files. `npm test` runs installer
regressions and React behavior tests in jsdom, a Node DOM simulation. It launches no
browser. Those tests cover validation, retry, cancellation, duplicate submission,
focus handoff logic, and static preference behavior. They do not certify native
dialog focus trapping, visual transitions, rendering performance, or real autofill.
The tests also exercise the dialog's inline fallback and parent rerenders, verify
that closing a dialog unmounts its request-owning child, and check every story link
against its actual section target.
