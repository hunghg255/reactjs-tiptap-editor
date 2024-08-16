import fs from 'node:fs'
import { globby } from 'globby';

(async () => {
  const files = await globby('src/extensions/**/*.ts', {
    ignore: ['src/**/*/index.ts', 'src/**/*.spec.ts'], // Exclude .spec.ts files
  })

  const newFile = files.map((v: any) => {
    const vv = v.replace('src/', '')
    const [, _name, i] = vv.split('/')

    return {
      name: _name === 'BaseKit.ts' ? 'BaseKit.ts' : `${_name}.ts`,
      package: _name,
      alias: i ? [i.replace('.ts', '')] : _name === 'BaseKit.ts' ? ['BaseKit'] : [],
    }
  })

  fs.writeFileSync('./scripts/extensions.json', JSON.stringify(newFile, null, 2))
})()
