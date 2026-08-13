import { createRef } from "react";
import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Moodie, type MoodieHandle } from "../src/moodie";

afterEach(() => {
  vi.useRealTimers();
});

describe("Moodie", () => {
  const rect = (width: number, height: number) => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({}),
  });

  it("renders an accessible, asset-free SVG face", () => {
    render(
      <Moodie expression="happy" color="#ff3366" ariaLabel="Friendly status" />,
    );

    const face = screen.getByRole("img", { name: "Friendly status" });
    expect(face).toHaveAttribute("data-expression", "happy");
    expect(face).toHaveAttribute("data-shape", "circle");
    expect(face.querySelectorAll("path")).toHaveLength(4);
    expect(face.querySelector("[data-part='body-clip']")).not.toBeNull();
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

  it("tracks and recenters from its parent canvas", () => {
    render(
      <div data-testid="stage">
        <Moodie
          pointer={{ enabled: true, target: "parent", strength: 1 }}
          eyeMotion={false}
          blink={false}
        />
      </div>,
    );
    const stage = screen.getByTestId("stage");
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue(rect(400, 200));

    fireEvent.pointerMove(stage, { clientX: 400, clientY: 0 });
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-x", "1");
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-y", "-1");

    fireEvent.pointerLeave(stage);
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-x", "0");
    expect(screen.getByRole("img")).toHaveAttribute("data-gaze-y", "0");
  });

  it("notices parent-surface entry with composable eye and body cues", () => {
    render(
      <div data-testid="stage">
        <Moodie
          pointer={{ target: "parent" }}
          eyeMotion={{ hover: "notice", hoverReaction: "tilt" }}
          blink={false}
        />
      </div>,
    );

    const face = screen.getByRole("img");
    fireEvent.pointerEnter(screen.getByTestId("stage"));
    expect(face).toHaveAttribute("data-hovered", "false");

    fireEvent.pointerEnter(face);
    expect(face).toHaveAttribute("data-hovered", "true");
    expect(face).toHaveAttribute("data-eye-animation", "notice");
    expect(face.querySelector("[data-part='eye-performance']")).not.toBeNull();

    fireEvent.pointerLeave(screen.getByTestId("stage"));
    expect(face).toHaveAttribute("data-hovered", "false");
  });

  it("blinks on parent-surface right click without opening a context menu", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <div data-testid="stage">
        <Moodie
          pointer={{ target: "parent" }}
          eyeMotion={{ contextMenuBlink: true }}
          blink={{ enabled: false, duration: 100 }}
        />
      </div>,
    );
    const stage = screen.getByTestId("stage");
    const contextMenu = createEvent.contextMenu(stage);

    fireEvent(stage, contextMenu);
    expect(contextMenu.defaultPrevented).toBe(true);
    expect(screen.getByRole("img")).toHaveAttribute("data-blinking", "true");

    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole("img")).toHaveAttribute("data-blinking", "false");

    rerender(
      <div data-testid="stage">
        <Moodie
          pointer={{ target: "parent" }}
          eyeMotion={false}
          blink={false}
        />
      </div>,
    );
    const disabledContextMenu = createEvent.contextMenu(stage);
    fireEvent(stage, disabledContextMenu);
    expect(disabledContextMenu.defaultPrevented).toBe(false);
  });

  it("exposes imperative eye animations and reduced-motion suppression", () => {
    const ref = createRef<MoodieHandle>();
    const { rerender } = render(<Moodie ref={ref} eyeMotion blink={false} />);

    act(() => ref.current?.animateEyes("wide"));
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-eye-animation",
      "wide",
    );

    rerender(
      <Moodie
        ref={ref}
        eyeMotion={{ hover: "notice" }}
        reducedMotion="always"
        blink={false}
      />,
    );
    fireEvent.pointerEnter(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute("data-eye-motion", "false");
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-eye-animation",
      "none",
    );
  });

  it("plays configured eye micro-animations while idle", () => {
    vi.useFakeTimers();
    render(
      <Moodie
        eyeMotion={{
          idle: true,
          idleAnimations: ["glance"],
          interval: [500, 500],
        }}
        blink={false}
      />,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "data-eye-animation",
      "none",
    );
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-eye-animation",
      "glance",
    );
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

  it("projects each eye independently across the curved face surface", async () => {
    render(
      <div data-testid="stage">
        <Moodie
          pointer={{ target: "parent", strength: 1, rangeX: 30, rangeY: 24 }}
          surface={{
            perspective: 1.2,
            edgeCompression: 0.9,
            depth: 0.8,
            inertia: 0.55,
            volumePreservation: 0.7,
          }}
          eyeMotion={false}
          blink={false}
        />
      </div>,
    );
    const stage = screen.getByTestId("stage");
    const face = screen.getByRole("img");
    const leftEye = face.querySelector("[data-part='left-eye']");
    const rightEye = face.querySelector("[data-part='right-eye']");
    const centerLeft = leftEye?.getAttribute("d");
    const centerRight = rightEye?.getAttribute("d");
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue(rect(400, 200));

    fireEvent.pointerMove(stage, { clientX: 400, clientY: 100 });

    expect(face).toHaveAttribute("data-surface-enabled", "true");
    expect(face).toHaveAttribute("data-surface-edge-compression", "0.9");
    expect(face).toHaveAttribute("data-surface-inertia", "0.55");
    expect(face).toHaveAttribute("data-surface-volume-preservation", "0.7");
    expect(
      Number(face.getAttribute("data-left-eye-compression")),
    ).toBeGreaterThan(Number(face.getAttribute("data-right-eye-compression")));
    await waitFor(() => {
      expect(leftEye?.getAttribute("d")).not.toBe(centerLeft);
      expect(rightEye?.getAttribute("d")).not.toBe(centerRight);
    });
    expect(face.querySelector("[data-part='eyes']")).toHaveAttribute(
      "clip-path",
      expect.stringContaining("moodie-surface"),
    );
    expect(face.querySelector("[data-part='body-clip']")).not.toBeNull();
  });

  it("keeps final surface geometry while suppressing reduced-motion choreography", () => {
    render(
      <Moodie
        gaze={{ x: 1, y: -1 }}
        reducedMotion="always"
        surface
        blink={false}
      />,
    );
    const face = screen.getByRole("img");

    expect(face).toHaveAttribute("data-reduced-motion", "true");
    expect(face).toHaveAttribute("data-surface-enabled", "true");
    expect(Number(face.getAttribute("data-left-eye-compression"))).toBeLessThan(
      1,
    );
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
    expect(
      face.querySelector("[data-part='left-expression-cue']"),
    ).not.toBeNull();
    expect(
      face.querySelector("[data-part='right-expression-cue']"),
    ).not.toBeNull();
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
