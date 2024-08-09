/* eslint-disable unicorn/no-null */
/* eslint-disable import/named */
import React, { useEffect, useRef, useState } from 'react';

import { Node } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { DragHandlePlugin } from 'echo-drag-handle-plugin';

import Icon from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocale } from '@/locales';
import { IndentProps, setNodeIndentMarkup } from '@/utils/indent';

const ContentMenu = (props: any) => {
  const { t } = useLocale();
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [currentNodePos, setCurrentNodePos] = useState(-1);
  const dragElement = useRef(null);
  const pluginRef = useRef<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  function handleNodeChange(e: any) {
    if (e.node) {
      setCurrentNode(e.node);
    }
    setCurrentNodePos(e.pos);
  }

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
    props.editor.view.dispatch && props.editor.view.dispatch(indentTr);
  }
  function decreaseIndent() {
    const tr = setNodeIndentMarkup(props.editor.state.tr, currentNodePos, -1);
    props.editor.view.dispatch && props.editor.view.dispatch(tr);
  }

  function deleteNode() {
    props.editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();
  }

  const handleMenuOpenChange = (open: any) => {
    setMenuOpen(open);
  };

  useEffect(() => {
    if (menuOpen) {
      props.editor.commands.setMeta('lockDragHandle', true);
    } else {
      props.editor.commands.setMeta('lockDragHandle', false);
    }
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (pluginRef.current) {
        props.editor.unregisterPlugin(pluginRef.current);
        pluginRef.current = null;
      }
    };
  }, []);

  function handleAdd() {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize || 0;
      const insertPos = currentNodePos + currentNodeSize;
      const currentNodeIsEmptyParagraph =
        currentNode?.type.name === 'paragraph' && currentNode?.content?.size === 0;
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

  return (
    <>
      <div
        className={'[transition-property:top,_left] ease-in-out duration-200 ' + props?.className}
        style={{
          opacity: props?.disabled ? 0 : 1,
        }}
        ref={dragElement}
      >
        <div className='flex items-center gap-0.5 [transition-property:top,_left] ease-in-out duration-200'>
          <Button
            variant='ghost'
            size='icon'
            className='w-7 h-7 cursor-grab'
            disabled={props?.disabled}
            onClick={handleAdd}
          >
            <Icon name='Plus' className='text-lg text-neutral-600 dark:text-neutral-200' />
          </Button>
          <DropdownMenu open={menuOpen} onOpenChange={handleMenuOpenChange}>
            <DropdownMenuTrigger disabled={props?.disabled}>
              <Tooltip>
                <TooltipTrigger asChild disabled={props?.disabled}>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='w-7 h-7 cursor-grab'
                    disabled={props?.disabled}
                  >
                    <Icon name='Grip' className='text-sm dark:text-neutral-200 text-neutral-600' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('editor.draghandle.tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48' align='start' side='bottom' sideOffset={0}>
              <DropdownMenuItem
                onClick={deleteNode}
                className='flex gap-3 focus:text-red-500 focus:bg-red-400 hover:bg-red-400 dark:hover:text-red-500 bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-30 dark:hover:bg-opacity-20'
              >
                <Icon name='Trash2' />
                <span>{t('editor.remove')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex gap-3' onClick={resetTextFormatting}>
                <Icon name='PaintRoller' />
                <span>{t('editor.clear.tooltip')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex gap-3' onClick={copyNodeToClipboard}>
                <Icon name='Clipboard' />
                <span>{t('editor.copyToClipboard')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex gap-3' onClick={duplicateNode}>
                <Icon name='Copy' />
                <span>{t('editor.copy')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='flex gap-3'>
                  <Icon name='AlignCenter' />
                  <span>{t('editor.textalign.tooltip')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem className='flex gap-3' onClick={() => setTextAlign('left')}>
                      <Icon name='AlignLeft' />
                      <span>{t('editor.textalign.left.tooltip')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className='flex gap-3' onClick={() => setTextAlign('center')}>
                      <Icon name='AlignCenter' />
                      <span>{t('editor.textalign.center.tooltip')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className='flex gap-3' onClick={() => setTextAlign('right')}>
                      <Icon name='AlignRight' />
                      <span>{t('editor.textalign.right.tooltip')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='flex gap-3'>
                  <Icon name='IndentIncrease' />
                  <span>{t('editor.indent')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      className='flex gap-3'
                      onClick={increaseIndent}
                      disabled={currentNode?.attrs?.indent >= IndentProps.max}
                    >
                      <Icon name='IndentIncrease' />
                      <span>{t('editor.indent.tooltip')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className='flex gap-3'
                      onClick={decreaseIndent}
                      disabled={currentNode?.attrs?.indent <= IndentProps.min}
                    >
                      <Icon name='IndentDecrease' />
                      <span>{t('editor.outdent.tooltip')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default ContentMenu;
