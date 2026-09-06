# Performance regression checks

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
