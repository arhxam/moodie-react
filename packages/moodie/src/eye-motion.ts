import type { EyeAnimationName } from "./config";

export type EyeAnimationKeyframe = number | null;

export type EyeAnimationCue = {
  x: EyeAnimationKeyframe[];
  y: EyeAnimationKeyframe[];
  scaleX: EyeAnimationKeyframe[];
  scaleY: EyeAnimationKeyframe[];
  rotate: EyeAnimationKeyframe[];
  opacity: EyeAnimationKeyframe[];
  transition: {
    duration: number;
    times: number[];
    ease: readonly [number, number, number, number];
  };
};

type EyeCueDefinition = {
  x: number[];
  y: number[];
  scaleX: number[];
  scaleY: number[];
  rotate: number[];
  opacity: number[];
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
    opacity: [1, 1, 1, 1],
    duration: 0.48,
    times: [0, 0.28, 0.64, 1],
  },
  glance: {
    x: [0, -6, 4, 0],
    y: [0, -0.8, 0.4, 0],
    scaleX: [1, 0.98, 1.02, 1],
    scaleY: [1, 1.03, 1.01, 1],
    rotate: [0, -1.2, 0.8, 0],
    opacity: [1, 1, 1, 1],
    duration: 0.62,
    times: [0, 0.22, 0.62, 1],
  },
  squint: {
    x: [0, 0, 0, 0],
    y: [0, 1.6, 0.6, 0],
    scaleX: [1, 1.06, 1.03, 1],
    scaleY: [1, 0.68, 0.82, 1],
    rotate: [0, 0.8, -0.4, 0],
    opacity: [1, 1, 1, 1],
    duration: 0.46,
    times: [0, 0.32, 0.68, 1],
  },
  wide: {
    x: [0, 0, 0, 0],
    y: [0, -1.6, -0.8, 0],
    scaleX: [1, 0.96, 0.98, 1],
    scaleY: [1, 1.16, 1.12, 1],
    rotate: [0, 0, 0, 0],
    opacity: [1, 1, 1, 1],
    duration: 0.42,
    times: [0, 0.3, 0.66, 1],
  },
  flutter: {
    x: [0, 0, 0, 0, 0, 0],
    y: [0, 0.6, 0, 0.45, 0, 0],
    scaleX: [1, 1.02, 1, 1.015, 1, 1],
    scaleY: [1, 0.38, 1, 0.52, 1, 1],
    rotate: [0, -0.5, 0, 0.4, 0, 0],
    opacity: [1, 1, 1, 1, 1, 1],
    duration: 0.56,
    times: [0, 0.16, 0.36, 0.54, 0.78, 1],
  },
  roll: {
    x: [0, -2, 4.5, 5.5, -1.5, 0],
    y: [0, -5.5, -7, -2, 1, 0],
    scaleX: [1, 0.96, 1.02, 1.04, 0.98, 1],
    scaleY: [1, 0.92, 0.98, 1.04, 1.01, 1],
    rotate: [0, -4, 5, 7, -2, 0],
    opacity: [1, 1, 1, 1, 1, 1],
    duration: 0.82,
    times: [0, 0.15, 0.34, 0.56, 0.78, 1],
  },
  vanish: {
    x: [0, 0, 0, 0, 0, 0, 0, 0],
    y: [0, 1, 2, 2, 2, -1.5, 0.5, 0],
    scaleX: [1, 0.9, 0.45, 0.05, 0, 0.18, 1.08, 1],
    scaleY: [1, 1.05, 0.32, 0.04, 0, 0.22, 1.08, 1],
    rotate: [0, -1, 1, 0, 0, 0, -1, 0],
    opacity: [1, 1, 0.55, 0.08, 0, 0, 0.72, 1],
    duration: 1.02,
    times: [0, 0.1, 0.22, 0.34, 0.44, 0.72, 0.88, 1],
  },
  orbit: {
    x: [0, -5, -7, 0, 7, 5, 0],
    y: [0, -1, -6, -8, -5, 1, 0],
    scaleX: [1, 0.97, 0.94, 1, 1.05, 1.02, 1],
    scaleY: [1, 1.02, 0.96, 0.94, 0.98, 1.03, 1],
    rotate: [0, -4, -7, 0, 7, 4, 0],
    opacity: [1, 1, 1, 1, 1, 1, 1],
    duration: 0.94,
    times: [0, 0.14, 0.29, 0.46, 0.64, 0.82, 1],
  },
  doubleTake: {
    x: [0, 7, 7, -4, 1, 0],
    y: [0, -1, -1, 0.5, -0.2, 0],
    scaleX: [1, 0.94, 1.06, 0.97, 1.02, 1],
    scaleY: [1, 1.08, 1.02, 0.98, 1.01, 1],
    rotate: [0, 2, 1, -2, 0.5, 0],
    opacity: [1, 1, 1, 1, 1, 1],
    duration: 0.76,
    times: [0, 0.14, 0.3, 0.52, 0.75, 1],
  },
  recoil: {
    x: [0, 0, 0, 0, 0],
    y: [0, 2, 4, -1, 0],
    scaleX: [1, 0.86, 1.14, 0.97, 1],
    scaleY: [1, 1.22, 0.9, 1.04, 1],
    rotate: [0, 0, 0, 0, 0],
    opacity: [1, 1, 1, 1, 1],
    duration: 0.56,
    times: [0, 0.16, 0.38, 0.68, 1],
  },
  droop: {
    x: [0, 0, 0, 0, 0, 0],
    y: [0, 3.5, 5, 4, 1, 0],
    scaleX: [1, 1.04, 1.08, 1.05, 1.01, 1],
    scaleY: [1, 0.78, 0.68, 0.72, 0.92, 1],
    rotate: [0, 1, 2, 1.5, 0.5, 0],
    opacity: [1, 0.9, 0.76, 0.8, 0.95, 1],
    duration: 0.92,
    times: [0, 0.2, 0.42, 0.62, 0.82, 1],
  },
  shake: {
    x: [0, -4, 4, -3, 3, -1.5, 0.5, 0],
    y: [0, 0.4, -0.4, 0.3, -0.3, 0.2, -0.1, 0],
    scaleX: [1, 0.98, 1.02, 0.98, 1.02, 0.99, 1.01, 1],
    scaleY: [1, 1.02, 0.98, 1.02, 0.98, 1.01, 0.99, 1],
    rotate: [0, -3, 3, -2, 2, -1, 0.5, 0],
    opacity: [1, 1, 1, 1, 1, 1, 1, 1],
    duration: 0.62,
    times: [0, 0.11, 0.24, 0.38, 0.53, 0.69, 0.84, 1],
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const scaleDelta = (values: number[], intensity: number) =>
  values.map((value) =>
    Number(clamp(1 + (value - 1) * intensity, 0, 2).toFixed(4)),
  );

const scaleOpacity = (values: number[], intensity: number) =>
  values.map((value) =>
    Number(clamp(1 + (value - 1) * intensity, 0, 1).toFixed(4)),
  );

const scaleMovement = (values: number[], intensity: number) =>
  values.map((value) => Number((value * intensity).toFixed(4)));

const inheritCurrent = (values: number[]): EyeAnimationKeyframe[] =>
  values.map((value, index) => (index === 0 ? null : value));

export const createEyeAnimationCue = (
  name: EyeAnimationName,
  intensity = 1,
): EyeAnimationCue => {
  const amount = clamp(intensity, 0, 2);
  const cue = EYE_CUES[name];
  return {
    x: inheritCurrent(scaleMovement(cue.x, amount)),
    y: inheritCurrent(scaleMovement(cue.y, amount)),
    scaleX: inheritCurrent(scaleDelta(cue.scaleX, amount)),
    scaleY: inheritCurrent(scaleDelta(cue.scaleY, amount)),
    rotate: inheritCurrent(scaleMovement(cue.rotate, amount)),
    opacity: inheritCurrent(scaleOpacity(cue.opacity, amount)),
    transition: {
      duration: cue.duration,
      times: [...cue.times],
      ease: [0.22, 1, 0.36, 1],
    },
  };
};
