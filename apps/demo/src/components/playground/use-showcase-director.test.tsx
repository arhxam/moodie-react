import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useShowcaseDirector } from "./use-showcase-director";

describe("useShowcaseDirector", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("advances after each authored hold and wraps", () => {
    const { result } = renderHook(() =>
      useShowcaseDirector({ holds: [1200, 1600] }),
    );

    expect(result.current).toMatchObject({ status: "running", index: 0 });

    act(() => vi.advanceTimersByTime(1200));
    expect(result.current.index).toBe(1);

    act(() => vi.advanceTimersByTime(1600));
    expect(result.current.index).toBe(0);
  });

  it("pauses immediately and resumes after a quiet period", () => {
    const { result } = renderHook(() =>
      useShowcaseDirector({ holds: [1200, 1600] }),
    );

    act(() => result.current.pauseFor(3000));
    expect(result.current.status).toBe("paused");

    act(() => vi.advanceTimersByTime(2999));
    expect(result.current).toMatchObject({ status: "paused", index: 0 });

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.status).toBe("running");

    act(() => vi.advanceTimersByTime(1200));
    expect(result.current.index).toBe(1);
  });

  it("replaces the resume timer when another interaction occurs", () => {
    const { result } = renderHook(() =>
      useShowcaseDirector({ holds: [1200, 1600] }),
    );

    act(() => result.current.pauseFor(3000));
    act(() => vi.advanceTimersByTime(2500));
    act(() => result.current.pauseFor(3000));
    act(() => vi.advanceTimersByTime(2999));

    expect(result.current.status).toBe("paused");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.status).toBe("running");
  });

  it("close is terminal for the current mount", () => {
    const { result } = renderHook(() =>
      useShowcaseDirector({ holds: [1200, 1600] }),
    );

    act(() => result.current.close());
    act(() => vi.advanceTimersByTime(60_000));

    expect(result.current).toMatchObject({ status: "closed", index: 0 });
  });

  it("suppresses autoplay when automatic movement is disabled", () => {
    const { result } = renderHook(() =>
      useShowcaseDirector({ holds: [1200, 1600], enabled: false }),
    );

    act(() => vi.advanceTimersByTime(60_000));

    expect(result.current).toMatchObject({ status: "paused", index: 0 });
  });

  it("clears every scheduled timer on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useShowcaseDirector({ holds: [1200, 1600] }),
    );

    act(() => result.current.pauseFor(3000));
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
