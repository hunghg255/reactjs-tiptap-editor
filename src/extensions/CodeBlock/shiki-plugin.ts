import type { BundledLanguage, BundledTheme } from 'shiki'
import { findChildren } from '@tiptap/core'
import type { PluginView } from '@tiptap/pm/state'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { Node as ProsemirrorNode } from '@tiptap/pm/model'
import {
  getShiki,
  initHighlighter,
  loadLanguage,
  loadTheme,
} from './highlighter'

/** Create code decorations for the current document */
function getDecorations({
  doc,
  name,
  defaultTheme,
  defaultLanguage,
}: {
  doc: ProsemirrorNode
  name: string
  defaultLanguage: BundledLanguage | null | undefined
  defaultTheme: BundledTheme
}) {
  const decorations: Decoration[] = []

  const codeBlocks = findChildren(doc, node => node.type.name === name)

  codeBlocks.forEach((block) => {
    let from = block.pos + 1
    let language = block.node.attrs.language || defaultLanguage
    const theme = block.node.attrs.theme || defaultTheme

    const highlighter = getShiki()

    if (!highlighter)
      return

    if (!highlighter.getLoadedLanguages().includes(language)) {
      language = 'plaintext'
    }

    const themeToApply = highlighter.getLoadedThemes().includes(theme)
      ? theme
      : highlighter.getLoadedThemes()[0]

    const tokens = highlighter.codeToTokensBase(block.node.textContent, {
      lang: language,
      theme: themeToApply,
    })

    for (const line of tokens) {
      for (const token of line) {
        const to = from + token.content.length

        const decoration = Decoration.inline(from, to, {
          style: `color: ${token.color}`,
        })

        decorations.push(decoration)

        from = to
      }

      from += 1
    }
  })

  return DecorationSet.create(doc, decorations)
}

export function ShikiPlugin({
  name,
  defaultLanguage,
  defaultTheme,
}: {
  name: string
  defaultLanguage: BundledLanguage | null | undefined
  defaultTheme: BundledTheme
}) {
  const shikiPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('shiki'),

    view(view) {
      // This small view is just for initial async handling
      class ShikiPluginView implements PluginView {
        constructor() {
          this.initDecorations()
        }

        update() {
          this.checkUndecoratedBlocks()
        }

        destroy() {}

        // Initialize shiki async, and then highlight initial document
        async initDecorations() {
          const doc = view.state.doc
          await initHighlighter({ doc, name, defaultLanguage, defaultTheme })
          const tr = view.state.tr.setMeta('shikiPluginForceDecoration', true)
          view.dispatch(tr)
        }

        // When new codeblocks were added and they have missing themes or
        // languages, load those and then add code decorations once again.
        async checkUndecoratedBlocks() {
          const codeBlocks = findChildren(
            view.state.doc,
            node => node.type.name === name,
          )

          // Load missing themes or languages when necessary.
          // loadStates is an array with booleans depending on if a theme/lang
          // got loaded.
          const loadStates = await Promise.all(
            codeBlocks.flatMap(block => [
              loadTheme(block.node.attrs.theme),
              loadLanguage(block.node.attrs.language),
            ]),
          )
          const didLoadSomething = loadStates.includes(true)

          // The asynchronous nature of this is potentially prone to
          // race conditions. Imma just hope it's fine lol

          if (didLoadSomething) {
            const tr = view.state.tr.setMeta('shikiPluginForceDecoration', true)
            view.dispatch(tr)
          }
        }
      }

      return new ShikiPluginView()
    },

    state: {
      init: (_, { doc }) => {
        return getDecorations({
          doc,
          name,
          defaultLanguage,
          defaultTheme,
        })
      },
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name
        const newNodeName = newState.selection.$head.parent.type.name
        const oldNodes = findChildren(
          oldState.doc,
          node => node.type.name === name,
        )
        const newNodes = findChildren(
          newState.doc,
          node => node.type.name === name,
        )

        const didChangeSomeCodeBlock
          = transaction.docChanged
          // Apply decorations if:
          // selection includes named node,
            && ([oldNodeName, newNodeName].includes(name)
            // OR transaction adds/removes named node,
              || newNodes.length !== oldNodes.length
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
              || transaction.steps.some((step: any) => {
                return (
                  step.from !== undefined
                  && step.to !== undefined
                  && oldNodes.some((node) => {
                    return (
                      node.pos >= step.from
                      && node.pos + node.node.nodeSize <= step.to
                    )
                  })
                )
              }))

        // only create code decoration when it's necessary to do so
        if (
          transaction.getMeta('shikiPluginForceDecoration')
          || didChangeSomeCodeBlock
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
            defaultTheme,
          })
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      },
    },

    props: {
      decorations(state) {
        return shikiPlugin.getState(state)
      },
    },
  })

  return shikiPlugin
}
