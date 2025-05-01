import { useCallback, useEffect, useState } from 'react';

import { BubbleMenu } from '@tiptap/react';

import { ActionButton } from '@/components/ActionButton';
import { SizeSetter } from '@/components/SizeSetter/SizeSetter';
import { Button, Input } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { IIframeAttrs } from '@/extensions/Iframe';
import { Iframe } from '@/extensions/Iframe';
import { getServiceSrc } from '@/extensions/Iframe/embed';
import { useAttributes } from '@/hooks/useAttributes';
import { useLocale } from '@/locales';
import { deleteNode } from '@/utils/delete-node';

export function BubbleMenuIframe({ editor }: any) {
  const { t } = useLocale();
  const { width, height, src } = useAttributes<IIframeAttrs>(editor, Iframe.name, {
    width: 0,
    height: 0,
    src: '',
    defaultShowPicker: false,
  });
  const [visible, toggleVisible] = useState(false);
  const [formUrl, setFormUrl] = useState('');

  const handleCancel = useCallback(() => {
    toggleVisible(false);
  }, [toggleVisible]);

  useEffect(() => {
    if (visible)
      setFormUrl(src as any);
  }, [visible, src]);

  const handleOk = useCallback(() => {
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

  const openEditLinkModal = useCallback(() => {
    toggleVisible(true);
  }, [toggleVisible]);

  const setSize = useCallback(
    (size: any) => {
      editor.chain().updateAttributes(Iframe.name, size).setNodeSelection(editor.state.selection.from).focus().run();
    },
    [editor],
  );
  const shouldShow = useCallback(() => editor.isActive(Iframe.name) && !src, [editor, src]);
  const deleteMe = useCallback(() => deleteNode(Iframe.name, editor), [editor]);

  return (
    <>
      <BubbleMenu
        className="bubble-menu"
        editor={editor}
        pluginKey="iframe-bubble-menu"
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

        <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
          <ActionButton
            action={visitLink}
            icon="Eye"
            tooltip="Visit Link"
          />

          <ActionButton
            action={openEditLinkModal}
            icon="Pencil"
            tooltip="Open Edit Link"
          />

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

      <Dialog
        onOpenChange={toggleVisible}
        open={visible}
      >
        <DialogTrigger />

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
            <Button onClick={handleCancel}>
              Cancel
            </Button>

            <Button onClick={handleOk}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
