# Compatibility Notes

## Current Baseline

1. Node.js: 18+
2. pnpm: 9+
3. TypeScript: 5.x toolchain in this repository
4. Storybook: 8.x
5. React peer range in `@keytuno/ui-react@0.1.0`: `^18.0.0`

## Consumer Reality (as of 2026-06-24)

1. `finvesto-frontend` currently uses React 19.
2. Installing `@keytuno/ui-react@0.1.0` in that app requires `--legacy-peer-deps` until peer range support is widened.

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

## Vite and Storybook Upgrade Guidance

1. Upgrade Vite and Storybook separately when possible for easier rollback.
2. Re-check Storybook static output and lazy import behavior after upgrades.
3. Watch for Sass and bundler deprecation warnings and track follow-up work.

## Consumer Validation Matrix

Minimum matrix before declaring compatibility changes complete:

1. Library repository: lint + typecheck + test + build + build-storybook pass.
2. Web consumer (`finvesto-frontend`): install from tag + build pass.
3. Runtime smoke route or equivalent integration check pass in one consumer app.
