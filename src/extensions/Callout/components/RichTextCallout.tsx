import { useState } from 'react';

import { ActionButton } from '@/components';
import { Button, Input, Label } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Callout } from '@/extensions/Callout/Callout';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';

const CALLOUT_TYPES = [
  { value: 'note', label: 'Note', icon: 'Info' },
  { value: 'tip', label: 'Tip', icon: 'Lightbulb' },
  { value: 'important', label: 'Important', icon: 'AlertCircle' },
  { value: 'warning', label: 'Warning', icon: 'TriangleAlert' },
  { value: 'caution', label: 'Caution', icon: 'OctagonAlert' },
] as const;

export function RichTextCallout() {
  const { t } = useLocale();
  const editor = useEditorInstance();
  const buttonProps = useButtonProps(Callout.name);

  const [open, setOpen] = useState(false);
  const [calloutType, setCalloutType] = useState('note');
  const [calloutTitle, setCalloutTitle] = useState('');
  const [calloutBody, setCalloutBody] = useState('');

  const {
    icon = undefined,
    tooltip = undefined,
    shortcutKeys = undefined,
    tooltipOptions = {},
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { dataState, disabled } = useToggleActive(isActive);

  const handleInsert = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .setCallout({ type: calloutType, title: calloutTitle, body: calloutBody })
      .run();
    setOpen(false);
    setCalloutType('note');
    setCalloutTitle('');
    setCalloutBody('');
  };

  const onAction = () => {
    if (disabled) return;
    setOpen(true);
  };

  if (!buttonProps) {
    return <></>;
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <ActionButton
          action={onAction}
          dataState={dataState}
          disabled={disabled}
          icon={icon}
          shortcutKeys={shortcutKeys}
          tooltip={tooltip}
          tooltipOptions={tooltipOptions}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{t('editor.callout.dialog.title')}</DialogTitle>

        <div className='richtext-space-y-4 richtext-py-4'>
          <div className='richtext-space-y-2'>
            <Label>{t('editor.callout.dialog.type')}</Label>

            <Select onValueChange={setCalloutType} value={calloutType}>
              <SelectTrigger>
                <SelectValue placeholder={t('editor.callout.dialog.type.placeholder')} />
              </SelectTrigger>

              <SelectContent>
                {CALLOUT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {t(`editor.callout.type.${type.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='richtext-space-y-2'>
            <Label>{t('editor.callout.dialog.title.label')}</Label>

            <Input
              onChange={(e) => setCalloutTitle(e.target.value)}
              placeholder={t('editor.callout.dialog.title.placeholder')}
              value={calloutTitle}
            />
          </div>

          <div className='richtext-space-y-2'>
            <Label>{t('editor.callout.dialog.body.label')}</Label>

            <Input
              onChange={(e) => setCalloutBody(e.target.value)}
              placeholder={t('editor.callout.dialog.body.placeholder')}
              value={calloutBody}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant='outline'>
            {t('editor.callout.dialog.button.cancel')}
          </Button>

          <Button onClick={handleInsert}>{t('editor.callout.dialog.button.apply')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
