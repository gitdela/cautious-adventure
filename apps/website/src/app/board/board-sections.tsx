import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";
import { PersonCard } from "@workspace/ui/components/person-card";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

const boardMembers = [
  ["Robert Kingsley Yeboah Esq.", "Board Secretary"],
  ["Michael Bozumbil", "Board Member"],
  ["Lawrencia Himans", "Board Member"],
  ["Linda Bozumbil", "Board Member"],
  ["William Ntim-Boadu", "Board Member"],
];

const governanceCommitments = [
  [
    "Regulatory compliance",
    "The board ensures full alignment with Ghana's National Petroleum Authority requirements and all applicable downstream energy regulations.",
  ],
  [
    "Triple ISO certification",
    "ISO 9001, ISO 14001 and ISO 45001 certification across quality, environmental management, and occupational health and safety systems.",
  ],
  [
    "Stakeholder responsibility",
    "The board holds itself accountable to employees, partners, customers, and the communities in which PETROSOL operates.",
  ],
  [
    "Strategic oversight",
    "Directors provide independent oversight of executive decisions, ensuring alignment between day-to-day operations and long-term strategy.",
  ],
];

function BoardPageHeader() {
  return (
    <PageHeader
      title="Board of Directors"
      background={
        <Image
          src="/images/home/offshore-rig-ocean.png"
          alt="Offshore petroleum platform at sea"
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
            { label: "Board of Directors" },
          ]}
        />
      }
    />
  );
}

function ChairmanFeature() {
  return (
    <section className="ps-container grid grid-cols-1 items-stretch gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div>
        <SectionHeading eyebrow="Corporate leadership" highlight="Acheampong">
          Daniel
        </SectionHeading>
        <div className="mt-6 flex max-w-[58ch] flex-col gap-5">
          <p>
            Daniel Acheampong serves as the Board Chairman of PETROSOL Platinum
            Energy, providing strategic oversight and governance leadership to
            the company&apos;s long-term direction. With extensive experience in
            corporate governance and Ghana&apos;s downstream petroleum sector, he
            brings institutional credibility to the board.
          </p>
          <p>
            His leadership philosophy centres on accountability, transparency
            and building durable commercial organisations that can withstand the
            demands of a competitive energy market. He has been instrumental in
            shaping PETROSOL&apos;s governance framework since its founding.
          </p>
          <p>
            Under his chairmanship, the company has pursued ISO certification
            across quality, environment and safety management systems &mdash; a
            commitment that reflects the board&apos;s view that operational excellence
            is a prerequisite for sustained brand trust.
          </p>
        </div>
        <blockquote className="mt-7 max-w-[46ch] border-t border-border pt-5 font-display text-[clamp(18px,2vw,24px)] leading-normal font-bold text-navy-900">
          &ldquo;We do not build petroleum companies for the next quarter. We build
          them for the next generation of Ghanaians who deserve reliable energy
          and <span className="swash">honest commerce</span>.&rdquo;
        </blockquote>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/leadership">View leadership team</Link>
        </Button>
      </div>

      <PersonCard
        name="Daniel Acheampong"
        role="Board Chairman"
        className="h-full w-full"
        mediaClassName="min-h-[400px] flex-1 aspect-auto"
      />
    </section>
  );
}

function BoardGrid() {
  return (
    <section className="ps-blueprint rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Board of directors"
          tone="light"
          highlight="oversight"
        >
          Independent
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-[var(--gutter)] sm:grid-cols-2 min-[1000px]:grid-cols-6">
          {boardMembers.map(([name, role], index) => {
            const isWide = index >= 3;

            return (
              <PersonCard
                key={name}
                name={name}
                role={role}
                tone="dark"
                className={
                  isWide
                    ? "min-[1000px]:col-span-3"
                    : "min-[1000px]:col-span-2"
                }
                mediaClassName={isWide ? "aspect-video" : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GovernanceSection() {
  return (
    <section className="ps-blueprint py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Our commitment" highlight="accountability">
          Governance built on trust and
        </SectionHeading>
        <div className="mt-10 grid grid-cols-1 gap-x-[clamp(48px,6.25vw,80px)] gap-y-9 min-[841px]:grid-cols-2">
          {governanceCommitments.map(([title, description]) => (
            <article key={title} className="border-t border-border pt-5">
              <h3 className="font-display text-[18px] font-bold text-navy-900">
                {title}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[13px] leading-[1.58]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GovernanceCta() {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <Image
        src="/images/board/gauges.png"
        alt="Industrial pressure gauges and valves"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          eyebrow="Get in touch"
          tone="light"
          align="center"
          highlight="corporate governance?"
        >
          Questions about our
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/#contact">Contact us</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/leadership">View leadership team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function BoardSections() {
  return (
    <main>
      <BoardPageHeader />
      <ChairmanFeature />
      <BoardGrid />
      <GovernanceSection />
      <GovernanceCta />
    </main>
  );
}

export { BoardSections };
