'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

export type VerificationResult = { ok: true } | { ok: false; message: string };
type Status = 'idle' | 'verifying' | 'success' | 'error';

export type VerificationCodeProps = {
  verify: (code: string, signal: AbortSignal) => Promise<VerificationResult>;
};

export function VerificationCode({ verify }: VerificationCodeProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const request = useRef<AbortController | null>(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('Enter the six-digit code.');
  const pending = status === 'verifying';

  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || status === 'success') return;
    if (!/^\d{6}$/.test(code)) {
      setStatus('error');
      setMessage('Enter all six digits before verifying.');
      input.current?.focus();
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setStatus('verifying');
    setMessage('Verifying code…');
    try {
      const result = await verify(code, controller.signal);
      if (controller.signal.aborted || request.current !== controller) return;
      setStatus(result.ok ? 'success' : 'error');
      setMessage(result.ok ? 'Code verified.' : result.message || 'That code could not be verified. Try again.');
      if (!result.ok) input.current?.focus();
    } catch {
      if (controller.signal.aborted || request.current !== controller) return;
      setStatus('error');
      setMessage('Verification could not finish. Check your connection and try again.');
      input.current?.focus();
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  function retry() {
    request.current?.abort();
    request.current = null;
    setCode('');
    setStatus('idle');
    setMessage('Enter the six-digit code.');
    input.current?.focus();
  }

  return (
    <form onSubmit={submit} noValidate aria-busy={pending} className="grid w-full max-w-sm gap-4">
      <label htmlFor={id} className="text-sm font-medium text-zinc-950">Verification code</label>
      <input
        ref={input}
        id={id}
        type="text"
        name="verification-code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        required
        value={code}
        readOnly={pending || status === 'success'}
        aria-invalid={status === 'error'}
        aria-describedby={`${id}-status`}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, '').slice(0, 6));
          setStatus('idle');
          setMessage('Enter the six-digit code.');
        }}
        className="min-h-12 w-full rounded-lg border border-zinc-500 bg-white px-4 py-3 text-lg tracking-widest text-zinc-950 aria-invalid:border-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      />
      <p id={`${id}-status`} role="status" aria-live="polite" aria-atomic="true" className="min-h-12 text-sm text-zinc-800">{message}</p>
      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={pending || status === 'success'} className="min-h-12 min-w-12 rounded-lg bg-blue-800 px-4 py-3 font-medium text-white hover:bg-blue-900 active:bg-blue-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-600">
          {pending ? 'Verifying…' : status === 'success' ? 'Verified' : 'Verify code'}
        </button>
        <button type="button" onClick={retry} className="min-h-12 min-w-12 rounded-lg border border-zinc-500 px-4 py-3 font-medium text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
          {pending ? 'Cancel verification' : 'Clear and retry'}
        </button>
      </div>
    </form>
  );
}
