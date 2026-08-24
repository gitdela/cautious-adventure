import { describe, expect, it } from "vitest";

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

  // The station figure is the one number that appears in several places in the
  // source profile. The page states the floor every source supports, so this
  // pins it against a well-meant edit back to an unsourced 115.
  it("claims over 100 stations, the figure every source supports", () => {
    const retail = businessLines.find(
      ({ title }) => title === "Retail network",
    );

    expect(retail?.description).toContain("Over 100 stations");
  });

  // An unqualified GHS 1.3bn beside three present-tense figures reads as an
  // annual total. It is eleven years of cumulative payments.
  it("dates the cumulative tax figure", () => {
    const tax = impactStats.find(([value]) => value.includes("GHS"));

    expect(tax?.[1]).toContain("2014–2024");
  });

  // These were one list, which put the EPA beside the AGI and implied PETROSOL
  // was a member of its own regulator.
  it("keeps regulators out of the membership list", () => {
    expect(memberships.join(" ")).not.toMatch(/EPA|NPA|GIPC/);
    expect(registrations.join(" ")).toMatch(/EPA/);
  });
});
