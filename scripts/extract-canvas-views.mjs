import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const maintained = new Set([
  "CanvasFrame.tsx",
  "CanvasFullscreenPortal.tsx",
  "renderers/HtmlRenderer.tsx",
]);
function explicitButtons(text, filename) {
  const tree = ts.createSourceFile(
    filename,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
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
        return ts.visitEachChild(current, visit, context);
      };
      return ts.visitNode(node, visit);
    },
  ]);
  const output = ts.createPrinter().printFile(result.transformed[0]);
  result.dispose();
  return output;
}
import { createHash } from "node:crypto";
const source = path.resolve(process.argv[2]),
  output = path.resolve("src/lib/canvas"),
  records = [];
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
function save(target, original) {
  let text = fs.readFileSync(original, "utf8").replaceAll("\r\n", "\n");
  const replacements = {
    "@/lib/canvas/types": "engines/types",
    "@/lib/canvas/normalize": "engines/normalize",
    "@/lib/canvas/plot": "engines/plot",
    "@/lib/utils/sanitizeSvg": "engines/sanitizeSvg",
    "@/lib/svg/svgHealth": "engines/svgHealth",
    "@/lib/hooks/useCanvasFullscreen": "useCanvasFullscreen",
    "@/lib/utils/downloadHtml": "downloadHtml",
  };
  for (const [key, value] of Object.entries(replacements)) {
    let relative = path
      .relative(path.dirname(target), value)
      .replaceAll("\\", "/");
    if (!relative.startsWith(".")) relative = "./" + relative;
    text = text.replaceAll(key, relative);
  }
  text = text.replace(
    "import PencilSparklesIcon from '@/components/icons/PencilSparklesIcon';",
    "import { Pencil as PencilSparklesIcon } from 'lucide-react';",
  );
  text = text
    .replaceAll("AI revise canvas", "修改画布")
    .replaceAll("Hide source", "收起内容")
    .replaceAll("View source", "查看内容");
  if (target === "CanvasFrame.tsx") {
    text = text.replace(
      "import { useState }",
      'import { AnimatedSize } from "../AnimatedSize";\nimport { useState }',
    );
    text = text
      .replace(
        '<div className="svg-canvas-controls svg-canvas-controls-left">',
        '<div className="svg-canvas-controls svg-canvas-controls-left">',
      )
      .replace(
        "onClick={() => setShowRevision",
        "disabled={!onRevisionSubmit}\n          onClick={() => setShowRevision",
      );
    text = text
      .replace("{showRevision ? (", "<AnimatedSize>{showRevision ? (")
      .replace(
        ") : null}\n\n      {hasSource",
        ") : null}</AnimatedSize>\n\n      {hasSource",
      );
    text = text.replace(
      '{showSource ? <pre className="viz-error-source">{source}</pre> : null}',
      '<AnimatedSize>{showSource ? <pre className="viz-error-source">{source}</pre> : null}</AnimatedSize>',
    );
  }
  const dest = path.join(output, target);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!maintained.has(target.replaceAll("\\", "/")) || !fs.existsSync(dest))
    fs.writeFileSync(
      dest,
      target.endsWith(".tsx") ? explicitButtons(text, target) : text,
    );
  records.push({
    source: path.relative(source, original).replaceAll("\\", "/"),
    target: "src/lib/canvas/" + target.replaceAll("\\", "/"),
    adaptation: maintained.has(target.replaceAll("\\", "/"))
      ? "maintained-view"
      : "portable-source",
    sha256: createHash("sha256")
      .update(fs.readFileSync(original))
      .digest("hex"),
  });
}
for (const file of walk(path.join(source, "components/canvas"))) {
  if (
    !/\.(tsx|ts)$/.test(file) ||
    file.includes(".test.") ||
    /(CanvasRevisionPanel|CanvasDiagnosticPanel|MoleculeRenderer)\.tsx$/.test(
      file,
    )
  )
    continue;
  save(path.relative(path.join(source, "components/canvas"), file), file);
}
for (const [target, original] of Object.entries({
  "engines/types.ts": "lib/canvas/types.ts",
  "engines/normalize.ts": "lib/canvas/normalize.ts",
  "engines/plot.ts": "lib/canvas/plot.ts",
  "engines/sanitizeSvg.ts": "lib/utils/sanitizeSvg.ts",
  "engines/svgHealth.ts": "lib/svg/svgHealth.ts",
  "downloadHtml.ts": "lib/utils/downloadHtml.ts",
}))
  save(target, path.join(source, original));
let css = fs.readFileSync(path.join(source, "app/styles/canvas.css"), "utf8");
fs.writeFileSync(path.join(output, "canvas-base.css"), css);
fs.writeFileSync(
  "docs/canvas-view-extraction.json",
  JSON.stringify(records, null, 2) + "\n",
);
console.log(`Extracted ${records.length} canvas modules.`);
