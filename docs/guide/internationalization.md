---
description: Internationalization

next:
  text: Custom Theme
  link: /guide/custom-theme.md
---

# Internationalization

The library includes translations for its controls and dialogs. English (`en`) is the default. Changing the locale changes interface text; it does not translate document content.

## Choose a language

Use `localeActions.setLang` during application initialization or in an event handler:

```tsx
import { localeActions, useLocale } from 'reactjs-tiptap-editor/locale-bundle';

export function LanguagePicker() {
  const { lang } = useLocale();

  return (
    <select
      aria-label='Editor language'
      value={lang}
      onChange={(event) => localeActions.setLang(event.target.value)}
    >
      <option value='en'>English</option>
      <option value='vi'>Tiếng Việt</option>
      <option value='ja'>日本語</option>
    </select>
  );
}
```

`useLocale()` returns `lang` (the language code) and `t` (a translation function). Call the hook inside a React component. Use `localeActions.setLang` to change the language by code.

Locale state is shared across editor instances in the application. The library does not automatically persist a language choice across reloads; restore your application's preference when initializing the client.

## Included languages

| Language             | Code    |
| -------------------- | ------- |
| English              | `en`    |
| Vietnamese           | `vi`    |
| Simplified Chinese   | `zh_CN` |
| Brazilian Portuguese | `pt_BR` |
| Hungarian            | `hu_HU` |
| Finnish              | `fi`    |
| Japanese             | `ja`    |

Use the exact code, including underscores and capitalization.

## Override existing messages

`setMessage` merges the supplied keys into the language's current messages. You can override a single label without copying the entire dictionary:

```ts
import { localeActions } from 'reactjs-tiptap-editor/locale-bundle';

localeActions.setMessage('en', {
  'editor.remove': 'Delete',
});
```

## Add a language

Start from the exported English dictionary, override the keys you have translated, then select the new language:

```ts
import { en, localeActions } from 'reactjs-tiptap-editor/locale-bundle';

localeActions.setMessage('fr', {
  ...en,
  'editor.remove': 'Supprimer',
});
localeActions.setLang('fr');
```

The English spread supplies untranslated labels. Without it, missing messages display their key; there is no automatic English fallback for missing keys in a custom language. Register messages before selecting a new code.

## Use translations in custom controls

```tsx
import { useLocale } from 'reactjs-tiptap-editor/locale-bundle';

export function RemoveLabel() {
  const { t } = useLocale();
  return <span>{t('editor.remove')}</span>;
}
```

For messages containing placeholders such as `{count}`, pass a values object as the second argument to `t`. Preserve placeholder names when translating. The exported `en` object and TypeScript completion provide the available message keys.
