import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { SectionHeading, Stat } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import {
  achievementStats,
  awardCategories,
  awardsTimeline,
  recentAwards,
} from "./achievements-data";

function AchievementsPageHeader() {
  return (
    <PageHeader
      title="Our Achievements"
      background={
        <Image
          src="/images/achievements/pumpjack-sunset.png"
          alt="Oil pumpjack at sunset"
          fill
          priority
          sizes="100vw"
        />
      }
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Company" },
            { label: "Our Achievements" },
          ]}
        />
      }
    />
  );
}

function DecadeBand() {
  return (
    <section className="bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Since 2016" tone="light" highlight="excellence">
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

function RecentAwards() {
  const [featured, ...otherAwards] = recentAwards;

  return (
    <section className="py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Most recent" highlight="recognition">
          2025 awards &
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 items-stretch gap-[clamp(24px,3vw,48px)] min-[841px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <figure className="relative m-0 min-h-[340px] overflow-hidden rounded-2xl sm:min-h-[420px]">
            <ImagePlaceholder label={`Drop a photo — ${featured[1]}`} />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-navy-900/85 px-8 pt-14 pb-6">
              <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-orange-300">
                {featured[0]} · {featured[2]}
              </p>
              <h3 className="mt-2 font-display text-[length:var(--size-display-sm)] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                {featured[1]}
              </h3>
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-4">
            {otherAwards.map(([year, title, organization], index) => (
              <article
                key={title}
                className={
                  index === 0
                    ? "flex items-center gap-5"
                    : "flex items-center gap-5 border-t border-border pt-4"
                }
              >
                <div className="size-24 shrink-0 overflow-hidden rounded-xl">
                  <ImagePlaceholder />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-semibold tracking-[0.1em] text-brand">
                    {year}
                  </p>
                  <h3 className="mt-0.5 font-display text-base leading-[1.35] font-bold text-navy-900">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {organization}
                  </p>
                </div>
              </article>
            ))}
          </div>
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
                <span className="font-mono text-[11px] tracking-[0.14em] text-fg-faint uppercase">
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
                    <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
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
        src="/images/home/platform-yellow-rails.png"
        alt="Petrosol platform with yellow safety rails"
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
            <Link href="/#contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function AchievementsSections() {
  return (
    <main>
      <AchievementsPageHeader />
      <DecadeBand />
      <RecentAwards />
      <CategoryBand />
      <AwardsTimeline />
      <StoryCta />
    </main>
  );
}

export { AchievementsSections };
