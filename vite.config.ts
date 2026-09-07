import * as path from 'node:path';

import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { globbySync } from 'globby';
import postcssReplace from 'postcss-replace';
import tailwind from 'tailwindcss';
import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

const externalPackages = [
  'react',
  'react-dom',
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

export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';

  const entry = [
    path.resolve(__dirname, 'src/index.ts'),
    path.resolve(__dirname, 'src/locale-bundle.ts'),
    path.resolve(__dirname, 'src/bubble.ts'),
    path.resolve(__dirname, 'src/theme/theme.ts'),
  ];

  const extensionEntries = globbySync('src/extensions/*/*.ts', {
    cwd: __dirname,
    ignore: ['**/index.ts', '**/*.spec.ts', '**/*.test.ts'],
  })
    .filter((file) => path.basename(file, '.ts') === path.basename(path.dirname(file)))
    .sort();

  entry.push(...extensionEntries.map((file) => path.resolve(__dirname, file)));

  return {
    plugins: [react(), dts()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
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
      cssMinify: isDev ? false : 'esbuild',
      minify: isDev ? false : 'esbuild',
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
      rollupOptions: {
        // Keep Tiptap and React shared with the consuming application.
        external: (id) =>
          id.startsWith('@tiptap/') ||
          externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
      },
    },
  };
});
