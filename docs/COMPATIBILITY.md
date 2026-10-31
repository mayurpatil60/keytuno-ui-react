# Compatibility Notes

## Current Baseline

1. Node.js: 18+
2. pnpm: 9+
3. TypeScript: 5.x toolchain in this repository
4. Storybook: 8.x
5. React peer range in `@keytuno/ui-react@2.0.0`: `^18.0.0`
6. Test stack verified in repository: Vitest + Testing Library (unit), Storybook build (UI docs)

## Consumer Reality (as of 2026-10-31)

1. `finvesto-frontend` currently uses React 19.
2. Installing `@keytuno/ui-react@2.0.0` in that app requires `--legacy-peer-deps` until peer range support is widened.
3. `th-mfg-frontend` consumes the library from git tag `v2.0.0`.

## Framework Upgrade Checklist

When planning framework upgrades (React, Vite, TypeScript, Storybook, or Node):

1. Create a dedicated branch for the upgrade.
2. Update package/tooling versions incrementally.
3. Run full validation gate:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
```

4. Validate at least one consumer app install + build using a pre-release tag.
5. Document any required consumer migration steps.

## React Major Upgrade Guidance

1. Widen `peerDependencies` only after passing local and consumer validations.
2. Keep component behavior stable while adjusting internals for React API changes.
3. If runtime behavior changes for consumers, release as a major version.

## API Consistency Notes (v2.0.0; items 5-10 are new since v1.0.0)

1. Most stateful components expose direct change callbacks and `onAction(context)`.
2. Event-style `onAction(event)` remains intentional for `Button`, `Badge`, `Avatar`, and item-level actions in `Breadcrumb`, `Navbar`, and `Sidebar`.
3. Legacy compatibility naming notes:
	- Use `variant` as the only spelling in active docs and stories.
	- Canonical file/component naming is `Separator` (`src/components/Separator.tsx`, `Separator`).
	- Use `Separator` as the only spelling in code, exports, docs, and stories.
4. Navbar variant update: `soft` was removed from `Navbar`; use `light` or `brand-light` for soft enterprise styling, and use `default` or `outline` for legacy compatibility styles.
5. Button-like tone variants now include `success`, `warning`, and `accent` across Badge, BadgeSelect, Button, ButtonGroup, Alert, Dialog, and InputGroup; Toast variants include `accent` in addition to `default/success/warning/danger`.
6. Semantic color token surface now includes `backgroundHover`, `backgroundSelected`, `borderStrong`, `actionDangerBackground`, and `actionDangerForeground` (mapped to `--ktn-bg-hover`, `--ktn-bg-selected`, `--ktn-border-strong`, `--ktn-action-danger-bg`, and `--ktn-action-danger-fg`).
7. Added soft variant background semantic tokens for cross-component light surfaces:
	- `actionPrimarySoftBackground` (`--ktn-action-primary-soft-bg`, light: `#dbeafe`)
	- `actionSuccessSoftBackground` (`--ktn-action-success-soft-bg`, light: `#dcfce7`)
	- `actionWarningSoftBackground` (`--ktn-action-warning-soft-bg`, light: `#fef3c7`)
	- `actionAccentSoftBackground` (`--ktn-action-accent-soft-bg`, light: `#fce7f3`)
	- `actionDangerSoftBackground` (`--ktn-action-danger-soft-bg`, light: `#fee2e2`)
8. Badge and BadgeSelect visuals are borderless; BadgeSelect option hover/selected emphasis is token-driven and adapts across light/dark themes.
9. Button color tuning now uses dedicated semantic button tokens:
	- `buttonDefaultBackground/Foreground/Border` (`--ktn-button-default-bg`, `--ktn-button-default-fg`, `--ktn-button-default-border`)
	- `buttonPrimaryBackground/Foreground` (`--ktn-button-primary-bg`, `--ktn-button-primary-fg`)
	- `buttonSuccessBackground/Foreground`, `buttonWarningBackground/Foreground`, `buttonAccentBackground/Foreground`, `buttonDestructiveBackground/Foreground`
10. Button hover behavior now applies enterprise-style emphasis: per-variant hover states darken background tones and also adjust border/text colors for both light and dark themes.

## Testing Compatibility Notes

1. Components generally support role/name-based queries through semantic markup and ARIA wiring.
2. Most component roots accept native HTML attributes, allowing consumer-owned `data-testid` for scoped selectors.
3. For pages that render the same reusable component multiple times, scope tests to a container (`within(...)` in Testing Library or nested locators in Playwright) to avoid selector collisions.
4. Recommended selector order:
	- role + accessible name
	- label text
	- scoped `data-testid`
	- avoid positional/index-only selectors
5. In this library repository's Storybook files, prefer local source exports (`../src/index`) over `@keytuno/ui-react`. Storybook resolves both (alias in `.storybook/main.ts`), but the package name shows unresolved-module diagnostics in the editor because `tsconfig.json` has no path mapping; some existing stories and `.storybook/preview.ts` still use the package name.
6. Keep story typings as `Meta<typeof Component>` and `StoryObj<typeof meta>` to preserve typed `render(args)` signatures and avoid implicit-any issues.

## Vite and Storybook Upgrade Guidance

1. Upgrade Vite and Storybook separately when possible for easier rollback.
2. Re-check Storybook static output and lazy import behavior after upgrades.
3. Watch for Sass and bundler deprecation warnings and track follow-up work.

## Consumer Validation Matrix

Minimum matrix before declaring compatibility changes complete:

1. Library repository: lint + typecheck + test + build + build-storybook pass.
2. Web consumer (`finvesto-frontend`): install from tag + build pass.
3. Runtime smoke route or equivalent integration check pass in one consumer app.
4. Repeated-component test flow validated in one consumer page (Playwright or Testing Library scoped queries).

## Release Contributor (v2.0.0)

1. Name: Mayur Patil
2. Email: mayurpatil60@gmail.com
3. GitHub: https://github.com/mayurpatil60

