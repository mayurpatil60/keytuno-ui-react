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
pnpm add github:mayurpatil60/keytuno-ui-react#v2.0.0
```

Peer dependencies:

1. react ^18
2. react-dom ^18

## Built-in Themes and Semantic Tones

1. Built-in themes: `light`, `dark` with refreshed neutral surfaces and action hues.
2. Semantic surface tokens exported by `themeToCssVariables`:
	- `--ktn-bg-default`, `--ktn-bg-surface`, `--ktn-bg-muted`
	- `--ktn-bg-hover`, `--ktn-bg-selected`
3. Semantic border tokens:
	- `--ktn-border-muted`, `--ktn-border-strong`
4. Semantic action token pairs:
	- `--ktn-action-primary-bg` / `--ktn-action-primary-fg`
	- `--ktn-action-success-bg` / `--ktn-action-success-fg` (green)
	- `--ktn-action-warning-bg` / `--ktn-action-warning-fg` (amber)
	- `--ktn-action-accent-bg` / `--ktn-action-accent-fg` (rose)
	- `--ktn-action-danger-bg` / `--ktn-action-danger-fg` (red)
5. Semantic soft variant surface tokens:
	- `--ktn-action-primary-soft-bg` (light default: `#dbeafe`)
	- `--ktn-action-success-soft-bg` (light default: `#dcfce7`)
	- `--ktn-action-warning-soft-bg` (light default: `#fef3c7`)
	- `--ktn-action-accent-soft-bg` (light default: `#fce7f3`)
	- `--ktn-action-danger-soft-bg` (light default: `#fee2e2`)
6. Dedicated button tone tokens:
	- `--ktn-button-default-bg` / `--ktn-button-default-fg` / `--ktn-button-default-border` (light defaults: `#edf2f7` / `#1f2937` / `#d2dce8`)
	- `--ktn-button-primary-bg` / `--ktn-button-primary-fg` (light default primary: `#2563eb`)
	- `--ktn-button-success-bg` / `--ktn-button-success-fg`
	- `--ktn-button-warning-bg` / `--ktn-button-warning-fg`
	- `--ktn-button-accent-bg` / `--ktn-button-accent-fg`
	- `--ktn-button-destructive-bg` / `--ktn-button-destructive-fg` (light default destructive: `#ef4444`)
7. Button hover behavior uses enterprise-style emphasis: hover darkens the button background and also adjusts border/text colors for clearer affordance.
8. Badge, BadgeSelect, Toast, and Alert variant surfaces are token-driven and use soft backgrounds in light theme.
9. Button-like variant coverage includes `success`, `warning`, `accent`, and `destructive` for: Badge, BadgeSelect, Button, ButtonGroup, Alert, Dialog, and InputGroup.
10. Toast variants include: `default`, `success`, `warning`, `accent`, and `danger`.

Table now focuses on data interaction (filter/sort/search/pagination and table-card switching) without built-in export dependencies.

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
2. Tag stable milestones (for example: v2.0.0, v2.0.1).
3. Update this README when install instructions or package scope changes.

Release baseline (Phase 5):

1. Latest release tag: v2.0.0 (see `docs/releases/v2.0.0.md`).
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

## Quality Snapshot (2026-10-31)

Release verification status for v2.0.0:

1. `pnpm lint`: pass with warnings only (0 errors, 24 warnings).
2. `pnpm typecheck`: pass.
3. `pnpm test`: pass (8 tests: Spinner, AdvanceFilter interaction, and file utility coverage).
4. `pnpm build`: pass.
5. `pnpm size`: pass all configured size budgets.

Recommended next hardening before larger rollout:

1. Reduce lint warnings (mainly hook dependency and unused symbol warnings).
2. Increase test coverage for stateful and composite components (Select, DatePicker, Dialog, DropdownMenu, Table, FileUpload).
3. Add Playwright smoke scenarios for reusable components rendered multiple times on one page.

## Changes in v2.0.0 (since v1.0.0)

Full notes: `docs/releases/v2.0.0.md`. The `v1.0.0` tag points to the 2026-07-01 release commit and does not include the items below.

1. Fixed AdvanceFilter rule removal behavior so newly added filter rows can be removed immediately, including when only one filter row exists.
2. Aligned per-row remove control labels for accessibility clarity (`Remove filter N` and `Remove sort N`).
3. Added regression tests for add/remove filter and sort row flows in `AdvanceFilter`.
4. Refreshed semantic color tokens, soft variant surfaces, borderless Badge/BadgeSelect, and button tone/hover behavior (see the token list above).
5. BREAKING: removed the `@keytuno/ui-react/addons/table-exporters` subpath export and the optional `jspdf`, `jspdf-autotable`, and `xlsx` peer dependencies that shipped in `v1.0.0`. This is why the release is a major version (`v2.0.0`).
6. `AdaptiveCard` link/media fields, `FilePreview`, and `FileUpload` now reject unsafe URL schemes (`javascript:` and similar), and `FileUpload` enforces `accept` on drag-and-drop.

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

Use these steps whenever you cut a new release tag (for example, `v1.0.1`).

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

4. Commit release changes (`dist/` is tracked and consumed through the git tag, so it must be rebuilt in step 2 and committed):

```bash
git add package.json pnpm-lock.yaml README.md docs/ dist/
git commit -m "release(ui-react): prepare v1.0.1"
```

5. Create annotated tag:

```bash
git tag -a v1.0.1 -m "release: @keytuno/ui-react v1.0.1"
```

6. Push commit and tag:

```bash
git push origin main
git push origin v1.0.1
```

7. Verify tag exists on remote:

```bash
git ls-remote --tags origin refs/tags/v1.0.1
```

## Use a New Tag in Another Project

Example target tag: `v1.0.1`

1. Install from GitHub tag in consumer project:

```bash
pnpm add github:mayurpatil60/keytuno-ui-react#v1.0.1
```

2. npm-based consumer apps can use:

```bash
npm install "github:mayurpatil60/keytuno-ui-react#v1.0.1"
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

## Release Contributor (v2.0.0)

1. Name: Mayur Patil
2. Email: mayurpatil60@gmail.com
3. GitHub: https://github.com/mayurpatil60

## Team-Ready Handover Docs

1. Contribution and ownership: [CONTRIBUTING.md](CONTRIBUTING.md)
2. Code owners: [.github/CODEOWNERS](.github/CODEOWNERS)
3. Versioning and rollback playbook: [docs/OPERATIONS.md](docs/OPERATIONS.md)
4. Framework and consumer compatibility notes: [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md)
5. Release records: [docs/releases](docs/releases)

## Compatibility Snapshot

1. Current peer dependency baseline: react/react-dom ^18.
2. Current known consumer gap: React 19 consumers may require `--legacy-peer-deps` until peer ranges are widened.