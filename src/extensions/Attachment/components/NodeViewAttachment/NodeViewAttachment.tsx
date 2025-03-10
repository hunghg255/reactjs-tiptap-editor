/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useRef, useState } from 'react';

import { NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';

import { ActionButton } from '@/components';
import { useLocale } from '@/locales';
import { useEditableEditor } from '@/store/editableEditor';
import { extractFileExtension, extractFilename, normalizeFileSize } from '@/utils/file';

import { getFileTypeIcon } from './FileIcon';
import styles from './index.module.scss';

export function NodeViewAttachment({ editor, node, updateAttributes, deleteNode, extension }: any) {
  const $upload: any = useRef<HTMLInputElement>(null);

  const isEditable = useEditableEditor();

  const { hasTrigger, fileName, fileSize, fileExt, fileType, url, error } = node.attrs;
  const [loading, setLoading] = useState(false);
  const { t } = useLocale();

  const upload = extension?.options?.upload;

  const selectFile = useCallback(() => {
    if (!isEditable || url)
      return;
    isEditable && $upload.current.click();
  }, [isEditable, url]);

  const handleFile = useCallback(
    async (e: any) => {
      const file = e.target.files && e.target.files[0];
      if (!file)
        return;

      const fileInfo = {
        fileName: extractFilename(file.name),
        fileSize: file.size,
        fileType: file.type,
        fileExt: extractFileExtension(file.name),
      };
      setLoading(true);

      // if (file.size > FILE_CHUNK_SIZE) {
      //   toggleShowProgress(true)
      // }

      try {
        const url = await upload(file);
        updateAttributes({ ...fileInfo, url });
        setLoading(false);
      } catch (error: any) {
        updateAttributes({ error: `File upload fail: ${error && error.message}` || 'Unknown error' });
        setLoading(false);

        $upload.current.value = '';
      }
    },
    [setLoading, updateAttributes],
  );

  useEffect(() => {
    if (!url && !hasTrigger) {
      selectFile();
      updateAttributes({ hasTrigger: true });
    }
  }, [url, hasTrigger, selectFile, updateAttributes]);

  const onDeleteAttachment = useCallback(() => deleteNode(), [editor]);

  if (isEditable && !url) {
    return (
      <NodeViewWrapper>
        <div className={clsx(styles.wrap, 'render-wrapper')}>
          <p onClick={selectFile}
            style={{ cursor: 'pointer' }}
          >
            {loading
              ? (
                <span>
                  {t('editor.attachment.uploading')}
                </span>
              )
              : (
                <span>
                  {t('editor.attachment.please_upload')}
                </span>
              )}
          </p>

          <input hidden
            onChange={handleFile}
            ref={$upload}
            type="file"
          />
        </div>
      </NodeViewWrapper>
    );
  }

  if (url) {
    return (
      <NodeViewWrapper>
        <div className={clsx(styles.wrap, 'render-wrapper')}
          onClick={selectFile}
        >
          <div className="richtext-flex richtext-items-center richtext-gap-[4px]">
            <span>
              {getFileTypeIcon(fileType)}
            </span>

            <span>
              {fileName}
              .
              {fileExt}
            </span>

            <span>
              (
              {normalizeFileSize(fileSize)}
              )
            </span>
          </div>

          <ActionButton
            action={onDeleteAttachment}
            icon="Trash2"
            tooltip={t('editor.delete')}
          />
        </div>
      </NodeViewWrapper>
    );
  }

  if (error !== 'null') {
    return (
      <NodeViewWrapper>
        <div className={clsx(styles.wrap, 'render-wrapper')}
          onClick={selectFile}
        >
          <p>
            {error}
          </p>
        </div>
      </NodeViewWrapper>
    );
  }

  return <></>;
}
