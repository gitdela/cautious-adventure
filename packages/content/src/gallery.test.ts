import { describe, expect, it } from "vitest";

import { toGalleryEvent } from "./mappers";

/** Shape of one row from `galleryEventsQuery`. */
const row = {
  _id: "galleryEvent-gal-oilgas-awards-2025",
  title: "Ghana Oil and Gas Awards",
  slug: "gal-oilgas-awards-2025",
  kind: "photos",
  stream: "event",
  series: null,
  eventDate: "2025-01-01",
  coverImage: null,
  photos: null,
  excerpt: null,
  body: null,
  caption: null,
  muxPlaybackId: null,
  posterTime: null,
};

describe("toGalleryEvent", () => {
  it("maps a photos row onto the view model", () => {
    expect(toGalleryEvent(row as never)).toEqual({
      id: "galleryEvent-gal-oilgas-awards-2025",
      slug: "gal-oilgas-awards-2025",
      title: "Ghana Oil and Gas Awards",
      kind: "photos",
      stream: "event",
      series: null,
      year: "2025",
      coverImage: null,
      photos: [],
      excerpt: null,
      body: [],
      caption: null,
      muxPlaybackId: null,
      posterTime: 0,
    });
  });

  // The stored day is a stand-in wherever the real one was never recorded, so
  // the view model exposes the year and nothing finer.
  it("derives the year from the date", () => {
    expect(
      toGalleryEvent({ ...row, eventDate: "2023-06-14" } as never).year,
    ).toBe("2023");
  });

  it("gives community work no year at all", () => {
    const community = { ...row, stream: "community", eventDate: null };
    expect(toGalleryEvent(community as never).year).toBeNull();
  });

  it("preserves the PWN series classification", () => {
    expect(toGalleryEvent({ ...row, series: "pwn" } as never).series).toBe(
      "pwn",
    );
  });

  it("preserves the industry leadership series classification", () => {
    expect(
      toGalleryEvent({ ...row, series: "industry-leadership" } as never).series,
    ).toBe("industry-leadership");
  });

  // Without a date there is no pill to file the row under, so it would vanish
  // from the page. Better to fail here than to lose it quietly.
  it("rejects a dated event with no date", () => {
    expect(() =>
      toGalleryEvent({ ...row, eventDate: null } as never),
    ).toThrow();
  });

  it("rejects an event with no slug", () => {
    expect(() => toGalleryEvent({ ...row, slug: null } as never)).toThrow();
  });

  // Sanity's `hidden` does not clear a field, so an event switched away from
  // video keeps its playback ID on the document. The mapper is where it stops.
  it("drops the leftovers of a kind the event no longer is", () => {
    const wasVideo = {
      ...row,
      kind: "photos",
      caption: "Watch the promo film",
      muxPlaybackId: "cyNPy702EdGZOe00mv9Pc1gG",
      posterTime: 12,
      excerpt: "An old write-up.",
    };
    const mapped = toGalleryEvent(wasVideo as never);

    expect(mapped.muxPlaybackId).toBeNull();
    expect(mapped.caption).toBeNull();
    expect(mapped.posterTime).toBe(0);
    expect(mapped.excerpt).toBeNull();
  });

  it("keeps story copy on a story row", () => {
    const story = {
      ...row,
      kind: "story",
      excerpt: "A short summary.",
      body: [{ _type: "block", _key: "a", children: [] }],
    };
    const mapped = toGalleryEvent(story as never);

    expect(mapped.excerpt).toBe("A short summary.");
    expect(mapped.body).toHaveLength(1);
  });

  // The rows map over this to render tiles, so an absent reel has to be an
  // empty list rather than undefined.
  it("falls back to an empty photo reel", () => {
    expect(toGalleryEvent(row as never).photos).toEqual([]);
  });

  // An editor can fill in alt text and never pick a file, leaving a truthy
  // image with no asset behind it. The URL builder throws on those, so they
  // have to be treated as absent here rather than at every render site.
  it("treats an image with no uploaded file as absent", () => {
    const altOnly = {
      ...row,
      coverImage: { _type: "image", alt: "Women in Leadership Conference" },
    };
    expect(toGalleryEvent(altOnly as never).coverImage).toBeNull();
  });

  it("drops photos with no uploaded file from the reel", () => {
    const mixed = {
      ...row,
      photos: [
        { _type: "image", alt: "Real", asset: { _ref: "image-abc" } },
        { _type: "image", alt: "Alt filled in, no file chosen" },
      ],
    };
    // The count drives "+N more" and the lightbox counter, so it has to match
    // what can actually be shown.
    expect(toGalleryEvent(mixed as never).photos).toHaveLength(1);
  });

  // A shoot produces stills alongside the film, so photos are NOT one of the
  // fields stripped by kind — the video row offers them next to the play button.
  it("keeps the reel on a video event", () => {
    const video = {
      ...row,
      kind: "video",
      caption: "Watch the promo film",
      muxPlaybackId: "cyNPy702EdGZOe00mv9Pc1gG",
      photos: [
        { _type: "image", alt: "Still 1", asset: { _ref: "image-abc" } },
        { _type: "image", alt: "Still 2", asset: { _ref: "image-def" } },
      ],
    };
    const mapped = toGalleryEvent(video as never);

    expect(mapped.photos).toHaveLength(2);
    expect(mapped.muxPlaybackId).toBe("cyNPy702EdGZOe00mv9Pc1gG");
  });
});
