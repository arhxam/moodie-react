import type { ShapeName } from "./geometry";
import {
  DEFAULT_EXPRESSION_MOTION,
  type ExpressionMotionConfig,
} from "./expression-motion";
import type { ExpressionName } from "./presets";

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

export type PointerConfig = {
  enabled: boolean;
  strength: number;
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
  pointer: { enabled: true, strength: 1 },
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

export function normalizePointer(
  config: boolean | Partial<PointerConfig> = true,
): PointerConfig {
  if (typeof config === "boolean")
    return { ...DEFAULT_CONFIG.pointer, enabled: config };
  return {
    enabled: config.enabled ?? true,
    strength: clamp(config.strength, 0, 2, DEFAULT_CONFIG.pointer.strength),
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
