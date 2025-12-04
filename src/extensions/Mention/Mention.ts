import { computePosition } from '@floating-ui/dom';
import BulitInMention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';

import { NodeViewMentionList } from '@/extensions/Mention/components/NodeViewMentionList/NodeViewMentionList';
import { getDatasetAttribute } from '@/utils/dom-dataset';

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
      let component: any;
      function repositionComponent(clientRect: any) {
        if (!component || !component.element) {
          return;
        }

        const virtualElement = {
          getBoundingClientRect() {
            return clientRect;
          },
        };

        computePosition(virtualElement, component.element, {
          placement: 'bottom-start',
        }).then(pos => {
          Object.assign(component.element.style, {
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            position: pos.strategy === 'fixed' ? 'fixed' : 'absolute',
          });
        });
      }

      const onClose = () => {
        if (!component) return;
        if (document.body.contains(component.element)) {
          document.body.removeChild(component.element);
        }
        component.destroy();
      };

      return {
        onStart: (props: any) => {
              onClose();

          component = new ReactRenderer(NodeViewMentionList, {
            props: {
              ...props,
              onClose
            },
            editor: props.editor,
          });
          //     view.dom.parentElement?.addEventListener('scroll', scrollHandler);

          document.body.appendChild(component.element);
          repositionComponent(props.clientRect());
        },

        onUpdate(props: any) {
          component.updateProps(props);
          repositionComponent(props.clientRect());
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            document.body.removeChild(component.element);
            component.destroy();

            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        // onExit() {
        //   if (document.body.contains(component.element)) {
        //     document.body.removeChild(component.element);
        //   }
        //   component.destroy();
        // },
      };
    },

  },
});
