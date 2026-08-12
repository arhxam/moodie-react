import type { EyeGeometry } from "./geometry";

export type ReactionName = "bounce" | "squash" | "tilt" | "spin" | "none";

export type ExpressionDefinition = {
  label: string;
  left: EyeGeometry;
  right: EyeGeometry;
  body?: {
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
    y?: number;
  };
  reaction?: ReactionName;
};

export type ExpressionMap = Record<string, ExpressionDefinition>;

const eye = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0,
  curve = 0.8,
  skew = 0,
): EyeGeometry => ({ x, y, width, height, rotation, curve, skew });

export const expressionPresets = {
  neutral: {
    label: "Neutral",
    left: eye(72, 94, 22, 42, -5),
    right: eye(128, 94, 22, 42, 5),
    reaction: "none",
  },
  happy: {
    label: "Happy",
    left: eye(72, 100, 31, 13, 7, 0.38),
    right: eye(128, 100, 31, 13, -7, 0.38),
    body: { y: -2 },
    reaction: "bounce",
  },
  excited: {
    label: "Excited",
    left: eye(70, 96, 29, 53, -9, 0.92),
    right: eye(130, 96, 29, 53, 9, 0.92),
    body: { scaleX: 1.03, scaleY: 0.97 },
    reaction: "bounce",
  },
  sleepy: {
    label: "Sleepy",
    left: eye(72, 100, 35, 8, 2, 0.25),
    right: eye(128, 100, 35, 8, -2, 0.25),
    body: { rotate: -3, y: 4 },
    reaction: "tilt",
  },
  sad: {
    label: "Sad",
    left: eye(72, 103, 24, 35, -17, 0.72),
    right: eye(128, 103, 24, 35, 17, 0.72),
    body: { y: 4, scaleX: 0.98, scaleY: 1.02 },
    reaction: "squash",
  },
  worried: {
    label: "Worried",
    left: eye(72, 96, 22, 38, 16, 0.76),
    right: eye(128, 96, 22, 38, -16, 0.76),
    reaction: "tilt",
  },
  thinking: {
    label: "Thinking",
    left: eye(68, 91, 17, 30, -18, 0.88),
    right: eye(126, 101, 32, 15, -24, 0.46),
    body: { rotate: -4 },
    reaction: "tilt",
  },
  love: {
    label: "Love",
    left: eye(72, 96, 34, 34, -8, 0.18, -0.38),
    right: eye(128, 96, 34, 34, 8, 0.18, 0.38),
    body: { scaleX: 1.02, scaleY: 0.98 },
    reaction: "bounce",
  },
  curious: {
    label: "Curious",
    left: eye(70, 89, 18, 34, -12, 0.85),
    right: eye(130, 100, 31, 47, 10, 0.84),
    body: { rotate: 5 },
    reaction: "tilt",
  },
  surprised: {
    label: "Surprised",
    left: eye(72, 95, 34, 52, 0, 1),
    right: eye(128, 95, 34, 52, 0, 1),
    body: { scaleX: 0.96, scaleY: 1.04 },
    reaction: "bounce",
  },
  focused: {
    label: "Focused",
    left: eye(72, 97, 31, 13, 14, 0.4),
    right: eye(128, 97, 31, 13, -14, 0.4),
    body: { scaleX: 1.01 },
    reaction: "squash",
  },
  cheeky: {
    label: "Cheeky",
    left: eye(72, 94, 28, 13, 10, 0.35),
    right: eye(128, 95, 21, 42, 8, 0.84),
    body: { rotate: 4 },
    reaction: "tilt",
  },
  dizzy: {
    label: "Dizzy",
    left: eye(70, 96, 37, 12, 42, 0.25),
    right: eye(130, 96, 37, 12, -42, 0.25),
    reaction: "spin",
  },
  calm: {
    label: "Calm",
    left: eye(72, 99, 34, 9, 0, 0.3),
    right: eye(128, 99, 34, 9, 0, 0.3),
    body: { scaleX: 1.01, scaleY: 0.99 },
    reaction: "none",
  },
  wink: {
    label: "Wink",
    left: eye(72, 99, 35, 8, 8, 0.25),
    right: eye(128, 95, 23, 43, 4, 0.85),
    body: { rotate: 3 },
    reaction: "bounce",
  },
  alert: {
    label: "Alert",
    left: eye(72, 91, 21, 48, -3, 0.9),
    right: eye(128, 91, 21, 48, 3, 0.9),
    body: { y: -3, scaleY: 1.02 },
    reaction: "bounce",
  },
} satisfies ExpressionMap;

export type ExpressionName = keyof typeof expressionPresets;

export const EXPRESSION_NAMES = Object.keys(
  expressionPresets,
) as ExpressionName[];

export function resolveExpression(
  name: string,
  custom: ExpressionMap = {},
): ExpressionDefinition {
  if (custom[name]) return custom[name];
  if (name in expressionPresets)
    return expressionPresets[name as ExpressionName];

  if (typeof console !== "undefined") {
    console.warn(
      `[moodie] Unknown expression "${name}". Falling back to "neutral".`,
    );
  }
  return expressionPresets.neutral;
}

export function createExpression(
  definition: ExpressionDefinition,
): ExpressionDefinition {
  return definition;
}
