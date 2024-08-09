import { proxy, useSnapshot } from 'valtio';

const themeProxy = proxy({
  theme: 'light',
});

export const useTheme = () => {
  const themeSnapshot = useSnapshot(themeProxy);

  return themeSnapshot.theme;
};

export const themeActions = {
  setTheme: (theme: string) => {
    themeProxy.theme = theme;
  },
};
