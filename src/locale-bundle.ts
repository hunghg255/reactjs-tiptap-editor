// Compatibility entry: importing this module registers all bundled languages.
import { localeActions } from './locales';
import fi from './locales/fi';
import hu_HU from './locales/hu';
import ja from './locales/ja';
import pt_BR from './locales/pt-br';
import vi from './locales/vi';
import zh_CN from './locales/zh-cn';

for (const [language, messages] of Object.entries({ fi, hu_HU, ja, pt_BR, vi, zh_CN })) {
  localeActions.setMessage(language, messages);
}

export { localeActions, useLocale, en } from './locales';
export { fi, hu_HU, ja, pt_BR, vi, zh_CN };
