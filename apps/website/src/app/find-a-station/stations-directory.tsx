"use client";

import { useState } from "react";
import Link from "next/link";
import { RiDropLine } from "@remixicon/react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@workspace/ui/components/native-select";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";
import {
  StationIcon,
  type StationIconName,
} from "@workspace/ui/components/station-icon";

import type { StationRegionView, StationView } from "@workspace/content";

const amenityMeta: Record<
  string,
  { label: string; icon: StationIconName | "washroom" } | undefined
> = {
  shop: { label: "Shop", icon: "shop" },
  washroom: { label: "Washroom", icon: "washroom" },
  fullcare: { label: "FullCare", icon: "fullcare" },
};

/**
 * The filterable services, in the order the buttons render. Explicit rather
 * than `Object.keys(amenityMeta)` so the row's order is a decision, not a
 * side effect of how the map above happens to be written.
 */
const SERVICE_FILTERS = ["shop", "washroom", "fullcare"] as const;

// Same pill as the blog tag filter (`news/news-listing.tsx`) so the site's
// filter surfaces read as one system. Plain buttons rather than the shadcn
// ToggleGroup: Radix resolves its own React copy here, which throws under the
// static SSR render the directory's tests use.
const pillClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-[18px] font-display text-[14px] font-medium transition-colors";

function pillState(active: boolean) {
  return active
    ? "border-navy-800 bg-navy-800 text-white"
    : "border-border bg-background text-foreground hover:bg-ink-50";
}

/**
 * `washroom` is deliberately absent from `StationIconName` — there is no drawn
 * glyph for it — so it falls back to a Remix icon. Shared by the row chips and
 * the filter buttons so the fallback lives in exactly one place.
 */
function ServiceIcon({
  icon,
  className = "size-[13px] text-brand",
}: {
  icon: StationIconName | "washroom";
  className?: string;
}) {
  return icon === "washroom" ? (
    <RiDropLine className={className} />
  ) : (
    <StationIcon name={icon} className={className} />
  );
}

// Row grid: station | services | contact, stacking to a single column below
// 601px. Manager and phone share the last cell, which is why the manager no
// longer has to drop out on narrow screens the way a fourth column did.
//
// Every track is `minmax(0, Nfr)` — deliberately, not `auto`. Each row is its
// own grid container (the hover background and divider live on the row), so an
// `auto` track sizes to *that row's* content and the columns land in a
// different place on every line. Zero-floor `fr` tracks ignore content, so all
// rows and the header resolve to identical widths.
const rowGrid =
  "grid items-center gap-4 px-5 py-4 min-[601px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1fr)]";

/**
 * Facilities are confirmed for only part of the network, so an empty list means
 * "not recorded" and renders nothing — a blank cell rather than a claim we
 * cannot back. An unrecognised value is skipped for the same reason.
 */
function AmenityChips({ amenities }: { amenities: string[] }) {
  return (
    <span className="flex flex-wrap gap-2">
      {amenities.map((amenity) => {
        const meta = amenityMeta[amenity];
        if (!meta) return null;
        const { label, icon } = meta;
        return (
          <span
            key={amenity}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] uppercase"
          >
            <ServiceIcon icon={icon} />
            {label}
          </span>
        );
      })}
    </span>
  );
}

function StationRow({ station }: { station: StationView }) {
  return (
    <div className={`${rowGrid} group border-b border-border last:border-b-0 transition-colors hover:bg-ink-50`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-grid size-[26px] shrink-0 place-items-center rounded-full bg-orange-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
          <StationIcon name="station-pin" className="size-[15px]" />
        </span>
        <span className="font-display text-[14px] font-bold text-navy-900">
          {station.name}
        </span>
      </div>
      <span className="max-[600px]:col-span-full">
        <AmenityChips amenities={station.amenities} />
      </span>
      <span className="flex flex-col gap-1 max-[600px]:col-span-full min-[601px]:items-end">
        <span className="text-[14px] text-foreground">{station.manager}</span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 min-[601px]:flex-col min-[601px]:items-end min-[601px]:gap-1">
          {station.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone}`}
              className="font-mono text-[13px] font-semibold whitespace-nowrap text-brand hover:text-orange-600"
            >
              {phone}
            </a>
          ))}
        </span>
      </span>
    </div>
  );
}

/**
 * A search spans the whole network and overrides the dropdown; without one the
 * dropdown scopes the list. The two are deliberately not combined — someone who
 * types a station name should find it wherever it is, without first guessing
 * its region.
 *
 * Exported so the rule can be tested directly: it is the least obvious
 * behaviour in this component.
 */
export function visibleStations(
  stations: StationView[],
  {
    region,
    query,
    services,
  }: { region: string; query: string; services: string[] },
): StationView[] {
  const needle = query.trim().toLowerCase();
  const base = needle
    ? stations.filter((station) =>
        `${station.name} ${station.manager}`.toLowerCase().includes(needle),
      )
    : stations.filter((station) => station.region.slug === region);

  // Services intersect with whichever set the above produced — "has a shop" is
  // an orthogonal question to "where is it". AND, not OR: picking Shop and
  // FullCare means both, not either.
  //
  // A station with nothing recorded is excluded, which is the only honest
  // reading of a filter, but it is why `serviceCoverageNote` exists: most of
  // the network has no record, and silence here would read as "has none".
  return services.length
    ? base.filter((station) =>
        services.every((service) => station.amenities.includes(service)),
      )
    : base;
}

/** How much of the network has any service recorded at all. */
export function serviceCoverage(stations: StationView[]): {
  recorded: number;
  total: number;
} {
  return {
    recorded: stations.filter((station) => station.amenities.length > 0).length,
    total: stations.length,
  };
}

/**
 * The caveat shown whenever a service filter is active. Null when no filter is
 * on (nothing is being hidden) or when every station has a record (nothing to
 * apologise for) — so it disappears on its own once the data is filled in.
 */
export function serviceCoverageNote(
  stations: StationView[],
  services: string[],
): string | null {
  if (!services.length) return null;
  const { recorded, total } = serviceCoverage(stations);
  if (recorded === total) return null;
  return (
    `Services are confirmed for ${recorded} of ${total} stations. ` +
    "Those without a record aren’t shown here."
  );
}

/** Empty-state copy. Search, service filter and plain-empty read differently. */
export function emptyMessage({
  query,
  services,
  regionName,
}: {
  query: string;
  services: string[];
  regionName: string;
}): string {
  if (query) return "No station matches your search.";
  if (services.length) {
    const names = services
      .map((service) => amenityMeta[service]?.label ?? service)
      .join(" and ");
    const where = regionName ? `in ${regionName} ` : "";
    return `No station ${where}has a confirmed ${names} yet.`;
  }
  return "No stations are listed here yet. Call us and we’ll point you to your nearest PETROSOL station.";
}

function StationsDirectory({
  stations,
  regions,
}: {
  stations: StationView[];
  regions: StationRegionView[];
}) {
  // Regions arrive in display order, so the first is what the page opens on.
  const [region, setRegion] = useState(regions[0]?.slug ?? "");
  const [search, setSearch] = useState("");
  // No "All" item: with multi-select, selecting nothing already means "all".
  const [services, setServices] = useState<string[]>([]);
  const query = search.trim().toLowerCase();
  const shown = visibleStations(stations, { region, query, services });
  const regionName = regions.find((item) => item.slug === region)?.name ?? "";
  const coverageNote = serviceCoverageNote(stations, services);

  const toggleService = (service: string) =>
    setServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );

  return (
    <section className="ps-blueprint bg-muted pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Fuel stations" highlight="near you" className="mb-8">
          Find a PETROSOL station
        </SectionHeading>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <NativeSelect
            aria-label="Region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="w-[min(100%,280px)] bg-background rounded-3xl"
          >
            {regions.map((item) => (
              <NativeSelectOption key={item.slug} value={item.slug}>
                {item.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search station or manager…"
            aria-label="Search stations"
            className="ml-auto w-[min(100%,280px)] rounded-3xl bg-background"
          />
        </div>

        <div className="mb-8">
          <div
            role="group"
            aria-label="Filter stations by service"
            className="flex flex-wrap gap-3"
          >
            {SERVICE_FILTERS.map((service) => {
              const meta = amenityMeta[service];
              if (!meta) return null;
              const active = services.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  value={service}
                  aria-pressed={active}
                  onClick={() => toggleService(service)}
                  className={cn(pillClass, pillState(active))}
                >
                  <ServiceIcon
                    icon={meta.icon}
                    className={cn(
                      "size-[15px]",
                      active ? "text-white" : "text-brand",
                    )}
                  />
                  {meta.label}
                </button>
              );
            })}
          </div>

          {coverageNote && (
            <p className="mt-3 max-w-[62ch] text-[13px] text-muted-foreground">
              {coverageNote}
            </p>
          )}
        </div>

        {shown.length ? (
          <div className="overflow-hidden rounded-2xl bg-background shadow-card">
            <div className={`${rowGrid} border-b border-border font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase`}>
              <span>Station</span>
              <span className="max-[600px]:hidden">Services</span>
              <span className="text-right max-[600px]:hidden">Contact</span>
            </div>
            {shown.map((station) => (
              <StationRow key={station.id} station={station} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-background p-10 text-center shadow-card">
            <p>{emptyMessage({ query, services, regionName })}</p>
            {!query && (
              <div className="mt-6">
                <Button asChild>
                  <Link href="/contact-us">Contact us</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          {shown.length} station{shown.length === 1 ? "" : "s"}
          {query ? " found" : ` in ${regionName}`}
        </p>
      </div>
    </section>
  );
}

export { StationsDirectory };
