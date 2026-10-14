'use client';

import { useCallback, useSyncExternalStore } from 'react';

export const ENTER: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const CHANGE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    useCallback((notify: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    }, [query]),
    useCallback(() => window.matchMedia(query).matches, [query]),
    useCallback(() => serverValue, [serverValue]),
  );
}

export function useMotionPolicy() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', true);
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)', false);
  const wide = useMediaQuery('(min-width: 48rem) and (min-height: 36rem)', false);
  return { reduced, pointerMotion: !reduced && finePointer, wide };
}
