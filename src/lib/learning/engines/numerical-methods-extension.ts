export function interpolate(nodes: number[], values: number[], x: number) {
  if (nodes.length !== values.length || !nodes.length || new Set(nodes).size !== nodes.length) throw new Error('插值节点须互异并与函数值对应');
  return nodes.reduce((sum, xi, i) => sum + values[i] * nodes.reduce((product, xj, j) => i === j ? product : product * (x - xj) / (xi - xj), 1), 0);
}

export function fitLine(x: number[], y: number[]) {
  if (x.length !== y.length || x.length < 2) throw new Error('至少需要两组数据');
  const meanX = x.reduce((a, b) => a + b, 0) / x.length;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;
  const denominator = x.reduce((sum, v) => sum + (v - meanX) ** 2, 0);
  if (!denominator) throw new Error('横坐标不能全部相同');
  const slope = x.reduce((sum, v, i) => sum + (v - meanX) * (y[i] - meanY), 0) / denominator;
  const intercept = meanY - slope * meanX;
  const residuals = x.map((v, i) => y[i] - intercept - slope * v);
  return { slope, intercept, residuals, sse: residuals.reduce((sum, v) => sum + v * v, 0) };
}

export function quadrature(f: (x: number) => number, a: number, b: number, n: number, method: 'trapezoid' | 'simpson') {
  if (!Number.isInteger(n) || n < 1 || (method === 'simpson' && n % 2)) throw new Error('分段数须为正整数，Simpson 需要偶数段');
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (method === 'trapezoid' ? 2 : i % 2 ? 4 : 2) * f(a + i * h);
  return sum * h / (method === 'trapezoid' ? 2 : 3);
}

export type OdeMethod = 'euler' | 'heun' | 'rk4';
export function odeSteps(f: (t: number, y: number) => number, y0: number, h: number, steps: number, method: OdeMethod) {
  const result = [{ t: 0, y: y0 }];
  let y = y0;
  for (let i = 0; i < steps; i++) {
    const t = i * h, k1 = f(t, y);
    if (method === 'euler') y += h * k1;
    else if (method === 'heun') y += h * (k1 + f(t + h, y + h * k1)) / 2;
    else {
      const k2 = f(t + h / 2, y + h * k1 / 2), k3 = f(t + h / 2, y + h * k2 / 2), k4 = f(t + h, y + h * k3);
      y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    }
    result.push({ t: (i + 1) * h, y });
  }
  return result;
}

export function linearSteps(method: 'jacobi' | 'seidel', count: number) {
  const rows = [{ x: 0, y: 0, residual: 2 }];
  let x = 0, y = 0;
  for (let k = 0; k < count; k++) {
    const nextX = (1 - y) / 4;
    const nextY = (2 - (method === 'seidel' ? nextX : x)) / 3;
    x = nextX; y = nextY;
    rows.push({ x, y, residual: Math.max(Math.abs(1 - 4 * x - y), Math.abs(2 - x - 3 * y)) });
  }
  return rows;
}

export function powerSteps(ratio: number, count: number) {
  let x = 1, y = 1;
  const row = () => {
    const eigenvalue = (3 * x * x + 3 * ratio * y * y) / (x * x + y * y);
    return { x, y, eigenvalue, residual: Math.hypot((3 - eigenvalue) * x, (3 * ratio - eigenvalue) * y) / Math.hypot(x, y) };
  };
  const rows = [row()];
  for (let k = 0; k < count; k++) { x *= 3; y *= 3 * ratio; const scale = Math.max(Math.abs(x), Math.abs(y)); x /= scale; y /= scale; rows.push(row()); }
  return rows;
}
