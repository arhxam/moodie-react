import { act, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./App", () => ({
  App: () => <main>Moodie demo</main>,
}));

vi.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

describe("demo application root", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.resetModules();
  });

  it("mounts Vercel Web Analytics exactly once", async () => {
    await act(async () => {
      await import("./main");
    });

    expect(await screen.findAllByTestId("vercel-analytics")).toHaveLength(1);
  });
});
