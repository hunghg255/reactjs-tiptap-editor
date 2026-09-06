import { useEffect, useState } from 'react';

import { Button, Input, Label } from '@/components';
import { Twitter } from '@/extensions/Twitter/Twitter';
import { useLocale } from '@/locales';

interface IPropsFormEditLinkTwitter {
  editor: import('@tiptap/core').Editor;
  onSetLink: (src: string) => void;
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    props?.onSetLink(src);
  }

  return (
    <form className='richtext-flex richtext-flex-col richtext-gap-2' onSubmit={handleSubmit}>
      <Label className='mb-[6px]'>{t('editor.link.dialog.text')}</Label>

      <div className='richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5'>
        <div className='richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center'>
          <Input
            className='richtext-w-80'
            onChange={(e) => setSrc(e.currentTarget.value)}
            placeholder='Text'
            required
            type='text'
            value={src}
          />
        </div>
      </div>

      <Button className='richtext-mt-2 richtext-self-end' type='submit'>
        {t('editor.link.dialog.button.apply')}
      </Button>
    </form>
  );
}

export default FormEditLinkTwitter;
