import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RiBatteryChargeLine,
  RiDashboard3Line,
  RiFilter3Line,
  RiShieldCheckLine,
  RiWindyLine,
} from "@remixicon/react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { PhotoTile, SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";
import { StationIcon } from "@workspace/ui/components/station-icon";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

const checks: Array<{
  title: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    title: "Professional oil change",
    description:
      "Oil changes done professionally, using our top-of-the-range PETROSOL lubricants.",
    icon: <StationIcon name="jerrycan" />,
  },
  {
    title: "Oil & fuel filter change",
    description:
      "Oil and fuel filters replaced with genuine parts — never imitations.",
    icon: <RiFilter3Line />,
  },
  {
    title: "Air filter care",
    description:
      "Air filter checks and cleaning to keep your engine breathing freely.",
    icon: <RiWindyLine />,
  },
  {
    title: "Routine checks",
    description:
      "Battery, refrigerant, coolant, transmission and gear oil, washer fluid — we advise on or correct any anomaly detected.",
    icon: <RiBatteryChargeLine />,
  },
  {
    title: "General services",
    description:
      "Tyre pressure, lighting, windows, fluid levels, power steering and fifth-wheel checks.",
    icon: <RiDashboard3Line />,
  },
  {
    title: "Vehicle diagnostics",
    description:
      "Full vehicle diagnostics to catch problems before they slow you down.",
    icon: <StationIcon name="fullcare" />,
  },
];

const steps = [
  {
    number: "01",
    title: "Drive in",
    description:
      "Pull up to any PETROSOL FULLCARE Center — no appointment needed.",
  },
  {
    number: "02",
    title: "We service",
    description:
      "Oil, filters and fluids handled while our technicians run the routine checks.",
  },
  {
    number: "03",
    title: "Drive on",
    description:
      "We advise on or correct any anomaly detected, and you drive off with peace of mind.",
  },
];

function FullcarePageHeader() {
  return (
    <PageHeader
      title="FullCare"
      background={
        <Image
          src="/images/about/hero-inspection.png"
          alt="Technician inspecting a vehicle"
          fill
          priority
          sizes="100vw"
        />
      }
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services" },
            { label: "FullCare" },
          ]}
        />
      }
    />
  );
}

function FullcareIntro() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] py-[var(--section-y-tight)] min-[841px]:grid-cols-2">
      <div>
        <SectionHeading
          eyebrow="Petrosol FullCare"
          highlight="total peace of mind"
        >
          All-round vehicle servicing for
        </SectionHeading>
        <p className="mt-6 max-w-[52ch]">
          PETROSOL FULLCARE offers all-round, professional vehicle servicing
          that ensures a smooth driving experience and total peace of mind.
          When you visit a PETROSOL FULLCARE Center, you&apos;re assured of
          genuine parts, top-of-the-range lubricants and technicians who check
          what others miss.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            Genuine parts
          </Badge>
          <Badge>Top-range lubricants</Badge>
          <Badge variant="secondary">Professional technicians</Badge>
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/stations">Find a FULLCARE Center</Link>
          </Button>
        </div>
      </div>
      <PhotoTile
        ratio="news"
        image={
          <Image
            src="/images/home/fullcare.webp"
            alt="PETROSOL FULLCARE technician servicing a vehicle"
            fill
            sizes="(max-width: 840px) 100vw, 50vw"
          />
        }
      />
    </section>
  );
}

function ChecksBand() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading tone="light" eyebrow="In the bay" highlight="every visit">
          What we check,
        </SectionHeading>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {checks.map(({ title, description, icon }) => (
            <div key={title} className="border-t border-white/16 pt-5">
              <span className="inline-grid size-14 shrink-0 place-items-center rounded-full bg-brand text-white [&_svg]:size-6">
                {icon}
              </span>
              <h3 className="mt-4 font-display text-[18px] font-bold text-white">
                {title}
              </h3>
              <p className="mt-2 max-w-[44ch] text-white/78">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsBand() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="How it works"
          align="center"
          highlight="three steps"
        >
          Serviced in
        </SectionHeading>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {steps.map(({ number, title, description }) => (
            <div
              key={number}
              className="rounded-2xl bg-background p-[var(--card-pad)] shadow-card"
            >
              <div className="font-display text-[length:var(--size-stat-md)] leading-[1.05] font-bold tracking-[-0.02em] text-brand">
                {number}
              </div>
              <h3 className="mt-4 font-display text-[18px] font-bold text-navy-900">
                {title}
              </h3>
              <p className="mt-2">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FullcareCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/about/worker-platform.png"
        alt="PETROSOL worker on an industrial platform"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Your next service"
          highlight="fuel stop"
        >
          An oil change that takes a
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/stations">Find a FULLCARE Center</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/lubricants">Explore lubricants</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FullcareSections() {
  return (
    <main>
      <FullcarePageHeader />
      <FullcareIntro />
      <ChecksBand />
      <StepsBand />
      <FullcareCta />
    </main>
  );
}

export { FullcareSections };
