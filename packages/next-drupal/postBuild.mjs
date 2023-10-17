import { readdir, copyFile } from "node:fs/promises"

const files = await readdir("./dist")
for (const file of files) {
  if (file.endsWith(".modern.js")) {
    const base = file.replace(/\.modern\.js$/, "")

    // Make a duplicate of the type definitions.
    //
    // From the TypeScript docs:
    //
    // "It’s important to note that the CommonJS entrypoint and the ES module
    // entrypoint each needs its own declaration file, even if the contents are
    // the same between them."
    //
    // @see https://www.typescriptlang.org/docs/handbook/esm-node.html#packagejson-exports-imports-and-self-referencing
    await copyFile(`./dist/${base}.d.ts`, `./dist/${base}.cjs.d.ts`)
  }
}
console.log(`Created unique *.d.ts files for CommonJS build.`)
