import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { en, localeActions, useLocale } from '../src/locale';
import vi from '../src/locales/vi';

function translate(key: string) {
  function Probe() {
    return createElement('span', null, useLocale().t(key));
  }
  return renderToStaticMarkup(createElement(Probe));
}

test('individual locales share state with the compatibility bundle and fall back to English', async () => {
  localeActions.setMessage('vi', vi);
  localeActions.setLang('vi');
  assert.equal(translate('editor.bold.tooltip'), `<span>${vi['editor.bold.tooltip']}</span>`);

  localeActions.setMessage('partial', { 'editor.bold.tooltip': 'Custom bold' });
  localeActions.setLang('partial');
  assert.equal(translate('editor.bold.tooltip'), '<span>Custom bold</span>');
  assert.equal(
    translate('editor.image.dialog.title'),
    `<span>${en['editor.image.dialog.title']}</span>`
  );

  const bundled = await import('../src/locale-bundle');
  assert.equal(bundled.localeActions, localeActions);
  for (const language of ['fi', 'hu_HU', 'ja', 'pt_BR', 'vi', 'zh_CN'] as const) {
    localeActions.setLang(language);
    assert.equal(
      translate('editor.bold.tooltip'),
      `<span>${bundled[language]['editor.bold.tooltip']}</span>`
    );
  }
  localeActions.setLang('en');
});
