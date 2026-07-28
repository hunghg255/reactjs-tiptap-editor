import { type ChangeEvent, useMemo, useRef, useState } from 'react';

import { Button, IconComponent, useToast } from '@/components';
import {
  DEFAULT_VIDEO_OPTIONS,
  type VideoOptions,
  type VideoUploadProgress,
} from '@/extensions/Video/Video';
import { useLocale } from '@/locales';
import { validateFiles } from '@/utils/validateFile';

import type { Editor } from '@tiptap/core';

type UploadStatus = 'error' | 'pending' | 'processing' | 'success' | 'uploading';

interface UploadItem {
  file: File;
  loaded: number;
  progressReported: boolean;
  status: UploadStatus;
  total: number;
}

interface VideoUploadTabProps {
  editor: Editor | null;
  onUploadComplete: () => void;
  onUploadingChange: (isUploading: boolean) => void;
  uploadOptions: VideoOptions;
}

function normalizeProgress(progress: VideoUploadProgress, file: File) {
  const fallbackTotal = file.size || 1;
  const total =
    Number.isFinite(progress.total) && progress.total > 0 ? progress.total : fallbackTotal;
  const loaded = Number.isFinite(progress.loaded)
    ? Math.min(Math.max(progress.loaded, 0), total)
    : 0;

  return { loaded, total };
}

function getConcurrency(value: number | undefined) {
  if (!Number.isFinite(value)) {
    return DEFAULT_VIDEO_OPTIONS.uploadConcurrency;
  }

  return Math.max(1, Math.floor(value as number));
}

export function VideoUploadTab({
  editor,
  onUploadComplete,
  onUploadingChange,
  uploadOptions,
}: VideoUploadTabProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const showUploadProgress =
    uploadOptions.showUploadProgress ?? DEFAULT_VIDEO_OPTIONS.showUploadProgress;

  const successfulCount = useMemo(
    () => uploadItems.filter(({ status }) => status === 'success').length,
    [uploadItems]
  );
  const hasMeasuredProgress = useMemo(() => {
    const hasProgress = uploadItems.some(({ progressReported }) => progressReported);
    const activeUploadsAreMeasured = uploadItems.every(
      ({ progressReported, status }) => status !== 'uploading' || progressReported
    );

    return hasProgress && activeUploadsAreMeasured;
  }, [uploadItems]);
  const totalProgress = useMemo(() => {
    const totalBytes = uploadItems.reduce((total, item) => total + item.total, 0);
    if (totalBytes === 0) {
      return 0;
    }

    const loadedBytes = uploadItems.reduce((total, item) => {
      return total + (item.status === 'success' ? item.total : item.loaded);
    }, 0);

    return Math.round((loadedBytes / totalBytes) * 100);
  }, [uploadItems]);

  function updateUploadItem(index: number, update: Partial<UploadItem>) {
    setUploadItems((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...update } : item))
    );
  }

  function reportUploadError(file: File) {
    const message = t('editor.upload.error');

    if (uploadOptions.onError) {
      try {
        uploadOptions.onError({
          type: 'upload',
          message,
          file,
        });
      } catch (error) {
        console.error('Error in video upload error handler', error);
      }
      return;
    }

    toast({
      variant: 'destructive',
      title: message,
    });
  }

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
    const results: Array<string | undefined> = Array.from({ length: filesToUpload.length });

    setUploadItems(
      filesToUpload.map((file) => ({
        file,
        loaded: 0,
        progressReported: false,
        status: 'pending',
        total: file.size || 1,
      }))
    );
    setIsUploading(true);
    onUploadingChange(true);

    let nextIndex = 0;
    const uploadNext = async () => {
      while (nextIndex < filesToUpload.length) {
        const index = nextIndex;
        nextIndex += 1;
        const file = filesToUpload[index];
        let uploadTotal = file.size || 1;

        updateUploadItem(index, { status: 'uploading' });

        try {
          const src = uploadOptions.upload
            ? await uploadOptions.upload(file, {
                onProgress: showUploadProgress
                  ? (progress) => {
                      const normalized = normalizeProgress(progress, file);
                      uploadTotal = normalized.total;
                      updateUploadItem(index, {
                        ...normalized,
                        progressReported: true,
                        status: normalized.loaded >= normalized.total ? 'processing' : 'uploading',
                      });
                    }
                  : undefined,
              })
            : URL.createObjectURL(file);

          results[index] = src;
          updateUploadItem(index, {
            loaded: uploadTotal,
            status: 'success',
            total: uploadTotal,
          });
        } catch (error) {
          console.error('Error uploading video', error);
          updateUploadItem(index, { status: 'error' });
          reportUploadError(file);
        }
      }
    };

    try {
      const concurrency = Math.min(
        getConcurrency(uploadOptions.uploadConcurrency),
        filesToUpload.length
      );
      await Promise.all(Array.from({ length: concurrency }, () => uploadNext()));

      if (editor.isDestroyed) {
        return;
      }

      results.forEach((src) => {
        if (!src) {
          return;
        }

        editor.chain().focus().setVideo({ src, width: '100%' }).run();
      });

      if (results.every(Boolean)) {
        onUploadComplete();
      }
    } finally {
      setIsUploading(false);
      onUploadingChange(false);
      event.target.value = '';
    }
  }

  return (
    <>
      <div className='richtext-flex richtext-items-center richtext-gap-[10px]'>
        <Button
          className='richtext-mt-1 richtext-w-full'
          disabled={isUploading}
          onClick={() => fileInput.current?.click()}
          size='sm'
          type='button'
        >
          {isUploading ? (
            <>
              {t('editor.video.dialog.uploading')}
              {showUploadProgress && hasMeasuredProgress ? ` ${totalProgress}%` : ''}

              {(!showUploadProgress || !hasMeasuredProgress) && (
                <IconComponent className='richtext-ml-1 richtext-animate-spin' name='Loader' />
              )}
            </>
          ) : (
            t('editor.video.dialog.tab.upload')
          )}
        </Button>
      </div>

      {showUploadProgress && uploadItems.length > 0 && (
        <div className='richtext-mt-3 richtext-space-y-3' aria-live='polite'>
          <div className='richtext-flex richtext-items-center richtext-justify-between richtext-text-xs richtext-text-muted-foreground'>
            <span>
              {isUploading
                ? t('editor.video.dialog.uploading')
                : `${successfulCount}/${uploadItems.length}`}
            </span>
            {isUploading && hasMeasuredProgress && <span>{totalProgress}%</span>}
          </div>

          {isUploading && hasMeasuredProgress && (
            <div
              aria-label={t('editor.video.dialog.uploading')}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={totalProgress}
              className='richtext-h-2 richtext-overflow-hidden richtext-rounded-full richtext-bg-muted'
              role='progressbar'
            >
              <div
                className='richtext-h-full richtext-rounded-full richtext-bg-primary richtext-transition-[width]'
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          )}

          <div className='richtext-max-h-48 richtext-space-y-2 richtext-overflow-y-auto'>
            {uploadItems.map((item, index) => {
              const progress = item.total > 0 ? Math.round((item.loaded / item.total) * 100) : 0;
              const isIndeterminate =
                (item.status === 'pending' || item.status === 'uploading') &&
                !item.progressReported;
              const statusText =
                item.status === 'error'
                  ? t('editor.upload.error')
                  : item.status === 'processing'
                    ? t('editor.video.dialog.processing')
                    : item.status === 'success'
                      ? '100%'
                      : item.progressReported
                        ? `${progress}%`
                        : t('editor.video.dialog.uploading');

              return (
                <div className='richtext-space-y-1' key={`${item.file.name}-${index}`}>
                  <div className='richtext-flex richtext-items-center richtext-justify-between richtext-gap-3 richtext-text-xs'>
                    <span className='richtext-min-w-0 richtext-truncate' title={item.file.name}>
                      {item.file.name}
                    </span>
                    <span
                      className={
                        item.status === 'error'
                          ? 'richtext-shrink-0 richtext-text-destructive'
                          : 'richtext-shrink-0 richtext-text-muted-foreground'
                      }
                    >
                      {statusText}
                      {(isIndeterminate || item.status === 'processing') && (
                        <IconComponent
                          className='richtext-ml-1 richtext-inline richtext-animate-spin'
                          name='Loader'
                        />
                      )}
                    </span>
                  </div>

                  {(item.progressReported || item.status === 'success') && (
                    <div
                      aria-label={item.file.name}
                      aria-valuemax={100}
                      aria-valuemin={0}
                      aria-valuenow={item.status === 'success' ? 100 : progress}
                      className='richtext-h-1.5 richtext-overflow-hidden richtext-rounded-full richtext-bg-muted'
                      role='progressbar'
                    >
                      <div
                        className={`richtext-h-full richtext-rounded-full richtext-transition-[width] ${
                          item.status === 'error'
                            ? 'richtext-bg-destructive'
                            : 'richtext-bg-primary'
                        }`}
                        style={{ width: `${item.status === 'success' ? 100 : progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <input
        accept={
          (uploadOptions.acceptMimes ?? DEFAULT_VIDEO_OPTIONS.acceptMimes).join(',') || 'video/*'
        }
        multiple={uploadOptions.multiple ?? DEFAULT_VIDEO_OPTIONS.multiple}
        onChange={handleFile}
        ref={fileInput}
        type='file'
        style={{
          display: 'none',
        }}
      />
    </>
  );
}
