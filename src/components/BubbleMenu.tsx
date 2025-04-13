import type { Editor } from '@tiptap/core';

import { BubbleMenuImage, BubbleMenuImageGif, BubbleMenuLink, BubbleMenuText, BubbleMenuVideo, ColumnsBubbleMenu, ContentMenu, TableBubbleMenu } from '@/components';
import { BubbleMenuDrawer } from '@/components/menus/components/BubbleMenuDrawer';
import { BubbleMenuExcalidraw } from '@/components/menus/components/BubbleMenuExcalidraw';
import { BubbleMenuIframe } from '@/components/menus/components/BubbleMenuIframe';
import BubbleMenuKatex from '@/components/menus/components/BubbleMenuKatex';
import { BubbleMenuMermaid } from '@/components/menus/components/BubbleMenuMermaid';
import { BubbleMenuTwitter } from '@/components/menus/components/BubbleMenuTwitter';
import { Image, ImageGif } from '@/extensions';
import type { BubbleMenuProps as BubbleMenuPropsType } from '@/types';

export interface BubbleMenuComponentProps {
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
  const extensionsNames = editor.extensionManager.extensions.map(ext => ext.name);

  const renderMenuItems = () => [
    extensionsNames.includes('columns') && !bubbleMenu?.columnConfig?.hidden ? <ColumnsBubbleMenu editor={editor}
      key="columns"
    /> : null,
    extensionsNames.includes('table') && !bubbleMenu?.tableConfig?.hidden ? <TableBubbleMenu editor={editor} actions={bubbleMenu?.tableConfig?.actions}
      key="table"
    /> : null,
    extensionsNames.includes('link') && !bubbleMenu?.linkConfig?.hidden ? <BubbleMenuLink disabled={disabled}
      editor={editor}
      key="link"
    /> : null,
    extensionsNames.includes(Image.name) && !bubbleMenu?.imageConfig?.hidden ? <BubbleMenuImage disabled={disabled}
      editor={editor}
      key="image"
    /> : null,
    extensionsNames.includes(ImageGif.name) && !bubbleMenu?.imageGifConfig?.hidden ? <BubbleMenuImageGif disabled={disabled}
      editor={editor}
      key="imageGif"
    /> : null,
    extensionsNames.includes('video') && !bubbleMenu?.videoConfig?.hidden ? <BubbleMenuVideo disabled={disabled}
      editor={editor}
      key="video"
    /> : null,
    extensionsNames.includes('katex') && !bubbleMenu?.katexConfig?.hidden ? <BubbleMenuKatex disabled={disabled}
      editor={editor}
      key="katex"
    /> : null,
    extensionsNames.includes('excalidraw') && !bubbleMenu?.excalidrawConfig?.hidden ? <BubbleMenuExcalidraw disabled={disabled}
      editor={editor}
      key="excalidraw"
    /> : null,
    extensionsNames.includes('mermaid') && !bubbleMenu?.mermaidConfig?.hidden ? <BubbleMenuMermaid disabled={disabled}
      editor={editor}
      key="mermaid"
    /> : null,
    extensionsNames.includes('iframe') && !bubbleMenu?.iframeConfig?.hidden ? <BubbleMenuIframe disabled={disabled}
      editor={editor}
      key="iframe"
    /> : null,
    extensionsNames.includes('twitter') && !bubbleMenu?.twitterConfig?.hidden ? <BubbleMenuTwitter disabled={disabled}
      editor={editor}
      key="twitter"
    /> : null,
    !bubbleMenu?.floatingMenuConfig?.hidden ? <ContentMenu disabled={disabled}
      editor={editor}
      key="content"
    /> : null,
    !bubbleMenu?.textConfig?.hidden ? <BubbleMenuText disabled={disabled}
      editor={editor}
      key="text"
    /> : null,
    extensionsNames.includes('drawer') && !bubbleMenu?.drawerConfig?.hidden ? <BubbleMenuDrawer disabled={disabled}
      editor={editor}
      key="drawer"
    /> : null,
  ];

  if (bubbleMenu?.render) {
    return bubbleMenu.render({ editor, disabled: disabled || false, bubbleMenu }, renderMenuItems());
  }

  return renderMenuItems().filter(Boolean);
}
