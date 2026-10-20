import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { themeLearningModule } from "./theme-learning-views.mjs";
import { createHash } from "node:crypto";
const source = path.resolve(process.argv[2]);
if (!fs.existsSync(path.join(source, "components/interactives/registry.ts")))
  throw Error("Provide the KeZhan frontend directory");
const output = path.resolve("src/lib/learning"),
  records = [];
fs.mkdirSync(output, { recursive: true });
function write(relative, text, original) {
  const file = path.join(output, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  if (original)
    records.push({
      source: path.relative(source, original).replaceAll("\\", "/"),
      target: `src/lib/learning/${relative.replaceAll("\\", "/")}`,
      sha256: createHash("sha256")
        .update(fs.readFileSync(original))
        .digest("hex"),
    });
}
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
function themedSelect(text, relative) {
  const tree = ts.createSourceFile(
    relative,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let changed = false;
  const result = ts.transform(tree, [
    (context) => (node) => {
      const visit = (current) => {
        if (
          (ts.isJsxOpeningElement(current) ||
            ts.isJsxSelfClosingElement(current)) &&
          current.tagName.getText(tree) === "button" &&
          !current.attributes.properties.some(
            (p) => ts.isJsxAttribute(p) && p.name.getText(tree) === "type",
          )
        ) {
          changed = true;
          const attributes = ts.factory.updateJsxAttributes(
            current.attributes,
            [
              ts.factory.createJsxAttribute(
                ts.factory.createIdentifier("type"),
                ts.factory.createStringLiteral("button"),
              ),
              ...current.attributes.properties,
            ],
          );
          return ts.isJsxOpeningElement(current)
            ? ts.factory.updateJsxOpeningElement(
                current,
                current.tagName,
                current.typeArguments,
                attributes,
              )
            : ts.factory.updateJsxSelfClosingElement(
                current,
                current.tagName,
                current.typeArguments,
                attributes,
              );
        }
        if (
          ts.isJsxOpeningElement(current) &&
          current.tagName.getText(tree) === "select"
        ) {
          changed = true;
          return ts.factory.updateJsxOpeningElement(
            current,
            ts.factory.createIdentifier("LearningSelect"),
            current.typeArguments,
            ts.visitEachChild(current.attributes, visit, context),
          );
        }
        if (
          ts.isJsxClosingElement(current) &&
          current.tagName.getText(tree) === "select"
        )
          return ts.factory.updateJsxClosingElement(
            current,
            ts.factory.createIdentifier("LearningSelect"),
          );
        return ts.visitEachChild(current, visit, context);
      };
      return ts.visitNode(node, visit);
    },
  ]);
  if (changed) {
    text = ts.createPrinter().printFile(result.transformed[0]);
    let importPath = path
      .relative(path.dirname(relative), "LearningSelect")
      .replaceAll("\\", "/");
    if (!importPath.startsWith(".")) importPath = "./" + importPath;
    if (text.includes("<LearningSelect"))
      text = `import { LearningSelect } from '${importPath}';\n` + text;
  }
  result.dispose();
  return text;
}
for (const group of [
  "probability",
  "chemistry",
  "physics",
  "discrete-math",
  "numerical-methods",
])
  for (const file of walk(
    path.join(source, "components/interactives", group),
  )) {
    if (
      !file.endsWith(".tsx") ||
      file.includes(".test.") ||
      /(?:SourceViewer|RecordingPlayer)\.tsx$/.test(file)
    )
      continue;
    const relative = path.relative(
      path.join(source, "components/interactives"),
      file,
    );
    let text = fs
      .readFileSync(file, "utf8")
      .replaceAll("@/components/visualizations", "../visualizations");
    if (group === "probability" && relative.split(path.sep).length > 2)
      text = text.replaceAll("../visualizations", "../../visualizations");
    text = text
      .replaceAll(
        "@/lib/numerical-methods-extension",
        "../engines/numerical-methods-extension",
      )
      .replaceAll("@/lib/numerical-methods", "../engines/numerical-methods");
    text = text
      .replace(
        /const ACCENT = ["']#[0-9a-f]+["']/gi,
        'const ACCENT = "var(--fp-primary)"',
      )
      .replace(
        /const ACCENT_LIGHT = ["'][^"']+["']/g,
        'const ACCENT_LIGHT = "var(--fp-primary-soft)"',
      );
    text = themeLearningModule(themedSelect(text, relative), relative);
    write(relative, text, file);
  }
for (const name of ["numerical-methods", "numerical-methods-extension"]) {
  const file = path.join(source, `lib/${name}.ts`);
  write(`engines/${name}.ts`, fs.readFileSync(file, "utf8"), file);
}
for (const name of ["DistributionChart", "VennDiagram", "FormulaSteps"]) {
  const file = path.join(
    source,
    `components/visualizations/primitives/${name}.tsx`,
  );
  write(
    `visualizations/${name}.tsx`,
    themeLearningModule(
      themedSelect(
        fs
          .readFileSync(file, "utf8")
          .replace(
            "import { sharedRemarkPlugins, sharedRehypePlugins } from '@/lib/markdown/plugins';",
            "import remarkMath from 'remark-math';\nimport rehypeKatex from 'rehype-katex';\nconst sharedRemarkPlugins = [remarkMath], sharedRehypePlugins = [rehypeKatex];",
          ),
        `visualizations/${name}.tsx`,
      ),
      `visualizations/${name}.tsx`,
    ),
    file,
  );
}
write(
  "visualizations/index.ts",
  `export * from './DistributionChart';\nexport * from './VennDiagram';\nexport * from './FormulaSteps';\n`,
);
let registry = fs
  .readFileSync(
    path.join(source, "components/interactives/registry.ts"),
    "utf8",
  )
  .replace(
    'import dynamic from "next/dynamic";',
    'import { lazy, Suspense, type ComponentType } from "react";\nfunction dynamic(loader: () => Promise<{default: ComponentType<any>} | ComponentType<any>>, _options?: unknown): ComponentType<Record<string, never>> { const Component = lazy(async () => { const result = await loader(); return typeof result === "function" ? {default:result} : result; }); return () => <Suspense fallback={<p role="status">正在打开实验…</p>}><Component /></Suspense>; }',
  )
  .replace('import type { ComponentType } from "react";', "")
  .replace(
    'import type { SubjectId } from "@/lib/types/content";',
    "type SubjectId = string;",
  )
  .replace("const interactives:", "export const learningExperiments:")
  .replaceAll("of interactives", "of learningExperiments")
  .replaceAll("return interactives.", "return learningExperiments.");
write(
  "registry.tsx",
  registry,
  path.join(source, "components/interactives/registry.ts"),
);
fs.writeFileSync(
  "docs/learning-view-extraction.json",
  JSON.stringify(records, null, 2) + "\n",
);
console.log(`Extracted ${records.length} learning source modules.`);
