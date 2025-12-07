import { useCallback, useState } from 'react';

import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import { ActionButton } from '@/components/ActionButton';
import { Twitter } from '@/extensions/Twitter';
import FormEditLinkTwitter from '@/extensions/Twitter/components/FormEditLinkTwitter';
import { useLocale } from '@/locales';
import { deleteNode } from '@/utils/delete-node';
import { useEditableEditor } from '@/store/store';
import { useEditorInstance } from '@/store/editor';

export function RichTextBubbleTwitter() {
  const { t } = useLocale();
  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const [showEdit, setShowEdit] = useState(false);

  const shouldShow = useCallback(({ editor }: { editor: Editor }) => {
    const isActive = editor.isActive(Twitter.name);
    return isActive;
  }, []);

  const onSetLink = (src: string) => {
    editor.commands.updateTweet({ src });
    setShowEdit(false);
  };

  const deleteMe = useCallback(() => deleteNode(Twitter.name, editor), [editor]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      options={{ placement: 'bottom', offset: 8, flip: true }}
    >
      <>
        {showEdit
          ? (
            <FormEditLinkTwitter
              editor={editor}
              onSetLink={onSetLink}
            />
          )
          : (
            <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-lg !richtext-border richtext-border-neutral-200 richtext-bg-white richtext-p-2 richtext-shadow-sm dark:richtext-border-neutral-800 dark:richtext-bg-black">
              <div className="richtext-flex richtext-flex-nowrap">
                <ActionButton
                  icon="Pencil"
                  tooltip={t('editor.link.edit.tooltip')}
                  tooltipOptions={{ sideOffset: 15 }}
                  action={() => {
                    setShowEdit(true);
                  }}
                />

                <ActionButton
                  action={deleteMe}
                  icon="Trash"
                  tooltip={t('editor.delete')}
                  tooltipOptions={{ sideOffset: 15 }}
                />
              </div>
            </div>
          )}
      </>
    </BubbleMenu>
  );
}
