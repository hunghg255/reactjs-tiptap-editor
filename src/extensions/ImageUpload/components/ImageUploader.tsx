import React, { useRef, useState } from 'react';

import { NodeViewWrapper } from '@tiptap/react';

import Icon from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/locales';
import { createImageUpload } from '@/plugins/image-upload';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IPropsImageUploader {}

const ImageUploader = (props: any) => {
  const { t } = useLocale();

  const [link, setLink] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);

  function handleFile(event: any) {
    const files = event?.target?.files;
    if (!props.editor || props.editor.isDestroyed || files.length === 0) {
      return;
    }
    const file = files[0];
    const uploadOptions = props.editor.extensionManager.extensions.find(
      (extension: any) => extension.name === 'imageUpload',
    )?.options;

    const uploadFn = createImageUpload({
      validateFn: () => {
        return true;
      },
      onUpload: uploadOptions.upload,
    });
    uploadFn([file], props.editor.view, props.getPos());
  }
  function handleLink(e: any) {
    e.preventDefault();

    props.editor
      .chain()
      .setImage({ src: link })
      .deleteRange({ from: props.getPos(), to: props.getPos() })
      .focus()
      .run();
  }
  function handleDelete(e?: any) {
    e?.preventDefault();
    props.deleteNode();
  }
  function handleClick(e: any) {
    e.preventDefault();
    fileInput.current?.click();
  }

  return (
    <NodeViewWrapper className='p-0 m-0' data-drag-handle>
      <Popover defaultOpen modal>
        <PopoverTrigger asChild>
          <div className='flex items-center w-full p-3 my-3 hover:bg-accent border border-border text-muted-foreground cursor-pointer rounded-sm transition-all'>
            <div className='flex justify-between items-center w-full'>
              <div className='flex justify-center items-center gap-3'>
                <Icon name='ImageUp' className='w-6 h-6' />
                <span className='text-sm'>{t('editor.image.dialog.title')}</span>
              </div>
              <Icon name='Trash2' className='hover:text-foreground' onClick={handleDelete} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-full' onOpenAutoFocus={(e) => e.preventDefault()}>
          <Tabs defaultValue='upload' className='w-[400px]' activationMode='manual'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='upload'>{t('editor.image.dialog.tab.upload')} </TabsTrigger>
              <TabsTrigger value='link'> {t('editor.image.dialog.tab.url')} </TabsTrigger>
            </TabsList>
            <TabsContent value='upload'>
              <Button className='w-full mt-1' size='sm' onClick={handleClick}>
                {t('editor.image.dialog.tab.upload')}
              </Button>
              <input
                type='file'
                accept='image/*'
                ref={fileInput}
                multiple
                style={{
                  display: 'none',
                }}
                onChange={handleFile}
              />
            </TabsContent>
            <TabsContent value='link'>
              <form onSubmit={handleLink}>
                <div className='flex items-center gap-2'>
                  <Input
                    type='url'
                    autoFocus={true}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                    placeholder={t('editor.image.dialog.placeholder')}
                  />
                  <Button type='submit'>{t('editor.image.dialog.button.apply')}</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};

export default ImageUploader;
