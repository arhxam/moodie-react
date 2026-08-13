import { describe, expect, it } from "vitest";

import {
  createExpressionCue,
  createReactionCue,
  normalizeExpressionMotion,
} from "../src/expression-motion";
import { expressionPresets } from "../src/presets";

describe("expression motion", () => {
  it("normalizes shorthand and clamps unsafe performance values", () => {
    expect(normalizeExpressionMotion(false)).toMatchObject({ enabled: false });
    expect(
      normalizeExpressionMotion({
        intensity: 99,
        duration: 20,
        eyes: false,
      }),
    ).toEqual({
      enabled: true,
      intensity: 2,
      duration: 180,
      eyes: false,
      body: true,
    });
  });

  it("creates expressive four-stage eye cues from preset semantics", () => {
    const worried = createExpressionCue(
      expressionPresets.worried.performance,
      normalizeExpressionMotion({ intensity: 1.5, duration: 640 }),
    );
    const happy = createExpressionCue(
      expressionPresets.happy.performance,
      normalizeExpressionMotion({ intensity: 1 }),
    );

    expect(worried.transition.duration).toBe(0.64);
    expect(worried.x).toHaveLength(4);
    expect(worried.y).toHaveLength(4);
    expect(worried.x[1]).not.toBe(0);
    expect(worried.rotate[1]).not.toBe(0);
    expect(worried.x.at(-1)).toBe(0);
    expect(happy.scaleY[1]).toBeGreaterThan(1);
    expect(happy).not.toEqual(worried);
  });

  it("keeps energetic body reactions volume-safe", () => {
    const config = normalizeExpressionMotion({ intensity: 1.35 });
    const bounce = createReactionCue("bounce", config);
    const squash = createReactionCue("squash", config);

    expect(bounce).toHaveProperty("scale");
    expect(bounce.scaleX).toEqual([1, 1, 1, 1, 1]);
    expect(bounce.scaleY).toEqual([1, 1, 1, 1, 1]);
    expect(Math.min(...(bounce.scale as number[]))).toBeGreaterThanOrEqual(
      0.94,
    );

    const squashX = squash.scaleX as number[];
    const squashY = squash.scaleY as number[];
    expect(
      Math.max(
        ...squashX.map((value, index) => Math.abs(value - squashY[index])),
      ),
    ).toBeLessThan(0.14);
  });
});
