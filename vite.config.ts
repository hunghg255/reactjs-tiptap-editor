import * as path from 'node:path'
import fs from 'node:fs'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'unplugin-dts/vite'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssReplace from 'postcss-replace'
import { globbySync } from 'globby'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const isDev = mode !== 'production';

  const entry = [
    path.resolve(__dirname, 'src/index.ts'),
    path.resolve(__dirname, 'src/locale-bundle.ts'),
    path.resolve(__dirname, 'src/bubble.ts'),
    path.resolve(__dirname, 'src/theme/theme.ts'),
  ]

  const files = await globbySync('src/extensions/**/*.ts', {
    ignore: ['src/**/*/index.ts', 'src/**/*.spec.ts'], // Exclude .spec.ts files
  });

  const exports = {};
  const typeVersions = {};

  files.forEach((v: any) => {
    const vv = v.replace('src/', '')
    const [, _name, i] = vv.split('/')

    if (_name) {
      entry.push(path.resolve(__dirname, `src/extensions/${_name}/${_name}.ts`))

      exports[`./${_name.toLowerCase()}`] = {
        require: {
          types: `./lib/extensions/${_name}/index.d.ts`,
          default: `./lib/${_name}.cjs`,
        },
        import: {
          types: `./lib/extensions/${_name}/index.d.ts`,
          default: `./lib/${_name}.js`,
        },
      }
      typeVersions[`./${_name.toLowerCase()}`] = [
        `./lib/extensions/${_name}/index.d.ts`,
      ]
    }
  });

  // const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  // packageJson.exports = {
  //   ...packageJson.exports,
  //   ...exports,
  // }
  // packageJson.typesVersions = {
  //   "*": {
  //     ...packageJson.typesVersions["*"],
  //     ...typeVersions,
  //   }
  // }
  // fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

  return {
    plugins: [
      react(),
      dts(),
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
        entry,
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
        },
        external: ['@tiptap/pm/model',
        '@tiptap/pm/state',
        '@tiptap/pm/view','react', 'react-dom', 'react/jsx-runtime', 'katex', 'docx', '@radix-ui/react-dropdown-menu', '@radix-ui/react-icons', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle', '@radix-ui/react-tooltip', '@radix-ui/react-select', '@radix-ui/react-checkbox', 'react-colorful', 'scroll-into-view-if-needed', 'lucide-react', 'prosemirror-docx', 're-resizable', '@excalidraw/excalidraw', '@radix-ui/react-dialog', 'react-image-crop', 'mermaid', 'easydrawer', 'frimousse'],
      },
    },
  }
})
