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
  ReactionName,
} from "./presets";

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
