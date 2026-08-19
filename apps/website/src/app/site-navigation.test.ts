import { describe, expect, it } from "vitest";

import { footerGroups, navigationItems } from "./site-navigation";

describe("site navigation", () => {
  it("prioritizes customer tasks in the approved order", () => {
    expect(navigationItems).toEqual([
      {
        label: "Products & Services",
        children: [
          { label: "Fuels", href: "/fuels" },
          { label: "Lubricants", href: "/lubricants" },
          { label: "Fuel Delivery", href: "/fuel-delivery" },
        ],
      },
      {
        label: "At Our Stations",
        children: [
          { label: "Find a Station", href: "/find-a-station" },
          { label: "FULLCARE Vehicle Services", href: "/fullcare-vehicle-services" },
          { label: "Shops & Convenience", href: "/shops-and-convenience" },
        ],
      },
      {
        label: "About",
        children: [
          { label: "Who We Are", href: "/who-we-are" },
          { label: "Leadership Team", href: "/leadership-team" },
          { label: "Board of Directors", href: "/board-of-directors" },
          { label: "Awards & Recognition", href: "/awards-and-recognition" },
          { label: "Sustainability & Community", href: "/sustainability-and-community" },
        ],
      },
      {
        label: "Blog & Events",
        children: [
          { label: "Events", href: "/events" },
          { label: "Blog", href: "/blog" },
        ],
      },
      { label: "Contact Us", href: "/contact-us" },
    ]);
  });

  it("keeps footer discovery groups independent from the header", () => {
    expect(footerGroups.map(({ title }) => title)).toEqual([
      "Company",
      "Products & Services",
      "At Our Stations",
      "Responsibility",
      "Blog & Events",
    ]);
    expect(footerGroups).not.toEqual(navigationItems);
    expect(footerGroups.at(-1)?.items).toEqual([
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact-us" },
    ]);
  });
});
