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
  });

  it("produces valid nested JSON without duplicate flat spring keys", () => {
    const output = createJson(INITIAL_CONFIG);
    const parsed = JSON.parse(output);

    expect(parsed.spring).toEqual({ stiffness: 210, damping: 22, mass: 0.8 });
    expect(parsed).not.toHaveProperty("stiffness");
    expect(parsed.pointer).toEqual({ enabled: true, strength: 1 });
  });
});
