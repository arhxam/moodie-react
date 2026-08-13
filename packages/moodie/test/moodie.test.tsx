import { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Moodie, type MoodieHandle } from "../src/moodie";

afterEach(() => {
  vi.useRealTimers();
});

describe("Moodie", () => {
  it("renders an accessible, asset-free SVG face", () => {
    render(
      <Moodie expression="happy" color="#ff3366" ariaLabel="Friendly status" />,
    );

    const face = screen.getByRole("img", { name: "Friendly status" });
    expect(face).toHaveAttribute("data-expression", "happy");
    expect(face).toHaveAttribute("data-shape", "circle");
    expect(face.querySelectorAll("path")).toHaveLength(3);
    expect(face.querySelector("[data-part='body']")).toHaveAttribute(
      "fill",
      "#ff3366",
    );
  });

  it("cycles expressions on click while uncontrolled", () => {
    const onExpressionChange = vi.fn();
    render(
      <Moodie
        defaultExpression="neutral"
        clickAction="cycle"
        blink={false}
        onExpressionChange={onExpressionChange}
      />,
    );

    fireEvent.click(screen.getByRole("img"));

    expect(screen.getByRole("img")).toHaveAttribute("data-expression", "happy");
    expect(onExpressionChange).toHaveBeenCalledWith("happy");
  });

  it("remains controlled when an expression prop is supplied", () => {
    const { rerender } = render(
      <Moodie expression="neutral" clickAction="cycle" blink={false} />,
    );

    fireEvent.click(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-expression",
      "neutral",
    );

    rerender(
      <Moodie expression="surprised" clickAction="cycle" blink={false} />,
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-expression",
      "surprised",
    );
  });

  it("exposes imperative blink, expression, gaze, and reaction controls", () => {
    vi.useFakeTimers();
    const ref = createRef<MoodieHandle>();
    render(<Moodie ref={ref} blink={{ duration: 100 }} pointer={false} />);

    act(() => ref.current?.blink());
    expect(screen.getByRole("img")).toHaveAttribute("data-blinking", "true");

    act(() => {
      ref.current?.setExpression("curious");
      ref.current?.lookAt({ x: 0.5, y: -0.25 });
      ref.current?.react("tilt");
    });

    expect(screen.getByRole("img")).toHaveAttribute(
      "data-expression",
      "curious",
    );
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-x", "0.5");
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-y", "-0.25");

    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole("img")).toHaveAttribute("data-blinking", "false");
  });

  it("tracks pointer position only when enabled", () => {
    const { rerender } = render(
      <Moodie pointer={{ enabled: true, strength: 1 }} blink={false} />,
    );
    const face = screen.getByRole("img");
    vi.spyOn(face, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(face, { clientX: 200, clientY: 0 });
    expect(face).toHaveAttribute("data-gaze-x", "1");
    expect(face).toHaveAttribute("data-gaze-y", "-1");

    rerender(<Moodie pointer={false} blink={false} />);
    fireEvent.pointerMove(screen.getByRole("img"), {
      clientX: 0,
      clientY: 200,
    });
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-x", "0");
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-y", "0");
  });

  it("renders cursor movement in dedicated configurable layers", () => {
    render(
      <Moodie
        pointer={{
          enabled: true,
          strength: 1.5,
          rangeX: 24,
          rangeY: 16,
          tilt: 5,
        }}
        blink={false}
      />,
    );

    const face = screen.getByRole("img");
    expect(face).toHaveAttribute("data-pointer-strength", "1.5");
    expect(face).toHaveAttribute("data-pointer-range-x", "24");
    expect(face).toHaveAttribute("data-pointer-range-y", "16");
    expect(face).toHaveAttribute("data-pointer-tilt", "5");
    expect(
      face.querySelector("[data-part='pointer-performance']"),
    ).not.toBeNull();
  });

  it("exposes its reduced-motion decision", () => {
    render(<Moodie reducedMotion="always" blink auto />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
  });

  it("renders a dedicated expression performance layer by default", () => {
    render(<Moodie expression="worried" blink={false} />);

    const face = screen.getByRole("img");
    expect(face).toHaveAttribute("data-expression-motion", "true");
    expect(face.querySelector("[data-part='expression-cue']")).not.toBeNull();
  });

  it("allows automatic expression performances to be disabled", () => {
    render(
      <Moodie expression="happy" expressionMotion={false} blink={false} />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "data-expression-motion",
      "false",
    );
  });

  it("suppresses expression performances in the no-motion preset", () => {
    render(<Moodie expression="excited" motion="none" blink={false} />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "data-expression-motion",
      "false",
    );
  });
});
