---
description: Internationalization

next:
  text: Custom Theme
  link: /guide/custom-theme.md
---

# Internationalization (i18n)

The editor provides built-in internationalization support, with English as the default language.

## Usage

```javascript
// Import the locale object
import { localeActions, useLocale } from 'reactjs-tiptap-editor/locale-bundle';
// Set the language to English
localeActions.setLang('en');
// End


// Usage in a React component
const { lang: currentLocale } = useLocale();
console.log(currentLocale); // Outputs the current locale messages
```

## Supported Languages

Currently, the editor supports the following languages:

| Language             | Config | Version                                                                          |
|----------------------|--------| -------------------------------------------------------------------------------- |
| English              | en     | [v0.0.5](https://github.com/hunghg255/reactjs-tiptap-editor/releases/tag/v0.0.5) |
| Vietnamese           | vi     |                                                                                  |
| Simplified Chinese   | zh_CN  |                                                                                  |
| Brazilian Portuguese | pt_BR  |                                                                                  |
| Hungarian            | hu_HU  |                                                                                  |
| Finnish              | fi     |                                                                                  |

## Adding a New Language

If the platform doesn't support your desired language, you can add a custom language, for example: `fr`.

```javascript
import { localeActions } from 'reactjs-tiptap-editor/locale-bundle';
// Don't worry about which content to translate; setMessage supports TypeScript
localeActions.setMessage('fr', {
  'editor.remove': 'Supprimer',
  // ...
});
```

### Overriding Default Language

To override part of the current language system, first choose a new language name, then import the default language data, and finally override the translations you want.

```javascript
import { localeActions } from 'reactjs-tiptap-editor/locale-bundle';
import { en } from 'reactjs-tiptap-editor/locale-bundle';
localeActions.setMessage('en', {
  ...en,
  'editor.remove': 'Delete',
});
```

### Full List of Translation Keys

All translation keys used by the editor are located in the [English locale file](https://github.com/hunghg255/reactjs-tiptap-editor/blob/main/src/locales/en.ts).

Use this file as the source of truth when creating or extending a language. Simply copy the keys and translate them based on your target language.
