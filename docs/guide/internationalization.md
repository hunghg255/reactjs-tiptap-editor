---
description: Internationalization

next:
  text: Alignment
  link: /extensions/BaseKit.md
---

# Internationalization (i18n)

The editor provides built-in internationalization support, with English as the default language.

## Usage

```javascript
// Import the locale object
import { locale } from 'reactjs-tiptap-editor/locale-bundle';
// Set the language to English
locale.setLang('en');
// End
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
// Don't worry about which content to translate; setMessage supports TypeScript
locale.setMessage('fr', {
  'editor.remove': 'Supprimer',
  // ...
});
```

### Overriding Default Language

To override part of the current language system, first choose a new language name, then import the default language data, and finally override the translations you want.

```javascript
import { en } from 'reactjs-tiptap-editor/locale-bundle';
locale.setMessage('en_US', {
  ...en,
  'editor.remove': 'Delete',
});
```
