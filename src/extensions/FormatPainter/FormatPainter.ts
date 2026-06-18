import { Extension } from '@tiptap/core';
import type { Mark, MarkType } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorState, Transaction } from '@tiptap/pm/state';

import { ActionButton } from '@/components';

import type { GeneralOptions } from '@/types';

export * from './components/RichTextFormatPainter';

export type FormatPainterOptions = GeneralOptions<unknown>;

type FormatPainterState = Mark[];
type FormatPainterAction = { type: 'start'; marks: Mark[] } | { type: 'end' };

const SKIPPED_MARK_NAMES = new Set(['link']);

export const formatPainterPluginKey = new PluginKey<FormatPainterState>('format-painter');

function getPainterMarks(state: EditorState) {
  return formatPainterPluginKey.getState(state) ?? [];
}

function getMarksFromSelection(state: EditorState) {
  const { selection, storedMarks } = state;
  const marks: Mark[] = [];

  if (storedMarks?.length || selection.empty) {
    const sourceMarks = storedMarks ?? selection.$from.marks();
    sourceMarks.forEach((mark) => {
      if (!SKIPPED_MARK_NAMES.has(mark.type.name)) marks.push(mark);
    });
    return marks;
  }

  state.doc.nodesBetween(selection.from, selection.to, (node) => {
    if (!node.isText || marks.length > 0) return true;

    node.marks.forEach((mark) => {
      if (!SKIPPED_MARK_NAMES.has(mark.type.name)) marks.push(mark);
    });
    return false;
  });

  return marks;
}

function applyMarksToSelection(tr: Transaction, state: EditorState, marks: Mark[]) {
  const { from, to } = state.selection;

  Object.values(state.schema.marks).forEach((markType: MarkType) => {
    if (!SKIPPED_MARK_NAMES.has(markType.name)) {
      tr = tr.removeMark(from, to, markType);
    }
  });

  marks.forEach((mark) => {
    tr = tr.addMark(from, to, mark);
  });

  return tr;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    painter: {
      setPainter: () => ReturnType
      unsetPainter: () => ReturnType
    }
  }
}

export const FormatPainter = /* @__PURE__ */ Extension.create<FormatPainterOptions>({
  name: 'painter',

  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      button: ({ editor, t }) => ({
        component: ActionButton,
        componentProps: {
          action: () => {
            if (getPainterMarks(editor.state).length > 0) {
              editor.commands.unsetPainter();
              return;
            }

            editor.commands.setPainter();
          },
          isActive: () => getPainterMarks(editor.state).length > 0,
          icon: 'PaintRoller',
          tooltip: t('editor.format'),
        },
      }),
    };
  },

  addCommands() {
    return {
      setPainter:
        () =>
        ({ dispatch, state }) => {
          const marks = getMarksFromSelection(state);

          if (!marks.length) {
            dispatch?.(state.tr.setMeta(formatPainterPluginKey, { type: 'end' }));
            return false;
          }

          dispatch?.(
            state.tr.setMeta(formatPainterPluginKey, {
              type: 'start',
              marks,
            } satisfies FormatPainterAction)
          );

          return true;
        },
      unsetPainter:
        () =>
        ({ dispatch, state }) => {
          dispatch?.(state.tr.setMeta(formatPainterPluginKey, { type: 'end' }));

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin<FormatPainterState>({
        key: formatPainterPluginKey,
        state: {
          init: () => [],
          apply: (tr, marks) => {
            const action = tr.getMeta(formatPainterPluginKey) as FormatPainterAction | undefined;

            if (action?.type === 'start') return action.marks;
            if (action?.type === 'end') return [];

            return marks;
          },
        },
        props: {
          handleDOMEvents: {
            keydown: (view, event) => {
              if (event.key !== 'Escape' || getPainterMarks(view.state).length === 0) return false;

              view.dispatch(view.state.tr.setMeta(formatPainterPluginKey, { type: 'end' }));
              return true;
            },
            mousedown: (view) => {
              const marks = getPainterMarks(view.state);

              if (!marks.length) return false;

              const mouseup = () => {
                document.removeEventListener('mouseup', mouseup);

                const { state } = view;
                const { selection } = state;
                const tr = selection.empty ? state.tr : applyMarksToSelection(state.tr, state, marks);

                view.dispatch(tr.setMeta(formatPainterPluginKey, { type: 'end' }));
              };

              document.addEventListener('mouseup', mouseup);
              return false;
            },
          },
        },
      }),
    ];
  },
});
