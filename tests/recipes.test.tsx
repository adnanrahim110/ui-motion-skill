import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM } from 'jsdom';
import { act, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost', pretendToBeVisual: true });
for (const name of ['window', 'document', 'HTMLElement', 'HTMLDialogElement', 'Element', 'Node', 'SVGElement', 'MutationObserver'] as const) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, writable: true, value: true });
const queries = new Map<string, { matches: boolean; listeners: Set<() => void> }>();
Object.defineProperty(dom.window, 'matchMedia', { value: (query: string) => {
  let value = queries.get(query);
  if (!value) { value = { matches: query.includes('reduced-motion'), listeners: new Set() }; queries.set(query, value); }
  return {
    get matches() { return value.matches; },
    media: query,
    addEventListener: (_type: string, callback: () => void) => value.listeners.add(callback),
    removeEventListener: (_type: string, callback: () => void) => value.listeners.delete(callback),
  };
} });
Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', ''); } });
Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'close', { value: function (this: HTMLDialogElement) { this.removeAttribute('open'); } });

const { render, fireEvent, cleanup } = await import('@testing-library/react');
const { VerificationCode } = await import('../skills/ui-motion/assets/react/verification-code.js');
const { ProgressiveDialog } = await import('../skills/ui-motion/assets/react/progressive-dialog.js');
const { useMotionPolicy } = await import('../skills/ui-motion/assets/react/motion-policy.js');
const { ScrollStory } = await import('../skills/ui-motion/assets/react/scroll-story.js');
type VerificationResult = import('../skills/ui-motion/assets/react/verification-code.js').VerificationResult;

function deferred<T>() {
  let resolve: (value: T) => void = () => { throw new Error('Promise is not initialized.'); };
  let reject: (reason?: unknown) => void = () => { throw new Error('Promise is not initialized.'); };
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  for (const [query, value] of queries) value.matches = query.includes('reduced-motion');
});

test('OTP validates format and keeps native paste/editing on one named input', () => {
  let calls = 0;
  const ui = render(<VerificationCode verify={async () => { calls++; return { ok: true }; }} />);
  const input = ui.getByLabelText('Verification code');
  fireEvent.click(ui.getByRole('button', { name: 'Verify code' }));
  assert.equal(calls, 0);
  assert.equal(document.activeElement, input);
  assert.match(ui.getByRole('status').textContent ?? '', /all six/);
  fireEvent.change(input, { target: { value: '12a34b56' } });
  assert.equal(input.getAttribute('aria-invalid'), 'false');
  assert.equal(ui.getByDisplayValue('123456'), input);
  assert.equal(input.getAttribute('autocomplete'), 'one-time-code');
});

test('OTP prevents duplicate requests and ignores a canceled late response', async () => {
  const work = deferred<VerificationResult>();
  let calls = 0;
  let signal: AbortSignal | undefined;
  const ui = render(<VerificationCode verify={(_code, requestSignal) => { calls++; signal = requestSignal; return work.promise; }} />);
  const input = ui.getByLabelText('Verification code');
  fireEvent.change(input, { target: { value: '123456' } });
  const form = input.closest('form');
  assert.ok(form);
  fireEvent.submit(form);
  fireEvent.submit(form);
  assert.equal(calls, 1);
  fireEvent.click(ui.getByRole('button', { name: 'Cancel verification' }));
  assert.equal(signal?.aborted, true);
  assert.equal(document.activeElement, input);
  await act(async () => { work.resolve({ ok: true }); await work.promise; });
  assert.match(ui.getByRole('status').textContent ?? '', /Enter the six/);
});

test('OTP reports failure, allows retry, and aborts on unmount', async () => {
  const work = deferred<VerificationResult>();
  const signals: AbortSignal[] = [];
  const ui = render(<VerificationCode verify={(_code, signal) => { signals.push(signal); return work.promise; }} />);
  fireEvent.change(ui.getByLabelText('Verification code'), { target: { value: '123456' } });
  fireEvent.click(ui.getByRole('button', { name: 'Verify code' }));
  await act(async () => { work.reject(new Error('network')); await work.promise.catch(() => undefined); });
  assert.match(ui.getByRole('status').textContent ?? '', /connection/);
  assert.equal(ui.getByDisplayValue('123456'), ui.getByLabelText('Verification code'));
  fireEvent.click(ui.getByRole('button', { name: 'Clear and retry' }));
  assert.equal(ui.getByDisplayValue(''), ui.getByLabelText('Verification code'));
  const next = deferred<VerificationResult>();
  ui.rerender(<VerificationCode verify={(_code, signal) => { signals.push(signal); return next.promise; }} />);
  fireEvent.change(ui.getByLabelText('Verification code'), { target: { value: '654321' } });
  fireEvent.click(ui.getByRole('button', { name: 'Verify code' }));
  ui.unmount();
  assert.equal(signals.at(-1)?.aborted, true);
  await act(async () => { next.resolve({ ok: true }); await next.promise; });
});

test('OTP success comes from the server callback and disables resubmission', async () => {
  let calls = 0;
  const ui = render(<VerificationCode verify={async () => { calls++; return { ok: true }; }} />);
  fireEvent.change(ui.getByLabelText('Verification code'), { target: { value: '123456' } });
  await act(async () => { fireEvent.click(ui.getByRole('button', { name: 'Verify code' })); });
  assert.match(ui.getByRole('status').textContent ?? '', /verified/);
  assert.ok(ui.getByRole('button', { name: 'Verified' }).hasAttribute('disabled'));
  assert.equal(calls, 1);
});

test('dialog places focus, preserves Back values, and restores a connected trigger', () => {
  const trigger = document.createElement('button');
  document.body.append(trigger);
  trigger.focus();
  let closes = 0;
  function Flow() {
    const [step, setStep] = useState('details');
    const [name, setName] = useState('');
    const input = useRef<HTMLInputElement>(null);
    return <ProgressiveDialog open onClose={() => { closes++; }} title={step === 'details' ? 'Your details' : 'Review details'} description="Review your entry before continuing." stepKey={step} initialFocusRef={input}>
      {step === 'details' ? <>
        <label>Name<input ref={input} value={name} onChange={(event) => setName(event.target.value)} /></label>
        <button type="button" onClick={() => setStep('review')}>Continue</button>
      </> : <><p>{name}</p><button type="button" onClick={() => setStep('details')}>Back</button></>}
    </ProgressiveDialog>;
  }
  const ui = render(<Flow />);
  const input = ui.getByLabelText('Name');
  assert.equal(document.activeElement, input);
  fireEvent.change(input, { target: { value: 'Long project name' } });
  fireEvent.click(ui.getByRole('button', { name: 'Continue' }));
  assert.equal(document.activeElement, ui.getByRole('heading', { name: 'Review details' }));
  fireEvent.click(ui.getByRole('button', { name: 'Back' }));
  assert.equal(ui.getByDisplayValue('Long project name'), document.activeElement);
  fireEvent.click(ui.getByRole('button', { name: 'Close dialog' }));
  assert.equal(document.activeElement, trigger);
  assert.equal(closes, 1);
});

test('dialog Escape unmounts request-owning content and ignores a late response', async () => {
  const work = deferred<VerificationResult>();
  let signal: AbortSignal | undefined;
  let calls = 0;
  function Flow() {
    const [open, setOpen] = useState(true);
    return <ProgressiveDialog open={open} onClose={() => setOpen(false)} title="Verify your account" stepKey="verification">
      <VerificationCode verify={(_code, requestSignal) => { calls++; signal = requestSignal; return work.promise; }} />
    </ProgressiveDialog>;
  }
  const ui = render(<Flow />);
  fireEvent.change(ui.getByLabelText('Verification code'), { target: { value: '123456' } });
  fireEvent.click(ui.getByRole('button', { name: 'Verify code' }));
  assert.equal(calls, 1);
  const modal = ui.getByRole('dialog');
  fireEvent(modal, new dom.window.Event('cancel', { bubbles: false, cancelable: true }));
  assert.equal(signal?.aborted, true);
  await act(async () => { work.resolve({ ok: true }); await work.promise; });
  assert.equal(ui.queryByRole('dialog'), null);
  assert.equal(ui.queryByText('Code verified.'), null);
});

test('dialog restores a fallback when the original trigger is removed', () => {
  const trigger = document.createElement('button');
  const fallback = document.createElement('button');
  document.body.append(trigger, fallback);
  trigger.focus();
  const ui = render(<ProgressiveDialog open onClose={() => undefined} title="Review changes" stepKey="review" returnFocusRef={{ current: fallback }}><p>Review your changes.</p></ProgressiveDialog>);
  trigger.remove();
  fireEvent.click(ui.getByRole('button', { name: 'Close dialog' }));
  assert.equal(document.activeElement, fallback);
});

test('a parent render does not reopen the dialog or steal focus from its input', () => {
  let opens = 0;
  const original = dom.window.HTMLDialogElement.prototype.showModal;
  Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { opens++; original.call(this); } });
  try {
    function Flow() {
      const [value, setValue] = useState('');
      const initial = useRef<HTMLInputElement>(null);
      return <ProgressiveDialog open onClose={() => undefined} title="Edit details" stepKey="edit" initialFocusRef={initial} returnFocusRef={{ current: null }}>
        <label>Detail<input ref={initial} value={value} onChange={(event) => setValue(event.target.value)} /></label>
      </ProgressiveDialog>;
    }
    const ui = render(<Flow />);
    const field = ui.getByLabelText('Detail');
    fireEvent.change(field, { target: { value: 'Keep editing' } });
    assert.equal(opens, 1);
    assert.equal(document.activeElement, field);
  } finally {
    Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'showModal', { configurable: true, value: original });
  }
});

test('unsupported dialog keeps real content usable as an inline region', () => {
  const original = Object.getOwnPropertyDescriptor(dom.window.HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(dom.window.HTMLDialogElement.prototype, 'showModal');
  try {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    let actions = 0;
    const ui = render(<ProgressiveDialog open onClose={() => undefined} title="Review changes" description="Confirm the selected changes." stepKey="review">
      <button type="button" onClick={() => { actions++; }}>Apply changes</button>
    </ProgressiveDialog>);
    assert.equal(ui.queryByRole('dialog'), null);
    assert.ok(ui.getByRole('region', { name: 'Review changes' }));
    fireEvent.click(ui.getByRole('button', { name: 'Apply changes' }));
    assert.equal(actions, 1);
    fireEvent.click(ui.getByRole('button', { name: 'Close panel' }));
    assert.equal(document.activeElement, trigger);
  } finally {
    if (original) Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'showModal', original);
  }
});

test('native close events notify the parent once and restore focus', () => {
  const trigger = document.createElement('button');
  document.body.append(trigger);
  trigger.focus();
  let closes = 0;
  const ui = render(<ProgressiveDialog open onClose={() => { closes++; }} title="Confirm changes" stepKey="confirm"><p>Review the changes.</p></ProgressiveDialog>);
  const dialog = ui.getByRole('dialog');
  dialog.removeAttribute('open');
  fireEvent(dialog, new dom.window.Event('close'));
  fireEvent(dialog, new dom.window.Event('close'));
  assert.equal(closes, 1);
  assert.equal(document.activeElement, trigger);
});

test('scroll narrative exposes every step and working anchor targets without animation', () => {
  const ui = render(<ScrollStory title="Review a release" introduction="Follow the release from source changes to rollout." steps={[
    { id: 'inspect', title: 'Inspect changes', content: <p>Read the diff and release notes.</p> },
    { id: 'validate', title: 'Validate behavior', content: <p>Run checks appropriate to the changed behavior.</p> },
    { id: 'release', title: 'Roll out safely', content: <p>Publish after review and monitor the result.</p> },
  ]} />);
  assert.equal(ui.getAllByRole('link').length, 3);
  assert.equal(ui.getAllByRole('heading', { level: 3 }).length, 3);
  for (const link of ui.getAllByRole('link')) {
    const href = link.getAttribute('href');
    assert.ok(href);
    assert.ok(href.startsWith('#'));
    assert.ok(document.getElementById(decodeURIComponent(href.slice(1))));
  }
  assert.ok(ui.getByText('Publish after review and monitor the result.'));
});

test('motion preferences use static server defaults and respond to changes', () => {
  function Policy() {
    const policy = useMotionPolicy();
    return <output>{JSON.stringify(policy)}</output>;
  }
  assert.match(renderToString(<Policy />), /&quot;reduced&quot;:true/);
  const baselineListeners = new Map([...queries].map(([query, value]) => [query, value.listeners.size]));
  const ui = render(<Policy />);
  assert.match(ui.container.textContent ?? '', /"reduced":true/);
  act(() => {
    for (const [query, value] of queries) {
      value.matches = !query.includes('reduced-motion');
      value.listeners.forEach((notify) => notify());
    }
  });
  assert.match(ui.container.textContent ?? '', /"pointerMotion":true/);
  act(() => {
    const value = queries.get('(prefers-reduced-motion: reduce)');
    assert.ok(value);
    value.matches = true;
    value.listeners.forEach((notify) => notify());
  });
  assert.match(ui.container.textContent ?? '', /"pointerMotion":false/);
  ui.unmount();
  assert.ok([...queries].every(([query, value]) => value.listeners.size === (baselineListeners.get(query) ?? 0)));
});
