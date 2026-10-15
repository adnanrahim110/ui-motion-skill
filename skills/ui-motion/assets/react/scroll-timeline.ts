import { animate, scroll } from 'motion';

export function trackScrollProgress(
  element: HTMLElement,
  options: { target?: HTMLElement; axis?: 'x' | 'y' } = {},
): () => void {
  const axis = options.axis === 'y' ? 'scaleY' : 'scaleX';
  let animation: ReturnType<typeof animate> | null = null;
  let cancel: (() => void) | null = null;
  let frame: number | null = null;

  const bind = () => {
    cancel?.();
    animation?.cancel();
    const height = options.target?.offsetHeight ?? Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (height <= window.innerHeight) {
      animation = animate(element, { transform: `${axis}(0)` }, { duration: 0 });
      cancel = null;
      return;
    }
    animation = animate(element, { transform: [`${axis}(0)`, `${axis}(1)`] }, { duration: 1, ease: 'linear' });
    cancel = scroll(animation, options.target ? { target: options.target, offset: ['start start', 'end end'] } : {});
  };
  const schedule = () => {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => { frame = null; bind(); });
  };
  bind();
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
  observer?.observe(document.documentElement);
  observer?.observe(document.body);
  if (options.target) observer?.observe(options.target);
  window.addEventListener('resize', schedule);

  return () => {
    observer?.disconnect();
    window.removeEventListener('resize', schedule);
    if (frame !== null) cancelAnimationFrame(frame);
    cancel?.();
    animation?.cancel();
  };
}
