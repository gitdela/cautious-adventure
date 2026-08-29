import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { setMobileNavOpen, useMobileNavOpen } from "@/lib/mobile-nav-open";

import { SiteTopBarSlot, topBarClassName } from "./site-top-bar-slot";

/**
 * The visibility rule is tested through `topBarClassName` rather than through a
 * render: `renderToStaticMarkup` reads `getServerSnapshot`, which always
 * reports the menu shut, so a rendered assertion would pass whether or not the
 * flag were wired up at all.
 */
describe("topBarClassName", () => {
  it("lets the bar show on the overlay-toned homepage when the menu is shut", () => {
    expect(topBarClassName(false)).toContain(
      "group-data-[tone=overlay]/tone:block",
    );
  });

  // The marquee's z-50 sits outside the header's z-40 stacking context, so the
  // menu can never paint over it — the bar has to stand down instead. Dropping
  // the `block` leaves the base `hidden` to win.
  it("stands the bar down while the mobile menu is open", () => {
    const open = topBarClassName(true);

    expect(open).not.toContain("group-data-[tone=overlay]/tone:block");
    expect(open).toContain("hidden");
  });
});

describe("mobile nav store", () => {
  it("reports shut during a server render, so the bar ships visible", () => {
    setMobileNavOpen(true);
    // Same path `SiteTopBarSlot` takes when rendered on the server.
    expect(renderToStaticMarkup(createElement(useMobileNavOpenProbe))).toBe(
      "false",
    );
    setMobileNavOpen(false);
  });
});

function useMobileNavOpenProbe() {
  return String(useMobileNavOpen());
}

describe("SiteTopBarSlot", () => {
  it("keeps the portal target mounted so the marquee is not torn down", () => {
    expect(renderToStaticMarkup(createElement(SiteTopBarSlot))).toContain(
      "data-site-top-bar",
    );
  });
});
