import React, { useEffect, useState } from 'react';

import Icon from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocale } from '@/locales';

interface IPropsLinkEditBlock {
  editor: any;
  onSetLink: (link: string, text?: string, openInNewTab?: boolean) => void;
}

const LinkEditBlock = (props: IPropsLinkEditBlock) => {
  const { t } = useLocale();

  const [form, setForm] = useState({
    text: '',
    link: '',
  });
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(false);

  useEffect(() => {
    if (props?.editor) {
      const { href: link, target } = props.editor?.getAttributes('link');

      const { from, to } = props.editor.state.selection;
      const text = props.editor.state.doc.textBetween(from, to, ' ');
      setForm({
        link,
        text,
      });
      setOpenInNewTab(target === '_blank');
    }
  }, [props?.editor]);

  function handleSubmit(event: any) {
    event.preventDefault();
    props?.onSetLink(form.link, form.text, openInNewTab);
  }

  return (
    <div className='p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800'>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <Label> {t('editor.link.dialog.text')} </Label>
        <div className='flex w-full max-w-sm items-center gap-1.5'>
          <div className='relative w-full max-w-sm items-center'>
            <Input
              type='text'
              value={form.text}
              required
              className='w-80'
              placeholder='Text'
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </div>
        </div>
        <Label>{t('editor.link.dialog.link')}</Label>
        <div className='flex w-full max-w-sm items-center gap-1.5'>
          <div className='relative w-full max-w-sm items-center'>
            <Input
              type='url'
              value={form.link}
              required
              className='pl-10'
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <span className='absolute start-0 inset-y-0 flex items-center justify-center px-2'>
              <Icon className='size-5 text-muted-foreground' name='Link' />
            </span>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Label>{t('editor.link.dialog.openInNewTab')}</Label>
          <Switch
            checked={openInNewTab}
            onCheckedChange={(e) => {
              setOpenInNewTab(e);
            }}
          />
        </div>
        <Button type='submit' className='mt-2 self-end'>
          {t('editor.link.dialog.button.apply')}
        </Button>
      </form>
    </div>
  );
};

export default LinkEditBlock;
