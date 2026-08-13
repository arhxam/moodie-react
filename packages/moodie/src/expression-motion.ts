import type { ExpressionPerformance, ReactionName } from "./presets";

export type ExpressionMotionConfig = {
  enabled: boolean;
  intensity: number;
  duration: number;
  eyes: boolean;
  body: boolean;
  anticipation: number;
  overshoot: number;
  stagger: number;
};

export const DEFAULT_EXPRESSION_MOTION: ExpressionMotionConfig = {
  enabled: true,
  intensity: 1.35,
  duration: 620,
  eyes: true,
  body: true,
  anticipation: 0.35,
  overshoot: 0.25,
  stagger: 22,
};

export type ExpressionCue = {
  x: number[];
  y: number[];
  rotate: number[];
  scaleX: number[];
  scaleY: number[];
  transition: {
    duration: number;
    times: number[];
    ease: readonly [number, number, number, number];
  };
};

export type ReactionCue = Partial<
  Record<"x" | "y" | "rotate" | "scale" | "scaleX" | "scaleY", number[]>
> & {
  transition: ExpressionCue["transition"];
};

const clamp = (
  value: number | undefined,
  min: number,
  max: number,
  fallback: number,
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
};

export function normalizeExpressionMotion(
  config: boolean | Partial<ExpressionMotionConfig> = true,
): ExpressionMotionConfig {
  if (typeof config === "boolean") {
    return { ...DEFAULT_EXPRESSION_MOTION, enabled: config };
  }

  return {
    enabled: config.enabled ?? true,
    intensity: clamp(
      config.intensity,
      0,
      2,
      DEFAULT_EXPRESSION_MOTION.intensity,
    ),
    duration: clamp(
      config.duration,
      180,
      1200,
      DEFAULT_EXPRESSION_MOTION.duration,
    ),
    eyes: config.eyes ?? true,
    body: config.body ?? true,
    anticipation: clamp(
      config.anticipation,
      0,
      1,
      DEFAULT_EXPRESSION_MOTION.anticipation,
    ),
    overshoot: clamp(
      config.overshoot,
      0,
      1,
      DEFAULT_EXPRESSION_MOTION.overshoot,
    ),
    stagger: clamp(config.stagger, 0, 120, DEFAULT_EXPRESSION_MOTION.stagger),
  };
}

const scaleValues = (values: number[], rest: number, intensity: number) =>
  values.map((value) => rest + (value - rest) * intensity);

const anticipate = (
  target: number,
  rest: number,
  amount: number,
  factor = 0.22,
) => rest - (target - rest) * amount * factor;

const overshoot = (
  target: number,
  rest: number,
  amount: number,
  factor = 0.18,
) => rest - (target - rest) * amount * factor;

/** Build a deterministic glance-and-settle performance for an expression. */
export function createExpressionCue(
  performance: ExpressionPerformance | undefined,
  config: ExpressionMotionConfig,
): ExpressionCue {
  const intensity = config.intensity;
  const x = (performance?.x ?? 0) * intensity;
  const y = (performance?.y ?? -2) * intensity;
  const rotate = (performance?.rotate ?? 0) * intensity;
  const scaleX = 1 + ((performance?.scaleX ?? 1.03) - 1) * intensity;
  const scaleY = 1 + ((performance?.scaleY ?? 0.94) - 1) * intensity;

  return {
    x: [
      0,
      anticipate(x, 0, config.anticipation),
      x,
      overshoot(x, 0, config.overshoot),
      0,
    ],
    y: [
      0,
      anticipate(y, 0, config.anticipation),
      y,
      overshoot(y, 0, config.overshoot),
      0,
    ],
    rotate: [
      0,
      anticipate(rotate, 0, config.anticipation),
      rotate,
      overshoot(rotate, 0, config.overshoot),
      0,
    ],
    scaleX: [
      1,
      anticipate(scaleX, 1, config.anticipation),
      scaleX,
      overshoot(scaleX, 1, config.overshoot),
      1,
    ],
    scaleY: [
      1,
      anticipate(scaleY, 1, config.anticipation),
      scaleY,
      overshoot(scaleY, 1, config.overshoot),
      1,
    ],
    transition: {
      duration: config.duration / 1000,
      times: [0, 0.12, 0.42, 0.72, 1],
      ease: [0.22, 1, 0.36, 1],
    },
  };
}

/** Build an energetic reaction without collapsing or over-stretching the body. */
export function createReactionCue(
  reaction: Exclude<ReactionName, "none">,
  config: ExpressionMotionConfig,
): ReactionCue {
  const intensity = config.intensity;
  const transition = {
    duration: config.duration / 1000,
    times: [0, 0.22, 0.58, 0.82, 1],
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const reactions: Record<Exclude<ReactionName, "none">, ReactionCue> = {
    bounce: {
      y: scaleValues([0, -11, 3.5, -1, 0], 0, intensity),
      rotate: scaleValues([0, -2.5, 2, -0.7, 0], 0, intensity),
      scale: scaleValues([1, 0.96, 1.025, 0.99, 1], 1, intensity),
      transition,
    },
    squash: {
      scaleX: scaleValues([1, 1.045, 0.978, 1.012, 1], 1, intensity),
      scaleY: scaleValues([1, 0.95, 1.028, 0.992, 1], 1, intensity),
      y: scaleValues([0, 5, -3, 1, 0], 0, intensity),
      transition,
    },
    tilt: {
      rotate: scaleValues([0, -8, 6, -2, 0], 0, intensity),
      y: scaleValues([0, 3, -2, 0.5, 0], 0, intensity),
      transition,
    },
    spin: {
      rotate: scaleValues([0, 14, -12, 7, 0], 0, intensity),
      scale: scaleValues([1, 0.93, 1.045, 0.985, 1], 1, intensity),
      transition,
    },
  };

  return {
    x: [0, 0, 0, 0, 0],
    y: [0, 0, 0, 0, 0],
    rotate: [0, 0, 0, 0, 0],
    scale: [1, 1, 1, 1, 1],
    scaleX: [1, 1, 1, 1, 1],
    scaleY: [1, 1, 1, 1, 1],
    ...reactions[reaction],
    transition,
  };
}
