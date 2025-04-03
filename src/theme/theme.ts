import { useStoreTheme } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { eventName } from '@/utils/customEvents/events.constant';

export function useTheme() {
  const [v] = useStoreTheme(store => store.value);

  return v;
}

export const themeActions = {
  setTheme: (theme: string) => {
    dispatchEvent(eventName.getEventNameUpdateTheme(), theme);
  },
};
