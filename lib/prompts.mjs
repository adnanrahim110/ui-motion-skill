import readline from 'node:readline';

export class CancelledError extends Error {
  constructor() { super('Installation cancelled.'); }
}

export function select({ step, title, items, multiple = false }) {
  return new Promise((resolve, reject) => {
    let cursor = Math.max(0, items.findIndex((item) => item.checked));
    const checked = new Set(items.flatMap((item, index) => item.checked ? [index] : []));
    const input = process.stdin;
    const output = process.stdout;
    const wasRaw = input.isRaw;
    const rl = readline.createInterface({ input, output });
    readline.emitKeypressEvents(input, rl);
    input.setRawMode(true);
    let rows = 0;
    const render = () => {
      if (rows) { readline.moveCursor(output, 0, -rows); readline.cursorTo(output, 0); readline.clearScreenDown(output); }
      const lines = [
        `Step ${step} of 3: ${title}`,
        ...items.map((item, index) => `${index === cursor ? '>' : ' '} ${multiple ? checked.has(index) ? '[x]' : '[ ]' : index === cursor ? '(*)' : '( )'} ${item.label}`),
        multiple ? `Up/down: move | Space: toggle | a: toggle all | Enter: confirm (${checked.size} selected) | Esc: cancel` : 'Up/down: move | Enter: confirm | Esc: cancel',
      ];
      const columns = output.columns || 80;
      rows = lines.reduce((count, line) => count + Math.max(1, Math.ceil(line.length / columns)), 0);
      output.write(`${lines.join('\n')}\n`);
    };
    const cleanup = () => {
      input.removeListener('keypress', onKey);
      input.removeListener('end', onEnd);
      process.removeListener('SIGTERM', onEnd);
      input.setRawMode(Boolean(wasRaw));
      rl.close();
      input.pause();
    };
    const onEnd = () => { cleanup(); reject(new CancelledError()); };
    const onKey = (_, key) => {
      if (!key) return;
      if ((key.ctrl && key.name === 'c') || key.name === 'escape') { onEnd(); return; }
      if (key.name === 'up' || key.name === 'k') cursor = (cursor - 1 + items.length) % items.length;
      else if (key.name === 'down' || key.name === 'j') cursor = (cursor + 1) % items.length;
      else if (multiple && key.name === 'space') { if (checked.has(cursor)) checked.delete(cursor); else checked.add(cursor); }
      else if (multiple && key.name === 'a') { if (checked.size === items.length) checked.clear(); else items.forEach((_, index) => checked.add(index)); }
      else if (key.name === 'return') {
        if (multiple && !checked.size) return;
        const values = multiple ? [...checked].sort((a, b) => a - b).map((index) => items[index].value) : items[cursor].value;
        cleanup(); resolve(values); return;
      } else return;
      render();
    };
    input.on('keypress', onKey);
    input.on('end', onEnd);
    process.once('SIGTERM', onEnd);
    render();
  });
}
