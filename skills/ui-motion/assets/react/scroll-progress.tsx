'use client';

import { useEffect, useRef } from 'react';
import { useMotionPolicy } from './motion-policy';
import { trackScrollProgress } from './scroll-timeline';

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPolicy();
  useEffect(() => {
    const element = bar.current;
    if (!element || reduced) return;
    return trackScrollProgress(element);
  }, [reduced]);
  if (reduced) return null;
  return <div ref={bar} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 origin-left bg-blue-800" />;
}
