/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect } from 'react';

import { useSignal } from 'reactjs-signal';

import { atomLang } from '@/locales';
import { ProviderEditableEditor, ProviderTheme, useStoreEditableEditor, useStoreTheme } from '@/store/store';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

const EventInitial = memo(({ editor, children, id }: any) => {
  const [, setEditable] = useStoreEditableEditor(store => store.value);
  const [, setTheme] = useStoreTheme(store => store.value);

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

  const handleTheme = (evt: any) => {
    setTheme({
      value: evt.detail
    });
  };

  useEffect(() => {
    const rm = listenEvent(EVENTS.UPDATE_THEME(id), handleTheme);

    return () => {
      rm();
    };
  }, []);

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

export function ProviderUniqueId({ editor, children, id }: { children: React.ReactNode; id: any, editor: any }) {

  return (
    <ProviderEditableEditor >
      <ProviderTheme>
        <EventInitial editor={editor}
          id={id}
        >
          {children}
        </EventInitial>

        <ProviderLanguage />
      </ProviderTheme>
    </ProviderEditableEditor>
  );
}
