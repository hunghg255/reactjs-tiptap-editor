import type { Editor, Range } from '@tiptap/core';

export interface CommandList {
  name: string
  title: string
  commands: Command[]
}

export interface Command {
  name: string
  label: string
  description?: string
  aliases?: string[]
  iconName?: any
  iconUrl?: string
  action: ({ editor, range }: { editor: Editor, range: Range }) => void
  shouldBeHidden?: (editor: Editor) => boolean
  isActive?: (editor: Editor) => boolean
}
