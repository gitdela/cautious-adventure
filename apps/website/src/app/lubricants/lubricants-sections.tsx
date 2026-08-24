import Link from "next/link";

import type {
  LubricantCategoryView,
  LubricantProductView,
} from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { MosaicPageHeader } from "../mosaic-page-header";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

import { LubricantsCatalogue } from "./lubricants-catalogue";

function LubricantsPageHeader() {
  return (
    <MosaicPageHeader
      title="Lubricants"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products & Services" },
            { label: "Lubricants" },
          ]}
        />
      }
    />
  );
}

function LubricantsIntro() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-[var(--container-pad)] py-[var(--section-y-tight)] text-center">
      <SectionHeading
        eyebrow="Our lubricants"
        align="center"
        highlight="and Protection"
      >
        Optimum Engine Performance
      </SectionHeading>
      <p className="mt-6 max-w-[72ch]">
        PETROSOL offers a premium range of high-performance lubricants formulated
        from Group II virgin base oils, advanced synthetic base oils, and
        Syntec&reg; additive technology. Each formulation is carefully developed
        to deliver reliable engine protection, enhanced performance, improved
        fuel efficiency, and extended service life for every vehicle.
      </p>
    </section>
  );
}

function QualityBand() {
  return (
    <section className="rounded-tr-[120px] bg-surface-slate py-[var(--section-y-tight)]">
      <div className="ps-container">
        <SectionHeading
          tone="light"
          eyebrow="Quality promise"
          size="sm"
          highlight="sealed and certified"
        >
          Every pack
        </SectionHeading>
        <p className="mt-5 max-w-[56ch] text-[13px] leading-[1.62] text-white/78">
          PETROSOL lubricants are blended to international specifications and
          batch-tested before release. Tamper-evident seals on every pack.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-6">
          <Button asChild>
            <Link href="/contact-us">Enquire about bulk supply</Link>
          </Button>
          <a
            href="mailto:info@petrosol.com.gh"
            className="font-display text-[13px] font-bold text-white hover:text-orange-300"
          >
            info@petrosol.com.gh
          </a>
        </div>
      </div>
    </section>
  );
}

function LubricantsSections({
  products,
  categories,
}: {
  products: LubricantProductView[];
  categories: LubricantCategoryView[];
}) {
  return (
    <main>
      <LubricantsPageHeader />
      <LubricantsIntro />
      <LubricantsCatalogue products={products} categories={categories} />
      <QualityBand />
    </main>
  );
}

export { LubricantsSections };
