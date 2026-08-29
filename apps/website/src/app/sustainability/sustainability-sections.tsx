import Link from "next/link";
import {
  RiLeafLine,
  RiPlantLine,
  RiRecycleLine,
  RiSunLine,
} from "@remixicon/react";

import { Button } from "@workspace/ui/components/button";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import {
  PhotoTile,
  SectionHeading,
} from "@workspace/ui/components/marketing";
import { ServiceCard } from "@workspace/ui/components/service-card";

import { MosaicCtaBand } from "../mosaic-cta-band";
import { MosaicPageHeader } from "../mosaic-page-header";
import { SiteBreadcrumbs } from "../site-breadcrumbs";

const greenInitiatives = [
  {
    title: "Solar-powered stations",
    description:
      "Selected PETROSOL stations now use solar power to support day-to-day site operations with cleaner electricity.",
    icon: RiSunLine,
  },
  {
    title: "Environmental management",
    description:
      "Our ISO 14001:2015 management system guides how we identify, manage and reduce environmental impacts across our operations.",
    icon: RiLeafLine,
  },
  {
    title: "Responsible resource use",
    description:
      "We work to use energy and materials responsibly, reduce waste and strengthen good environmental practices at our sites.",
    icon: RiRecycleLine,
  },
  {
    title: "Cleaner energy transition",
    description:
      "We are expanding beyond traditional oil marketing by exploring practical energy solutions that support a more sustainable future.",
    icon: RiPlantLine,
  },
];

function SustainabilityPageHeader() {
  return (
    <MosaicPageHeader
      title="Sustainability"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
            { label: "Sustainability" },
          ]}
        />
      }
    />
  );
}

function SustainabilityIntro() {
  return (
    <section className="ps-container grid grid-cols-1 items-end gap-8 py-[var(--section-y)] min-[841px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
      <SectionHeading eyebrow="Green energy initiatives" highlight="responsibly">
        Powering progress more
      </SectionHeading>
      <p className="max-w-[56ch] min-[841px]:justify-self-end">
        We are taking practical steps to reduce the environmental impact of
        our operations. From solar power at selected stations to disciplined
        environmental management, each initiative moves PETROSOL toward a
        cleaner and more resilient energy future.
      </p>
    </section>
  );
}

function SolarSpotlight() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,6vw,80px)] min-[841px]:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <PhotoTile
          ratio="news"
          image={
            <ImagePlaceholder
              label="PETROSOL solar-powered station photography coming soon"
              className="bg-surface-inverse-card text-white/72"
            />
          }
        />
        <div>
          <SectionHeading
            eyebrow="Solar at our stations"
            tone="light"
            highlight="the sun"
          >
            Cleaner power from
          </SectionHeading>
          <p className="mt-6 max-w-[54ch] text-white/72">
            Selected PETROSOL stations are now powered in part by solar energy.
            The installations support everyday station operations while
            reducing reliance on conventional grid electricity.
          </p>
          <p className="mt-4 max-w-[54ch] text-white/72">
            We will continue learning from these sites as we assess where solar
            power can make the greatest practical difference across our
            network.
          </p>
        </div>
      </div>
    </section>
  );
}

function GreenInitiatives() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our approach"
          align="center"
          highlight="lasting progress"
        >
          Practical steps toward
        </SectionHeading>
        <div className="mt-14 grid grid-cols-1 gap-5 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-4">
          {greenInitiatives.map(({ title, description, icon: Icon }) => (
            <ServiceCard key={title} title={title} icon={<Icon />}>
              {description}
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityCta() {
  return (
    <MosaicCtaBand>
      <SectionHeading
        eyebrow="Community impact"
        tone="light"
        align="center"
        highlight="communities"
      >
        See how we invest in
      </SectionHeading>
      <Button asChild>
        <Link href="/csr">Explore our CSR work</Link>
      </Button>
    </MosaicCtaBand>
  );
}

function SustainabilitySections() {
  return (
    <main>
      <SustainabilityPageHeader />
      <SustainabilityIntro />
      <SolarSpotlight />
      <GreenInitiatives />
      <CommunityCta />
    </main>
  );
}

export { SustainabilitySections };
