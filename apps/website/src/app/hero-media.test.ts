import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => false,
}));

vi.mock("./mux-background-video", () => ({
  MuxBackgroundVideo: ({ className }: { className?: string }) =>
    createElement("div", { "data-mux": true, className }),
}));

const { HeroMedia } = await import("./hero-media");

describe("hero media", () => {
  it("renders the automatic sequence without carousel indicators", () => {
    const html = renderToStaticMarkup(createElement(HeroMedia));

    expect(html).toContain('data-hero-media="image"');
    expect(html).not.toContain('aria-label="Hero media"');
    expect(html).not.toContain('aria-label="Show item');
  });
});
