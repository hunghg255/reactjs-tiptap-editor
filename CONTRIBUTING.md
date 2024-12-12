# Contributing Guide

Thanks for lending a hand 👋

## Development

### Setup

- We use [pnpm](https://pnpm.js.org/) to manage dependencies. Install it with `npm i -g pnpm`.

Install dependencies

```bash
pnpm install
```

Start the Demo server

```bash
npm run build:lib:dev
npm run playground
```

### Packages Structure

- `src/components`: Contains all the components.
- `src/hooks`: Contains all the hooks.
- `src/utils`: Contains all the utility functions.
- `src/styles`: Contains all the global styles.
- `src/index.ts`: Exports all the components, hooks, and utility functions.
- `src/extensions`: Contains all the extensions.

### Coding conventions

- We use ESLint to lint and format the codebase. Before you commit, all files will be formatted automatically.
- We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please use a prefix. If your PR has multiple commits and some of them don't follow the Conventional Commits rule, we'll do a squash merge.
