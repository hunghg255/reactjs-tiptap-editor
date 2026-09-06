import assert from 'node:assert/strict';
import { test } from 'node:test';

import { Schema, type Node } from '@tiptap/pm/model';
import { EditorState, TextSelection, type Transaction } from '@tiptap/pm/state';

import { RangiPlugin } from '../src/extensions/CodeBlock/extension-code-block-rangi/src/rangi-plugin';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    blockquote: { group: 'block', content: 'block+' },
    codeBlock: {
      group: 'block',
      content: 'text*',
      attrs: { language: { default: 'js' } },
    },
    text: { group: 'inline' },
  },
});
const paragraph = (text = 'typing here') => schema.node('paragraph', null, schema.text(text));
const codeBlock = (text = 'const value = 42;', language = 'js') =>
  schema.node('codeBlock', { language }, text ? schema.text(text) : null);
const options = { name: 'codeBlock', detect: false, tokenClassPrefix: 'token-' };

function setup(nodes: Node[]) {
  const plugin = RangiPlugin(options);
  let state = EditorState.create({
    schema,
    doc: schema.node('doc', null, nodes),
    plugins: [plugin],
  });
  return {
    get state() {
      return state;
    },
    get decorations() {
      return plugin.getState(state)!;
    },
    apply(makeTransaction: (state: EditorState) => Transaction) {
      state = state.apply(makeTransaction(state));
      // A fresh full highlight is the correctness oracle for incremental updates.
      const freshPlugin = RangiPlugin(options);
      const freshState = EditorState.create({ schema, doc: state.doc, plugins: [freshPlugin] });
      const normalize = (decorations: ReturnType<typeof plugin.getState>) =>
        decorations!
          .find()
          .map((d) => ({ from: d.from, to: d.to, type: d.type }))
          .sort((a, b) => a.from - b.from || a.to - b.to);
      assert.deepEqual(
        normalize(plugin.getState(state)),
        normalize(freshPlugin.getState(freshState))
      );
    },
  };
}

test('selection-only transactions reuse decorations', () => {
  const editor = setup([paragraph(), codeBlock()]);
  const original = editor.decorations;
  editor.apply((s) => s.tr.setSelection(TextSelection.create(s.doc, 3)));
  assert.equal(editor.decorations, original);
});

test('typing before and after code preserves token types and maps positions', () => {
  const editor = setup([paragraph(), codeBlock(), paragraph()]);
  const originalTypes = editor.decorations.find().map((d) => d.type);
  editor.apply((s) => s.tr.insertText('more ', 2));
  editor.decorations.find().forEach((d, i) => assert.equal(d.type, originalTypes[i]));
  editor.apply((s) => s.tr.insertText('after', s.doc.content.size - 1));
});

test('code edits, language changes, conversion and deletion', () => {
  const editor = setup([codeBlock(), codeBlock('let b = true;')]);
  editor.apply((s) => s.tr.insertText('/* comment */ ', 1));
  editor.apply((s) => s.tr.setNodeMarkup(0, undefined, { language: 'python' }));
  editor.apply((s) => s.tr.setNodeMarkup(0, schema.nodes.paragraph));
  editor.apply((s) => s.tr.setNodeMarkup(0, schema.nodes.codeBlock, { language: 'js' }));
  editor.apply((s) => s.tr.delete(0, s.doc.firstChild!.nodeSize));
});

test('insertion at boundaries, duplicate node references, and replacement', () => {
  const shared = codeBlock();
  const editor = setup([shared, shared]);
  editor.apply((s) => s.tr.insert(0, shared));
  editor.apply((s) => s.tr.insert(s.doc.firstChild!.nodeSize, codeBlock('let x = 0;')));
  editor.apply((s) => s.tr.replaceWith(0, s.doc.firstChild!.nodeSize, shared));
  editor.apply((s) => s.tr.delete(0, s.doc.firstChild!.nodeSize));
});

test('split, join, multi-step edits, and inverse steps', () => {
  const editor = setup([codeBlock(), paragraph()]);
  editor.apply((s) => s.tr.split(8));
  editor.apply((s) => s.tr.join(s.doc.firstChild!.nodeSize));
  const before = editor.state.doc;
  const tr = editor.state.tr.insertText('hello ', 1).insertText(' world', 8);
  editor.apply(() => tr);
  editor.apply((s) => {
    const undo = s.tr;
    for (let i = tr.steps.length - 1; i >= 0; i--) undo.step(tr.steps[i].invert(tr.docs[i]));
    return undo;
  });
  assert.ok(editor.state.doc.eq(before));
});

test('nested and empty blocks', () => {
  const editor = setup([
    schema.node('blockquote', null, [paragraph(), codeBlock('')]),
    codeBlock(),
  ]);
  editor.apply((s) => s.tr.insertText('offset', 2));
  editor.apply((s) => {
    let pos = 0;
    s.doc.descendants((node, start) => {
      if (node.type.name === 'codeBlock' && !node.content.size) pos = start;
    });
    return s.tr.insertText('const x = 1;', pos + 1);
  });
});

test('replacing code content with the original fragment keeps all highlights', () => {
  const editor = setup([codeBlock()]);
  editor.apply((s) =>
    s.tr.replaceWith(1, s.doc.firstChild!.nodeSize - 1, s.doc.firstChild!.content)
  );
});
