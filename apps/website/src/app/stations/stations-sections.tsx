import Link from "next/link";
import { RiMailLine } from "@remixicon/react";

import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { StationsDirectory } from "./stations-directory";

function StationsPageHeader() {
  return (
    <PageHeader
      title="Find a Station"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Fuel Station" },
            { label: "Find a Station" },
          ]}
        />
      }
    />
  );
}

function StationsCta() {
  return (
    <section className="rounded-tr-[120px] bg-surface-slate py-[var(--section-y-tight)]">
      <div className="ps-container">
        <SectionHeading
          tone="light"
          size="sm"
          eyebrow="Get in touch"
          highlight="we'll help"
        >
          No station near you? Talk to us &mdash;
        </SectionHeading>
        <div className="mt-8 grid items-start gap-[clamp(32px,4vw,64px)] min-[841px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <p className="max-w-[48ch] text-[14px] text-white/78">
              We&apos;re expanding the network every year. Call us and
              we&apos;ll point you to your nearest PETROSOL station &mdash; or
              suggest a location and we&apos;ll look into it.
            </p>
            <a
              href="tel:+233362196538"
              className="font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-white"
            >
              +233 (0)362 196 538
            </a>
            <div>
              <Button asChild>
                <Link href="/contact">Suggest a location</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-7 border-t border-white/16 pt-8 min-[841px]:border-t-0 min-[841px]:border-l min-[841px]:pt-0 min-[841px]:pl-[clamp(32px,4vw,64px)]">
            <a
              href="mailto:info@petrosol.com.gh"
              className="flex items-center gap-4"
            >
              <span className="inline-grid size-11 shrink-0 place-items-center rounded-full bg-brand text-white [&_svg]:size-5">
                <RiMailLine />
              </span>
              <span className="font-display text-[14px] font-bold text-white">
                info@petrosol.com.gh
              </span>
            </a>
            <div className="flex items-baseline gap-5">
              <span className="font-display text-[14px] font-bold whitespace-nowrap text-white">
                Mon &ndash; Fri
              </span>
              <span className="h-px flex-1 self-center bg-brand" />
              <span className="font-mono text-[12px] whitespace-nowrap text-white/78">
                8:00am &ndash; 5:00pm
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StationsSections() {
  return (
    <main>
      <StationsPageHeader />
      <StationsDirectory />
      <StationsCta />
    </main>
  );
}

export { StationsSections };
