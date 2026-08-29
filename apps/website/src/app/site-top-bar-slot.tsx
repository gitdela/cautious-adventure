"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@workspace/ui/lib/utils";

import { useMobileNavOpen } from "@/lib/mobile-nav-open";

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
 *
 * It stands down while the mobile menu is open. The menu renders inside the
 * site header, which is `relative z-40` and therefore its own stacking context
 * — so the menu's `z-50` is scoped to that context and can never rise above
 * this bar's `z-50`, which sits outside it. Hiding the bar is both the fix and
 * the better behaviour: a price ticker has no business over an open menu.
 */
function topBarClassName(navOpen: boolean) {
  return cn(
    "relative z-50 hidden h-9 w-full overflow-hidden border-b border-white/15 bg-navy-900",
    // Dropping the `block` leaves the base `hidden` to win, so the bar goes
    // away without the element being unmounted.
    !navOpen && "group-data-[tone=overlay]/tone:block",
  );
}

function SiteTopBarSlot() {
  const navOpen = useMobileNavOpen();

  return (
    <div
      ref={setTarget}
      data-site-top-bar
      // Left mounted rather than removed, so the portalled marquee keeps its
      // target and does not tear down and rebuild on every menu toggle.
      className={topBarClassName(navOpen)}
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

export { SiteTopBarPortal, SiteTopBarSlot, topBarClassName };
