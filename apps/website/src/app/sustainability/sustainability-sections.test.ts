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

describe("SustainabilitySections", () => {
  it("focuses on selected solar-powered stations without unverified metrics", () => {
    const html = renderToStaticMarkup(createElement(SustainabilitySections));

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Selected PETROSOL stations");
    expect(html).toContain("solar power");
    expect(html).toContain("ISO 14001:2015");
    expect(html).not.toMatch(/\b\d+%|\b\d+ stations/);
  });

  it("uses an honest photo placeholder and links to CSR", () => {
    const html = renderToStaticMarkup(createElement(SustainabilitySections));

    expect(html).toContain(
      'aria-label="PETROSOL solar-powered station photography coming soon"',
    );
    expect(html).toContain('href="/csr"');
    expect(html).toContain("Explore our CSR work");
  });
});
