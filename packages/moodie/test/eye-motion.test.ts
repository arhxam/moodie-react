import { describe, expect, it } from "vitest";

import { createEyeAnimationCue } from "../src/eye-motion";
import { EYE_ANIMATION_NAMES } from "../src/config";

describe("eye animation cues", () => {
  it("ships the complete secondary performance catalog", () => {
    expect(EYE_ANIMATION_NAMES).toEqual([
      "notice",
      "glance",
      "squint",
      "wide",
      "flutter",
      "roll",
      "vanish",
      "orbit",
      "doubleTake",
      "recoil",
      "droop",
      "shake",
    ]);
  });

  it("inherits the live pose and settles every cue at neutral", () => {
    for (const name of EYE_ANIMATION_NAMES) {
      const cue = createEyeAnimationCue(name, 1);
      const length = cue.x.length;

      expect(cue.x[0]).toBeNull();
      expect(cue.x.at(-1)).toBe(0);
      expect(cue.y[0]).toBeNull();
      expect(cue.y.at(-1)).toBe(0);
      expect(cue.scaleX[0]).toBeNull();
      expect(cue.scaleX.at(-1)).toBe(1);
      expect(cue.scaleY[0]).toBeNull();
      expect(cue.scaleY.at(-1)).toBe(1);
      expect(cue.rotate[0]).toBeNull();
      expect(cue.rotate.at(-1)).toBe(0);
      expect(cue.opacity[0]).toBeNull();
      expect(cue.opacity.at(-1)).toBe(1);
      expect(cue.y).toHaveLength(length);
      expect(cue.scaleX).toHaveLength(length);
      expect(cue.scaleY).toHaveLength(length);
      expect(cue.rotate).toHaveLength(length);
      expect(cue.opacity).toHaveLength(length);
      expect(cue.transition.times).toHaveLength(length);
      expect(cue.transition.duration).toBeGreaterThanOrEqual(0.28);
      expect(cue.transition.duration).toBeLessThanOrEqual(1.2);

      for (const track of [
        cue.x,
        cue.y,
        cue.scaleX,
        cue.scaleY,
        cue.rotate,
        cue.opacity,
      ]) {
        expect(track.slice(1).every(Number.isFinite)).toBe(true);
      }
      expect(
        (cue.x.slice(1) as number[]).every((value) => Math.abs(value) <= 20),
      ).toBe(true);
      expect(
        (cue.y.slice(1) as number[]).every((value) => Math.abs(value) <= 20),
      ).toBe(true);
      expect(
        (cue.rotate.slice(1) as number[]).every(
          (value) => Math.abs(value) <= 20,
        ),
      ).toBe(true);
      expect(
        ([...cue.scaleX.slice(1), ...cue.scaleY.slice(1)] as number[]).every(
          (value) => value >= 0 && value <= 2,
        ),
      ).toBe(true);
      expect(
        (cue.opacity.slice(1) as number[]).every(
          (value) => value >= 0 && value <= 1,
        ),
      ).toBe(true);
    }
  });

  it("scales movement and deformation without changing neutral geometry", () => {
    expect(createEyeAnimationCue("glance", 2).x).toEqual([null, -12, 8, 0]);
    expect(createEyeAnimationCue("wide", 2).scaleY).toEqual([
      null,
      1.32,
      1.24,
      1,
    ]);
    expect(createEyeAnimationCue("squint", 0).scaleY).toEqual([null, 1, 1, 1]);
  });

  it("keeps maximum-intensity deformation inside physical ranges", () => {
    for (const name of EYE_ANIMATION_NAMES) {
      const cue = createEyeAnimationCue(name, 2);
      expect(
        ([...cue.scaleX.slice(1), ...cue.scaleY.slice(1)] as number[]).every(
          (value) => value >= 0 && value <= 2,
        ),
      ).toBe(true);
      expect(
        (cue.opacity.slice(1) as number[]).every(
          (value) => value >= 0 && value <= 1,
        ),
      ).toBe(true);
    }
  });

  it("supports full disappearance and dimensional travel", () => {
    const vanish = createEyeAnimationCue("vanish", 1);
    const orbit = createEyeAnimationCue("orbit", 1);
    const hiddenFrames = vanish.opacity
      .map((opacity, index) => (opacity === 0 ? index : -1))
      .filter((index) => index >= 0);

    expect(vanish.opacity).toContain(0);
    expect(vanish.scaleX).toContain(0);
    expect(vanish.scaleY).toContain(0);
    expect(hiddenFrames).toHaveLength(2);
    expect(
      vanish.transition.times[hiddenFrames[1]] -
        vanish.transition.times[hiddenFrames[0]],
    ).toBeGreaterThanOrEqual(0.25);
    expect(vanish.transition.duration).toBeGreaterThanOrEqual(1);
    expect(
      Math.min(...(orbit.x.filter(Number.isFinite) as number[])),
    ).toBeLessThan(0);
    expect(
      Math.max(...(orbit.x.filter(Number.isFinite) as number[])),
    ).toBeGreaterThan(0);
    expect(
      Math.min(...(orbit.y.filter(Number.isFinite) as number[])),
    ).toBeLessThan(0);
  });
});
