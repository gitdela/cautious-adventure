import Image from "next/image";
import Link from "next/link";
import { RiShieldCheckLine } from "@remixicon/react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

import { LubricantsCatalogue } from "./lubricants-catalogue";

function LubricantsPageHeader() {
  return (
    <PageHeader
      title="Lubricants"
      background={
        <Image
          src="/images/lubricants/pipeline-valves.png"
          alt="Industrial pipeline and valve infrastructure"
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
            { label: "Lubricants" },
          ]}
        />
      }
    />
  );
}

function LubricantsIntro() {
  return (
    <section className="mx-auto flex max-w-[900px] flex-col items-center px-[var(--container-pad)] py-[var(--section-y-tight)] text-center">
      <SectionHeading
        eyebrow="Our lubricants"
        align="center"
        highlight="Syntec&reg; additives"
      >
        Blended from virgin base oils and
      </SectionHeading>
      <p className="mt-6 max-w-[62ch]">
        PETROSOL markets best-in-class lubricants, made from group II virgin base
        oils, superior synthetic base oils and Syntec&reg; additives. Every blend is
        designed for longer service life, fuel efficiency, and the lubrication
        requirements of OEMs around the world.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Badge>Syntec&reg; additive technology</Badge>
        <Badge variant="secondary">Group II virgin base oils</Badge>
        <Badge variant="success">
          <RiShieldCheckLine data-icon="inline-start" />
          OEM specifications
        </Badge>
      </div>
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
          batch-tested before release. Tamper-evident seals on every pack &mdash;
          if the seal is broken, don&apos;t buy it.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-6">
          <Button asChild>
            <Link href="/contact">Enquire about bulk supply</Link>
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

function LubricantsSections() {
  return (
    <main>
      <LubricantsPageHeader />
      <LubricantsIntro />
      <LubricantsCatalogue />
      <QualityBand />
    </main>
  );
}

export { LubricantsSections };
