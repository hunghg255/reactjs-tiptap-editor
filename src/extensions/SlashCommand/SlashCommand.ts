import type { Editor, Range } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import { Suggestion } from '@tiptap/suggestion';

import SlashCommandNodeView from '@/extensions/SlashCommand/components/SlashCommandNodeView';
import { updatePosition } from '@/utils/updatePosition';

export * from './components/SlashCommandList';
export * from './renderCommandListDefault';

export const SlashCommand = /* @__PURE__ */ Extension.create<any>({
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
      Suggestion({
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

        command: ({ editor, range, props }: { editor: Editor, range: Range, props: any }) => {
          const { view } = editor;
          props.action({ editor, range });
          view.focus();
        },

        render: () => {
          let reactRenderer: any;

          return {
            onStart: (props: any) => {
              if (!props.clientRect) {
                return;
              }

              reactRenderer = new ReactRenderer(SlashCommandNodeView, {
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
              if (!reactRenderer) {
                return;
              }
              reactRenderer.destroy();
              reactRenderer.element.remove();
            },
          };
        },
      }),
    ];
  }
});
