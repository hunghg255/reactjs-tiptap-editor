import { useStoreUploadVideo } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { eventName } from '@/utils/customEvents/events.constant';

export function useDialogVideo() {
  const [v] = useStoreUploadVideo(store => store.value);

  return v;
}

export const actionDialogVideo = {
  setOpen: (value: boolean) => {
    dispatchEvent(eventName.getEventNameUploadVideo(), value);
  },
};
