import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { globbySync } from 'globby'

async function genDocsNavExtension() {
  try {
   const files = await globbySync('docs/extensions/**/*.md');

    const navItems = files.map((file) => {
      const parts = file.split('/');
      const name = parts[2]; // Get the extension name from the path
      return {
        text: name,
        link: `/extensions/${name}/index.md`,
      };
    });
  }
  catch {
    console.error('Failed to modify CSS!')
  }
}

genDocsNavExtension()
