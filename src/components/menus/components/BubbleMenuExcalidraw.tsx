import { useCallback, useEffect } from 'react';

// import { BubbleMenu } from '@tiptap/react/menus';

import { BubbleMenu } from '@tiptap/react/menus';

import { ActionButton } from '@/components/ActionButton';
import { SizeSetter } from '@/components/SizeSetter/SizeSetter';
import type { IExcalidrawAttrs } from '@/extensions/Excalidraw';
import { Excalidraw } from '@/extensions/Excalidraw';
import { useAttributes } from '@/hooks/useAttributes';
import { useLocale } from '@/locales';
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
      options={{
        // popperOptions: {
        //   modifiers: [{ name: 'flip', enabled: false }],
        // },
        // offset: [-2, 16],
        placement: 'bottom-start',
        offset: {
          alignmentAxis: 6,
          crossAxis: 6,
        },
        // zIndex: 9999,
        // onHidden: () => {
        //   toggleVisible(false)
        // },
      }}
    >
      <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">

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
