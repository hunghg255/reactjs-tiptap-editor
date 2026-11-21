import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

// Run after build:lib. Guards against a regression that bundled React into the
// published package, so apps ended up with two React instances and hooks crashed
// with "Cannot read properties of null (reading 'useId')" (issue #395).
test('the library build keeps React external to the consuming application', () => {
  const libDir = new URL('../lib/', import.meta.url);
  assert.ok(fs.existsSync(libDir), 'run `pnpm build:lib` before this test');

  // The entry points must import React as an external peer dependency.
  const indexEsm = fs.readFileSync(new URL('../lib/index.js', import.meta.url), 'utf8');
  const indexCjs = fs.readFileSync(new URL('../lib/index.cjs', import.meta.url), 'utf8');
  assert.match(indexEsm, /from\s*["']react["']/, 'ESM entry must import "react" externally');
  assert.match(indexCjs, /require\(["']react["']\)/, 'CJS entry must require "react" externally');

  // No emitted chunk may carry React's own runtime.
  const reactRuntime = /__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE|react-stack-bottom-frame/;
  const files = fs
    .readdirSync(libDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.(js|cjs)$/.test(file));
  for (const file of files) {
    const source = fs.readFileSync(new URL(`../lib/${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, reactRuntime, `${file} bundles React itself`);
  }
});
