import { defineConfig } from "tsup"

export const tsup = defineConfig({
  entry: ["src/index.ts", "src/draft.ts", "src/navigation.ts"],
  // Enable experimental code splitting support in CommonJS.
  // splitting: true,
  // Use Rollup for tree shaking.
  // treeshake: true,
  sourcemap: true,
  clean: true,
  format: ["esm", "cjs"],
  dts: true,
  cjsInterop: true,
})
