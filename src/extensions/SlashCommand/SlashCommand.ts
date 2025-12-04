import { computePosition } from '@floating-ui/dom';
import type { Editor, Extensions, Range } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import { Suggestion } from '@tiptap/suggestion';

import CommandsList from '@/extensions/SlashCommand/components/CommandsList';

import { renderGroups } from './groups';
import { type Group } from './types';

export interface SlashCommandOptions {
  renderGroupItem?: (extension: Extensions[number], groups: Group[]) => void
}

const extensionName = 'slashCommand';

export const SlashCommand = /* @__PURE__ */ Extension.create<SlashCommandOptions>({
  name: extensionName,
  priority: 200,

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
          function repositionComponent(clientRect: any) {
            if (!component || !component.element) {
              return;
            }

            const virtualElement = {
              getBoundingClientRect() {
                return clientRect;
              },
            };

            computePosition(virtualElement, component.element, {
              placement: 'bottom-start',
            }).then(pos => {
              Object.assign(component.element.style, {
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                position: pos.strategy === 'fixed' ? 'fixed' : 'absolute',
              });
            });
          }

          const onClose = () => {
            if (!component) return;
            if (document.body.contains(component.element)) {
              document.body.removeChild(component.element);
            }
            component.destroy();
          };

          return {
            onStart: (props: any) => {
              onClose();

              component = new ReactRenderer(CommandsList, {
                props: {
                  ...props,
                  onClose
                },
                editor: props.editor,
              });
            //     view.dom.parentElement?.addEventListener('scroll', scrollHandler);

              document.body.appendChild(component.element);
              repositionComponent(props.clientRect());
            },

            onUpdate(props: any) {
              component.updateProps(props);
              repositionComponent(props.clientRect());
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                document.body.removeChild(component.element);
                component.destroy();

                return true;
              }

              return component.ref?.onKeyDown(props);
            },

            // onExit() {
            //   if (document.body.contains(component.element)) {
            //     document.body.removeChild(component.element);
            //   }
            //   component.destroy();
            // },
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
