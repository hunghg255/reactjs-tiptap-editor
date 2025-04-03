import { useStoreUploadImage } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';

export function useDialogImage() {
  const [v] = useStoreUploadImage(store => store.value);

  return v;
}

export const actionDialogImage = {
  setOpen: (value: boolean) => {
    dispatchEvent('UPLOAD_IMAGE', value);
  },
};
