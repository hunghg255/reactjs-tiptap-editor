import { useStoreTheme } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

export function useTheme() {
  const [v] = useStoreTheme(store => store.value);

  return v;
}

export const themeActions = {
  setTheme: (id: any, theme: string) => {
    dispatchEvent(EVENTS.UPDATE_THEME(id), theme);
  },
};
