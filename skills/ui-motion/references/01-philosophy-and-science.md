# 01. Philosophy, Cognitive Science & Design Engineering Laws

## 1. Manu Arora's Core Production Laws
* **The 10-15 Second Marketing Window:** Users give a landing page 10 to 15 seconds to prove its value. Dense text blocks fail to communicate workflows in this window. Use animated bento-grid illustrations (like Clerk.com) to visually demonstrate MFA, session management, OTPs, and security without forcing the user to read paragraphs.
* **Above-the-Fold Space Economy:** When showcasing social proof (e.g., 50 client logos), never clutter the hero section. Pick the 10-15 highest-impact logos, display 4 in a clean grid, and cycle them with a smooth, coordinated flip/cross-fade transition.
* **The 50-Clicks-A-Day Rule:** Any control used repeatedly in a daily workflow (sidebar links, table sorting, command actions, primary dashboard buttons) must respond instantaneously. Motion on high-frequency targets turns into friction and perceived slowness.
* **Trust Through Polish (Not Gimmicks):** Deliberate micro-interactions signal engineering quality immediately. Conversely, janky, slow, or unprompted animations break user trust on the spot.
* **Fundamentals Over Slop:** Clean whitespace, sharp typography, and crisp iconography come first. Never stuff random animated pills, floating badges, or heavy component templates into a page to mask weak layout design.

## 2. Benji Taylor's "Family Values" Architecture
* **Simplicity Through Gradual Revelation:** An interface should unfold like walking through a series of interconnected rooms. Keep advanced complexity out of sight until the user's action calls for it.
* **The Delight-Impact Curve:** The potential for animation delight is inversely proportional to feature usage frequency:
  * *High Frequency (switching tabs, typing):* Zero novelty, maximum speed.
  * *Medium Frequency (reordering tokens, resizing views):* Tactile fluidity, spring physics.
  * *Low Frequency (onboarding, completing a transfer):* Rich choreography and selective emphasis.
* **Zero Element Duplication (Object Permanence):** Never duplicate a visible component during a transition. If a header, avatar, or card exists in State A and persists in State B, morph that single instance into its new position rather than fading one out while fading a duplicate in. Static jumps cause "digital whiplash."

## 3. Emil Kowalski's Design Engineering Bar
* **Physical Plausibility (`scale >= 0.93`):** Objects in the physical world have mass and volume; they never materialize from `0%` size. Entrances must start at `scale(0.94)` to `scale(0.97)` with `opacity: 0`.
* **Tactile Button Compression:** Interactive buttons should compress slightly on press (`transform: scale(0.97)` on `:active`) within `100ms-150ms` to mimic physical switch resistance.
* **Blur Bridging Between Disjoint States:** When swapping between two visually distinct icons (e.g., a `Copy` clipboard icon and a `Check` icon, or morphing button labels), a simple opacity cross-fade looks like two overlapping ghosts. Add `filter: blur(2px)` to `blur(4px)` during the mid-point of the `160ms` transition to blend the shapes seamlessly in human visual perception.

## 4. Rauno Freiberg's Invisible Details of Interaction Design
* **Absolute Interruptibility:** Real-world actions (like turning a page in a book) can be stopped or reversed at any millisecond. UI animations must never lock out user input. If a user toggles a state open and clicks close 60ms later, the element must reverse smoothly from its exact in-flight coordinates, never snapping to 100% first.
* **Input-Device Fidelity:**
  * *Touch & Trackpad Gestures:* Direct manipulation. Requires 1:1 tracking, momentum preservation upon release, and rubber-band resistance at boundaries.
  * *Mouse Pointer:* Indirect spatial input. Benefits from hover anticipation, magnetic target snapping, and origin-aware popovers.
  * *Keyboard:* Mechanical binary input. Requires near-instant execution (`0ms-80ms`).

## 5. HCI & Cognitive Science Foundations
* **The Doherty Threshold (Walter Doherty, 1982):** Productivity and engagement soar when system response time stays below **400ms**, and perceptual causality requires initial visual feedback within **100ms**. If a network request takes longer than 150ms, transition immediately into an inline shimmer or skeleton state.
* **Change Blindness Prevention (Jakob Nielsen & Raluca Budiu, NN/g):** When the DOM updates instantaneously (e.g., adding/deleting a card, sorting a list, expanding a filter), the human eye misses what changed. A **180ms to 220ms** layout transition anchors the user's spatial map.
* **Fitts's Law in Dynamic UI (Paul Fitts, 1954):** Time to acquire a target depends on distance and target width. When animating a button on hover (such as a `scale` or magnetic translation), **never shrink or shift the clickable hit box away from the cursor**, or you will cause cursor-edge flicker. Keep an invisible, static `::after` pseudo-element hit area anchored to the original layout footprint.
* **Hick's Law (William Hick, 1952):** Decision time grows logarithmically with the number of visible choices. Gradual revelation (showing 1-2 decisions per step inside a morphing container) dramatically increases form completion rates.
