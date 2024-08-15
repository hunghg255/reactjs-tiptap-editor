import antfu from '@antfu/eslint-config'

export default antfu({
  jsonc: false,
  yaml: false,
  react: true,
  toml: false,
  rules: {
    'node/prefer-global/process': 'off',
    'ts/ban-ts-comment': 'warn',
  },
})
