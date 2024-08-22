import { useMemo } from 'react'

import { NodeViewWrapper } from '@tiptap/react'

import katex from 'katex'
import { useTheme } from '@/theme/theme'
import { convertColorToRGBA } from '@/utils/color'

export function KatexWrapper({ node }: any) {
  const theme = useTheme()
  const { text } = node.attrs

  const backgroundColor = useMemo(() => {
    const color = `rgb(254, 242, 237)`
    if (theme === 'dark')
      return convertColorToRGBA(color, 0.75)
    return color
  }, [theme])

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${text}`)
    }
    catch {
      return text
    }
  }, [text])

  const content = useMemo(
    () =>
      text.trim()
        ? (
            <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText }}></span>
          )
        : (
            <span contentEditable={false}>Not enter a formula</span>
          ),
    [text, formatText],
  )

  return (
    <NodeViewWrapper
      className="render-wrapper"
      style={{
        backgroundColor,
      }}
    >
      <div className="richtext-flex richtext-px-[4px] richtext-py-4 richtext-text-[1em] richtext-text-[#000] richtext-cursor-pointer richtext-justify-center">{content}</div>
    </NodeViewWrapper>
  )
}
