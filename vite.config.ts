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
        },
      },
    },
    build: {
      cssMinify: 'esbuild',
      minify: 'esbuild',
      outDir: 'lib',
      sourcemap: isDev,
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@radix-ui')) {
              return 'radix'
            }
            if (id.includes('@tiptap')) {
              return 'tiptap'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            if (id.includes('src/components')) {
              return 'components'
            }
            if (id.includes('src/extensions')) {
              return 'extensions'
            }
            if (id.includes('src/utils')) {
              return 'utils'
            }
            if (id.includes('src/locales')) {
              return 'utils'
            }
            if (id.includes('src/locales')) {
              return 'locales'
            }
          },
        },
        external: ['react', 'react-dom', 'react/jsx-runtime', 'katex', 'shiki', 'docx'],
      },
    },
  }
})
