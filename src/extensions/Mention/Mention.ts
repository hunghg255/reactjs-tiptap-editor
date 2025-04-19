import BulitInMention from '@tiptap/extension-mention';
// import { getMentionUser } from 'services/user'
// import { MentionList } from '@/wrappers/mention-list'
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

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

const suggestion = /* @__PURE__ */ {
  items: async ({ query }: any) => {
    const data = MOCK_USERS.map(item => item.name);
    return data.filter(item => item.toLowerCase().startsWith(query.toLowerCase()));
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(NodeViewMentionList, {
          props,
          editor: props.editor,
        });

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
} as any;

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
  suggestion,
});
