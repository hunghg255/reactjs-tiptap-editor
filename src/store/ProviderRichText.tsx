/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect, useId } from 'react';

import { ProviderEditableEditor, ProviderTheme, useStoreEditableEditor, useStoreTheme } from '@/store/store';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { eventName } from '@/utils/customEvents/events.constant';

const EventInitial = memo(({ children }: any) => {
  const [, setEditable] = useStoreEditableEditor(store => store.value);
  const [, setTheme] = useStoreTheme(store => store.value);
  const id = useId();

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
    eventName.setEventNameEdit(id);
    eventName.setEventNameUpdateTheme(id);

    const rm3 = listenEvent(eventName.getEventNameEdit(), handleEditable);
    const rm4 = listenEvent(eventName.getEventNameUpdateTheme(), handleTheme);

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

export function ProviderRichText ({ children }: { children: React.ReactNode }) {

  return (
    <ProviderEditableEditor>
      <ProviderTheme>
        <EventInitial>
          {children}
        </EventInitial>
      </ProviderTheme>
    </ProviderEditableEditor>
  );
}
