import type { Editor } from '@tiptap/core'

import { BubbleMenuImage, BubbleMenuLink, BubbleMenuText, BubbleMenuVideo, ContentMenu, TableBubbleMenu } from '@/components'
import ColumnsMenu from '@/extensions/MultiColumn/menus/ColumnsMenu'
import type { BubbleMenuProps as BubbleMenuPropsType } from '@/types'

interface BubbleMenuComponentProps {
  editor: Editor
  disabled?: boolean
  bubbleMenu?: BubbleMenuPropsType
}

/**
 * Bubble Menu Component
 *
 * @param editor Editor instance
 * @param disabled Whether the menu is disabled
 * @param bubbleMenu Bubble menu configuration
 * @returns Bubble menu component
 */
export function BubbleMenu({ editor, disabled, bubbleMenu }: BubbleMenuComponentProps) {
  const extensionsNames = editor.extensionManager.extensions.map(ext => ext.name)

  const renderMenuItems = () => [
    extensionsNames.includes('columns') && !bubbleMenu?.columnConfig?.hidden ? <ColumnsMenu key="columns" editor={editor} /> : null,
    extensionsNames.includes('table') && !bubbleMenu?.tableConfig?.hidden ? <TableBubbleMenu key="table" editor={editor} /> : null,
    extensionsNames.includes('link') && !bubbleMenu?.linkConfig?.hidden ? <BubbleMenuLink key="link" editor={editor} disabled={disabled} /> : null,
    extensionsNames.includes('image') && !bubbleMenu?.imageConfig?.hidden ? <BubbleMenuImage key="image" editor={editor} disabled={disabled} /> : null,
    extensionsNames.includes('video') && !bubbleMenu?.videoConfig?.hidden ? <BubbleMenuVideo key="video" editor={editor} disabled={disabled} /> : null,
    !bubbleMenu?.contentConfig?.hidden ? <ContentMenu key="content" editor={editor} disabled={disabled} /> : null,
    !bubbleMenu?.textConfig?.hidden ? <BubbleMenuText key="text" editor={editor} disabled={disabled} /> : null,
  ]

  if (bubbleMenu?.render) {
    return bubbleMenu.render({ editor, disabled: disabled || false, bubbleMenu }, renderMenuItems())
  }

  return renderMenuItems().filter(Boolean)
}
