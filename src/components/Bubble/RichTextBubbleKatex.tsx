import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';
import katexLib from 'katex';
import { Pencil, Trash2 } from 'lucide-react';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { Katex } from '@/extensions/Katex';
import type { IKatexAttrs } from '@/extensions/Katex';
import { useAttributes } from '@/hooks/useAttributes';
import { deleteNode } from '@/utils/delete-node';
import { useEditableEditor } from '@/store/store';
import { useEditorInstance } from '@/store/editor';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocale } from '@/locales';

function ModalEditKatex ({
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

  return <Dialog
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
              onChange={e => setCurrentValue(e.target.value)}
              required
              value={currentValue}

              className="richtext-flex-1"
              placeholder="Text"
              rows={10}
              style={{
                color: 'hsl(var(--richtext-foreground))',
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
  </Dialog>;
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
      shouldShow={shouldShow}
      options={{ placement: 'bottom', offset: 8, flip: true }}
    >
      <div className="richtext-rounded-lg !richtext-border richtext-border-neutral-200 richtext-bg-white richtext-p-2 richtext-shadow-sm dark:richtext-border-neutral-800 dark:richtext-bg-black">
          <div className="richtext-flex richtext-items-center richtext-justify-center richtext-gap-[6px]">
            <ModalEditKatex
              visible={visible}
              toggleVisible={toggleVisible}
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
      </div>
    </BubbleMenu>
  );
}
