import { useEffect, useMemo } from 'react'

import { proxy, useSnapshot } from 'valtio'

import en from './en'
import vi from './vi'
import zh_CN from './zh-cn'
import mitt from '@/utils/mitt'
import type { EventType } from '@/utils/mitt'
import { DEFAULT_LANG_VALUE } from '@/constants'

type LanguageType = 'en' | 'vi' | 'zh_CN'

interface LocaleInterface {
  lang: LanguageType
  message: Record<LanguageType, Record<string, string>>
}

interface MittEvents extends Record<EventType, unknown> {
  lang: LanguageType
}

export const DEFAULT_LOCALE: LocaleInterface = {
  lang: DEFAULT_LANG_VALUE,
  message: {
    en,
    vi,
    zh_CN,
  },
}

class Locale {
  private emitter
  constructor() {
    this.emitter = mitt<MittEvents>()
  }

  get lang(): LanguageType {
    return DEFAULT_LOCALE.lang
  }

  set lang(lang: LanguageType) {
    if (!this.isLangSupported(lang)) {
      console.warn(
        `Can't find the current language "${lang}", Using language "${DEFAULT_LOCALE.lang}" by default`,
      )
      return
    }

    DEFAULT_LOCALE.lang = lang
    this.emitter.emit('lang', lang)
  }

  get message(): Record<LanguageType, Record<string, string>> {
    return DEFAULT_LOCALE.message
  }

  set message(message: Record<LanguageType, Record<string, string>>) {
    DEFAULT_LOCALE.message = message
  }

  loadLangMessage(lang: LanguageType): Record<string, string> {
    return this.message[lang]
  }

  private isLangSupported(lang: LanguageType): boolean {
    const supportedLangs = Object.keys(this.message) as LanguageType[]
    return supportedLangs.includes(lang)
  }

  public setLang(lang: LanguageType) {
    this.lang = lang
  }

  public registerWatchLang(hook: (lang: LanguageType) => void) {
    this.emitter.on('lang', hook)

    const unsubscribe = () => {
      this.emitter.off('lang', hook)
    }

    return {
      unsubscribe,
    }
  }

  public setMessage(lang: LanguageType, message: Record<string, string>) {
    this.message[lang] = message
  }

  buildLocalesHandler(lang?: LanguageType) {
    if (!lang) {
      lang = this.lang
    }

    const message = this.loadLangMessage(lang)

    return function t(path: string): string {
      return message[path] || path
    }
  }
}

const locale = new Locale()

const atomLang = proxy({
  lang: DEFAULT_LOCALE.lang,
})

function useLocale() {
  const atomLangSnap = useSnapshot(atomLang)

  const t = useMemo(() => {
    return locale.buildLocalesHandler(atomLangSnap.lang)
  }, [atomLangSnap.lang])

  useEffect(() => {
    const watchLang = locale.registerWatchLang((val) => {
      atomLang.lang = val
    })

    return () => {
      watchLang.unsubscribe()
    }
  }, [])

  return {
    lang: atomLangSnap.lang,
    t,
  }
}

const localeActions = {
  t: (path: string) => {
    return locale.buildLocalesHandler(atomLang.lang)(path)
  },
}

export default locale
export { Locale, useLocale, localeActions }

export { default as en } from './en'
export { default as vi } from './vi'
export { default as zh_CN } from './zh-cn'
