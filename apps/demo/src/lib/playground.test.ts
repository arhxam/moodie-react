import { describe, expect, it } from "vitest";

import {
  BODY_SHAPES,
  DISPLAY_EXPRESSIONS,
  EYE_PERFORMANCES,
  EXPRESSION_EYE_TRIGGERS,
  INITIAL_CONFIG,
  createCode,
  createJson,
} from "./playground";

describe("playground exporters", () => {
  it("starts the preset rail with excited and leaves curious until last", () => {
    expect(INITIAL_CONFIG.expression).toBe("excited");
    expect(INITIAL_CONFIG.color).toBe("#dfff5b");
    expect(INITIAL_CONFIG.eyeColor).toBe("#151515");
    expect(DISPLAY_EXPRESSIONS[0]).toBe("excited");
    expect(DISPLAY_EXPRESSIONS.at(-1)).toBe("curious");
  });

  it("offers every built-in body shape and preserves new shapes in code", () => {
    expect(BODY_SHAPES).toEqual([
      "circle",
      "squircle",
      "blob",
      "pebble",
      "diamond",
      "oval",
      "triangle",
      "cloud",
      "hexagon",
      "square",
      "drop",
    ]);
    expect(createCode({ ...INITIAL_CONFIG, shape: "drop" })).toContain(
      'defaultShape="drop"',
    );
    expect(createCode({ ...INITIAL_CONFIG, shape: "drop" })).toContain(
      "doubleContextShapeCycle",
    );
  });

  it("offers every secondary eye performance in the live launcher", () => {
    expect(EYE_PERFORMANCES).toEqual([
      "notice",
      "glance",
      "squint",
      "wide",
      "flutter",
      "roll",
      "vanish",
      "orbit",
      "doubleTake",
      "recoil",
      "droop",
      "shake",
    ]);
    expect(EXPRESSION_EYE_TRIGGERS).toEqual({
      cheeky: "roll",
      dizzy: "orbit",
      surprised: "recoil",
      sleepy: "droop",
      alert: "doubleTake",
    });
  });

  it("keeps the React snippet synchronized with configuration", () => {
    const code = createCode({
      ...INITIAL_CONFIG,
      expression: "happy",
      color: "#ff3366",
      pointer: false,
    });

    expect(code).toContain('expression="happy"');
    expect(code).toContain('color="#ff3366"');
    expect(code).toContain("enabled: false");
    expect(code).toContain(
      'pointer={{ enabled: false, target: "parent", strength: 1.35, rangeX: 18, rangeY: 12, tilt: 3 }}',
    );
    expect(code).toContain(
      'expressionTriggers: { cheeky: "roll", dizzy: "orbit", surprised: "recoil", sleepy: "droop", alert: "doubleTake" }',
    );
    expect(code).toContain(
      "surface={{ enabled: true, perspective: 1, edgeCompression: 0.82, depth: 0.65, bodyFollow: 0.28, inertia: 0.4, maxTurn: 42, volumePreservation: 0.45 }}",
    );
    expect(code).toContain(
      "expressionMotion={{ intensity: 1.35, duration: 620, eyes: true, body: true, anticipation: 0.35, overshoot: 0.25, stagger: 22 }}",
    );
  });

  it("produces valid nested JSON without duplicate flat spring keys", () => {
    const output = createJson(INITIAL_CONFIG);
    const parsed = JSON.parse(output);

    expect(parsed.spring).toEqual({ stiffness: 210, damping: 22, mass: 0.8 });
    expect(parsed).not.toHaveProperty("stiffness");
    expect(parsed.pointer).toEqual({
      enabled: true,
      target: "parent",
      strength: 1.35,
      rangeX: 18,
      rangeY: 12,
      tilt: 3,
    });
    expect(parsed.eyeMotion).toEqual({
      enabled: true,
      idle: true,
      hover: "notice",
      hoverReaction: "tilt",
      contextMenuBlink: true,
      intensity: 1,
      interval: [2400, 5200],
      expressionTriggers: {
        cheeky: "roll",
        dizzy: "orbit",
        surprised: "recoil",
        sleepy: "droop",
        alert: "doubleTake",
      },
    });
    expect(parsed.surface).toEqual({
      enabled: true,
      perspective: 1,
      edgeCompression: 0.82,
      depth: 0.65,
      bodyFollow: 0.28,
      inertia: 0.4,
      maxTurn: 42,
      volumePreservation: 0.45,
    });
    expect(parsed.expressionMotion).toEqual({
      intensity: 1.35,
      duration: 620,
      eyes: true,
      body: true,
      anticipation: 0.35,
      overshoot: 0.25,
      stagger: 22,
    });
  });
});
