/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from 'react';

import { Button, Input, Label } from '@/components';
import { Twitter } from '@/extensions/Twitter/Twitter';
import { useLocale } from '@/locales';

interface IPropsFormEditLinkTwitter {
  editor: any
  onSetLink: (src: string) => void
}

function FormEditLinkTwitter(props: IPropsFormEditLinkTwitter) {
  const { t } = useLocale();

  const [src, setSrc] = useState('');

  useEffect(() => {
    if (props?.editor) {
      const { src: srcInit } = props.editor?.getAttributes(Twitter.name);

      if (srcInit) {
        setSrc(srcInit);
      }
    }
  }, [props?.editor]);

  function handleSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    props?.onSetLink(src);
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
              onChange={e => setSrc(e.target.value)}
              placeholder="Text"
              required
              type="text"
              value={src}
            />
          </div>
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

export default FormEditLinkTwitter;
