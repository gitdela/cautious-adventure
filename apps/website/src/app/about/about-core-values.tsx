import Image from "next/image";

import {
  PhotoTile,
  SectionHeading,
} from "@workspace/ui/components/marketing";

import { values, type CoreValue } from "./about-data";

function ValueBlock({ value }: { value: CoreValue }) {
  return (
    <article className="grid gap-x-14 gap-y-6 border-t border-border pt-6 min-[841px]:grid-cols-[minmax(220px,1fr)_2fr]">
      <div>
        <p className="font-mono text-[13px] font-semibold tracking-[0.08em] text-brand">
          {value.number}
        </p>
        <h3 className="mt-3 font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-navy-900">
          {value.title}
        </h3>
        <p className="mt-3 max-w-[34ch]">{value.summary}</p>
      </div>

      <div className="max-w-[62ch]">
        <p className="font-display text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
          What it means
        </p>
        <p className="mt-3">{value.meaning}</p>

        <p className="mt-6 font-display text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
          How we live it
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {value.behaviors.map((behavior) => (
            <li
              key={behavior}
              className="relative pl-7 before:absolute before:top-[0.72em] before:left-0 before:h-[3px] before:w-3.5 before:bg-leaf-500 before:content-['']"
            >
              {behavior}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function FleetTeamPhotoBreak() {
  return (
    <PhotoTile
      // A wide line-up of people: a fixed 21/8 letterbox left it a thin strip
      // on a phone. The ratio opens up as the viewport narrows so the group
      // stays legible, and is a little taller than 21/8 even at full width.
      className="aspect-[4/3] min-[601px]:aspect-[16/9] min-[841px]:aspect-[2/1] min-[1100px]:aspect-[12/5]"
      image={
        <Image
          src="/images/about/fleet-team.webp"
          alt="PETROSOL fleet and operations team in high-visibility vests lined up in front of tanker trucks"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      }
    />
  );
}

/**
 * Two service photos, side by side on desktop and a snap carousel on phones.
 *
 * A plain `grid-cols-2` applied at every width, which left each tile about
 * 150px wide and 84px tall on a phone — too small to read. Below 841px the
 * tiles instead take a fixed height and most of the viewport width, and the row
 * scrolls; the next tile peeks in as the affordance that there is more.
 */
const servicePhotoSizes = "(max-width: 840px) 80vw, (max-width: 1280px) 50vw, 620px";

/** Fixed height on phones, so a narrower tile does not also become a short one. */
const servicePhotoTile =
  "aspect-auto h-[300px] w-[80%] shrink-0 snap-center min-[841px]:aspect-[3/2] min-[841px]:h-auto min-[841px]:w-auto";

function ServicePhotoBreak() {
  return (
    <div
      // Scrollable regions need to be reachable by keyboard, not just by swipe.
      tabIndex={0}
      role="group"
      aria-label="PETROSOL service photos"
      // Scrollbar hidden across the three engines that need separate opt-outs.
      // The partially visible next tile carries the "there is more" signal.
      className="flex snap-x snap-mandatory gap-[var(--gutter)] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[841px]:grid min-[841px]:grid-cols-2 min-[841px]:overflow-visible"
    >
      <PhotoTile
        className={servicePhotoTile}
        image={
          <Image
            src="/images/about/service-payment.webp"
            alt="A PETROSOL forecourt attendant taking a card payment at a customer's car window"
            fill
            sizes={servicePhotoSizes}
          />
        }
      />
      <PhotoTile
        className={servicePhotoTile}
        image={
          <Image
            src="/images/home/fullcare.webp"
            alt="A PETROSOL FullCare engine inspection"
            fill
            sizes={servicePhotoSizes}
          />
        }
      />
    </div>
  );
}

function CoreValuesSection() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="ps-container flex flex-col gap-16">
        <div>
          <SectionHeading eyebrow="What guides us" highlight="core values">
            Our six
          </SectionHeading>
          <p className="mt-6 max-w-[72ch]">
            At PETROSOL, our core values are the fundamental principles and
            deeply held beliefs that guide every action, decision, attitude and
            interaction. They shape how we work, how we treat one another and
            how we serve our customers, partners and communities. Together with
            our operating culture—High Quality, Full Quantity and Fair
            Pricing—these values define who we are and the value we are
            committed to delivering across Ghana.
          </p>
        </div>

        {values.slice(0, 2).map((value) => (
          <ValueBlock key={value.number} value={value} />
        ))}
        <FleetTeamPhotoBreak />

        {values.slice(2, 4).map((value) => (
          <ValueBlock key={value.number} value={value} />
        ))}
        <ServicePhotoBreak />

        {values.slice(4).map((value) => (
          <ValueBlock key={value.number} value={value} />
        ))}
      </div>
    </section>
  );
}

export { CoreValuesSection };
