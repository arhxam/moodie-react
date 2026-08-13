import { describe, expect, it } from "vitest";

import { INITIAL_CONFIG, createCode, createJson } from "./playground";

describe("playground exporters", () => {
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
      'eyeMotion={{ enabled: true, idle: true, hover: "notice", hoverReaction: "tilt", contextMenuBlink: true, intensity: 1, interval: [2400, 5200] }}',
    );
    expect(code).toContain(
      "surface={{ enabled: true, perspective: 1, edgeCompression: 0.82, depth: 0.65, bodyFollow: 0.28, inertia: 0.4, maxTurn: 42 }}",
    );
    expect(code).toContain(
      "expressionMotion={{ intensity: 1.35, duration: 620, eyes: true, body: true, anticipation: 0.35, overshoot: 0.25, stagger: 35 }}",
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
    });
    expect(parsed.surface).toEqual({
      enabled: true,
      perspective: 1,
      edgeCompression: 0.82,
      depth: 0.65,
      bodyFollow: 0.28,
      inertia: 0.4,
      maxTurn: 42,
    });
    expect(parsed.expressionMotion).toEqual({
      intensity: 1.35,
      duration: 620,
      eyes: true,
      body: true,
      anticipation: 0.35,
      overshoot: 0.25,
      stagger: 35,
    });
  });
});
