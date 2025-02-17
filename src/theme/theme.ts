import { createSignal, useSignalValue } from 'reactjs-signal'

const themeProxy = createSignal('light')

export function useTheme() {
  return useSignalValue(themeProxy)
}

export const themeActions = {
  setTheme: (theme: string) => {
    themeProxy(theme)
  },
}
