import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(process.argv[2] || "");
if (!process.argv[2] || !fs.existsSync(path.join(root, "components"))) {
  throw new Error("Provide the KeZhan frontend source directory.");
}
const mapping = JSON.parse(fs.readFileSync(new URL("../docs/kezhan-component-map.json", import.meta.url), "utf8"));
function files(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(path.join(directory, entry.name)) :
      /\.tsx$/.test(entry.name) && !/\.(?:test|spec)\.tsx$/.test(entry.name) ? [path.join(directory, entry.name)] : []);
}
const sources = ["components", "frontend", "app", "lib", "collaboration"].flatMap((directory) => files(path.join(root, directory))).map((filename) => {
  const text = fs.readFileSync(filename, "utf8");
  const source = path.relative(root, filename).replaceAll(path.sep, "/");
  return { source, lines: text.split(/\r?\n/).length, sha256: crypto.createHash("sha256").update(text).digest("hex"),
    importsLibrary: /(?:from\s*|import\s*)["']@fiveplusone\/ui(?:[\/"'])/.test(text),
    mappingPresent: mapping.some((row) => row.source === source) };
}).sort((a, b) => a.source.localeCompare(b.source));
const missing = sources.filter((source) => source.source.startsWith("components/") && !source.mappingPresent);
const stale = mapping.filter((row) => !sources.some((source) => source.source === row.source));
const report = {
  scope: "Non-test TSX source inventory. This inventory does not establish feature parity or design acceptance.",
  counts: Object.fromEntries(["components", "frontend", "app", "lib", "collaboration"].map((name) => [name, sources.filter((source) => source.source.startsWith(name + "/")).length])),
  componentGroups: Object.fromEntries([...new Set(sources.filter((s) => s.source.startsWith("components/")).map((s) => s.source.split("/")[1]))].map((group) => [group, sources.filter((s) => s.source.startsWith(`components/${group}/`)).length])),
  unmappedComponents: missing.map((source) => source.source),
  staleMappings: stale.map((row) => row.source),
  libraryImportCount: sources.filter((source) => source.importsLibrary).length,
  sources,
};
fs.writeFileSync(new URL("../docs/kezhan-source-inventory.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ counts: report.counts, unmapped: missing.length, stale: stale.length, libraryImports: report.libraryImportCount }));
if (missing.length || stale.length) process.exitCode = 1;
