'use client';

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useAnimate } from 'motion/react';
import { CHANGE, ENTER, useMotionPolicy } from './motion-policy';

export type ProgressiveDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  stepKey: string | number;
  children: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function ProgressiveDialog({
  open,
  onClose,
  title,
  description,
  stepKey,
  children,
  initialFocusRef,
  returnFocusRef,
}: ProgressiveDialogProps) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const activeSession = useRef(false);
  const dismissed = useRef(false);
  const focusTargets = useRef({ initialFocusRef, returnFocusRef });
  const [surface, animate] = useAnimate<HTMLDivElement>();
  const [native, setNative] = useState(true);
  const { reduced } = useMotionPolicy();

  useEffect(() => { focusTargets.current = { initialFocusRef, returnFocusRef }; });

  function restoreFocus() {
    const fallback = focusTargets.current.returnFocusRef?.current;
    const target = trigger.current?.isConnected ? trigger.current : fallback;
    if (target?.isConnected) target.focus();
  }

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    if (!activeSession.current) {
      const active = document.activeElement;
      trigger.current = active instanceof HTMLElement ? active : null;
      activeSession.current = true;
      dismissed.current = false;
    }
    if (native && (!element || typeof element.showModal !== 'function')) {
      setNative(false);
      return;
    }
    if (native && element && !element.open) element.showModal();
    return () => {
      if (element?.open) element.close();
      restoreFocus();
      activeSession.current = false;
    };
  }, [open, native]);

  useEffect(() => {
    if (!open) return;
    const requested = focusTargets.current.initialFocusRef?.current;
    const target = requested && surface.current?.contains(requested) ? requested : heading.current;
    target?.focus();
  }, [open, native, stepKey, surface]);

  useEffect(() => {
    const content = surface.current;
    if (!open || !native || !content || reduced) return;
    const animation = animate(content, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.22, ease: ENTER });
    return () => { animation.cancel(); };
  }, [open, native, reduced, animate, surface]);

  useEffect(() => {
    const element = dialog.current;
    const content = surface.current;
    if (!open || !native || !element || !content || reduced || typeof ResizeObserver === 'undefined') return;
    const availableHeight = () => {
      const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return Math.max(0, (window.visualViewport?.height ?? window.innerHeight) - rootSize * 2);
    };
    let previous = Math.min(content.offsetHeight, availableHeight());
    let animation: ReturnType<typeof animate> | null = null;
    let frame: number | null = null;
    const measure = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        const next = Math.min(content.offsetHeight, availableHeight());
        if (next > 0 && Math.abs(next - previous) > 1) {
          const from = animation ? element.getBoundingClientRect().height : previous;
          animation?.stop();
          animation = animate(element, { height: [from, next] }, { duration: 0.22, ease: CHANGE });
          previous = next;
        }
        frame = null;
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
      if (frame !== null) cancelAnimationFrame(frame);
      animation?.cancel();
      element.style.removeProperty('height');
    };
  }, [open, native, reduced, animate, surface]);

  function dismiss() {
    if (dismissed.current) return;
    dismissed.current = true;
    if (dialog.current?.open) dialog.current.close();
    restoreFocus();
    onClose();
  }

  const content = open && (
    <div ref={surface} className="grid min-w-0 grid-cols-1 gap-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 basis-40">
          <h2 ref={heading} id={`${id}-title`} tabIndex={-1} className="break-words text-xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">{title}</h2>
          {description && <p id={`${id}-description`} className="mt-2 text-sm text-zinc-700">{description}</p>}
        </div>
        <button type="button" onClick={dismiss} aria-label={native ? 'Close dialog' : 'Close panel'} className="min-h-12 min-w-12 shrink-0 rounded-lg border border-zinc-500 px-4 py-3 text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">Close</button>
      </header>
      {children}
    </div>
  );

  if (!native) {
    return open ? <section aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined} className="w-full min-w-0 max-w-lg rounded-2xl border border-zinc-400 bg-white text-zinc-950">{content}</section> : null;
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onCancel={(event) => { event.preventDefault(); dismiss(); }}
      onClose={() => { if (open && !dialog.current?.open) dismiss(); }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-0 text-zinc-950 shadow-xl backdrop:bg-black/60"
    >
      {content}
    </dialog>
  );
}
