import * as path from 'node:path'
import fs from 'node:fs'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssReplace from 'postcss-replace'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production'

  return {
    plugins: [
      react(),
      dts({
        rollupTypes: true,
        afterBuild: (emittedFiles) => {
          emittedFiles.forEach((content, filePath) => {
            if (filePath.endsWith('.d.ts')) {
              const newFilePath = filePath.replace('.d.ts', '.d.cts')
              fs.writeFileSync(newFilePath, content)
            }
          })
        },
      }),
    ],
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
      cssMinify: 'esbuild',
      minify: 'esbuild',
      outDir: 'lib',
      sourcemap: isDev,
      lib: {
        entry: [
          path.resolve(__dirname, 'src/index.ts'),
          path.resolve(__dirname, 'src/extension-bundle.ts'),
          path.resolve(__dirname, 'src/locale-bundle.ts')
        ],
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          if (format === 'es') return `${entryName}.js`;

          return `${entryName}.cjs`;
        },
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name == "reactjs-tiptap-editor.css") return "style.css";
            return assetInfo.name;
          },
          manualChunks(id) {
            if (id.includes('@tiptap')) {
              return 'tiptap'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
        external: ['react', 'react-dom', 'react/jsx-runtime', 'katex', 'shiki', 'docx', '@radix-ui/react-dropdown-menu', '@radix-ui/react-icons', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle', '@radix-ui/react-tooltip', '@radix-ui/react-select', '@radix-ui/react-checkbox', 'react-colorful', 'scroll-into-view-if-needed', 'tippy.js', 'lucide-react', 'prosemirror-docx', 're-resizable', '@excalidraw/excalidraw', '@radix-ui/react-dialog', 'react-image-crop', 'mermaid', 'easydrawer', 'frimousse'],
      },
    },
  }
})
