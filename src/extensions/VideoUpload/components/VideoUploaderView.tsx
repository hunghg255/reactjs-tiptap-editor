/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable multiline-ternary */
import React, { useRef, useState } from 'react';

import { NodeViewWrapper } from '@tiptap/react';

import Icon from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/locales';

interface IPropsVideoUploaderView {}

const VideoUploaderView = (props: any) => {
  const { t } = useLocale();

  const [link, setLink] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleFile(event: any) {
    setLoading(true);
    const files = event?.target?.files;
    if (!props.editor || props.editor.isDestroyed || files.length === 0) {
      return;
    }
    const file = files[0];
    const uploadOptions = props.editor.extensionManager.extensions.find(
      (extension: any) => extension.name === 'videoUpload',
    )?.options;
    uploadOptions?.upload([file]).then((res: any) => {
      props.editor
        .chain()
        .setVideo({ src: res[0].src, width: '100%' })
        .deleteRange({ from: props.getPos(), to: props.getPos() })
        .focus()
        .run();
      setLoading(false);
    });
  }
  function handleLink(e: any) {
    e.preventDefault();

    props.editor
      .chain()
      .setVideo({
        src: link,
        width: '100%',
      })
      .deleteRange({ from: props.getPos(), to: props.getPos() })
      .focus()
      .run();
  }
  function handleDelete(e: any) {
    e.preventDefault();
    props.deleteNode();
  }
  function handleClick(e: any) {
    e.preventDefault();
    fileInput.current?.click();
  }

  return (
    <NodeViewWrapper as='div' data-drag-handle>
      <Popover defaultOpen modal>
        <PopoverTrigger asChild>
          <div className='flex items-center w-full p-3 my-3 hover:bg-accent border border-border text-muted-foreground cursor-pointer rounded-sm transition-all'>
            {loading ? (
              <div className='flex justify-center items-center gap-3 text-s'>
                <Icon className='animate-spin w-6 h-6' name='LoaderCircle' />
                <span>{t('editor.video.dialog.uploading')}...</span>
              </div>
            ) : (
              <div className='flex justify-between items-center w-full'>
                <div className='flex justify-center items-center gap-3'>
                  <Icon name='Video' className='w-6 h-6' />
                  <span className='text-sm'>{t('editor.video.dialog.title')}</span>
                </div>
                <Icon name='Trash2' className='hover:text-foreground' onClick={handleDelete} />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-full' onOpenAutoFocus={(e) => e.preventDefault()}>
          <Tabs defaultValue='upload' className='w-[400px]' activationMode='manual'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='upload'>{t('editor.video.dialog.tab.upload')} </TabsTrigger>
              <TabsTrigger value='link'> {t('editor.video.dialog.link')} </TabsTrigger>
            </TabsList>
            <TabsContent value='upload'>
              <Button className='w-full mt-1' size='sm' onClick={handleClick}>
                {t('editor.video.dialog.tab.upload')}
              </Button>
              <input
                type='file'
                accept='video/*'
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
                    required
                    placeholder={t('editor.video.dialog.placeholder')}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                  <Button type='submit'>{t('editor.video.dialog.button.apply')}</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};

export default VideoUploaderView;
