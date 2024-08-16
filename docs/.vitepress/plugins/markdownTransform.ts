import type { Plugin } from 'vite'

export function replacer(
  code: string,
  value: string,
  key: string,
  insert: 'head' | 'tail' | 'none' = 'none',
) {
  const START = `<!--${key}_STARTS-->`
  const END = `<!--${key}_ENDS-->`
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, 'im')

  const target = value ? `${START}\n\n${value.trim()}\n\n${END}` : `${START}${END}`

  if (!code.match(regex)) {
    if (insert === 'none')
      return code
    else if (insert === 'head')
      return `${target}\n\n${code}`
    else return `${code}\n\n${target}`
  }

  return code.replace(regex, target)
}

export function MarkdownTransform(): Plugin {
  return {
    name: 'reactjs-tiptap-editor-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null

      const [pkg, _name, i] = id.split('/').slice(-3)

      if (pkg !== 'extensions')
        return code

      const source = await getFunctionMarkdown(_name, i)

      code = replacer(code, source, 'FOOTER', 'tail')

      code = code.replace(/(# \w+)\n/, `$1\n\n<FunctionInfo pkgName="${i.replace('.md', '')}"/>\n`)

      return code
    },
  }
}

const GITHUB_BLOB_URL
  = 'https://github.com/hunghg255/reactjs-tiptap-editor/blob/master/src/extensions'
const GITHUB_BLOB_DOCS_URL
  = 'https://github.com/hunghg255/reactjs-tiptap-editor/blob/master/docs/extensions'

export async function getFunctionMarkdown(pkg: string, name: string) {
  const URL = pkg === 'BaseKit' ? `${GITHUB_BLOB_URL}/${pkg}.ts` : `${GITHUB_BLOB_URL}/${pkg}/${pkg}.ts`
  const URL_DOCS = `${GITHUB_BLOB_DOCS_URL}/${pkg}/${name}`

  const links = [
    ['Source', URL],
    ['Docs', URL_DOCS],
  ]
    .filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`)
    .join(' • ')

  const sourceSection = `## Source\n\n${links}\n`
  const ContributorsSection = `
## Contributors

<Contributors fn="${pkg}.ts" />
  `
  const changelogSection = `
## Changelog

<Changelog fn="${pkg}.ts" />
`
  const footer = `\n${sourceSection}\n${ContributorsSection}\n${changelogSection}\n`

  return footer
}
