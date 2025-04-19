import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';

import { DEFAULT_LINE_HEIGHT, DEFAULT_LINE_HEIGHT_LIST } from '@/constants';
import LineHeightDropdown from '@/extensions/LineHeight/components/LineHeightDropdown';
import type { GeneralOptions } from '@/types';
import { createLineHeightCommand } from '@/utils/line-height';

export {
  DEFAULT_LINE_HEIGHT_LIST
};

export interface LineHeightOptions extends GeneralOptions<LineHeightOptions> {
  types: string[]
  lineHeights: string[]
  defaultHeight: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

export const LineHeight = /* @__PURE__ */ Extension.create<LineHeightOptions>({
  name: 'lineHeight',
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['paragraph', 'heading', 'list_item', 'todo_item'],
      lineHeights: DEFAULT_LINE_HEIGHT_LIST,
      defaultHeight: DEFAULT_LINE_HEIGHT,
      button({ editor, t }: { editor: Editor, t: any }) {
        return {
          component: LineHeightDropdown,
          componentProps: {
            editor,
            tooltip: t('editor.lineheight.tooltip'),
          },
        };
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => {
              return element.style.lineHeight || this.options.defaultHeight;
            },
            renderHTML: (attributes) => {
              if (attributes.lineHeight === this.options.defaultHeight || !attributes.lineHeight) {
                return {};
              }
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight: lineHeight => createLineHeightCommand(lineHeight),
      unsetLineHeight:
        () =>
          ({ commands }) => {
            return this.options.types.every(type => commands.resetAttributes(type, 'lineHeight'));
          },
    };
  },
});
