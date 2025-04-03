import { useStoreUploadImage } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { eventName } from '@/utils/customEvents/events.constant';

export function useDialogImage() {
  const [v] = useStoreUploadImage(store => store.value);

  return v;
}

export const actionDialogImage = {
  setOpen: (value: boolean) => {
    dispatchEvent(eventName.getEventNameUploadImage(), value);
  },
};
