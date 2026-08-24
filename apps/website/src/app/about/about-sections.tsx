import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine, RiShieldCheckLine } from "@remixicon/react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  PhotoTile,
  SectionHeading,
  Stat,
} from "@workspace/ui/components/marketing";

import { MosaicPageHeader } from "../mosaic-page-header";
import { MosaicCtaBand } from "../mosaic-cta-band";
import { SiteBreadcrumbs } from "../site-breadcrumbs";
import {
  CoreValuesSection,
  CustomerPromisesSection,
  FleetTeamPhotoBreak,
} from "./about-core-values";
import { ImpactSection, TrustSection } from "./about-impact";
import { OurStorySection, WhatWeDoSection } from "./about-story";
import { standardsAndLicences, visionAndPurpose } from "./about-data";

function AboutPageHeader() {
  return (
    <MosaicPageHeader
      title="Who We Are"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
            { label: "Who We Are" },
          ]}
        />
      }
    />
  );
}

/** The opening identity statement. */
function WhoWeAreSection() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <div>
        <SectionHeading eyebrow="Who we are" highlight="energy company">
          A 100% Ghanaian-owned
        </SectionHeading>
        <div className="mt-6 flex max-w-[54ch] flex-col gap-5">
          <p>
            PETROSOL Platinum Energy is a privately-owned, ISO-certified
            Ghanaian Oil Marketing Company, known in the petroleum downstream
            industry for our commitment to service excellence, professionalism
            and industry best practice.
          </p>
          <p>
            Our product lines include Gasoline (Petrol), Gas Oil (Diesel),
            Liquefied Petroleum Gas (LPG), Fuel Oils and Lubricants. We operate
            over 100 fuel stations across the country and directly supply bulk
            corporate consumers of petroleum products.
          </p>
          <p>
            We&apos;re licensed by the industry regulator, the National Petroleum
            Authority, and our operations are registered with the Ghana
            Investment Promotion Centre and the Environmental Protection Agency.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            NPA licensed
          </Badge>
          <Badge>Triple ISO certified</Badge>
          <Badge variant="secondary">100% Ghanaian-owned</Badge>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 items-start gap-5">
          <PhotoTile
            image={
              <Image
                src="/images/home/petrosol-station-staff.webp"
                alt="PETROSOL station attendants on the forecourt"
                fill
                sizes="(max-width: 960px) 45vw, 22vw"
              />
            }
          />
          <PhotoTile
            className="mt-16"
            image={
              <Image
                src="/images/home/fuel-pump.webp"
                alt="Refuelling at a PETROSOL pump"
                fill
                sizes="(max-width: 960px) 45vw, 22vw"
              />
            }
          />
        </div>
        <Stat
          value="100+"
          label="Fuel stations operating nationwide"
          size="md"
          tone="default"
          className="mt-10"
        />
      </div>
    </section>
  );
}

/**
 * The ISO standards and the NPA licence.
 *
 * Headed "standards and licences", not "certifications": the NPA entry is a
 * licence to operate issued by the regulator, and filing it under ISO
 * certifications overstated what it is.
 */
function StandardsStrip() {
  return (
    <section
      aria-label="Standards and licences"
      className="border-y border-border"
    >
      <div className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[var(--gutter)] py-8">
        {standardsAndLicences.map(([title, description]) => (
          <div key={title} className="text-center">
            <p className="font-mono text-[15px] font-semibold tracking-[0.02em] text-navy-900">
              {title}
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VisionPurposeSection() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Vision & purpose" highlight="energize dreams">
          We&apos;re here to
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-[var(--gutter)] min-[841px]:grid-cols-2">
          {visionAndPurpose.map(([title, description]) => (
            <div key={title} className="border-t border-border pt-5">
              <h3 className="font-display text-[18px] font-bold text-brand">
                {title}
              </h3>
              <p className="mt-3 max-w-[50ch]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CultureBand() {
  return (
    <figure className="relative m-0 h-[clamp(300px,42vw,520px)] overflow-hidden">
      <Image
        src="/images/about/team-culture.webp"
        alt="PETROSOL colleagues in branded team shirts reading a company brochure together at the head office"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-900/62 to-transparent to-[45%]"
      />
    </figure>
  );
}

const furtherReading = [
  ["Leadership team", "The people running the company", "/leadership-team"],
  ["Awards & recognition", "How the industry rates us", "/awards-and-recognition"],
  [
    "Sustainability & community",
    "What we give back",
    "/sustainability-and-community",
  ],
];

/** Onward routes, so the page ends somewhere other than a dead stop. */
function FurtherReadingSection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y-tight)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Read on" size="md" highlight="the company">
          More about
        </SectionHeading>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {furtherReading.map(([title, description, href]) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-2 rounded-xl bg-background p-[var(--card-pad)] shadow-card transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1"
            >
              <h3 className="m-0 font-display text-[18px] leading-[1.32] font-bold text-navy-900 transition-colors group-hover:text-brand">
                {title}
              </h3>
              <p className="text-[13px] leading-[1.58]">{description}</p>
              <RiArrowRightLine
                className="mt-2 size-4 text-orange-600"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCta() {
  return (
    <MosaicCtaBand>
      <SectionHeading
        eyebrow="Work with us"
        tone="light"
        highlight="PETROSOL?"
        align="center"
      >
        Ready to partner with
      </SectionHeading>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/contact-us">Contact us</Link>
        </Button>
        <Button asChild variant="outlineInverse">
          <Link href="/find-a-station">Find our station</Link>
        </Button>
      </div>
    </MosaicCtaBand>
  );
}

function AboutSections() {
  return (
    <main>
      <AboutPageHeader />
      <WhoWeAreSection />
      <StandardsStrip />
      <OurStorySection />
      <WhatWeDoSection />
      <FleetTeamPhotoBreak />
      <VisionPurposeSection />
      <CustomerPromisesSection />
      <CultureBand />
      <CoreValuesSection />
      <ImpactSection />
      <TrustSection />
      <FurtherReadingSection />
      <PartnerCta />
    </main>
  );
}

export { AboutSections };
