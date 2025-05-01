interface ServiceType {
  label: string
  value: string
  icon: any
}
export const VideoServices: ServiceType[] = [
  { label: '优酷', value: 'youku', icon: 'Youku' },
  {
    label: '哔哩哔哩',
    value: 'bilibili',
    icon: 'BiliBili',
  },
  {
    label: '腾讯视频',
    value: 'qqvideo',
    icon: 'QQVideo',
  },
];

export const MapServices: ServiceType[] = [
  { label: '高德地图', value: 'amap', icon: 'Gaode' },
  { label: '百度地图', value: 'baidu_map', icon: 'Baidu' },
];

export const DesignServices: ServiceType[] = [
  { label: '墨刀', value: 'modao', icon: 'Modao' },
  { label: '蓝湖', value: 'lanhu', icon: 'Lanhu' },
  { label: 'Figma', value: 'figma', icon: 'Figma' },
  { label: 'Canva', value: 'canva', icon: 'Canva' },
  { label: 'ProcessOn', value: 'processon', icon: 'Processon' },
];

export const DevelopServices: ServiceType[] = [
  { label: 'CodePen', value: 'codepen', icon: 'Codepen' },
];

export const DataServices: ServiceType[] = [
  { label: '金数据', value: 'jinshuju', icon: 'Jinshuju' },
];

export const OtherServices = [];

export const AllEmbedServices = [
  ...VideoServices,
  ...MapServices,
  ...DesignServices,
  ...DevelopServices,
  ...DataServices,
  ...OtherServices,
];

export function getEmbedService(value: any) {
  for (const item of AllEmbedServices) {
    if (item.value === value) {
      return item;
    }
  }

  return {};
}

/**
 * Embed service link
 * @id source id
 * @exmplae example link
 * @src source src, used in iframe
 */
export const EmbedServiceLink: any = {
  youtube: {
    example: 'https://www.youtube.com/watch?v=I4sMhHbHYXM',
    src: 'https://www.youtube.com/embed/I4sMhHbHYXM',
    srcPrefix: 'https://www.youtube.com/embed',
    linkRule: [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\s/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[&?]v=)|youtu\.be\/)([\w-]{11})/,
    ],
  },
  youku: {
    example:
      'https://v.youku.com/v_show/id_XNDM0NDM4MTcy.html?spm=a2h0c.8166622.PhoneSokuUgc_4.dtitle',
    src: 'https://player.youku.com/embed/XNDM0NDM4MTcy',
    srcPrefix: 'https://player.youku.com/embed',
    linkRule: [String.raw`v.youku.com\/v_show\/id_\w+\=*`],
    idRule: String.raw`id_\w+\=*`,
  },
  bilibili: {
    example: 'https://www.bilibili.com/video/BV1EJ411u7DN',
    src: 'https://player.bilibili.com/player.html?bvid=BV1EJ411u7DN',
    srcPrefix: 'https://player.bilibili.com/player.html?bvid',
    linkRule: [String.raw`www.bilibili.com\/video\/\w+`],
  },
  qqvideo: {
    example: 'https://v.qq.com/x/cover/mzc0020006aw1mn/u0033nvzb5v.html',
    src: 'https://v.qq.com/txp/iframe/player.html?vid=u0033nvzb5v',
    srcPrefix: 'https://v.qq.com/txp/iframe/player.html?vid',
    linkRule: [String.raw`v.qq.com\/x\/cover\/\w+\/\w+`],
  },
  amap: {
    example: 'https://ditu.amap.com/',
    src: 'https://www.amap.com/place/B000A45467',
    srcPrefix: '',
    linkRule: [String.raw`\.amap\.com`],
  },
  baidu_map: {
    example: 'https://j.map.baidu.com/15/fo',
    src: 'https://j.map.baidu.com/15/fo',
    srcPrefix: '',
    linkRule: [String.raw`map\.baidu\.com`],
  },
  modao: {
    example:
      'https://free.modao.cc/app/2cd26580a6717a147454df7470e7ec464093cba3/embed/v2#screen=sk71k6d1dfxulzx',
    src: 'https://free.modao.cc/app/6UkpAxcGE3nPz52GLqhnOZgC7MATBSy/embed/v2',
    srcPrefix: '',
    linkRule: [String.raw`https:\/\/\w+.modao.cc\/app\/\w+\/embed\/v2`],
    tips: 'Modao > More > Share > Embed > COPY',
  },
  lanhu: {
    example: 'https://lanhuapp.com/link/#/invite?sid=evP7L',
    src: 'https://lanhuapp.com/url/evP7L',
    srcPrefix: '',
    linkRule: [String.raw`https:\/\/lanhuapp.com\/url\/\w+`],
    tips: 'Lanhu > Project > Share > Copy Link',
  },
  figma: {
    example: 'https://www.figma.com/file/aS9uSgPXoNpaPkzbjNcK8v/Demo?node-id=0%3A1',
    src: 'https://www.figma.com/file/aS9uSgPXoNpaPkzbjNcK8v/Demo?node-id=0%3A1',
    srcPrefix: 'https://www.figma.com/embed?embed_host=share&url',
    linkRule: [String.raw`https:\/\/www.figma.com\/file\/\w+`],
  },
  canva: {
    example: 'https://www.canva.cn/design/DAD61-t29UI/view',
    src: 'https://www.canva.cn/design/DAD61-t29UI/view',
    srcPrefix: '',
    linkRule: [String.raw`https:\/\/www.canva.cn\/design\/.+\/view`],
  },
  processon: {
    example: 'https://www.processon.com/embed/5ea99d8607912948b0e6fe78',
    src: 'https://www.processon.com/embed/5ea99d8607912948b0e6fe78',
    srcPrefix: '',
    linkRule: [String.raw`https:\/\/www.processon.com\/embed\/\w+`],
  },
  codepen: {
    example: 'https://codepen.io/mekery/embed/YzyrKOJ',
    src: 'https://codepen.io/mekery/embed/YzyrKOJ',
    srcPrefix: '',
    linkRule: [String.raw`https:\/\/codepen.io\/.+\/embed\/\w+`],
  },
  jinshuju: {
    example: 'https://jinshuju.net/f/q9YvVf',
    src: 'https://jinshuju.net/f/q9YvVf',
    srcPrefix: '',
    linkRule: [String.raw`https:\/\/jinshuju.net\/f\/\w+`],
  },
  iframe: {
    example: 'https://v.youku.com/v_show/id_XNDM0NDM4MTcy.html',
    src: 'https://player.youku.com/embed/XNDM0NDM4MTcy',
    srcPrefix: '',
    linkRule: ['.+'],
  },
  googlemaps: {
    example: 'https://goo.gl/maps/8Ys8b4K1ZJY2',
    src: 'https://www.google.com/maps/embed?pb=https://goo.gl/maps/8Ys8b4K1ZJY2',
    srcPrefix: '',
    linkRule: [String.raw`https:\/\/goo.gl\/maps\/\w+`],
  },
};

function getYoutubeSrc(result: any) {
  const link = EmbedServiceLink.youtube;
  const url = result.matchedUrl;
  result.validLink = true;

  const splits = url.split('=');
  const len = splits.length;
  if (len > 0) {
    const id = splits[len - 1];
    result.src = `${link.srcPrefix}/${id}`;
    result.validId = true;
  }

  return result;
}

function getYoukuSrc(result: any) {
  const link = EmbedServiceLink.youku;
  const url = result.matchedUrl;

  const idRule = link.idRule;
  const regex = new RegExp(idRule);
  const match = url.match(regex);
  if (match && match.length > 0) {
    const id = match[0].slice(3);

    result.validId = true;
    result.src = `${link.srcPrefix}/${id}`;
  } else {
    result.validId = false;
  }

  return result;
}

function getBilibiliSrc(result: any) {
  const link = EmbedServiceLink.bilibili;
  const url = result.matchedUrl;

  const splits = url.split('/');
  const len = splits.length;
  if (len > 0) {
    const id = splits[len - 1];
    result.src = `${link.srcPrefix}=${id}`;
    result.validId = true;
  }

  return result;
}

function getQQVideoSrc(result: any) {
  const link = EmbedServiceLink.qqvideo;
  const url = result.matchedUrl;

  const splits = url.split('/');
  const len = splits.length;
  if (len > 0) {
    const id = splits[len - 1];
    result.src = `${link.srcPrefix}=${id}`;
    result.validId = true;
  }

  return result;
}

function getAMapSrc(originalLink: any, result: any) {
  result.src = originalLink;
  result.validId = true;

  return result;
}

function getBaiduMapSrc(originalLink: any, result: any) {
  result.src = originalLink;
  result.validId = true;

  return result;
}

function getGoogleMapSrc(originalLink: any, result: any) {
  result.src = originalLink;
  result.validId = true;
  result.originalLink = originalLink;

  return result;
}

function getModaoSrc(result: any) {
  result.src = result.matchedUrl;
  result.validId = true;
  result.originalLink = result.src;

  return result;
}

function getLanhuSrc(result: any) {
  result.src = result.matchedUrl;
  result.validId = true;
  result.originalLink = result.src;

  return result;
}

function getFigmaSrc(result: any) {
  const link = EmbedServiceLink.figma;
  result.src = `${link.srcPrefix}=${encodeURIComponent(result.matchedUrl)}`;
  result.validId = true;
  result.originalLink = result.matchedUrl;

  return result;
}

function getCanvaSrc(originalLink: any, result: any) {
  result.src = `${result.matchedUrl}?embed`;
  result.validId = true;
  result.originalLink = originalLink;

  return result;
}

function getProcessonSrc(originalLink: any, result: any) {
  result.src = `${result.matchedUrl}`;
  result.validId = true;
  result.originalLink = originalLink;

  return result;
}

function getCodepenSrc(result: any) {
  result.src = `${result.matchedUrl}`;
  result.validId = true;
  result.originalLink = result.src;

  return result;
}

function getJinshujuSrc(originalLink: any, result: any) {
  result.src = `${result.matchedUrl}?background=white&banner=show&embedded=true`;
  result.validId = true;
  result.originalLink = originalLink;

  return result;
}

function getCommonSrc(originalLink: any, result: any) {
  result.src = `${result.matchedUrl}`;
  result.validId = true;
  result.originalLink = originalLink;

  return result;
}

function getMatchedUrl(service: any, originalLink: any, result: any) {
  if (service === 'googlemaps') {
    result.validLink = true;
    result.matchedUrl = originalLink;
    return result;
  }

  const link = EmbedServiceLink[service];
  const linkRule = link.linkRule;

  for (const rule of linkRule) {
    const regex = new RegExp(rule);
    const match = originalLink.match(regex);
    if (match && match.length > 0) {
      result.validLink = true;
      result.matchedUrl = service === 'youtube' ? match[1] : match[0];

      return result;
    }
  }

  return result;
}

export function getExampleUrl(service: string) {
  let exampleUrl = '';
  const link = EmbedServiceLink[service];
  if (link) {
    exampleUrl = link.example;
  }
  return exampleUrl;
}

function formatUrl(url: string) {
  let service = 'iframe';

  if (url.includes?.('youtube') || url.includes?.('youtu.be')) {
    service = 'youtube';
  }

  if (url.includes('youku')) {
    service = 'youku';
  }

  if (url.includes('bilibili')) {
    service = 'bilibili';
  }

  if (url.includes('qq')) {
    service = 'qqvideo';
  }

  if (url.includes('amap')) {
    service = 'amap';
  }

  if (url.includes('map.baidu')) {
    service = 'baidu_map';
  }

  if (url.includes('google.com/maps') || url.includes('maps.app.goo.gl')) {
    service = 'googlemaps';
  }

  if (url.includes('modao')) {
    service = 'modao';
  }

  if (url.includes('lanhuapp')) {
    service = 'lanhu';
  }

  if (url.includes('figma')) {
    service = 'figma';
  }

  if (url.includes('canva')) {
    service = 'canva';
  }

  if (url.includes('processon')) {
    service = 'processon';
  }

  if (url.includes('codepen')) {
    service = 'codepen';
  }

  if (url.includes('jinshuju')) {
    service = 'jinshuju';
  }

  if (url.includes('iframe')) {
    service = 'iframe';
  }

  return service;
}

export function getServiceSrc(originalLink: any) {
  let result = {
    validLink: false,
    validId: false,
    matchedUrl: '',
    originalLink,
    src: '',
  };

  const service = formatUrl(originalLink);

  // matched url
  result = getMatchedUrl(service, originalLink, result);

  if (!result.validLink) {
    return result;
  }

  // src
  switch (service) {
    case 'youtube': {
      return getYoutubeSrc(result);
    }
    case 'youku': {
      return getYoukuSrc(result);
    }
    case 'bilibili': {
      return getBilibiliSrc(result);
    }
    case 'qqvideo': {
      return getQQVideoSrc(result);
    }
    case 'amap': {
      return getAMapSrc(originalLink, result);
    }
    case 'baidu_map': {
      return getBaiduMapSrc(originalLink, result);
    }
    case 'googlemaps': {
      return getGoogleMapSrc(originalLink, result);
    }
    case 'modao': {
      return getModaoSrc(result);
    }
    case 'lanhu': {
      return getLanhuSrc(result);
    }
    case 'figma': {
      return getFigmaSrc(result);
    }
    case 'canva': {
      return getCanvaSrc(originalLink, result);
    }
    case 'processon': {
      return getProcessonSrc(originalLink, result);
    }
    case 'codepen': {
      return getCodepenSrc(result);
    }
    case 'jinshuju': {
      return getJinshujuSrc(originalLink, result);
    }
    case 'iframe': {
      return getCommonSrc(originalLink, result);
    }
    default: {
      return originalLink;
    }
  }
}
