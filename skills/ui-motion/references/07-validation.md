# Acceptance checks and realistic evaluations

## Before handing over code

- Name the useful outcome. Verify that a static version still conveys all content.
- Ensure actions, requests, focus, and navigation do not wait for animation.
- Check reduced motion at initial render and after a live preference change. A
  component must not start an entrance while waiting to learn the preference.
- Confirm effect cleanup: subscriptions, observers, RAF, timers, animation handles,
  and abortable work. Ignore stale results even if a callback ignores AbortSignal.
- Review real input semantics, visible focus, accessible names, long text, errors,
  duplicate submits, empty states, and recovery. Preserve server trust boundaries.
- Check code and types in the consuming project. Request additional dependencies
  only when they materially help, following existing authorization.

Browser checks are conditional on the user's explicit permission for that task.
When authorized, assess keyboard containment/return focus, touch and fine pointers,
reduced motion, narrow/short windows, zoom, interruption, and actual rendering cost.
Otherwise report these as manual checks; do not launch a browser or claim they passed.

## Behavioral scenarios for evaluating the skill

1. **Dashboard filters used all day.** Change the selected state and data immediately;
   do not add delayed tab fades, celebratory effects, or decorative bounces.
2. **OTP verification with paste, a rejected code, and a slow server.** Preserve native
   editing, show clear status, prevent duplicate requests, abort/ignore stale work,
   and provide retry. Never embed an expected code in the frontend.
3. **Three-step modal closed during saving.** Keep one dialog, preserve Back values,
   manage actual focus, restore a valid trigger, and prevent a late response from
   reopening the flow or committing a stale visual state.
4. **Marketing explanation on a narrow screen with reduced motion.** The offer and
   action remain visible without scrolling through animation; show a static story.
5. **Magnetic CTA on a hybrid touch laptop.** Mouse behavior is bounded and optional;
   touch and keyboard keep a stable target. Changing preferences cancels movement.
6. **An animation audit only.** Return concrete findings and locations; do not edit
   the site, add packages, or run browser tests without authorization.

Evaluation should inspect decisions and behavior, not match the exact wording of
the skill. Passing a source validator proves structure, not premium design judgment.
