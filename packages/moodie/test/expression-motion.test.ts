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
      anticipation: 0.35,
      overshoot: 0.25,
      stagger: 22,
    });
  });

  it("creates expressive five-stage eye cues with anticipation and overshoot", () => {
    const worried = createExpressionCue(
      expressionPresets.worried.performance,
      normalizeExpressionMotion({
        intensity: 1.5,
        duration: 640,
        anticipation: 0.5,
        overshoot: 0.4,
      }),
    );
    const happy = createExpressionCue(
      expressionPresets.happy.performance,
      normalizeExpressionMotion({ intensity: 1 }),
    );

    expect(worried.transition.duration).toBe(0.64);
    expect(worried.x).toHaveLength(5);
    expect(worried.y).toHaveLength(5);
    expect(Math.sign(worried.x[1])).toBe(-Math.sign(worried.x[2]));
    expect(Math.abs(worried.x[3])).toBeLessThan(Math.abs(worried.x[2]));
    expect(worried.rotate[2]).not.toBe(0);
    expect(worried.x.at(-1)).toBe(0);
    expect(happy.scaleY[2]).toBeGreaterThan(1);
    expect(happy).not.toEqual(worried);
  });

  it("applies eye stagger only to the explicit expression cue", () => {
    const config = normalizeExpressionMotion({ stagger: 48 });
    const lead = createExpressionCue(
      expressionPresets.curious.performance,
      config,
    );
    const follow = createExpressionCue(
      expressionPresets.curious.performance,
      config,
      config.stagger,
    );

    expect(lead.transition.delay).toBe(0);
    expect(follow.transition.delay).toBe(0.048);
  });

  it("clamps choreography controls to deformation-safe ranges", () => {
    expect(
      normalizeExpressionMotion({
        anticipation: 9,
        overshoot: -4,
        stagger: 900,
      }),
    ).toMatchObject({ anticipation: 1, overshoot: 0, stagger: 120 });
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
