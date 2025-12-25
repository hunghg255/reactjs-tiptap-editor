import BulitInMention, { type MentionOptions } from '@tiptap/extension-mention';
import { Extension, ReactRenderer } from '@tiptap/react';

import { NodeViewMentionList } from '@/extensions/Mention/components/NodeViewMentionList';
import { updatePosition } from '@/utils/updatePosition';

function render () {
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

    onUpdate(props: any) {
      reactRenderer.updateProps(props);

      if (!props.clientRect) {
        return;
      }
      updatePosition(props.editor, reactRenderer.element);
    },

    onKeyDown(props: any) {
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
}

export const Mention = /* @__PURE__ */ Extension.create<MentionOptions>({
  name: 'richTextMentionWrapper',

  addExtensions() {
    const config: any = {
      ...this.options
    };

    if (this.options?.suggestion) {
      config['suggestion'] = {
        render: render,
        ...this.options.suggestion,
      };
    }

    if (this.options?.suggestions?.length) {
      config['suggestions'] = this.options.suggestions?.map((s) => {
        return {
          render: render,
          ...s,
        };
      });
    }

    return [BulitInMention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      ...config,
    })];
  },
});
