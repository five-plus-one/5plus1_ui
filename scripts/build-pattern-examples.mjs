import fs from "node:fs";
import ts from "typescript";
const path = new URL("../src/pattern-demos.tsx", import.meta.url);
const source = ts.createSourceFile(
  path.pathname,
  fs.readFileSync(path, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const fn = source.statements.find(
  (node) => ts.isFunctionDeclaration(node) && node.name?.text === "PatternDemo",
);
if (!fn?.body) throw Error("PatternDemo is required");
const statements = [...fn.body.statements],
  declarations = statements.filter(ts.isVariableStatement);
const demoStatement = declarations.find((statement) =>
  statement.declarationList.declarations.some(
    (d) => ts.isIdentifier(d.name) && d.name.text === "demos",
  ),
);
const demos = demoStatement.declarationList.declarations.find(
  (d) => d.name.getText(source) === "demos",
).initializer;
const identifiers = (node) => {
  const result = new Set();
  const visit = (current) => {
    if (
      ts.isIdentifier(current) &&
      !(
        ts.isPropertyAssignment(current.parent) &&
        current.parent.name === current
      ) &&
      !(
        ts.isPropertyAccessExpression(current.parent) &&
        current.parent.name === current
      ) &&
      !ts.isJsxAttribute(current.parent)
    )
      result.add(current.text);
    ts.forEachChild(current, visit);
  };
  visit(node);
  return result;
};
const records = [];
for (const statement of source.statements) {
  if (!ts.isFunctionDeclaration(statement) || !statement.name || statement === fn) continue;
  records.push({
    scope: "top",
    names: new Set([statement.name.text]),
    uses: identifiers(statement),
    code: statement.getText(source),
  });
}
for (const [scope, list] of [
  [
    "top",
    source.statements
      .filter(ts.isVariableStatement)
      .filter((statement) =>
        statement.declarationList.declarations.some((d) =>
          ["art", "initialTabs", "nodes"].includes(d.name.getText(source)),
        ),
      ),
  ],
  ["local", declarations.filter((s) => s !== demoStatement)],
])
  for (const statement of list)
    for (const declaration of statement.declarationList.declarations)
      records.push({
        scope,
        declaration,
        names: identifiers(declaration.name),
        uses: identifiers(declaration.initializer),
        code: `const ${declaration.getText(source)};`,
      });
const examples = {};
for (const property of demos.properties) {
  if (
    !ts.isPropertyAssignment(property) ||
    !ts.isArrowFunction(property.initializer)
  )
    continue;
  const name = property.name.getText(source),
    needed = identifiers(property.initializer.body),
    selected = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    records.forEach((record, index) => {
      if (
        selected.has(index) ||
        ![...record.names].some((id) => needed.has(id))
      )
        return;
      selected.add(index);
      record.uses.forEach((id) => needed.add(id));
      changed = true;
    });
  }
  const top = records
      .filter((r, i) => selected.has(i) && r.scope === "top")
      .map((r) => r.code)
      .join("\n"),
    local = records
      .filter((r, i) => selected.has(i) && r.scope === "local")
      .map((r) => r.code)
      .join("\n");
  examples[name] =
    `import { useCallback, useRef, useState } from 'react';\nimport * as U from '@fiveplusone/ui';\nimport '@fiveplusone/ui/styles.css';\n\n${top}\n\nexport function Example(){\n${needed.has("notify") ? "const notify=(message:string)=>console.info(message);\n" : ""}${local}\nreturn (${property.initializer.body.getText(source)});\n}\n`;
}
fs.writeFileSync(
  new URL("../src/pattern-examples.ts", import.meta.url),
  `// Generated from the interactive examples by scripts/build-pattern-examples.mjs.\nexport const patternExamples:Record<string,string>=${JSON.stringify(examples, null, 2)};\n`,
);
process.stdout.write(
  `Prepared ${Object.keys(examples).length} component examples.\n`,
);
