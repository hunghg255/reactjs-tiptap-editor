import React, { useRef, useState } from 'react';

import ReactCrop, {
  type Crop,
  type PixelCrop,
} from 'react-image-crop';

import { IconComponent } from '@/components';
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

export function ImageCropper({ editor, imageInline, onClose }: any) {
  const { t } = useLocale();

  const [dialogOpen, setDialogOpen] = useState(false);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);
  const [urlUpload, setUrlUpload] = useState<any>({
    src: '',
    file: null,
  });

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

  async function onCrop() {
    try {
      const fileCrop = dataURLtoFile(croppedImageUrl, urlUpload?.file?.name || 'image.png');

      const uploadOptions = editor.extensionManager.extensions.find(
        (extension: any) => extension.name === ExtensionImage.name,
      )?.options;

      let src = '';
      if (uploadOptions.upload) {
        src = await uploadOptions.upload(fileCrop);
      } else {
        src = URL.createObjectURL(fileCrop);
      }

      editor.chain().focus().setImageInline({ src, inline: imageInline }).run();

      setDialogOpen(false);

      setUrlUpload({
        src: '',
        file: null,
      });
      onClose();
    } catch (error) {
      console.log('Error cropping image', error);
    }
  }

  function handleClick(e: any) {
    e.preventDefault();
    fileInput.current?.click();
  }

  const handleFile = async (event: any) => {
    const files = event?.target?.files;
    if (!editor || editor.isDestroyed || files.length === 0) {
      return;
    }
    const file = files[0];

    const base64 = await readImageAsBase64(file);

    setDialogOpen(true);
    setUrlUpload({
      src: base64.src,
      file,
    });
  };

  return (
    <>
      <Button className="richtext-mt-1 richtext-w-full"
        onClick={handleClick}
        size="sm"
      >
        {t('editor.image.dialog.tab.uploadCrop')}
      </Button>

      <Dialog open={dialogOpen}>
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
              onClick={() => {
                setDialogOpen(false);
                setUrlUpload({
                  src: '',
                  file: null,
                });
              }}
            >
              {t('editor.imageUpload.cancel')}

              <IconComponent className="richtext-ml-[4px]"
                name="Trash2"
              />
            </Button>

            <Button className="richtext-w-fit"
              onClick={onCrop}
            >
              {t('editor.imageUpload.crop')}

              <IconComponent className="richtext-ml-[4px]"
                name="Crop"
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input
        accept="image/*"
        multiple
        onChange={handleFile}
        ref={fileInput}
        type="file"
        style={{
          display: 'none',
        }}
      />
    </>
  );
}
