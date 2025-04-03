import { useStoreUploadImage } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

export function useDialogImage() {
  const [v] = useStoreUploadImage(store => store.value);

  return v;
}

export const actionDialogImage = {
  setOpen: (id: any, value: boolean) => {
    dispatchEvent(EVENTS.UPLOAD_IMAGE(id), value);
  },
};
