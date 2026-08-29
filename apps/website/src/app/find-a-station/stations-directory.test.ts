import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { StationRegionView, StationView } from "@workspace/content";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: unknown }) =>
    createElement("a", { href }, children as never),
}));

const {
  StationsDirectory,
  emptyMessage,
  serviceCoverage,
  serviceCoverageNote,
  visibleStations,
} = await import("./stations-directory");

const regions: StationRegionView[] = [
  { id: "stationRegion-greater-accra", slug: "greater-accra", name: "Greater Accra" },
  { id: "stationRegion-ashanti", slug: "ashanti", name: "Ashanti" },
];

function station(
  name: string,
  regionSlug: string,
  regionName: string,
  manager = "Ama Mensah",
  amenities: string[] = [],
): StationView {
  return {
    id: `station-${name}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    region: { slug: regionSlug, name: regionName },
    manager,
    phones: ["0501416172"],
    amenities,
  };
}

const stations: StationView[] = [
  // Both services recorded.
  station("PETROSOL Spintex Station", "greater-accra", "Greater Accra", "Ama Mensah", [
    "shop",
    "washroom",
  ]),
  // Only one recorded.
  station("PETROSOL Gbawe Station", "greater-accra", "Greater Accra", "Ama Mensah", [
    "shop",
  ]),
  // Nothing recorded — "unknown", not "has none".
  station("PETROSOL Nkawie Station", "ashanti", "Ashanti", "Eric Awusi"),
];

const noServices: string[] = [];

describe("visibleStations", () => {
  it("scopes to the selected region when there is no search", () => {
    const shown = visibleStations(stations, {
      region: "ashanti",
      query: "",
      services: noServices,
    });
    expect(shown.map((s) => s.name)).toEqual(["PETROSOL Nkawie Station"]);
  });

  // The surprising rule: a search ignores the dropdown entirely rather than
  // intersecting with it, so a station is findable without knowing its region.
  it("searches the whole network, overriding the selected region", () => {
    const shown = visibleStations(stations, {
      region: "greater-accra",
      query: "nkawie",
      services: noServices,
    });
    expect(shown.map((s) => s.name)).toEqual(["PETROSOL Nkawie Station"]);
  });

  it("matches on manager as well as station name", () => {
    const shown = visibleStations(stations, {
      region: "ashanti",
      query: "eric",
      services: noServices,
    });
    expect(shown).toHaveLength(1);
  });

  it("ignores surrounding whitespace and case in the query", () => {
    const shown = visibleStations(stations, {
      region: "ashanti",
      query: "  SPINTEX  ",
      services: noServices,
    });
    expect(shown.map((s) => s.name)).toEqual(["PETROSOL Spintex Station"]);
  });

  it("narrows to stations offering the selected service", () => {
    const shown = visibleStations(stations, {
      region: "greater-accra",
      query: "",
      services: ["washroom"],
    });
    expect(shown.map((s) => s.name)).toEqual(["PETROSOL Spintex Station"]);
  });

  // AND, not OR — a shop-only station drops out once washroom is added.
  it("requires every selected service, not just one of them", () => {
    const shop = visibleStations(stations, {
      region: "greater-accra",
      query: "",
      services: ["shop"],
    });
    expect(shop).toHaveLength(2);

    const both = visibleStations(stations, {
      region: "greater-accra",
      query: "",
      services: ["shop", "washroom"],
    });
    expect(both.map((s) => s.name)).toEqual(["PETROSOL Spintex Station"]);
  });

  // The load-bearing one: an empty amenity list means "not recorded", so such a
  // station cannot satisfy a service filter.
  it("excludes stations with no recorded services", () => {
    const shown = visibleStations(stations, {
      region: "ashanti",
      query: "",
      services: ["shop"],
    });
    expect(shown).toEqual([]);
  });

  // Unlike region, a service narrows a search rather than being ignored by it.
  it("intersects with a search instead of being overridden by it", () => {
    const shown = visibleStations(stations, {
      region: "ashanti",
      query: "petrosol",
      services: ["washroom"],
    });
    expect(shown.map((s) => s.name)).toEqual(["PETROSOL Spintex Station"]);
  });
});

describe("serviceCoverage", () => {
  it("counts how many stations have any service recorded", () => {
    expect(serviceCoverage(stations)).toEqual({ recorded: 2, total: 3 });
  });
});

describe("serviceCoverageNote", () => {
  it("stays silent when no service filter is active", () => {
    expect(serviceCoverageNote(stations, noServices)).toBeNull();
  });

  it("says how much of the network is actually recorded", () => {
    expect(serviceCoverageNote(stations, ["shop"])).toContain(
      "confirmed for 2 of 3 stations",
    );
  });

  // It should disappear on its own once every station has a record, rather than
  // apologising forever.
  it("stays silent when every station has a record", () => {
    const complete = stations.map((s) => ({ ...s, amenities: ["shop"] }));
    expect(serviceCoverageNote(complete, ["shop"])).toBeNull();
  });
});

describe("emptyMessage", () => {
  it("names the region and the service that came up empty", () => {
    expect(
      emptyMessage({ query: "", services: ["shop"], regionName: "Greater Accra" }),
    ).toBe("No station in Greater Accra has a confirmed Shop yet.");
  });

  it("lists every selected service", () => {
    expect(
      emptyMessage({
        query: "",
        services: ["shop", "fullcare"],
        regionName: "Ashanti",
      }),
    ).toContain("Shop and FullCare");
  });

  it("prefers the search wording when a search is active", () => {
    expect(
      emptyMessage({ query: "xyz", services: ["shop"], regionName: "Ashanti" }),
    ).toBe("No station matches your search.");
  });

  it("falls back to the plain empty copy", () => {
    expect(
      emptyMessage({ query: "", services: noServices, regionName: "Ashanti" }),
    ).toContain("No stations are listed here yet.");
  });
});

describe("StationsDirectory", () => {
  const html = renderToStaticMarkup(
    createElement(StationsDirectory, { stations, regions }),
  );

  // Regions arrive ordered, so the first is the landing view. If anyone drops
  // the `| order(order asc)` from the query, or reorders the seed, this fires.
  it("opens on the first region it is given", () => {
    expect(html).toContain("2 stations in Greater Accra");
    expect(html).toContain("PETROSOL Spintex Station");
    expect(html).toContain("PETROSOL Gbawe Station");
    expect(html).not.toContain("PETROSOL Nkawie Station");
  });

  it("offers every region it is given as an option", () => {
    expect(html).toContain('value="greater-accra"');
    expect(html).toContain('value="ashanti"');
    expect(html).toContain('aria-label="Region"');
  });

  it("says region, never territory", () => {
    expect(html.toLowerCase()).not.toContain("territor");
  });

  it("offers every service as a filter", () => {
    expect(html).toContain('aria-label="Filter stations by service"');
    expect(html).toContain("Shop");
    expect(html).toContain("Washroom");
    expect(html).toContain("FullCare");
  });

  // Nothing is being hidden until a filter is on, so the caveat must not shout
  // at every visitor.
  it("hides the coverage note until a service filter is active", () => {
    expect(html).not.toContain("Services are confirmed for");
  });

  it("counts a single station in the singular", () => {
    const single = renderToStaticMarkup(
      createElement(StationsDirectory, {
        stations,
        regions: [regions[1]!, regions[0]!],
      }),
    );
    expect(single).toContain("1 station in Ashanti");
    expect(single).not.toContain("1 stations");
  });
});
