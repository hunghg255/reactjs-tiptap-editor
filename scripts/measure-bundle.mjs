import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import { build } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const label = process.argv[2] || 'current';
if (!/^[a-z0-9-]+$/.test(label))
  throw new Error('Use a lowercase label with letters, digits or hyphens.');

function measure(output) {
  const chunks = output.filter((item) => item.type === 'chunk');
  const byName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
  const initial = new Set();
  function visit(name) {
    if (initial.has(name) || !byName.has(name)) return;
    initial.add(name);
    byName.get(name).imports.forEach(visit);
  }
  chunks.filter((chunk) => chunk.isEntry).forEach((chunk) => visit(chunk.fileName));
  function sum(items) {
    return items.reduce(
      (total, item) => {
        const data = item.type === 'chunk' ? item.code : item.source;
        total.bytes += Buffer.byteLength(data);
        total.gzip += gzipSync(data).length;
        return total;
      },
      { bytes: 0, gzip: 0 }
    );
  }
  const packages = {};
  for (const name of initial) {
    for (const [id, module] of Object.entries(byName.get(name).modules)) {
      const dependency = id.split('/node_modules/').at(-1);
      const key = id.includes('/node_modules/')
        ? dependency
            .split('/')
            .slice(0, dependency.startsWith('@') ? 2 : 1)
            .join('/')
        : id.includes('/lib/')
          ? 'editor library'
          : 'application';
      packages[key] = (packages[key] || 0) + module.renderedLength;
    }
  }
  return {
    initialJS: sum(chunks.filter((chunk) => initial.has(chunk.fileName))),
    totalJS: sum(chunks),
    css: sum(output.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'))),
    // Rollup renderedLength is BEFORE final minification; do not present it as transfer size.
    initialPackagesBeforeMinification: Object.fromEntries(
      Object.entries(packages).sort((a, b) => b[1] - a[1])
    ),
    chunks: chunks.map((chunk) => ({
      file: chunk.fileName,
      initial: initial.has(chunk.fileName),
      ...sum([chunk]),
    })),
  };
}

await build({ root, configFile: path.join(root, 'vite.config.ts'), logLevel: 'warn' });
const playground = await build({
  root: path.join(root, 'playground'),
  configFile: path.join(root, 'playground/vite.config.ts'),
  logLevel: 'warn',
  build: { write: false },
});
const minimal = {};
for (const fixture of ['tiptapOnly', 'withProvider', 'withTextBubble']) {
  const provider = fixture !== 'tiptapOnly';
  const result = await build({
    root,
    configFile: false,
    logLevel: 'warn',
    build: { write: false, minify: 'esbuild', rollupOptions: { input: 'virtual:bundle-audit' } },
    plugins: [
      {
        name: 'bundle-audit-fixture',
        resolveId(id) {
          if (id === 'virtual:bundle-audit') return '\0virtual:bundle-audit';
        },
        load(id) {
          if (id !== '\0virtual:bundle-audit') return;
          return `import { EditorContent, useEditor } from ${JSON.stringify(path.join(root, 'node_modules/@tiptap/react/dist/index.js'))};
          ${provider ? `import { RichTextProvider } from ${JSON.stringify(path.join(root, 'lib/index.js'))};` : ''}
          ${fixture === 'withTextBubble' ? `import { RichTextBubbleText } from ${JSON.stringify(path.join(root, 'lib/bubble.js'))};` : ''}
          window.bundleAudit = { ${fixture === 'withTextBubble' ? 'RichTextBubbleText,' : ''} EditorContent, useEditor${provider ? ', RichTextProvider' : ''} };`;
        },
      },
    ],
  });
  minimal[fixture] = measure(result.output);
}
const lib = await fs.readdir(path.join(root, 'lib'));
const localeFixtures = {};
if (lib.includes('locale.js')) {
  for (const full of [false, true]) {
    const result = await build({
      root,
      configFile: false,
      logLevel: 'warn',
      build: { write: false, rollupOptions: { input: 'virtual:locale-audit' } },
      plugins: [
        {
          name: 'locale-audit-fixture',
          resolveId(id) {
            if (id === 'virtual:locale-audit') return '\0virtual:locale-audit';
          },
          load(id) {
            if (id !== '\0virtual:locale-audit') return;
            return `import { localeActions, useLocale } from 'reactjs-tiptap-editor/${full ? 'locale-bundle' : 'locale'}';
            ${full ? '' : "import vi from 'reactjs-tiptap-editor/locales/vi'; localeActions.setMessage('vi', vi);"}
            localeActions.setLang('vi'); window.localeAudit = { localeActions, useLocale };`;
          },
        },
      ],
    });
    localeFixtures[full ? 'allLanguages' : 'englishAndVietnamese'] = measure(result.output);
  }
}
const library = {};
for (const extension of ['js', 'cjs', 'css']) {
  const output = await Promise.all(
    lib
      .filter((file) => file.endsWith(`.${extension}`))
      .map(async (file) => ({
        type: 'asset',
        fileName: file,
        source: await fs.readFile(path.join(root, 'lib', file)),
      }))
  );
  library[extension] = output.reduce(
    (total, item) => ({
      bytes: total.bytes + item.source.length,
      gzip: total.gzip + gzipSync(item.source).length,
    }),
    { bytes: 0, gzip: 0 }
  );
}
const report = {
  label,
  measuredAt: new Date().toISOString(),
  node: process.version,
  methodology:
    'Production Vite build; decimal bytes; gzip summed per file; initial JS follows static imports only. Minimal fixtures retain EditorContent/useEditor with and without RichTextProvider; no editor extensions or CSS.',
  library,
  playground: measure(playground.output),
  minimal,
  localeFixtures,
};
const directory = path.join(root, 'reports/bundle-size');
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, `${label}.json`), `${JSON.stringify(report, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      label,
      library,
      playground: report.playground.initialJS,
      minimal: minimal.withProvider.initialJS,
    },
    null,
    2
  )
);
