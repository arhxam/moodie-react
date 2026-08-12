import { useCallback, useMemo, useState } from "react";

import type { GazePoint, MoodieProps } from "./moodie";

export type UseMoodieControlsOptions = {
  defaultExpression?: string;
  defaultGaze?: GazePoint;
};

export function useMoodieControls({
  defaultExpression = "neutral",
  defaultGaze = { x: 0, y: 0 },
}: UseMoodieControlsOptions = {}) {
  const [expression, setExpression] = useState(defaultExpression);
  const [gaze, setGaze] = useState(defaultGaze);
  const lookAt = useCallback((point: GazePoint) => setGaze(point), []);
  const reset = useCallback(() => {
    setExpression(defaultExpression);
    setGaze(defaultGaze);
  }, [defaultExpression, defaultGaze]);
  const moodieProps = useMemo<
    Pick<MoodieProps, "expression" | "gaze" | "onExpressionChange">
  >(
    () => ({ expression, gaze, onExpressionChange: setExpression }),
    [expression, gaze],
  );

  return { expression, gaze, setExpression, lookAt, reset, moodieProps };
}
