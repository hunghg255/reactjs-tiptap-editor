import { useStoreTheme } from '@/store/store';
import { dispatchEvent } from '@/utils/customEvents/customEvents';

export function useTheme() {
  const [v] = useStoreTheme(store => store.value);

  return v;
}

export const themeActions = {
  setTheme: (theme: string) => {
    dispatchEvent('UPDATE_THEME', theme);
  },
};
