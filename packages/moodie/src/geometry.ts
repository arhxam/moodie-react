export type Point = readonly [x: number, y: number];

export type ShapeName = "circle" | "squircle" | "blob" | "pebble" | "diamond";

export type EyeGeometry = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  curve?: number;
  skew?: number;
};

const BODY_POINTS = 16;
const EYE_POINTS = 12;

const clamp = (
  value: number | undefined,
  min: number,
  max: number,
  fallback: number,
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
};

const round = (value: number) => Number(value.toFixed(3));

const rotatePoint = (x: number, y: number, degrees: number): Point => {
  const radians = (degrees * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [round(x * cosine - y * sine), round(x * sine + y * cosine)];
};

const centerPointLoop = (points: readonly Point[]): Point[] => {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const offsetX = (Math.min(...xs) + Math.max(...xs)) / 2 - 100;
  const offsetY = (Math.min(...ys) + Math.max(...ys)) / 2 - 100;
  return points.map(([x, y]) => [round(x - offsetX), round(y - offsetY)]);
};

/** Convert a closed point loop into a topology-stable Catmull–Rom cubic path. */
export function createClosedPath(
  points: readonly Point[],
  tension = 1,
): string {
  if (points.length < 3) return "";

  const safeTension = clamp(tension, 0, 2, 1);
  const first = points[0];
  let path = `M${round(first[0])},${round(first[1])}`;

  for (let index = 0; index < points.length; index += 1) {
    const previous = points[(index - 1 + points.length) % points.length];
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const afterNext = points[(index + 2) % points.length];
    const control1: Point = [
      round(current[0] + ((next[0] - previous[0]) / 6) * safeTension),
      round(current[1] + ((next[1] - previous[1]) / 6) * safeTension),
    ];
    const control2: Point = [
      round(next[0] - ((afterNext[0] - current[0]) / 6) * safeTension),
      round(next[1] - ((afterNext[1] - current[1]) / 6) * safeTension),
    ];
    path += `C${control1[0]},${control1[1]} ${control2[0]},${control2[1]} ${round(next[0])},${round(next[1])}`;
  }

  return `${path}Z`;
}

export function createEyePoints(geometry: EyeGeometry = {}): Point[] {
  const centerX = clamp(geometry.x, -100, 300, 0);
  const centerY = clamp(geometry.y, -100, 300, 0);
  const width = clamp(geometry.width, 2, 120, 24);
  const height = clamp(geometry.height, 2, 120, 44);
  const rotation = clamp(geometry.rotation, -180, 180, 0);
  const curve = clamp(geometry.curve, 0, 1, 0.78);
  const skew = clamp(geometry.skew, -1, 1, 0);
  const exponent = 2 + curve * 2.4;

  return Array.from({ length: EYE_POINTS }, (_, index): Point => {
    const angle = (index / EYE_POINTS) * Math.PI * 2;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const localX =
      Math.sign(cosine) *
        Math.pow(Math.abs(cosine), 2 / exponent) *
        (width / 2) +
      sine * skew * (height / 5);
    const localY =
      Math.sign(sine) * Math.pow(Math.abs(sine), 2 / exponent) * (height / 2);
    const [rotatedX, rotatedY] = rotatePoint(localX, localY, rotation);
    return [round(centerX + rotatedX), round(centerY + rotatedY)];
  });
}

export function createEyePath(geometry: EyeGeometry = {}): string {
  const curve = clamp(geometry.curve, 0, 1, 0.78);
  return createClosedPath(createEyePoints(geometry), 0.82 + curve * 0.12);
}

export function createShapePath(shape: ShapeName | string = "circle"): string {
  const name: ShapeName = [
    "circle",
    "squircle",
    "blob",
    "pebble",
    "diamond",
  ].includes(shape)
    ? (shape as ShapeName)
    : "circle";
  const exponent = name === "squircle" ? 4.6 : name === "diamond" ? 1.12 : 2;

  const points = Array.from({ length: BODY_POINTS }, (_, index): Point => {
    const angle = (index / BODY_POINTS) * Math.PI * 2 - Math.PI / 2;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const unitX = Math.sign(cosine) * Math.pow(Math.abs(cosine), 2 / exponent);
    const unitY = Math.sign(sine) * Math.pow(Math.abs(sine), 2 / exponent);
    let radiusX = 88;
    let radiusY = 88;
    let offsetX = 0;
    let offsetY = 0;

    if (name === "blob") {
      const wobble =
        1 +
        Math.sin(angle * 3 + 0.7) * 0.045 +
        Math.cos(angle * 2 - 0.4) * 0.025;
      radiusX *= wobble;
      radiusY *= 1 / wobble;
      offsetY = 2;
    }

    if (name === "pebble") {
      radiusX = 90;
      radiusY = 76 + (sine < 0 ? 6 : -1);
      offsetX = sine * 4;
      offsetY = 6;
    }

    return [
      round(100 + offsetX + unitX * radiusX),
      round(100 + offsetY + unitY * radiusY),
    ];
  });

  return createClosedPath(
    centerPointLoop(points),
    name === "diamond" ? 0.28 : name === "squircle" ? 0.72 : 1,
  );
}

export function pathCommandCount(path: string): number {
  return path.match(/C/g)?.length ?? 0;
}
