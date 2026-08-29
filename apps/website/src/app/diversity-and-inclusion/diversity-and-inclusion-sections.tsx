import Link from "next/link";
import {
  RiBookOpenLine,
  RiGraduationCapLine,
  RiMegaphoneLine,
  RiUserCommunityLine,
} from "@remixicon/react";

import type { GalleryEventView } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import {
  PhotoTile,
  SectionHeading,
} from "@workspace/ui/components/marketing";
import { ServiceCard } from "@workspace/ui/components/service-card";

import { contentAdapters } from "@/lib/content-adapters";

import { MosaicCtaBand } from "../mosaic-cta-band";
import { MosaicPageHeader } from "../mosaic-page-header";
import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { PwnConferences } from "./pwn-conferences";

const pwnPriorities = [
  {
    title: "Connection & belonging",
    description:
      "PWN creates space for women across PETROSOL to build relationships, share experience and strengthen a sense of belonging.",
    icon: RiUserCommunityLine,
  },
  {
    title: "Leadership development",
    description:
      "The network encourages women to grow their confidence, capabilities and readiness to lead at every level of the business.",
    icon: RiGraduationCapLine,
  },
  {
    title: "Learning & mentorship",
    description:
      "Shared learning and mentorship help members exchange practical knowledge and support one another's professional growth.",
    icon: RiBookOpenLine,
  },
  {
    title: "Voice & visibility",
    description:
      "PWN celebrates women's contributions and creates opportunities for their ideas, achievements and perspectives to be seen and heard.",
    icon: RiMegaphoneLine,
  },
];

function DiversityPageHeader() {
  return (
    <MosaicPageHeader
      title="Diversity & Inclusion"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
            { label: "Diversity & Inclusion" },
          ]}
        />
      }
    />
  );
}

function PwnIntroduction({ conferences }: { conferences: GalleryEventView[] }) {
  const { Image: CmsImage } = contentAdapters;
  const heroPhoto = conferences.find((event) => event.photos.length > 0)
    ?.photos[0];

  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div>
        <SectionHeading
          eyebrow="PETROSOL Women Network"
          highlight="women thrive"
        >
          A network where
        </SectionHeading>
        <div className="mt-6 flex max-w-[58ch] flex-col gap-5">
          <p>
            The PETROSOL Women Network (PWN) is our platform for connecting and
            supporting women across the business. It advances an inclusive
            workplace where women can learn, contribute and grow.
          </p>
          <p>
            Through shared learning, mentorship and the Women in Leadership
            Conference, PWN creates opportunities for professional development
            while strengthening the relationships that help people succeed.
          </p>
        </div>
      </div>

      <PhotoTile
        ratio="news"
        image={
          heroPhoto ? (
            <CmsImage
              source={heroPhoto}
              alt={heroPhoto.alt ?? "PETROSOL Women Network conference"}
              width={1200}
              height={800}
              sizes="(max-width: 840px) 100vw, 54vw"
              priority
            />
          ) : (
            <ImagePlaceholder label="PETROSOL Women Network conference photography coming soon" />
          )
        }
      />
    </section>
  );
}

function PwnPriorities() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="What PWN supports"
          tone="light"
          align="center"
          highlight="together"
        >
          Progress made
        </SectionHeading>
        <div className="mt-14 grid grid-cols-1 gap-5 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-4">
          {pwnPriorities.map(({ title, description, icon: Icon }) => (
            <ServiceCard
              key={title}
              title={title}
              icon={<Icon />}
            >
              {description}
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecognitionBand() {
  return (
    <section className="ps-container py-[var(--section-y-tight)]">
      <div className="grid gap-6 border-y border-border py-8 min-[841px]:grid-cols-[minmax(180px,0.45fr)_minmax(0,1.55fr)] min-[841px]:items-center">
        <p className="font-display text-[13px] font-bold tracking-[0.14em] text-brand uppercase">
          Recognised commitment
        </p>
        <div>
          <h2 className="font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-navy-900">
            Employer of the Year Championing Diversity and Inclusion
          </h2>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Women in Mining and Energy Awards, 2023
          </p>
        </div>
      </div>
    </section>
  );
}

function InclusionCta() {
  return (
    <MosaicCtaBand>
      <SectionHeading
        eyebrow="People at PETROSOL"
        tone="light"
        align="center"
        highlight="our people"
      >
        Learn more about
      </SectionHeading>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/leadership-team">Meet our leadership</Link>
        </Button>
        <Button asChild variant="outlineInverse">
          <Link href="/contact-us">Contact our people team</Link>
        </Button>
      </div>
    </MosaicCtaBand>
  );
}

function DiversityAndInclusionSections({
  conferences,
}: {
  conferences: GalleryEventView[];
}) {
  return (
    <main>
      <DiversityPageHeader />
      <PwnIntroduction conferences={conferences} />
      <PwnPriorities />
      <PwnConferences conferences={conferences} />
      <RecognitionBand />
      <InclusionCta />
    </main>
  );
}

export { DiversityAndInclusionSections };
