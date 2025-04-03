import createFastContext from '@/store/fast-context';

const { Provider: ProviderUploadImage, useStore: useStoreUploadImage } = createFastContext({
  value: false
});

const { Provider: ProviderUploadVideo, useStore: useStoreUploadVideo } = createFastContext({
  value: false
});

const { Provider: ProviderEditableEditor, useStore: useStoreEditableEditor } = createFastContext({
  value: false
});

const { Provider: ProviderTheme, useStore: useStoreTheme } = createFastContext({
  value: 'light'
});

export {
  ProviderUploadImage,
  useStoreUploadImage,

  ProviderUploadVideo,
  useStoreUploadVideo,

  ProviderEditableEditor,
  useStoreEditableEditor,

  ProviderTheme,
  useStoreTheme,
};
