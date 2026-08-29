import { describe, expect, it } from "vitest";

import { toNationalLeadershipProfile } from "./mappers";

const profile = {
  _id: "national-leadership-michael-bozumbil",
  personName: "Michael Bozumbil",
  petrosolRole: "Chief Executive Officer",
  profileSlug: "michael-bozumbil",
  photo: null,
  appointments: [
    {
      _key: "gea",
      institution: "Ghana Employers' Association",
      position: "First Vice President",
      status: "current",
      tenure: "2024–present",
      summary: "Represents employers in national business and labour dialogue.",
      sourceUrl: null,
    },
    {
      _key: "aomc",
      institution: "Association of Oil Marketing Companies",
      position: "Vice Chairman",
      status: "former",
      tenure: "2016–2020",
      summary: "Supported sector coordination and industry oversight.",
      sourceUrl: null,
    },
  ],
} as const;

describe("toNationalLeadershipProfile", () => {
  it("maps the person and preserves current/former appointments", () => {
    const result = toNationalLeadershipProfile(profile as never);

    expect(result.name).toBe("Michael Bozumbil");
    expect(result.profileSlug).toBe("michael-bozumbil");
    expect(result.appointments.map(({ status }) => status)).toEqual([
      "current",
      "former",
    ]);
  });
});
