import { Document as TiptapDocument } from '@tiptap/extension-document';

export const Document = /* @__PURE__ */ TiptapDocument.extend({
  content: '(block|columns)+',
  // echo editor is a block editor
});

export default Document;
