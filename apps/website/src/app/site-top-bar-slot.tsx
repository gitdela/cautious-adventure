"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Listener = () => void;

let target: HTMLDivElement | null = null;
const listeners = new Set<Listener>();

function setTarget(node: HTMLDivElement | null) {
  if (target === node) return;
  target = node;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return target;
}

function getServerSnapshot() {
  return null;
}

/**
 * Full-bleed strip above the homepage header. It reserves its height during
 * server rendering so the overlaid header and hero do not shift on hydration.
 */
function SiteTopBarSlot() {
  return (
    <div
      ref={setTarget}
      data-site-top-bar
      className="relative z-50 hidden h-9 w-full overflow-hidden border-b border-white/15 bg-navy-900 group-data-[tone=overlay]/tone:block"
    />
  );
}

/** Keeps homepage-owned price data out of the global site shell. */
function SiteTopBarPortal({ children }: { children: ReactNode }) {
  const portalTarget = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return portalTarget ? createPortal(children, portalTarget) : null;
}

export { SiteTopBarPortal, SiteTopBarSlot };
