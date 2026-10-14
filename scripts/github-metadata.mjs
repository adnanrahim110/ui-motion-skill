import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const metadata = JSON.parse(fs.readFileSync(new URL('../.github/repository-metadata.json', import.meta.url), 'utf8'));
const args = process.argv.slice(2);
if (args.some((arg) => arg !== '--apply')) throw new Error('Usage: node scripts/github-metadata.mjs [--apply]');
assert.match(metadata.repository, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
assert.equal(typeof metadata.description, 'string');
assert.ok(metadata.description.length > 0 && metadata.description.length <= 350);
assert.ok(Array.isArray(metadata.topics) && metadata.topics.length <= 20);
assert.equal(new Set(metadata.topics).size, metadata.topics.length);
for (const topic of metadata.topics) assert.match(topic, /^[a-z0-9][a-z0-9-]{0,49}$/);

console.log(JSON.stringify(metadata, null, 2));
if (args.includes('--apply')) {
  const current = JSON.parse(execFileSync('gh', ['api', `repos/${metadata.repository}`], { encoding: 'utf8' }));
  assert.equal(current.full_name, metadata.repository);
  execFileSync('gh', ['repo', 'edit', metadata.repository, '--description', metadata.description], { stdio: 'pipe' });
  execFileSync('gh', ['api', '--method', 'PUT', `repos/${metadata.repository}/topics`, '--input', '-'], {
    input: JSON.stringify({ names: metadata.topics }),
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const updated = JSON.parse(execFileSync('gh', ['api', `repos/${metadata.repository}`], { encoding: 'utf8' }));
  assert.equal(updated.description, metadata.description);
  assert.deepEqual([...updated.topics].sort(), [...metadata.topics].sort());
  console.log(`Verified live description and ${updated.topics.length} topics on ${updated.html_url}.`);
} else {
  console.log('Preview only. Add --apply to update the authorized repository.');
}
