import {
  createClosedPath,
  createEyePoints,
  type EyeGeometry,
  type Point,
} from "./geometry";

export type SurfaceConfig = {
  enabled: boolean;
  perspective: number;
  edgeCompression: number;
  depth: number;
  bodyFollow: number;
  inertia: number;
  maxTurn: number;
  volumePreservation: number;
};

export const DEFAULT_SURFACE_CONFIG: SurfaceConfig = {
  enabled: true,
  perspective: 1,
  edgeCompression: 0.82,
  depth: 0.65,
  bodyFollow: 0.28,
  inertia: 0.4,
  maxTurn: 42,
  volumePreservation: 0.45,
};

export type SurfaceGaze = { x: number; y: number };

export type ProjectEyeInput = {
  geometry: EyeGeometry;
  side: -1 | 1;
  gaze: SurfaceGaze;
  rangeX: number;
  rangeY: number;
  eyeScale: number;
  eyeDistance: number;
  turn: number;
  surface: SurfaceConfig;
};

export type ProjectedEye = {
  path: string;
  center: Point;
  compression: number;
  depthScale: number;
  tangentScale: number;
  radialAxis: Point;
  turn: number;
};

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

const smootherstep = (edge0: number, edge1: number, value: number) => {
  const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1, 0);
  return amount * amount * amount * (amount * (amount * 6 - 15) + 10);
};

export function normalizeSurface(
  config: boolean | Partial<SurfaceConfig> = true,
): SurfaceConfig {
  if (typeof config === "boolean") {
    return { ...DEFAULT_SURFACE_CONFIG, enabled: config };
  }
  return {
    enabled: config.enabled ?? true,
    perspective: clamp(
      config.perspective,
      0,
      2,
      DEFAULT_SURFACE_CONFIG.perspective,
    ),
    edgeCompression: clamp(
      config.edgeCompression,
      0,
      1,
      DEFAULT_SURFACE_CONFIG.edgeCompression,
    ),
    depth: clamp(config.depth, 0, 1, DEFAULT_SURFACE_CONFIG.depth),
    bodyFollow: clamp(
      config.bodyFollow,
      0,
      1,
      DEFAULT_SURFACE_CONFIG.bodyFollow,
    ),
    inertia: clamp(config.inertia, 0, 1, DEFAULT_SURFACE_CONFIG.inertia),
    maxTurn: clamp(config.maxTurn, 0, 70, DEFAULT_SURFACE_CONFIG.maxTurn),
    volumePreservation: clamp(
      config.volumePreservation,
      0,
      1,
      DEFAULT_SURFACE_CONFIG.volumePreservation,
    ),
  };
}

/** Map linear input onto a bounded arc so movement eases naturally at edges. */
export function curvedTravel(value: number, perspective: number): number {
  const input = clamp(value, -1, 1, 0);
  const amount = clamp(perspective, 0, 2, 1);
  if (amount === 0 || input === 0) return input;
  const angle = (Math.PI / 2) * (0.55 + amount * 0.35);
  const curved = Math.sin(Math.abs(input) * angle) / Math.sin(angle);
  return round(Math.sign(input) * curved);
}

const transformPoint = (
  point: Point,
  sourceCenter: Point,
  targetCenter: Point,
  radialAxis: Point,
  compression: number,
  depthScale: number,
  tangentScale: number,
): Point => {
  const localX = (point[0] - sourceCenter[0]) * depthScale;
  const localY = (point[1] - sourceCenter[1]) * depthScale;
  const radial = localX * radialAxis[0] + localY * radialAxis[1];
  const radialX = radial * radialAxis[0];
  const radialY = radial * radialAxis[1];
  const tangentX = localX - radialX;
  const tangentY = localY - radialY;
  return [
    round(
      clamp(
        targetCenter[0] + tangentX * tangentScale + radialX * compression,
        0,
        200,
        100,
      ),
    ),
    round(
      clamp(
        targetCenter[1] + tangentY * tangentScale + radialY * compression,
        0,
        200,
        100,
      ),
    ),
  ];
};

/**
 * Project one eye onto an inferred curved face surface.
 *
 * Radial compression rotates with gaze, so top/bottom movement compresses
 * height while left/right movement compresses width. Each eye receives a
 * small side-dependent depth bias to avoid the flat sticker effect.
 */
export function projectEyeOnSurface(input: ProjectEyeInput): ProjectedEye {
  const gazeX = clamp(input.gaze.x, -1, 1, 0);
  const gazeY = clamp(input.gaze.y, -1, 1, 0);
  const enabled = input.surface.enabled;
  const perspective = enabled ? input.surface.perspective : 0;
  const edgeCompression = enabled ? input.surface.edgeCompression : 0;
  const depth = enabled ? input.surface.depth : 0;
  const rangeX = clamp(input.rangeX, 0, 30, 0);
  const rangeY = clamp(input.rangeY, 0, 24, 0);
  const eyeScale = clamp(input.eyeScale, 0.4, 2, 1);
  const eyeDistance = clamp(input.eyeDistance, 0.5, 1.8, 1);
  const sourceX = clamp(
    input.geometry.x,
    -100,
    300,
    input.side === -1 ? 72 : 128,
  );
  const sourceY = clamp(input.geometry.y, -100, 300, 96);
  const dynamicTurn = gazeX * input.surface.maxTurn * Math.min(1, perspective);
  const resolvedTurn = clamp(input.turn + dynamicTurn, -88, 88, 0);
  const yawDepth = Math.max(0.12, Math.cos((resolvedTurn * Math.PI) / 180));
  const baseCenter: Point = [
    round(
      100 +
        (sourceX - 100) * eyeDistance * yawDepth +
        Math.sin((resolvedTurn * Math.PI) / 180) * 9,
    ),
    sourceY,
  ];
  const targetCenter: Point = [
    round(baseCenter[0] + curvedTravel(gazeX, perspective) * rangeX),
    round(baseCenter[1] + curvedTravel(gazeY, perspective) * rangeY),
  ];
  const magnitude = Math.hypot(gazeX, gazeY);
  const radialAxis: Point =
    magnitude > 0.0001
      ? [round(gazeX / magnitude), round(gazeY / magnitude)]
      : [1, 0];
  const directionalMagnitude = Math.min(
    1,
    (Math.abs(gazeX) ** 4 + Math.abs(gazeY) ** 4) ** 0.25,
  );
  const edgeAmount = smootherstep(0.14, 1, directionalMagnitude);
  const sideDepth = input.side * gazeX * depth;
  const compression = clamp(
    1 - edgeCompression * edgeAmount * 0.4 * (1 + sideDepth * 0.1),
    0.5,
    1,
    1,
  );
  const tangentScale = clamp(
    1 + (1 - compression) * input.surface.volumePreservation * 0.32,
    1,
    1.12,
    1,
  );
  const depthScale = clamp(
    1 - depth * edgeAmount * (0.045 + Math.max(0, input.side * gazeX) * 0.055),
    0.82,
    1,
    1,
  );
  const points = createEyePoints({
    ...input.geometry,
    x: baseCenter[0],
    y: baseCenter[1],
    width:
      clamp(input.geometry.width, 2, 120, 24) *
      eyeScale *
      (1 - (1 - yawDepth) * depth * 0.2),
    height: clamp(input.geometry.height, 2, 120, 44) * eyeScale,
    rotation:
      clamp(input.geometry.rotation, -180, 180, 0) +
      gazeX * 3.2 -
      gazeY * input.side * 1.4,
  });
  const projected = points.map((point) =>
    transformPoint(
      point,
      baseCenter,
      targetCenter,
      radialAxis,
      compression,
      depthScale,
      tangentScale,
    ),
  );
  const curve = clamp(input.geometry.curve, 0, 1, 0.78);

  return {
    path: createClosedPath(projected, 0.82 + curve * 0.12),
    center: targetCenter,
    compression: round(compression),
    depthScale: round(depthScale),
    tangentScale: round(tangentScale),
    radialAxis,
    turn: round(resolvedTurn),
  };
}
