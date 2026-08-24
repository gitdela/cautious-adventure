"use client";

import { useCallback, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Live `prefers-reduced-motion` reading, for gating motion in JS where CSS
 * cannot reach — stopping media downloads, skipping animation loops entirely.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    useCallback(() => window.matchMedia(REDUCED_MOTION_QUERY).matches, []),
    // Server render assumes reduced motion, so the HTML ships the still
    // fallback and motion mounts on hydration.
    useCallback(() => true, []),
  );
}

export { usePrefersReducedMotion };
