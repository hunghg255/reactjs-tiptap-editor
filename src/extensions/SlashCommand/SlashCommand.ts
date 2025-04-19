import type { Editor, Extensions, Range } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';

import CommandsList from '@/extensions/SlashCommand/components/CommandsList';

import { renderGroups } from './groups';
import { type Group } from './types';

export interface SlashCommandOptions {
  renderGroupItem?: (extension: Extensions[number], groups:Group[]) => void
}

const extensionName = 'slashCommand';
let popup: any;
export const SlashCommand = /* @__PURE__ */ Extension.create<SlashCommandOptions>({
  name: extensionName,
  priority: 200,
  onCreate() {
    popup = tippy('body', {
      interactive: true,
      trigger: 'manual',
      placement: 'bottom-start',
      theme: 'slash-command',
      maxWidth: '16rem',
      offset: [16, 8],
      popperOptions: {
        strategy: 'fixed',
        modifiers: [
          {
            name: 'flip',
            enabled: false,
          },
        ],
      },
    });
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        allowSpaces: true,
        startOfLine: true,
        pluginKey: new PluginKey(extensionName),
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const isRootDepth = $from.depth === 1;
          const isParagraph = $from.parent.type.name === 'paragraph';
          const isStartOfNode = $from.parent.textContent?.charAt(0) === '/';
          // TODO 行列内
          const isInColumn = this.editor.isActive('column');
          const afterContent = $from.parent.textContent?.slice(
            Math.max(0, $from.parent.textContent?.indexOf('/')),
          );
          const isValidAfterContent = !afterContent?.endsWith('  ');

          return (
            ((isRootDepth && isParagraph && isStartOfNode)
              || (isInColumn && isParagraph && isStartOfNode))
            && isValidAfterContent
          );
        },
        command: ({ editor, range, props }: { editor: Editor, range: Range, props: any }) => {
          const { view } = editor;
          props.action({ editor, range });
          view.focus();
        },
        items: ({ query, editor }: { query: string, editor: Editor }) => {
          // get options
          // Filter commands
          const groups = renderGroups(editor.extensionManager.extensions, this.options.renderGroupItem);
          const withFilteredCommands = groups.map(group => ({
            ...group,
            commands: group.commands
              .filter((item) => {
                const labelNormalized = item.label.toLowerCase().trim();
                const queryNormalized = query.toLowerCase().trim();

                if (item.aliases) {
                  const aliases = item.aliases.map(alias => alias.toLowerCase().trim());
                  const labelMatch = labelNormalized.match(queryNormalized);
                  const aliasMatch = aliases.some(alias => alias.match(queryNormalized));

                  return labelMatch || aliasMatch;
                }

                return labelNormalized.match(queryNormalized);
              })
              .filter(command =>
                command.shouldBeHidden ? !command.shouldBeHidden(this.editor) : true,
              ),
          }));
          // Remove empty groups
          const withoutEmptyGroups = withFilteredCommands.filter((group) => {
            if (group.commands.length > 0) {
              return true;
            }

            return false;
          });
          const withEnabledSettings = withoutEmptyGroups.map(group => ({
            ...group,
            commands: group.commands.map(command => ({
              ...command,
              isEnabled: true,
            })),
          }));

          return withEnabledSettings;
        },
        render: () => {
          let component: any;
          let scrollHandler: (() => void) | null = null;
          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              });
              const { view } = props.editor;
              // const editorNode = view.dom as HTMLElement;
              const getReferenceClientRect = () => {
                if (!props.clientRect) {
                  return props.editor.storage[extensionName].rect;
                }

                const rect = props.clientRect();

                if (!rect) {
                  return props.editor.storage[extensionName].rect;
                }

                let yPos = rect.y;

                if (rect.top + component.element.offsetHeight + 40 > window.innerHeight) {
                  const diff = rect.top + component.element.offsetHeight - window.innerHeight + 40;
                  yPos = rect.y - diff;
                }

                // Account for when the editor is bound inside a container that doesn't go all the way to the edge of the screen
                // const editorXOffset = editorNode.getBoundingClientRect().x;
                return new DOMRect(rect.x, yPos, rect.width, rect.height);
              };

              scrollHandler = () => {
                popup?.[0].setProps({
                  getReferenceClientRect,
                });
              };

              view.dom.parentElement?.addEventListener('scroll', scrollHandler);

              popup?.[0].setProps({
                getReferenceClientRect,
                appendTo: () => document.body,
                content: component.element,
              });

              popup?.[0].show();
            },

            onUpdate(props: SuggestionProps) {
              component.updateProps(props);

              const { view } = props.editor;

              // const editorNode = view.dom as HTMLElement;

              const getReferenceClientRect = () => {
                if (!props.clientRect) {
                  return props.editor.storage[extensionName].rect;
                }

                const rect = props.clientRect();

                if (!rect) {
                  return props.editor.storage[extensionName].rect;
                }

                // Account for when the editor is bound inside a container that doesn't go all the way to the edge of the screen
                return new DOMRect(rect.x, rect.y, rect.width, rect.height);
              };

              const scrollHandler = () => {
                popup?.[0].setProps({
                  getReferenceClientRect,
                });
              };

              view.dom.parentElement?.addEventListener('scroll', scrollHandler);

              props.editor.storage[extensionName].rect = props.clientRect
                ? getReferenceClientRect()
                : {
                  width: 0,
                  height: 0,
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                };
              popup?.[0].setProps({
                getReferenceClientRect,
              });
            },

            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === 'Escape') {
                popup?.[0].hide();

                return true;
              }

              if (!popup?.[0].state.isShown) {
                popup?.[0].show();
              }

              return component.ref?.onKeyDown(props);
            },

            onExit(props) {
              popup?.[0].hide();
              if (scrollHandler) {
                const { view } = props.editor;
                view.dom.parentElement?.removeEventListener('scroll', scrollHandler);
              }
              component.destroy();
            },
          };
        },
      }),
    ];
  },

  addStorage() {
    return {
      rect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    };
  },
});

export default SlashCommand;
