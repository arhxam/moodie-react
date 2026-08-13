import { describe, expect, it } from "vitest";

import { createEyeAnimationCue } from "../src/eye-motion";
import { EYE_ANIMATION_NAMES } from "../src/config";

describe("eye animation cues", () => {
  it("ships smooth neutral-to-neutral keyframes for every cue", () => {
    for (const name of EYE_ANIMATION_NAMES) {
      const cue = createEyeAnimationCue(name, 1);
      const length = cue.x.length;

      expect(cue.x[0]).toBe(0);
      expect(cue.x.at(-1)).toBe(0);
      expect(cue.y[0]).toBe(0);
      expect(cue.y.at(-1)).toBe(0);
      expect(cue.scaleX[0]).toBe(1);
      expect(cue.scaleX.at(-1)).toBe(1);
      expect(cue.scaleY[0]).toBe(1);
      expect(cue.scaleY.at(-1)).toBe(1);
      expect(cue.rotate[0]).toBe(0);
      expect(cue.rotate.at(-1)).toBe(0);
      expect(cue.y).toHaveLength(length);
      expect(cue.scaleX).toHaveLength(length);
      expect(cue.scaleY).toHaveLength(length);
      expect(cue.rotate).toHaveLength(length);
      expect(cue.transition.times).toHaveLength(length);
      expect(cue.transition.duration).toBeGreaterThanOrEqual(0.28);
      expect(cue.transition.duration).toBeLessThanOrEqual(0.72);
    }
  });

  it("scales movement and deformation without changing neutral geometry", () => {
    expect(createEyeAnimationCue("glance", 2).x).toEqual([0, -12, 8, 0]);
    expect(createEyeAnimationCue("wide", 2).scaleY).toEqual([1, 1.32, 1.24, 1]);
    expect(createEyeAnimationCue("squint", 0).scaleY).toEqual([1, 1, 1, 1]);
  });
});
