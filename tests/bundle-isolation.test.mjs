import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { build } from 'vite';

test('all bubble entry points expose matching ESM/CJS exports and declarations', async () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
  const entries = Object.entries(pkg.exports).filter(([path]) => path.startsWith('./bubble/'));
  // Keep the two module formats in separate processes (Yjs rejects dual imports).
  const cjsExports = JSON.parse(
    execFileSync(
      process.execPath,
      [
        '-e',
        `
    const requirePackage = require('node:module').createRequire(process.argv[2]);
    console.log(JSON.stringify(Object.fromEntries(JSON.parse(process.argv[1]).map(path =>
      [path, Object.keys(requirePackage('reactjs-tiptap-editor/' + path.slice(2))).sort()]))));
  `,
        JSON.stringify(entries.map(([path]) => path)),
        fileURLToPath(new URL('../package.json', import.meta.url)),
      ],
      { encoding: 'utf8' }
    )
  );
  for (const [path, entry] of entries) {
    const specifier = `reactjs-tiptap-editor/${path.slice(2)}`;
    const esm = await import(specifier);
    assert.ok(Object.keys(esm).length);
    assert.deepEqual(Object.keys(esm).sort(), cjsExports[path]);
    assert.ok(fs.existsSync(new URL(`../${entry.import.types}`, import.meta.url)));
  }
});

// Run after build:lib. Test the published package paths, not source aliases.
for (const entry of ['bubble', 'bubble/text']) {
  test(`${entry}: a text-only bubble does not retain KaTeX or collaboration`, async () => {
    const result = await build({
      configFile: false,
      logLevel: 'error',
      build: { write: false, rollupOptions: { input: 'virtual:isolation' } },
      plugins: [
        {
          name: 'isolation-fixture',
          resolveId(id) {
            if (id === 'virtual:isolation') return '\0virtual:isolation';
          },
          load(id) {
            if (id === '\0virtual:isolation')
              return `import { RichTextBubbleText } from 'reactjs-tiptap-editor/${entry}'; window.bubble = RichTextBubbleText;`;
          },
        },
      ],
    });
    const chunks = result.output.filter((item) => item.type === 'chunk');
    const byName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
    const initial = new Set();
    function visit(file) {
      if (initial.has(file) || !byName.has(file)) return;
      initial.add(file);
      byName.get(file).imports.forEach(visit);
    }
    chunks.filter((chunk) => chunk.isEntry).forEach((chunk) => visit(chunk.fileName));
    const modules = chunks
      .filter((chunk) => initial.has(chunk.fileName))
      .flatMap((chunk) => Object.keys(chunk.modules));
    for (const dependency of [
      'katex',
      'yjs',
      '@tiptap/y-tiptap',
      '@tiptap/extension-drag-handle',
    ]) {
      assert.equal(
        modules.some((id) => id.includes(`/node_modules/${dependency}/`)),
        false,
        `Unexpected eager dependency: ${dependency}`
      );
    }
  });
}
