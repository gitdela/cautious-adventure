import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

import { pillars } from "./sustainability-data";

/**
 * Hero moment #2: the five pillars as a bento grid that never orphans a card.
 *
 * Desktop is a four-track grid where pillar 01 is the feature tile, spanning
 * two tracks and two rows, with 02 and 03 stacked beside it and 04 and 05
 * closing the bottom row. Tablets drop to two tracks with the feature tile
 * running full width above two even rows, and below that it is one column.
 */
function PillarsSection() {
  return (
    <section className="ps-container py-[var(--section-y)]">
      <SectionHeading eyebrow="Our sustainability pillars" highlight="hold it up">
        One agenda, five pillars that
      </SectionHeading>
      <ol className="mt-16 grid list-none grid-cols-1 gap-[var(--gutter)] p-0 min-[680px]:grid-cols-2 min-[1080px]:grid-cols-4">
        {pillars.map(({ number, title, description }, index) => {
          const isFeature = index === 0;

          return (
            <li
              key={number}
              className={cn(
                "relative mt-[22px] flex flex-col rounded-[20px] px-[var(--card-pad)] pt-[calc(var(--card-pad)+12px)] pb-[var(--card-pad)]",
                "min-[1080px]:col-span-2",
                isFeature
                  ? "bg-surface-inverse min-[680px]:col-span-2 min-[1080px]:row-span-2"
                  : "bg-card shadow-card",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute -top-[22px] left-[var(--card-pad)] grid size-11 place-items-center rounded-full bg-brand font-mono text-[15px] font-bold text-white"
              >
                {number}
              </span>
              <h3
                className={cn(
                  "font-display leading-[1.3] font-bold",
                  isFeature
                    ? "text-[clamp(21px,2.4vw,31px)] text-white"
                    : "text-[18px] text-navy-900",
                )}
              >
                {title}
              </h3>
              <p
                className={cn(
                  "mt-2 leading-[1.58]",
                  isFeature
                    ? "max-w-[46ch] text-[15px] text-white/72 min-[1080px]:mt-auto min-[1080px]:pt-10"
                    : "text-[13px]",
                )}
              >
                {description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function LookingAheadSection({ cornerCut }: { cornerCut: string }) {
  return (
    <section className={cn("bg-surface-inverse py-[var(--section-y)]", cornerCut)}>
      <div className="ps-container flex flex-col items-center text-center">
        <SectionHeading
          eyebrow="Looking ahead"
          tone="light"
          size="lg"
          align="center"
          highlight="sustainable tomorrow"
        >
          Energizing a more
        </SectionHeading>
        <p className="mt-6 max-w-[56ch] text-white/72">
          Our journey is ongoing. As PETROSOL grows, we are committed to
          reducing our environmental footprint, investing in renewable energy,
          developing our people and creating lasting value, one station, one
          innovation and one community at a time.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/csr">Explore our CSR work</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/find-a-station">Find a station</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { LookingAheadSection, PillarsSection };
