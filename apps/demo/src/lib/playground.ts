import type {
  EyeAnimationName,
  MotionPreset,
  PointerTrackingTarget,
  ReactionName,
  ShapeName,
} from "@moodie/react";

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
  expressionAnticipation: number;
  expressionOvershoot: number;
  eyeStagger: number;
  pointer: boolean;
  pointerTarget: PointerTrackingTarget;
  pointerStrength: number;
  pointerRangeX: number;
  pointerRangeY: number;
  pointerTilt: number;
  surface: boolean;
  surfacePerspective: number;
  edgeCompression: number;
  surfaceDepth: number;
  bodyFollow: number;
  surfaceInertia: number;
  maxTurn: number;
  surfaceVolumePreservation: number;
  eyeMotion: boolean;
  idleEyeMotion: boolean;
  hoverEyeMotion: EyeAnimationName | "none";
  hoverReaction: ReactionName;
  contextMenuBlink: boolean;
  eyeMotionIntensity: number;
  eyeMotionIntervalMin: number;
  eyeMotionIntervalMax: number;
  blink: boolean;
  auto: boolean;
};

export const INITIAL_CONFIG: PlaygroundConfig = {
  expression: "excited",
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
  expressionAnticipation: 0.35,
  expressionOvershoot: 0.25,
  eyeStagger: 22,
  pointer: true,
  pointerTarget: "parent",
  pointerStrength: 1.35,
  pointerRangeX: 18,
  pointerRangeY: 12,
  pointerTilt: 3,
  surface: true,
  surfacePerspective: 1,
  edgeCompression: 0.82,
  surfaceDepth: 0.65,
  bodyFollow: 0.28,
  surfaceInertia: 0.4,
  maxTurn: 42,
  surfaceVolumePreservation: 0.45,
  eyeMotion: true,
  idleEyeMotion: true,
  hoverEyeMotion: "notice",
  hoverReaction: "tilt",
  contextMenuBlink: true,
  eyeMotionIntensity: 1,
  eyeMotionIntervalMin: 2400,
  eyeMotionIntervalMax: 5200,
  blink: true,
  auto: false,
};

export const DISPLAY_EXPRESSIONS = [
  "excited",
  "happy",
  "sleepy",
  "sad",
  "worried",
  "thinking",
  "love",
  "focused",
  "cheeky",
  "surprised",
  "calm",
  "curious",
] as const;

export const BODY_SHAPES = [
  "circle",
  "squircle",
  "blob",
  "pebble",
  "diamond",
  "oval",
  "triangle",
  "cloud",
  "hexagon",
  "square",
  "drop",
] as const satisfies readonly ShapeName[];
export const MOTION_PRESETS = [
  "spring",
  "gentle",
  "snappy",
  "bouncy",
  "tween",
  "none",
] as const;
export const POINTER_TARGETS = ["parent", "self"] as const;
export const EYE_PERFORMANCES = [
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
] as const satisfies readonly EyeAnimationName[];
export const EYE_ANIMATIONS = [...EYE_PERFORMANCES, "none"] as const;
export const EXPRESSION_EYE_TRIGGERS = {
  cheeky: "roll",
  dizzy: "orbit",
  surprised: "recoil",
  sleepy: "droop",
  alert: "doubleTake",
} as const satisfies Readonly<Record<string, EyeAnimationName | "none">>;
export const HOVER_REACTIONS = [
  "tilt",
  "bounce",
  "squash",
  "spin",
  "none",
] as const;

const formatNumber = (value: number) => Number(value.toFixed(2));
const formattedExpressionTriggers = Object.entries(EXPRESSION_EYE_TRIGGERS)
  .map(([expression, cue]) => `${expression}: "${cue}"`)
  .join(", ");

export function createCode(config: PlaygroundConfig) {
  return `import { Moodie } from "@moodie/react";

export function StatusFace() {
  return (
    <Moodie
      expression="${config.expression}"
      defaultShape="${config.shape}"
      doubleContextShapeCycle
      color="${config.color}"
      eyeColor="${config.eyeColor}"
      size={${config.size}}
      motion="${config.motion}"
      spring={{ stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} }}
      pointer={{ enabled: ${config.pointer}, target: "${config.pointerTarget}", strength: ${formatNumber(config.pointerStrength)}, rangeX: ${formatNumber(config.pointerRangeX)}, rangeY: ${formatNumber(config.pointerRangeY)}, tilt: ${formatNumber(config.pointerTilt)} }}
      surface={{ enabled: ${config.surface}, perspective: ${formatNumber(config.surfacePerspective)}, edgeCompression: ${formatNumber(config.edgeCompression)}, depth: ${formatNumber(config.surfaceDepth)}, bodyFollow: ${formatNumber(config.bodyFollow)}, inertia: ${formatNumber(config.surfaceInertia)}, maxTurn: ${formatNumber(config.maxTurn)}, volumePreservation: ${formatNumber(config.surfaceVolumePreservation)} }}
      eyeMotion={{ enabled: ${config.eyeMotion}, idle: ${config.idleEyeMotion}, hover: "${config.hoverEyeMotion}", hoverReaction: "${config.hoverReaction}", contextMenuBlink: ${config.contextMenuBlink}, intensity: ${formatNumber(config.eyeMotionIntensity)}, interval: [${config.eyeMotionIntervalMin}, ${config.eyeMotionIntervalMax}], expressionTriggers: { ${formattedExpressionTriggers} } }}
      blink={${config.blink}}
      auto={${config.auto}}
      eyeScale={${formatNumber(config.eyeScale)}}
      eyeDistance={${formatNumber(config.eyeDistance)}}
      gazeLimit={${formatNumber(config.gazeLimit)}}
      expressionMotion={{ intensity: ${formatNumber(config.expressiveness)}, duration: ${config.expressionDuration}, eyes: ${config.eyePerformance}, body: ${config.bodyPerformance}, anticipation: ${formatNumber(config.expressionAnticipation)}, overshoot: ${formatNumber(config.expressionOvershoot)}, stagger: ${config.eyeStagger} }}
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
    pointerTarget,
    pointerStrength,
    pointerRangeX,
    pointerRangeY,
    pointerTilt,
    surface,
    surfacePerspective,
    edgeCompression,
    surfaceDepth,
    bodyFollow,
    surfaceInertia,
    maxTurn,
    surfaceVolumePreservation,
    eyeMotion,
    idleEyeMotion,
    hoverEyeMotion,
    hoverReaction,
    contextMenuBlink,
    eyeMotionIntensity,
    eyeMotionIntervalMin,
    eyeMotionIntervalMax,
    blink,
    auto,
    expressiveness,
    expressionDuration,
    eyePerformance,
    bodyPerformance,
    expressionAnticipation,
    expressionOvershoot,
    eyeStagger,
    ...visual
  } = config;
  return JSON.stringify(
    {
      ...visual,
      spring: { stiffness, damping, mass },
      pointer: {
        enabled: pointer,
        target: pointerTarget,
        strength: pointerStrength,
        rangeX: pointerRangeX,
        rangeY: pointerRangeY,
        tilt: pointerTilt,
      },
      surface: {
        enabled: surface,
        perspective: surfacePerspective,
        edgeCompression,
        depth: surfaceDepth,
        bodyFollow,
        inertia: surfaceInertia,
        maxTurn,
        volumePreservation: surfaceVolumePreservation,
      },
      eyeMotion: {
        enabled: eyeMotion,
        idle: idleEyeMotion,
        hover: hoverEyeMotion,
        hoverReaction,
        contextMenuBlink,
        intensity: eyeMotionIntensity,
        interval: [eyeMotionIntervalMin, eyeMotionIntervalMax],
        expressionTriggers: EXPRESSION_EYE_TRIGGERS,
      },
      blink: { enabled: blink },
      auto: { enabled: auto },
      expressionMotion: {
        intensity: expressiveness,
        duration: expressionDuration,
        eyes: eyePerformance,
        body: bodyPerformance,
        anticipation: expressionAnticipation,
        overshoot: expressionOvershoot,
        stagger: eyeStagger,
      },
    },
    null,
    2,
  );
}
