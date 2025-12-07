/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Extension } from '@tiptap/core';
import { Packer, WidthType } from 'docx';
import { DocxSerializer, defaultMarks, defaultNodes } from 'prosemirror-docx';

import type { GeneralOptions } from '@/types';
import { downloadFromBlob } from '@/utils/download';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    exportWord: {
      exportToWord: (docState: any) => ReturnType
    }
  }
}
interface ExportWordOptions extends GeneralOptions<ExportWordOptions> {}

const nodeSerializer = {
  ...defaultNodes,
  hardBreak: defaultNodes.hard_break,
  codeBlock: defaultNodes.code_block,
  orderedList: defaultNodes.ordered_list,
  listItem: defaultNodes.list_item,
  bulletList: defaultNodes.bullet_list,
  horizontalRule: defaultNodes.horizontal_rule,
  // Requirement Buffer on browser
  image(state: any, node: any) {
    // No image
    state.renderInline(node);
    state.closeBlock(node);
  },
  table(state: any, node: any) {
    state.table(node, {
      tableOptions: {
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      },
    });
  },
};

export * from './components/RichTextExportWord';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const docxSerializer = /* @__PURE__ */ new DocxSerializer(nodeSerializer, defaultMarks);

export const ExportWord = /* @__PURE__ */ Extension.create<ExportWordOptions>({
  name: 'exportWord',

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: any) => ({
        componentProps: {
          icon: 'ExportWord',
          action: () => {
            return editor?.commands.exportToWord(editor?.state?.doc);
          },
          tooltip: t('editor.exportWord.tooltip'),
          isActive: () => false,
          disabled: false,
        },
      }),
    };
  },
  // @ts-expect-error
  addCommands() {
    return {
      exportToWord:
        (docState) =>
          async () => {
            try {
              const opts: any = {
                getImageBuffer: async (src: string) => {
                  const response = await fetch(src);
                  const arrayBuffer = await response.arrayBuffer();
                  return new Uint8Array(arrayBuffer);
                },
              };

              const wordDocument = docxSerializer.serialize(docState as any, opts);

              Packer.toBlob(wordDocument).then((blob: any) => downloadFromBlob(new Blob([blob]), 'richtext-export-document.docx'));
              return true;
            } catch (error) {
              console.error('Error exporting to Word:', error);
              return false;
            }
          },
    };
  },
});
