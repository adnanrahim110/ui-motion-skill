import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const held = new Set();
const stats = { verified: 0, rejected: 0, cancelled: 0, pending: 0 };
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  const json = (status, value) => { response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(value)); };
  if (url.pathname === '/api/stats' && request.method === 'GET') return json(200, stats);
  if (url.pathname === '/api/release' && request.method === 'POST') { for (const finish of held) finish(); return json(200, { released: true }); }
  if (url.pathname === '/api/verify' && request.method === 'POST') {
    let body = '';
    try {
      for await (const chunk of request) { body += chunk; if (body.length > 512) return json(413, { ok: false, message: 'Request too large.' }); }
      const data = JSON.parse(body);
      if (typeof data.code !== 'string' || !/^\d{6}$/.test(data.code)) return json(400, { ok: false, message: 'Enter six digits.' });
      const result = data.code === '246810' ? { ok: true } : { ok: false, message: 'That code did not match. Try 246810 for this demo.' };
      let finished = false;
      stats.pending++;
      const finish = () => {
        if (finished) return;
        finished = true;
        held.delete(finish);
        stats.pending--;
        if (result.ok) stats.verified++; else stats.rejected++;
        json(200, result);
      };
      response.on('close', () => {
        if (finished) return;
        finished = true;
        held.delete(finish);
        stats.pending--;
        stats.cancelled++;
      });
      if (url.searchParams.get('hold') === 'true') held.add(finish); else finish();
      return;
    } catch { return json(400, { ok: false, message: 'Invalid request.' }); }
  }
  if (url.pathname.startsWith('/api/')) return json(404, { error: 'Not found.' });
  const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/app.css': ['app.css', 'text/css'] };
  const file = files[url.pathname];
  if (!file || request.method !== 'GET') { response.writeHead(404); return response.end('Not found'); }
  response.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(path.join(root, file[0])).pipe(response);
});
server.listen(4317, '127.0.0.1', () => console.log('UI Motion demo: http://127.0.0.1:4317'));
