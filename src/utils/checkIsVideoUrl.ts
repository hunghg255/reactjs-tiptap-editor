export function checkIsVideoUrl(url: string, allowedProviders?: string[]): boolean {
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return false;
  }

  // If no providers specified or wildcard ['.'] is used, allow any valid URL
  if (!allowedProviders?.length || (allowedProviders.length === 1 && allowedProviders[0] === '.')) {
    return true;
  }

  return allowedProviders.some(provider => {
    if (provider.includes('*')) {
      const pattern = provider
        .replace(/\./g, String.raw`\.`)
        .replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(urlObj.hostname);
    }

    return urlObj.hostname.includes(provider);
  });
}
