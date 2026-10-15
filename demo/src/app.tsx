import { useState } from 'react';
import { ScrollProgress } from '../../skills/ui-motion/assets/react/scroll-progress';
import { ScrollStory } from '../../skills/ui-motion/assets/react/scroll-story';
import { useMotionPolicy } from '../../skills/ui-motion/assets/react/motion-policy';
import { FilterPanel } from './filter-panel';
import { ReviewFlow } from './review-flow';
import { Metric } from './ui';
import { simulateReducedMotion } from './media';

export function App() {
  const [reduced, setReduced] = useState(false);
  const [hold, setHold] = useState(false);
  const policy = useMotionPolicy();
  return <>
    <ScrollProgress />
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4">Skip to content</a>
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <a href="#" className="inline-flex min-h-12 items-center gap-3 text-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"><svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M4 26C9 6 10 6 28 6M4 26H28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="28" cy="6" r="3" fill="#1e40af" /></svg>UI Motion</a>
        <p className="text-sm text-slate-600">Working component demo <span aria-hidden="true" className="mx-2">/</span> Local requests only</p>
      </div>
    </header>
    <main id="main" className="mx-auto min-w-0 max-w-6xl wrap-anywhere px-4 pb-12 sm:px-8">
      <section aria-labelledby="page-title" className="grid min-w-0 grid-cols-1 gap-8 border-b border-slate-200 py-12 sm:py-16 lg:grid-cols-[3fr_2fr] lg:items-end">
        <div><p className="text-sm font-semibold text-blue-800">Release review</p><h1 id="page-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">A few interactions.<br />Every detail counts.</h1><p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">Try the filters. Open a review. Change your mind halfway through. The shipped components keep the work moving.</p></div>
        <div className="grid min-w-0 grid-cols-1 gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3 lg:border-t-0 lg:pb-2"><Metric value="0 ms" label="filter delay" /><Metric value="220 ms" label="dialog entry" /><Metric value="3" label="review steps" /></div>
      </section>
      <div className="grid min-w-0 grid-cols-1 items-start gap-10 py-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16 lg:py-12"><FilterPanel /><ReviewFlow hold={hold} /></div>
      <section aria-labelledby="controls-title" className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6">
        <div><h2 id="controls-title" className="font-semibold">Test the edge cases</h2><p role="status" className="mt-2 text-sm text-slate-600">Motion preference: {policy.reduced ? 'reduced' : 'full'}. {hold ? 'Verification responses are held until cancelled or released.' : 'Verification uses the local server.'}</p></div>
        <div className="flex flex-wrap gap-6">
          <label className="flex min-h-12 items-center gap-3 text-sm font-medium"><input type="checkbox" checked={reduced} onChange={(event) => { setReduced(event.target.checked); simulateReducedMotion(event.target.checked); }} className="size-5 accent-blue-800" />Simulate reduced motion</label>
          <label className="flex min-h-12 items-center gap-3 text-sm font-medium"><input type="checkbox" checked={hold} onChange={(event) => setHold(event.target.checked)} className="size-5 accent-blue-800" />Hold verification response</label>
        </div>
      </section>
      <div className="mt-12 border-t border-slate-200 pt-6"><ScrollStory title="From a click to a completed review" introduction="The content stays on the page. Only the progress rail follows your position." steps={[
        { id: 'choose', title: 'Choose what needs attention', content: <div className="grid gap-6 leading-relaxed"><p>Filtering is a repeated action. Selection updates immediately, and the list follows in the same render. There is no fade between one set of changes and the next.</p><div className="border-l-4 border-blue-800 bg-white p-6"><p className="font-semibold text-slate-950">The useful feedback is the result.</p><p className="mt-3">A pressed state and a clear count say what changed. The interaction stays fast for mouse, touch, and keyboard.</p></div></div> },
        { id: 'review', title: 'Keep the review in one place', content: <div className="grid gap-6 leading-relaxed"><p>The dialog keeps a single shell as its contents change. A short entrance establishes the surface. Focus moves to the field or heading for the current step.</p><p>Go back and the name is still there. Press Escape and focus returns to the control that opened the dialog. The interface does not wait for an exit animation.</p><div className="rounded-lg bg-slate-900 p-6 font-mono text-sm leading-loose text-blue-100">open: 220 ms<br />filter: immediate<br />close: immediate<br />reduced motion: immediate</div></div> },
        { id: 'finish', title: 'Finish, retry, or leave', content: <div className="grid gap-6 leading-relaxed"><p>Verification comes from the local server. A rejected code can be corrected. Pending requests can be cancelled. Closing the dialog aborts work owned by its contents.</p><p>Enable reduced motion above and repeat the flow. The same names, content, actions, and focus behavior remain available. The moving progress indicator disappears.</p><div className="border-t border-slate-200 py-6"><p className="text-2xl font-semibold tracking-tight text-slate-950">The interaction still works at rest.</p></div></div> },
      ]} /></div>
    </main>
    <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate-600 sm:px-8"><p>UI Motion · React + TypeScript + Motion</p><a href="https://github.com/adnanrahim110/ui-motion-skill" className="inline-flex min-h-12 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">Read the source</a></div></footer>
  </>;
}
