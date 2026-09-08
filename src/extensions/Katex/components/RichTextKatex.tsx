import { useCallback, useState } from 'react';

import { ActionButton, Button, Label } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { KatexPreview } from '@/extensions/Katex/components/KatexPreview';
import { Katex } from '@/extensions/Katex/Katex';
import { useToggleActive } from '@/hooks/useActive';
import { useAttributes } from '@/hooks/useAttributes';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';

import type { IKatexAttrs } from '@/extensions/Katex/Katex';

export function RichTextKatex() {
  const { t } = useLocale();
  const katexExtension = useExtension(Katex.name);
  const [visible, toggleVisible] = useState(false);

  const buttonProps = useButtonProps(Katex.name);

  const {
    icon = undefined,
    tooltip = undefined,
    tooltipOptions = {},
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive(isActive);

  const editor = useEditorInstance();

  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    macros: '',
  });
  const { text, macros } = attrs;

  const [currentValue, setCurrentValue] = useState(decodeURIComponent(text || ''));
  const [currentMacros, setCurrentMacros] = useState(decodeURIComponent(macros || ''));

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
  }, [editor, currentValue, currentMacros]);

  return (
    <Dialog onOpenChange={toggleVisible} open={visible}>
      <DialogTrigger asChild disabled={editorDisabled}>
        <ActionButton
          disabled={editorDisabled}
          icon={icon}
          tooltip={tooltip}
          tooltipOptions={tooltipOptions}
          action={() => {
            if (editorDisabled) return;
            toggleVisible(true);
          }}
        />
      </DialogTrigger>

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
                className='richtext-flex-1'
                placeholder='Macros'
                rows={10}
                value={currentMacros}
                onChange={(e) => {
                  setCurrentMacros(e.currentTarget.value);
                }}
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
