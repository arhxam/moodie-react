import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "apps/demo/src/index.css"),
  "utf8",
);

describe("playground sidebar layout", () => {
  it("makes the desktop Configure and Code column independently scrollable", () => {
    expect(stylesheet).toMatch(
      /\.studio-sidebar\s*\{[^}]*max-height:\s*920px;[^}]*overflow-y:\s*auto;[^}]*overscroll-behavior:\s*contain;/s,
    );
  });

  it("returns the sidebar to normal page flow in the stacked mobile layout", () => {
    expect(stylesheet).toMatch(
      /@media \(max-width:\s*820px\)[\s\S]*?\.studio-sidebar\s*\{[^}]*max-height:\s*none;[^}]*overflow-y:\s*visible;[^}]*overscroll-behavior:\s*auto;/s,
    );
  });
});
