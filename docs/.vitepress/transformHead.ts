import type { HeadConfig, TransformContext } from 'vitepress'

export async function transformHead({ pageData }: TransformContext) {
  const head: HeadConfig[] = []

  if (pageData.relativePath === 'index.md') {
    head.push(
      [
        'meta',
        { property: 'og:image', content: 'https://reactjs-tiptap-editor.vercel.app/og.png' },
      ],
      [
        'meta',
        { property: 'twitter:image', content: 'https://reactjs-tiptap-editor.vercel.app/og.png' },
      ],
    )
    return head
  }

  head.push(
    ['meta', { property: 'og:image', content: 'https://reactjs-tiptap-editor.vercel.app/og.png' }],
    [
      'meta',
      { property: 'twitter:image', content: 'https://reactjs-tiptap-editor.vercel.app/og.png' },
    ],
  )

  return head
}
