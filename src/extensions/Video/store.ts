import { useStoreUploadVideo } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';

export function useDialogVideo() {
  const [v] = useStoreUploadVideo(store => store.value);

  return v;
}

export const actionDialogVideo = {
  setOpen: (value: boolean) => {
    dispatchEvent('UPLOAD_VIDEO', value);
  },
};
