import { describe, expect, it } from "vitest";

import { toStation, toStationRegion } from "./mappers";

/** Shape of one row from `stationsQuery`. */
const row = {
  _id: "station-spintex",
  name: "PETROSOL Spintex Station",
  slug: "petrosol-spintex-station",
  manager: "Peter Bankole",
  phones: ["0501416172"],
  amenities: ["shop", "washroom", "fullcare"],
  region: { name: "Greater Accra", slug: "greater-accra" },
};

describe("toStation", () => {
  it("maps a full row onto the view model", () => {
    expect(toStation(row as never)).toEqual({
      id: "station-spintex",
      slug: "petrosol-spintex-station",
      name: "PETROSOL Spintex Station",
      region: { name: "Greater Accra", slug: "greater-accra" },
      manager: "Peter Bankole",
      phones: ["0501416172"],
      amenities: ["shop", "washroom", "fullcare"],
    });
  });

  // Most of the network has no confirmed facilities. That has to arrive as an
  // empty list so the directory can render no chips, rather than undefined.
  it("normalises unrecorded amenities to an empty list", () => {
    expect(toStation({ ...row, amenities: null } as never).amenities).toEqual([]);
  });

  it("keeps every phone number on a multi-line station", () => {
    const station = toStation({
      ...row,
      phones: ["0201151695", "0553131245"],
    } as never);
    expect(station.phones).toEqual(["0201151695", "0553131245"]);
  });

  // The dropdown filters on region slug, so a region saved without one would
  // silently hide every station under it.
  it("rejects a station whose region has no slug", () => {
    expect(() =>
      toStation({ ...row, region: { name: "Greater Accra" } } as never),
    ).toThrow(/region\.slug/);
  });

  // `region` is a required reference, but one pointing at a deleted document
  // dereferences to null. That must name the field, not blow up with a
  // TypeError halfway through the mapper.
  it("rejects a station whose region reference is unresolved", () => {
    expect(() => toStation({ ...row, region: null } as never)).toThrow(
      /region\.slug/,
    );
  });

  it("rejects a station with no slug", () => {
    expect(() => toStation({ ...row, slug: null } as never)).toThrow();
  });
});

describe("toStationRegion", () => {
  it("maps a region row", () => {
    expect(
      toStationRegion({
        _id: "stationRegion-ashanti",
        name: "Ashanti",
        slug: "ashanti",
      } as never),
    ).toEqual({
      id: "stationRegion-ashanti",
      slug: "ashanti",
      name: "Ashanti",
    });
  });
});
