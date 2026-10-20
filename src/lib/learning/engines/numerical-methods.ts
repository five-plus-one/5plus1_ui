export function areaError(a: number, b: number, ea: number, eb: number) {
  if (![a, b, ea, eb].every(Number.isFinite) || ea < 0 || eb < 0 || a <= ea || b <= eb) {
    throw new RangeError('边长应大于非负误差限');
  }
  const nominal = a * b;
  const linear = b * ea + a * eb;
  return { nominal, linear, exact: linear + ea * eb, low: (a - ea) * (b - eb), high: (a + ea) * (b + eb) };
}

export const classroomPolynomial = (x: number) => ((x + 4) * x) * x - 10;

/** k is the number of completed bracket updates, before evaluating its midpoint. */
export function bisectionSteps(updates: number) {
  if (!Number.isInteger(updates) || updates < 0 || updates > 40) throw new RangeError('无效步数');
  let a = 1, b = 2;
  const rows = [];
  for (let k = 0; k <= updates; k++) {
    const mid = (a + b) / 2;
    const value = classroomPolynomial(mid);
    rows.push({ k, a, b, mid, value, bound: (b - a) / 2 });
    if (value === 0) break;
    if (classroomPolynomial(a) * value < 0) b = mid;
    else a = mid;
  }
  return rows;
}

export function fixedPointSteps(kind: 'sqrt' | 'slow', count: number) {
  if (!Number.isInteger(count) || count < 1 || count > 2000) throw new RangeError('无效步数');
  const L = kind === 'sqrt' ? 1 / Math.sqrt(7) : 0.99;
  const root = kind === 'sqrt' ? 3 : 1;
  let x = kind === 'sqrt' ? 4 : 0;
  const rows = [];
  for (let k = 1; k <= count; k++) {
    const next = kind === 'sqrt' ? Math.sqrt(2 * x + 3) : 0.99 * x + 0.01;
    const step = Math.abs(next - x);
    rows.push({ k, previous: x, x: next, step, bound: L / (1 - L) * step, error: Math.abs(root - next) });
    x = next;
  }
  return { L, root, rows };
}
