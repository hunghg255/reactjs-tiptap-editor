import { useCallback, useEffect } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';

import { ActionButton } from '@/components/ActionButton';
import { emit } from '@/components/ReactBus';
import { SizeSetter } from '@/components/SizeSetter/SizeSetter';
import type { IExcalidrawAttrs } from '@/extensions/Excalidraw';
import { Excalidraw } from '@/extensions/Excalidraw';
import { useAttributes } from '@/hooks/useAttributes';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';
import { EVENTS } from '@/utils/customEvents/events.constant';
import { deleteNode } from '@/utils/delete-node';
import { getEditorContainerDOMSize } from '@/utils/editor-container-size';

export function RichTextBubbleExcalidraw() {
  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const { t } = useLocale();
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const attrs = useAttributes<IExcalidrawAttrs>(editor, Excalidraw.name, {
    defaultShowPicker: false,
    createUser: '',
    width: 0,
    height: 0,
  });
  const { defaultShowPicker, createUser, width, height } = attrs;

  const setSize = useCallback(
    (size: any) => {
      editor
        .chain()
        .updateAttributes(Excalidraw.name, size)
        .setNodeSelection(editor.state.selection.from)
        .focus()
        .run();
    },
    [editor],
  );

  const openEditLinkModal = useCallback(() => {
    const EVENT_ID = EVENTS.EXCALIDRAW((editor as any).id);
    emit(EVENT_ID, attrs);
  }, [editor, attrs]);

  const shouldShow = useCallback(() => editor.isActive(Excalidraw.name), [editor]);
  const deleteMe = useCallback(() => deleteNode(Excalidraw.name, editor), [editor]);

  useEffect(() => {
    if (defaultShowPicker) {
      openEditLinkModal();
      editor.chain().updateAttributes(Excalidraw.name, { defaultShowPicker: false }).focus().run();
    }
  }, [createUser, defaultShowPicker, editor, openEditLinkModal]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'bottom', offset: 8, flip: true }}
      pluginKey={'RichTextBubbleExcalidraw'}
      shouldShow={shouldShow}
    >
      <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
        <ActionButton
          action={openEditLinkModal}
          icon="Pencil"
          tooltip={t('editor.edit')}
        />

        <SizeSetter height={height as any}
          maxWidth={maxWidth}
          onOk={setSize}
          width={width as any}
        >
          <ActionButton
            icon="Settings"
            tooltip={t('editor.settings')}
          />
        </SizeSetter>

        <ActionButton
          action={deleteMe}
          icon="Trash2"
          tooltip={t('editor.delete')}
        />
      </div>
    </BubbleMenu>
  );
}
