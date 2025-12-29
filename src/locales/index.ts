import { useCallback } from 'react';

import { create } from 'zustand';

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
  setLang: (newLang: LanguageType) => void;
  setMessage: (lang: LanguageType, messages: Partial<Record<keyof typeof en, string>>) => void;
}

const useLang = create<LangState>()((set) => ({
  currentLang: LANG.currentLang,
  message: LANG.message,
  setLang: (newLang: LanguageType) => {
    set(() => ({
      currentLang: newLang,
    }));
  },
  setMessage: (lang: LanguageType, messages: Partial<Record<keyof typeof en, string>>) => {
    set((state) => ({
      message: {
        ...state.message,
        [lang]: {
          ...state.message[lang as keyof typeof LANG.message],
          ...messages,
        },
      },
    }));
  }
}));

function useLocale() {
  const currentLang = useLang((state) => state.currentLang);
  const message = useLang((state) => state.message);
  const setLang = useLang((state) => state.setLang);

  const t = useCallback((path: MessageKeysType, params?: Record<string, string | number>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  }, [message, currentLang]);

  return {
    setLang,
    lang: currentLang,
    t,
  };
}

const localeActions = {
  setLang: (lang: LanguageType | (string & {})) => {
    useLang.getState().setLang(lang);
  },
  setMessage: (lang: LanguageType | (string & {}), messages: Partial<Record<keyof typeof LANG.message.en, string>>) => {
    useLang.getState().setMessage(lang, messages);
  },
};

export { localeActions, useLocale };
export { en, hu_HU, vi, zh_CN, pt_BR, fi };
