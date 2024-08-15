import * as path from 'node:path';
import fs from 'node:fs';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react(),
      dts({
        rollupTypes: true,
        afterBuild: (emittedFiles) => {
          emittedFiles.forEach((content, filePath) => {
            if (filePath.endsWith('.d.ts')) {
              const newFilePath = filePath.replace('.d.ts', '.d.cts');
              fs.writeFileSync(newFilePath, content);
            }
          });
        },
      }),
    ],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
    build: {
      minify: 'esbuild',
      outDir: 'lib',
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
        external: ['react', 'react-dom', 'react/jsx-runtime'],
      },
    },
  };
});
