export { Moodie } from "./moodie";
export type {
  ClickAction,
  GazePoint,
  MoodieHandle,
  MoodieProps,
  MotionPreset,
  ReducedMotionPreference,
} from "./moodie";

export { MoodieProvider, useMoodieDefaults } from "./provider";
export type { MoodieProviderProps } from "./provider";

export { useMoodieControls } from "./use-moodie-controls";
export type { UseMoodieControlsOptions } from "./use-moodie-controls";

export {
  EXPRESSION_NAMES,
  createExpression,
  expressionPresets,
  resolveExpression,
} from "./presets";
export type {
  ExpressionDefinition,
  ExpressionMap,
  ExpressionName,
  ExpressionPerformance,
  ReactionName,
} from "./presets";

export {
  DEFAULT_EXPRESSION_MOTION,
  createExpressionCue,
  createReactionCue,
  normalizeExpressionMotion,
} from "./expression-motion";
export type {
  ExpressionCue,
  ExpressionMotionConfig,
  ReactionCue,
} from "./expression-motion";

export {
  createClosedPath,
  createEyePath,
  createShapePath,
  pathCommandCount,
} from "./geometry";
export type { EyeGeometry, Point, ShapeName } from "./geometry";

export {
  DEFAULT_CONFIG,
  normalizeAuto,
  normalizeBlink,
  normalizePointer,
  normalizeSpring,
} from "./config";
export type {
  AutoConfig,
  BlinkConfig,
  MoodieConfig,
  PointerConfig,
  SpringConfig,
} from "./config";
