import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_CONFIG,
  normalizeAuto,
  normalizeBlink,
  normalizeEyeMotion,
  normalizePointer,
  normalizeSpring,
  normalizeSurface,
} from "../src/config";
import {
  EXPRESSION_NAMES,
  expressionPresets,
  resolveExpression,
} from "../src/presets";

describe("preset catalog", () => {
  it("ships a broad, unique expression catalog", () => {
    expect(EXPRESSION_NAMES.length).toBeGreaterThanOrEqual(15);
    expect(new Set(EXPRESSION_NAMES).size).toBe(EXPRESSION_NAMES.length);
    expect(EXPRESSION_NAMES).toContain("neutral");
    expect(EXPRESSION_NAMES).toContain("love");
    expect(Object.keys(expressionPresets)).toEqual(EXPRESSION_NAMES);
  });

  it("resolves custom expressions before built-ins", () => {
    const custom = {
      neutral: {
        label: "Custom neutral",
        left: { width: 8, height: 8 },
        right: { width: 8, height: 8 },
      },
    };

    expect(resolveExpression("neutral", custom).label).toBe("Custom neutral");
  });

  it("falls back safely for unknown names", () => {
    const warning = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    expect(resolveExpression("does-not-exist").label).toBe("Neutral");
    expect(warning).toHaveBeenCalledOnce();
    warning.mockRestore();
  });
});

describe("configuration normalization", () => {
  it("clamps spring physics to safe ranges", () => {
    expect(normalizeSpring({ stiffness: 9999, damping: -3, mass: 0 })).toEqual({
      stiffness: 500,
      damping: 1,
      mass: 0.1,
    });
  });

  it("normalizes shorthand behavior flags", () => {
    expect(normalizeBlink(false).enabled).toBe(false);
    expect(normalizePointer(true)).toMatchObject({
      enabled: true,
      target: "self",
      strength: 1.35,
      rangeX: 18,
      rangeY: 12,
      tilt: 3,
    });
    expect(normalizeAuto(true)).toMatchObject({
      enabled: true,
      interval: [2400, 5200],
    });
  });

  it("normalizes natural eye motion defaults and invalid values", () => {
    expect(normalizeEyeMotion(true)).toMatchObject({
      enabled: true,
      idle: true,
      idleAnimations: ["glance", "squint", "flutter"],
      interval: [2400, 5200],
      intensity: 1,
      hover: "notice",
      hoverReaction: "tilt",
      contextMenuBlink: true,
    });

    expect(
      normalizeEyeMotion({
        interval: [9000, 20],
        intensity: 99,
        idleAnimations: ["wide", "invalid", "wide"],
        hover: "invalid",
        hoverReaction: "invalid",
      } as never),
    ).toMatchObject({
      interval: [500, 9000],
      intensity: 2,
      idleAnimations: ["wide"],
      hover: "notice",
      hoverReaction: "tilt",
    });
  });

  it("clamps pointer sensitivity, travel, and tilt to safe ranges", () => {
    expect(
      normalizePointer({
        strength: 99,
        rangeX: -4,
        rangeY: 99,
        tilt: 99,
      }),
    ).toEqual({
      enabled: true,
      target: "self",
      strength: 3,
      rangeX: 0,
      rangeY: 24,
      tilt: 10,
    });
  });

  it("sorts cadence ranges and clamps timing", () => {
    expect(
      normalizeBlink({ interval: [9000, 200], duration: 8 }),
    ).toMatchObject({
      interval: [500, 9000],
      duration: 80,
    });
  });

  it("exposes stable documented defaults", () => {
    expect(DEFAULT_CONFIG).toMatchObject({
      expression: "neutral",
      shape: "circle",
      color: "#5b6cff",
      eyeColor: "#0a0a0a",
      size: 240,
      expressionMotion: {
        enabled: true,
        intensity: 1.35,
        duration: 620,
        eyes: true,
        body: true,
      },
      pointer: {
        enabled: true,
        target: "self",
        strength: 1.35,
        rangeX: 18,
        rangeY: 12,
        tilt: 3,
      },
      surface: {
        enabled: true,
        perspective: 1,
        edgeCompression: 0.82,
        depth: 0.65,
        bodyFollow: 0.28,
        inertia: 0.4,
        maxTurn: 42,
      },
      eyeMotion: {
        enabled: true,
        idle: true,
        idleAnimations: ["glance", "squint", "flutter"],
        interval: [2400, 5200],
        intensity: 1,
        hover: "notice",
        hoverReaction: "tilt",
        contextMenuBlink: true,
      },
    });
  });

  it("normalizes the dimensional surface shorthand through core config", () => {
    expect(normalizeSurface(true)).toEqual(DEFAULT_CONFIG.surface);
  });
});
