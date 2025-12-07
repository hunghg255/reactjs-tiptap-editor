import { UndoRedo, type UndoRedoOptions } from '@tiptap/extensions';

// import HistoryActionButton from '@/extensions/History/components/HistoryActionButton';
import type { GeneralOptions } from '@/types';

export interface HistoryOptions extends UndoRedoOptions, GeneralOptions<HistoryOptions> { }

export const History = /* @__PURE__ */ UndoRedo.extend<HistoryOptions>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      depth: 100,
      newGroupDelay: 500,
      button: ({ editor, t, extension }: any) => {
        return {
          componentProps: {
            undo: {
              action: () => {
                editor.chain().focus().undo().run();
              },
              shortcutKeys: extension.options.shortcutKeys?.[0] ?? ['mod', 'Z'],
              isActive: () => editor.can().undo(),
              icon: 'Undo2',
              tooltip: t('editor.undo.tooltip'),
            },
            redo: {
              action: () => {
                editor.chain().focus().redo().run();
              },
              shortcutKeys: extension.options.shortcutKeys?.[1] ?? ['shift', 'mod', 'Z'],
              isActive: () => editor.can().redo(),
              icon: 'Redo2',
              tooltip: t('editor.redo.tooltip'),
            }
          }
        };
      },
    };
  },
});

export * from './components/RichTextHistory';
