# 05. Production Code Recipes (React + Tailwind + Framer Motion)

## Recipe 1: Single-Modal Gradual Revelation (Auto-Resizing Container)
Implements Manu Arora's multi-step modal morphing pattern with asymmetric entry/exit timing.

```tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function GradualRevelationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'breakdown'>('upload');
  const [direction, setDirection] = useState<1 | -1>(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  const goTo = (next: 'upload' | 'analyzing' | 'breakdown', dir: 1 | -1) => {
    setDirection(dir);
    setStep(next);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop: Smooth entry (200ms), Fast exit (120ms) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Morphing Modal Shell: Never scales from 0 (starts at 0.95) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height,
              transition: {
                height: { type: 'spring', stiffness: 380, damping: 34 },
                default: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 4,
              transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
            }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl"
          >
            <div ref={contentRef} className="p-6">
              {/* Header with contextual Back button */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="popLayout">
                    {step !== 'upload' && (
                      <motion.button
                        initial={{ opacity: 0, x: -6, filter: 'blur(2px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -6, filter: 'blur(2px)' }}
                        transition={{ duration: 0.15 }}
                        onClick={() => goTo('upload', -1)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 active:scale-[0.97]"
                      >
                        ← Back
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <h3 className="text-sm font-semibold tracking-tight">Log Meal</h3>
                </div>
                <span className="text-xs text-zinc-500">Takes ~30 sec</span>
              </div>

              {/* Step Content */}
              <AnimatePresence custom={direction} initial={false} mode="popLayout">
                {step === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: direction * 16, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: direction * -16, filter: 'blur(3px)' }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    className="space-y-4"
                  >
                    <button
                      onClick={() => {
                        goTo('analyzing', 1);
                        setTimeout(() => goTo('breakdown', 1), 650);
                      }}
                      className="flex h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 active:scale-[0.98]"
                    >
                      <span>Drop meal photo or click to scan</span>
                      <span className="mt-1 text-xs text-zinc-500">Macros reveal automatically</span>
                    </button>
                  </motion.div>
                )}

                {step === 'analyzing' && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="flex h-28 flex-col items-center justify-center space-y-2"
                  >
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />
                    <p className="text-xs text-zinc-400">Extracting macros from image...</p>
                  </motion.div>
                )}

                {step === 'breakdown' && (
                  <motion.div
                    key="breakdown"
                    initial={{ opacity: 0, x: 16, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -16, filter: 'blur(3px)' }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Protein', val: '42g' },
                        { label: 'Carbs', val: '58g' },
                        { label: 'Fats', val: '16g' },
                      ].map((macro, i) => (
                        <motion.div
                          key={macro.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                          className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3"
                        >
                          <div className="text-xs text-zinc-400">{macro.label}</div>
                          <div className="mt-1 text-lg font-semibold text-zinc-100">{macro.val}</div>
                        </motion.div>
                      ))}
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-zinc-950 transition-transform duration-100 active:scale-[0.97]"
                    >
                      Save Meal (544 kcal)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

## Recipe 2: Delightful OTP Input with Shimmer, Success & Shake (Cobra.systems Pattern)

```tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function DelightfulOTP({ expectedCode = '8813' }: { expectedCode?: string }) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [activeIdx, setActiveIdx] = useState(0);

  const handleDigitInput = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setStatus('idle');

    if (val && index < 3) setActiveIdx(index + 1);

    const code = next.join('');
    if (code.length === 4) {
      setStatus('verifying');
      setTimeout(() => {
        if (code === expectedCode) {
          setStatus('success');
        } else {
          setStatus('error');
          setTimeout(() => {
            setDigits(['', '', '', '']);
            setActiveIdx(0);
            setStatus('idle');
          }, 420);
        }
      }, 280);
    }
  };

  return (
    <motion.div
      animate={
        status === 'error'
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
          : status === 'success'
          ? { scale: [1, 1.02, 1] }
          : { x: 0, scale: 1 }
      }
      transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
      className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl p-2"
    >
      {/* Verification Shimmer Sweep */}
      <AnimatePresence>
        {status === 'verifying' && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'linear' }}
            className="pointer-events-none absolute inset-0 z-20 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />
        )}
      </AnimatePresence>

      {digits.map((digit, i) => {
        const isFocused = activeIdx === i && status === 'idle';
        return (
          <div
            key={i}
            className={`relative flex h-14 w-12 items-center justify-center rounded-xl border bg-zinc-900/90 transition-colors duration-150 ${
              status === 'success'
                ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300'
                : status === 'error'
                ? 'border-rose-500/80 bg-rose-950/30 text-rose-300'
                : 'border-zinc-800 text-zinc-100'
            }`}
          >
            {isFocused && (
              <motion.div
                layoutId="otp-active-ring"
                transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                className="pointer-events-none absolute -inset-[1px] rounded-xl border-2 border-zinc-400"
              />
            )}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit || 'empty'}
                initial={{ opacity: 0, y: 6, scale: 0.92, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, scale: 0.92, filter: 'blur(2px)' }}
                transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
                className="text-lg font-semibold tabular-nums"
              >
                {digit}
              </motion.span>
            </AnimatePresence>
            <input
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onFocus={() => setActiveIdx(i)}
              onChange={(e) => handleDigitInput(i, e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={`Digit ${i + 1}`}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
```

---

## Recipe 3: Zero-Re-Render Spotlight & Magnetic Button

```tsx
'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 400, damping: 26, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 400, damping: 26, mass: 0.8 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Pull factor capped at 0.25 for grounded feel
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-transform duration-100 active:scale-[0.97] after:absolute after:-inset-2 after:content-['']"
    >
      {children}
    </motion.button>
  );
}
```
