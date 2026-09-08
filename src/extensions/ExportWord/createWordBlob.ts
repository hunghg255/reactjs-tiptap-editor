import { Packer, WidthType } from 'docx';
import { DocxSerializer, defaultMarks, defaultNodes } from 'prosemirror-docx';

import type { Node } from '@tiptap/pm/model';

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

const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);

export function createWordBlob(docState: Node) {
  const wordDocument = docxSerializer.serialize(
    // prosemirror-docx uses an older structurally compatible ProseMirror Node.
    docState as unknown as Parameters<DocxSerializer['serialize']>[0],
    {
      getImageBuffer: () => {
        throw new Error('Image export is disabled by the image serializer.');
      },
    }
  );
  return Packer.toBlob(wordDocument);
}
