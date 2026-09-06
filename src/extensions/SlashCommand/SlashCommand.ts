import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { Suggestion } from '@tiptap/suggestion';

import SlashCommandNodeView from '@/extensions/SlashCommand/components/SlashCommandNodeView';
import { renderNodeViewClosure } from '@/utils/renderNodeView';

import type { Command } from './types';
import type { Editor, Range } from '@tiptap/core';

export * from './components/SlashCommandList';
export * from './renderCommandListDefault';

export const SlashCommand = /* @__PURE__ */ Extension.create({
  name: 'richtextSlashCommand',
  priority: 200,

  // addOptions() {
  //   return {
  //     suggestion: {
  //       char: '/',
  //     },
  //   };
  // },

  addProseMirrorPlugins() {
    return [
      Suggestion<Command>({
        pluginKey: new PluginKey('richtextSlashCommandPlugin'),
        editor: this.editor,
        char: '/',
        // allowSpaces: true,
        // startOfLine: true,
        // pluginKey: new PluginKey(`richtextCustomPlugin${this.name}`),

        // allow: ({ state, range }) => {
        //   const $from = state.doc.resolve(range.from);
        //   const isRootDepth = $from.depth === 1;
        //   const isParagraph = $from.parent.type.name === 'paragraph';
        //   const isStartOfNode = $from.parent.textContent?.charAt(0) === '/';

        //   const isInColumn = this.editor.isActive('column');
        //   const afterContent = $from.parent.textContent?.slice(
        //     Math.max(0, $from.parent.textContent?.indexOf('/')),
        //   );
        //   const isValidAfterContent = !afterContent?.endsWith('  ');

        //   return (
        //     ((isRootDepth && isParagraph && isStartOfNode)
        //       || (isInColumn && isParagraph && isStartOfNode))
        //     && isValidAfterContent
        //   );
        // },

        command: ({ editor, range, props }: { editor: Editor; range: Range; props: Command }) => {
          const { view } = editor;
          props.action({ editor, range });
          view.focus();
        },

        render: renderNodeViewClosure(SlashCommandNodeView),
      }),
    ];
  },
});
