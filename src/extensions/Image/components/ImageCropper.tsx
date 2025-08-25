import React, { useRef, useState, useMemo } from 'react';

import ReactCrop, {
  type Crop,
  type PixelCrop,
} from 'react-image-crop';

import { IconComponent, useToast } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Image as ExtensionImage } from '@/extensions/Image';
import { useLocale } from '@/locales';
import { dataURLtoFile, readImageAsBase64 } from '@/utils/file';
import { validateFiles } from '@/utils/validateFile';

export function ImageCropper({ editor, imageInline, onClose, disabled, alt }: any) {
  const { t } = useLocale();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);
  const [urlUpload, setUrlUpload] = useState<any>({
    src: '',
    file: null,
  });

  const uploadOptions = useMemo(() => {
    return editor.extensionManager.extensions.find(
      (extension: any) => extension.name === ExtensionImage.name,
    )?.options;
  }, [editor]);

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    return canvas.toDataURL('image/png', 1.0);
  }

  const onCrop = React.useCallback(async () => {
    if (isCropping) return;

    setIsCropping(true);
    try {
      const fileCrop = dataURLtoFile(croppedImageUrl, urlUpload?.file?.name || 'image.png');

      let src = '';
      if (uploadOptions.upload) {
        src = await uploadOptions.upload(fileCrop);
      } else {
        src = URL.createObjectURL(fileCrop);
      }

      editor.chain().focus().setImageInline({ src, inline: imageInline, alt }).run();

      setDialogOpen(false);

      setUrlUpload({
        src: '',
        file: null,
      });

      resetFileInput();
      onClose();
    } catch (error) {
      console.log('Error cropping image', error);
    } finally {
      setIsCropping(false);
    }
  }, [croppedImageUrl, editor, imageInline, isCropping, onClose, urlUpload?.file?.name, uploadOptions]);

  function handleClick(e: any) {
    e.preventDefault();
    fileInput.current?.click();
  }

  const handleFile = async (event: any) => {
    const files = event?.target?.files;
    if (!editor || editor.isDestroyed || files.length === 0) {
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

    const file = validFiles[0];
    const base64 = await readImageAsBase64(file);

    setDialogOpen(true);
    setUrlUpload({
      src: base64.src,
      file,
    });
  };

  const resetFileInput = () => {
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  return (
    <>
      <Button className="richtext-mt-1 richtext-w-full"
        disabled={disabled}
        onClick={handleClick}
        size="sm"
      >
        {t('editor.image.dialog.tab.uploadCrop')}
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setUrlUpload({ src: '', file: null });
            resetFileInput();
          }
        }}
      >
        <DialogTrigger />

        <DialogContent>
          <DialogTitle>
            {t('editor.image.dialog.tab.uploadCrop')}
          </DialogTitle>

          <div>
            {urlUpload.src && (
              <ReactCrop
                className="richtext-w-full"
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => onCropComplete(c)}
              >
                <img
                  alt="Crop me"
                  ref={imgRef}
                  src={urlUpload.src}
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter>
            <Button
              disabled={isCropping}
              onClick={() => {
                setDialogOpen(false);
                setUrlUpload({
                  src: '',
                  file: null,
                });
                resetFileInput();
              }}
            >
              {t('editor.imageUpload.cancel')}

              <IconComponent className="richtext-ml-1"
                name="Trash2"
              />
            </Button>

            <Button
              className="richtext-w-fit"
              disabled={isCropping || !crop}
              onClick={onCrop}
            >
              {isCropping ? (
                <>
                  {t('editor.imageUpload.uploading')}

                  <IconComponent className="richtext-ml-1 richtext-animate-spin"
                    name="Loader"
                  />
                </>
              ) : (
                <>
                  {t('editor.imageUpload.crop')}

                  <IconComponent className="richtext-ml-1"
                    name="Crop"
                  />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input
        accept={uploadOptions?.acceptMimes?.join(',') || 'image/*'}
        multiple={false} // TODO No sense unless doing queue processing
        onChange={handleFile}
        ref={fileInput}
        style={{ display: 'none' }}
        type="file"
      />
    </>
  );
}