/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Extension } from '@tiptap/core';
import type { Mark } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';

import { ActionButton } from '@/components';
import type { GeneralOptions } from '@/types';

/**
 * Represents the interface for font size options, extending GeneralOptions.
 */
export interface FormatPainterOptions extends GeneralOptions<FormatPainterOptions> {}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    painter: {
      setPainter: (marks: Mark[]) => ReturnType
    }
  }
}

export interface PainterAction {
  type: 'start' | 'end'
  marks: Mark[]
}
/**
 * 格式刷
 */
export const FormatPainter = /* @__PURE__ */ Extension.create<FormatPainterOptions>({
  name: 'painter',
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => {
            editor.commands.setPainter(editor?.state.selection.$head.marks() as Mark[]);
          },
          icon: 'PaintRoller',
          tooltip: t('editor.format'),
        },
      }),
    };
  },
  addCommands() {
    return {
      setPainter:
        (marks: Mark[]) =>
          ({
            view: {
              dispatch,
              state: { tr },
              dom,
            },
          }) => {
            const svgCursor
            = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M9 22v-6H4V7q0-1.65 1.175-2.825T8 3h12v13h-5v6zM6 10h12V5h-1v4h-2V5h-1v2h-2V5H8q-.825 0-1.412.588T6 7zm0 4h12v-2H6zm0 0v-2z"/></svg>';
            const encodedSvg = encodeURIComponent(svgCursor);
            const cursorUrl = `url("data:image/svg+xml;utf8,${encodedSvg}"), auto`;

            dom.style.cursor = cursorUrl;
            dispatch(tr.setMeta('painterAction', { type: 'start', marks }));
            return true;
          },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('format-painter'),
        state: {
          init: () => [] as Mark[],
          apply: (tr, set) => {
            const action = tr.getMeta('painterAction') as PainterAction;
            if (action && action.type === 'start') {
              set = action.marks;
            } else if (action && action.type === 'end') {
              set = [];
            }
            return set;
          },
        },
        props: {
          handleDOMEvents: {
            mousedown(view) {
              const marks = this.getState(view.state) as Mark[];
              if (!marks || marks.length === 0) {
                view.dom.style.cursor = '';
                return false; // 如果没有标记，则不执行任何操作
              }
              const mouseup = () => {
                document.removeEventListener('mouseup', mouseup);

                let {
                  dispatch,
                  state: { tr, selection },
                  dom,
                } = view as any;
                dom.style.cursor = '';

                tr = tr.removeMark(selection.from, selection.to);
                for (const mark of marks) {
                  if (mark.type.name !== 'link') {
                    tr = tr.addMark(selection.from, selection.to, mark);
                  }
                }

                dispatch(tr.setMeta('painterAction', { type: 'end' }));
              };
              document.addEventListener('mouseup', mouseup);
              return true;
            },
          },
        },
      }),
    ];
  },
});
