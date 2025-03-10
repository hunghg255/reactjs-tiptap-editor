import type { Command } from '@tiptap/core';
import type { NodeType, Node as ProsemirrorNode } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { AllSelection, TextSelection } from '@tiptap/pm/state';

import { DEFAULT_LINE_HEIGHT } from '@/constants';

export const ALLOWED_NODE_TYPES = ['paragraph', 'heading', 'list_item', 'todo_item'];

export function isLineHeightActive(state: EditorState, lineHeight: string): boolean {
  const { selection, doc } = state;
  const { from, to } = selection;

  let keepLooking = true;
  let active = false;

  doc.nodesBetween(from, to, (node) => {
    const nodeType = node.type;
    const lineHeightValue = node.attrs.lineHeight || DEFAULT_LINE_HEIGHT;

    if (ALLOWED_NODE_TYPES.includes(nodeType.name)) {
      if (keepLooking && lineHeight === lineHeightValue) {
        keepLooking = false;
        active = true;

        return false;
      }
      return nodeType.name !== 'list_item' && nodeType.name !== 'todo_item';
    }
    return keepLooking;
  });

  return active;
}

interface SetLineHeightTask {
  node: ProsemirrorNode
  nodeType: NodeType
  pos: number
}

export function setTextLineHeight(tr: Transaction, lineHeight: string | null): Transaction {
  const { selection, doc } = tr;

  if (!selection || !doc) {
    return tr;
  }

  if (!(selection instanceof TextSelection || selection instanceof AllSelection)) {
    return tr;
  }

  const { from, to } = selection;

  const tasks: Array<SetLineHeightTask> = [];
  const lineHeightValue = lineHeight && lineHeight !== DEFAULT_LINE_HEIGHT ? lineHeight : null;

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    if (ALLOWED_NODE_TYPES.includes(nodeType.name)) {
      const lineHeight = node.attrs.lineHeight || null;
      if (lineHeight !== lineHeightValue) {
        tasks.push({
          node,
          pos,
          nodeType,
        });
      }
      return nodeType.name !== 'list_item' && nodeType.name !== 'todo_item';
    }
    return true;
  });

  if (tasks.length === 0) {
    return tr;
  }

  for (const task of tasks) {
    const { node, pos, nodeType } = task;
    let { attrs } = node;

    attrs = {
      ...attrs,
      lineHeight: lineHeightValue,
    };

    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  }

  return tr;
}

export function createLineHeightCommand(lineHeight: string): Command {
  return ({ state, dispatch }) => {
    const { selection } = state;
    let { tr } = state;
    tr = tr.setSelection(selection);

    tr = setTextLineHeight(tr, lineHeight);

    if (tr.docChanged) {
      if (dispatch)
        dispatch(tr);
      return true;
    }

    return false;
  };
}
