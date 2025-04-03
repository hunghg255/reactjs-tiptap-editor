/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect } from 'react';

import { ProviderEditableEditor, ProviderTheme, useStoreEditableEditor, useStoreTheme } from '@/store/store';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

const EventInitial = memo(({ children, id }: any) => {
  const [, setEditable] = useStoreEditableEditor(store => store.value);
  const [, setTheme] = useStoreTheme(store => store.value);

  const handleEditable = (evt: any) => {
    setEditable({
      value: evt.detail
    });
  };

  const handleTheme = (evt: any) => {
    setTheme({
      value: evt.detail
    });
  };

  useEffect(() => {
    const rm3 = listenEvent(EVENTS.EDIT(id), handleEditable);
    const rm4 = listenEvent(EVENTS.UPDATE_THEME(id), handleTheme);

    return () => {
      rm3();
      rm4();
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
});

export function ProviderRichText ({ children, id }: { children: React.ReactNode; id: any }) {

  return (
    <ProviderEditableEditor>
      <ProviderTheme>
        <EventInitial id={id}>
          {children}
        </EventInitial>
      </ProviderTheme>
    </ProviderEditableEditor>
  );
}
