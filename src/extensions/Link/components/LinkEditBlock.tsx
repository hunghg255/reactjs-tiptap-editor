/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';

import { Button, IconComponent, Input, Label, Switch } from '@/components';
import { useLocale } from '@/locales';

interface IPropsLinkEditBlock {
  editor: any
  onSetLink: (link: string, text?: string, openInNewTab?: boolean) => void
}

function LinkEditBlock(props: IPropsLinkEditBlock) {
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
    event.stopPropagation();
    props?.onSetLink(form.link, form.text, openInNewTab);
  }

  return (
    <div className="border-neutral-200 richtext-rounded-lg !richtext-border richtext-bg-white richtext-p-2 richtext-shadow-sm dark:richtext-border-neutral-800 dark:richtext-bg-black">
      <form className="richtext-flex richtext-flex-col richtext-gap-2"
        onSubmit={handleSubmit}
      >
        <Label className="mb-[6px]">
          {t('editor.link.dialog.text')}
        </Label>

        <div className="richtext-mb-[10px] richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
            <Input
              className="richtext-w-80"
              onChange={e => setForm({ ...form, text: e.target.value })}
              placeholder="Text"
              required
              type="text"
              value={form.text}
            />
          </div>
        </div>

        <Label className="mb-[6px]">
          {t('editor.link.dialog.link')}
        </Label>

        <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
            <Input
              className="richtext-pl-10"
              onChange={e => setForm({ ...form, link: e.target.value })}
              required
              type="url"
              value={form.link}
            />

            <span className="richtext-absolute richtext-inset-y-0 richtext-start-0 richtext-flex richtext-items-center richtext-justify-center richtext-px-2">
              <IconComponent className="richtext-size-5 richtext-text-muted-foreground"
                name="Link"
              />
            </span>
          </div>
        </div>

        <div className="richtext-flex richtext-items-center richtext-space-x-2">
          <Label>
            {t('editor.link.dialog.openInNewTab')}
          </Label>

          <Switch
            checked={openInNewTab}
            onCheckedChange={(e) => {
              setOpenInNewTab(e);
            }}
          />
        </div>

        <Button className="richtext-mt-2 richtext-self-end"
          type="submit"
        >
          {t('editor.link.dialog.button.apply')}
        </Button>
      </form>
    </div>
  );
}

export default LinkEditBlock;
