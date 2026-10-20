import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export function themeLearningModule(text, relative) {
  let alpha = false;
  text = text.replace(
    /\b((?:\w+\.)*(?:ACCENT(?:_LIGHT)?|color))\s*\+\s*["']([0-9a-f]{2})["']/gi,
    (_all, color, opacity) => {
      alpha = true;
      return `learningAlpha(${color}, '${opacity}')`;
    },
  );
  text = text.replace(
    /\$\{(ACCENT(?:_LIGHT)?|color)\}([0-9a-f]{2})(?![\da-f])/gi,
    (_all, color, opacity) => {
      alpha = true;
      return "${learningAlpha(" + color + ', "' + opacity + '")}';
    },
  );
  const dynamic =
    'ACCENT + Math.round(opacity * 30).toString(16).padStart(2, "0")';
  if (text.includes(dynamic)) {
    alpha = true;
    text = text.replaceAll(
      dynamic,
      'learningAlpha(ACCENT, Math.round(opacity * 30).toString(16).padStart(2, "0"))',
    );
  }
  text = text.replace(
    /const (?:ACCENT_LIGHT|ACCENT_SOFT) = ["'][^"']+["']/g,
    (all) => all.slice(0, all.indexOf("=")) + '= "var(--fp-primary-soft)"',
  );
  text = text.replace(
    /const ACCENT_MID = ["'][^"']+["']/g,
    'const ACCENT_MID = "var(--fp-primary)"',
  );
  text = text.replace(
    /const (\w+(?:_LIGHT|_FILL)) = ["']#([0-9a-f]{6})["']/gi,
    (_all, name, color) =>
      `const ${name} = "color-mix(in srgb, #${color} 24%, var(--fp-surface))"`,
  );
  text = text.replace(
    /function heatColor\(ratio: number\): string \{[\s\S]*?\n\}/g,
    "function heatColor(ratio: number): string { return `color-mix(in srgb, var(--fp-primary) ${Math.round(12 + Math.max(0, Math.min(1, ratio)) * 88)}%, var(--fp-surface))`;\n}",
  );
  text = text.replace(
    /(ratio\s*>\s*0\.55\s*\?\s*)["']#fff(?:fff)?["']/g,
    '$1"var(--fp-on-primary)"',
  );
  text = text.replace(
    /(color:\s*(?:active|isActive)\s*\?\s*)["']#fff(?:fff)?["']/gi,
    '$1"var(--fp-on-primary)"',
  );
  text = text
    .replace(
      /\b(?:bg-white|bg-slate-50|bg-gray-50)\b/g,
      "bg-[var(--fp-surface)]",
    )
    .replace(/\btext-(?:slate|gray)-(?:800|900)\b/g, "text-[var(--fp-ink)]")
    .replace(
      /\btext-(?:slate|gray)-(?:500|600|700)\b/g,
      "text-[var(--fp-muted)]",
    );
  text = text.replace(
    /(background(?:Color)?:\s*)["']#(?:fff(?:fff)?|f8fafc|f9fafb)["']/gi,
    '$1"var(--fp-surface)"',
  );
  if (alpha) {
    let location = path
      .relative(path.dirname(relative), "theme")
      .replaceAll("\\", "/");
    if (!location.startsWith(".")) location = "./" + location;
    text = `import { learningAlpha } from '${location}';\n` + text;
  }
  return text;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = path.resolve("src/lib/learning");
  const walk = (dir) =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((entry) =>
        entry.isDirectory()
          ? walk(path.join(dir, entry.name))
          : [path.join(dir, entry.name)],
      );
  for (const file of walk(root)) {
    if (!file.endsWith(".tsx")) continue;
    fs.writeFileSync(
      file,
      themeLearningModule(
        fs.readFileSync(file, "utf8"),
        path.relative(root, file),
      ),
    );
  }
}
