import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Moodie, MoodieProvider, useMoodieControls } from "../src";

describe("public API", () => {
  it("applies shared visual and behavior defaults through a provider", () => {
    render(
      <MoodieProvider
        value={{ color: "#ff5500", eyeColor: "#ffffff", blink: false }}
      >
        <Moodie />
      </MoodieProvider>,
    );

    const face = screen.getByRole("img");
    expect(face.querySelector("[data-part='body']")).toHaveAttribute(
      "fill",
      "#ff5500",
    );
    expect(face.querySelector("[data-part='left-eye']")).toHaveAttribute(
      "fill",
      "#ffffff",
    );
  });

  it("lets instance props override provider defaults", () => {
    render(
      <MoodieProvider value={{ color: "#ff5500", expression: "happy" }}>
        <Moodie color="#00aa88" expression="focused" />
      </MoodieProvider>,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "data-expression",
      "focused",
    );
    expect(
      screen.getByRole("img").querySelector("[data-part='body']"),
    ).toHaveAttribute("fill", "#00aa88");
  });

  it("provides a small controlled-state helper", () => {
    const { result } = renderHook(() =>
      useMoodieControls({
        defaultExpression: "happy",
        defaultGaze: { x: 0, y: 0 },
      }),
    );

    act(() => {
      result.current.setExpression("curious");
      result.current.lookAt({ x: 0.4, y: -0.2 });
    });

    expect(result.current.expression).toBe("curious");
    expect(result.current.gaze).toEqual({ x: 0.4, y: -0.2 });
    expect(result.current.moodieProps).toMatchObject({ expression: "curious" });
  });
});
