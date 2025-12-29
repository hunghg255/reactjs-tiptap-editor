/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useEffect } from 'react';

import { THEME, useTheme } from '@/theme/theme';
import { removeCSS, updateCSS } from '@/utils/dynamicCSS';

export function ThemeColorReactive() {
  const { theme, color, borderRadius } = useTheme();

  useEffect(() => {
    const themeValue = theme || 'light';
    const colorValue = color || 'default';

    //@ts-ignore
    let themeObject = THEME[themeValue][colorValue];

    if (!themeObject) {
      themeObject = THEME['light']['default'];
      return;
    }

    updateCSS(`
      .reactjs-tiptap-editor, .reactjs-tiptap-editor *,
      .reactjs-tiptap-editor-theme, .reactjs-tiptap-editor-theme *,
      div[data-richtext-portal], div[data-richtext-portal] * {
        ${Object.entries(themeObject).map(([key, value]) => {
      if (typeof borderRadius === 'string' && key === 'radius') {
        return `--${key}: ${borderRadius};`;
      }

      return `--${key}: ${value};`;
    }).join('\n')}
      }
      `, 'richtext-theme', {
      priority: 50
    });

    return () => {
      removeCSS('richtext-theme');
    };
  }, [theme, color, borderRadius]);

  return <></>;
}
