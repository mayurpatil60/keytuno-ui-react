import { defineConfig } from "tsup";

export default defineConfig((ctx) => ({
  // One output file per source file — mirrors what tsc produced, preserving
  // subpath exports and consumer-side tree-shaking.
  entry: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/*.test.ts",
    "!src/**/*.test.tsx",
    "!src/test/**",
  ],
  format: ["esm"],
  // Generate .d.ts declarations alongside each .js file (uses tsc under the
  // hood in no-bundle mode so output mirrors the source directory layout).
  dts: true,
  sourcemap: false,
  // Minify every output file — biggest single win since tsc never minifies.
  minify: true,
  // No-bundle: each file is transformed independently; import paths are kept
  // as-is so the dist layout remains identical to src and subpath exports work.
  bundle: false,
  outDir: "dist",
  clean: !ctx.watch,
  platform: "browser",
  target: "es2021",
  tsconfig: "tsconfig.release.json",
  // Strip console.* calls from production output.
  esbuildOptions(options) {
    options.pure = ["console.log", "console.debug", "console.info"];
  },
}));
