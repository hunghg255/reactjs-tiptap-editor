import { useCallback, useEffect, useMemo, useState } from 'react';

import katexLib from 'katex';

import { ActionButton, Button } from '@/components';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { IKatexAttrs } from '@/extensions/Katex/Katex';
import { Katex } from '@/extensions/Katex/Katex';
import { useToggleActive } from '@/hooks/useActive';
import { useAttributes } from '@/hooks/useAttributes';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';

export function RichTextKatex() {
  const { t } = useLocale();
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
    defaultShowPicker: false,
  });
  const { text, defaultShowPicker } = attrs;

  const [currentValue, setCurrentValue] = useState(text || '');

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: currentValue }).run();
    setCurrentValue('');
    toggleVisible(false);
  }, [editor, currentValue]);

  useEffect(() => {
    if (defaultShowPicker) {
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run();
    }
  }, [editor, defaultShowPicker]);

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
      disabled={editorDisabled}
      >
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
