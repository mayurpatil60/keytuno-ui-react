# Operations: Versioning and Rollback

## Scope

This document defines the release policy, version bump rules, and rollback steps for `@keytuno/ui-react`.

Current stable release: `v2.0.0`.

## Release Ownership

1. Release contributor for v2.0.0: Mayur Patil.
2. Contact email: mayurpatil60@gmail.com.
3. GitHub profile: https://github.com/mayurpatil60.

## Versioning Policy

The package uses Semantic Versioning. Release tags use the `vX.Y.Z` form (legacy tags `0.1.0` and `0.1.1` without the `v` prefix exist and should not be used by consumers).

1. Patch (`x.y.Z`): bug fixes, docs updates, build/config updates, and non-breaking style adjustments.
2. Minor (`x.Y.z`): new components, additive props, additive theme tokens, and non-breaking behavior additions.
3. Major (`X.y.z`): breaking API changes, removed/renamed exports, removed/renamed tokens, or changed default behaviors that require consumer changes.

## Release Preconditions

Before creating a release tag:

1. Working tree is clean.
2. Validation gate passes:

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

3. Accessibility and testability smoke checks pass:
   - Keyboard-only interaction for at least one overlay component (`Dialog` or `Sheet`).
   - At least one repeated-component screen test uses scoped selectors (Playwright or Testing Library).
   - Icon-only controls have explicit accessible labels in stories/examples.

4. Required docs updated for user-facing changes:
   - `README.md`
   - `docs/keytuno-ui-react.md` (theme list, token references, and component variant unions)
   - `docs/COMPATIBILITY.md` (if version ranges or framework support changed)
   - `docs/releases/*.md` (when release notes need additive token/variant change history)
   - When semantic tokens change, ensure docs and adapter mappings include all related CSS vars (for example: `--ktn-bg-hover`, `--ktn-bg-selected`, `--ktn-border-strong`, `--ktn-action-danger-bg`, `--ktn-action-danger-fg`, `--ktn-action-primary-soft-bg`, `--ktn-action-success-soft-bg`, `--ktn-action-warning-soft-bg`, `--ktn-action-accent-soft-bg`, `--ktn-action-danger-soft-bg`, `--ktn-button-default-bg`, `--ktn-button-default-fg`, `--ktn-button-default-border`, `--ktn-button-primary-bg`, `--ktn-button-primary-fg`, `--ktn-button-success-bg`, `--ktn-button-success-fg`, `--ktn-button-warning-bg`, `--ktn-button-warning-fg`, `--ktn-button-accent-bg`, `--ktn-button-accent-fg`, `--ktn-button-destructive-bg`, `--ktn-button-destructive-fg`)

5. Git-tag payload sanity checks pass:
   - `dist/` is tracked in git and not ignored.
   - `dist/index.js` and `dist/index.d.ts` exist before creating the release tag.
   - Tag tree contains dist entrypoints:

```bash
git ls-tree -r --name-only vX.Y.Z dist/index.js dist/index.d.ts
```

## Release Procedure

1. Confirm current package version in `package.json`.
2. Apply version bump without letting the package manager tag early, then rebuild and commit `dist/` (consumers install the git tag, so `dist/` must match the tagged source):

```bash
pnpm version <patch|minor|major> --no-git-tag-version
# or explicit version
pnpm version 2.0.0 --no-git-tag-version
pnpm build
git add package.json pnpm-lock.yaml docs/ README.md dist/
git commit -m "release(ui-react): prepare vX.Y.Z"
git tag -a vX.Y.Z -m "release: @keytuno/ui-react vX.Y.Z"
```

3. Push commit and tag:

```bash
git push origin <branch>
git push origin --tags
```

4. Verify release tag includes dist entry files before consumer install tests:

```bash
git ls-tree -r --name-only vX.Y.Z dist/index.js dist/index.d.ts
```

5. Verify tag install in a consumer app:

```bash
pnpm add github:mayurpatil60/keytuno-ui-react#vX.Y.Z
```

6. Verify reusable-component behavior in consumer app test flows:
   - Same component rendered multiple times can be targeted with role/name or scoped selectors.
   - No selector collisions caused by generic labels.

## Rollback Playbook

Use this sequence when a release causes a consumer regression.

1. Triage
   - Identify affected tag and failing consumer behavior.
   - Reproduce with the exact tag in a consumer app.
2. Containment
   - Pin consumers back to last known good tag.
   - Communicate the temporary pin in consumer release notes.
3. Recovery
   - Prefer forward-fix: create a patch release (`vX.Y.(Z+1)`) with a fix.
   - Avoid mutating already-consumed tags.
4. Last-resort tag rollback
   - If a tag must be withdrawn, create a new corrective tag and update consumers immediately.
   - Do not rewrite history unless absolutely required.
5. Post-incident
   - Add a short incident note in release records.
   - Update validation checks or compatibility notes to prevent recurrence.

## Ownership During Incidents

1. Maintainer leads triage and fix release.
2. Consumer app owners validate integration with the new tag.
3. Close incident only after build and runtime smoke checks pass in at least one consumer app.
