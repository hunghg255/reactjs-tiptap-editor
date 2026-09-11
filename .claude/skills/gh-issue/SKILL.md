---
name: gh-issue
description: "Work GitHub issues of this repo (hunghg255/reactjs-tiptap-editor) with the gh CLI: list open issues, show one issue with its comments parsed by the repo's issue-form template (affected extension, reproduction, editor content, expected/actual, version), and fix a chosen issue on a dedicated branch with lint/type-check verification and a `Closes #N` commit. Use when the user says 'list issues', 'show issue 123', 'fix issue 123', 'fix #123', 'issue nào đang mở', 'sửa issue', 'gh issue', or asks what bugs are reported on GitHub."
argument-hint: "[list [--all] [--label X] [--limit N] | show <N> | fix <N>]"
---

IRON LAW: NEVER FIX FROM THE TITLE. Read the full issue body AND every comment, locate the code, then present a plan and get a "go" before editing. Never `git push` or open a PR without explicit approval.

## gh CLI resolution

`gh` may not be on PATH in this shell. Resolve it once per session:

```bash
GH="$(command -v gh || echo "/c/Program Files/GitHub CLI/gh.exe")"
"$GH" auth status || echo "NOT LOGGED IN"
```

If not logged in, stop and tell the user to run:
`! & "C:\Program Files\GitHub CLI\gh.exe" auth login -h github.com -p https -w`

Repo is inferred from `origin`; no `-R` flag needed when cwd is the repo.

## Sub-commands

No argument → `list`.

### list

```bash
"$GH" issue list --state open --limit 30 --json number,title,labels,createdAt,comments,author \
  --template '{{range .}}#{{.number}}	{{.title}}	[{{range .labels}}{{.name}} {{end}}]	{{.author.login}}	{{timeago .createdAt}}	💬{{len .comments}}{{"\n"}}{{end}}'
```

- `--all` → `--state all`; `--label X` → `--label X`; `--limit N` overrides 30.
- Print as a markdown table: `#`, Title, Labels, Author, Age, Comments. Newest first (default).
- End with: "Bảo tôi `fix <N>` để sửa issue nào." (reply in the user's language).

### show <N>

```bash
"$GH" issue view N --comments
```

Parse the body with the template map below, then summarize: what is reported, affected extension(s), repro (link + steps + content), expected vs actual, version, clarifications in comments, linked PRs. Flag if the issue is closed, has a linked open PR, or is missing required template fields (pre-template issue or edited away).

## Issue template fields

Issues are created through `.github/ISSUE_TEMPLATE/*.yml` (blank issues disabled). GitHub renders each form field as a `### <Label>` heading followed by its value (`_No response_` when empty). Locate fields by heading, never by position.

**Bug report** (`[Bug]: …`, label `bug`):

| Heading | Field | How to use it |
|---|---|---|
| `### Bug description` | what breaks | Problem statement for the plan |
| `### Affected extension(s)` | comma-separated dropdown values | Start in `src/extensions/<Name>/`. `Core (...)` → `src/components/`, `src/store/`; `Bubble menus` → `src/components/Bubble/`, `src/bubble.ts`; `Locale / i18n` → `src/locale*.ts`, `src/locales/`; `Theme / styles` → `src/styles/`, `src/theme/`; `Bundle size / lazy loading` → `src/components/LazyContent.tsx`, `tests/bundle-*`; `Types / TypeScript` → `src/types.ts`, `tests/public-types.test.ts`; `Not sure` → derive from steps/content |
| `### Reproduction link` | StackBlitz/CodeSandbox/repo URL | Open it in the browser when the code path isn't obvious |
| `### Steps to reproduce` | numbered steps | Replay them in the playground (`pnpm playground`, `window.editor` is exposed) |
| `### Editor content that triggers the bug` | fenced `html` block | Use verbatim as the fixture: `editor.commands.setContent(...)`, compare `getHTML()`/`getJSON()` before and after the fix |
| `### Expected behavior` / `### Actual behavior` | | The pass/fail criterion for verification — quote both in the final report |
| `### reactjs-tiptap-editor version` | semver | If older than `package.json`, run `git log v<version>..HEAD -- src/extensions/<Name>` — it may already be fixed; say so and stop |
| `### Environment` | fenced `shell` block | React/Tiptap/browser versions — check for upstream `@tiptap/*` mismatch |
| `### Validations` | checkboxes | `[x] I would like to submit a PR` → tell the user before fixing; the reporter may be working on it |

**Feature request** (`[Feature]: …`, label `enhancement`): `### Problem`, `### Proposed solution`, `### Related extension(s)` (`New extension` → scaffold under `src/extensions/<Name>/` following an existing one, e.g. `Callout/`), `### Alternatives considered`, `### Additional context`, `### Validations`. `fix` on a feature request means implement it — plan must include the public API (exports in `src/index.ts`, `package.json` `exports`, docs page under `docs/extensions/<Name>/`).

**Legacy issue** (no `###` headings): fall back to free-form reading; extract the same facts and note which are missing.

### fix <N>

Copy this checklist and check off items as you go:

```
Fix #N Progress:
- [ ] 1. Read issue + all comments (`issue view N --comments`) ⚠️ REQUIRED
- [ ] 2. Preflight: `git status` clean, on `main`, `git pull --ff-only`
- [ ] 3. Locate the code (start from `Affected extension(s)`, else grep src/ for names in steps/content)
- [ ] 4. Reproduce or confirm root cause by reading the code path
- [ ] 5. Present plan → wait for "go" ⛔ BLOCKING
- [ ] 6. Branch: `git checkout -b fix/issue-N-<short-slug>`
- [ ] 7. Implement the minimal fix
- [ ] 8. Verify: `pnpm lint` && `pnpm type-check` (+ relevant tests below)
- [ ] 9. Commit with `Closes #N`
- [ ] 10. Ask before push / PR ⛔ BLOCKING
```

**Step 3–4 questions to answer before planning:**
- Which extension/component owns this behavior? (`Affected extension(s)` first; verify — reporters guess.)
- Is it a bug in this repo, or in an upstream `@tiptap/*` package (`Environment` block vs. `node_modules/@tiptap/*`)?
- Does it still reproduce on `main` with the issue's `Editor content` / steps? (`git log v<version>..HEAD` — if already fixed, say so and stop.)
- Is the *output* invalid HTML (e.g. block element inside `<p>`)? Then the browser parser, not ProseMirror, is what mangles it on reload — check `renderHTML` first.

**Step 5 plan format** (short — 5–10 lines):
- Root cause (file:line)
- Change to make
- Files touched
- How it will be verified
Then stop and wait.

**Step 8 verification** — always `pnpm lint` and `pnpm type-check`. Additionally:
- Public API/types changed → `pnpm test:types`
- Word/locale/KaTeX/bundle-loading touched → run the matching `tests/*.test.ts` via `pnpm exec esno --test <file>` (see `tests/README.md`)
- Visual/interaction bug → `pnpm playground` and check in browser when asked
Report results verbatim; if anything fails, fix or say so — don't commit red.

**Step 9 commit** — conventional commit, scope = extension/component name, body references the issue:

```
fix(<scope>): <what changed>

<why, 1–3 lines>

Closes #N
```

Use `/ai-git-commit` if the user prefers the bot identity; otherwise `/git-commit`.

**Step 10** — ask: push branch? open PR with `"$GH" pr create --fill --body "Closes #N"`? Do neither without a yes.

## Anti-patterns

- Fixing from the title/first paragraph without reading comments (maintainer often narrows the bug there)
- Trusting `Affected extension(s)` without verifying — it is the reporter's guess
- Skipping the `Editor content` fixture and inventing your own repro
- Editing on `main` instead of a `fix/issue-N-*` branch
- Broad refactors while fixing — keep the diff scoped to the issue
- Committing when lint/type-check is red
- Running `gh issue close`/`comment` on the user's behalf without being asked
- Guessing the repo with `-R` — rely on `origin`

## Pre-delivery checklist (fix)

- [ ] Diff touches only files named in the approved plan (or explained deviations)
- [ ] `pnpm lint` and `pnpm type-check` output shown, both green
- [ ] Commit message contains `Closes #N`
- [ ] Branch name is `fix/issue-N-<slug>`, `main` untouched
- [ ] User told what was NOT done (e.g., not pushed, PR not opened)
