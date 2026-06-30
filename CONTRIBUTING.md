# Contributing to @keytuno/ui-react

## Purpose

This repository provides the standalone `@keytuno/ui-react` package used by Keytuno and Finvesto applications.

## Ownership and Review

1. Primary maintainer: Mayur Patil.
2. Source of ownership truth: `.github/CODEOWNERS`.
3. All pull requests should be reviewed by a code owner before merge.
4. Escalation path for release blockers: open an issue labeled `release-blocker` and notify the maintainer.

## Branching and Naming

1. Keep `main` as the stable branch.
2. Use short-lived topic branches:
   - `feature/ui-react/<slug>`
   - `fix/ui-react/<slug>`
   - `chore/ui-react/<slug>`
   - `release/ui-react/vX.Y.Z`
3. Keep Phase migration branch naming for large planned work:
   - `migration/ui-react/phase-<n>-<slug>`

## Pull Request Expectations

1. Scope changes to one concern (component, theme, docs, or release).
2. Include a short summary of user impact.
3. Reference related issue or phase record when applicable.
4. Update docs when API, behavior, installation, or release flow changes.

## Validation Checklist

Run these commands before requesting review:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm size
pnpm audit --prod --audit-level high
```

Run Storybook build for component/theme surface changes:

```bash
pnpm build-storybook
```

For reusable component changes (especially components rendered multiple times per page), include at least one scoped selector test (Playwright or Testing Library) that validates stable targeting without index-based selectors.

## API and Theming Guardrails

1. Preserve backward compatibility for existing exports unless a major release is planned.
2. Avoid exporting internal-only helpers from `src/index.ts`.
3. Prefer token-driven styles over hardcoded colors to keep themes consistent.
4. Document any new prop, token, or behavior change in repository docs.

## Commit and Release Hygiene

1. Keep commit messages concise and action-oriented.
2. Group noisy formatting changes separately from behavior changes.
3. Do not force-push release tags once consumed by apps.
4. Follow the release and rollback playbook in `docs/OPERATIONS.md`.
