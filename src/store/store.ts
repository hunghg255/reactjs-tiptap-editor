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

function useEditableEditor () {
  const [isEditableEditor] = useStoreEditableEditor(store => store.value);

  return isEditableEditor;
}

export {
  ProviderUploadImage,
  useStoreUploadImage,

  ProviderUploadVideo,
  useStoreUploadVideo,

  ProviderEditableEditor,
  useStoreEditableEditor,
  useEditableEditor,
};
