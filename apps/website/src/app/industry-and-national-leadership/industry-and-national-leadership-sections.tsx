import Link from "next/link";
import {
  RiBookOpenLine,
  RiGraduationCapLine,
  RiMegaphoneLine,
} from "@remixicon/react";

import type {
  GalleryEventView,
  NationalLeadershipProfileView,
} from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { SectionHeading, PhotoTile } from "@workspace/ui/components/marketing";
import { ServiceCard } from "@workspace/ui/components/service-card";

import { contentAdapters } from "@/lib/content-adapters";

import { MosaicCtaBand } from "../mosaic-cta-band";
import { MosaicPageHeader } from "../mosaic-page-header";
import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { IndustryPlatforms } from "./industry-platforms";
import { NationalLeadershipProfiles } from "./national-leadership-profiles";

const contributionAreas = [
  {
    title: "Policy dialogue & reform advocacy",
    description:
      "We contribute practical downstream experience to conversations on policy, regulation, local content, investment and the reforms needed for a resilient energy sector.",
    icon: RiMegaphoneLine,
  },
  {
    title: "Industry best practice",
    description:
      "We invest in the systems, standards and knowledge that strengthen quality, safety, ethical conduct, environmental responsibility and operational excellence.",
    icon: RiBookOpenLine,
  },
  {
    title: "Leadership advocacy",
    description:
      "Our people serve on industry, employer and national platforms, bringing an indigenous energy-business perspective to shared challenges and opportunities.",
    icon: RiGraduationCapLine,
  },
];

function IndustryLeadershipHeader() {
  return (
    <MosaicPageHeader
      title="Industry & National Leadership"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
            { label: "Industry & National Leadership" },
          ]}
        />
      }
    />
  );
}

function IndustryLeadershipIntroduction({
  events,
}: {
  events: GalleryEventView[];
}) {
  const { Image: CmsImage } = contentAdapters;
  const heroPhoto = events.find((event) => event.photos.length > 0)?.photos[0];

  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div>
        <SectionHeading
          eyebrow="Beyond our operations"
          highlight="shared progress"
        >
          Contributing to
        </SectionHeading>
        <div className="mt-6 flex max-w-[58ch] flex-col gap-5">
          <p>
            PETROSOL believes a stronger energy sector is built through shared
            knowledge, responsible leadership and constructive engagement. We
            contribute our experience to the conversations and institutions
            shaping Ghana&apos;s business and energy future.
          </p>
          <p>
            Through industry platforms, professional bodies and national
            appointments, we support policy dialogue, invest in best practices
            and advocate for a resilient, competitive and sustainable sector.
          </p>
        </div>
      </div>
      <PhotoTile
        ratio="news"
        image={
          heroPhoto ? (
            <CmsImage
              source={heroPhoto}
              alt={heroPhoto.alt ?? "PETROSOL at an industry conference"}
              width={1200}
              height={800}
              sizes="(max-width: 840px) 100vw, 54vw"
              priority
            />
          ) : (
            <ImagePlaceholder label="Industry conference photography coming soon" />
          )
        }
      />
    </section>
  );
}

function ContributionAreas() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our contribution"
          tone="light"
          align="center"
          highlight="responsible growth"
        >
          Investing in
        </SectionHeading>
        <div className="mt-14 grid grid-cols-1 gap-5 min-[721px]:grid-cols-3">
          {contributionAreas.map(({ title, description, icon: Icon }) => (
            <ServiceCard key={title} title={title} icon={<Icon />}>
              {description}
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function NationalLeadershipSection({
  profiles,
}: {
  profiles: NationalLeadershipProfileView[];
}) {
  return (
    <section className="ps-container py-[var(--section-y)]">
      <SectionHeading
        eyebrow="People who represent PETROSOL"
        highlight="national platforms"
      >
        Leadership beyond the
      </SectionHeading>
      <p className="mt-6 max-w-[62ch]">
        Our current and former leaders contribute to the work of employer
        associations, industry chambers, professional bodies and national
        institutions. Their service extends PETROSOL&apos;s values into the wider
        business and energy community.
      </p>
      <div className="mt-14">
        <NationalLeadershipProfiles profiles={profiles} />
      </div>
    </section>
  );
}

function IndustryLeadershipCta() {
  return (
    <MosaicCtaBand>
      <SectionHeading
        eyebrow="Keep the conversation moving"
        tone="light"
        align="center"
        highlight="PETROSOL"
      >
        Connect with
      </SectionHeading>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/leadership-team">Meet our leadership</Link>
        </Button>
        <Button asChild variant="outlineInverse">
          <Link href="/events">Explore all events</Link>
        </Button>
      </div>
    </MosaicCtaBand>
  );
}

function IndustryAndNationalLeadershipSections({
  events,
  profiles,
}: {
  events: GalleryEventView[];
  profiles: NationalLeadershipProfileView[];
}) {
  return (
    <main>
      <IndustryLeadershipHeader />
      <IndustryLeadershipIntroduction events={events} />
      <ContributionAreas />
      <NationalLeadershipSection profiles={profiles} />
      <IndustryPlatforms events={events} />
      <IndustryLeadershipCta />
    </main>
  );
}

export { IndustryAndNationalLeadershipSections };
