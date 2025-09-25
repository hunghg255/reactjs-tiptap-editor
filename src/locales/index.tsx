import { useEffect, useMemo } from 'react';

import { createSignal, useSignal } from 'reactjs-signal';

import { DEFAULT_LANG_VALUE } from '@/constants';
import mitt from '@/utils/mitt';
import type { EventType } from '@/utils/mitt';

import en from './en';
import hu_HU from './hu';
import pt_BR from './pt-br';
import vi from './vi';
import zh_CN from './zh-cn';
import fi from './fi';

// Define supported language types
type LanguageType = 'en' | 'hu_HU' | 'vi' | 'zh_CN' | 'pt_BR' | 'fi' | (string & {});

// Define message key types based on the 'en' locale
type MessageKeysType = keyof typeof en;

interface LocaleInterface {
  lang: LanguageType
  message: Record<LanguageType, Record<MessageKeysType, string>>
}

// Interface for locale configuration
interface LocaleInterface {
  lang: LanguageType
  message: Record<LanguageType, Record<MessageKeysType, string>>
}

// Interface for Mitt events
interface MittEvents extends Record<EventType, unknown> {
  lang: LanguageType
}

// Default locale configuration
export const DEFAULT_LOCALE: LocaleInterface = {
  lang: DEFAULT_LANG_VALUE,
  message: {
    en,
    hu_HU,
    vi,
    zh_CN,
    pt_BR,
    fi,
  },
};

class Locale {
  private emitter;
  constructor() {
    this.emitter = mitt<MittEvents>();
  }

  // Getter and setter for current language
  get lang(): LanguageType {
    return DEFAULT_LOCALE.lang;
  }

  set lang(lang: LanguageType) {
    if (!this.isLangSupported(lang)) {
      console.warn(
        `Can't find the current language "${lang}", Using language "${DEFAULT_LOCALE.lang}" by default`,
      );
      return;
    }

    DEFAULT_LOCALE.lang = lang;
    this.emitter.emit('lang', lang);
  }

  // Getter and setter for messages
  get message(): Record<LanguageType, Record<MessageKeysType, string>> {
    return DEFAULT_LOCALE.message;
  }

  set message(message: Record<LanguageType, Record<MessageKeysType, string>>) {
    DEFAULT_LOCALE.message = message;
  }

  // Load messages for a specific language
  loadLangMessage(lang: LanguageType): Record<MessageKeysType, string> {
    return this.message[lang];
  }

  // Check if a language is supported
  private isLangSupported(lang: LanguageType): boolean {
    const supportedLangs = Object.keys(this.message) as LanguageType[];
    return supportedLangs.includes(lang);
  }

  // Set the current language
  public setLang(lang: LanguageType) {
    this.lang = lang;
  }

  // Register a language change watcher
  public registerWatchLang(hook: (lang: LanguageType) => void) {
    this.emitter.on('lang', hook);

    const unsubscribe = () => {
      this.emitter.off('lang', hook);
    };

    return {
      unsubscribe,
    };
  }

  // Set messages for a specific language
  public setMessage(lang: string, message: Record<MessageKeysType, string>) {
    this.message[lang] = message;
  }

  // Build a translation function for a given language
  buildLocalesHandler(lang?: LanguageType) {
    if (!lang) {
      lang = this.lang;
    }

    const message = this.loadLangMessage(lang);

    return function t(path: MessageKeysType, params?: Record<string, string | number>) {
      let template = message[path] || path;

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
        });
      }

      return template;
    };
  }
}

const locale = new Locale();

// Proxy for reactive language state
const atomLang = createSignal(DEFAULT_LOCALE.lang);

function useLocale() {
  const [lang, setLang] = useSignal(atomLang);

  const t = useMemo(() => {
    return locale.buildLocalesHandler(lang);
  }, [lang]);

  useEffect(() => {
    const watchLang = locale.registerWatchLang((val) => {
      setLang(val);
    });

    return () => {
      watchLang.unsubscribe();
    };
  }, []);

  return {
    lang,
    t,
  };
}

const localeActions = {
  t: (path: MessageKeysType, params?: Record<string, string | number>) => {
    return locale.buildLocalesHandler(atomLang())(path, params);
  },
};

export type TranslationFunction = (path: MessageKeysType, params?: Record<string, string | number>) => string;

export default locale;
export { Locale, localeActions, useLocale };

export { default as en } from './en';
export { default as pt_BR } from './pt-br';
export { default as vi } from './vi';
export { default as zh_CN } from './zh-cn';
export { default as hu_HU } from './hu';
export { default as fi } from './fi';
