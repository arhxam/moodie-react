import type { MotionPreset, ShapeName } from "@moodie/react";

export type PlaygroundConfig = {
  expression: string;
  shape: ShapeName;
  color: string;
  eyeColor: string;
  motion: MotionPreset;
  stiffness: number;
  damping: number;
  mass: number;
  size: number;
  eyeScale: number;
  eyeDistance: number;
  gazeLimit: number;
  expressiveness: number;
  expressionDuration: number;
  eyePerformance: boolean;
  bodyPerformance: boolean;
  pointer: boolean;
  blink: boolean;
  auto: boolean;
};

export const INITIAL_CONFIG: PlaygroundConfig = {
  expression: "curious",
  shape: "circle",
  color: "#5b6cff",
  eyeColor: "#0a0a0a",
  motion: "spring",
  stiffness: 210,
  damping: 22,
  mass: 0.8,
  size: 360,
  eyeScale: 1,
  eyeDistance: 1,
  gazeLimit: 1,
  expressiveness: 1.35,
  expressionDuration: 620,
  eyePerformance: true,
  bodyPerformance: true,
  pointer: true,
  blink: true,
  auto: false,
};

export const DISPLAY_EXPRESSIONS = [
  "curious",
  "happy",
  "excited",
  "sleepy",
  "sad",
  "worried",
  "thinking",
  "love",
  "focused",
  "cheeky",
  "surprised",
  "calm",
] as const;

export const BODY_SHAPES = [
  "circle",
  "squircle",
  "blob",
  "pebble",
  "diamond",
] as const;
export const MOTION_PRESETS = [
  "spring",
  "gentle",
  "snappy",
  "bouncy",
  "tween",
  "none",
] as const;

const formatNumber = (value: number) => Number(value.toFixed(2));

export function createCode(config: PlaygroundConfig) {
  return `import { Moodie } from "@moodie/react";

export function StatusFace() {
  return (
    <Moodie
      expression="${config.expression}"
      shape="${config.shape}"
      color="${config.color}"
      eyeColor="${config.eyeColor}"
      size={${config.size}}
      motion="${config.motion}"
      spring={{ stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} }}
      pointer={{ enabled: ${config.pointer}, strength: 1 }}
      blink={${config.blink}}
      auto={${config.auto}}
      eyeScale={${formatNumber(config.eyeScale)}}
      eyeDistance={${formatNumber(config.eyeDistance)}}
      gazeLimit={${formatNumber(config.gazeLimit)}}
      expressionMotion={{ intensity: ${formatNumber(config.expressiveness)}, duration: ${config.expressionDuration}, eyes: ${config.eyePerformance}, body: ${config.bodyPerformance} }}
      clickAction="random"
    />
  );
}`;
}

export function createJson(config: PlaygroundConfig) {
  const {
    stiffness,
    damping,
    mass,
    pointer,
    blink,
    auto,
    expressiveness,
    expressionDuration,
    eyePerformance,
    bodyPerformance,
    ...visual
  } = config;
  return JSON.stringify(
    {
      ...visual,
      spring: { stiffness, damping, mass },
      pointer: { enabled: pointer, strength: 1 },
      blink: { enabled: blink },
      auto: { enabled: auto },
      expressionMotion: {
        intensity: expressiveness,
        duration: expressionDuration,
        eyes: eyePerformance,
        body: bodyPerformance,
      },
    },
    null,
    2,
  );
}
