import type { ButtonHTMLAttributes } from 'react';

export function Action({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={`inline-flex min-h-12 max-w-full items-center justify-center break-words rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:border-slate-500 hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} />;
}

export function Metric({ value, label }: { value: string; label: string }) {
  return <div><p className="text-3xl font-semibold tracking-tight sm:text-4xl">{value}</p><p className="mt-2 text-sm text-slate-600">{label}</p></div>;
}
