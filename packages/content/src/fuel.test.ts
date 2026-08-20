import { describe, expect, it } from "vitest";

import { formatCedis, formatPumpDate } from "./format";
import { toFuelProduct } from "./mappers";

/** Shape of one row from `fuelProductsQuery`. */
const row = {
  _id: "fuelProduct-petrol",
  name: "Petrol",
  slug: "petrol",
  eyebrow: "Gasoline / Premium",
  heading: "Petrol that arrives as clean as it",
  highlight: "left the depot",
  body: ["First paragraph.", "Second paragraph."],
  image: null,
};

describe("toFuelProduct", () => {
  it("maps a full row onto the view model", () => {
    expect(toFuelProduct(row as never)).toEqual({
      id: "fuelProduct-petrol",
      slug: "petrol",
      name: "Petrol",
      eyebrow: "Gasoline / Premium",
      heading: "Petrol that arrives as clean as it",
      highlight: "left the depot",
      body: ["First paragraph.", "Second paragraph."],
      image: null,
    });
  });

  // The section renders one <p> per entry, so an absent body has to be an empty
  // list rather than undefined.
  it("falls back to an empty body", () => {
    expect(toFuelProduct({ ...row, body: null } as never).body).toEqual([]);
  });

  it("rejects a product with no slug", () => {
    expect(() => toFuelProduct({ ...row, slug: null } as never)).toThrow();
  });
});

describe("formatCedis", () => {
  it.each([
    [9.8, "₵9.80"],
    [16, "₵16.00"],
    [11.2, "₵11.20"],
  ])("%s → %s", (amount, expected) => {
    expect(formatCedis(amount)).toBe(expected);
  });
});

describe("formatPumpDate", () => {
  // Both pump-price surfaces share this, so the shape is worth pinning down.
  it("renders an ISO datetime as a short day/month/year", () => {
    expect(formatPumpDate("2026-07-27T10:30:00Z")).toBe("27 Jul 2026");
  });
});
