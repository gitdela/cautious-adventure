"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the full-screen mobile menu is open, shared outside the React tree.
 *
 * The menu is rendered inside the site header, and the price marquee's top bar
 * is a sibling *above* that header — so the two cannot coordinate through
 * props or context without lifting state through `@workspace/ui`'s chrome,
 * which is deliberately routing- and state-agnostic. A module store keeps the
 * shared package clean.
 *
 * Same shape as the portal target store in `site-top-bar-slot.tsx`.
 */
let open = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return open;
}

/** The menu is always shut on first paint. */
function getServerSnapshot() {
  return false;
}

function setMobileNavOpen(next: boolean) {
  if (open === next) return;
  open = next;
  listeners.forEach((listener) => listener());
}

function useMobileNavOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export { setMobileNavOpen, useMobileNavOpen };
