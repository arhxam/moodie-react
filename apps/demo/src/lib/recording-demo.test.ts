import { describe, expect, it } from "vitest";

import { INITIAL_CONFIG } from "./playground";
import {
  RECORDING_SHAPE_ORDER,
  SQUARE_EYE_DISTANCE,
  SQUARE_EYE_SCALE,
  applyRecordingShape,
} from "./recording-demo";

describe("recording demo configuration", () => {
  it("converts the opening circle directly into a square", () => {
    expect(RECORDING_SHAPE_ORDER.slice(0, 2)).toEqual(["circle", "square"]);
  });

  it("fits the eyes when the recording reaches square", () => {
    const result = applyRecordingShape(
      {
        ...INITIAL_CONFIG,
        pointerStrength: 1.8,
        damping: 31,
      },
      "square",
    );

    expect(result).toMatchObject({
      shape: "square",
      eyeScale: SQUARE_EYE_SCALE,
      eyeDistance: SQUARE_EYE_DISTANCE,
      pointerStrength: 1.8,
      damping: 31,
    });
  });

  it("preserves tuned eye geometry for every other shape", () => {
    const result = applyRecordingShape(
      { ...INITIAL_CONFIG, eyeScale: 1.14, eyeDistance: 1.08 },
      "cloud",
    );

    expect(result).toMatchObject({
      shape: "cloud",
      eyeScale: 1.14,
      eyeDistance: 1.08,
    });
  });
});
