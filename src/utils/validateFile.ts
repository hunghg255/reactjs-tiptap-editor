import type {
  ToastProps,
} from '@/components/ui/toast';
import { type TranslationFunction } from '@/locales';

interface ValidateFileOptions {
  acceptMimes: string[];
  maxSize: number;
  t: TranslationFunction;
  toast: (props: ToastProps) => void;
  onError?: (error: {
    type: 'size' | 'type' | 'upload';
    message: string;
    file?: File;
  }) => void;
}

export function validateFiles(
  files: File[] | { [key: string]: File },
  options: ValidateFileOptions
): File[] {
  const { acceptMimes, maxSize, t, toast } = options;
  const validFiles: File[] = [];

  const filesArray = Array.isArray(files)
    ? files
    : Object.values(files);

  filesArray.forEach((file) => {
    let isValid = true;

    // Validate file type
    if (!acceptMimes.includes(file.type)) {
      if (options.onError) {
        options.onError({
          type: 'type',
          message: t('editor.upload.fileTypeNotSupported', { fileName: file.name }),
          file,
        });
      } else {
        toast({
          variant: 'default',
          title: t('editor.upload.fileTypeNotSupported', { fileName: file.name }),
        });
      }
      isValid = false;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeInMB = (maxSize / 1024 / 1024).toFixed(2);
      if (options.onError) {
        options.onError({
          type: 'size',
          message: t('editor.upload.fileSizeTooBig', { fileName: file.name, size: maxSizeInMB }),
          file,
        });
      } else {
        toast({
          variant: 'default',
          title: t('editor.upload.fileSizeTooBig', { fileName: file.name, size: maxSizeInMB }),
        });
      }
      isValid = false;
    }

    if (isValid) {
      validFiles.push(file);
    }
  });

  return validFiles;
}