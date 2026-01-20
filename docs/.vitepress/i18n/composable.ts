import { useData } from 'vitepress';

import { t } from './utils';

export function useTranslate(lang?: string) {
  // oxlint-disable-next-line eslint-plugin-react-hooks/rules-of-hooks
  return (key: string) => t(key, lang || useData().lang.value);
}
