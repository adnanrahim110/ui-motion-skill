import { useRef, useState } from 'react';
import { ProgressiveDialog } from '../../skills/ui-motion/assets/react/progressive-dialog';
import { VerificationCode, type VerificationResult } from '../../skills/ui-motion/assets/react/verification-code';
import { MagneticButton } from '../../skills/ui-motion/assets/react/magnetic-button';
import { Action } from './ui';

export function ReviewFlow({ hold }: { hold: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('October release');
  const [verified, setVerified] = useState(false);
  const [complete, setComplete] = useState(false);
  const [requestState, setRequestState] = useState('No verification sent');
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  async function verify(code: string, signal: AbortSignal): Promise<VerificationResult> {
    setRequestState('Verification pending');
    try {
      const response = await fetch(`/api/verify?hold=${hold}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }), signal });
      const data: unknown = await response.json();
      if (!response.ok || typeof data !== 'object' || data === null || !('ok' in data)) throw new Error('Invalid verification response.');
      if (signal.aborted) return { ok: false, message: 'Cancelled.' };
      if (data.ok === true) { setRequestState('Verification accepted'); return { ok: true }; }
      setRequestState('Code rejected');
      return { ok: false, message: 'That code did not match. Try 246810 for this demo.' };
    } catch (error) { setRequestState(signal.aborted ? 'Verification cancelled' : 'Verification failed'); throw error; }
  }

  function begin() { setStep(0); setVerified(false); setComplete(false); setOpen(true); }
  const titles = ['Name the review', 'Review the changes', 'Confirm your review'];
  return <aside aria-labelledby="review-title" className="min-w-0 self-start rounded-2xl bg-slate-900 p-4 text-white sm:p-8">
    <p className="text-sm font-medium text-blue-200">Progressive dialog · 220 ms entrance</p>
    <h2 id="review-title" className="mt-6 text-3xl font-semibold leading-tight tracking-tight">One review.<br />One dialog.</h2>
    <p className="mt-4 leading-relaxed text-slate-300">Name the release, inspect the changes, and confirm. Go back without losing your work.</p>
    <div className="mt-8"><MagneticButton onClick={begin}>Start a review</MagneticButton></div>
    <button ref={trigger} type="button" onClick={begin} className="mt-4 min-h-12 text-sm font-medium text-blue-200 underline decoration-blue-400 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Open with keyboard focus</button>
    <p role="status" className="mt-6 min-h-12 border-t border-slate-700 pt-4 text-sm text-slate-300">{complete ? `${name} review complete.` : requestState}</p>
    <ProgressiveDialog open={open} onClose={() => setOpen(false)} title={titles[step] ?? 'Release review'} description={`Step ${step + 1} of 3`} stepKey={step} initialFocusRef={input} returnFocusRef={trigger}>
      {step === 0 && <div className="grid min-w-0 grid-cols-1 gap-6">
        <label className="grid min-w-0 grid-cols-1 gap-2 text-sm font-medium">Review name<input ref={input} value={name} maxLength={120} onChange={(event) => setName(event.target.value)} className="min-h-12 w-full min-w-0 rounded-lg border border-slate-500 px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700" /></label>
        <p className="text-sm leading-relaxed text-slate-600">This name stays with the review as you move between steps.</p>
        <Action disabled={!name.trim()} onClick={() => setStep(1)}>Continue to changes</Action>
      </div>}
      {step === 1 && <div className="grid min-w-0 grid-cols-1 gap-6">
        <div className="rounded-lg bg-slate-100 p-4"><p className="text-sm text-slate-600">Reviewing</p><p className="mt-1 break-words text-xl font-semibold">{name}</p></div>
        <ul className="grid gap-4 text-sm leading-relaxed"><li>Four changes are ready for review.</li><li>Two changes still need attention before release.</li><li>Keyboard and reduced-motion checks remain part of the review.</li></ul>
        <div className="flex flex-wrap gap-4"><Action onClick={() => setStep(0)}>Back</Action><Action onClick={() => setStep(2)}>Continue to confirmation</Action></div>
      </div>}
      {step === 2 && <div className="grid min-w-0 grid-cols-1 gap-6">
        <p className="text-sm leading-relaxed text-slate-600">The local demo server accepts <strong className="font-semibold text-slate-950">246810</strong>. No account or real release is changed.</p>
        <VerificationCode verify={verify} onVerifiedChange={setVerified} />
        <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-6"><Action onClick={() => setStep(1)}>Back</Action><Action disabled={!verified} onClick={() => { setComplete(true); setOpen(false); }}>Complete review</Action></div>
      </div>}
    </ProgressiveDialog>
  </aside>;
}
