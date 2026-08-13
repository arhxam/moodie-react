import type { ShapeName } from "@moodie/react";

import { BODY_SHAPES, type PlaygroundConfig } from "./playground";

export const SQUARE_EYE_SCALE = 0.82;
export const SQUARE_EYE_DISTANCE = 0.9;

export const RECORDING_SHAPE_ORDER: readonly ShapeName[] = [
  "circle",
  "square",
  ...BODY_SHAPES.filter((shape) => shape !== "circle" && shape !== "square"),
];

export function applyRecordingShape(
  config: PlaygroundConfig,
  shape: ShapeName,
): PlaygroundConfig {
  if (shape !== "square") return { ...config, shape };

  return {
    ...config,
    shape,
    eyeScale: SQUARE_EYE_SCALE,
    eyeDistance: SQUARE_EYE_DISTANCE,
  };
}
