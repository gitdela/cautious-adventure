import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";

import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

import { businessLines, milestones } from "./about-data";

/**
 * The company's progression from a 2006 consultancy to a 2025 PLC.
 *
 * A single column with the year set beside each step, rather than the
 * alternating left/right timeline: this reads top to bottom on a phone without
 * the entries having to reflow into a different shape.
 */
function OurStorySection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Our story" highlight="to a PLC">
          From a consultancy
        </SectionHeading>
        <p className="mt-6 max-w-[62ch]">
          PETROSOL began as a consultancy advising Ghanaian operators in a newly
          deregulated downstream sector. Nearly two decades on, it is one of the
          country&apos;s ten largest oil marketing companies, still wholly
          Ghanaian-owned.
        </p>

        <ol className="mt-16 flex list-none flex-col gap-0 p-0">
          {milestones.map((milestone) => (
            <li
              key={milestone.year}
              className="grid grid-cols-1 gap-x-10 gap-y-2 border-t border-border py-7 min-[841px]:grid-cols-[140px_1fr]"
            >
              <p className="font-mono text-[15px] font-semibold tracking-[0.06em] text-brand">
                {milestone.year}
              </p>
              <div>
                <h3 className="m-0 font-display text-[18px] leading-[1.32] font-bold text-navy-900">
                  {milestone.title}
                </h3>
                <p className="mt-2 max-w-[62ch]">{milestone.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <figure className="mt-12">
          <div
            tabIndex={0}
            role="group"
            aria-label="New talent at PETROSOL photo gallery"
            className="flex snap-x snap-mandatory gap-[var(--gutter)] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[841px]:grid min-[841px]:grid-cols-3 min-[841px]:overflow-visible"
          >
            <div className="relative h-[300px] w-[88%] shrink-0 snap-center overflow-hidden min-[841px]:aspect-[3/2] min-[841px]:h-auto min-[841px]:w-auto min-[841px]:snap-none">
              <Image
                src="/images/about/new-talent-team.webp"
                alt="Four PETROSOL professionals standing together in corporate attire"
                fill
                sizes="(max-width: 840px) 88vw, (max-width: 1280px) 33vw, 420px"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <div className="relative h-[300px] w-[88%] shrink-0 snap-center overflow-hidden min-[841px]:aspect-[3/2] min-[841px]:h-auto min-[841px]:w-auto min-[841px]:snap-none">
              <Image
                src="/images/about/new-talent-lounge-team.webp"
                alt="PETROSOL colleagues sharing a relaxed moment in the company lounge"
                fill
                sizes="(max-width: 840px) 88vw, (max-width: 1280px) 33vw, 420px"
                className="object-cover"
              />
            </div>
            <div className="relative h-[300px] w-[88%] shrink-0 snap-center overflow-hidden min-[841px]:aspect-[3/2] min-[841px]:h-auto min-[841px]:w-auto min-[841px]:snap-none">
              <Image
                src="/images/about/new-talent-collaboration.webp"
                alt="Four PETROSOL professionals collaborating around a computer in the office"
                fill
                sizes="(max-width: 840px) 88vw, (max-width: 1280px) 33vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
          <figcaption className="border-b border-border py-4 font-display text-[13px] font-semibold text-navy-900">
            New talent at PETROSOL, building the company&apos;s next chapter.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/**
 * What the company actually does, in the three shapes a customer meets it —
 * a forecourt, a bulk contract, or a drum of oil. Each card links on to the
 * page that carries the detail.
 */
function WhatWeDoSection() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="What we do" highlight="three ways">
          We reach customers in
        </SectionHeading>

        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {businessLines.map((line) => {
            const Icon = line.icon;

            return (
              <article
                key={line.title}
                className="flex flex-col overflow-hidden rounded-xl bg-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={line.image.src}
                    alt={line.image.alt}
                    fill
                    sizes="(max-width: 1099px) 100vw, 33vw"
                    className={cn("object-cover", line.image.position)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-[var(--card-pad)]">
                  <Icon className="size-8 text-brand" aria-hidden="true" />
                  <h3 className="m-0 font-display text-[18px] leading-[1.32] font-bold text-navy-900">
                    {line.title}
                  </h3>
                  <p className="flex-1">{line.description}</p>
                  <Link
                    href={line.href}
                    className="inline-flex min-h-11 items-center gap-2 font-display text-[13px] font-semibold text-orange-600 transition-colors hover:text-orange-700"
                  >
                    {line.linkLabel}
                    <RiArrowRightLine className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { OurStorySection, WhatWeDoSection };
