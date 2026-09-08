import assert from 'node:assert/strict';
import { test } from 'node:test';

import { Schema } from '@tiptap/pm/model';
import mammoth from 'mammoth';

import { createWordBlob } from '../src/extensions/ExportWord/createWordBlob';

test('deferred Word serializer produces a DOCX that can be imported again', async () => {
  const schema = new Schema({
    nodes: {
      doc: { content: 'block+' },
      paragraph: { group: 'block', content: 'inline*' },
      text: { group: 'inline' },
      hardBreak: { group: 'inline', inline: true },
    },
  });
  const doc = schema.node('doc', null, [
    schema.node('paragraph', null, [
      schema.text('Bundle audit – tiếng Việt'),
      schema.node('hardBreak'),
      schema.text('Second line'),
    ]),
    schema.node('paragraph', null, [schema.text('Second paragraph')]),
  ]);
  const blob = await createWordBlob(doc);
  assert.ok(blob.size > 0);
  const buffer = Buffer.from(await blob.arrayBuffer());
  assert.equal(buffer.subarray(0, 2).toString(), 'PK');
  const { value } = await mammoth.convertToHtml({ buffer });
  assert.match(value, /Bundle audit – tiếng Việt/);
  assert.match(value, /<br\s*\/>Second line/);
  assert.match(value, /<p>Second paragraph<\/p>/);
});
