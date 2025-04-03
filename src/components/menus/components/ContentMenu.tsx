import { useEffect, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import type { NodeSelection } from '@tiptap/pm/state';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  IconComponent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { useLocale } from '@/locales';
import { DragHandlePlugin, dragHandlePluginDefaultKey } from '@/plugins/DragHandle';
import { IndentProps, setNodeIndentMarkup } from '@/utils/indent';

export interface ContentMenuProps {
  editor: Editor
  disabled?: boolean
  className?: string
  pluginKey?: string
}

function ContentMenu(props: ContentMenuProps) {
  const { pluginKey = dragHandlePluginDefaultKey } = props;
  const { t } = useLocale();
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [currentNodePos, setCurrentNodePos] = useState(-1);
  const dragElement = useRef(null);
  const pluginRef = useRef<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const hasTextAlignExtension = props.editor.extensionManager.extensions.some(ext => ext.name === 'textAlign');
  const hasIndentExtension = props.editor.extensionManager.extensions.some(ext => ext.name === 'indent');
  const hasClearExtension = props.editor.extensionManager.extensions.some(ext => ext.name === 'clear');

  useEffect(() => {
    if (dragElement.current && !props.editor.isDestroyed) {
      pluginRef.current = DragHandlePlugin({
        editor: props.editor,
        element: dragElement.current,
        pluginKey: 'ContentItemMenu',
        tippyOptions: {
          offset: [-2, 16],
          zIndex: 99,
          moveTransition: 'transform 0.15s ease-out',
        },
        onNodeChange: handleNodeChange,
      });

      props.editor.registerPlugin(pluginRef.current);
    }
  }, [props.editor, dragElement]);

  function resetTextFormatting() {
    const chain = props.editor.chain();
    chain.setNodeSelection(currentNodePos).unsetAllMarks();
    if (currentNode?.type.name !== 'paragraph') {
      chain.setParagraph();
    }
    chain.run();
  }
  function copyNodeToClipboard() {
    props.editor.chain().focus().setNodeSelection(currentNodePos).run();
    document.execCommand('copy');
  }
  function duplicateNode() {
    props.editor.commands.setNodeSelection(currentNodePos);
    const { $anchor } = props.editor.state.selection;
    const selectedNode = $anchor.node(1) || (props.editor.state.selection as NodeSelection).node;
    props.editor
      .chain()
      .setMeta('hideDragHandle', true)
      .insertContentAt(currentNodePos + (currentNode?.nodeSize || 0), selectedNode.toJSON())
      .run();
  }
  function setTextAlign(alignments: string) {
    props.editor.commands.setTextAlign(alignments);
  }
  function increaseIndent() {
    const indentTr = setNodeIndentMarkup(props.editor.state.tr, currentNodePos, 1);
    indentTr.setMeta('hideDragHandle', true);
    if (props.editor.view.dispatch)
      props.editor.view.dispatch(indentTr);
  }
  function decreaseIndent() {
    const tr = setNodeIndentMarkup(props.editor.state.tr, currentNodePos, -1);
    if (props.editor.view.dispatch)
      props.editor.view.dispatch(tr);
  }

  function deleteNode() {
    props.editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();
  }

  function handleNodeChange(e: any) {
    if (e.node) {
      setCurrentNode(e.node);
    }
    setCurrentNodePos(e.pos);
  }

  function handleAdd() {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize || 0;
      const insertPos = currentNodePos + currentNodeSize;
      const currentNodeIsEmptyParagraph
        = currentNode?.type.name === 'paragraph' && currentNode?.content?.size === 0;
      const focusPos = currentNodeIsEmptyParagraph ? currentNodePos + 2 : insertPos + 2;
      props.editor
        .chain()
        .command(({ dispatch, tr, state }: any) => {
          if (dispatch) {
            if (currentNodeIsEmptyParagraph) {
              tr.insertText('/', currentNodePos, currentNodePos + 1);
            } else {
              tr.insert(
                insertPos,
                state.schema.nodes.paragraph.create(null, [state.schema.text('/')]),
              );
            }

            return dispatch(tr);
          }

          return true;
        })
        .focus(focusPos)
        .run();
    }
  }

  useEffect(() => {
    if (menuOpen) {
      props.editor.commands.setMeta('lockDragHandle', true);
    } else {
      props.editor.commands.setMeta('lockDragHandle', false);
    }

    return () => {
      props.editor.commands.setMeta('lockDragHandle', false);
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (pluginRef.current) {
        props.editor.unregisterPlugin(pluginKey);
        pluginRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (props.editor?.isDestroyed && pluginRef.current) {
      props.editor.unregisterPlugin(pluginKey);
      pluginRef.current = null;
    }
  }, [props.editor?.isDestroyed]);

  const handleMenuOpenChange = (open: any) => {
    if (props?.disabled) {
      return;
    }
    setMenuOpen(open);
  };

  return (
    <div
      ref={dragElement}
      className={
        `drag-handle richtext-duration-200 richtext-ease-in-out [transition-property:top,_left] ${props?.className}`
      }
      style={{
        opacity: props?.disabled ? 0 : 1,
      }}
    >
      <div className="richtext-flex richtext-items-center richtext-gap-0.5 richtext-duration-200 richtext-ease-in-out [transition-property:top,_left]">
        <Button
          className="!richtext-size-7 richtext-cursor-grab"
          disabled={props?.disabled}
          onClick={handleAdd}
          size="icon"
          type="button"
          variant="ghost"
        >
          <IconComponent className="richtext-text-lg richtext-text-neutral-600 dark:richtext-text-neutral-200"
            name="Plus"
          />
        </Button>

        <DropdownMenu onOpenChange={handleMenuOpenChange}
          open={menuOpen}
        >
          <div className="richtext-relative richtext-flex richtext-flex-col">
            <Tooltip>
              <TooltipTrigger asChild
                disabled={props?.disabled}
              >
                <Button
                  className="richtext-relative richtext-z-[1] !richtext-size-7 richtext-cursor-grab"
                  disabled={props?.disabled}
                  size="icon"
                  type="button"
                  variant="ghost"
                  onMouseUp={(e) => {
                    e.preventDefault();
                    if (props?.disabled) {
                      return;
                    }
                    setMenuOpen(true);
                  }}
                >
                  <IconComponent className="richtext-text-sm richtext-text-neutral-600 dark:richtext-text-neutral-200"
                    name="Grip"
                  />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                {t('editor.draghandle.tooltip')}
              </TooltipContent>
            </Tooltip>

            <DropdownMenuTrigger className="richtext-absolute richtext-left-0 richtext-top-0 richtext-z-0 richtext-size-[28px]" />
          </div>

          <DropdownMenuContent align="start"
            className="richtext-w-48"
            side="bottom"
            sideOffset={0}
          >
            <DropdownMenuItem
              className="richtext-flex richtext-gap-3 richtext-bg-opacity-10 hover:richtext-bg-red-400 hover:richtext-bg-opacity-20 focus:richtext-bg-red-400 focus:richtext-bg-opacity-30 focus:richtext-text-red-500 dark:hover:richtext-bg-opacity-20 dark:hover:richtext-text-red-500"
              onClick={deleteNode}
            >
              <IconComponent name="Trash2" />

              <span>
                {t('editor.remove')}
              </span>
            </DropdownMenuItem>

            {hasClearExtension
              ? (
                <DropdownMenuItem className="richtext-flex richtext-gap-3"
                  onClick={resetTextFormatting}
                >
                  <IconComponent name="PaintRoller" />

                  <span>
                    {t('editor.clear.tooltip')}
                  </span>
                </DropdownMenuItem>
              )
              : null}

            <DropdownMenuItem className="richtext-flex richtext-gap-3"
              onClick={copyNodeToClipboard}
            >
              <IconComponent name="Clipboard" />

              <span>
                {t('editor.copyToClipboard')}
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem className="richtext-flex richtext-gap-3"
              onClick={duplicateNode}
            >
              <IconComponent name="Copy" />

              <span>
                {t('editor.copy')}
              </span>
            </DropdownMenuItem>

            {hasTextAlignExtension || hasIndentExtension
              ? (
                <DropdownMenuSeparator />
              )
              : null}

            {hasTextAlignExtension
              ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="richtext-flex richtext-gap-3">
                    <IconComponent name="AlignCenter" />

                    <span>
                      {t('editor.textalign.tooltip')}
                    </span>
                  </DropdownMenuSubTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem className="richtext-flex richtext-gap-3"
                        onClick={() => setTextAlign('left')}
                      >
                        <IconComponent name="AlignLeft" />

                        <span>
                          {t('editor.textalign.left.tooltip')}
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="richtext-flex richtext-gap-3"
                        onClick={() => setTextAlign('center')}
                      >
                        <IconComponent name="AlignCenter" />

                        <span>
                          {t('editor.textalign.center.tooltip')}
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="richtext-flex richtext-gap-3"
                        onClick={() => setTextAlign('right')}
                      >
                        <IconComponent name="AlignRight" />

                        <span>
                          {t('editor.textalign.right.tooltip')}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )
              : null}

            {hasIndentExtension
              ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="richtext-flex richtext-gap-3">
                    <IconComponent name="IndentIncrease" />

                    <span>
                      {t('editor.indent')}
                    </span>
                  </DropdownMenuSubTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        className="richtext-flex richtext-gap-3"
                        disabled={currentNode?.attrs?.indent >= IndentProps.max}
                        onClick={increaseIndent}
                      >
                        <IconComponent name="IndentIncrease" />

                        <span>
                          {t('editor.indent.tooltip')}
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="richtext-flex richtext-gap-3"
                        disabled={currentNode?.attrs?.indent <= IndentProps.min}
                        onClick={decreaseIndent}
                      >
                        <IconComponent name="IndentDecrease" />

                        <span>
                          {t('editor.outdent.tooltip')}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )
              : null}

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export { ContentMenu };
