import { useEffect, useMemo, useRef, useState } from 'react';

import { ActionButton, Button, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Video } from '@/extensions/Video/Video';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

function checkIsVideoUrl(url: string, allowedProviders?: string[]): boolean {
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return false;
  }

  // If no providers specified or wildcard ['.'] is used, allow any valid URL
  if (!allowedProviders?.length || (allowedProviders.length === 1 && allowedProviders[0] === '.')) {
    return true;
  }

  return allowedProviders.some(provider => {
    if (provider.includes('*')) {
      const pattern = provider
        .replace(/\./g, String.raw`\.`)
        .replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(urlObj.hostname);
    }

    return urlObj.hostname.includes(provider);
  });
}

export function RichTextVideo() {
  const { t } = useLocale();

    const editor = useEditorInstance();
    const buttonProps = useButtonProps(Video.name);

    const {
      icon,
      tooltip,
    } = buttonProps?.componentProps ?? {};

    const { editorDisabled } = useToggleActive();

  const [link, setLink] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const extension = useExtension(Video.name);

  const handleUploadVideo = (evt: any) => {
    setOpen(evt.detail);
  };

  useEffect(() => {
    const rm1 = listenEvent(EVENTS.UPLOAD_VIDEO((editor as any).id), handleUploadVideo);

    return () => {
      rm1();
    };
  }, [editor]);

  const uploadOptions = useMemo(() => {
    const uploadOptions = extension?.options ?? {};

    return uploadOptions;
  }, [extension]);

  async function handleFile(event: any) {
    const files = event?.target?.files;
    if (!editor || editor.isDestroyed || files.length === 0) {
      return;
    }
    const file = files[0];

    let src = '';
    if (uploadOptions.upload) {
      src = await uploadOptions.upload(file);
    } else {
      src = URL.createObjectURL(file);
    }

    editor
      .chain()
      .focus()
      .setVideo({
        src,
        width: '100%',
      })
      .run();
    setOpen(false);
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
    <Dialog onOpenChange={setOpen}
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
        <DialogTitle>
          {t('editor.video.dialog.title')}
        </DialogTitle>

        <Tabs
          activationMode="manual"
          defaultValue={
            (uploadOptions?.resourceVideo === 'both' || uploadOptions?.resourceVideo === 'upload') ? 'upload' : 'link'
          }
        >
          <TabsList className="richtext-grid richtext-w-full richtext-grid-cols-2">
            {(uploadOptions?.resourceVideo === 'both' || uploadOptions?.resourceVideo === 'upload') && (
              <TabsTrigger value="upload">
                {t('editor.video.dialog.tab.upload')}
              </TabsTrigger>
            )}

            {(uploadOptions?.resourceVideo === 'both' || uploadOptions?.resourceVideo === 'link') && (
              <TabsTrigger value="link">
                {t('editor.video.dialog.link')}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="upload">
            <div className="richtext-flex richtext-items-center richtext-gap-[10px]">
              <Button className="richtext-mt-1 richtext-w-full"
                onClick={handleClick}
                size="sm"
              >
                {t('editor.video.dialog.tab.upload')}
              </Button>
            </div>

            <input
              accept="video/*"
              multiple
              onChange={handleFile}
              ref={fileInput}
              type="file"
              style={{
                display: 'none',
              }}
            />
          </TabsContent>

          <TabsContent value="link">
            <div >
              <div className="richtext-flex richtext-items-center richtext-gap-2">
                <Input
                  autoFocus
                  placeholder={t('editor.video.dialog.placeholder')}
                  required
                  type="url"
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

                <Button onClick={handleLink}
type="button"
                >
                  {t('editor.video.dialog.button.apply')}
                </Button>
              </div>
            </div>

            {error && <div className="richtext-my-[5px] richtext-text-red-500">
              {error}
            </div>}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
