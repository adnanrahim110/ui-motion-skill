# Browser validation

Date: **16 October 2026**. Tested locally in the Codex in-app Chromium browser,
using the release-review demo and the actual React assets. The user explicitly
authorized browser testing for this task.

## Results

| Check | Observed result |
| --- | --- |
| Repeated filters | All, Ready, and Needs review displayed 6, 4, and 2 matching changes with the correct pressed state. |
| Dialog entry | One native modal opened; focus moved to the name field. |
| Step changes | The heading received focus; Back preserved the edited name. Dialog height followed content changes. |
| Keyboard | Tab traversed dialog controls without focusing a background page control. Escape closed the dialog and returned focus to its opener. Browser chrome can still receive focus during native tab navigation. |
| Verification | A rejected code displayed an error and allowed correction; the demo server accepted its documented code. Duplicate prevention and late-result cancellation are also covered by Node tests. |
| Retry after success | Clearing the code reset the verified state and disabled Complete review again. |
| Close during request | A held local request was aborted. The server counted cancellation and had zero pending requests afterward; the dialog stayed closed. |
| Reduced motion | Browser media emulation removed dialog spatial animation and the progress indicator. The same content and actions stayed usable. A live preference change also reset the magnetic visual. |
| Pointer target | The inner visual moved by less than 8px while the outer button's position and dimensions stayed fixed. |
| Scroll progress | Story links reached their sections. Document progress changed with scrolling and recalculated after viewport resizing. |
| Responsive layout | No page-level horizontal overflow at 320, 390, 768, 1024, 1280, 1536, and 2560 CSS pixels in the checked layouts. |
| Text enlargement | At a 320 × 568 viewport and a 32px root font, page content and the dialog fit horizontally. The tall dialog scrolled internally, and verification/completion remained reachable. |
| Console | No application errors were reported during the checked flows. |

## Issues found and fixed

- The reading indicator stayed at zero because its native scroll animation was
  created paused. The shared helper now attaches a running animation to the scroll
  timeline. Rechecking confirmed changing progress after scrolling and resizing.
- At 200% text size on a 320px viewport, intrinsic grid tracks, fixed header
  composition, and controls caused horizontal overflow. The dialog header wraps,
  grid tracks can shrink, and controls wrap within the available width. The demo
  itself also adapts its text and metric layout.
- The demo retained completion permission after clearing a verified code.
  `VerificationCode` now exposes an optional `onVerifiedChange` callback so the
  consuming flow follows the component's current status. A regression test covers
  success followed by retry. The server must still authorize real protected work.

## Installation and automated checks

The public repository was freshly cloned and installed into a disposable project
with all nine agent targets and rule pointers. Eight unique skill destinations
were created because Codex and Antigravity share one path. The first install wrote
128 files; repeating it changed zero files. No user agent configuration was changed.

This environment's npm policy rejected direct Git and remote-package fetching, so
the published-source trial used the fresh clone's CLI. Installation from an npm
packed artifact was checked separately.

Local validation includes 12 installer tests, 13 React/jsdom tests, strict type
checking, lint, source/comment/link checks, a production demo build, package
installation checks, and the skill structure validator.

## Limits

This checks the shipped components and one integration. It does not establish how
consistently every supported agent follows the skill. Safari, Firefox, physical
touch devices, screen readers, real SMS autofill, and animation frame-rate profiling
were not tested. The text-size check changed the document root font rather than
using browser zoom. The local test font and browser emulation overrides were reset.

Browser tests are not part of the automatic CI workflow. Future browser testing
continues to require explicit user authorization.
