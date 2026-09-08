import assert from 'node:assert/strict';
import { test } from 'node:test';

import { loadKatex } from '../src/extensions/Katex/katex-loader';

import type { KatexRenderer } from '../src/extensions/Katex/katex-loader';

test('concurrent previews share a loader and cache its renderer', async () => {
  let calls = 0;
  const renderer = {} as KatexRenderer;
  const loader = async () => {
    calls++;
    return renderer;
  };
  const first = loadKatex(loader);
  const second = loadKatex(loader);
  assert.equal(first, second);
  assert.equal(await first, renderer);
  assert.equal(await loadKatex(loader), renderer);
  assert.equal(calls, 1);
});

test('failed loaders can retry and independent loader configurations stay isolated', async () => {
  let calls = 0;
  const renderer = {} as KatexRenderer;
  const loader = async () => {
    if (++calls === 1) throw new Error('Network failure');
    return renderer;
  };
  await assert.rejects(loadKatex(loader), /Network failure/);
  assert.equal(await loadKatex(loader), renderer);
  assert.equal(calls, 2);
  const other = {} as KatexRenderer;
  assert.equal(await loadKatex(async () => other), other);
});
