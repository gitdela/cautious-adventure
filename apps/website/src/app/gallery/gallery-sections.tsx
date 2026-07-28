import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { GalleryGrid } from "./gallery-grid";

function GalleryPageHeader() {
  return (
    <PageHeader
      title="Gallery"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Media" },
            { label: "Gallery" },
          ]}
        />
      }
    />
  );
}

function GalleryCta() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y-tight)]">
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Media"
          highlight="the network"
        >
          More stories from across
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/csr">Our CSR work</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/contact">Media enquiries</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function GallerySections() {
  return (
    <main>
      <GalleryPageHeader />
      <GalleryGrid />
      <GalleryCta />
    </main>
  );
}

export { GallerySections };
