import { describe, expect, it } from "vitest";

import { formatCedis, formatPumpDate } from "./format";
import { toFuelProduct } from "./mappers";

/** Shape of one row from `fuelProductsQuery`. */
const row = {
  _id: "fuelProduct-petrol",
  name: "Petrol",
  slug: "petrol",
  eyebrow: "Gasoline / Premium",
  image: null,
};

describe("toFuelProduct", () => {
  it("maps a full row onto the view model", () => {
    expect(toFuelProduct(row as never)).toEqual({
      id: "fuelProduct-petrol",
      slug: "petrol",
      name: "Petrol",
      eyebrow: "Gasoline / Premium",
      image: null,
    });
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
