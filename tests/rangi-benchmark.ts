import { Schema } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';

import { RangiPlugin } from '../src/extensions/CodeBlock/extension-code-block-rangi/src/rangi-plugin';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    codeBlock: {
      group: 'block',
      content: 'text*',
      attrs: { language: { default: 'javascript' } },
    },
    text: { group: 'inline' },
  },
});
const code = 'const value = items.map(item => item.id);\n'.repeat(30);

for (const count of [0, 10, 50, 100]) {
  const doc = schema.node('doc', null, [
    schema.node('paragraph', null, schema.text('typing here')),
    ...Array.from({ length: count }, () => schema.node('codeBlock', null, schema.text(code))),
  ]);
  let state = EditorState.create({
    schema,
    doc,
    plugins: [RangiPlugin({ name: 'codeBlock', detect: false, tokenClassPrefix: 'token-' })],
  });
  for (let i = 0; i < 5; i++) state = state.apply(state.tr.insertText('a', 2));
  const times = [];
  for (let i = 0; i < 25; i++) {
    const start = performance.now();
    state = state.apply(state.tr.insertText('a', 2));
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  console.log(
    JSON.stringify({
      codeBlocks: count,
      codeLines: count * 30,
      medianMs: +times[12].toFixed(2),
      p95Ms: +times[23].toFixed(2),
    })
  );
}
