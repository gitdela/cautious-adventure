"use client";

import { useState } from "react";

import type { GalleryEventView } from "@workspace/content";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

import { EventList } from "./event-list";

/** The unfiltered view, and the pill for undated community work. */
const ALL = "All";
const COMMUNITY = "Community";

/**
 * The only filter on the page. Built from the years actually present rather
 * than a fixed list, so a 2026 event needs no code change — the same approach
 * the blog listing takes with its tags.
 */
function YearFilterRow({
  events,
  value,
  onChange,
}: {
  events: GalleryEventView[];
  value: string;
  onChange: (next: string) => void;
}) {
  const years = [
    ...new Set(
      events
        .filter((event) => event.stream === "event" && event.year)
        .map((event) => event.year as string),
    ),
  ].sort((a, b) => b.localeCompare(a));

  const filters = [
    ALL,
    ...years,
    ...(events.some((event) => event.stream === "community")
      ? [COMMUNITY]
      : []),
  ];

  return (
    <div
      className="flex flex-wrap gap-3"
      role="group"
      aria-label="Filter events by year"
    >
      {filters.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-pressed={value === item}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-5 font-display text-[13px] font-semibold transition-colors",
            value === item
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-border bg-transparent text-navy-900 hover:border-ink-300",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function EventsRows({ events }: { events: GalleryEventView[] }) {
  const [filter, setFilter] = useState<string>(ALL);

  const shown =
    filter === ALL
      ? events
      : filter === COMMUNITY
        ? events.filter((event) => event.stream === "community")
        : events.filter(
            (event) => event.stream === "event" && event.year === filter,
          );

  return (
    <section className="ps-blueprint bg-muted pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="ps-container">
        <div className="mb-6">
          <SectionHeading
            eyebrow="Media · Gallery"
            size="md"
            highlight="in pictures"
          >
            Our moments,
          </SectionHeading>
        </div>

        {events.length > 0 ? (
          <div className="mb-12">
            <YearFilterRow
              events={events}
              value={filter}
              onChange={setFilter}
            />
          </div>
        ) : null}

        <EventList
          events={shown}
          emptyTitle="No events yet"
          emptyDescription="Published events will appear here."
        />
      </div>
    </section>
  );
}

export { EventsRows };
