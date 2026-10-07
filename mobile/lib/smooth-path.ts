// lib/smooth-path.ts
// Genera el atributo `d` de un <Path> SVG que pasa por todos los puntos con una
// curva suave. Se usa interpolación cúbica monótona (Fritsch–Butland) en vez de
// Catmull-Rom para que la curva NUNCA sobrepase el valor de un punto: un
// gráfico de salud no debe mostrar picos que no existen en los datos.

export type Point = { x: number; y: number };

const fmt = (n: number) => n.toFixed(2);

/** Puntos ordenados por `x` ascendente. Devuelve '' si no hay puntos. */
export function buildMonotonePath(points: Point[]): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M${fmt(points[0].x)},${fmt(points[0].y)}`;

  // ancho y pendiente de cada tramo
  const widths: number[] = [];
  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const width = points[i + 1].x - points[i].x;
    widths.push(width);
    slopes.push(width === 0 ? 0 : (points[i + 1].y - points[i].y) / width);
  }

  // tangente en cada punto: 0 en los extremos locales (evita el sobrepico) y
  // media armónica ponderada en el resto.
  const tangents: number[] = new Array(n);
  tangents[0] = slopes[0];
  tangents[n - 1] = slopes[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      tangents[i] = 0;
      continue;
    }
    const w1 = 2 * widths[i] + widths[i - 1];
    const w2 = widths[i] + 2 * widths[i - 1];
    tangents[i] = (w1 + w2) / (w1 / slopes[i - 1] + w2 / slopes[i]);
  }

  let path = `M${fmt(points[0].x)},${fmt(points[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const third = widths[i] / 3;
    const c1x = points[i].x + third;
    const c1y = points[i].y + tangents[i] * third;
    const c2x = points[i + 1].x - third;
    const c2y = points[i + 1].y - tangents[i + 1] * third;
    path += `C${fmt(c1x)},${fmt(c1y)} ${fmt(c2x)},${fmt(c2y)} ${fmt(points[i + 1].x)},${fmt(points[i + 1].y)}`;
  }
  return path;
}
