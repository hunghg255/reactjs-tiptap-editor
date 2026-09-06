import { findChildren } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { detectLanguage, tokenize } from 'rangi';

import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { ShjLanguages } from 'rangi';

export interface RangiPluginOptions {
  name: string;
  languages?: ShjLanguages;
  defaultLanguage?: string | null;
  detect: boolean;
  tokenClassPrefix: string;
}

function resolveLanguage(code: string, language: unknown, options: RangiPluginOptions) {
  if (typeof language === 'string' && language.length > 0) {
    return language;
  }

  if (options.defaultLanguage) {
    return options.defaultLanguage;
  }

  return options.detect ? detectLanguage(code) : 'plain';
}

function getBlockDecorations(node: ProseMirrorNode, pos: number, options: RangiPluginOptions) {
  const decorations: Decoration[] = [];

  const code = node.textContent;
  const language = resolveLanguage(code, node.attrs.language, options);
  const tokens = tokenize(code, {
    lang: language,
    ...(options.languages ? { languages: options.languages } : {}),
  });
  let from = pos + 1;

  tokens.forEach((token) => {
    const to = from + token.text.length;

    if (token.type && to > from) {
      decorations.push(
        Decoration.inline(from, to, {
          class: `${options.tokenClassPrefix}${token.type}`,
        })
      );
    }

    from = to;
  });
  return decorations;
}

function getDecorations(doc: ProseMirrorNode, options: RangiPluginOptions) {
  const decorations = findChildren(doc, (node) => node.type.name === options.name).flatMap(
    (block) => getBlockDecorations(block.node, block.pos, options)
  );
  return DecorationSet.create(doc, decorations);
}

export function RangiPlugin(options: RangiPluginOptions) {
  const plugin: Plugin<DecorationSet> = new Plugin({
    key: new PluginKey(`rangi-${options.name}`),

    state: {
      init: (_, { doc }) => getDecorations(doc, options),
      apply: (transaction, decorationSet, oldState) => {
        if (!transaction.docChanged) return decorationSet;

        const blocks = findChildren(transaction.doc, (node) => node.type.name === options.name);
        const blocksByPosition = new Map(blocks.map((block) => [block.pos, block.node]));
        const unchanged = new Set<number>();
        const removed: Decoration[] = [];
        const changedRanges: { from: number; to: number }[] = [];
        transaction.mapping.maps.forEach((map, index) => {
          const toOriginal = transaction.mapping.slice(0, index).invert();
          map.forEach((from, to) => {
            changedRanges.push({
              from: toOriginal.map(from, -1),
              to: toOriginal.map(to, 1),
            });
          });
        });

        findChildren(oldState.doc, (node) => node.type.name === options.name).forEach((block) => {
          const from = transaction.mapping.mapResult(block.pos, 1);
          const to = transaction.mapping.mapResult(block.pos + block.node.nodeSize, -1);
          const touched = changedRanges.some(
            (range) => range.from < block.pos + block.node.nodeSize && range.to > block.pos
          );

          // ProseMirror preserves node identity for unchanged subtrees. Check both
          // boundaries and changed ranges: a replacement can reuse the same node
          // or fragment while still invalidating its mapped decorations.
          if (
            !touched &&
            !from.deleted &&
            !to.deleted &&
            blocksByPosition.get(from.pos) === block.node &&
            to.pos === from.pos + block.node.nodeSize
          ) {
            unchanged.add(from.pos);
          } else {
            for (const decoration of decorationSet.find(
              block.pos + 1,
              block.pos + block.node.nodeSize - 1
            )) {
              removed.push(decoration);
            }
          }
        });

        const mapped = decorationSet.remove(removed).map(transaction.mapping, transaction.doc);
        const added = blocks
          .filter((block) => !unchanged.has(block.pos))
          .flatMap((block) => getBlockDecorations(block.node, block.pos, options));

        return mapped.add(transaction.doc, added);
      },
    },

    props: {
      decorations(state) {
        return plugin.getState(state);
      },
    },
  });

  return plugin;
}
