import { describe, expect, it } from "vitest";

import { INITIAL_CONFIG } from "./playground";
import {
  SHOWCASE_STEPS,
  applyShowcaseStep,
  nextShowcaseIndex,
} from "./showcase";

function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: string) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

describe("playground showcase", () => {
  it("opens on the first authored visual state", () => {
    expect(SHOWCASE_STEPS.length).toBeGreaterThanOrEqual(8);
    expect(INITIAL_CONFIG).toMatchObject({
      expression: SHOWCASE_STEPS[0].expression,
      shape: SHOWCASE_STEPS[0].shape,
      color: SHOWCASE_STEPS[0].color,
      eyeColor: SHOWCASE_STEPS[0].eyeColor,
      eyeScale: SHOWCASE_STEPS[0].eyeScale,
      eyeDistance: SHOWCASE_STEPS[0].eyeDistance,
    });
  });

  it("keeps every authored value inside the public API bounds", () => {
    for (const step of SHOWCASE_STEPS) {
      expect(step.gaze.x).toBeGreaterThanOrEqual(-1);
      expect(step.gaze.x).toBeLessThanOrEqual(1);
      expect(step.gaze.y).toBeGreaterThanOrEqual(-1);
      expect(step.gaze.y).toBeLessThanOrEqual(1);
      expect(step.eyeScale).toBeGreaterThanOrEqual(0.7);
      expect(step.eyeScale).toBeLessThanOrEqual(1.3);
      expect(step.eyeDistance).toBeGreaterThanOrEqual(0.75);
      expect(step.eyeDistance).toBeLessThanOrEqual(1.25);
      expect(step.hold).toBeGreaterThanOrEqual(1400);
      expect(step.hold).toBeLessThanOrEqual(2600);
      expect(contrast(step.eyeColor, step.color)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("wraps the sequence without indexing outside it", () => {
    expect(nextShowcaseIndex(0)).toBe(1);
    expect(nextShowcaseIndex(SHOWCASE_STEPS.length - 1)).toBe(0);
  });

  it("changes only visual showcase fields", () => {
    const current = {
      ...INITIAL_CONFIG,
      damping: 31,
      pointerStrength: 1.8,
      surfaceDepth: 0.9,
    };

    const next = applyShowcaseStep(current, SHOWCASE_STEPS[1]);

    expect(next).toMatchObject({
      expression: SHOWCASE_STEPS[1].expression,
      shape: SHOWCASE_STEPS[1].shape,
      color: SHOWCASE_STEPS[1].color,
      eyeColor: SHOWCASE_STEPS[1].eyeColor,
      eyeScale: SHOWCASE_STEPS[1].eyeScale,
      eyeDistance: SHOWCASE_STEPS[1].eyeDistance,
      damping: 31,
      pointerStrength: 1.8,
      surfaceDepth: 0.9,
    });
  });
});
