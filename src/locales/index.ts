import { useCallback } from 'react';

import { createSignal, useSignal } from 'reactjs-signal';

import { DEFAULT_LANG_VALUE } from '@/constants';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

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

// Proxy for reactive language state
export const atomLang = createSignal(LANG);

// // Define supported language types
type LanguageType = keyof typeof LANG.message;

function useLocale() {
  const [lang, setLang] = useSignal(atomLang);

  const t = useCallback((path: MessageKeysType, params?: Record<string, string | number>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const message = lang.message[lang.currentLang] || {};
    let template = message[path] || path;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      });
    }

    return template;
  }, [lang]);

  return {
    setLang,
    lang: lang.currentLang,
    t,
  };
}

const localeActions = {
  setLang: (lang: LanguageType) => {
    dispatchEvent(EVENTS.CHANGE_LANGUAGE, lang);
  }
};

export { localeActions, useLocale };
export { en, hu_HU, vi, zh_CN, pt_BR, fi };
