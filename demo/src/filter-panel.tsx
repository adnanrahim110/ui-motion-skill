import { useState } from 'react';

const changes = [
  { title: 'Keep filter selection immediate', area: 'Navigation', status: 'Ready' },
  { title: 'Return focus after closing the dialog', area: 'Keyboard', status: 'Ready' },
  { title: 'Cancel verification when a review closes', area: 'Requests', status: 'Needs review' },
  { title: 'Remove spatial motion when requested', area: 'Accessibility', status: 'Ready' },
  { title: 'Keep every story section readable', area: 'Content', status: 'Needs review' },
  { title: 'Recalculate progress after a resize', area: 'Scrolling', status: 'Ready' },
];
const filters = ['All', 'Ready', 'Needs review'] as const;
type Filter = typeof filters[number];

export function FilterPanel() {
  const [filter, setFilter] = useState<Filter>('All');
  const visible = changes.filter((change) => filter === 'All' || change.status === filter);
  return <section aria-labelledby="changes-title" className="min-w-0">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-medium text-blue-800">Repeated controls · 0 ms delay</p><h2 id="changes-title" className="mt-2 text-2xl font-semibold tracking-tight">What's in this release</h2></div>
      <p role="status" className="text-sm tabular-nums text-slate-600">{visible.length} of {changes.length} changes</p>
    </header>
    <div role="group" aria-label="Filter changes" className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {filters.map((value) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={filter === value ? 'min-h-12 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700' : 'min-h-12 rounded-lg px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700'}>{value}</button>)}
    </div>
    <ul aria-label="Release changes" className="divide-y divide-slate-200">
      {visible.map((change) => <li key={change.title} className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div className="min-w-0"><p className="font-medium text-slate-950">{change.title}</p><p className="mt-1 text-sm text-slate-600">{change.area}</p></div>
        <span className={change.status === 'Ready' ? 'rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-900' : 'rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700'}>{change.status}</span>
      </li>)}
    </ul>
  </section>;
}
