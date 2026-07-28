"use client";

import { useState } from "react";

import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

type Album = {
  id: string;
  title: string;
  tag: string;
  wide?: boolean;
};

const albums: Album[] = [
  { id: "gal-christmas-2025", title: "A PETROSOL Christmas", tag: "2025", wide: true },
  { id: "gal-oilgas-awards-2025", title: "Ghana Oil and Gas Awards", tag: "2025" },
  { id: "gal-quality-awards-2025", title: "National Quality Awards", tag: "2025" },
  { id: "gal-energy-awards-2025", title: "Ghana Energy Awards", tag: "2025" },
  { id: "gal-hrfocus-2025", title: "HR Focus Conference", tag: "2025" },
  { id: "gal-wil-2025", title: "Women in Leadership Conference", tag: "2025" },
  { id: "gal-promo-2025", title: "Energizing Dreams Promo", tag: "2025", wide: true },
  { id: "gal-chamber-2024", title: "4th Chamber of Business Awards", tag: "2024" },
  {
    id: "gal-wil-2024",
    title: "PETROSOL Women in Leadership Conference",
    tag: "2024",
    wide: true,
  },
  {
    id: "gal-mining-energy-2023",
    title: "Women in Mining & Energy Awards",
    tag: "2023",
  },
  { id: "gal-oilgas-awards-2023", title: "Oil & Gas Awards", tag: "2023" },
  { id: "gal-ewn-2023", title: "EWN Conference", tag: "2023" },
  { id: "gal-lions-club", title: "PETROSOL & Lions Club", tag: "Community", wide: true },
];

const galleryTags = ["All", "2025", "2024", "2023", "Community"];

function GalleryGrid() {
  const [tag, setTag] = useState("All");
  const shown = tag === "All" ? albums : albums.filter((album) => album.tag === tag);

  return (
    <section className="ps-blueprint bg-muted pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="ps-container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Media · Gallery" highlight="in pictures">
            Our moments,
          </SectionHeading>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Filter albums">
            {galleryTags.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                aria-pressed={tag === item}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-[18px] font-display text-[14px] font-medium transition-colors",
                  tag === item
                    ? "border-navy-800 bg-navy-800 text-white"
                    : "border-border bg-background text-foreground hover:bg-ink-50",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-flow-dense grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {shown.map((album) => (
            <figure
              key={album.id}
              className={cn(
                "relative m-0 h-[280px] overflow-hidden rounded-2xl",
                album.wide && shown.length > 2 && "min-[641px]:col-span-2",
              )}
            >
              <ImagePlaceholder label={`Drop photos — ${album.title}`} />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 bg-gradient-to-t from-navy-900/82 to-transparent px-5 pt-8 pb-4 font-display text-[14px] font-medium text-white">
                <span>{album.title}</span>
                {album.tag !== "Community" ? (
                  <span className="shrink-0 font-mono text-[12px] tracking-[0.1em] text-white/72">
                    {album.tag}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export { GalleryGrid };
