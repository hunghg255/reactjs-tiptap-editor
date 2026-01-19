import { useCallback } from 'react';
import { createSignal, getSignal, useSetSignal, useSignalValue } from 'reactjs-signal';

import { DEFAULT_LANG_VALUE } from '@/constants';

import en from './en';
import fi from './fi';
import hu_HU from './hu';
import pt_BR from './pt-br';
import vi from './vi';
import zh_CN from './zh-cn';

const LANG = {
  currentLang: DEFAULT_LANG_VALUE,
  message: {
    en,
    hu_HU,
    vi,
    zh_CN,
    pt_BR,
    fi,
  },
};

// // Define message key types based on the 'en' locale
type MessageKeysType = keyof typeof en;
type LanguageType = keyof typeof LANG.message | (string & {});

// Proxy for reactive language state
interface LangState {
  currentLang: LanguageType;
  message: typeof LANG.message;
}

const langSignal = createSignal<LangState>({
  currentLang: LANG.currentLang,
  message: LANG.message,
});

// setLang: (newLang: LanguageType) => {
//   set(() => ({
//     currentLang: newLang,
//   }));
// },
// setMessage: (lang: LanguageType, messages: Partial<Record<keyof typeof en, string>>) => {
//   set((state) => ({
//     message: {
//       ...state.message,
//       [lang]: {
//         ...state.message[lang as keyof typeof LANG.message],
//         ...messages,
//       },
//     },
//   }));
// }
function useLocale() {
  const currentLang = useSignalValue(langSignal).currentLang;
  const message = useSignalValue(langSignal).message;
  const setLang = useSetSignal(langSignal);

  const t = useCallback(
    (path: MessageKeysType, params?: Record<string, string | number>) => {
      try {
        //@ts-expect-error
        const messageObj = message[currentLang] || {};
        let template = messageObj[path] || path;

        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
          });
        }

        return template;
      } catch {
        return path;
      }
    },
    [message, currentLang]
  );

  return {
    setLang,
    lang: currentLang,
    t,
  };
}

const localeActions = {
  setLang: (lang: LanguageType | (string & {})) => {
    getSignal(langSignal).setValue((prev) => ({
      ...prev,
      currentLang: lang,
    }));
  },
  setMessage: (
    lang: LanguageType | (string & {}),
    messages: Partial<Record<keyof typeof LANG.message.en, string>>
  ) => {
    getSignal(langSignal).setValue((prev) => ({
      ...prev,
      message: {
        ...prev.message,
        [lang]: {
          ...prev.message[lang as keyof typeof LANG.message],
          ...messages,
        },
      },
    }));
  },
};

export { localeActions, useLocale };
export { en, hu_HU, vi, zh_CN, pt_BR, fi };
