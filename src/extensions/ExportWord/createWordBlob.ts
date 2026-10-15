import { Packer, WidthType } from 'docx';
import { DocxSerializer, defaultMarks, defaultNodes } from 'prosemirror-docx';

import type { Node, NodeType } from '@tiptap/pm/model';
import type { MarkSerializer, NodeSerializer } from 'prosemirror-docx';

type SerializeNode = NodeSerializer[string];

const nodeSerializer: NodeSerializer = {
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

const markSerializer: MarkSerializer = {
  ...defaultMarks,
  strike: defaultMarks.strikethrough,
};

/**
 * prosemirror-docx throws on any node type without a serializer, so custom nodes
 * (details, callout, columns, table of contents, mention, ...) would abort the export.
 * Fall back to exporting their text content, and skip leaf blocks with nothing to render.
 */
function createFallbackSerializer(type: NodeType): SerializeNode {
  if (type.isTextblock) {
    return (state, node) => {
      state.renderInline(node);
      state.closeBlock(node);
    };
  }

  if (type.isInline) {
    return (state, node) => {
      if (node.isLeaf) {
        const text = node.textContent || node.attrs.label || node.attrs.text || node.attrs.id;
        if (typeof text === 'string') state.text(text);
        return;
      }
      state.renderInline(node);
    };
  }

  return (state, node) => {
    if (!node.isLeaf) state.renderContent(node);
  };
}

function getNodeSerializer(docState: Node): NodeSerializer {
  const serializer = { ...nodeSerializer };
  for (const [name, type] of Object.entries(docState.type.schema.nodes)) {
    serializer[name] ??= createFallbackSerializer(type);
  }
  return serializer;
}

export function createWordBlob(docState: Node) {
  const docxSerializer = new DocxSerializer(getNodeSerializer(docState), markSerializer);
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
