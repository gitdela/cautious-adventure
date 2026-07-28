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
import { PageHeader } from "@workspace/ui/components/page-header";
import {
  StationChip,
  type StationIconName,
} from "@workspace/ui/components/station-icon";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

const quantityStats = [
  ["10L = 10L", "At every station, every delivery"],
  ["100%", "Full quantity, every liter paid"],
  ["115+", "Stations across Ghana"],
];

const promisePoints: Array<{
  icon: StationIconName;
  title: string;
  description: string;
}> = [
  {
    icon: "pump",
    title: "Guarded nozzle integrity",
    description:
      "The integrity of pump nozzles at our stations is guarded jealously, so they deliver exactly the full volume of fuel you pay for.",
  },
  {
    icon: "fuel-drop",
    title: "10 liters stay 10 liters",
    description:
      "Regardless of which PETROSOL station or delivery you buy from, 10 liters will remain 10 liters.",
  },
  {
    icon: "tanker",
    title: "Value for your money",
    description:
      "To choose PETROSOL is to choose value for your hard-earned money — full quantity, every time.",
  },
];

const steps = [
  {
    number: "01",
    title: "Order",
    description:
      "Call or message with product, volume and location; we confirm price and a delivery window.",
  },
  {
    number: "02",
    title: "We dispatch",
    description:
      "A sealed, calibrated tanker is dispatched with your delivery note.",
  },
  {
    number: "03",
    title: "Verify & sign",
    description:
      "Watch the meter as we discharge, confirm the volume, sign — done.",
  },
];

function DeliveryPageHeader() {
  return (
    <PageHeader
      title="Fuel Delivery Service"
      background={
        <Image
          src="/images/home/pipes-blue-sky.png"
          alt="Fuel pipelines against a blue sky"
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
            { label: "Fuel Delivery Service" },
          ]}
        />
      }
    />
  );
}

function QuantityBand() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y-tight)]">
      <div className="ps-container flex flex-wrap items-center justify-center gap-x-20 gap-y-8">
        {quantityStats.map(([value, label]) => (
          <Stat
            key={value}
            value={value}
            label={label}
            size="md"
            className="min-w-[120px]"
          />
        ))}
      </div>
    </section>
  );
}

function DeliverySplit() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <PhotoTile
        ratio="news"
        className="max-[840px]:order-2"
        image={
          <Image
            src="/images/home/fuel-delivery.webp"
            alt="PETROSOL fuel delivery to a customer site"
            fill
            sizes="(max-width: 840px) 100vw, 50vw"
          />
        }
      />
      <div className="max-[840px]:order-1">
        <SectionHeading eyebrow="Fuel delivery service" highlight="to you">
          The station comes
        </SectionHeading>
        <p className="mt-6 max-w-[50ch]">
          PETROSOL doesn&apos;t just guarantee you quality fuel at the pump.
          Our delivery service brings that same fuel &mdash; and the same
          guarantee &mdash; straight to your home, business or site: for each
          liter paid, an exact liter is received.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            Full quantity
          </Badge>
          <Badge>Sealed &amp; metered</Badge>
          <Badge variant="secondary">Quality guaranteed</Badge>
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/contact">Request a delivery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function QuantityPromise() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          tone="light"
          eyebrow="Full quantity"
          highlight="liter is received"
        >
          For each liter paid, an exact
        </SectionHeading>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {promisePoints.map(({ icon, title, description }) => (
            <div key={title} className="border-t border-white/16 pt-5">
              <StationChip name={icon} />
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

function DeliverySteps() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="How it works"
          align="center"
          highlight="tank filled"
        >
          From phone call to
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

function DeliveryCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/home/refinery-tanks.png"
        alt="Petroleum storage tanks"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Ready when you are"
          highlight="delivered in full"
        >
          Quality fuel,
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/contact">Request a delivery</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/fuel">Explore our fuels</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FuelDeliverySections() {
  return (
    <main>
      <DeliveryPageHeader />
      <QuantityBand />
      <DeliverySplit />
      <QuantityPromise />
      <DeliverySteps />
      <DeliveryCta />
    </main>
  );
}

export { FuelDeliverySections };
