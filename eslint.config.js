import { basic, react } from '@hunghg255/eslint-config';
import tailwind from 'eslint-plugin-tailwindcss';

export default [
  ...basic(),
  ...react(),
  ...tailwind.configs['flat/recommended'],
  {
    rules: {
      indent: 'off',
      "@typescript-eslint/unbound-method": "off",
      quotes: ["error", "single"]
    },
  },
  {
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      'contributorkit.config.ts',
      'tailwind.config.js',
      'postcss.config.js',
      'animate.js',
      'playground/**'
    ],
  },
];
