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

    act(() => vi.advanceTimersByTime(1900));
    expect(within(preview).getByText("cheeky")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Try another mood" }));
    expect(screen.getByText("Demo paused")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close demo" }));
    const manualExpression = preview.textContent;
    expect(screen.getByText("Manual mode")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Close demo" }),
    ).toBeNull();

    act(() => vi.advanceTimersByTime(60_000));
    expect(preview.textContent).toBe(manualExpression);
  });
});
