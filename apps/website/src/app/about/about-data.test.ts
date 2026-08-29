import { describe, expect, it } from "vitest";

import { RETAIL_NETWORK_SIZE } from "@/lib/company";

import {
  businessLines,
  customerPromises,
  impactStats,
  memberships,
  milestones,
  operatingCulture,
  registrations,
  values,
} from "./about-data";

describe("about page data", () => {
  it("defines the operating culture in the specified order", () => {
    expect(operatingCulture.map(({ title }) => title)).toEqual([
      "High Quality",
      "Full Quantity",
      "Fair Pricing",
    ]);
  });

  it("defines six numbered values in the specified order", () => {
    expect(values.map(({ number, title }) => [number, title])).toEqual([
      ["01", "Integrity"],
      ["02", "Leadership"],
      ["03", "Professionalism"],
      ["04", "Service"],
      ["05", "Sustainability"],
      ["06", "Empathy"],
    ]);
  });

  // The page renders `summary` only, but the fuller definitions are kept for a
  // future culture page. This guards them against being quietly dropped.
  it("keeps the full definition and four behaviors on every value", () => {
    expect(
      values.every(
        ({ meaning, behaviors }) => meaning.length > 0 && behaviors.length === 4,
      ),
    ).toBe(true);
  });

  it("defines the six cardinal pillars in the profile's order", () => {
    expect(customerPromises.map(({ title }) => title)).toEqual([
      "Full Value",
      "Clean Fuel",
      "Helpful & Honest People",
      "Available Products",
      "Clean & Safe Environment",
      "Fair Prices",
    ]);
  });

  it("runs the story from the 2006 founding to the 2025 PLC, in order", () => {
    const years = milestones.map(({ year }) => year);

    expect(years[0]).toBe("2006");
    expect(years.at(-1)).toBe("2025");
    expect([...years].sort()).toEqual(years);
  });

  it("covers the three business lines and links each one onward", () => {
    expect(businessLines.map(({ title }) => title)).toEqual([
      "Retail network",
      "Corporate & mining",
      "Lubricants",
    ]);
    expect(businessLines.every(({ href }) => href.startsWith("/"))).toBe(true);
  });

  // The station figure appears on the home page and in the footer too, so it is
  // owned by RETAIL_NETWORK_SIZE rather than written out per page. Asserting
  // against the constant keeps this honest without re-freezing a literal, which
  // is how the site ended up quoting 100 and 115 at the same time.
  it("states the confirmed network size on the retail business line", () => {
    const retail = businessLines.find(
      ({ title }) => title === "Retail network",
    );

    expect(retail?.description).toContain(`${RETAIL_NETWORK_SIZE} stations`);
  });

  // An unqualified GHS 1.3bn beside three present-tense figures reads as an
  // annual total. It is eleven years of cumulative payments.
  it("dates the cumulative tax figure", () => {
    const tax = impactStats.find(([value]) => value.includes("GHS"));

    expect(tax?.[1]).toContain("2014–2024");
  });

  // These were one list, which put regulators beside professional bodies and
  // implied PETROSOL was a member of them.
  it("keeps regulators out of the membership list", () => {
    expect(memberships.join(" ")).not.toMatch(/EPA|NPA|GIPA/);
    expect(registrations.join(" ")).not.toMatch(/EPA|GIPA/);
    expect(registrations.join(" ")).toMatch(/NPA|Minerals Commission/);
  });
});
