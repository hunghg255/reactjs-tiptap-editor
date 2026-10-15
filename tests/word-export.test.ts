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

test('nodes without a Word serializer do not abort the export', async () => {
  const schema = new Schema({
    nodes: {
      doc: { content: 'block+' },
      paragraph: { group: 'block', content: 'inline*' },
      text: { group: 'inline' },
      tableOfContents: { group: 'block', atom: true },
      details: { group: 'block', content: 'detailsSummary detailsContent' },
      detailsSummary: { content: 'text*' },
      detailsContent: { content: 'block+' },
      mention: { group: 'inline', inline: true, atom: true, attrs: { label: { default: null } } },
    },
    marks: { strike: {} },
  });
  const doc = schema.node('doc', null, [
    schema.node('tableOfContents'),
    schema.node('details', null, [
      schema.node('detailsSummary', null, [schema.text('Summary')]),
      schema.node('detailsContent', null, [schema.node('paragraph', null, [schema.text('Body')])]),
    ]),
    schema.node('paragraph', null, [
      schema.text('Hello ', [schema.mark('strike')]),
      schema.node('mention', { label: '@hung' }),
    ]),
  ]);
  const blob = await createWordBlob(doc);
  const { value } = await mammoth.convertToHtml({ buffer: Buffer.from(await blob.arrayBuffer()) });
  assert.match(value, /<p>Summary<\/p>/);
  assert.match(value, /<p>Body<\/p>/);
  assert.match(value, /<s>Hello <\/s>@hung/);
});
