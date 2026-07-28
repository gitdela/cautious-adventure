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
import {
  StationIcon,
  type StationIconName,
} from "@workspace/ui/components/station-icon";

import {
  territories,
  territoryNames,
  type Station,
  type StationAmenity,
} from "./stations-data";

const amenityMeta: Record<
  StationAmenity,
  { label: string; icon: StationIconName | "washroom" }
> = {
  shop: { label: "Shop", icon: "shop" },
  washroom: { label: "Washroom", icon: "washroom" },
  fullcare: { label: "FullCare", icon: "fullcare" },
};

// Row grid mirrors the handoff: station | services | manager | phone, dropping
// manager below 901px and stacking to a single column below 601px.
const rowGrid =
  "grid items-center gap-4 px-5 py-4 min-[601px]:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] min-[901px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1fr)_auto]";

function AmenityChips({ amenities }: { amenities: StationAmenity[] }) {
  return (
    <span className="flex flex-wrap gap-2">
      {amenities.map((amenity) => {
        const { label, icon } = amenityMeta[amenity];
        return (
          <span
            key={amenity}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] uppercase"
          >
            {icon === "washroom" ? (
              <RiDropLine className="size-[13px] text-brand" />
            ) : (
              <StationIcon name={icon} className="size-[13px] text-brand" />
            )}
            {label}
          </span>
        );
      })}
    </span>
  );
}

function StationRow({ station }: { station: Station }) {
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
      <span className="text-[14px] text-foreground max-[900px]:hidden">
        {station.manager}
      </span>
      <span className="flex flex-wrap items-center gap-4 max-[600px]:col-span-full min-[601px]:flex-col min-[601px]:items-end min-[601px]:gap-1">
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
    </div>
  );
}

function StationsDirectory() {
  const [territory, setTerritory] = useState(territoryNames[0]);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const base = query
    ? territoryNames.flatMap((name) => territories[name])
    : territories[territory];
  const shown = query
    ? base.filter((station) =>
        `${station.name} ${station.manager}`.toLowerCase().includes(query),
      )
    : base;

  return (
    <section className="ps-blueprint bg-muted pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Fuel stations" highlight="near you" className="mb-8">
          Find a PETROSOL station
        </SectionHeading>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <NativeSelect
            aria-label="Territory"
            value={territory}
            onChange={(event) => setTerritory(event.target.value)}
            className="w-[min(100%,280px)] bg-background rounded-3xl"
          >
            {territoryNames.map((name) => (
              <NativeSelectOption key={name} value={name}>
                {name}
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

        {shown.length ? (
          <div className="overflow-hidden rounded-2xl bg-background shadow-card">
            <div className={`${rowGrid} border-b border-border font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase`}>
              <span>Station</span>
              <span className="max-[600px]:hidden">Services</span>
              <span className="max-[900px]:hidden">Manager</span>
              <span className="text-right max-[600px]:hidden">Phone</span>
            </div>
            {shown.map((station) => (
              <StationRow key={station.name} station={station} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-background p-10 text-center shadow-card">
            <p>
              {query
                ? "No station matches your search."
                : "The station list for this territory is on its way. Call us and we’ll point you to your nearest PETROSOL station."}
            </p>
            {!query && (
              <div className="mt-6">
                <Button asChild>
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          {shown.length} station{shown.length === 1 ? "" : "s"}
          {query ? " found" : ` in ${territory}`}
        </p>
      </div>
    </section>
  );
}

export { StationsDirectory };
