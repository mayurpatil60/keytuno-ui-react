# @keytuno/ui-react

Standalone React UI package for Keytuno applications. This repository contains:

1. React web components
2. Theme system modules (tokens, contracts, adapters, theme definitions)

## Status

This repository has completed Phase 1 (standalone skeleton), Phase 2 (source migration), Phase 3 (Storybook integration), Phase 4 (public API and packaging hardening), and Phase 5 (release and tag setup). Next step is Phase 6 (consumer app integration).

## Package

1. Name: @keytuno/ui-react
2. Main: dist/index.js
3. Types: dist/index.d.ts

## Requirements

1. Node.js 18+
2. pnpm 9+

## Install (private GitHub tag)

```bash
pnpm add git+ssh://git@github.com/<owner>/keytuno-ui-react.git#v0.1.0
```

Peer dependencies:

1. react ^18
2. react-dom ^18

## Local Development

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Run Storybook

Storybook runs in the same repository:

```bash
pnpm storybook
```

Build static Storybook output:

```bash
pnpm build-storybook
```

Typical local workflow after Storybook setup:

```bash
pnpm install
pnpm storybook
```

## Release Notes Process (lightweight)

1. Keep a short summary in commit messages for each phase.
2. Tag stable milestones (for example: v0.1.0, v0.1.1).
3. Update this README when install instructions or package scope changes.

Release baseline (Phase 5):

1. Initial standalone release tag prepared: v0.1.0.
2. Standard release validation gate:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
```