import { describe, expect, it } from "vitest";

import { toTeamMemberFull, toTeamMemberSummary } from "./mappers";

/** Shape of one row from `teamMembersByGroupQuery`. */
const row = {
  _id: "team.ceo",
  name: "Michael Bozumbil",
  slug: "michael-bozumbil",
  role: "Chief Executive Officer",
  groups: ["leadership", "board"],
  photo: null,
  shortBio: "Leads PETROSOL.",
  quote: null,
  featured: true,
};

describe("toTeamMemberSummary", () => {
  it("maps a full row onto the view model", () => {
    expect(toTeamMemberSummary(row as never)).toEqual({
      id: "team.ceo",
      slug: "michael-bozumbil",
      name: "Michael Bozumbil",
      role: "Chief Executive Officer",
      groups: ["leadership", "board"],
      photo: null,
      shortBio: "Leads PETROSOL.",
      quote: null,
      featured: true,
    });
  });

  // A listing page uses this to tell its own featured person from someone
  // featured on the other page — the CEO is in both groups.
  it("carries groups so a page can identify its own featured member", () => {
    expect(toTeamMemberSummary(row as never).groups).toEqual([
      "leadership",
      "board",
    ]);
  });

  it("treats a missing `featured` as not featured", () => {
    const result = toTeamMemberSummary({ ...row, featured: null } as never);

    expect(result.featured).toBe(false);
  });

  it("normalises absent optional fields to null", () => {
    const result = toTeamMemberSummary({
      ...row,
      photo: undefined,
      shortBio: undefined,
    } as never);

    expect(result.photo).toBeNull();
    expect(result.shortBio).toBeNull();
  });

  // The slug is the profile page's URL, so a member saved without one must
  // fail here rather than render a link to nowhere.
  it("throws when the slug is missing", () => {
    expect(() => toTeamMemberSummary({ ...row, slug: null } as never)).toThrow();
  });

  it("throws when the slug is empty", () => {
    expect(() => toTeamMemberSummary({ ...row, slug: "" } as never)).toThrow();
  });
});

describe("toTeamMemberFull", () => {
  it("adds the groups and bio to the summary", () => {
    const result = toTeamMemberFull({
      ...row,
      groups: ["leadership", "board"],
      bio: [{ _type: "block", children: [] }],
    } as never);

    expect(result.name).toBe("Michael Bozumbil");
    // A person can serve in both — the CEO does.
    expect(result.groups).toEqual(["leadership", "board"]);
    expect(result.bio).toHaveLength(1);
  });

  it("defaults an unwritten bio to an empty array, not undefined", () => {
    const result = toTeamMemberFull({
      ...row,
      groups: ["board"],
      bio: null,
    } as never);

    expect(result.bio).toEqual([]);
  });

  it("defaults missing groups to an empty array", () => {
    const result = toTeamMemberFull({ ...row, groups: null, bio: null } as never);

    expect(result.groups).toEqual([]);
  });

  // The second photo is optional, so the profile page must be able to tell
  // "not set" apart from "set" rather than receiving undefined.
  it("normalises an absent second photo to null", () => {
    const result = toTeamMemberFull({
      ...row,
      groups: ["leadership"],
      coverPhoto: null,
      bio: null,
    } as never);

    expect(result.coverPhoto).toBeNull();
  });

  it("passes a second photo through when set", () => {
    const coverPhoto = { _type: "image", alt: "On site", asset: { _ref: "img" } };
    const result = toTeamMemberFull({
      ...row,
      groups: ["leadership"],
      coverPhoto,
      bio: null,
    } as never);

    expect(result.coverPhoto).toEqual(coverPhoto);
  });
});
