import { describe, expect, it } from "vitest";

import { toStation, toStationTerritory } from "./mappers";

/** Shape of one row from `stationsQuery`. */
const row = {
  _id: "station-garu-no-2",
  name: "PETROSOL Garu No.2 Station",
  slug: "petrosol-garu-no-2-station",
  manager: "Vincent Sekle",
  phones: ["0248376729"],
  amenities: ["shop", "washroom", "fullcare"],
  territory: { name: "North East Territory", slug: "north-east-territory" },
};

describe("toStation", () => {
  it("maps a full row onto the view model", () => {
    expect(toStation(row as never)).toEqual({
      id: "station-garu-no-2",
      slug: "petrosol-garu-no-2-station",
      name: "PETROSOL Garu No.2 Station",
      territory: { name: "North East Territory", slug: "north-east-territory" },
      manager: "Vincent Sekle",
      phones: ["0248376729"],
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

  // The dropdown filters on territory slug, so a territory saved without one
  // would silently hide every station under it.
  it("rejects a station whose territory has no slug", () => {
    expect(() =>
      toStation({ ...row, territory: { name: "North East" } } as never),
    ).toThrow(/territory\.slug/);
  });

  it("rejects a station with no slug", () => {
    expect(() => toStation({ ...row, slug: null } as never)).toThrow();
  });
});

describe("toStationTerritory", () => {
  it("maps a territory row", () => {
    expect(
      toStationTerritory({
        _id: "stationTerritory-ashanti",
        name: "Ashanti Territory",
        slug: "ashanti-territory",
      } as never),
    ).toEqual({
      id: "stationTerritory-ashanti",
      slug: "ashanti-territory",
      name: "Ashanti Territory",
    });
  });
});
