export function base64ToBlob(base64: any, mimeType: any) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = Array.from({ length: byteCharacters.length });
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers as any);
  return new Blob([byteArray], { type: mimeType });
}

export function blobToFile(blob: any, fileName: any) {
  return new File([blob], fileName, { type: blob.type });
}
