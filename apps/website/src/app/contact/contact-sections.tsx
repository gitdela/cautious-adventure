import Image from "next/image";
import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiBriefcaseLine,
  RiMailLine,
  RiMapPinLine,
  RiMegaphoneLine,
  RiPhoneLine,
  RiScales3Line,
  RiTimeLine,
} from "@remixicon/react";

import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";
import { ServiceCard } from "@workspace/ui/components/service-card";
import { StationIcon } from "@workspace/ui/components/station-icon";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

import { ContactMessageForm } from "./contact-message-form";

const enquiryTeams = [
  {
    title: "Products & sales",
    description:
      "Enquiries about lubricants, fuel products, bulk purchasing, or corporate supply agreements.",
    icon: <StationIcon name="fuel-drop" />,
  },
  {
    title: "FullCare & services",
    description:
      "Enquiries about our lube bay service, fuel delivery, or station-related services.",
    icon: <StationIcon name="fullcare" />,
  },
  {
    title: "Careers & HR",
    description:
      "Career opportunities, internships, and human resources related enquiries.",
    icon: <RiBriefcaseLine />,
  },
  {
    title: "Media & press",
    description:
      "Press releases, media enquiries, interviews, and corporate communications.",
    icon: <RiMegaphoneLine />,
  },
  {
    title: "Station franchising",
    description:
      "Interested in operating a PETROSOL fuel station? Contact our business development team.",
    icon: <StationIcon name="station-pin" />,
  },
  {
    title: "Compliance & legal",
    description:
      "Regulatory, legal, and compliance related communications for PETROSOL PLC.",
    icon: <RiScales3Line />,
  },
];

function ContactPageHeader() {
  return (
    <PageHeader
      title="Contact Us"
      background={
        <Image
          src="/images/home/refinery-wide.png"
          alt="Petroleum refinery infrastructure"
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
            { label: "Contact Us" },
          ]}
        />
      }
    />
  );
}

function OfficeDetails() {
  return (
    <div>
      <SectionHeading eyebrow="Head office" highlight="Energy PLC">
        PETROSOL Platinum
      </SectionHeading>
      <div className="mt-7 flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <span className="inline-grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white [&_svg]:size-5">
            <RiMapPinLine aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-[18px] font-bold text-navy-900">
              Address
            </h3>
            <p className="mt-1 text-[13px] leading-[1.58]">
              No. 2, Freetown Avenue
              <br />
              East Legon, Accra, Ghana
              <br />
              Digital Address: GA-448-0004
              <br />
              P.O. Box CT 6900, Cantonments
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="inline-grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white [&_svg]:size-5">
            <RiPhoneLine aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-[18px] font-bold text-navy-900">
              Telephone
            </h3>
            <p className="mt-1 text-[13px] leading-[1.58]">
              +233 (0)362 196 538
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="inline-grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white [&_svg]:size-5">
            <RiMailLine aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-[18px] font-bold text-navy-900">
              Email
            </h3>
            <p className="mt-1 text-[13px] leading-[1.58]">
              info@petrosol.com.gh
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="inline-grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white [&_svg]:size-5">
            <RiTimeLine aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-[18px] font-bold text-navy-900">
              Office hours
            </h3>
            <p className="mt-1 text-[13px] leading-[1.58]">
              Monday &ndash; Friday
              <br />
              8:00am &ndash; 5:00pm GMT
            </p>
          </div>
        </div>
      </div>
      <a
        href="https://maps.google.com/?q=No.+2+Freetown+Avenue,+East+Legon,+Accra,+Ghana"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex items-center gap-2 font-display text-[13px] font-bold text-brand transition-colors hover:text-orange-600"
      >
        Open in Google Maps
        <RiArrowRightUpLine aria-hidden="true" className="size-4" />
      </a>
    </div>
  );
}

function ContactMain() {
  return (
    <section className="ps-container grid grid-cols-1 items-start gap-[clamp(48px,6.25vw,80px)] pt-[var(--section-y)] pb-[var(--section-y-tight)] min-[841px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <ContactMessageForm />
      <OfficeDetails />
    </section>
  );
}

function MapEmbed() {
  return (
    <section className="ps-container pb-[var(--section-y)]" aria-label="Head office map">
      <div className="overflow-hidden rounded-2xl shadow-card">
        <iframe
          title="PETROSOL head office in East Legon, Accra"
          src="https://www.google.com/maps?q=No.+2+Freetown+Avenue,+East+Legon,+Accra,+Ghana&output=embed"
          width="100%"
          height="420"
          className="block border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

function EnquiriesGrid() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Specific enquiries"
          align="center"
          highlight="directly"
        >
          Contact the right team
        </SectionHeading>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {enquiryTeams.map(({ title, description, icon }) => (
            <ServiceCard key={title} title={title} icon={icon}>
              {description}
              <a
                href="mailto:info@petrosol.com.gh"
                className="mt-3 block font-display font-bold text-brand transition-colors hover:text-orange-600"
              >
                info@petrosol.com.gh
              </a>
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function StationCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/home/pipes-blue-sky.png"
        alt="Petrosol fuel infrastructure beneath a blue sky"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          eyebrow="Visit us"
          tone="light"
          align="center"
          highlight="near you"
        >
          Find a PETROSOL station
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/stations">Find a station</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/about">About PETROSOL</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ContactSections() {
  return (
    <main>
      <ContactPageHeader />
      <ContactMain />
      <MapEmbed />
      <EnquiriesGrid />
      <StationCta />
    </main>
  );
}

export { ContactSections };
