import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type {
  FuelProductView,
  PumpPriceBoardView,
} from "@workspace/content";

vi.mock("next/image", () => ({
  default: (rawProps: Record<string, unknown>) => {
    const props = { ...rawProps };
    const src = props.src;
    delete props.fill;
    delete props.priority;

    return createElement("img", {
      ...props,
      src: typeof src === "string" ? src : "/mock-static-image.webp",
    });
  },
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => createElement("a", { ...props, href }, children),
}));

// Radix resolves a second React patch version in this dirty workspace. The
// production build still exercises the real Button; this server-render test
// replaces only the asChild slot so it can focus on the fuels-page contract.
vi.mock("@workspace/ui/components/button", async () => {
  const { createElement: createReactElement } = await import("react");

  return {
    Button: ({
      asChild,
      children,
      ...props
    }: {
      asChild?: boolean;
      children: ReactNode;
      variant?: string;
      [key: string]: unknown;
    }) => {
      delete props.variant;
      return asChild
        ? children
        : createReactElement("button", props, children);
    },
  };
});

vi.mock("@/lib/content-adapters", () => ({
  contentAdapters: {
    Image: ({ alt }: { alt: string }) =>
      createElement("img", { alt, src: "/mock-cms-image.webp" }),
  },
}));

const { FuelSections } = await import("./fuel-sections");

const products: FuelProductView[] = [
  {
    id: "fuelProduct-petrol",
    slug: "petrol",
    name: "Petrol",
    eyebrow: "Gasoline / Premium",
    image: { alt: "PETROSOL petrol pump refuelling a vehicle" } as never,
  },
  {
    id: "fuelProduct-diesel",
    slug: "diesel",
    name: "Diesel",
    eyebrow: "Gasoil / Automotive Gasoil",
    image: { alt: "Petroleum storage tanks" } as never,
  },
];

const priceBoard: PumpPriceBoardView = {
  updatedAt: "2026-08-21T08:00:00Z",
  prices: [
    { fuel: "Petrol", amount: 12.5 },
    { fuel: "Diesel", amount: 13.1 },
  ],
};

function render(
  productRows: FuelProductView[] = products,
  board: PumpPriceBoardView | null = priceBoard,
) {
  return renderToStaticMarkup(
    createElement(FuelSections, { products: productRows, priceBoard: board }),
  );
}

describe("FuelSections", () => {
  it("combines both products into one approved fuel story", () => {
    const html = render();

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Quality fuel, full quantity,");
    expect(html).toContain("one promise");
    expect(html).toContain("From depot to station and ultimately");
    expect(html).toContain('data-fuel-product="petrol"');
    expect(html).toContain('data-fuel-product="diesel"');
    expect(html).toContain("Full Quantity");
    expect(html).toContain("Product Integrity");
    expect(html).toContain("Responsible Performance");
  });

  it("renders the live price rail when a board is available", () => {
    const html = render();

    expect(html).toContain('aria-label="Current pump prices"');
    expect(html).toContain("At the pump today");
    expect(html).toContain("₵12.50");
    expect(html).toContain("₵13.10");
  });

  it("omits the price rail and handles an empty product result", () => {
    const html = render([], null);

    expect(html).not.toContain('aria-label="Current pump prices"');
    expect(html).toContain("Fuel details are being updated");
    expect(html).toContain("PETROSOL service station forecourt");
  });

  it("uses a neutral fallback when one product image is missing", () => {
    const html = render([{ ...products[0], image: null }], null);

    expect(html).toContain('data-fuel-product="petrol"');
    expect(html).toContain("Petrol product photo unavailable");
    expect(html).not.toContain('data-fuel-product="diesel"');
  });
});
