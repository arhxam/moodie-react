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

export { createEyeAnimationCue } from "./eye-motion";
export type { EyeAnimationCue } from "./eye-motion";
export type {
  ExpressionCue,
  ExpressionMotionConfig,
  ReactionCue,
} from "./expression-motion";

export {
  SHAPE_NAMES,
  createClosedPath,
  createEyePath,
  createEyePoints,
  createShapePath,
  pathCommandCount,
} from "./geometry";
export type { EyeGeometry, Point, ShapeName } from "./geometry";

export {
  DEFAULT_SURFACE_CONFIG,
  curvedTravel,
  normalizeSurface,
  projectEyeOnSurface,
} from "./surface-projection";
export type {
  ProjectEyeInput,
  ProjectedEye,
  SurfaceConfig,
  SurfaceGaze,
} from "./surface-projection";

export {
  DEFAULT_CONFIG,
  DEFAULT_EXPRESSION_EYE_TRIGGERS,
  EYE_ANIMATION_NAMES,
  normalizeAuto,
  normalizeBlink,
  normalizeEyeMotion,
  normalizePointer,
  normalizeSpring,
} from "./config";
export type {
  AutoConfig,
  BlinkConfig,
  EyeAnimationName,
  EyeMotionConfig,
  ExpressionEyeTrigger,
  MoodieConfig,
  PointerConfig,
  PointerTrackingTarget,
  SpringConfig,
} from "./config";
