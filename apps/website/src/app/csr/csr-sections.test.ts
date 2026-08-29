import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (rawProps: Record<string, unknown>) => {
    const props = { ...rawProps };
    delete props.fill;
    delete props.priority;
    return createElement("img", props);
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

const { CsrSections } = await import("./csr-sections");

describe("CsrSections", () => {
  it("keeps the page focused on community investment", () => {
    const html = renderToStaticMarkup(
      createElement(CsrSections, { events: [] }),
    );

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Corporate social responsibility");
    expect(html).toContain("Healthcare support");
    expect(html).toContain("Education &amp; opportunity");
    expect(html).toContain("Public safety");
    expect(html).toContain("Emergency response");
    expect(html).not.toContain("Solar-powered stations");
  });

  it("preserves the community gallery state and links to sustainability", () => {
    const html = renderToStaticMarkup(
      createElement(CsrSections, { events: [] }),
    );

    expect(html).toContain("No community stories yet");
    expect(html).toContain('href="/sustainability"');
  });
});
