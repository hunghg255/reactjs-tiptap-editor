import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'

function modifyPrefixVariableCss() {
  try {
    const css = fs.readFileSync(path.resolve(cwd(), 'lib/style.css'), 'utf-8')

    const cssMatch = ['background', 'foreground', 'muted', 'muted-foreground', 'popover', 'popover-foreground', 'card', 'card-foreground', 'border', 'input', 'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'ring', 'radius']

    let newCss = css
    for (const match of cssMatch) {
      const reg = new RegExp(`--${match}`, 'g')

      newCss = newCss.replace(reg, `--richtext-${match}`)
    }

    fs.writeFileSync(path.resolve(cwd(), 'lib/style.css'), newCss)
    console.log('CSS modified successfully!')
  }
  catch {
    console.error('Failed to modify CSS!')
  }
}

modifyPrefixVariableCss()
