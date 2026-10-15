const nativeMatchMedia = window.matchMedia.bind(window);
const query = '(prefers-reduced-motion: reduce)';
let forced = false;
const subscriptions = new Set<MediaQueryList>();

window.matchMedia = (value: string) => {
  const media = nativeMatchMedia(value);
  if (value !== query) return media;
  const nativeMatches = () => nativeMatchMedia(query).matches;
  Object.defineProperty(media, 'matches', { get: () => forced || nativeMatches() });
  subscriptions.add(media);
  return media;
};

export function simulateReducedMotion(value: boolean) {
  forced = value;
  for (const media of subscriptions) media.dispatchEvent(new MediaQueryListEvent('change', { matches: media.matches, media: query }));
}
