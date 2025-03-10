/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';
import deepEqual from 'deep-equal';

type MapFn<T, R> = (arg: T) => R;

function mapSelf<T>(d: T): T {
  return d;
}

export function useAttributes<T, R = T>(editor: Editor, attrbute: string, defaultValue?: T, map?: (arg: T) => R) {
  const mapFn = (map || mapSelf) as MapFn<T, R>;
  const [value, setValue] = useState<R>(mapFn(defaultValue as any));
  const prevValueCache = useRef<R>(value);

  useEffect(() => {
    const listener = () => {
      const attrs = { ...defaultValue, ...editor.getAttributes(attrbute) } as any;
      Object.keys(attrs).forEach((key) => {
        if (attrs[key] === null || attrs[key] === undefined) {
          // @ts-ignore
          attrs[key] = defaultValue ? defaultValue[key] : null;
        }
      });
      const nextAttrs = mapFn(attrs);
      if (deepEqual(prevValueCache.current, nextAttrs)) {
        return;
      }
      setValue(nextAttrs);
      prevValueCache.current = nextAttrs;
    };

    editor.on('selectionUpdate', listener);
    editor.on('transaction', listener);

    return () => {
      editor.off('selectionUpdate', listener);
      editor.off('transaction', listener);
    };
  }, [editor, defaultValue, attrbute, mapFn]);

  return value;
}
