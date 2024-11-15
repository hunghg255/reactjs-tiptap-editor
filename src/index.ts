/* eslint-disable import/first */
export * from '@/extensions'

export { default } from '@/components/RichTextEditor'

import locale, { en, hu_HU, pt_BR, vi, zh_CN } from './locales'
import { useEditorState } from '@/hooks/useEditorState'

export { locale, en, hu_HU, vi, zh_CN, pt_BR }

export type { UseEditorStateReturn } from '@/hooks/useEditorState'
export { useEditorState }
export type { Editor, UseEditorOptions } from '@tiptap/react'
export { BubbleMenu } from '@tiptap/react'
