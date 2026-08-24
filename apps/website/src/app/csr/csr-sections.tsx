import Image from "next/image";
import {
  RiLeafLine,
  RiScales3Line,
  RiShieldCheckLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";

import type { GalleryEventView } from "@workspace/content";
import { Eyebrow, SectionHeading } from "@workspace/ui/components/marketing";
import { ServiceCard } from "@workspace/ui/components/service-card";

import { CsrEvents } from "./csr-events";

const responsibilityPillars = [
  {
    title: "Environmental stewardship",
    description:
      "We use resources responsibly, work to reduce waste and follow the environmental controls reflected in our ISO 14001:2015 management system.",
    icon: RiLeafLine,
  },
  {
    title: "Health and safety",
    description:
      "We protect our people, customers and communities through disciplined safety practices supported by our ISO 45001:2018 management system.",
    icon: RiShieldCheckLine,
  },
  {
    title: "Responsible operations",
    description:
      "We operate ethically, comply with applicable standards and use our ISO 9001:2015 quality management system to support consistent delivery.",
    icon: RiScales3Line,
  },
  {
    title: "Community investment",
    description:
      "We support programmes that strengthen healthcare, education, public safety and disaster response in communities across Ghana.",
    icon: RiVerifiedBadgeLine,
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
          Sustainability &amp; community
        </Eyebrow>
        <h1 className="font-display text-[length:var(--size-display-lg)] leading-[1.08] font-bold tracking-[-0.02em] text-white">
          Responsible today, <span className="swash">ready for tomorrow</span>
        </h1>
      </div>
    </section>
  );
}

function ResponsibilityApproach() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <div className="grid grid-cols-1 gap-8 min-[841px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] min-[841px]:items-end">
          <SectionHeading eyebrow="Our approach" highlight="lasting impact">
            Responsible energy,
          </SectionHeading>
          <p className="max-w-[54ch] min-[841px]:justify-self-end">
            Sustainability at PETROSOL connects the way we manage our
            operations with the difference we make beyond them. We consider
            people, safety, the environment and long-term value in the
            decisions we take today.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-4">
          {responsibilityPillars.map(({ title, description, icon: Icon }) => (
            <ServiceCard key={title} title={title} icon={<Icon />}>
              {description}
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function CsrSections({ events }: { events: GalleryEventView[] }) {
  return (
    <main>
      <CsrHero />
      <ResponsibilityApproach />
      <CsrEvents events={events} />
    </main>
  );
}

export { CsrSections };
