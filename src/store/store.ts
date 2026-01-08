import { createSignal, useSetSignal, useSignalValue } from 'reactjs-signal';

import createFastContext from '@/store/fast-context';

const { Provider: ProviderUploadImage, useStore: useStoreUploadImage } = createFastContext({
  value: false
});

const { Provider: ProviderUploadVideo, useStore: useStoreUploadVideo } = createFastContext({
  value: false
});

const editableEditorSignal = createSignal<{ value: boolean }>({
  value: false,
});

function useEditableEditor () {
  const isEditableEditor = useSignalValue(editableEditorSignal).value;

  return isEditableEditor;
}

function useStoreEditableEditor () {
  return useSetSignal(editableEditorSignal);
}

export {
  ProviderUploadImage,
  useStoreUploadImage,

  ProviderUploadVideo,
  useStoreUploadVideo,

  useStoreEditableEditor,
  useEditableEditor,
};
