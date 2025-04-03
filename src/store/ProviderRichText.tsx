/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect } from 'react';

import { ProviderEditableEditor, ProviderTheme, ProviderUploadImage, ProviderUploadVideo, useStoreUploadImage, useStoreUploadVideo, useStoreEditableEditor, useStoreTheme } from '@/store/store';
import { listenEvent } from '@/utils/customEvents/customEvents';

const EventInitial = memo(({ children }: any) => {
  const [, setUploadImage] = useStoreUploadImage(store => store.value);
  const [, setUploadVideo] = useStoreUploadVideo(store => store.value);
  const [, setEditable] = useStoreEditableEditor(store => store.value);
  const [, setTheme] = useStoreTheme(store => store.value);

  const handleUploadImage = (evt: any) => {
    setUploadImage({
      value: evt.detail
    });
  };

  const handleUploadVideo = (evt: any) => {
    setUploadVideo({
      value: evt.detail
    });
  };

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
    const rm1 = listenEvent('UPLOAD_IMAGE', handleUploadImage);
    const rm2 = listenEvent('UPLOAD_VIDEO', handleUploadVideo);
    const rm3 = listenEvent('EDIT', handleEditable);
    const rm4 = listenEvent('UPDATE_THEME', handleTheme);

    return () => {
      rm1();
      rm2();
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
    <ProviderUploadImage>
      <ProviderUploadVideo>
        <ProviderEditableEditor>
          <ProviderTheme>
            <EventInitial>
              {children}
            </EventInitial>
          </ProviderTheme>
        </ProviderEditableEditor>
      </ProviderUploadVideo>
    </ProviderUploadImage>
  );
}
