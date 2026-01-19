import TiptapEmoji, { type EmojiOptions } from '@tiptap/extension-emoji';
import { Extension } from '@tiptap/react';

import { renderNodeViewClosure } from '@/utils/renderNodeView';

import EmojiNodeView from './components/EmojiList/EmojiNodeView';

export * from '@/extensions/Emoji/components/RichTextEmoji';

export const EXTENSION_PRIORITY_HIGHEST = 200;

export const Emoji = /* @__PURE__ */ Extension.create<EmojiOptions>({
  name: 'richTextEmojiWrapper',
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

  addExtensions() {
    const config: any = {
      ...this.options,
    };

    if (this.options?.suggestion) {
      config['suggestion'] = {
        render: renderNodeViewClosure(EmojiNodeView),
        ...this.options.suggestion,
      };
    }

    return [
      TiptapEmoji.configure({
        ...config,
      }),
    ];
  },
});
