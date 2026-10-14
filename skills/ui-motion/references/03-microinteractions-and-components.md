# Micro-interactions and component behavior

Every optional effect still passes the five gates. Timing presets are in reference 02;
typed examples are indexed in reference 05, with source attribution in reference 06.

## Dialogs and progressive flows

Use one named native dialog or an accessible dialog primitive. Deliberately place
focus, contain keyboard focus, support Escape, and return to a connected trigger
(or a logical fallback). A heading names the dialog only when associated with it.

Keep one shell across steps and preserve values on Back. Loading, error, and success
belong in the same flow. Abort stale work on step changes and close. Focus the new
heading or relevant field on a step change. Prefer a small opacity change on just
the changing region. An optional bounds morph needs ResizeObserver cleanup and a
static reduced-motion path; a short dialog may not need it. Support enlarged text
with a viewport-bounded height and internal scrolling.

## Verification / OTP

Prefer one semantic input with `inputMode="numeric"`, `autoComplete="one-time-code"`,
a visible label, descriptive error, and a submit action. This preserves native paste,
selection, keyboard editing, and autofill. Separate inputs require actual ref-based
focus movement, paste distribution, Backspace, arrow keys, and accessible grouping;
a highlighted slot is not focus.

Validate format before submission. A server verifies the secret; never ship an expected
code to the client. Prevent duplicate verification with an in-flight guard and a
disabled action. Abort on cancel/unmount and ignore late responses. Announce status
without narrating animation frames. Keep errors readable; provide clear-and-retry
instead of silently losing input. A digit entrance or 180ms shake is optional;
reduced motion uses static feedback.

## Loading and content handoff

Reserve real media/text dimensions. Show a skeleton when loading needs feedback,
without an artificial minimum delay. Render fast results directly. Hide decorative
skeletons from assistive technology, keep one status message, mark loading regions
busy, and do not steal focus when background content arrives. Content is usable
immediately. A pulse needs `motion-reduce:animate-none`; static placeholders are fine.

## Resizable tables and collapsing pills

Measure available width with ResizeObserver, separate reads from writes, and clean up.
Choose essential columns/tags before hiding anything. Recompute for content/font
changes too. Collapse secondary tags into a named `+N more` button opening an
accessible list/popover. Retain table semantics and keyboard operation. Use contained
horizontal scrolling for genuinely wide data. Repeated resize must not queue motion
or delay the data layout. Never hide the only accessible copy of information.

## Streaming text

Default to immediate readable chunks for frequent updates. If it aids tracking, use
at most a 120ms chunk opacity change; avoid per-character spans, delayed words, and
masks over readable history. Preserve selection and scroll position unless the user
is already at the end. Announce completion rather than every token. Reduced motion
renders chunks immediately.

## Logo cycles and workflow demonstrations

Keep explanatory copy visible outside the animation and use only verified customer
logos with permission. Default to a static grid. If space requires cycling, provide
Pause/Resume, keep geometry stable, avoid automatic replacement announcements, and
pause offscreen or in hidden tabs. Hover/focus pause is a convenience, not the only
control. Reduced motion shows a static set and a way to view all. W3C's pause/stop/hide
criterion has specific conditions; do not apply a blanket rule to all brief feedback.

## Audio, success, and error

Sound is opt-in and never the only feedback. Motion and sound preferences are separate.
Use success/error text without confetti. Copy can simply change to “Copied” with a
polite status. Failures need Retry and the information needed to recover.

Sources: [WAI dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/),
[Family Values](https://benji.org/family-values),
[Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
