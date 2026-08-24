"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Where a Lenis scroll should land relative to an in-page target: clear of the
 * header the homepage overlays on top of the page (see `scroll-mt-[92px]` on
 * the `#services` section — Lenis ignores `scroll-mt-*`, so the offset is
 * applied here instead). Shared with `useLenis().scrollTo` callers.
 */
const SCROLL_HEADER_OFFSET = -92;

/**
 * Site-wide eased wheel scrolling. `root` drives the real window scroll, so
 * passive scroll listeners (the article progress bar) and native touch and
 * keyboard scrolling keep working.
 *
 * Reduced motion skips Lenis entirely rather than leaning on its own
 * `respectReducedMotion` option — no RAF loop runs at all, and `useLenis()`
 * returning `undefined` is what tells consumers to fall back to native
 * scrolling. The server snapshot assumes reduced motion, so the first paint is
 * native scroll and Lenis attaches on hydration.
 */
function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{ anchors: { offset: SCROLL_HEADER_OFFSET } }}
    >
      {children}
    </ReactLenis>
  );
}

export { SmoothScroll, SCROLL_HEADER_OFFSET };
