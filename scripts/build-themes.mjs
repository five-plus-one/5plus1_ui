import { writeFileSync } from 'node:fs';
import { productThemes } from '../src/lib/themes.ts';
const blocks = [];
for (const [id, palette] of Object.entries(productThemes)) {
  const values = (dark) => ({
    primary: dark ? (palette.darkPrimary || palette.primary) : palette.primary,
    'on-primary': dark ? (palette.darkOnPrimary || palette.onPrimary) : palette.onPrimary,
    'primary-soft': dark ? palette.darkSoft : palette.soft,
    'primary-ink': dark ? palette.darkInk : palette.ink,
  });
  for (const dark of [false, true]) {
    blocks.push(`${dark ? '[data-theme="dark"]' : ''}[data-product="${id}"] {\n${Object.entries(values(dark)).map(([k,v]) => `  --fp-${k}: ${v};`).join('\n')}\n}`);
  }
}
writeFileSync(new URL('../src/lib/product-themes.css', import.meta.url), `/* Generated from themes.ts by scripts/build-themes.mjs. */\n${blocks.join('\n')}\n`);
