import Image from "next/image";

import { PhotoTile, SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

import { customerPromises, values } from "./about-data";

/**
 * The six cardinal pillars, framed from the customer's side — they are written
 * as things a customer receives, not things the company does internally.
 */
function CustomerPromisesSection() {
  return (
    <section className="ps-blueprint bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our promise"
          tone="light"
          align="center"
        >
          6 Cardinal Pillars of PETROSOL Operations
        </SectionHeading>
        <ol className="mt-16 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-[var(--gutter)] gap-y-16 p-0 min-[1100px]:grid-cols-3">
          {customerPromises.map((promise) => (
            <li key={promise.title} className="flex flex-col items-center">
              <div className="relative w-full max-w-[220px]">
                <div className="relative aspect-square overflow-hidden rounded-full border-[7px] border-white bg-white">
                  <Image
                    src={promise.image.src}
                    alt={promise.image.alt}
                    fill
                    sizes="(max-width: 600px) 64vw, 220px"
                    className={cn(
                      promise.image.fit === "contain"
                        ? "object-contain p-5"
                        : "object-cover",
                      promise.image.position,
                    )}
                  />
                </div>
                <span className="absolute top-7 -left-2 grid size-11 place-items-center rounded-full bg-brand font-mono text-[17px] font-bold text-white">
                  {promise.number}
                </span>
              </div>
              <div className="mt-7 w-full max-w-[250px] text-center">
                <h3 className="font-display text-[18px] leading-[1.3] font-bold text-white">
                  {promise.title}
                </h3>
                <p className="mt-2 text-white/78">{promise.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FleetTeamPhotoBreak() {
  return (
    <PhotoTile
      // A wide line-up of people: a fixed 21/8 letterbox left it a thin strip
      // on a phone. The ratio opens up as the viewport narrows so the group
      // stays legible, and is a little taller than 21/8 even at full width.
      className="aspect-[4/3] rounded-none min-[601px]:aspect-[16/9] min-[841px]:aspect-[2/1] min-[1100px]:aspect-[12/5]"
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
const servicePhotoSizes =
  "(max-width: 840px) 80vw, (max-width: 1280px) 50vw, 620px";

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
            src="/images/about/team-empathy.webp"
            alt="Two PETROSOL workers in hard hats and branded high-visibility vests standing arm in arm"
            fill
            sizes={servicePhotoSizes}
            className="object-[50%_42%]"
          />
        }
      />
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
    </div>
  );
}

/**
 * Six values, one line each.
 *
 * This section used to give every value a summary, a definition and four
 * behaviours, which made it the longest thing on an overview page and crowded
 * out the company's actual story. The fuller definitions still live in
 * `about-data.ts` for a culture or careers page to pick up.
 */
function CoreValuesSection() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="ps-container flex flex-col gap-16">
        <div>
          <SectionHeading eyebrow="What guides us" highlight="core values">
            Our six
          </SectionHeading>
          <p className="mt-6 max-w-[72ch]">
            Our values are the principles behind every decision and every
            interaction: how we work, how we treat one another, and how we
            serve our customers and communities.
          </p>
        </div>

        <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-x-[var(--gutter)] gap-y-10 p-0 min-[1100px]:grid-cols-3">
          {values.map((value) => (
            <li key={value.number} className="border-t border-border pt-5">
              <p className="font-mono text-[13px] font-semibold tracking-[0.08em] text-brand">
                {value.number}
              </p>
              <h3 className="mt-3 font-display text-[18px] leading-[1.32] font-bold text-navy-900">
                {value.title}
              </h3>
              <p className="mt-2 max-w-[38ch]">{value.summary}</p>
            </li>
          ))}
        </ol>

        <ServicePhotoBreak />
      </div>
    </section>
  );
}

export { CoreValuesSection, CustomerPromisesSection, FleetTeamPhotoBreak };
