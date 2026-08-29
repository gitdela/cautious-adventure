import { describe, expect, it } from "vitest";

import {
  FADE_MS,
  HERO_MEDIA,
  nextHeroMediaIndex,
  previousHeroMediaIndex,
  STILL_ADVANCE_MS,
  STILL_SLOT_MS,
} from "./hero-media-config";

describe("homepage hero media sequence", () => {
  it("opens on the two PLC photos, then plays both videos and lubricant photos", () => {
    expect(HERO_MEDIA.map(({ kind }) => kind)).toEqual([
      "image",
      "image",
      "video",
      "video",
      "image",
      "image",
    ]);
    expect(
      HERO_MEDIA.filter((item) => item.kind === "image").map(
        ({ src }) => src,
      ),
    ).toEqual([
      "/images/home/plc-team.webp",
      "/images/home/plc-frame.webp",
      "/images/lubricants/lube-bay-technician.webp",
      "/images/lubricants/lube-bay-oil-pour.webp",
    ]);
  });

  // A packshot on a white cyclorama used to close the sequence. Full-bleed
  // behind light hero copy it blew the frame out, so the hero carries scenes
  // only — product photography belongs on /lubricants.
  it("carries no white-background packshots", () => {
    expect(HERO_MEDIA.map((item) => (item.kind === "image" ? item.src : ""))).not.toContain(
      "/images/lubricants/platinum-plus-10w40.webp",
    );
  });

  it("gives each still a ten-second slot with a final crossfade", () => {
    expect(STILL_SLOT_MS).toBe(10_000);
    expect(STILL_ADVANCE_MS).toBe(STILL_SLOT_MS - FADE_MS);
  });

  it("wraps from the final photo to the opening station image", () => {
    expect(nextHeroMediaIndex(HERO_MEDIA.length - 1)).toBe(0);
  });

  // The controls loop both ways, so "previous" from the opening item has to
  // land on the last one rather than on -1.
  it("wraps backwards from the opening item to the final one", () => {
    expect(previousHeroMediaIndex(0)).toBe(HERO_MEDIA.length - 1);
    expect(previousHeroMediaIndex(2)).toBe(1);
  });
});
