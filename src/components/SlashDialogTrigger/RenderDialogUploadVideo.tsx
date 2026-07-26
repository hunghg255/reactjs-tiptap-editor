import { useMemo, useState } from 'react';

import { Button, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { useListener } from '@/components/ReactBus';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VideoUploadTab } from '@/extensions/Video/components/VideoUploadTab';
import { Video } from '@/extensions/Video/Video';
import { useToggleActive } from '@/hooks/useActive';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { checkIsVideoUrl } from '@/utils/checkIsVideoUrl';
import { EVENTS } from '@/utils/customEvents/events.constant';

export function RenderDialogUploadVideo() {
  const { t } = useLocale();

  const editor = useEditorInstance();
  // const buttonProps = useButtonProps(Video.name);

  // const {
  //   icon,
  //   tooltip,
  // } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive();

  const [link, setLink] = useState<string>('');

  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const extension = useExtension(Video.name);

  const EVENT_ID = EVENTS.UPLOAD_VIDEO((editor as any).id);

  useListener(setOpen, [EVENT_ID]);

  const uploadOptions = useMemo(() => {
    const uploadOptions = extension?.options ?? {};

    return uploadOptions;
  }, [extension]);

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

  if (editorDisabled) {
    return <></>;
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
            <VideoUploadTab
              editor={editor}
              onUploadComplete={() => setOpen(false)}
              onUploadingChange={setIsUploading}
              uploadOptions={uploadOptions}
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
