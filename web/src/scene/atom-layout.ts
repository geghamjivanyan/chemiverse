// Геометрия атома: упаковка нуклонов в шар и радиусы электронных оболочек.
// Детерминированно (без random) — одинаковый атом при каждом рендере.

export type Vec3 = [number, number, number];

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // золотой угол

/** Точки, равномерно заполняющие шар радиуса R (фибоначчиева спираль + cbrt по радиусу). */
function ballPoints(count: number, radius: number): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const r = radius * Math.cbrt(t);
    const y = 1 - 2 * t; // -1..1
    const rho = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN * i;
    pts.push([r * rho * Math.cos(theta), r * y, r * rho * Math.sin(theta)]);
  }
  return pts;
}

/** Радиус ядра растёт медленно с числом нуклонов. */
export function nucleusRadius(nucleons: number): number {
  return 0.42 * Math.cbrt(Math.max(1, nucleons));
}

/**
 * Разложить нуклоны: протоны и нейтроны вперемешку (а не двумя кучами).
 * Возвращает позиции отдельно — для двух instancedMesh с разными цветами.
 */
export function nucleonLayout(
  protons: number,
  neutrons: number,
): { protonPos: Vec3[]; neutronPos: Vec3[]; radius: number } {
  const total = protons + neutrons;
  const radius = nucleusRadius(total);
  const all = ballPoints(total, radius);

  // детерминированно «перемешиваем» индексы по дробной части i*φ,
  // первые `protons` считаем протонами — так протоны рассеяны по объёму
  const order = all.map((_, i) => i).sort((a, b) => ((a * 0.6180339887) % 1) - ((b * 0.6180339887) % 1));
  const isProton = new Set(order.slice(0, protons));

  const protonPos: Vec3[] = [];
  const neutronPos: Vec3[] = [];
  all.forEach((p, i) => (isProton.has(i) ? protonPos : neutronPos).push(p));
  return { protonPos, neutronPos, radius };
}

/** Радиус n-й электронной оболочки (0-based), снаружи ядра. */
export function shellRadius(shellIndex: number, nucleusR: number): number {
  return nucleusR + 1.2 + shellIndex * 0.85;
}

/** Позиции электронов на оболочке: равномерно по кольцу (в плоскости XZ оболочки). */
export function electronAngles(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2);
}

/** Дистанция камеры, чтобы атом помещался в кадр. */
export function cameraDistance(shellCount: number, nucleusR: number): number {
  const outer = shellRadius(Math.max(0, shellCount - 1), nucleusR);
  return outer * 2.3 + 3.5;
}
