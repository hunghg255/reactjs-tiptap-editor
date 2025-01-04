import * as path from 'node:path'
import fs from 'node:fs'
import { cwd } from 'node:process'
import { build } from 'vite'

import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssReplace from 'postcss-replace'

const imports = [
  {
    entry: 'src/index.ts',
    fileName: 'index',
  },
  {
    entry: 'src/bundle-full.ts',
    fileName: 'bundle-full',
  },
]

const __dirname = cwd()

imports.forEach(async ({ entry, fileName }) => {
  const plugins: any = [react(), dts({
    rollupTypes: true,
    afterBuild: (emittedFiles) => {
      emittedFiles.forEach((content, filePath) => {
        if (filePath.endsWith('.d.ts')) {
          const newFilePath = filePath.replace('.d.ts', '.d.cts')

          fs.writeFileSync(newFilePath, content)
        }
      })
    },
  })]

  const entryBase = entry === 'src/index.ts'

  await build({
    configFile: false,
    plugins,
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
      lib: {
        entry: path.resolve(__dirname, entry),
        formats: ['es', 'cjs'],
        fileName,
      },
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, entry),
        },
        output: entryBase
          ? {
              manualChunks(id) {
                if (id.includes('@tiptap')) {
                  return 'tiptap'
                }
                if (id.includes('node_modules')) {
                  return 'vendor'
                }
                if (id.includes('src/utils')) {
                  return 'utils'
                }
                if (id.includes('src/locales')) {
                  return 'locales'
                }
              },
            }
          : {},
        external: entryBase ? ['react', 'react-dom', 'react/jsx-runtime', 'katex', 'shiki', 'docx', '@radix-ui/react-dropdown-menu', '@radix-ui/react-icons', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle', '@radix-ui/react-tooltip', '@radix-ui/react-select', '@radix-ui/react-checkbox', 'react-colorful', 'scroll-into-view-if-needed', 'tippy.js', 'lucide-react', 'prosemirror-docx', 're-resizable', '@excalidraw/excalidraw', '@radix-ui/react-dialog', 'react-image-crop', 'mermaid', 'react-tweet'] : ['react', 'react-dom', 'react/jsx-runtime', 'katex', 'shiki', '@radix-ui/react-dropdown-menu', '@radix-ui/react-icons', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle', '@radix-ui/react-tooltip', '@radix-ui/react-select', '@radix-ui/react-checkbox', 'react-colorful', 'scroll-into-view-if-needed', 'tippy.js', 'lucide-react', 're-resizable', '@excalidraw/excalidraw', '@radix-ui/react-dialog', 'react-image-crop', 'mermaid', 'react-tweet'],
      },
    },
  })
})
