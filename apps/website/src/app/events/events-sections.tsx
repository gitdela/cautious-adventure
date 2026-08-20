import Link from "next/link";

import type { GalleryEventView } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";

import { MosaicPageHeader } from "../mosaic-page-header";
import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { EventsRows } from "./events-rows";

function EventsPageHeader() {
  return (
    <MosaicPageHeader
      title="Gallery"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Media" }]}
        />
      }
    />
  );
}

function MediaCta() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y-tight)]">
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-10 px-[var(--container-pad)]">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Media"
          size="md"
          highlight="the network"
        >
          More stories from across
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/sustainability-and-community">Our CSR work</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/contact-us">Media enquiries</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function EventsSections({ events }: { events: GalleryEventView[] }) {
  return (
    <main>
      <EventsPageHeader />
      <EventsRows events={events} />
      <MediaCta />
    </main>
  );
}

export { EventsSections };
