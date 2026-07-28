import Image from "next/image";
import Link from "next/link";
import { RiShieldCheckLine } from "@remixicon/react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { PhotoTile, SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";
import {
  StationChip,
  type StationIconName,
} from "@workspace/ui/components/station-icon";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

const merchandisingPoints: Array<{
  icon: StationIconName;
  title: string;
  description: string;
}> = [
    {
      icon: "shop",
      title: "Quality",
      description:
        "Every item on our shelves is selected for quality — the same standard we hold our fuel to.",
    },
    {
      icon: "fuel-drop",
      title: "Relevance",
      description:
        "We stock a collection of products matched to the everyday needs of our customers.",
    },
    {
      icon: "station-pin",
      title: "Availability",
      description:
        "Assorted items kept properly stocked and within reach, at every PETROSOL station shop.",
    },
  ];

function ShopPageHeader() {
  return (
    <PageHeader
      title="Shop"
      background={
        <Image
          src="/images/about/plant-silos-wide.png"
          alt="PETROSOL plant silos"
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
            { label: "Shop" },
          ]}
        />
      }
    />
  );
}

function ShopIntro() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <div>
        <SectionHeading eyebrow="The PETROSOL shop" highlight="fuel stop">
          A corner store at every
        </SectionHeading>
        <p className="mt-6 max-w-[50ch]">
          Shops at PETROSOL service stations are properly stocked with assorted
          items to meet the grocery needs of our customers &mdash; so you can
          grab what you need while your tank fills or your car is in the
          FULLCARE bay.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Badge>Properly stocked</Badge>
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            Quality merchandise
          </Badge>
          <Badge variant="secondary">At every station</Badge>
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/contact">Find a shop near you</Link>
          </Button>
        </div>
      </div>
      <PhotoTile
        ratio="news"
        image={
          <Image
            src="/images/home/shop.webp"
            alt="PETROSOL station shop shelves"
            fill
            sizes="(max-width: 840px) 100vw, 50vw"
            className="object-[50%_25%]"
          />
        }
      />
    </section>
  );
}

function MerchandisingBand() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          tone="light"
          eyebrow="In merchandising"
          highlight="every need"
        >
          A collection of products for
        </SectionHeading>
        <p className="mt-6 max-w-[56ch] text-white/78">
          We consider a blend of quality, relevance and availability &mdash; to
          place within reach a collection of products for every need of our
          customers.
        </p>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {merchandisingPoints.map(({ icon, title, description }) => (
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

function ShopCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/fuel/pumpjack-sky-wide.png"
        alt="Oil pumpjack beneath a blue sky"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="On your route"
          highlight="on the way"
        >
          Everything you need,
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/contact">Find a shop near you</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/fullcare">Explore FullCare</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ShopSections() {
  return (
    <main>
      <ShopPageHeader />
      <ShopIntro />
      <MerchandisingBand />
      <ShopCta />
    </main>
  );
}

export { ShopSections };
