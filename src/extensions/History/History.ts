import { UndoRedo, type UndoRedoOptions } from '@tiptap/extensions';

import HistoryActionButton from '@/extensions/History/components/HistoryActionButton';
import type { GeneralOptions } from '@/types';

export interface HistoryOptions extends UndoRedoOptions, GeneralOptions<HistoryOptions> {}

const historys: ['undo', 'redo'] = ['undo', 'redo'];

export const History = /* @__PURE__ */ UndoRedo.extend<HistoryOptions>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      depth: 100,
      newGroupDelay: 500,
      button: ({ editor, t, extension }: any) => {
        return historys.map(item => ({
          component: HistoryActionButton,
          componentProps: {
            action: () => {
              if (item === 'undo') {
                editor.chain().focus().undo().run();
              }
              if (item === 'redo') {
                editor.chain().focus().redo().run();
              }
            },
            shortcutKeys: item === 'undo' ? (extension.options.shortcutKeys?.[0] ?? ['mod', 'Z']) : (extension.options.shortcutKeys?.[1] ?? ['shift', 'mod', 'Z']),
            disabled: item === 'undo' ? !editor.can().undo() : !editor.can().redo(),
            isActive: () => (item === 'undo' ? !editor.can().undo() : !editor.can().redo()),
            icon: item === 'undo' ? 'Undo2' : 'Redo2',
            tooltip: t(`editor.${item}.tooltip`),
          },
        }));
      },
    };
  },
});
