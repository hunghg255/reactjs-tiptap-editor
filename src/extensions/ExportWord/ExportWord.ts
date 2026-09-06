import { Extension } from '@tiptap/core';
import { Packer, WidthType } from 'docx';
import { DocxSerializer, defaultMarks, defaultNodes } from 'prosemirror-docx';

import { downloadFromBlob } from '@/utils/download';

import type { ButtonViewParams } from '@/types';
import type { GeneralOptions } from '@/types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    exportWord: {
      exportToWord: (docState: import('@tiptap/pm/model').Node) => ReturnType;
    };
  }
}
interface ExportWordOptions extends GeneralOptions<ExportWordOptions> {}

const nodeSerializer: import('prosemirror-docx').NodeSerializer = {
  ...defaultNodes,
  hardBreak: defaultNodes.hard_break,
  codeBlock: defaultNodes.code_block,
  orderedList: defaultNodes.ordered_list,
  listItem: defaultNodes.list_item,
  bulletList: defaultNodes.bullet_list,
  horizontalRule: defaultNodes.horizontal_rule,
  // Requirement Buffer on browser
  image(state, node) {
    // No image
    state.renderInline(node);
    state.closeBlock(node);
  },
  table(state, node) {
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

const docxSerializer = /* @__PURE__ */ new DocxSerializer(nodeSerializer, defaultMarks);

export const ExportWord = /* @__PURE__ */ Extension.create<ExportWordOptions>({
  name: 'exportWord',

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }: ButtonViewParams<ExportWordOptions>) => ({
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
  addCommands() {
    return {
      exportToWord: (docState) => () => {
        try {
          const opts: Parameters<DocxSerializer['serialize']>[1] = {
            getImageBuffer: () => {
              throw new Error('Image export is disabled by the image serializer.');
            },
          };

          const wordDocument = docxSerializer.serialize(
            // prosemirror-docx bundles an older structurally compatible ProseMirror Node.
            docState as unknown as Parameters<DocxSerializer['serialize']>[0],
            opts
          );

          void Packer.toBlob(wordDocument)
            .then((blob) => downloadFromBlob(blob, 'richtext-export-document.docx'))
            .catch((error: unknown) => console.error('Error exporting to Word:', error));
          return true;
        } catch (error) {
          console.error('Error exporting to Word:', error);
          return false;
        }
      },
    };
  },
});
