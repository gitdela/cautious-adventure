import Image from "next/image";
import Link from "next/link";
import {
  RiFirstAidKitLine,
  RiGraduationCapLine,
  RiHandHeartLine,
  RiShieldCheckLine,
} from "@remixicon/react";

import type { GalleryEventView } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { Eyebrow, SectionHeading } from "@workspace/ui/components/marketing";
import { ServiceCard } from "@workspace/ui/components/service-card";

import { MosaicCtaBand } from "../mosaic-cta-band";
import { CsrEvents } from "./csr-events";

const communityPriorities = [
  {
    title: "Healthcare support",
    description:
      "We support health initiatives that strengthen access to care in the communities we serve.",
    icon: RiFirstAidKitLine,
  },
  {
    title: "Education & opportunity",
    description:
      "We invest in learning and youth development to help people build stronger futures.",
    icon: RiGraduationCapLine,
  },
  {
    title: "Public safety",
    description:
      "We partner with communities on programmes that promote safer roads, public spaces and everyday life.",
    icon: RiShieldCheckLine,
  },
  {
    title: "Emergency response",
    description:
      "We respond when communities face urgent needs, supporting relief and recovery efforts where we can make a difference.",
    icon: RiHandHeartLine,
  },
];

function CsrHero() {
  return (
    <section className="relative isolate flex h-[clamp(340px,44vw,560px)] items-end overflow-hidden">
      <Image
        src="/images/about/new-talent-outdoor-team.webp"
        alt="PETROSOL colleagues holding hands outside the company office"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_55%] min-[841px]:object-[50%_70%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900/25 to-navy-900/78" />
      <div className="ps-container w-full pb-12">
        <Eyebrow tone="light" className="mb-4">
          Corporate social responsibility
        </Eyebrow>
        <h1 className="font-display text-[length:var(--size-display-lg)] leading-[1.08] font-bold tracking-[-0.02em] text-white">
          Investing in people, <span className="swash">strengthening communities</span>
        </h1>
      </div>
    </section>
  );
}

function CommunityApproach() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <div className="grid grid-cols-1 gap-8 min-[841px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] min-[841px]:items-end">
          <SectionHeading eyebrow="Our community" highlight="shared progress">
            Investing in
          </SectionHeading>
          <p className="max-w-[54ch] min-[841px]:justify-self-end">
            PETROSOL&apos;s community work supports the people and places around
            our operations. We focus on practical partnerships that strengthen
            healthcare, education, public safety and disaster response across
            Ghana.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-4">
          {communityPriorities.map(({ title, description, icon: Icon }) => (
            <ServiceCard key={title} title={title} icon={<Icon />}>
              {description}
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function SustainabilityCta() {
  return (
    <MosaicCtaBand>
      <SectionHeading
        eyebrow="Environmental responsibility"
        tone="light"
        align="center"
        highlight="cleaner energy"
      >
        See how we&apos;re advancing
      </SectionHeading>
      <Button asChild>
        <Link href="/sustainability">Explore sustainability</Link>
      </Button>
    </MosaicCtaBand>
  );
}

function CsrSections({ events }: { events: GalleryEventView[] }) {
  return (
    <main>
      <CsrHero />
      <CommunityApproach />
      <CsrEvents events={events} />
      <SustainabilityCta />
    </main>
  );
}

export { CsrSections };
