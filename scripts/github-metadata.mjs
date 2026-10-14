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
  const combined = [...new Set([...(current.topics ?? []), ...metadata.topics])];
  assert.ok(combined.length <= 20, 'Existing topics plus the proposed topics exceed GitHub’s limit. Review the selection first.');
  execFileSync('gh', ['repo', 'edit', metadata.repository, '--description', metadata.description, '--add-topic', metadata.topics.join(',')], { stdio: 'pipe' });
  const updated = JSON.parse(execFileSync('gh', ['api', `repos/${metadata.repository}`], { encoding: 'utf8' }));
  assert.equal(updated.description, metadata.description);
  assert.ok(metadata.topics.every((topic) => updated.topics.includes(topic)));
  console.log(`Verified live description and ${updated.topics.length} topics on ${updated.html_url}.`);
} else {
  console.log('Preview only. Add --apply to update the authorized repository.');
}
