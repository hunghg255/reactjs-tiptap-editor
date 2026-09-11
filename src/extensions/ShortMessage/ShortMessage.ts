import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { Suggestion, exitSuggestion } from '@tiptap/suggestion';

import ShortMessageList from '@/extensions/ShortMessage/components/ShortMessageList';
import { renderNodeViewClosure } from '@/utils/renderNodeView';

import type { ShortMessageItem, ShortMessageOptions, ShortMessageStorage } from './types';
import type { Editor, Range } from '@tiptap/core';
import type { SuggestionMatch, SuggestionOptions } from '@tiptap/suggestion';

export type { ShortMessageItem, ShortMessageOptions } from './types';

export const SHORT_MESSAGE_PLUGIN_KEY = new PluginKey('shortMessage');

function filterMessages(messages: ShortMessageItem[], query: string): ShortMessageItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return messages;

  const startsWith: ShortMessageItem[] = [];
  const includes: ShortMessageItem[] = [];

  for (const item of messages) {
    const short = item.short.toLowerCase();
    if (short.startsWith(q)) {
      startsWith.push(item);
    } else if (short.includes(q) || item.long_content.toLowerCase().includes(q)) {
      includes.push(item);
    }
  }

  return [...startsWith, ...includes];
}

export const ShortMessage = /* @__PURE__ */ Extension.create<
  ShortMessageOptions,
  ShortMessageStorage
>({
  name: 'shortMessage',
  priority: 200,

  addOptions() {
    return {
      messages: [],
      shortcut: 'Mod-Space',
      items: undefined,
    };
  },

  addStorage() {
    return {
      anchor: null,
    };
  },

  onBlur() {
    // The list is not anchored to a trigger character, so close it when focus leaves the editor.
    if (this.storage.anchor !== null) {
      this.storage.anchor = null;
      exitSuggestion(this.editor.view, SHORT_MESSAGE_PLUGIN_KEY);
    }
  },

  addKeyboardShortcuts() {
    return {
      [this.options.shortcut]: () => {
        const { state, view } = this.editor;
        const { selection } = state;

        if (!selection.empty || !selection.$from.parent.isTextblock) {
          return false;
        }

        this.storage.anchor = selection.from;
        // An empty transaction re-runs the suggestion plugin state so the list opens immediately.
        view.dispatch(state.tr);
        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    const storage = this.storage;
    const options = this.options;

    // Match the text typed between the shortcut anchor and the caret, without a trigger character.
    const findSuggestionMatch: SuggestionOptions['findSuggestionMatch'] = ({ $position }) => {
      const anchor = storage.anchor;
      if (anchor === null) return null;

      const pos = $position.pos;
      const inSameTextblock = $position.parent.isTextblock && anchor >= $position.start();

      if (pos < anchor || !inSameTextblock) {
        storage.anchor = null;
        return null;
      }

      const text = $position.doc.textBetween(anchor, pos);
      return { range: { from: anchor, to: pos }, query: text, text } satisfies SuggestionMatch;
    };

    const renderList = renderNodeViewClosure<ShortMessageItem>(ShortMessageList);

    return [
      Suggestion<ShortMessageItem>({
        pluginKey: SHORT_MESSAGE_PLUGIN_KEY,
        editor: this.editor,
        char: '',
        allowSpaces: true,
        findSuggestionMatch,
        // Dismissal is fully controlled by `storage.anchor`; never keep a stale dismissed range.
        shouldResetDismissed: () => true,

        items: ({ query, editor }: { query: string; editor: Editor }) => {
          if (options.items) return options.items({ query, editor });
          return filterMessages(options.messages, query);
        },

        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: ShortMessageItem;
        }) => {
          storage.anchor = null;
          editor.chain().focus().deleteRange(range).insertContent(props.long_content).run();
        },

        render: () => {
          const renderer = renderList();
          return {
            ...renderer,
            onExit(props) {
              storage.anchor = null;
              renderer.onExit?.(props);
            },
          };
        },
      }),
    ];
  },
});

export default ShortMessage;
