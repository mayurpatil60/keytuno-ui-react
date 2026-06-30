# Operations: Versioning and Rollback

## Scope

This document defines the release policy, version bump rules, and rollback steps for `@keytuno/ui-react`.

## Versioning Policy

The package uses Semantic Versioning.

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
   - `docs/COMPATIBILITY.md` (if version ranges or framework support changed)
   - `keytuno-ui-library.md` phase or release execution record

## Release Procedure

1. Confirm current package version in `package.json`.
2. Apply version bump:

```bash
pnpm version <patch|minor|major>
```

3. Push commit and tag:

```bash
git push origin <branch>
git push origin --tags
```

4. Verify tag install in a consumer app:

```bash
pnpm add git+https://github.com/mayurpatil60/keytuno-ui-react.git#vX.Y.Z
```

5. Verify reusable-component behavior in consumer app test flows:
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
