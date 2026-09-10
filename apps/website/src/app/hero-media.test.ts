import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { HERO_MEDIA } from "./hero-media-config";

// The real hook reports reduced motion during a server render, which is what
// ships the static fallback. Force motion on so the sequence — and with it the
// controls — actually renders here.
vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => false,
}));

// The Mux engine attaches an HLS MediaSource on mount; irrelevant to the
// controls and unavailable outside a browser.
vi.mock("./mux-background-video", () => ({
  MuxBackgroundVideo: ({ className }: { className?: string }) =>
    createElement("div", { "data-mux": true, className }),
}));

const { HeroMedia } = await import("./hero-media");

const html = renderToStaticMarkup(createElement(HeroMedia));

describe("hero media controls", () => {
  // The arrows were removed by design — the dashes are the whole control
  // surface, so nothing here should render a Previous/Next button.
  it("renders only the dash controls, no arrow buttons", () => {
    expect(html).toContain('aria-label="Hero media"');
    expect(html).not.toContain('aria-label="Previous"');
    expect(html).not.toContain('aria-label="Next"');
  });

  it("renders one dash per media item", () => {
    for (let index = 0; index < HERO_MEDIA.length; index += 1) {
      expect(html).toContain(
        `aria-label="Show item ${index + 1} of ${HERO_MEDIA.length}"`,
      );
    }
    expect(html.match(/aria-label="Show item /g)).toHaveLength(
      HERO_MEDIA.length,
    );
  });

  it("marks the opening item as current, and only that one", () => {
    expect(html.match(/aria-current="true"/g)).toHaveLength(1);
  });

  // The controls must not sit inside the media's negative-z layer: a negative
  // z-index creates a stacking context, which would bury them under the scrim
  // and make them unclickable. This is the regression that guards that.
  it("keeps the controls out of the negative-z media layer", () => {
    const mediaLayerStart = html.indexOf("-z-20");
    const controlsStart = html.indexOf('aria-label="Hero media"');

    expect(mediaLayerStart).toBeGreaterThanOrEqual(0);
    expect(controlsStart).toBeGreaterThan(mediaLayerStart);

    // The media layer closes before the controls open, so they are siblings.
    const mediaLayer = html.slice(mediaLayerStart, controlsStart);
    expect(mediaLayer).not.toContain('aria-label="Hero media"');
    expect(html.slice(controlsStart)).not.toContain("-z-20");
  });
});
