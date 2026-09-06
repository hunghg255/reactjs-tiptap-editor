import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { ReactRenderer } from '@tiptap/react';

import { AIPanel, type AIPanelProps } from './AIPanel';

import type { AIOptions } from './types';

export type { AIOptions, AIProtocol, AIMessage, AIRequest } from './types';

import { aiPluginKey, type AISession } from './state';
export { aiPluginKey } from './state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ai: {
      openAI: (prompt?: string) => ReturnType;
      closeAI: () => ReturnType;
      applyAI: (text: string) => ReturnType;
    };
  }
}

export const AI = Extension.create<AIOptions>({
  name: 'ai',
  addOptions() {
    return {
      protocol: 'openai',
      apiKey: '',
      baseURL: '',
      model: '',
      maxTokens: 2048,
      headers: {},
      generate: null,
      systemPrompt:
        'You are a writing assistant inside a text editor. Follow the user’s instructions. Reply in the user’s language. Return only the final text, without commentary or HTML/Markdown formatting.',
    };
  },
  addCommands() {
    return {
      openAI:
        (prompt) =>
        ({ editor, tr, dispatch }) => {
          if (!editor.isEditable || !tr.selection.$from.parent.isTextblock) return false;
          if (dispatch)
            tr.setMeta(aiPluginKey, { from: tr.selection.from, to: tr.selection.to, prompt });
          return true;
        },
      closeAI:
        () =>
        ({ tr, dispatch }) => {
          if (dispatch) tr.setMeta(aiPluginKey, null);
          return true;
        },
      applyAI:
        (text) =>
        ({ editor, state, commands }) => {
          const range = aiPluginKey.getState(state);
          if (!editor.isEditable || !range || !text.trim()) return false;
          // JSON text nodes ensure model output cannot inject HTML or executable markup.
          return commands.insertContentAt(
            range,
            text
              .replace(/\r\n?/g, '\n')
              .split('\n')
              .map((line) => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : [],
              }))
          );
        },
    };
  },
  addProseMirrorPlugins() {
    const editor = this.editor;
    const options = this.options;
    let mount: HTMLElement | null = null;
    return [
      new Plugin<AISession | null>({
        key: aiPluginKey,
        state: {
          init: () => null,
          apply(tr, previous) {
            const action = tr.getMeta(aiPluginKey);
            if (action !== undefined) return action;
            // A document edit invalidates the preview, including remote collaborative edits.
            return tr.docChanged ? null : previous;
          },
        },
        props: {
          decorations(state) {
            const range = aiPluginKey.getState(state);
            if (!range) return DecorationSet.empty;
            const $pos = state.doc.resolve(range.to);
            const decorations: Decoration[] = [];
            if (range.from !== range.to) {
              decorations.push(
                Decoration.inline(range.from, range.to, { class: 'richtext-ai-selection' })
              );
            } else if ($pos.depth) {
              decorations.push(
                Decoration.node($pos.before(), $pos.after(), {
                  class:
                    $pos.parent.content.size === 0
                      ? 'richtext-ai-empty-anchor'
                      : 'richtext-ai-selection',
                })
              );
            }
            // A block widget participates in editor layout but is excluded from its
            // document/HTML/history. Long previews push following content down.
            decorations.push(
              Decoration.widget(
                $pos.depth ? $pos.after() : range.to,
                () => {
                  mount = editor.view.dom.ownerDocument.createElement('div');
                  mount.className = 'richtext-ai-mount';
                  mount.contentEditable = 'false';
                  return mount;
                },
                { key: 'ai-panel', side: -1, stopEvent: () => true, ignoreSelection: true }
              )
            );
            return DecorationSet.create(state.doc, decorations);
          },
        },
        view(view) {
          let renderer: ReactRenderer<unknown, AIPanelProps> | null = null;
          let current: AISession | null = null;
          function destroy() {
            renderer?.destroy();
            renderer?.element.remove();
            renderer = null;
          }
          function update() {
            const next = editor.isEditable ? (aiPluginKey.getState(view.state) ?? null) : null;
            if (next === current) return;
            current = next;
            destroy();
            if (!next) return;
            renderer = new ReactRenderer(AIPanel, {
              editor,
              props: {
                options,
                initialPrompt: next.prompt,
                selectedText: view.state.doc.textBetween(next.from, next.to, '\n'),
                close: () => {
                  editor.commands.closeAI();
                  editor.commands.focus();
                },
                apply: (text: string) => {
                  if (editor.commands.applyAI(text)) editor.commands.focus();
                },
              },
            });
            mount?.appendChild(renderer.element);
          }
          return { update, destroy };
        },
      }),
    ];
  },
});
