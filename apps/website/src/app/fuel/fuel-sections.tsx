import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiLeafLine, RiShieldCheckLine } from "@remixicon/react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  PhotoTile,
  SectionHeading,
  Stat,
} from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";
import { ServiceCard } from "@workspace/ui/components/service-card";
import { StationIcon } from "@workspace/ui/components/station-icon";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

const pumpPrices = [
  ["\u20b59.80", "Petrol"],
  ["\u20b516.00", "Diesel"],
  ["\u20b511.20", "Premium"],
];

const integrityPoints = [
  {
    title: "Full quantity",
    description:
      "Independently calibrated pumps at every station \u2014 a litre bought is a litre delivered.",
    icon: <RiShieldCheckLine />,
  },
  {
    title: "No contaminants",
    description:
      "A protected chain from loading depot to station to your tank keeps every litre clean.",
    icon: <StationIcon name="fuel-drop" />,
  },
  {
    title: "Cleaner emissions",
    description:
      "Quality fuel burns cleaner \u2014 protecting engines and the environment alike.",
    icon: <RiLeafLine />,
  },
];

function FuelPageHeader() {
  return (
    <PageHeader
      title="Fuel"
      background={
        <Image
          src="/images/fuel/pumpjack-sky-wide.png"
          alt="Oil pumpjack beneath a blue sky"
          fill
          priority
          sizes="100vw"
        />
      }
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products" },
            { label: "Fuel" },
          ]}
        />
      }
    />
  );
}

function PriceBand() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y-tight)]">
      <div className="ps-container flex flex-wrap items-center justify-center gap-x-20 gap-y-8">
        <time
          dateTime="2026-07-27"
          className="basis-full text-center font-mono text-[11px] tracking-[0.14em] text-white/65 uppercase"
        >
          At the pump today &middot; 27 Jul 2026
        </time>
        {pumpPrices.map(([value, fuel]) => (
          <Stat
            key={fuel}
            value={value}
            label={
              <>
                {fuel} &middot; GHS/L
              </>
            }
            size="md"
            className="min-w-[120px]"
          />
        ))}
      </div>
    </section>
  );
}

function FuelFeature({
  eyebrow,
  heading,
  highlight,
  imageSrc,
  imageAlt,
  flip = false,
  children,
}: {
  eyebrow: string;
  heading: string;
  highlight: string;
  imageSrc: string;
  imageAlt: string;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y-tight)] min-[841px]:grid-cols-2">
      <div className={flip ? "order-2" : "order-1"}>
        <SectionHeading eyebrow={eyebrow} highlight={highlight}>
          {heading}
        </SectionHeading>
        <div className="mt-6 flex max-w-[54ch] flex-col gap-5">{children}</div>
      </div>
      <PhotoTile
        ratio="news"
        className={flip ? "order-1" : "order-2"}
        image={
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 840px) 100vw, 50vw"
          />
        }
      />
    </section>
  );
}

function PetrolSection() {
  return (
    <FuelFeature
      eyebrow="Gasoline / Premium"
      heading="Petrol that arrives as clean as it"
      highlight="left the depot"
      imageSrc="/images/fuel/petrosol-petrol-pump.webp"
      imageAlt="PETROSOL petrol pump refuelling a vehicle"
    >
      <p>
        PETROSOL markets high quality petrol that meets both local and
        international standards &mdash; fit for use in all makes of petrol vehicles
        and machines from around the world.
      </p>
      <p>
        To maintain its integrity, we&apos;ve invested heavily so that from the
        loading depots to the stations, all the way to your fuel tank, no
        contaminants gain access to the product.
      </p>
      <p>
        Besides getting it in full quantity, you get the full benefit of every
        litre &mdash; while the environment is protected from harmful emissions.
      </p>
    </FuelFeature>
  );
}

function DieselSection() {
  return (
    <FuelFeature
      eyebrow="Gasoil / Automotive Gasoil"
      heading="Low sulfur diesel, protected"
      highlight="every step"
      imageSrc="/images/home/refinery-tanks.png"
      imageAlt="Petroleum storage tanks"
      flip
    >
      <p>
        Like our petrol, PETROSOL diesel meets both local and international
        standards &mdash; guaranteed fit for all makes of diesel vehicles and
        machines from around the world.
      </p>
      <p>
        Our low sulfur diesel travels a protected chain: from loading depot to
        station to your tank, no contaminants gain access to the product.
      </p>
      <p>
        Every litre delivers its full benefit, in full quantity &mdash; with fewer
        harmful emissions along the way.
      </p>
    </FuelFeature>
  );
}

function IntegrityBand() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our fundamental promise"
          align="center"
          highlight="on time, every time"
        >
          Clean fuel in full quantity,
        </SectionHeading>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {integrityPoints.map(({ title, description, icon }) => (
            <ServiceCard key={title} title={title} icon={icon}>
              {description}
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegritySplit() {
  return (
    <section className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(40px,5vw,80px)] pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div>
        <SectionHeading eyebrow="Fuel integrity" highlight="full value">
          Accurate pumps, assured quality,
        </SectionHeading>
        <p className="mt-6 max-w-[50ch]">
          Every consignment is tested before discharge and every pump is
          independently calibrated. Marker-dosed fuel lets us trace and reject
          any adulteration in the supply chain.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            GSA certified
          </Badge>
          <Badge>Marker-dosed</Badge>
          <Badge variant="secondary">Calibrated pumps</Badge>
        </div>
      </div>
      <PhotoTile
        ratio="news"
        image={
          <Image
            src="/images/board/gauges.png"
            alt="Calibrated industrial pump gauges"
            fill
            sizes="(max-width: 840px) 100vw, 50vw"
          />
        }
      />
    </section>
  );
}

function BulkCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/about/plant-silos-wide.png"
        alt="PETROSOL bulk energy infrastructure"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Bulk supply"
          highlight="direct to site"
        >
          Corporate volumes, delivered
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/contact">Enquire about bulk supply</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/lubricants">Explore lubricants</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FuelSections() {
  return (
    <main>
      <FuelPageHeader />
      <PriceBand />
      <PetrolSection />
      <DieselSection />
      <IntegrityBand />
      <IntegritySplit />
      <BulkCta />
    </main>
  );
}

export { FuelSections };
