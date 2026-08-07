import { findChildren } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { detectLanguage, tokenize } from 'rangi'
import type { ShjLanguages } from 'rangi'

export interface RangiPluginOptions {
  name: string
  languages?: ShjLanguages
  defaultLanguage?: string | null
  detect: boolean
  tokenClassPrefix: string
}

function resolveLanguage(code: string, language: unknown, options: RangiPluginOptions) {
  if (typeof language === 'string' && language.length > 0) {
    return language
  }

  if (options.defaultLanguage) {
    return options.defaultLanguage
  }

  return options.detect ? detectLanguage(code) : 'plain'
}

function getDecorations(doc: ProseMirrorNode, options: RangiPluginOptions) {
  const decorations: Decoration[] = []

  findChildren(doc, node => node.type.name === options.name).forEach(block => {
    const code = block.node.textContent
    const language = resolveLanguage(code, block.node.attrs.language, options)
    const tokens = tokenize(code, {
      lang: language,
      ...(options.languages ? { languages: options.languages } : {}),
    })
    let from = block.pos + 1

    tokens.forEach(token => {
      const to = from + token.text.length

      if (token.type && to > from) {
        decorations.push(
          Decoration.inline(from, to, {
            class: `${options.tokenClassPrefix}${token.type}`,
          }),
        )
      }

      from = to
    })
  })

  return DecorationSet.create(doc, decorations)
}

export function RangiPlugin(options: RangiPluginOptions) {
  const plugin: Plugin<DecorationSet> = new Plugin({
    key: new PluginKey(`rangi-${options.name}`),

    state: {
      init: (_, { doc }) => getDecorations(doc, options),
      apply: (transaction, decorationSet) => {
        if (transaction.docChanged) {
          return getDecorations(transaction.doc, options)
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      },
    },

    props: {
      decorations(state) {
        return plugin.getState(state)
      },
    },
  })

  return plugin
}
