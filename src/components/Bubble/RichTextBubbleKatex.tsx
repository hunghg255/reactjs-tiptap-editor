import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';
import katexLib from 'katex';
import { Pencil, Trash2 } from 'lucide-react';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Katex } from '@/extensions/Katex';
import type { IKatexAttrs } from '@/extensions/Katex';
import { useAttributes } from '@/hooks/useAttributes';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';
import { deleteNode } from '@/utils/delete-node';

function ModalEditKatex({
  children,
  visible,
  toggleVisible,
}: any) {
  const { t } = useLocale();

  const editor = useEditorInstance();

  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    defaultShowPicker: false,
  });
  const { text, defaultShowPicker } = attrs;

  const [currentValue, setCurrentValue] = useState(text || '');

  useEffect(() => {
    if (visible) setCurrentValue(text || '');
  }, [visible]);

  useEffect(() => {
    if (defaultShowPicker) {
      toggleVisible(true);
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run();
    }
  }, [editor, defaultShowPicker, toggleVisible]);

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: currentValue }).run();
    setCurrentValue('');
    toggleVisible(false);
  }, [editor, currentValue, toggleVisible]);

  const formatText = useMemo(() => {
    try {
      return katexLib.renderToString(`${currentValue}`);
    } catch {
      return currentValue;
    }
  }, [currentValue]);

  const previewContent = useMemo(
    () => {
      if (`${currentValue}`.trim()) {
        return formatText;
      }

      return null;
    },
    [currentValue, formatText],
  );

  return (
    <Dialog
      onOpenChange={toggleVisible}
      open={visible}
    >
      <DialogTrigger
        asChild
      >
        {children}
      </DialogTrigger>

      <DialogContent className="richtext-z-[99999] !richtext-max-w-[1300px]">
        <DialogTitle>
          {t('editor.formula.dialog.text')}
        </DialogTitle>

        <div
          style={{ height: '100%', border: '1px solid hsl(var(--border))' }}
        >
          <div className="richtext-flex richtext-gap-[10px] richtext-rounded-[10px] richtext-p-[10px]">
            <Textarea
              autoFocus
              className="richtext-flex-1"
              onChange={e => setCurrentValue(e.target.value)}
              placeholder="Text"

              required
              rows={10}
              value={currentValue}
              style={{
                color: 'hsl(var(--foreground))',
              }}
            />

            <div
              className="richtext-flex richtext-flex-1 richtext-items-center richtext-justify-center richtext-rounded-[10px] richtext-p-[10px]"
              dangerouslySetInnerHTML={{ __html: previewContent || '' }}
              style={{ height: '100%', borderWidth: 1, minHeight: 500, background: '#fff' }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={submit}
            type="button"
          >
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
      <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
        <ModalEditKatex
          toggleVisible={toggleVisible}
          visible={visible}
        >
          <ActionButton action={() => toggleVisible(!visible)}
            tooltip="Edit"
          >
            <Pencil size={16} />
          </ActionButton>
        </ModalEditKatex>

        <ActionButton action={deleteMe}
          tooltip="Delete"
        >
          <Trash2 size={16} />
        </ActionButton>
      </div>
    </BubbleMenu>
  );
}
