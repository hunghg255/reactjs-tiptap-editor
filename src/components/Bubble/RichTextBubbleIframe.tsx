import { useCallback, useEffect, useState } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';

import { ActionButton } from '@/components/ActionButton';
import { SizeSetter } from '@/components/SizeSetter/SizeSetter';
import { Button, Input } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Iframe } from '@/extensions/Iframe';
import { getServiceSrc } from '@/extensions/Iframe/utils';
import { useAttributes } from '@/hooks/useAttributes';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';
import { deleteNode } from '@/utils/delete-node';

interface IIframeAttrs {
  width?: number | string
  height?: number
  src?: string
  defaultShowPicker?: boolean
}

export function RichTextBubbleIframe() {
  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const { t } = useLocale();
  const { width, height, src } = useAttributes<IIframeAttrs>(editor, Iframe.name, {
    width: 0,
    height: 0,
    src: '',
    defaultShowPicker: false,
  });
  const [visible, toggleVisible] = useState(false);
  const [formUrl, setFormUrl] = useState('');

  const handleCancel = useCallback((e: any) => {
    e?.preventDefault?.();

    toggleVisible(false);
  }, [toggleVisible]);

  useEffect(() => {
    if (visible)
      setFormUrl(src as any);
  }, [visible, src]);

  const handleOk = useCallback((e: any) => {
    e?.preventDefault?.();

    const urlFormat = getServiceSrc(formUrl);

    editor
      .chain()
      .updateAttributes(Iframe.name, {
        src: urlFormat?.src || formUrl,
      })
      .setNodeSelection(editor.state.selection.from)
      .focus()
      .run();
    toggleVisible(false);
  }, [editor, formUrl, toggleVisible]);

  const visitLink = useCallback(() => {
    window.open(src, '_blank');
  }, [src]);

  const setSize = useCallback(
    (size: any) => {
      editor.chain().updateAttributes(Iframe.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor],
  );

  const shouldShow = useCallback(() => editor.isActive(Iframe.name) && !src, [editor, src]);

  const deleteMe = useCallback(() => deleteNode(Iframe.name, editor), [editor]);

  if (!editable) {
    return <></>;
  }

  return (
    <>
      <BubbleMenu
        editor={editor}
        options={{ placement: 'bottom', offset: 8, flip: true }}
        pluginKey={'RichTextBubbleIframe'}
        shouldShow={shouldShow}
      >

        <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
          <ActionButton
            action={visitLink}
            icon="Eye"
            tooltip="Visit Link"
          />

          <Dialog
            onOpenChange={toggleVisible}
            open={visible}
          >
            <DialogTrigger asChild>
              <ActionButton
                icon="Pencil"
                tooltip="Open Edit Link"
              />
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Edit Link Iframe
                </DialogTitle>
              </DialogHeader>

              <Input
                autoFocus
                onInput={(e: any) => setFormUrl(e.target.value)}
                placeholder="Enter link"
                type="url"
                value={formUrl}
              />

              <DialogFooter>
                <Button onClick={handleCancel}
                  type='button'
                >
                  Cancel
                </Button>

                <Button onClick={handleOk}
                  type='button'
                >
                  OK
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <SizeSetter height={height as any}
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

    </>
  );
}
