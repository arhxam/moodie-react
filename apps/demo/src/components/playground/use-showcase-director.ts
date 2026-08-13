import { useCallback, useEffect, useRef, useState } from "react";

export type ShowcaseStatus = "running" | "paused" | "closed";

type ShowcaseDirectorOptions = {
  holds: readonly number[];
  enabled?: boolean;
};

type ShowcaseDirectorState = {
  status: ShowcaseStatus;
  index: number;
};

export function useShowcaseDirector({
  holds,
  enabled = true,
}: ShowcaseDirectorOptions) {
  const [state, setState] = useState<ShowcaseDirectorState>(() => ({
    status: enabled ? "running" : "paused",
    index: 0,
  }));
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimer.current !== null) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimer.current !== null) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  useEffect(() => {
    clearAdvanceTimer();

    if (!enabled || state.status !== "running" || holds.length === 0) {
      return;
    }

    advanceTimer.current = setTimeout(() => {
      setState((current) => {
        if (current.status !== "running") return current;
        return {
          ...current,
          index: (current.index + 1) % holds.length,
        };
      });
    }, holds[state.index] ?? holds[0]);

    return clearAdvanceTimer;
  }, [clearAdvanceTimer, enabled, holds, state.index, state.status]);

  useEffect(() => {
    if (!enabled) {
      clearAdvanceTimer();
      clearResumeTimer();
      setState((current) =>
        current.status === "closed"
          ? current
          : { ...current, status: "paused" },
      );
    }
  }, [clearAdvanceTimer, clearResumeTimer, enabled]);

  useEffect(
    () => () => {
      clearAdvanceTimer();
      clearResumeTimer();
    },
    [clearAdvanceTimer, clearResumeTimer],
  );

  const pauseFor = useCallback(
    (duration: number) => {
      if (!enabled || state.status === "closed") return;

      clearAdvanceTimer();
      clearResumeTimer();
      setState((current) => ({ ...current, status: "paused" }));
      resumeTimer.current = setTimeout(() => {
        resumeTimer.current = null;
        setState((current) =>
          current.status === "closed"
            ? current
            : { ...current, status: "running" },
        );
      }, duration);
    },
    [clearAdvanceTimer, clearResumeTimer, enabled, state.status],
  );

  const close = useCallback(() => {
    clearAdvanceTimer();
    clearResumeTimer();
    setState((current) => ({ ...current, status: "closed" }));
  }, [clearAdvanceTimer, clearResumeTimer]);

  return {
    ...state,
    pauseFor,
    close,
  };
}
