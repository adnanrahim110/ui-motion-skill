# 04. Scroll-Driven, Scrollytelling, Parallax & Cursor Engineering

## 1. The Golden Laws of Scroll Motion
1. **NEVER Hijack Native Scroll Velocity:** Overriding native browser wheel/touch momentum with heavy scroll-jacking scripts causes cognitive friction and motion sickness (Nielsen Norman Group). Let the browser own scroll physics; link your animations to `scrollYProgress` or native CSS `scroll()`.
2. **NO Mindless Paragraph Fade-Ins:** Never attach scroll-triggered fade-ups to every paragraph and heading on an article or docs page (Manu Arora). Scroll-driven motion is strictly for storytelling, progress tracking, and spatial product demonstrations.
3. **Zero Main-Thread Layout Thrashing:** Never read `getBoundingClientRect()` inside a raw `window.addEventListener('scroll')` loop. Use native CSS `animation-timeline`, `IntersectionObserver`, or Framer Motion's hardware-accelerated `useScroll` + `useTransform`.

---

## 2. Native CSS Scroll-Driven Animations (Chrome Team / Bramus Pattern)
Whenever possible, use native CSS `scroll()` and `view()` timelines. They run 100% on the browser compositor thread at 120fps even if JavaScript is busy.

### Reading Progress Bar (`scroll()`)
```css
@keyframes scale-progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  transform-origin: 0% 50%;
  animation: scale-progress linear both;
  animation-timeline: scroll(root block);
}
```

### Viewport-Linked Feature Card Reveal (`view()`)
```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes card-enter {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .bento-feature-card {
    animation: card-enter cubic-bezier(0.23, 1, 0.32, 1) both;
    animation-timeline: view();
    animation-range: entry 10% cover 28%;
  }
}
```

---

## 3. Scroll-Based Storytelling ("Before & After" Crafa Pattern)
As highlighted by Manu Arora with **Crafa**, the highest-converting way to explain a product on a landing page is a pinned scroll-driven transformation from **Chaos (Before)** to **Clarity (After)**:
* **Architecture:**
  * Outer track container: `height: 240vh; position: relative;`
  * Inner viewport stage: `position: sticky; top: 0; height: 100vh; overflow: hidden;`
* **Choreography (mapped to `scrollYProgress` `0.0 -> 1.0`):**
  * `0.00 - 0.25`: Display the user's painful "Before" state (e.g., scattered bookmarks, messy spreadsheets, cluttered tabs) with slight rotation and visual noise.
  * `0.25 - 0.65`: As the user scrolls, interpolate `x`, `y`, `rotate`, and `scale` of each scattered item so they magnetically align and snap into your product's clean bento grid or dashboard interface.
  * `0.65 - 1.00`: Reveal the live interactive polish (status badges turn green, metrics count up) and hold cleanly before unsticking.

---

## 4. Parallax & Spatial Depth Rules
* **Restrained Velocity Ratios:** Amateur parallax moves layers too fast, causing visual nausea. Use subtle relative displacement:
  * Background ambient layer: `0.90x` to `0.95x` scroll speed (`translateY` of `-30px` to `30px` across viewport).
  * Primary content plane: `1.00x` (native scroll speed, never apply parallax to body text!).
  * Foreground floating accent cards: `1.04x` to `1.08x` scroll speed (`translateY` of `20px` to `-40px`).
* **Compositor Only:** Always use `transform: translate3d(0, var(--y), 0)`. Never animate `background-position-y` or `top`.

---

## 5. Cursor-Driven & Magnetic Interactions
Always gate cursor-driven effects behind `@media (hover: hover) and (pointer: fine)` so touch devices never get stuck hover states.

### A. Magnetic Button (With Fitts's Law Static Hit Box)
* **Pull Radius & Damping:** Only activate when the cursor enters the button's bounding box. Multiply the cursor offset from center by a pull factor of **`0.22` to `0.30`** (never `1.0`, which feels overly sticky).
* **Text Inner-Parallax:** Move the inner label at `0.5x` the button's translation (`0.12` factor) for a subtle layered depth effect.
* **Snap-Back Physics:** When the cursor leaves, animate back to `(0, 0)` using a damped spring (`stiffness: 400, damping: 25`).

### B. Radial Spotlight Hover Cards (Linear / Clerk Pattern)
* Track `clientX - rect.left` and `clientY - rect.top` via CSS custom properties `--mouse-x` and `--mouse-y` directly on the card element (avoid triggering React state re-renders on `mousemove`!).
* Render a `pointer-events: none` overlay with:
  ```css
  background: radial-gradient(
    450px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.08),
    transparent 40%
  );
  ```

### C. 3D Perspective Tilt Cards
* Cap maximum rotation at **`+-5deg` to `+-7deg`**. Anything over `10deg` distorts typography and looks cheap.
* Set `transform: perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry)) scale3d(1.01, 1.01, 1.01)`.
* Interpolate with a spring so rapid mouse exits decay smoothly back to `0deg`.
