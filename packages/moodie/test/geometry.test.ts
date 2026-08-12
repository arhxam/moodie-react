import { describe, expect, it } from "vitest";

import {
  createClosedPath,
  createEyePath,
  createShapePath,
  pathCommandCount,
} from "../src/geometry";

describe("geometry", () => {
  it("creates deterministic closed cubic paths", () => {
    const path = createClosedPath([
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ]);

    expect(path).toMatch(/^M/);
    expect(path).toContain("C");
    expect(path.endsWith("Z")).toBe(true);
    expect(
      createClosedPath([
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
      ]),
    ).toBe(path);
  });

  it("keeps path topology stable across every body shape", () => {
    const paths = ["circle", "squircle", "blob", "pebble", "diamond"].map(
      (shape) => createShapePath(shape),
    );

    expect(new Set(paths.map(pathCommandCount))).toEqual(new Set([16]));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("keeps path topology stable across eye geometry", () => {
    const upright = createEyePath({ width: 22, height: 48, rotation: -8 });
    const sleepy = createEyePath({
      width: 42,
      height: 8,
      rotation: 5,
      curve: 0.5,
    });

    expect(pathCommandCount(upright)).toBe(12);
    expect(pathCommandCount(sleepy)).toBe(12);
    expect(upright).not.toBe(sleepy);
  });

  it("clamps unsafe geometry values to valid paths", () => {
    const path = createEyePath({
      width: -100,
      height: Number.POSITIVE_INFINITY,
      curve: 9,
    });

    expect(path).not.toContain("NaN");
    expect(path).not.toContain("Infinity");
  });
});
