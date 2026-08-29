import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { GalleryEventView } from "@workspace/content";

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

vi.mock("@/lib/content-adapters", () => ({
  contentAdapters: {
    Image: ({ alt }: { alt: string }) =>
      createElement("img", { alt, src: "/mock-pwn-conference.webp" }),
  },
}));

vi.mock("../events/event-list", () => ({
  EventList: ({
    events,
    emptyTitle,
  }: {
    events: GalleryEventView[];
    emptyTitle: string;
  }) =>
    createElement(
      "div",
      { "data-event-list": true },
      events.length > 0
        ? events.map((event) =>
            createElement(
              "article",
              { key: event.id, "data-year": event.year },
              event.title,
            ),
          )
        : emptyTitle,
    ),
}));

const { DiversityAndInclusionSections } = await import(
  "./diversity-and-inclusion-sections"
);

const conference2026: GalleryEventView = {
  id: "galleryEvent-gal-wil-2025",
  slug: "gal-wil-2026",
  title: "Women in Leadership Conference, 2026",
  kind: "video",
  stream: "event",
  series: "pwn",
  year: "2026",
  coverImage: null,
  photos: [
    {
      _type: "image",
      alt: "Women at the PETROSOL Women in Leadership Conference",
      asset: { _ref: "image-pwn-2026" },
    } as never,
  ],
  excerpt: null,
  body: [],
  caption: null,
  muxPlaybackId: "public-playback-id",
  posterTime: 0,
};

const conference2024: GalleryEventView = {
  ...conference2026,
  id: "galleryEvent-gal-wil-2024",
  slug: "gal-wil-2024",
  title: "PETROSOL Women in Leadership Conference, 2024",
  kind: "story",
  year: "2024",
  photos: [],
  excerpt: "A conference for connection and professional growth.",
  muxPlaybackId: null,
};

describe("DiversityAndInclusionSections", () => {
  it("introduces PWN, its priorities, and its recognition", () => {
    const html = renderToStaticMarkup(
      createElement(DiversityAndInclusionSections, {
        conferences: [conference2026, conference2024],
      }),
    );

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("PETROSOL Women Network (PWN)");
    expect(html).toContain("Connection &amp; belonging");
    expect(html).toContain("Leadership development");
    expect(html).toContain(
      "Employer of the Year Championing Diversity and Inclusion",
    );
    expect(html).toContain('href="/leadership-team"');
  });

  it("uses the latest conference photo and keeps conferences newest first", () => {
    const html = renderToStaticMarkup(
      createElement(DiversityAndInclusionSections, {
        conferences: [conference2026, conference2024],
      }),
    );

    expect(html).toContain(
      'alt="Women at the PETROSOL Women in Leadership Conference"',
    );
    expect(html.indexOf("data-year=\"2026\"")).toBeLessThan(
      html.indexOf("data-year=\"2024\""),
    );
  });

  it("renders honest empty states before PWN records or photography arrive", () => {
    const html = renderToStaticMarkup(
      createElement(DiversityAndInclusionSections, { conferences: [] }),
    );

    expect(html).toContain(
      'aria-label="PETROSOL Women Network conference photography coming soon"',
    );
    expect(html).toContain("PWN conference stories are being prepared");
  });
});
