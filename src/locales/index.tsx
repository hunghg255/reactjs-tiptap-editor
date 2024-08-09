import { useEffect, useMemo } from 'react';

import { proxy, useSnapshot } from 'valtio';

import { DEFAULT_LANG_VALUE } from '@/constants';
import mitt, { EventType } from '@/utils/mitt';

import en from './en';
import vi from './vi';

interface LocaleInterface {
  lang: string;
  message: Record<string, Record<string, string>>;
}

interface MittEvents extends Record<EventType, unknown> {
  lang: string;
}

export const DEFAULT_LOCALE: LocaleInterface = {
  lang: DEFAULT_LANG_VALUE,
  message: {
    en,
    vi,
  },
};

class Locale {
  private emitter;
  constructor() {
    this.emitter = mitt<MittEvents>();
  }

  get lang(): string {
    return DEFAULT_LOCALE.lang;
  }

  set lang(lang: string) {
    if (!this.isLangSupported(lang)) {
      console.warn(
        `Can't find the current language "${lang}", Using language "${DEFAULT_LOCALE.lang}" by default`,
      );
      return;
    }

    DEFAULT_LOCALE.lang = lang;
    this.emitter.emit('lang', lang);
  }

  get message(): Record<string, Record<string, string>> {
    return DEFAULT_LOCALE.message;
  }

  set message(message: Record<string, Record<string, string>>) {
    DEFAULT_LOCALE.message = message;
  }

  loadLangMessage(lang: string): Record<string, string> {
    return this.message[lang];
  }

  private isLangSupported(lang: string): boolean {
    const supportedLangs = Object.keys(this.message);
    return supportedLangs.includes(lang);
  }

  public setLang(lang: string) {
    this.lang = lang;
  }

  public registerWatchLang(hook: (lang: string) => void) {
    this.emitter.on('lang', hook);

    const unsubscribe = () => {
      this.emitter.off('lang', hook);
    };

    return {
      unsubscribe,
    };
  }

  public setMessage(lang: string, message: Record<string, string>) {
    this.message[lang] = message;
  }

  buildLocalesHandler(lang?: string) {
    if (!lang) {
      lang = this.lang;
    }

    const message = this.loadLangMessage(lang);

    return function t(path: string): string {
      return message[path] || path;
    };
  }
}

const locale = new Locale();

const atomLang = proxy({
  lang: DEFAULT_LOCALE.lang,
});

const useLocale = () => {
  const atomLangSnap = useSnapshot(atomLang);

  const t = useMemo(() => {
    return locale.buildLocalesHandler(atomLangSnap.lang);
  }, [atomLangSnap.lang]);

  useEffect(() => {
    const watchLang = locale.registerWatchLang((val) => {
      atomLang.lang = val;
    });

    return () => {
      watchLang.unsubscribe();
    };
  }, []);

  return {
    lang: atomLangSnap.lang,
    t,
  };
};

const localeActions = {
  t: (path: string) => {
    return locale.buildLocalesHandler(atomLang.lang)(path);
  },
};

export default locale;
export { Locale, useLocale, localeActions };

export { default as en } from './en';
export { default as vi } from './vi';
