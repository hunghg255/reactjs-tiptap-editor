import * as path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production'
  const isAnalyze = mode === 'analyze'

  return {
    plugins: [
      react(),
      EnvironmentPlugin('all'),
      //  resolve({ "react-codemirror2": `
      //       const UnControlled = {};
      //       export {
      //         UnControlled,
      //       }`
      //   }
      checker({
        typescript: true,
      }),
      // lightningcss({
      //   browserslist: '>= 0.25%',
      // }),
    ],
    optimizeDeps: {
      include: ['react'],
    },
    css: {
      devSourcemap: isDev,
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
      sourcemap: isAnalyze,
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    esbuild: {
      sourcemap: isDev,
    },
  }
})
