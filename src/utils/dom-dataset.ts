/* eslint-disable @typescript-eslint/ban-ts-comment */
 
import { safeJSONParse } from '@/utils/json';

/**
 * @param json
 */
export function jsonToStr(json: Record<string, unknown>) {
  try {
    return JSON.stringify(json);
  } catch {
    return JSON.stringify({});
  }
}

/**
 * @param str
 */
export function strToJSON(str: string) {
  return safeJSONParse(str);
}

/**
 * @param element
 * @param json
 */
export function jsonToDOMDataset(json: Record<string, unknown>) {
  return Object.keys(json).map((key) => {
    let value = json[key];

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    return {
      key: `data-${key}`,
      value: encodeURIComponent(value as string),
    };
  });
}

/**
 * @param element
 * @param attribute
 * @param transformToJSON
 */
export function getDatasetAttribute(attribute: string, transformToJSON = false) {
  return (element: HTMLElement) => {
    const dataKey = attribute.startsWith('data-') ? attribute : `data-${attribute}`;
    // @ts-ignore
    let value = decodeURIComponent(element.getAttribute(dataKey));

    if (value == null || (typeof value === 'string' && value === 'null')) {
      try {
        const html = element.outerHTML;

        const texts = html.match(/([\S\s])+?="([\S\s])+?"/g);
        if (texts && texts.length > 0) {
          const params = texts
            .map(str => str.trim())
            .reduce((accu, item) => {
              const i = item.indexOf('=');
              const arr = [item.slice(0, i), item.slice(i + 1).slice(1, -1)];
              // @ts-expect-error
              accu[arr[0]] = arr[1];
              return accu;
            }, {});

          // @ts-expect-error
          value = (params[attribute.toLowerCase()] || '').replaceAll('&quot;', '"');
        }
      } catch (e: any) {
        console.error('Error getDatasetAttribute ', e.message, element);
      }
    }

    if (transformToJSON) {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }

    if (value.includes('%') || value.includes('auto')) {
      return value;
    }

    const toNumber = Number.parseInt(value);
    return toNumber !== toNumber ? value : toNumber;
  };
}

/**
 * 将节点属性转换为 dataset
 * @param node
 * @returns
 */
export function nodeAttrsToDataset(node: Node) {
  const { attrs } = node as any;

  return Object.keys(attrs).reduce((accu, key) => {
    const value = attrs[key];

    if (value == null) {
      return accu;
    }

    let encodeValue = '';

    if (typeof value === 'object') {
      encodeValue = jsonToStr(value);
    } else {
      encodeValue = value;
    }

    accu[key] = encodeValue;

    return accu;
  }, Object.create(null));
}
