import type { EyeAnimationName } from "./config";

export type EyeAnimationCue = {
  x: number[];
  y: number[];
  scaleX: number[];
  scaleY: number[];
  rotate: number[];
  transition: {
    duration: number;
    times: number[];
    ease: readonly [number, number, number, number];
  };
};

type EyeCueDefinition = Omit<EyeAnimationCue, "transition"> & {
  duration: number;
  times: number[];
};

const EYE_CUES: Record<EyeAnimationName, EyeCueDefinition> = {
  notice: {
    x: [0, 0, 0, 0],
    y: [0, -2.8, -1.2, 0],
    scaleX: [1, 1.04, 1.02, 1],
    scaleY: [1, 1.18, 1.1, 1],
    rotate: [0, -1.5, 0.7, 0],
    duration: 0.48,
    times: [0, 0.28, 0.64, 1],
  },
  glance: {
    x: [0, -6, 4, 0],
    y: [0, -0.8, 0.4, 0],
    scaleX: [1, 0.98, 1.02, 1],
    scaleY: [1, 1.03, 1.01, 1],
    rotate: [0, -1.2, 0.8, 0],
    duration: 0.62,
    times: [0, 0.22, 0.62, 1],
  },
  squint: {
    x: [0, 0, 0, 0],
    y: [0, 1.6, 0.6, 0],
    scaleX: [1, 1.06, 1.03, 1],
    scaleY: [1, 0.68, 0.82, 1],
    rotate: [0, 0.8, -0.4, 0],
    duration: 0.46,
    times: [0, 0.32, 0.68, 1],
  },
  wide: {
    x: [0, 0, 0, 0],
    y: [0, -1.6, -0.8, 0],
    scaleX: [1, 0.96, 0.98, 1],
    scaleY: [1, 1.16, 1.12, 1],
    rotate: [0, 0, 0, 0],
    duration: 0.42,
    times: [0, 0.3, 0.66, 1],
  },
  flutter: {
    x: [0, 0, 0, 0, 0, 0],
    y: [0, 0.6, 0, 0.45, 0, 0],
    scaleX: [1, 1.02, 1, 1.015, 1, 1],
    scaleY: [1, 0.38, 1, 0.52, 1, 1],
    rotate: [0, -0.5, 0, 0.4, 0, 0],
    duration: 0.56,
    times: [0, 0.16, 0.36, 0.54, 0.78, 1],
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const scaleDelta = (values: number[], intensity: number) =>
  values.map((value) => Number((1 + (value - 1) * intensity).toFixed(4)));

const scaleMovement = (values: number[], intensity: number) =>
  values.map((value) => Number((value * intensity).toFixed(4)));

export const createEyeAnimationCue = (
  name: EyeAnimationName,
  intensity = 1,
): EyeAnimationCue => {
  const amount = clamp(intensity, 0, 2);
  const cue = EYE_CUES[name];
  return {
    x: scaleMovement(cue.x, amount),
    y: scaleMovement(cue.y, amount),
    scaleX: scaleDelta(cue.scaleX, amount),
    scaleY: scaleDelta(cue.scaleY, amount),
    rotate: scaleMovement(cue.rotate, amount),
    transition: {
      duration: cue.duration,
      times: [...cue.times],
      ease: [0.22, 1, 0.36, 1],
    },
  };
};
