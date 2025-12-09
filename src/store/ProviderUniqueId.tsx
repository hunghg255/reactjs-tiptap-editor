/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect } from 'react';

import { useSignal } from 'reactjs-signal';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { atomLang } from '@/locales';
import { ProviderEditableEditor, useStoreEditableEditor,  } from '@/store/store';
import { THEME } from '@/theme/theme';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';
import { removeCSS, updateCSS } from '@/utils/dynamicCSS';

const EventInitial = memo(({ editor, children }: any) => {
  const [, setEditable] = useStoreEditableEditor(store => store.value);

  useEffect(() => {
    setEditable({
      value: editor?.isEditable
    });
  }, [editor?.isEditable]);

  const onEditableChange = () => {
    setEditable({
      value: editor?.isEditable
    });
  };

  useEffect(() => {
    if (editor) {
      editor.on('update', onEditableChange);
    }

    return () => {
      if (editor) {
        editor.off('update', onEditableChange);
      }
    };
  }, [editor]);

  return (
    <>
      {children}
    </>
  );
});

function ProviderLanguage () {
  const [lang, setLang] = useSignal(atomLang);

  const handChainLanguage = (evt: any) => {
    setLang({
      ...lang,
      currentLang: evt.detail
    });
  };

  useEffect(() => {
    const rm = listenEvent(EVENTS.CHANGE_LANGUAGE, handChainLanguage);

    return () => {
      rm();
    };
  }, []);

  return <></>;
}

function ThemeColor () {
  const [theme, setTheme] = useLocalStorage('richtext-theme', 'light');
  const [color, setColor] = useLocalStorage('richtext-color', 'default');
  const [borderRadius, setBorderRadius] = useLocalStorage('richtext-border-radius', '0.65rem');

  useEffect(() => {
    const themeValue = theme || 'light';
    const colorValue = color || 'default';

    //@ts-ignore
    let themeObject = THEME[themeValue as keyof typeof THEME][colorValue as keyof typeof THEME.light];

    if (!themeObject) {
      themeObject = THEME['light']['default'];
      return;
    }

    updateCSS(`
      .reactjs-tiptap-editor, .reactjs-tiptap-editor *,
      div[data-richtext-portal], div[data-richtext-portal] * {
        ${Object.entries(themeObject).map(([key, value]) => {
          if (typeof borderRadius === 'string' && key === 'radius'  ) {
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

  const onChangeTheme = (evt: any) => {
    setTheme(evt.detail);
  };

  const onChangeColor = (evt: any) => {
    setColor(evt.detail);
  };

  const onChangeBorderRadius = (evt: any) => {
    setBorderRadius(evt.detail);
  };

  useEffect(() => {
    const rm1 = listenEvent(EVENTS.CHANGE_THEME, onChangeTheme);
    const rm2 = listenEvent(EVENTS.CHANGE_COLOR, onChangeColor);
    const rm3 = listenEvent(EVENTS.CHANGE_BORDER_RADIUS, onChangeBorderRadius);

    return () => {
      rm1();
      rm2();
      rm3();
    };
  }, []);

  return <></>;
}

export function ProviderUniqueId({ editor, children, id }: { children: React.ReactNode; id: any, editor: any }) {

  return (
    <ProviderEditableEditor >
      <EventInitial editor={editor}
        id={id}
      >
        {children}
      </EventInitial>

      <ProviderLanguage />
      <ThemeColor />
    </ProviderEditableEditor>
  );
}
