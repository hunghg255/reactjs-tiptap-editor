import { Node, mergeAttributes } from '@tiptap/core';

export const Column = /* @__PURE__ */ Node.create({
  name: 'column',
  content: 'block+',
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'column',
      },
    };
  },

  addAttributes() {
    return {
      index: {
        default: 0,
        parseHTML: element => element.getAttribute('index'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=column]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
