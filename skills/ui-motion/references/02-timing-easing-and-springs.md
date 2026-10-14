# 02. Timing, Easing Curves & Spring Physics Reference

## 1. Custom CSS Cubic-Bezier Tokens
Never use standard CSS `ease`, `linear` (except for continuous spinners/marquees), or `ease-in` on UI entrances. Define and use these exact tokens:

```css
:root {
  /* Primary UI Entrances: Popovers, Dropdowns, Modals, Cards, Toasts */
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  /* On-Screen Morphing & Layout Shifts: Container resizing, Tab indicators, Bento states */
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);

  /* iOS / Native Sheet & Drawer Physics */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

  /* Fast Exit Curve (Pair with 100ms-150ms duration) */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Subtle Tactile Overshoot (Use sparingly for badges or magnetic snap-back) */
  --ease-spring-subtle: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## 2. Strict Component Duration Budget Table

| UI Element / Interaction | Entry Duration | Exit Duration | Curve / Physics |
| :--- | :--- | :--- | :--- |
| **High-frequency action (50+/day)** | `0ms` | `0ms` | None (Instant) |
| **Keyboard Command Palette (`Cmd+K`)** | `0ms-80ms` | `0ms-60ms` | `--ease-out-quart` |
| **Button `:active` press (`scale(0.97)`)** | `100ms-140ms` | `120ms-160ms` | `--ease-out-cubic` |
| **Icon State Morph (with `blur(2px)`)** | `150ms-180ms` | `120ms-150ms` | `--ease-out-quart` |
| **Tooltips & Micro-Popovers** | `125ms-180ms` | `90ms-120ms` | `--ease-out-quint` |
| **Dropdowns & Select Menus** | `150ms-200ms` | `100ms-140ms` | `--ease-out-quint` |
| **Modals & Dialogs** | `200ms-250ms` | `120ms-150ms` | `--ease-out-expo` or Snappy Spring |
| **Side Drawers & Bottom Sheets** | `250ms-320ms` | `160ms-200ms` | `--ease-drawer` |
| **Container Height/Width Morphing** | `200ms-260ms` | `180ms-220ms` | Critically Damped Spring |
| **Skeleton Loader to Content Cross-fade** | `200ms-250ms` | `150ms` | `--ease-out-cubic` |
| **Marketing Bento / Hero Illustrations** | `400ms-700ms` | `200ms-300ms` | Custom Spring / Choreographed |

## 3. Framer Motion (`motion/react`) Spring Configurations
Springs feel more natural than duration-based curves for gestures and layout morphs because they preserve velocity when interrupted.

```typescript
export const SPRINGS = {
  // Crisp, zero-bounce spring for professional dashboards, modals, and container resizing
  snappy: {
    type: 'spring' as const,
    stiffness: 450,
    damping: 36,
    mass: 1,
  },

  // Smooth layout morphing for multi-step cards, accordions, and shared layoutId indicators
  fluidLayout: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 32,
    mass: 1,
  },

  // Tactile micro-interaction spring with minimal ~5% overshoot (switches, magnetic buttons)
  tactile: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 28,
    mass: 0.8,
  },

  // Soft follow spring for cursor followers or floating previews
  cursorFollow: {
    type: 'spring' as const,
    stiffness: 220,
    damping: 26,
    mass: 0.5,
  },
};
```

## 4. Tooltip & Popover Warm-State Memory Pattern
When hovering across a toolbar of buttons with tooltips:
1. **Cold Hover (First Tooltip):** Wait `350ms` before showing the tooltip (`150ms` entrance animation) so casual mouse movement across the screen does not trigger accidental popups.
2. **Warm State (Adjacent Tooltips within `400ms` of closing the previous):** Skip the delay (`0ms` delay) and either snap instantly or glide the existing tooltip container across (`layoutId="active-tooltip"`) in `140ms`.
