/* eslint-disable @typescript-eslint/ban-ts-comment */
const colors = [
  '#47A1FF',
  '#59CB74',
  '#FFB952',
  '#FC6980',
  '#6367EC',
  '#DA65CC',
  '#FBD54A',
  '#ADDF84',
  '#6CD3FF',
  '#659AEC',
  '#9F8CF1',
  '#ED8CCE',
  '#A2E5FF',
  '#4DCCCB',
  '#F79452',
  '#84E0BE',
  '#5982F6',
  '#E37474',
  '#3FDDC7',
  '#9861E5',
];

const total = colors.length;
export const getRandomColor = () => colors[Math.trunc(Math.random() * total)];

/**
 * @param hexCode
 * @param opacity
 * @returns
 */
export function convertColorToRGBA(hexCode: string, opacity = 1) {
  let r = 0;
  let g = 0;
  let b = 0;

  if (hexCode.startsWith('rgb')) {
    // @ts-expect-error
    const rgb = hexCode
      .replace(/\s/g, '')
      .match(/rgb\((.*)\)$/)[1]
      .split(',');

    r = +rgb[0];
    g = +rgb[1];
    b = +rgb[2];
  } else if (hexCode.startsWith('#')) {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    r = Number.parseInt(hex.substring(0, 2), 16);
    g = Number.parseInt(hex.substring(2, 4), 16);
    b = Number.parseInt(hex.substring(4, 6), 16);
  } else {
    return hexCode;
  }

  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }

  return `rgba(${r},${g},${b},${opacity})`;
}
