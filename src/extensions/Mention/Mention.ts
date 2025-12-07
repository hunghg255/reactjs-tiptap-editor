import BulitInMention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';

import { NodeViewMentionList } from '@/extensions/Mention/components/NodeViewMentionList';
import { getDatasetAttribute } from '@/utils/dom-dataset';
import { updatePosition } from '@/utils/updatePosition';

const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
  },
  {
    id: '2',
    name: 'Jane Doe',
  },
  {
    id: '3',
    name: 'Alice',
  },
  {
    id: '4',
    name: 'Bob',
  },
];

export const Mention = /* @__PURE__ */ BulitInMention.extend({
  addAttributes() {
    return {
      id: {
        default: '',
        parseHTML: getDatasetAttribute('id'),
      },
      label: {
        default: '',
        parseHTML: getDatasetAttribute('label'),
      },
    };
  },
}).configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion: {
    items: async ({ query }: any) => {
      const data = MOCK_USERS.map(item => item.name);
      return data.filter(item => item.toLowerCase().startsWith(query.toLowerCase()));
    },

    render: () => {
      let reactRenderer: any;

      return {
        onStart: (props: any) => {
          if (!props.clientRect) {
            return;
          }

          reactRenderer = new ReactRenderer(NodeViewMentionList, {
            props,
            editor: props.editor,
          });

          reactRenderer.element.style.position = 'absolute';

          document.body.appendChild(reactRenderer.element);

          updatePosition(props.editor, reactRenderer.element);
        },

        onUpdate(props) {
          reactRenderer.updateProps(props);

          if (!props.clientRect) {
            return;
          }
          updatePosition(props.editor, reactRenderer.element);
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            reactRenderer.destroy();
            reactRenderer.element.remove();

            return true;
          }

          return reactRenderer.ref?.onKeyDown(props);
        },

        onExit() {
          reactRenderer.destroy();
          reactRenderer.element.remove();
        },
      };
    },

  },
});
