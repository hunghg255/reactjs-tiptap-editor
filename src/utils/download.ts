const isBrowser = typeof window !== 'undefined';

export function downloadFromBlob(blob: Blob, filename: string) {
  if (isBrowser) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    return Promise.resolve();
  }

  console.error('Download is not supported in Node.js');

  return Promise.resolve();
}
