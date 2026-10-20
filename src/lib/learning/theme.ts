/** CSS variables remain usable when a chart requests an alpha variant. */
export function learningAlpha(color: string, hex: string) { const alpha = Math.max(0, Math.min(255, parseInt(hex, 16) || 0)); return `color-mix(in srgb, ${color} ${Math.round(alpha / 255 * 10000) / 100}%, transparent)`; }
