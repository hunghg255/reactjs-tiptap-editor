export function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array<number>(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export function blobToFile(blob: Blob, fileName: string) {
  return new File([blob], fileName, { type: blob.type });
}
