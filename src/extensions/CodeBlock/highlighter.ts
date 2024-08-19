import type {
  BundledLanguage,
  BundledTheme,
  Highlighter,
} from 'shiki'
import {
  bundledLanguages,
  bundledThemes,
  createHighlighter,
} from 'shiki'
import { findChildren } from '@tiptap/core'
import type { Node as ProsemirrorNode } from '@tiptap/pm/model'

let highlighter: Highlighter | undefined
let highlighterPromise: Promise<void> | undefined
const loadingLanguages = new Set<BundledLanguage>()
const loadingThemes = new Set<BundledTheme>()

interface HighlighterOptions {
  themes: (BundledTheme | null | undefined)[]
  languages: (BundledLanguage | null | undefined)[]
}

export function resetHighlighter() {
  highlighter = undefined
  highlighterPromise = undefined
  loadingLanguages.clear()
  loadingThemes.clear()
}

export function getShiki() {
  return highlighter
}

/**
 * Load the highlighter. Makes sure the highlighter is only loaded once.
 */
export function loadHighlighter(opts: HighlighterOptions) {
  if (!highlighter && !highlighterPromise) {
    const themes = opts.themes.filter(
      (theme): theme is BundledTheme => !!theme && theme in bundledThemes,
    )
    const langs = opts.languages.filter(
      (lang): lang is BundledLanguage => !!lang && lang in bundledLanguages,
    )
    highlighterPromise = createHighlighter({ themes, langs }).then((h) => {
      highlighter = h
    })
    return highlighterPromise
  }

  if (highlighterPromise) {
    return highlighterPromise
  }
}

/**
 * Loads a theme if it's valid and not yet loaded.
 * @returns true or false depending on if it got loaded.
 */
export async function loadTheme(theme: BundledTheme) {
  if (
    highlighter
    && !highlighter.getLoadedThemes().includes(theme)
    && !loadingThemes.has(theme)
    && theme in bundledThemes
  ) {
    loadingThemes.add(theme)
    await highlighter.loadTheme(theme)
    loadingThemes.delete(theme)
    return true
  }

  return false
}

/**
 * Loads a language if it's valid and not yet loaded
 * @returns true or false depending on if it got loaded.
 */
export async function loadLanguage(language: BundledLanguage) {
  if (
    highlighter
    && !highlighter.getLoadedLanguages().includes(language)
    && !loadingLanguages.has(language)
    && language in bundledLanguages
  ) {
    loadingLanguages.add(language)
    await highlighter.loadLanguage(language)
    loadingLanguages.delete(language)
    return true
  }

  return false
}

/**
 * Initializes the highlighter based on the prosemirror document,
 * with the themes and languages in the document.
 */
export async function initHighlighter({
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
  const codeBlocks = findChildren(doc, node => node.type.name === name)

  const themes = [
    ...codeBlocks.map(block => block.node.attrs.theme as BundledTheme),
    defaultTheme,
  ]
  const languages = [
    ...codeBlocks.map(block => block.node.attrs.language as BundledLanguage),
    defaultLanguage,
  ]

  if (!highlighter) {
    const loader = loadHighlighter({ languages, themes })
    await loader
  }
  else {
    await Promise.all([
      ...themes.flatMap(theme => loadTheme(theme)),
      ...languages.flatMap(language => !!language && loadLanguage(language)),
    ])
  }
}
