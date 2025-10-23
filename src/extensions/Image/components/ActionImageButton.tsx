import { useEffect, useMemo, useRef, useState } from 'react';

import { ActionButton, Button, Checkbox, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, useToast, IconComponent } from '@/components';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageCropper } from '@/extensions/Image/components/ImageCropper';
import Image from '@/extensions/Image/Image';
import { actionDialogImage } from '@/extensions/Image/store';
import { useLocale } from '@/locales';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';
import { validateFiles } from '@/utils/validateFile';

function ActionImageButton(props: any) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = (evt: any) => {
    setOpen(evt.detail);
  };

  const [link, setLink] = useState<string>('');
  const [alt, setAlt] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);

  const defaultInline = props.editor.extensionManager.extensions.find(
    (extension: any) => extension.name === Image.name,
  )?.options.defaultInline || false;
  const [imageInline, setImageInline] = useState(defaultInline);

  const uploadOptions = useMemo(() => {
    const uploadOptions = props.editor.extensionManager.extensions.find(
      (extension: any) => extension.name === Image.name,
    )?.options;

    return uploadOptions;
  }, [props.editor]);

  useEffect(() => {
    const rm1 = listenEvent(EVENTS.UPLOAD_IMAGE(props.editor.id), handleUploadImage);

    return () => {
      rm1();
    };
  }, []);

  async function handleFile(event: any) {
    const files = event?.target?.files;
    if (!props.editor || props.editor.isDestroyed || files.length === 0 || isUploading) {
      event.target.value = '';
      return;
    }

    const validFiles = validateFiles(files, {
      acceptMimes: uploadOptions?.acceptMimes,
      maxSize: uploadOptions?.maxSize,
      t,
      toast,
      onError: uploadOptions.onError,
    });

    if (validFiles.length <= 0) {
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      if (uploadOptions?.multiple) {
        // Handle multiple files upload
        const uploadPromises = validFiles.map(async (file) => {
          let src = '';
          if (uploadOptions.upload) {
            src = await uploadOptions.upload(file);
          } else {
            src = URL.createObjectURL(file);
          }
          return src;
        });

        const srcs = await Promise.all(uploadPromises);
        // Insert all images (you might want to adjust this based on your editor's capabilities)
        srcs.forEach(src => {
          props.editor.chain().focus().setImageInline({ src, inline: imageInline, alt }).run();
        });
      } else {
        // Single file upload (take the first valid file)
        const file = validFiles[0];
        let src = '';
        if (uploadOptions.upload) {
          src = await uploadOptions.upload(file);
        } else {
          src = URL.createObjectURL(file);
        }
        props.editor.chain().focus().setImageInline({ src, inline: imageInline, alt }).run();
      }

      setOpen(false);
      setAlt('');
      setImageInline(defaultInline);
    } catch (error) {
      console.error('Error uploading image', error);
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

    props.editor.chain().focus().setImageInline({ src: link, inline: imageInline, alt }).run();
    setOpen(false);
    setImageInline(defaultInline);
    setLink('');
    setAlt('');
  }

  function handleClick(e: any) {
    e.preventDefault();
    fileInput.current?.click();
  }

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <ActionButton
          action={() => setOpen(true)}
          icon={props.icon}
          tooltip={props.tooltip}
          tooltipOptions={props.tooltipOptions}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          {t('editor.image.dialog.title')}
        </DialogTitle>

        <Tabs
          activationMode="manual"
          defaultValue={
            uploadOptions.resourceImage === 'both' || uploadOptions.resourceImage === 'upload'
              ? 'upload'
              : 'link'
          }
        >

          {(uploadOptions.resourceImage === 'both') && (
            <TabsList className="richtext-grid richtext-w-full richtext-grid-cols-2">
              <TabsTrigger value="upload">
                {t('editor.image.dialog.tab.upload')}
              </TabsTrigger>
              <TabsTrigger value="link">
                {t('editor.image.dialog.tab.url')}
              </TabsTrigger>
            </TabsList>
          )}

          <div className="richtext-my-[10px] richtext-flex richtext-items-center richtext-gap-[4px]">
            <Checkbox
              checked={imageInline}
              onCheckedChange={(v) => {
                setImageInline(v as boolean);
              }}
            />

            <Label>
              {t('editor.link.dialog.inline')}
            </Label>
          </div>

          {
            uploadOptions.enableAlt && (
              <div className="richtext-my-[10px] ">
                <Label className="mb-[6px]">
                  {t('editor.imageUpload.alt')}
                </Label>

                <Input
                  onChange={(e) => setAlt(e.target.value)}
                  required
                  type="text"
                  value={alt}
                />
              </div>
            )
          }

          <TabsContent value="upload">
            <div className="richtext-flex richtext-items-center richtext-gap-[10px]">
              <Button className="richtext-mt-1 richtext-w-full"
                disabled={isUploading}
                onClick={handleClick}
                size="sm"
              >
                {isUploading ? (
                  <>
                    {t('editor.imageUpload.uploading')}

                    <IconComponent
                      className="richtext-ml-1 richtext-animate-spin"
                      name="Loader"
                    />
                  </>
                ) : (
                  t('editor.image.dialog.tab.upload')
                )}
              </Button>

              <ImageCropper
                alt={alt}
                disabled={isUploading}
                editor={props.editor}
                imageInline={imageInline}
                onClose={() => {
                  actionDialogImage.setOpen(props.editor.id, false);
                  setAlt('');
                }}
              />
            </div>

            <input
              // accept="image/*"
              accept={uploadOptions.acceptMimes.join(',') || 'image/*'}
              multiple={uploadOptions.multiple}
              onChange={handleFile}
              ref={fileInput}
              style={{ display: 'none' }}
              type="file"
            />
          </TabsContent>

          <TabsContent value="link">
            <form onSubmit={handleLink}>
              <div className="richtext-flex richtext-items-center richtext-gap-2">
                <Input
                  autoFocus
                  onChange={e => setLink(e.target.value)}
                  placeholder={t('editor.image.dialog.placeholder')}
                  required
                  type="url"
                  value={link}
                />

                <Button type="submit">
                  {t('editor.image.dialog.button.apply')}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ActionImageButton;
