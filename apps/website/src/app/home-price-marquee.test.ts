import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { PumpPriceBoardView } from "@workspace/content";

import { PumpPriceTicker } from "./home-price-marquee";
import { SiteTopBarSlot } from "./site-top-bar-slot";

const board: PumpPriceBoardView = {
  updatedAt: "2026-07-27T10:30:00Z",
  prices: [
    { fuel: "Petrol", amount: 12.5 },
    { fuel: "Diesel", amount: 13.1 },
  ],
};

describe("homepage pump-price marquee", () => {
  it("renders one accessible summary and two seamless visual passes", () => {
    const html = renderToStaticMarkup(
      createElement(PumpPriceTicker, { board }),
    );

    expect(html).toContain('aria-label="Current pump prices"');
    expect(html).toContain(
      "Current pump prices. Petrol: ₵12.50 GHS per litre. Diesel: ₵13.10 GHS per litre. Effective 27 Jul 2026.",
    );
    expect(html.match(/data-price-marquee-pass/g)).toHaveLength(2);
    expect(html).toContain('dateTime="2026-07-27"');
    expect(html).toContain("ps-price-marquee-track");
    expect(html).toContain("[--marquee-duration:28s]");
  });

  it("reserves a full-bleed strip above the overlay header", () => {
    const html = renderToStaticMarkup(createElement(SiteTopBarSlot));

    expect(html).toContain("data-site-top-bar");
    expect(html).toContain("h-9");
    expect(html).toContain("w-full");
    expect(html).toContain("bg-navy-900");
  });
});
