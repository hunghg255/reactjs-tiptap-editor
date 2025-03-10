interface HttpRequestHeadersInterfaceMock {
  [id: string]: string | string[] | undefined
}

interface HttpRequestInterfaceMock {
  headers: HttpRequestHeadersInterfaceMock
  [id: string]: any
}

export interface IsMobileOptions {
  ua?: string | HttpRequestInterfaceMock
  tablet?: boolean
  featureDetect?: boolean
}

const mobileRE
  = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
const notMobileRE = /CrOS/;
const tabletRE = /android|ipad|playbook|silk/i;

/**
 * Determines if the current device is a mobile or tablet device.
 * @param opts - Options for the detection.
 * @returns `true` if the device is mobile or tablet, `false` otherwise.
 */
export function isMobile(opts: IsMobileOptions = {}): boolean {
  let ua = opts.ua || (typeof navigator !== 'undefined' && navigator.userAgent);

  if (ua && typeof ua === 'object' && ua.headers && typeof ua.headers['user-agent'] === 'string') {
    ua = ua.headers['user-agent'];
  }

  if (typeof ua !== 'string') {
    return false;
  }

  if (mobileRE.test(ua) && !notMobileRE.test(ua)) {
    return true;
  }

  if (opts.tablet && tabletRE.test(ua)) {
    return true;
  }

  if (
    opts.tablet
    && opts.featureDetect
    && navigator
    && navigator.maxTouchPoints > 1
    && ua.includes('Macintosh')
    && ua.includes('Safari')
  ) {
    return true;
  }

  return false;
}
