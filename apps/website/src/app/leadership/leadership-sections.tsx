import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { SectionHeading, Stat } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";
import { PersonCard } from "@workspace/ui/components/person-card";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

const leadershipTeam = [
  ["Joseph Yaribil", "Head, Compliance and Supply Chain"],
  [
    "Philip Boamah Assampong",
    "Head, Marketing & Ag. Commercial Business Manager",
  ],
  ["Rita Afful", "Human Resources Manager"],
  ["Michael Affum Oseikoh", "Head, Finance and Planning"],
  ["Oko Kwei Odai", "Head, Projects, Technology and Maintenance"],
  ["Isaac Debezor", "Head, Risk and Internal Audit"],
];

const leadershipPrinciples = [
  ["Integrity", "Honest, transparent and accountable in all our operations."],
  ["Professionalism", "Upholding industry best practice in everything we do."],
  ["Excellence", "Setting the standard for petroleum OMCs in Africa."],
  ["People first", "Our team is our greatest asset — we invest in their growth."],
];

function LeadershipPageHeader() {
  return (
    <PageHeader
      title="Leadership"
      background={
        <Image
          src="/images/home/surveyor-hivis.png"
          alt="Petrosol professional reviewing field operations"
          fill
          priority
          sizes="100vw"
        />
      }
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Company" },
            { label: "Leadership" },
          ]}
        />
      }
    />
  );
}

function LeadershipIntro() {
  return (
    <section className="ps-blueprint py-[var(--section-y-tight)]">
      <div className="mx-auto flex max-w-[900px] flex-col items-center px-[var(--container-pad)] text-center">
        <SectionHeading
          eyebrow="Senior leadership team"
          align="center"
          highlight="PETROSOL's vision"
        >
          The experienced professionals steering
        </SectionHeading>
        <p className="mt-6 max-w-[62ch]">
          Our leadership team brings together decades of experience across
          petroleum operations, finance, marketing, compliance and human capital
          — united by a shared commitment to energizing dreams and delivering
          excellence across Ghana.
        </p>
        <Stat
          value="7+"
          label="Senior leaders"
          size="md"
          tone="default"
          className="mt-8"
        />
      </div>
    </section>
  );
}

function CeoFeature() {
  return (
    <section className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)]">
      <PersonCard
        name="Michael Bozumbil"
        role="Chief Executive Officer"
        className="w-full max-w-[400px]"
      />
      <div>
        <SectionHeading eyebrow="Executive leadership" highlight="Bozumbil">
          Michael
        </SectionHeading>
        <div className="mt-6 flex max-w-[56ch] flex-col gap-5">
          <p>
            Michael Bozumbil serves as the Chief Executive Officer of PETROSOL
            Platinum Energy PLC, leading the company&apos;s strategic direction and
            operational excellence across Ghana&apos;s petroleum downstream sector.
          </p>
          <p>
            Under his leadership, PETROSOL has grown to operate over 115 fuel
            stations nationwide, achieved triple ISO certification, and
            established itself as one of Ghana&apos;s premier privately-owned Oil
            Marketing Companies — with a reputation for clean fuel in full
            quantity and service excellence.
          </p>
          <p>
            His vision of being a model of excellence in the global energy space
            continues to drive PETROSOL&apos;s expansion and its commitment to
            energizing the dreams of Ghanaians.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/achievements">Our achievements</Link>
        </Button>
      </div>
    </section>
  );
}

function TeamGrid() {
  return (
    <section className="ps-blueprint rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Senior management"
          tone="light"
          highlight="leadership team"
        >
          Meet the full
        </SectionHeading>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {leadershipTeam.map(([name, role]) => (
            <PersonCard key={name} name={name} role={role} tone="dark" />
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadershipPrinciples() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="How we lead" highlight="ourselves to">
          The standards we hold
        </SectionHeading>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[var(--gutter)]">
          {leadershipPrinciples.map(([title, description]) => (
            <article key={title} className="border-t border-border pt-5">
              <h3 className="font-display text-[18px] font-bold text-navy-900">
                {title}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[13px] leading-[1.58]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareersCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/home/refinery-tanks.png"
        alt="Petrosol refinery tanks"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          eyebrow="Join our team"
          tone="light"
          align="center"
          highlight="PETROSOL?"
        >
          Interested in a career at
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/#contact">Contact HR</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/about">About PETROSOL</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function LeadershipSections() {
  return (
    <main>
      <LeadershipPageHeader />
      <LeadershipIntro />
      <CeoFeature />
      <TeamGrid />
      <LeadershipPrinciples />
      <CareersCta />
    </main>
  );
}

export { LeadershipSections };
