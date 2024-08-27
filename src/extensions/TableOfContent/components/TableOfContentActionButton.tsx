import React, { useCallback } from 'react'

import type { Editor } from '@tiptap/core'
import { ActionButton } from '@/components/ActionButton'
import { TableOfContents } from '@/extensions/TableOfContent/TableOfContent'
import { useActive } from '@/hooks/useActive'

export function TableOfContentActionButton({ editor, icon, tooltip }: { editor: Editor, tooltip: string, icon: string }) {
  const isTaskListActive = useActive(editor, TableOfContents.name)

  const tableOfContent = useCallback(() => {
    if (isTaskListActive) {
      editor.chain().focus().removeTableOfContents().run()
      return
    }
    editor.chain().focus().setTableOfContents().run()
  }, [editor, isTaskListActive])

  return (
    <ActionButton
      action={tableOfContent}
      isActive={() => isTaskListActive || false}
      icon={icon}
      tooltip={tooltip}
    />
  )
}
