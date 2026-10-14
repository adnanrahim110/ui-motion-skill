'use client';

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { useAnimate } from 'motion/react';
import { CHANGE, useMotionPolicy } from './motion-policy';

export type MagneticButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export function MagneticButton({ children, onClick, disabled = false }: MagneticButtonProps) {
  const { pointerMotion } = useMotionPolicy();
  const [visual, animate] = useAnimate<HTMLSpanElement>();
  const bounds = useRef<DOMRect | null>(null);
  const frame = useRef<number | null>(null);
  const controller = useRef<ReturnType<typeof animate> | null>(null);

  function stopFrame() { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; }
  function reset() {
    stopFrame();
    bounds.current = null;
    controller.current?.stop();
    if (visual.current) controller.current = animate(visual.current, { x: 0, y: 0 }, { duration: pointerMotion ? 0.12 : 0, ease: CHANGE });
  }

  useEffect(() => {
    const element = visual.current;
    const observer = new ResizeObserver(() => { bounds.current = null; });
    if (element?.parentElement) observer.observe(element.parentElement);
    const invalidate = () => { bounds.current = null; };
    window.addEventListener('scroll', invalidate, { passive: true, capture: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', invalidate, true); stopFrame(); controller.current?.cancel(); };
  }, [visual]);

  useEffect(() => { reset(); }, [pointerMotion, disabled]);

  function move(event: PointerEvent<HTMLButtonElement>) {
    if (!pointerMotion || disabled) return;
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') { reset(); return; }
    bounds.current ??= event.currentTarget.getBoundingClientRect();
    const rect = bounds.current;
    const x = Math.max(-8, Math.min(8, (event.clientX - rect.left - rect.width / 2) * 0.2));
    const y = Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) * 0.2));
    stopFrame();
    frame.current = requestAnimationFrame(() => {
      controller.current?.stop();
      if (visual.current) controller.current = animate(visual.current, { x, y }, { duration: 0.08, ease: CHANGE });
      frame.current = null;
    });
  }

  return <button type="button" onClick={onClick} disabled={disabled} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset} className="min-h-12 min-w-12 rounded-lg bg-blue-800 px-6 py-3 font-medium text-white hover:bg-blue-900 active:bg-blue-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-600">
    <span ref={visual} className="pointer-events-none inline-block">{children}</span>
  </button>;
}
