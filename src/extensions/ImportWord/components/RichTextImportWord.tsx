/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useState } from 'react';

import mammoth from 'mammoth';

import { ActionButton, useToast } from '@/components';
import { ImportWord } from '@/extensions/ImportWord/ImportWord';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { base64ToBlob, blobToFile } from '@/utils/base64';
import { hasExtension } from '@/utils/utils';

export function RichTextImportWord() {
  const editor = useEditorInstance();

  const buttonProps = useButtonProps(ImportWord.name);

  const {
    icon = undefined,
    tooltip = undefined,
    tooltipOptions = {},
    isActive = undefined,
    mammothOptions,
    limit,
    convert
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive(isActive);

  const extension = useExtension(ImportWord.name);

  const { toast } = useToast();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function triggerFileInput() {
    fileInput.current?.click();
  }

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > limit!) {
      toast({
        variant: 'destructive',
        title: t('editor.importWord.limitSize'),
      });
      return;
    }
    importWord(file);
  }

  async function filerImage(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    if (images.length === 0) {
      return doc.body.innerHTML;
    }
    const hasImage = hasExtension(editor, 'image');
    if (hasImage) {
      const uploadOptions = extension?.options;

      if (uploadOptions && typeof uploadOptions.upload === 'function') {
        const files: File[] = [];
        // convert base64 image to blob file
        for (const img of images) {
          const originalSrc = img.getAttribute('src');
          const blob = base64ToBlob(originalSrc, 'image/jpeg');
          const file = blobToFile(blob, 'image.jpeg');
          files.push(file);
        }
        const uploadRes = await uploadOptions.upload(files);
        // images
        for (const [i, img] of images.entries()) {
          img.setAttribute('src', uploadRes[i].src);
          const parent = img.parentElement;
          if (parent?.tagName === 'P') {
            parent.insertAdjacentElement('beforebegin', img);
            if (!parent.hasChildNodes() && parent.textContent === '') {
              parent.remove();
            }
          }
        }
        return doc.body.innerHTML;
      } else {
        console.warn('Image Upload method found, skip image conversion');
        return doc.body.innerHTML;
      }
    } else {
      console.error('Image extension not found, unable to convert image');
      return doc.body.innerHTML;
    }
  }

  async function importWord(importFile: File) {
    setLoading(true);
    try {
      if (convert) {
        const result = await convert(importFile);
        handleResult(result);
      } else {
        const arrayBuffer = await importFile.arrayBuffer();
        // TODO: add messages
        const { value } = await mammoth.convertToHtml(
          { arrayBuffer },
          mammothOptions,
        );
        handleResult(value);
      }
    } finally {
      setLoading(false);
    }
  }
  async function handleResult(htmlResult: string) {
    const html = await filerImage(htmlResult);
    //@ts-expect-error
    editor.chain().setContent(html, true).run();
  }

    if (!buttonProps) {
    return <></>;
  }

  return (
    <>
      <ActionButton action={triggerFileInput}
        disabled={editorDisabled}
        icon={icon}
        loading={loading}
        tooltip={tooltip}
        tooltipOptions={tooltipOptions}
      />

      <input
        accept=".docx"
        onChange={handleFileChange}
        ref={fileInput}
        type="file"
        style={{
          display: 'none',
        }}
      />
    </>
  );
}
