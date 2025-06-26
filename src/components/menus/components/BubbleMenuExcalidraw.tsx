import { useCallback, useEffect } from 'react';

import { BubbleMenu } from '@tiptap/react';
import { useAttributes } from '@/hooks/useAttributes';
import { ActionButton } from '@/components/ActionButton';
import { SizeSetter } from '@/components/SizeSetter/SizeSetter';
import { useLocale } from '@/locales';
import type { IExcalidrawAttrs } from '@/extensions/Excalidraw';
import { Excalidraw } from '@/extensions/Excalidraw';
import { triggerOpenExcalidrawSettingModal } from '@/utils/_event';
import { deleteNode } from '@/utils/delete-node';
import { getEditorContainerDOMSize } from '@/utils/editor-container-size';

export function BubbleMenuExcalidraw({ editor }: any) {
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
    triggerOpenExcalidrawSettingModal({ ...attrs, editor });
  }, [editor, attrs]);
  const shouldShow = useCallback(() => editor.isActive(Excalidraw.name), [editor]);
  const deleteMe = useCallback(() => deleteNode(Excalidraw.name, editor), [editor]);

  useEffect(() => {
    if (defaultShowPicker) {
      openEditLinkModal();
      editor.chain().updateAttributes(Excalidraw.name, { defaultShowPicker: false }).focus().run();
    }
  }, [createUser, defaultShowPicker, editor, openEditLinkModal]);

  return (
    <BubbleMenu
      className="bubble-menu"
      editor={editor}
      pluginKey="excalidraw-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        placement: 'bottom-start',
        offset: [-2, 16],
        zIndex: 9999,
        // onHidden: () => {
        //   toggleVisible(false)
        // },
      }}
    >
      <div className="richtext-w-auto richtext-px-3 richtext-py-2 richtext-transition-all !richtext-border richtext-rounded-sm richtext-shadow-sm richtext-pointer-events-auto richtext-select-none richtext-border-neutral-200 dark:richtext-border-neutral-800 richtext-bg-background">

        <ActionButton
          icon="Pencil"
          action={openEditLinkModal}
          tooltip={t('editor.edit')}
        />

        <SizeSetter width={width as any} maxWidth={maxWidth} height={height as any} onOk={setSize}>
          <ActionButton
            icon="Settings"
            tooltip={t('editor.settings')}
          />
        </SizeSetter>

        <ActionButton
          icon="Trash2"
          action={deleteMe}
          tooltip={t('editor.delete')}
        />

      </div>
    </BubbleMenu>
  );
}
