import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "../ui/tooltip";

import { Playground } from "./playground";

describe("Playground showcase", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("autoplays, pauses for manual actions, and closes into manual mode", () => {
    render(
      <TooltipProvider>
        <Playground />
      </TooltipProvider>,
    );

    const preview = screen.getByTestId("preview-state");
    expect(screen.getByText("Demo running")).toBeTruthy();
    expect(within(preview).getByText("excited")).toBeTruthy();

    act(() => vi.advanceTimersByTime(12_000));
    expect(within(preview).getByText("cheeky")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Try another mood" }));
    expect(screen.getByText("Demo paused")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close demo" }));
    const manualExpression = preview.textContent;
    expect(screen.getByText("Manual mode")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Close demo" })).toBeNull();

    act(() => vi.advanceTimersByTime(60_000));
    expect(preview.textContent).toBe(manualExpression);
  });

  it("converts the recording face directly to a fitted square performance", () => {
    render(
      <TooltipProvider>
        <Playground />
      </TooltipProvider>,
    );

    const face = screen.getByRole("img", { name: /Animated excited face/ });
    const trackingSurface = face.parentElement!;

    fireEvent.contextMenu(trackingSurface);
    fireEvent.contextMenu(trackingSurface);

    expect(face.getAttribute("data-shape")).toBe("square");
    expect(trackingSurface.getAttribute("data-recording-performance")).toBe(
      "square-arrival",
    );
    expect(trackingSurface.getAttribute("data-eye-scale")).toBe("0.82");
    expect(trackingSurface.getAttribute("data-eye-distance")).toBe("0.9");
    expect(screen.getByText("Manual mode")).toBeTruthy();
  });
});
