import { describe, expect, it } from "vitest";

import { formatGrade } from "./format";
import { toLubricantCategory, toLubricantProduct } from "./mappers";

/** Shape of one row from `lubricantProductsQuery`. */
const row = {
  _id: "lubricantProduct-plus-5w30",
  name: "Platinum Plus 5w30 FE",
  slug: "platinum-plus-5w30-fe",
  grade: "SAE 5W-30 · pure synthetic",
  standard: "API SN-Plus/CF · ACEA C2/C3",
  applications: "Today's high-tech, low-emissions engines",
  drainInterval: "Up to 10,000 km",
  benefits: ["Quick lubrication on start-up", "Increased fuel efficiency"],
  image: null,
  featuredOnHome: true,
  category: { title: "Engine oils", slug: "engine-oils" },
};

describe("toLubricantProduct", () => {
  it("maps a full row onto the view model, title-casing the grade", () => {
    expect(toLubricantProduct(row as never)).toEqual({
      id: "lubricantProduct-plus-5w30",
      slug: "platinum-plus-5w30-fe",
      name: "Platinum Plus 5w30 FE",
      category: { title: "Engine oils", slug: "engine-oils" },
      grade: "SAE 5W-30 · Pure Synthetic",
      standard: "API SN-Plus/CF · ACEA C2/C3",
      applications: "Today's high-tech, low-emissions engines",
      drainInterval: "Up to 10,000 km",
      benefits: ["Quick lubrication on start-up", "Increased fuel efficiency"],
      image: null,
      featuredOnHome: true,
    });
  });

  // Absent means "not featured" — the home band must not treat undefined as a
  // pick, which is what a raw pass-through would do.
  it("treats an unset home flag as not featured", () => {
    expect(
      toLubricantProduct({ ...row, featuredOnHome: null } as never)
        .featuredOnHome,
    ).toBe(false);
  });

  // The spec sheet omits the drain-interval row entirely when it is absent,
  // so an undefined field has to arrive as null rather than `undefined`.
  it("normalises a missing drain interval to null", () => {
    const product = toLubricantProduct({
      ...row,
      drainInterval: null,
    } as never);
    expect(product.drainInterval).toBeNull();
  });

  it("falls back to an empty benefits list", () => {
    expect(toLubricantProduct({ ...row, benefits: null } as never).benefits).toEqual(
      [],
    );
  });

  // The filter compares product.category.slug against the chip's slug, so a
  // category saved without one must fail here rather than silently drop the
  // product out of every filtered view.
  it("rejects a product whose category has no slug", () => {
    expect(() =>
      toLubricantProduct({ ...row, category: { title: "Engine oils" } } as never),
    ).toThrow(/category\.slug/);
  });

  it("rejects a product with no slug", () => {
    expect(() => toLubricantProduct({ ...row, slug: null } as never)).toThrow();
  });
});

describe("formatGrade", () => {
  // Every grade in the catalogue, so the rule is checked against real copy
  // rather than invented examples.
  it.each([
    ["SAE 0W-20 · full synthetic", "SAE 0W-20 · Full Synthetic"],
    ["SAE 40 · heavy duty", "SAE 40 · Heavy Duty"],
    ["SAE 5W-30 · pure synthetic", "SAE 5W-30 · Pure Synthetic"],
    ["SAE 10W-40 · pure synthetic", "SAE 10W-40 · Pure Synthetic"],
    ["SAE 20W-50 multigrade", "SAE 20W-50 Multigrade"],
    ["SAE 15W-40 · universal diesel", "SAE 15W-40 · Universal Diesel"],
    ["SAE 15W-40 · heavy duty diesel", "SAE 15W-40 · Heavy Duty Diesel"],
    ["SAE 80W-90 & 85W-140 · full synthetic", "SAE 80W-90 & 85W-140 · Full Synthetic"],
    ["Dexron VI · pure synthetic", "Dexron VI · Pure Synthetic"],
    ["Ready-to-use coolant & antifreeze", "Ready-to-use Coolant & Antifreeze"],
  ])("%s → %s", (input, expected) => {
    expect(formatGrade(input)).toBe(expected);
  });

  // The point of the digit/uppercase guard: specification codes are not prose
  // and must survive untouched.
  it.each(["SAE 20W-50 · 4T", "DOT 4", "SAE 40 · Heavy Duty"])(
    "leaves %s alone",
    (grade) => {
      expect(formatGrade(grade)).toBe(grade);
    },
  );
});

describe("toLubricantCategory", () => {
  it("maps a category row and normalises a missing description", () => {
    expect(
      toLubricantCategory({
        _id: "lubricantCategory-engine-oils",
        title: "Engine oils",
        slug: "engine-oils",
        description: null,
      } as never),
    ).toEqual({
      id: "lubricantCategory-engine-oils",
      slug: "engine-oils",
      title: "Engine oils",
      description: null,
    });
  });
});
