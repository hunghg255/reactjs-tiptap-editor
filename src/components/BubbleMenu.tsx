import React from 'react';

import type { Editor } from '@tiptap/core';

import { BubbleMenuImage, BubbleMenuImageGif, BubbleMenuLink, BubbleMenuText, BubbleMenuVideo, ColumnsBubbleMenu, ContentMenu, TableBubbleMenu } from '@/components/menus';
import { BubbleMenuIframe } from '@/components/menus/components/BubbleMenuIframe';
import { Image, } from '@/extensions/Image';
import { ImageGif } from '@/extensions/ImageGif';
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
    extensionsNames.includes('table') && !bubbleMenu?.tableConfig?.hidden ? <TableBubbleMenu actions={bubbleMenu?.tableConfig?.actions}
      editor={editor}
      key="table"
      hiddenActions={bubbleMenu?.tableConfig?.hiddenActions}
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

    extensionsNames.includes('iframe') && !bubbleMenu?.iframeConfig?.hidden ? <BubbleMenuIframe disabled={disabled}
      editor={editor}
      key="iframe"
    /> : null,

    !bubbleMenu?.floatingMenuConfig?.hidden ? <ContentMenu disabled={disabled}
      editor={editor}
      key="content"
    /> : null,
    !bubbleMenu?.textConfig?.hidden ? <BubbleMenuText disabled={disabled}
      editor={editor}
      key="text"
    /> : null,
  ];

  if (bubbleMenu?.render) {
    return bubbleMenu.render({ editor, disabled: disabled || false, extensionsNames, bubbleMenu }, renderMenuItems());
  }

  return renderMenuItems().filter(Boolean);
}
