# @keytuno/ui-react

Standalone React UI package for Keytuno applications. This repository contains:

1. React web components
2. Theme system modules (tokens, contracts, adapters, theme definitions)

## Status

This repository has completed Phase 1 (standalone skeleton), Phase 2 (source migration), Phase 3 (Storybook integration), Phase 4 (public API and packaging hardening), Phase 5 (release and tag setup), Phase 6 (consumer app integration), and Phase 7 (hardening and team-ready handover).

## Package

1. Name: @keytuno/ui-react
2. Main: dist/index.js
3. Types: dist/index.d.ts

## Requirements

1. Node.js 18+
2. pnpm 9+

## Install (private GitHub tag)

```bash
pnpm add git+https://github.com/mayurpatil60/keytuno-ui-react.git#v0.1.0

# or use SSH if your local git auth is SSH-based
pnpm add git+ssh://git@github.com/mayurpatil60/keytuno-ui-react.git#v0.1.0
```

Peer dependencies:

1. react ^18
2. react-dom ^18

Optional peer dependencies (only needed for Table xlsx/pdf export addon):

1. xlsx ^0.18.5
2. jspdf ^4.2.1
3. jspdf-autotable ^5.0.8

Use the optional addon entry only when required:

```tsx
import { Table } from '@keytuno/ui-react';
import { tableExportHandlers } from '@keytuno/ui-react/addons/table-exporters';

<Table
	showExport
	exportable
	exportFormats={['csv', 'xlsx', 'pdf']}
	exportHandlers={tableExportHandlers}
/>
```

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
pnpm size
pnpm audit --prod --audit-level high
```

## Quality Snapshot (2026-07-01)

Pre-release verification status for v0.1.0:

1. `pnpm lint`: pass with warnings only (0 errors, 24 warnings).
2. `pnpm typecheck`: pass.
3. `pnpm test`: pass (current suite: spinner-focused baseline tests).
4. `pnpm build`: pass.
5. `pnpm build-storybook`: pass.
6. `pnpm size`: pass all configured size budgets.
7. `pnpm audit --prod --audit-level high`: no known vulnerabilities.

Recommended next hardening before larger rollout:

1. Reduce lint warnings (mainly hook dependency and unused symbol warnings).
2. Increase test coverage for stateful and composite components (Select, DatePicker, Dialog, DropdownMenu, Table, FileUpload).
3. Add Playwright smoke scenarios for reusable components rendered multiple times on one page.

## Testing Guidance for Reusable Components

When the same component appears multiple times in one screen:

1. Prefer semantic selectors first (`getByRole`, `getByLabelText`, accessible names).
2. Scope actions to a container with stable `data-testid` on wrapper sections.
3. Avoid positional selectors (`nth-child`) for brittle repeated UIs.

Example strategy:

1. Wrap each domain section with `data-testid` (for example: `billing-table-panel`).
2. Query controls inside that scope by role and accessible name.
3. Keep action labels specific so tests and assistive tech can disambiguate repeated controls.

## Create and Push a New Tag

Use these steps whenever you cut a new release tag (for example, `v0.1.1`).

1. Move to the release branch and sync latest changes:

```bash
git checkout main
git pull origin main
```

2. Run the full validation gate:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
pnpm size
pnpm audit --prod --audit-level high
```

3. Bump version in `package.json` without creating a tag automatically:

```bash
# choose one
pnpm version patch --no-git-tag-version
pnpm version minor --no-git-tag-version
pnpm version major --no-git-tag-version
```

4. Commit release changes:

```bash
git add package.json pnpm-lock.yaml README.md docs/
git commit -m "release(ui-react): prepare v0.1.1"
```

5. Create annotated tag:

```bash
git tag -a v0.1.1 -m "release: @keytuno/ui-react v0.1.1"
```

6. Push commit and tag:

```bash
git push origin main
git push origin v0.1.1
```

7. Verify tag exists on remote:

```bash
git ls-remote --tags origin refs/tags/v0.1.1
```

## Use a New Tag in Another Project

Example target tag: `v0.1.1`

1. Install from GitHub tag in consumer project:

```bash
# HTTPS (recommended for CI and token-based auth)
pnpm add git+https://github.com/mayurpatil60/keytuno-ui-react.git#v0.1.1

# or SSH (developer machine with SSH key auth)
pnpm add git+ssh://git@github.com/mayurpatil60/keytuno-ui-react.git#v0.1.1
```

2. npm-based consumer apps can use:

```bash
npm install "git+https://github.com/mayurpatil60/keytuno-ui-react.git#v0.1.1"
```

3. If the dependency already exists, update tag in `package.json` and reinstall:

```bash
pnpm install
# or
npm install
```

4. Build the consumer app to confirm integration:

```bash
pnpm build
# or
npm run build
```

5. For private GitHub access in CI, configure token-based git URL rewrite before install:

```bash
git config --global url."https://x-access-token:${KEYTUNO_UI_READ_TOKEN}@github.com/".insteadOf "ssh://git@github.com/"
git config --global url."https://x-access-token:${KEYTUNO_UI_READ_TOKEN}@github.com/".insteadOf "git@github.com:"
```

6. React 19 consumer note (current known gap): if npm reports peer resolution failure, install with:

```bash
npm install --legacy-peer-deps
```

## Team-Ready Handover Docs

1. Contribution and ownership: [CONTRIBUTING.md](CONTRIBUTING.md)
2. Code owners: [.github/CODEOWNERS](.github/CODEOWNERS)
3. Versioning and rollback playbook: [docs/OPERATIONS.md](docs/OPERATIONS.md)
4. Framework and consumer compatibility notes: [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md)

## Compatibility Snapshot

1. Current peer dependency baseline: react/react-dom ^18.
2. Current known consumer gap: React 19 consumers may require `--legacy-peer-deps` until peer ranges are widened.