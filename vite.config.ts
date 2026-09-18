import * as path from 'node:path';

import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { globbySync } from 'globby';
import postcssReplace from 'postcss-replace';
import { esmExternalRequirePlugin } from 'rolldown/plugins';
import tailwind from 'tailwindcss';
import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

const rootDir = import.meta.dirname;

// React is externalized through esmExternalRequirePlugin (see rolldownOptions.plugins) so that
// bundled CommonJS deps (e.g. use-sync-external-store) get `import` instead of a runtime `require`.
const reactExternal = /^react(-dom)?(\/|$)/;

const externalPackages = [
  'katex',
  'docx',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-icons',
  '@radix-ui/react-label',
  '@radix-ui/react-popover',
  '@radix-ui/react-separator',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-toast',
  '@radix-ui/react-toggle',
  '@radix-ui/react-tooltip',
  '@radix-ui/react-select',
  '@radix-ui/react-checkbox',
  'react-colorful',
  'scroll-into-view-if-needed',
  'lucide-react',
  'prosemirror-docx',
  're-resizable',
  '@excalidraw/excalidraw',
  '@radix-ui/react-dialog',
  'react-image-crop',
  'mermaid',
  'easydrawer',
  'frimousse',
  'mammoth',
];

const normalizePath = (id: string) => id.replaceAll('\\', '/');

const editorUtilsModules = new Set(
  ['src/hooks/useAttributes.tsx', 'src/utils/json.ts'].map((file) =>
    normalizePath(path.resolve(rootDir, file))
  )
);

export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';

  const entry = [
    path.resolve(rootDir, 'src/index.ts'),
    path.resolve(rootDir, 'src/locale-bundle.ts'),
    path.resolve(rootDir, 'src/locale.ts'),
    ...globbySync('src/locales/*.ts', { cwd: rootDir, ignore: ['**/index.ts'] })
      .sort()
      .map((file) => path.resolve(rootDir, file)),
    path.resolve(rootDir, 'src/bubble.ts'),
    path.resolve(rootDir, 'src/theme/theme.ts'),
  ];

  const extensionEntries = globbySync('src/extensions/*/*.ts', {
    cwd: rootDir,
    ignore: ['**/index.ts', '**/*.spec.ts', '**/*.test.ts'],
  })
    .filter((file) => path.basename(file, '.ts') === path.basename(path.dirname(file)))
    .sort();

  entry.push(...extensionEntries.map((file) => path.resolve(rootDir, file)));
  entry.push(
    ...globbySync('src/components/Bubble/RichText*.tsx', { cwd: rootDir })
      .sort()
      .map((file) => path.resolve(rootDir, file))
  );

  return {
    plugins: [react(), dts()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(rootDir, 'src') }],
    },
    css: {
      postcss: {
        plugins: [
          tailwind(),
          autoprefixer(),
          postcssReplace({
            pattern: /(--tw|\*, ::before, ::after)/g,
            data: {
              '--tw': '--richtext', // Prefixing
              '*, ::before, ::after': ':root', // So variables does not pollute every element
            },
          }),
        ],
      },
      preprocessorOptions: {
        scss: {
          charset: false,
          api: 'modern-compiler', // or 'modern'
        },
      },
    },
    build: {
      cssMinify: isDev ? false : 'lightningcss',
      minify: isDev ? false : 'oxc',
      outDir: 'lib',
      sourcemap: isDev,
      lib: {
        entry,
        cssFileName: 'style',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          if (format === 'es') return `${entryName}.js`;

          return `${entryName}.cjs`;
        },
      },
      rolldownOptions: {
        plugins: [esmExternalRequirePlugin({ external: [reactExternal] })],
        output: {
          // Keep generic helpers out of feature chunks with heavy external imports.
          codeSplitting: {
            groups: [
              {
                name: 'editor-utils',
                test: (id) => editorUtilsModules.has(normalizePath(id)),
              },
            ],
          },
        },
        // Keep Tiptap and React shared with the consuming application.
        external: (id) =>
          id.startsWith('@tiptap/') ||
          externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
      },
    },
  };
});
