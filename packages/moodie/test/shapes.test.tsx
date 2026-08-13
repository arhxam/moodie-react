import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Moodie, type ShapeName } from "../src";

const REFERENCE_SHAPES = [
  "oval",
  "triangle",
  "cloud",
  "hexagon",
  "square",
  "drop",
] as const satisfies readonly ShapeName[];

describe("reference body shapes", () => {
  it.each(REFERENCE_SHAPES)("renders the %s silhouette", (shape) => {
    render(<Moodie shape={shape} blink={false} eyeMotion={false} />);

    const face = screen.getByRole("img");
    expect(face).toHaveAttribute("data-shape", shape);
    expect(face.querySelector("[data-part='body']")).toHaveAttribute(
      "d",
      expect.stringMatching(/^M.+Z$/),
    );
  });

  it("cycles the body shape on a double right-click", () => {
    render(
      <Moodie
        defaultShape="circle"
        shapeOrder={["circle", "triangle", "drop"]}
        doubleContextShapeCycle
        blink={false}
        eyeMotion={false}
      />,
    );

    const face = screen.getByRole("img");
    fireEvent.contextMenu(face);
    expect(face).toHaveAttribute("data-shape", "circle");

    fireEvent.contextMenu(face);
    expect(face).toHaveAttribute("data-shape", "triangle");
  });

  it("reports double right-click shape changes to controlled consumers", () => {
    function ControlledShape() {
      const [shape, setShape] = useState<ShapeName>("circle");
      return (
        <Moodie
          shape={shape}
          shapeOrder={["circle", "cloud"]}
          onShapeChange={setShape}
          doubleContextShapeCycle
          blink={false}
          eyeMotion={false}
        />
      );
    }

    render(<ControlledShape />);
    const face = screen.getByRole("img");
    fireEvent.contextMenu(face);
    fireEvent.contextMenu(face);

    expect(face).toHaveAttribute("data-shape", "cloud");
  });
});
