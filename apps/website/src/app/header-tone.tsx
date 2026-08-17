"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SiteBrand } from "./site-brand";

/**
 * The homepage hero is a full-bleed video, so the header floats over it
 * transparently instead of capping it with the usual light band.
 *
 * `SiteShell` renders inside the root layout and cannot see the route on the
 * server, so the route check lives here. Children are passed through untouched
 * and stay server components; only the tone decision ships to the client.
 */
function useOverlayTone() {
  return usePathname() === "/";
}

function HeaderTone({ children }: { children: ReactNode }) {
  return (
    <div
      className="group/tone contents"
      data-tone={useOverlayTone() ? "overlay" : "light"}
    >
      {children}
    </div>
  );
}

/** Dark lockup on the light chrome, white lockup over the hero video. */
function SiteBrandAuto({ size }: { size?: "desktop" | "mobile" }) {
  return <SiteBrand tone={useOverlayTone() ? "overlay" : "default"} size={size} />;
}

export { HeaderTone, SiteBrandAuto };
