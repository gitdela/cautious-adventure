import Image from "next/image";
import Link from "next/link";
import { RiShieldCheckLine } from "@remixicon/react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  PhotoTile,
  SectionHeading,
  Stat,
} from "@workspace/ui/components/marketing";
import { ServiceCard } from "@workspace/ui/components/service-card";

import { MosaicPageHeader } from "../mosaic-page-header";
import { MosaicCtaBand } from "../mosaic-cta-band";
import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { CoreValuesSection } from "./about-core-values";
import {
  affiliations,
  certifications,
  operatingCulture,
  visionAndPurpose,
} from "./about-data";

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

function CertificationStrip() {
  return (
    <section aria-label="Certifications" className="border-b border-border">
      <div className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[var(--gutter)] py-8">
        {certifications.map(([title, description]) => (
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

function WhoWeAreSection() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <div>
        <SectionHeading eyebrow="Who we are" highlight="Ghanaian OMC">
          A privately-owned, ISO-certified
        </SectionHeading>
        <div className="mt-6 flex max-w-[54ch] flex-col gap-5">
          <p>
            PETROSOL Platinum Energy is a privately-owned, ISO-certified Ghanaian
            Oil Marketing Company, known in the petroleum downstream industry for
            our commitment to service excellence, professionalism and industry
            best practice.
          </p>
          <p>
            Our product lines include Gasoline (Petrol), Gas Oil (Diesel),
            Liquefied Petroleum Gas (LPG), Fuel Oils and Lubricants. We operate
            over 115 fuel stations across the country and directly supply bulk
            corporate consumers of petroleum products.
          </p>
          <p>
            We&apos;re licensed by the industry regulator, the National Petroleum
            Authority, and our operations are registered with the Ghana Investment
            Promotion Centre and the Environmental Protection Agency.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            NPA licensed
          </Badge>
          <Badge>ISO certified</Badge>
          <Badge variant="secondary">Privately-owned OMC</Badge>
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
          value="115+"
          label="Fuel stations operating nationwide"
          size="md"
          tone="default"
          className="mt-10"
        />
      </div>
    </section>
  );
}

function VisionPurposeSection() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Vision & purpose"
          tone="light"
          highlight="energize dreams"
        >
          We&apos;re here to
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-[var(--gutter)] min-[841px]:grid-cols-2">
          {visionAndPurpose.map(([title, description]) => (
            <div key={title} className="border-t border-white/16 pt-5">
              <h3 className="font-display text-[18px] font-bold text-orange-400">
                {title}
              </h3>
              <p className="mt-3 max-w-[50ch] text-white/78">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperatingCultureSection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our operating culture"
          highlight="Fair Pricing"
          align="center"
        >
          High Quality, Full Quantity and
        </SectionHeading>
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {operatingCulture.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <ServiceCard key={pillar.title} icon={<Icon />} title={pillar.title}>
                {pillar.description}
              </ServiceCard>
            );
          })}
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

function AffiliationsSection() {
  return (
    <section className="pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="mx-auto max-w-[900px] px-[var(--container-pad)] text-center">
        <SectionHeading
          eyebrow="Industry affiliations"
          highlight="business bodies"
          align="center"
        >
          Proud member of Ghana&apos;s leading
        </SectionHeading>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {affiliations.map((affiliation) => (
            <Badge
              key={affiliation}
              variant="secondary"
              className="h-auto max-w-full py-1.5 text-center whitespace-normal"
            >
              {affiliation}
            </Badge>
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
          <Link href="/find-a-station">Find a station</Link>
        </Button>
      </div>
    </MosaicCtaBand>
  );
}

function AboutSections() {
  return (
    <main>
      <AboutPageHeader />
      <CertificationStrip />
      <WhoWeAreSection />
      <VisionPurposeSection />
      <OperatingCultureSection />
      <CultureBand />
      <CoreValuesSection />
      <AffiliationsSection />
      <PartnerCta />
    </main>
  );
}

export { AboutSections };
