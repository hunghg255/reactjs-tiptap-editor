import { BubbleMenu } from '@tiptap/react/menus';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { ActionButton } from '@/components/ActionButton';
import { Button, Label } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Katex } from '@/extensions/Katex';
import { KatexPreview } from '@/extensions/Katex/components/KatexPreview';
import { useAttributes } from '@/hooks/useAttributes';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';
import { deleteNode } from '@/utils/delete-node';

import type { IKatexAttrs } from '@/extensions/Katex';

function ModalEditKatex({
  children,
  visible,
  toggleVisible,
}: {
  children: React.ReactNode;
  visible: boolean;
  toggleVisible: (visible: boolean) => void;
}) {
  const { t } = useLocale();
  const katexExtension = useExtension(Katex.name);

  const editor = useEditorInstance();

  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    macros: '',
  });

  const { text, macros } = attrs;

  const [currentValue, setCurrentValue] = useState(decodeURIComponent(text || ''));

  const [currentMacros, setCurrentMacros] = useState(decodeURIComponent(macros || ''));

  useEffect(() => {
    if (visible) {
      setCurrentValue(decodeURIComponent(text || ''));
      setCurrentMacros(decodeURIComponent(macros || ''));
    }
  }, [visible, text, macros]);

  const submit = useCallback(() => {
    editor
      .chain()
      .focus()
      .setKatex({
        text: encodeURIComponent(currentValue),
        macros: encodeURIComponent(currentMacros),
      })
      .run();
    setCurrentValue('');
    setCurrentMacros('');
    toggleVisible(false);
  }, [editor, currentValue, currentMacros, toggleVisible]);

  return (
    <Dialog onOpenChange={toggleVisible} open={visible}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='richtext-z-[99999] !richtext-max-w-[1300px]'>
        <DialogTitle>{t('editor.formula.dialog.text')}</DialogTitle>

        <div style={{ height: '100%', border: '1px solid hsl(var(--border))' }}>
          <div className='richtext-flex richtext-gap-[10px] richtext-rounded-[10px] richtext-p-[10px]'>
            <div className='richtext-flex-1'>
              <Label className='mb-[6px]'>Expression</Label>

              <Textarea
                autoFocus
                className='richtext-mb-[10px]'
                onChange={(e) => setCurrentValue(e.currentTarget.value)}
                placeholder='Text'
                required
                rows={10}
                value={currentValue}
                style={{
                  color: 'hsl(var(--foreground))',
                }}
              />

              <Label className='mb-[6px]'>Macros</Label>

              <Textarea
                onChange={(e) => setCurrentMacros(e.currentTarget.value)}
                placeholder='Macros'
                rows={10}
                value={currentMacros}
                style={{
                  color: 'hsl(var(--foreground))',
                }}
              />
            </div>

            <div
              className='richtext-flex richtext-flex-1 richtext-items-center richtext-justify-center richtext-rounded-[10px] richtext-p-[10px]'
              style={{
                height: '100%',
                borderWidth: 1,
                minHeight: 500,
                background: '#fff',
              }}
            >
              {visible && (
                <KatexPreview
                  text={currentValue}
                  macros={currentMacros}
                  loader={katexExtension?.options.loadKatex}
                />
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={submit} type='button'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RichTextBubbleKatex() {
  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const [visible, toggleVisible] = useState(false);

  const shouldShow = useCallback(() => {
    return editor.isActive(Katex.name);
  }, [editor]);

  const deleteMe = useCallback(() => deleteNode(Katex.name, editor), [editor]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'bottom', offset: 8, flip: true }}
      pluginKey={'RichTextBubbleKatex'}
      shouldShow={shouldShow}
    >
      <div className='richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none'>
        <ModalEditKatex toggleVisible={toggleVisible} visible={visible}>
          <ActionButton action={() => toggleVisible(!visible)} tooltip='Edit'>
            <Pencil size={16} />
          </ActionButton>
        </ModalEditKatex>

        <ActionButton action={deleteMe} tooltip='Delete'>
          <Trash2 size={16} />
        </ActionButton>
      </div>
    </BubbleMenu>
  );
}
