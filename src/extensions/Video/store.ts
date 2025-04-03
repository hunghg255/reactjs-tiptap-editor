import { useStoreUploadVideo } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

export function useDialogVideo() {
  const [v] = useStoreUploadVideo(store => store.value);

  return v;
}

export const actionDialogVideo = {
  setOpen: (id: any, value: boolean) => {
    dispatchEvent(EVENTS.UPLOAD_VIDEO(id), value);
  },
};
