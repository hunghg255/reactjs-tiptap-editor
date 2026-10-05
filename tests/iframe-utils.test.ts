import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getServiceSrc } from '../src/extensions/Iframe/utils';

const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14092.75!2d86.915!3d27.988!5m2!1sen!2sus';

function srcOf(input: string) {
  const result = getServiceSrc(input);
  return typeof result === 'string' ? result : result.src;
}

test('pasted <iframe> embed code resolves to its src', () => {
  const snippet = `<iframe src="${MAPS_EMBED}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
  assert.equal(srcOf(snippet), MAPS_EMBED);
});

test('embed code with single quotes or unquoted src', () => {
  assert.equal(srcOf(`<iframe src='${MAPS_EMBED}'></iframe>`), MAPS_EMBED);
  assert.equal(
    srcOf('<iframe src=https://example.com/embed width=600></iframe>'),
    'https://example.com/embed'
  );
});

test('HTML-escaped embed code and &amp; in the url are decoded', () => {
  assert.equal(srcOf(`&lt;iframe src=&quot;${MAPS_EMBED}&quot;&gt;&lt;/iframe&gt;`), MAPS_EMBED);
  assert.equal(
    srcOf('<iframe src="https://example.com/embed?a=1&amp;b=2"></iframe>'),
    'https://example.com/embed?a=1&b=2'
  );
});

test('YouTube embed code goes through the YouTube conversion', () => {
  assert.equal(
    srcOf('<iframe src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></iframe>'),
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
  );
});

test('YouTube shorts and live links', () => {
  assert.equal(
    srcOf('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
  );
  assert.equal(
    srcOf('https://www.youtube.com/live/dQw4w9WgXcQ?si=abc'),
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
  );
});

test('existing YouTube formats keep working', () => {
  for (const url of [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ]) {
    assert.equal(srcOf(url), 'https://www.youtube.com/embed/dQw4w9WgXcQ', url);
  }
});

test('Vimeo links become player urls', () => {
  assert.equal(srcOf('https://vimeo.com/123456789'), 'https://player.vimeo.com/video/123456789');
  assert.equal(
    srcOf('https://player.vimeo.com/video/123456789'),
    'https://player.vimeo.com/video/123456789'
  );
});

test('plain urls are trimmed and otherwise unchanged', () => {
  assert.equal(srcOf(`  ${MAPS_EMBED}  `), MAPS_EMBED);
  assert.equal(srcOf('https://example.com/page'), 'https://example.com/page');
});
