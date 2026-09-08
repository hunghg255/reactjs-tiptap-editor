# Performance regression checks

## Bundle size and deferred feature loading

```sh
pnpm measure:bundle current
pnpm exec esno --test tests/word-export.test.ts tests/locale-loading.test.ts
pnpm exec vite --config tests/vite.config.ts
```

The measurement command rebuilds the library, bundles the full playground and
minimal consumer fixtures, then writes `reports/bundle-size/current.json`.
It does not overwrite `playground/dist`. Use a new label to keep previous results.
See `reports/bundle-size/REPORT.md` for the before/after measurements and limitations.

Round 2 adds text-bubble isolation, public bubble subpaths and deferred KaTeX/Emoji:

```sh
node --test tests/bundle-isolation.test.mjs
pnpm exec esno --test tests/katex-loader.test.ts
```

Run `pnpm build:lib` first for the package export/isolation checks. Open
`http://127.0.0.1:5199/tests/bundle-features.html` for the 11 automatic KaTeX/Emoji
checks. See `reports/bundle-size/REPORT-ROUND2.md` for the latest measurements.

Open `http://127.0.0.1:5199/tests/bundle-loading.html` for automatic browser checks:
first-open and reopen of lazy upload dialogs, isolation between two editors,
Word `can()` without downloading, DOCX export/import round-trip, and Drawer
create/reopen/edit. Downloads are intercepted inside this test page.

Run from the repository root using the existing development dependencies:

```sh
pnpm exec esno --test tests/rangi-performance.test.ts
pnpm exec esno tests/rangi-benchmark.ts
pnpm exec vite --config tests/vite.config.ts
```

Open `http://127.0.0.1:5199/tests/toolbar-performance.html` for the React browser
checks. The page runs automatically and prints PASS/FAIL, including render counts
for consumers whose selected state does not change while typing, formatting and
selection updates, undo, attribute defaults, manual refresh, and editable state.

The highlighting tests compare incremental decorations with a fresh full highlight
after document transformations. The benchmark measures paragraph edits outside
code blocks (30 JavaScript lines per block), with five warmup transactions and 25
samples. It measures Node transaction cost, excluding browser rendering, and does
not impose a hardware-dependent timing threshold.

# AI extension checks

```sh
pnpm exec esno --test tests/ai-client.test.ts
pnpm exec vite --config tests/vite.config.ts
```

Open `http://127.0.0.1:5199/tests/ai-editor.html` for browser checks covering
selection replacement, safe text insertion, Apply/Undo, Discard, read-only state,
and invalidation after document edits. It also provides a mock slash-command demo
without sending requests to a provider.
