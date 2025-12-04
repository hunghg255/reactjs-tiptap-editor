/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computePosition } from '@floating-ui/dom';
import TiptapEmoji from '@tiptap/extension-emoji';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';

import EmojiPicker from '@/extensions/Emoji/components/EmojiPicker/EmojiPicker';

import { EmojiList } from './components/EmojiList/EmojiList';
import { emojiSearch, emojisToName } from './components/EmojiList/emojis';

export const EXTENSION_PRIORITY_HIGHEST = 200;

export const EmojiPluginKey = new PluginKey('emoji');

export { emojisToName };

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
          component: EmojiPicker,
          componentProps: {
            editor,
            action: () => {
              return;
            },
            isActive: () => false,
            disabled: false,
            icon: 'EmojiIcon',
            tooltip: t('editor.emoji.tooltip'),
          },
        };
      },
    };
  },

}).configure({
  suggestion: {
    items: ({ query }: any) => {
      return emojiSearch(query);
    },

    allowSpaces: false,

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

          component = new ReactRenderer(EmojiList, {
            props: {
              ...props,
              onClose
            },
            editor: props.editor,
          });

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
  }
});
