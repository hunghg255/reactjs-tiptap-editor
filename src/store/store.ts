import { create } from 'zustand';

import createFastContext from '@/store/fast-context';

const { Provider: ProviderUploadImage, useStore: useStoreUploadImage } = createFastContext({
  value: false
});

const { Provider: ProviderUploadVideo, useStore: useStoreUploadVideo } = createFastContext({
  value: false
});

const useStoreEditableEditor = create<{ value: boolean, setEditable: (newValue: { value: boolean }) => void }>((set) => ({
  value: false,
  setEditable: (newValue: { value: boolean }) => {
    set(() => ({
      value: newValue.value,
    }));
  },
}));

function useEditableEditor () {
  const isEditableEditor = useStoreEditableEditor(store => store.value);

  return isEditableEditor;
}

export {
  ProviderUploadImage,
  useStoreUploadImage,

  ProviderUploadVideo,
  useStoreUploadVideo,

  useStoreEditableEditor,
  useEditableEditor,
};
