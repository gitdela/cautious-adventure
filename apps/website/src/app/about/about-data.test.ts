import { describe, expect, it } from "vitest";

import { operatingCulture, values } from "./about-data";

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

  it("gives every value exactly four day-to-day behaviors", () => {
    expect(values.every(({ behaviors }) => behaviors.length === 4)).toBe(true);
  });
});
