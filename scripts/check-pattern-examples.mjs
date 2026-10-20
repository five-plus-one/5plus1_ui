import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const root = process.cwd(),
  source = fs.readFileSync("src/pattern-examples.ts", "utf8");
const examples = {
  ...JSON.parse(
    fs
      .readFileSync("src/catalog-examples.ts", "utf8")
      .split("Record<string,string>=")[1]
      .trim()
      .replace(/;$/, ""),
  ),
  ...JSON.parse(
    source
      .slice(source.indexOf("=") + 1)
      .trim()
      .replace(/;$/, ""),
  ),
};
const folder = path.join(root, ".work", "example-contracts");
fs.mkdirSync(folder, { recursive: true });
const files = Object.entries(examples).map(([name, code]) => {
  const target = path.join(folder, `${name}.tsx`);
  fs.writeFileSync(target, code);
  return target;
});
const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(
  [...files, ...parsed.fileNames.filter((file) => file.endsWith(".d.ts"))],
  {
    ...parsed.options,
    baseUrl: root,
    paths: {
      "@fiveplusone/ui": [process.argv.includes("--installed") ? ".work/consumer/node_modules/@fiveplusone/ui/dist-library/index.d.ts" : "src/lib/index.tsx"],
      "@fiveplusone/ui/styles.css": ["src/lib/styles.css"],
    },
  },
);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (f) => f,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else console.log(`Verified ${files.length} copyable examples.`);
