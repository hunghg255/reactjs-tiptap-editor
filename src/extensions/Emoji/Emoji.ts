/* eslint-disable @typescript-eslint/ban-ts-comment */
import TiptapEmoji from '@tiptap/extension-emoji';
import { ReactRenderer } from '@tiptap/react';

import { updatePosition } from '@/utils/updatePosition';

import EmojiNodeView from './components/EmojiList/EmojiNodeView';

export * from '@/extensions/Emoji/components/RichTextEmoji';

export const EXTENSION_PRIORITY_HIGHEST = 200;

export const Emoji = /* @__PURE__ */ TiptapEmoji.extend({
  priority: EXTENSION_PRIORITY_HIGHEST,
  // emojis: gitHubEmojis,
  enableEmoticons: true,
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},

      button: ({ editor, t }: any) => {
        return {
          componentProps: {
            editor,
            action: (emoji: any) => {
              const { selection } = editor.state;
              const { $anchor } = selection;
              editor.chain().focus().insertContentAt($anchor.pos, emoji).run();
            },
            isActive: () => true,
            icon: 'EmojiIcon',
            tooltip: t('editor.emoji.tooltip'),
          },
        };
      },
    };
  },

}).configure({
  suggestion: {
    // items: ({ query }: any) => {
    //   return emojiSearch(query);
    // },

    allowSpaces: false,

    render: () => {
              let reactRenderer: any;

              return {
                onStart: (props: any) => {
                  if (!props.clientRect) {
                    return;
                  }

                  reactRenderer = new ReactRenderer(EmojiNodeView, {
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
  }
});
