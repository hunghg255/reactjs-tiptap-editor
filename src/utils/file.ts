/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * 获取文件名
 *
 * @example
 *   > extractFilename('https://gitlab.com/images/logo-full.png')
 *   < 'logo-full'
 *
 * @param {string} src The URL to extract filename from
 * @returns {string}
 */
export function extractFilename(src: any) {
  return src.replace(/^.*\/|\..+$/g, '');
}

/**
 * extractFileExtension
 * @param {string} fileName The file name to extract extension from
 * @returns  {string}
 */
export function extractFileExtension(fileName: any) {
  return fileName.split('.').pop();
}

export function normalizeFileSize(size: any) {
  if (size < 1024) {
    return `${size} Byte`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export type FileType = 'image' | 'audio' | 'video' | 'pdf' | 'word' | 'excel' | 'ppt' | 'file';

export function normalizeFileType(fileType: any): FileType {
  if (!fileType)
    return 'file';

  if (fileType === 'application/pdf')
    return 'pdf';

  if (fileType.startsWith('application/') && ['.document', 'word'].some(type => fileType.includes(type)))
    return 'word';

  if (fileType.startsWith('application/') && ['presentation'].some(type => fileType.includes(type)))
    return 'excel';

  if (fileType.startsWith('application/') && ['sheet'].some(type => fileType.includes(type)))
    return 'ppt';

  if (fileType.startsWith('image')) {
    return 'image';
  }

  if (fileType.startsWith('audio')) {
    return 'audio';
  }

  if (fileType.startsWith('video')) {
    return 'video';
  }

  return 'file';
}

export function readImageAsBase64(file: File): Promise<{ alt: string, src: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        resolve({
          alt: file.name,
          src: reader.result as string,
        });
      },
      false,
    );
    reader.readAsDataURL(file);
  });
}

export function getImageWidthHeight(url: string): Promise<{ width: number | string, height: number | string }> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.addEventListener('load', () => {
      resolve({ width: img.width, height: img.height });
    });
    img.onerror = () => {
      resolve({ width: 'auto', height: 'auto' });
    };
    img.src = url;
  });
}

export const FILE_CHUNK_SIZE = 2 * 1024 * 1024;

export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  // @ts-expect-error
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
