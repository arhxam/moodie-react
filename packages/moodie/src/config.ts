import type { ShapeName } from "./geometry";
import {
  DEFAULT_EXPRESSION_MOTION,
  type ExpressionMotionConfig,
} from "./expression-motion";
import type { ExpressionName, ReactionName } from "./presets";
import {
  DEFAULT_SURFACE_CONFIG,
  normalizeSurface,
  type SurfaceConfig,
} from "./surface-projection";

export { normalizeSurface };
export type { SurfaceConfig };

export type SpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
};

export type BlinkConfig = {
  enabled: boolean;
  interval: readonly [number, number];
  duration: number;
};

export type PointerTrackingTarget = "self" | "parent";

export type PointerConfig = {
  enabled: boolean;
  target: PointerTrackingTarget;
  strength: number;
  rangeX: number;
  rangeY: number;
  tilt: number;
};

export const EYE_ANIMATION_NAMES = [
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
] as const;

export type EyeAnimationName = (typeof EYE_ANIMATION_NAMES)[number];
export type ExpressionEyeTrigger = EyeAnimationName | "none";

export const DEFAULT_EXPRESSION_EYE_TRIGGERS: Readonly<
  Record<string, ExpressionEyeTrigger>
> = {
  cheeky: "roll",
  dizzy: "orbit",
  surprised: "recoil",
  sleepy: "droop",
  alert: "doubleTake",
};

export type EyeMotionConfig = {
  enabled: boolean;
  idle: boolean;
  idleAnimations: readonly EyeAnimationName[];
  interval: readonly [number, number];
  intensity: number;
  hover: EyeAnimationName | "none";
  hoverReaction: ReactionName;
  contextMenuBlink: boolean;
  expressionTriggers: Readonly<Record<string, ExpressionEyeTrigger>>;
};

export type AutoConfig = {
  enabled: boolean;
  expressions?: readonly string[];
  interval: readonly [number, number];
};

export type MoodieConfig = {
  expression: ExpressionName | string;
  shape: ShapeName;
  color: string;
  eyeColor: string;
  size: number | string;
  spring: SpringConfig;
  blink: BlinkConfig;
  pointer: PointerConfig;
  surface: SurfaceConfig;
  eyeMotion: EyeMotionConfig;
  auto: AutoConfig;
  expressionMotion: ExpressionMotionConfig;
};

export const DEFAULT_CONFIG: MoodieConfig = {
  expression: "neutral",
  shape: "circle",
  color: "#5b6cff",
  eyeColor: "#0a0a0a",
  size: 240,
  spring: { stiffness: 210, damping: 22, mass: 0.8 },
  blink: { enabled: true, interval: [2600, 6200], duration: 150 },
  pointer: {
    enabled: true,
    target: "self",
    strength: 1.35,
    rangeX: 18,
    rangeY: 12,
    tilt: 3,
  },
  surface: { ...DEFAULT_SURFACE_CONFIG },
  eyeMotion: {
    enabled: true,
    idle: true,
    idleAnimations: ["glance", "squint", "flutter"],
    interval: [2400, 5200],
    intensity: 1,
    hover: "notice",
    hoverReaction: "tilt",
    contextMenuBlink: true,
    expressionTriggers: { ...DEFAULT_EXPRESSION_EYE_TRIGGERS },
  },
  auto: { enabled: false, interval: [2400, 5200] },
  expressionMotion: { ...DEFAULT_EXPRESSION_MOTION },
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

const normalizeRange = (
  range: readonly [number, number] | undefined,
  fallback: readonly [number, number],
): readonly [number, number] => {
  const first = clamp(range?.[0], 500, 60_000, fallback[0]);
  const second = clamp(range?.[1], 500, 60_000, fallback[1]);
  return first <= second ? [first, second] : [second, first];
};

export function normalizeSpring(
  spring: Partial<SpringConfig> = {},
): SpringConfig {
  return {
    stiffness: clamp(
      spring.stiffness,
      20,
      500,
      DEFAULT_CONFIG.spring.stiffness,
    ),
    damping: clamp(spring.damping, 1, 80, DEFAULT_CONFIG.spring.damping),
    mass: clamp(spring.mass, 0.1, 5, DEFAULT_CONFIG.spring.mass),
  };
}

export function normalizeBlink(
  config: boolean | Partial<BlinkConfig> = true,
): BlinkConfig {
  if (typeof config === "boolean")
    return { ...DEFAULT_CONFIG.blink, enabled: config };
  return {
    enabled: config.enabled ?? true,
    interval: normalizeRange(config.interval, DEFAULT_CONFIG.blink.interval),
    duration: clamp(config.duration, 80, 800, DEFAULT_CONFIG.blink.duration),
  };
}

const isEyeAnimation = (value: unknown): value is EyeAnimationName =>
  EYE_ANIMATION_NAMES.includes(value as EyeAnimationName);

const reactionNames: readonly ReactionName[] = [
  "bounce",
  "squash",
  "tilt",
  "spin",
  "none",
];

export function normalizeEyeMotion(
  config: boolean | Partial<EyeMotionConfig> = true,
): EyeMotionConfig {
  if (typeof config === "boolean") {
    return {
      ...DEFAULT_CONFIG.eyeMotion,
      enabled: config,
      expressionTriggers: {
        ...DEFAULT_CONFIG.eyeMotion.expressionTriggers,
      },
    };
  }
  const requestedAnimations =
    config.idleAnimations ?? DEFAULT_CONFIG.eyeMotion.idleAnimations;
  const idleAnimations = [
    ...new Set(requestedAnimations.filter(isEyeAnimation)),
  ];
  const expressionTriggers = {
    ...DEFAULT_CONFIG.eyeMotion.expressionTriggers,
  };
  for (const [expression, trigger] of Object.entries(
    config.expressionTriggers ?? {},
  )) {
    if (
      expression.trim().length > 0 &&
      (isEyeAnimation(trigger) || trigger === "none")
    ) {
      expressionTriggers[expression] = trigger;
    }
  }
  return {
    enabled: config.enabled ?? true,
    idle: config.idle ?? true,
    idleAnimations:
      idleAnimations.length > 0
        ? idleAnimations
        : DEFAULT_CONFIG.eyeMotion.idleAnimations,
    interval: normalizeRange(
      config.interval,
      DEFAULT_CONFIG.eyeMotion.interval,
    ),
    intensity: clamp(
      config.intensity,
      0,
      2,
      DEFAULT_CONFIG.eyeMotion.intensity,
    ),
    hover:
      isEyeAnimation(config.hover) || config.hover === "none"
        ? config.hover
        : DEFAULT_CONFIG.eyeMotion.hover,
    hoverReaction: reactionNames.includes(config.hoverReaction as ReactionName)
      ? (config.hoverReaction as ReactionName)
      : DEFAULT_CONFIG.eyeMotion.hoverReaction,
    contextMenuBlink: config.contextMenuBlink ?? true,
    expressionTriggers,
  };
}

export function normalizePointer(
  config: boolean | Partial<PointerConfig> = true,
): PointerConfig {
  if (typeof config === "boolean")
    return { ...DEFAULT_CONFIG.pointer, enabled: config };
  return {
    enabled: config.enabled ?? true,
    target:
      config.target === "parent" || config.target === "self"
        ? config.target
        : DEFAULT_CONFIG.pointer.target,
    strength: clamp(config.strength, 0, 3, DEFAULT_CONFIG.pointer.strength),
    rangeX: clamp(config.rangeX, 0, 30, DEFAULT_CONFIG.pointer.rangeX),
    rangeY: clamp(config.rangeY, 0, 24, DEFAULT_CONFIG.pointer.rangeY),
    tilt: clamp(config.tilt, 0, 10, DEFAULT_CONFIG.pointer.tilt),
  };
}

export function normalizeAuto(
  config: boolean | Partial<AutoConfig> = false,
): AutoConfig {
  if (typeof config === "boolean")
    return { ...DEFAULT_CONFIG.auto, enabled: config };
  return {
    enabled: config.enabled ?? true,
    expressions: config.expressions,
    interval: normalizeRange(config.interval, DEFAULT_CONFIG.auto.interval),
  };
}
