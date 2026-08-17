import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { SectionHeading, Stat } from "@workspace/ui/components/marketing";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import {
  achievementStats,
  awardCategories,
  awardsTimeline,
  latestAward,
} from "./achievements-data";

/**
 * Opening band. This page has no `PageHeader`, so this section carries the
 * mosaic, the breadcrumbs and the page's `h1` — all three of which the header
 * band used to provide.
 */
function DecadeBand() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-inverse py-[var(--section-y)]">
      {/* Same banner treatment as the page headers; `bg-surface-inverse` above
          stays as the fallback beneath it. */}
      <div className="absolute inset-0 -z-20 bg-navy-850 bg-[url('/images/header-mosaic-plain.svg')] bg-cover bg-right bg-no-repeat" />
      <div className="ps-container">
        {/* SiteBreadcrumbs takes only `items`; the spacing lives on a wrapper.
            Its white/78 links already assume a dark field, which this is. */}
        <div className="mb-8">
          <SiteBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Company" },
              { label: "Our Achievements" },
            ]}
          />
        </div>
        <SectionHeading
          as="h1"
          eyebrow="Since 2016"
          tone="light"
          highlight="excellence"
        >
          A decade of
        </SectionHeading>
        <p className="mt-6 max-w-[58ch] text-white/78">
          Since 2016, PETROSOL has been recognised by Ghana&apos;s leading industry
          bodies for service excellence, environmental responsibility and
          outstanding corporate leadership.
        </p>
        <div className="mt-14 flex flex-wrap gap-x-20 gap-y-8">
          {achievementStats.map(([value, label]) => (
            <Stat
              key={label}
              value={value}
              label={label}
              size="md"
              className="min-w-[120px] text-left"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The latest win, and only that one. Other awards belong to the timeline —
 * a second list here would compete with it and go stale.
 */
function RecentAwards() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Most recent" highlight="recognition">
          Our latest
        </SectionHeading>
        {/* Photo first in source order, so the single-column stack below 841px
            leads with it rather than the copy. */}
        <div className="mt-12 grid grid-cols-1 items-center gap-[clamp(24px,3vw,48px)] min-[841px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* `relative` anchors the filled image.
              On one column the frame takes the photo's own 3:2 ratio, so the
              whole shot is visible — a fixed 420px height against a ~328px
              phone width would crop roughly half the frame away, losing people
              at both edges. From 841px the layout is side by side and the
              min-height takes over, keeping the photo column from collapsing
              when the copy beside it is shorter. */}
          <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-2xl min-[841px]:aspect-auto min-[841px]:min-h-[420px]">
            <Image
              src="/images/achievements/award-handover.webp"
              alt="PETROSOL receiving an award on stage at the Twelfth Ghana Oil and Gas Awards"
              fill
              sizes="(max-width: 840px) 100vw, 640px"
              className="object-cover"
            />
          </figure>

          <div>
            <p className="font-mono text-[12px] font-semibold tracking-[0.14em] text-brand">
              {latestAward.kicker}
            </p>
            <h3 className="mt-3 font-display text-[length:var(--size-display-sm)] leading-[1.15] font-bold tracking-[-0.02em] text-pretty text-navy-900">
              {latestAward.title}
            </h3>
            <p className="mt-5 max-w-[52ch]">{latestAward.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Mixed portrait and landscape. Frames are sized by height with width left to
 * follow each photo's own ratio, so nothing is cropped — forcing a portrait
 * into a landscape frame shows only its middle ~44% and reliably cuts faces.
 * Intrinsic `width`/`height` are what let the browser reserve the right space
 * before the image loads.
 */
/**
 * Ordered landscape · portrait · landscape · portrait · landscape, so the two
 * narrow portrait frames never sit side by side. The set also has to read well
 * across the loop seam — the last entry runs straight into the first, so both
 * ends are landscape. It additionally keeps the two red-carpet shots, which
 * share a backdrop, from being neighbours.
 */
const marqueePhotos = [
  {
    src: "/images/achievements/gala-guests.webp",
    alt: "PETROSOL guests seated at the Ghana Oil and Gas Awards dinner",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/achievements/gala-guest-seated.webp",
    alt: "A PETROSOL colleague at the awards dinner table",
    width: 1333,
    height: 2000,
  },
  {
    src: "/images/achievements/team-red-carpet.webp",
    alt: "The PETROSOL team with their trophy on the awards red carpet",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/achievements/gala-applause.webp",
    alt: "A PETROSOL colleague applauding during the awards ceremony",
    width: 1333,
    height: 2000,
  },
  {
    src: "/images/achievements/red-carpet-trio.webp",
    alt: "Three PETROSOL colleagues at the Twelfth Ghana Oil and Gas Awards backdrop",
    width: 2000,
    height: 1333,
  },
];

type MarqueePhoto = (typeof marqueePhotos)[number];

function MarqueeFrame({ photo }: { photo: MarqueePhoto }) {
  return (
    // Spacing as padding on the item rather than a gap on the track — see the
    // note on `.ps-marquee-track` in the design-system stylesheet.
    <figure className="m-0 shrink-0 pr-[var(--gutter)]">
      {/* Height is fixed, width follows the photo's own ratio — landscapes come
          out wide, portraits narrow, and neither is cropped. */}
      {/* Heights are the original frame's, converted: it was
          `w-[clamp(220px,26vw,340px)]` at 3:2, i.e. these exact heights. */}
      <div className="h-[clamp(147px,17.3vw,227px)] overflow-hidden rounded-2xl">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 800px) 30vw, 340px"
          className="h-full w-auto"
        />
      </div>
    </figure>
  );
}

/**
 * Full-bleed scrolling photo strip between the latest award and the category
 * band. Vertical rhythm comes from the neighbouring sections, so this one adds
 * no padding of its own.
 */
/**
 * How many times the photo set repeats within ONE half of the track.
 *
 * A half narrower than the viewport leaves a visible empty run before the loop
 * restarts. At the frame height above a set is only ~1.4k wide, so three
 * repeats are needed to put a half near 4.3k and stay clear of ultrawide
 * screens. Raise this if the set shrinks or the frames grow.
 */
const MARQUEE_REPEATS = 3;

const marqueeHalf = Array.from({ length: MARQUEE_REPEATS }, () => marqueePhotos).flat();

/**
 * Space above the strip comes from `RecentAwards`' bottom padding. Space below
 * has to be its own: the next section is tinted (`bg-muted`), so its top
 * padding sits inside the tint and the coloured block would otherwise butt
 * straight up against the photos.
 */
function PhotoMarquee() {
  return (
    <section
      aria-label="Award photography"
      // Below 841px this is a scroll container the reader drags; above it the
      // track animates itself and must not be scrollable. `tabIndex` because a
      // region that only responds to swipe is unreachable by keyboard.
      tabIndex={0}
      className="overflow-x-auto pb-[var(--section-y-tight)] [-ms-overflow-style:none] [scrollbar-width:none] min-[841px]:overflow-hidden [&::-webkit-scrollbar]:hidden"
    >
      <div className="ps-marquee-track flex w-max">
        {/* Only the first pass is exposed; every repeat after it is the same
            three photos and would just be announced over and over. */}
        {marqueePhotos.map((photo) => (
          <MarqueeFrame key={photo.src} photo={photo} />
        ))}
        {/* The repeats exist only to feed the animation. Hidden below 841px so
            a reader dragging the strip sees the five photos once, not six
            copies of them. */}
        <div aria-hidden="true" className="hidden min-[841px]:flex">
          {[...marqueeHalf.slice(marqueePhotos.length), ...marqueeHalf].map(
            (photo, index) => (
              <MarqueeFrame key={`${photo.src}-${index}`} photo={photo} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryBand() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y-tight)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Award categories"
          align="center"
          highlight="every dimension"
        >
          Recognised across
        </SectionHeading>
        <div className="mt-14 flex flex-wrap justify-center gap-x-20 gap-y-8">
          {awardCategories.map(([value, label]) => (
            <Stat
              key={label}
              value={value}
              label={label}
              size="md"
              tone="default"
              className="min-w-[130px] text-left"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Award moments, each a photo with the award inscribed over it. These are older
 * wins — the latest has its own section above — so the inscription is what
 * identifies them. Add an entry here and the row lays itself out.
 */
type Moment = {
  photo: { src: string; alt: string };
  title: string;
  source: string;
};

const moments: Moment[] = [
  {
    photo: {
      src: "/images/achievements/energy-business-leadership.webp",
      alt: "PETROSOL leaders on stage with the Energy Business Leadership Award citation and trophy",
    },
    title: "Energy Business Leadership Award",
    source: "Ghana Energy Awards, 2025",
  },
  {
    photo: {
      src: "/images/achievements/ceo-of-the-year.webp",
      alt: "PETROSOL CEO Michael Bozumbil receiving his award citation on stage",
    },
    title: "CEO of the Year — Downstream Petroleum",
    source: "Michael Bozumbil · OMC Award, 9th CEO Summit, 2025",
  },
];

/**
 * Three photo frames directly above the timeline. Deliberately no heading —
 * the row is a visual breath between the category band and the record.
 */
function Moments() {
  return (
    // No bottom padding: the timeline section below supplies that gap.
    <section className="pt-[var(--section-y-tight)]">
      <div className="ps-container">
        {/* Two equal columns, stacking below the layout breakpoint. */}
        <div className="grid grid-cols-1 gap-[var(--gutter)] min-[841px]:grid-cols-2">
          {moments.map((moment) => (
            <figure
              key={moment.photo.src}
              className="relative m-0 aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={moment.photo.src}
                alt={moment.photo.alt}
                fill
                sizes="(max-width: 840px) 100vw, 620px"
                className="object-cover"
              />
              {/* The gradient is what keeps the inscription legible whatever
                  the photo does underneath it. */}
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-navy-900/88 px-6 pt-16 pb-5">
                <h3 className="font-display text-[17px] leading-[1.3] font-bold text-pretty text-white">
                  {moment.title}
                </h3>
                <p className="mt-1 font-mono text-[12px] tracking-[0.06em] text-orange-300">
                  {moment.source}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineNode() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden="true"
      className="absolute top-0 left-0 overflow-visible"
    >
      <line x1="14" y1="-4" x2="14" y2="32" stroke="var(--color-orange-300)" />
      <line x1="-4" y1="14" x2="32" y2="14" stroke="var(--color-orange-300)" />
      <circle cx="14" cy="14" r="9" fill="white" stroke="var(--brand)" strokeWidth="2" />
      <circle cx="14" cy="14" r="3.5" fill="var(--brand)" />
    </svg>
  );
}

function AwardsTimeline() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="mx-auto max-w-[900px] px-[var(--container-pad)]">
        <SectionHeading eyebrow="Complete record" highlight="timeline">
          Full awards
        </SectionHeading>
        <div className="relative mt-14">
          <svg
            aria-hidden="true"
            preserveAspectRatio="none"
            className="absolute top-2.5 left-[13px] h-[calc(100%_-_10px)] w-0.5 overflow-visible"
          >
            <line x1="1" y1="0" x2="1" y2="100%" stroke="var(--border)" strokeWidth="2" />
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="var(--brand)"
              strokeWidth="2"
              strokeDasharray="3 14"
              opacity="0.8"
            />
          </svg>

          {awardsTimeline.map(([year, awards], yearIndex) => (
            <article
              key={year}
              className={
                yearIndex === awardsTimeline.length - 1
                  ? "relative pl-16"
                  : "relative pb-14 pl-16"
              }
            >
              <TimelineNode />
              <header className="flex items-baseline gap-5">
                <h3 className="font-display text-[length:var(--size-display-sm)] leading-none font-bold tracking-[-0.02em] text-navy-900">
                  {year}
                </h3>
                <span className="relative top-[-4px] flex-1 border-b border-dashed border-border" />
                <span className="font-mono text-[12px] tracking-[0.14em] text-fg-faint uppercase">
                  {String(awards.length).padStart(2, "0")} award
                  {awards.length > 1 ? "s" : ""}
                </span>
              </header>
              <div className="mt-6 flex flex-col gap-5">
                {awards.map(([title, organization]) => (
                  <div key={`${title}-${organization}`} className="relative">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 64 14"
                      className="absolute top-1 -left-16 h-3.5 w-16 overflow-visible"
                    >
                      <path
                        d="M1 -8 C 1 4, 10 7, 22 7 L 50 7"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <circle cx="50" cy="7" r="2.5" fill="white" stroke="var(--brand)" strokeWidth="1.5" />
                    </svg>
                    <h4 className="font-display text-base leading-[1.4] font-bold text-navy-900">
                      {title}
                    </h4>
                    <p className="mt-1 font-mono text-[12px] tracking-[0.06em] text-muted-foreground">
                      {organization}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}

          <svg
            aria-hidden="true"
            width="28"
            height="18"
            viewBox="0 0 28 18"
            className="absolute -bottom-[26px] left-0 overflow-visible"
          >
            <line x1="6" y1="9" x2="22" y2="9" stroke="var(--brand)" strokeWidth="2" />
            <line x1="9" y1="14" x2="19" y2="14" stroke="var(--border)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function StoryCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/home/platform-yellow-rails.webp"
        alt="PETROSOL platform with yellow safety rails"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          eyebrow="Our story"
          tone="light"
          align="center"
          highlight="PETROSOL's journey"
        >
          Learn more about
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/about">About PETROSOL</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function AchievementsSections() {
  return (
    <main>
      <DecadeBand />
      <RecentAwards />
      <PhotoMarquee />
      <CategoryBand />
      <Moments />
      <AwardsTimeline />
      <StoryCta />
    </main>
  );
}

export { AchievementsSections };
