# 03. Micro-Interactions & Component Blueprints

Every pattern below is derived from Manu Arora's breakdown of **Cobra.systems (by Harsh)**, **Elvish's responsive components**, **Clerk.com**, **Family.co**, and **Transitions.dev**.

---

## 1. OTP / Verification Code Input (Cobra.systems Pattern)
Never ship a static, lifeless input box for verification codes. Implement these 4 distinct micro-states:
1. **Digit Entry:** As each digit is typed or pasted, animate it from `translateY(6px) scale(0.92) opacity(0)` to `translateY(0) scale(1) opacity(1)` over `140ms` using `--ease-out-quint`. Active slot displays a smooth layout-animated focus ring (`layoutId="otp-focus"`).
2. **Verification Shimmer:** The moment the final digit is entered, sweep a subtle diagonal highlight shimmer across the input slots (`250ms`) while verifying.
3. **Success State:** All slots smoothly transition their border and subtle background tint to emerald green (`#10b981`) and compress slightly together (`gap` reduces by `2px` or a subtle scale pulse `1 -> 1.02 -> 1`).
4. **Error State (Invalid Code):** Trigger a tight horizontal keyframe shake (`[0, -8px, 8px, -6px, 6px, -3px, 3px, 0]` over `320ms`), flash borders crimson (`#ef4444`), and smoothly clear/reset focus so the user can retry immediately.

---

## 2. Gradual Revelation in a Single Morphing Modal (Manu Arora's Calorie Tracker Pattern)
When building multi-step workflows (e.g., uploading a meal photo -> analyzing -> showing macro breakdowns, or multi-question onboarding cards):
* **Rule 1:** Never dump all inputs and output fields into one giant initial screen.
* **Rule 2:** Never close Modal 1 and open a brand-new Modal 2.
* **Rule 3 (In-Place Morph):** Keep a single outer modal container wrapped in an auto-resizing observer (`ResizeObserver` + Framer Motion `animate={{ height: bounds.height }}`).
  * **Step 1:** Show only the primary action (e.g., meal photo upload dropzone).
  * **Step 2 (Transition):** When uploaded, fade out the dropzone (`120ms`), morph the image into a compact thumbnail header inside the same modal, display a smooth inline progress indicator, and expand the container height (`220ms` spring) to reveal the protein/carb/fat macro pills.
  * **Navigation:** Reveal a subtle top-left `Back` button (`opacity: 0 -> 1`, `translateX(-4px -> 0)`) that lets the user reverse the morph back to Step 1 without losing state.

---

## 3. Responsive Pill-Collapsing Data Table (Elvish / Cobra Pattern)
When a user resizes a table column, split pane, or dashboard card:
* Never let text clip harshly with `overflow: hidden` mid-word or wrap into ugly multi-line vertical towers.
* Measure the container width via `ResizeObserver`.
* As width decreases, smoothly collapse secondary tags/pills (`scale(0.92)`, `opacity: 0`, `140ms`) into a single `+N more` counter pill that animates in seamlessly.
* As the user drags the column wider, progressively reveal the individual pills back into view.

---

## 4. Streaming AI Text with Leading Gradient Mask (Cobra.systems Pattern)
Standard token-by-token streaming text looks robotic and jagged.
* Wrap newly arriving text chunks in a span that animates from `opacity: 0; filter: blur(2px)` to `opacity: 1; filter: blur(0px)` over `180ms`.
* Apply a subtle linear-gradient text mask on the active streaming line so the leading edge fades in softly rather than popping in character by character.

---

## 5. Skeleton Loader to Real Content Cross-Fade (Transitions.dev Essentials)
* Never jump abruptly from a spinner to rendered data.
* Match the skeleton placeholder dimensions to the exact typography line-height and avatar dimensions of the real component.
* Keep the skeleton pulse subtle (`opacity: 0.4` to `0.75` over `1.5s ease-in-out infinite`, never harsh flashing).
* When data resolves, cross-fade the skeleton out (`150ms`) while fading the real content in (`200ms`, `translateY(2px -> 0)`).

---

## 6. Subtle Audio-Visual Pairing
For high-craft interactive components (like multi-step question cards, toggles, or OTP completion):
* Provide an optional, opt-in Web Audio API synthesizer hook (muted if `prefers-reduced-motion` is enabled) that plays a `<15ms` soft low-pass filtered click (`180Hz-400Hz`, volume `0.04`) synchronized with the visual spring transition.
