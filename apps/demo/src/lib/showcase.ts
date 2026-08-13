import type { EyeAnimationName, GazePoint, ShapeName } from "@moodie/react";

import type { PlaygroundConfig } from "./playground";

export type ShowcaseStep = {
  expression: string;
  shape: ShapeName;
  color: string;
  eyeColor: string;
  gaze: GazePoint;
  eyeScale: number;
  eyeDistance: number;
  cue: EyeAnimationName;
  hold: number;
};

export const SHOWCASE_PAUSE_MS = 6200;

export const SHOWCASE_STEPS = [
  {
    expression: "excited",
    shape: "circle",
    color: "#dfff5b",
    eyeColor: "#151515",
    gaze: { x: 0, y: -0.12 },
    eyeScale: 1,
    eyeDistance: 1,
    cue: "notice",
    hold: 1900,
  },
  {
    expression: "cheeky",
    shape: "squircle",
    color: "#ff735c",
    eyeColor: "#271116",
    gaze: { x: -0.82, y: -0.22 },
    eyeScale: 1.08,
    eyeDistance: 1.08,
    cue: "roll",
    hold: 2100,
  },
  {
    expression: "surprised",
    shape: "blob",
    color: "#ffdc57",
    eyeColor: "#211708",
    gaze: { x: 0.78, y: -0.48 },
    eyeScale: 1.22,
    eyeDistance: 1.12,
    cue: "recoil",
    hold: 1850,
  },
  {
    expression: "sleepy",
    shape: "cloud",
    color: "#b9a2ff",
    eyeColor: "#1c123d",
    gaze: { x: -0.62, y: 0.42 },
    eyeScale: 0.86,
    eyeDistance: 0.92,
    cue: "droop",
    hold: 2200,
  },
  {
    expression: "curious",
    shape: "diamond",
    color: "#68efbc",
    eyeColor: "#102a24",
    gaze: { x: 0.88, y: 0.12 },
    eyeScale: 1.12,
    eyeDistance: 1.16,
    cue: "doubleTake",
    hold: 1950,
  },
  {
    expression: "thinking",
    shape: "drop",
    color: "#ff63aa",
    eyeColor: "#321020",
    gaze: { x: 0.08, y: -0.8 },
    eyeScale: 0.92,
    eyeDistance: 1.2,
    cue: "orbit",
    hold: 2250,
  },
  {
    expression: "focused",
    shape: "hexagon",
    color: "#ff984d",
    eyeColor: "#2c1608",
    gaze: { x: -0.9, y: -0.38 },
    eyeScale: 0.84,
    eyeDistance: 0.84,
    cue: "shake",
    hold: 1850,
  },
  {
    expression: "love",
    shape: "pebble",
    color: "#65e7ff",
    eyeColor: "#10262c",
    gaze: { x: 0.58, y: 0.52 },
    eyeScale: 1.18,
    eyeDistance: 1.04,
    cue: "wide",
    hold: 2100,
  },
  {
    expression: "calm",
    shape: "oval",
    color: "#f4f0e8",
    eyeColor: "#171717",
    gaze: { x: -0.25, y: 0.08 },
    eyeScale: 0.96,
    eyeDistance: 0.96,
    cue: "vanish",
    hold: 1900,
  },
] as const satisfies readonly ShowcaseStep[];

export function nextShowcaseIndex(index: number) {
  return (index + 1) % SHOWCASE_STEPS.length;
}

export function applyShowcaseStep(
  config: PlaygroundConfig,
  step: ShowcaseStep,
): PlaygroundConfig {
  return {
    ...config,
    expression: step.expression,
    shape: step.shape,
    color: step.color,
    eyeColor: step.eyeColor,
    eyeScale: step.eyeScale,
    eyeDistance: step.eyeDistance,
  };
}
