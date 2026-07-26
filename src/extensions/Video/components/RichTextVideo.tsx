import { type ChangeEvent, useMemo, useRef, useState } from 'react';

import {
  ActionButton,
  Button,
  IconComponent,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from '@/components';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DEFAULT_VIDEO_OPTIONS, Video } from '@/extensions/Video/Video';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { checkIsVideoUrl } from '@/utils/checkIsVideoUrl';
import { validateFiles } from '@/utils/validateFile';

export function RichTextVideo() {
  const { t } = useLocale();
  const { toast } = useToast();

  const editor = useEditorInstance();
  const buttonProps = useButtonProps(Video.name);

  const { icon, tooltip } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive();

  const [link, setLink] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const extension = useExtension(Video.name);

  const uploadOptions = useMemo(() => {
    const uploadOptions = extension?.options ?? {};

    return uploadOptions;
  }, [extension]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!editor || editor.isDestroyed || !files?.length || isUploading) {
      event.target.value = '';
      return;
    }
    const validFiles = validateFiles(Array.from(files), {
      acceptMimes: uploadOptions.acceptMimes ?? DEFAULT_VIDEO_OPTIONS.acceptMimes,
      maxSize: uploadOptions.maxSize ?? Number.POSITIVE_INFINITY,
      t,
      toast,
      onError: uploadOptions.onError,
    });

    if (validFiles.length === 0) {
      event.target.value = '';
      return;
    }

    const filesToUpload =
      (uploadOptions.multiple ?? DEFAULT_VIDEO_OPTIONS.multiple)
        ? validFiles
        : validFiles.slice(0, 1);

    setIsUploading(true);
    try {
      const srcs = await Promise.all(
        filesToUpload.map((file) => {
          return uploadOptions.upload
            ? uploadOptions.upload(file)
            : Promise.resolve(URL.createObjectURL(file));
        })
      );

      if (editor.isDestroyed) {
        return;
      }

      srcs.forEach((src) => {
        editor
          .chain()
          .focus()
          .setVideo({
            src,
            width: '100%',
          })
          .run();
      });
      setOpen(false);
    } catch (error) {
      console.error('Error uploading video', error);
      if (uploadOptions.onError) {
        uploadOptions.onError({
          type: 'upload',
          message: t('editor.upload.error'),
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('editor.upload.error'),
        });
      }
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }
  function handleLink(e: any) {
    e.preventDefault();
    e.stopPropagation();

    if (!link) {
      return;
    }

    editor
      .chain()
      .focus()
      .setVideo({
        src: link,
        width: '100%',
      })
      .run();
    setOpen(false);
    setLink('');
  }

  function handleClick(e: any) {
    e.preventDefault();
    fileInput.current?.click();
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (isUploading && !nextOpen) {
          return;
        }

        setOpen(nextOpen);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <ActionButton
          disabled={editorDisabled}
          icon={icon}
          tooltip={tooltip}
          action={() => {
            if (editorDisabled) return;
            setOpen(true);
          }}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{t('editor.video.dialog.title')}</DialogTitle>

        <Tabs
          activationMode='manual'
          defaultValue={
            uploadOptions?.resourceVideo === 'both' || uploadOptions?.resourceVideo === 'upload'
              ? 'upload'
              : 'link'
          }
        >
          <TabsList className='richtext-grid richtext-w-full richtext-grid-cols-2'>
            {(uploadOptions?.resourceVideo === 'both' ||
              uploadOptions?.resourceVideo === 'upload') && (
              <TabsTrigger value='upload'>{t('editor.video.dialog.tab.upload')}</TabsTrigger>
            )}

            {(uploadOptions?.resourceVideo === 'both' ||
              uploadOptions?.resourceVideo === 'link') && (
              <TabsTrigger value='link'>{t('editor.video.dialog.link')}</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value='upload'>
            <div className='richtext-flex richtext-items-center richtext-gap-[10px]'>
              <Button
                className='richtext-mt-1 richtext-w-full'
                disabled={isUploading}
                onClick={handleClick}
                size='sm'
              >
                {isUploading ? (
                  <>
                    {t('editor.video.dialog.uploading')}

                    <IconComponent className='richtext-ml-1 richtext-animate-spin' name='Loader' />
                  </>
                ) : (
                  t('editor.video.dialog.tab.upload')
                )}
              </Button>
            </div>

            <input
              accept={
                (uploadOptions.acceptMimes ?? DEFAULT_VIDEO_OPTIONS.acceptMimes).join(',') ||
                'video/*'
              }
              multiple={uploadOptions.multiple ?? DEFAULT_VIDEO_OPTIONS.multiple}
              onChange={handleFile}
              ref={fileInput}
              type='file'
              style={{
                display: 'none',
              }}
            />
          </TabsContent>

          <TabsContent value='link'>
            <div>
              <div className='richtext-flex richtext-items-center richtext-gap-2'>
                <Input
                  autoFocus
                  placeholder={t('editor.video.dialog.placeholder')}
                  required
                  type='url'
                  value={link}
                  onBlur={(e) => {
                    const url = e.target.value;
                    const videoProviders = uploadOptions.videoProviders || ['.'];

                    if (url && !checkIsVideoUrl(url, videoProviders)) {
                      setError('Invalid video URL');
                    } else {
                      setError('');
                    }
                  }}
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />

                <Button onClick={handleLink} type='button'>
                  {t('editor.video.dialog.button.apply')}
                </Button>
              </div>
            </div>

            {error && <div className='richtext-my-[5px] richtext-text-red-500'>{error}</div>}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
