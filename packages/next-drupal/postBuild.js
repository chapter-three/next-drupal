import { readdir, copyFile } from "node:fs/promises"

const files = await readdir("./dist")
const tasks = []
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
    tasks.push(copyFile(`./dist/${base}.d.ts`, `./dist/${base}.d.cts`))
  }
}
await Promise.all(tasks)
console.log(`Created unique *.d.cts files for CommonJS build.`)
