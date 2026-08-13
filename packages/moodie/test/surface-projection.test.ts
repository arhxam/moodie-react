import { describe, expect, it } from "vitest";

import { pathCommandCount } from "../src/geometry";
import {
  curvedTravel,
  normalizeSurface,
  projectEyeOnSurface,
} from "../src/surface-projection";

const geometry = {
  x: 72,
  y: 78,
  width: 23,
  height: 46,
  rotation: -8,
  curve: 0.8,
};

const project = (gaze: { x: number; y: number }, side: -1 | 1 = -1) =>
  projectEyeOnSurface({
    geometry: { ...geometry, x: side === -1 ? 72 : 128 },
    side,
    gaze,
    rangeX: 30,
    rangeY: 24,
    eyeScale: 1,
    eyeDistance: 1,
    turn: 0,
    surface: normalizeSurface(true),
  });

const coordinates = (path: string) =>
  path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];

describe("surface projection", () => {
  it("normalizes defaults, shorthand flags, and unsafe values", () => {
    expect(normalizeSurface(false)).toMatchObject({
      enabled: false,
      perspective: 1,
      edgeCompression: 0.82,
      depth: 0.65,
      bodyFollow: 0.28,
      inertia: 0.4,
      maxTurn: 42,
      volumePreservation: 0.45,
    });
    expect(
      normalizeSurface({
        perspective: 99,
        edgeCompression: -1,
        depth: Number.POSITIVE_INFINITY,
        bodyFollow: 8,
        inertia: -4,
        maxTurn: 200,
        volumePreservation: 9,
      }),
    ).toMatchObject({
      perspective: 2,
      edgeCompression: 0,
      depth: 0.65,
      bodyFollow: 1,
      inertia: 0,
      maxTurn: 70,
      volumePreservation: 1,
    });
  });

  it("uses curved travel that eases into either edge", () => {
    expect(curvedTravel(0, 1)).toBe(0);
    expect(curvedTravel(0.5, 1)).toBeGreaterThan(0.5);
    expect(curvedTravel(1, 1)).toBe(1);
    expect(curvedTravel(-1, 1)).toBe(-1);
  });

  it("preserves topology and neutral eye geometry at center", () => {
    const center = project({ x: 0, y: 0 });

    expect(pathCommandCount(center.path)).toBe(12);
    expect(center.compression).toBe(1);
    expect(center.depthScale).toBe(1);
    expect(center.tangentScale).toBe(1);
    expect(center.center[0]).toBeCloseTo(72, 2);
    expect(center.center[1]).toBeCloseTo(78, 2);
  });

  it("compresses along the radial axis at horizontal and vertical edges", () => {
    const right = project({ x: 1, y: 0 });
    const bottom = project({ x: 0, y: 1 });

    expect(right.compression).toBeGreaterThan(0.6);
    expect(right.compression).toBeLessThan(0.8);
    expect(Math.abs(right.radialAxis[0])).toBeGreaterThan(0.99);
    expect(Math.abs(right.radialAxis[1])).toBeLessThan(0.01);
    expect(bottom.compression).toBeGreaterThan(0.6);
    expect(bottom.compression).toBeLessThan(0.8);
    expect(Math.abs(bottom.radialAxis[0])).toBeLessThan(0.01);
    expect(Math.abs(bottom.radialAxis[1])).toBeGreaterThan(0.99);
    expect(right.path).not.toBe(bottom.path);
  });

  it("compresses and depth-scales the eye nearer a horizontal edge more", () => {
    const far = project({ x: 1, y: 0 }, -1);
    const near = project({ x: 1, y: 0 }, 1);

    expect(near.compression).toBeLessThan(far.compression);
    expect(near.compression).toBeGreaterThan(0.6);
    expect(near.depthScale).toBeLessThan(far.depthScale);
    expect(near.tangentScale).toBeGreaterThan(1);
    expect(near.tangentScale).toBeLessThanOrEqual(1.12);
  });

  it("makes volume preservation configurable and bounded", () => {
    const withoutVolume = projectEyeOnSurface({
      geometry,
      side: 1,
      gaze: { x: 1, y: 0 },
      rangeX: 30,
      rangeY: 24,
      eyeScale: 1,
      eyeDistance: 1,
      turn: 0,
      surface: normalizeSurface({ volumePreservation: 0 }),
    });
    const maximumVolume = projectEyeOnSurface({
      geometry,
      side: 1,
      gaze: { x: 1, y: 0 },
      rangeX: 30,
      rangeY: 24,
      eyeScale: 1,
      eyeDistance: 1,
      turn: 0,
      surface: normalizeSurface({ volumePreservation: 1 }),
    });

    expect(withoutVolume.tangentScale).toBe(1);
    expect(maximumVolume.tangentScale).toBeGreaterThan(1);
    expect(maximumVolume.tangentScale).toBeLessThanOrEqual(1.12);
  });

  it("changes continuously when diagonal gaze crosses its dominant axis", () => {
    const horizontalDominant = project({ x: 0.7, y: 0.69 }, 1);
    const verticalDominant = project({ x: 0.69, y: 0.7 }, 1);

    expect(
      Math.abs(horizontalDominant.compression - verticalDominant.compression),
    ).toBeLessThan(0.02);
    expect(
      Math.abs(horizontalDominant.tangentScale - verticalDominant.tangentScale),
    ).toBeLessThan(0.02);
  });

  it("keeps extreme corner projections finite and inside the view box", () => {
    const corner = projectEyeOnSurface({
      geometry,
      side: -1,
      gaze: { x: 99, y: -99 },
      rangeX: 99,
      rangeY: 99,
      eyeScale: 99,
      eyeDistance: 99,
      turn: 999,
      surface: normalizeSurface({
        perspective: 2,
        edgeCompression: 1,
        depth: 1,
        maxTurn: 70,
      }),
    });
    const values = coordinates(corner.path);

    expect(pathCommandCount(corner.path)).toBe(12);
    expect(values.every(Number.isFinite)).toBe(true);
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...values)).toBeLessThanOrEqual(200);
  });
});
