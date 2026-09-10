import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

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
      [key: string]: unknown;
    }) => (asChild ? children : createReactElement("button", props, children)),
  };
});

const { SustainabilitySections } = await import("./sustainability-sections");

const html = renderToStaticMarkup(createElement(SustainabilitySections));

describe("SustainabilitySections", () => {
  it("owns the page with a single hero h1 and the spec's copy spine", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Energizing a");
    expect(html).toContain("sustainable future");
    expect(html).toContain(
      "10 liters should remain 10 liters, regardless of which PETROSOL station a customer visits.",
    );
  });

  it("lists all three ISO certifications", () => {
    expect(html).toContain("ISO 9001:2015");
    expect(html).toContain("ISO 14001:2015");
    expect(html).toContain("ISO 45001:2018");
  });

  it("renders the five pillars in order, numbered without orphaned digits", () => {
    for (const number of ["01", "02", "03", "04", "05"]) {
      expect(html).toContain(`>${number}</span>`);
    }
    expect(html).toContain("Environmental Responsibility");
    expect(html).toContain("Community Impact");
  });

  it("ships the rooftop solar photography with no placeholders left over", () => {
    for (const file of [
      "solar-roof-station-canopy.webp",
      "solar-install-technicians.webp",
      "solar-array-platinum-yard.webp",
    ]) {
      expect(html).toContain(file);
    }
    expect(html).not.toContain("photography coming soon");
  });

  it("links to the CSR and stations pages from the closing bands", () => {
    expect(html).toContain('href="/csr"');
    expect(html).toContain('href="/find-a-station"');
    expect(html).toContain("Explore our CSR work");
    expect(html).toContain("Find a station");
  });

  it("renders no em dashes anywhere on the page", () => {
    expect(html).not.toContain("—");
  });
});
