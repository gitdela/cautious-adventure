import Link from "next/link";

import { ContentEmpty, type TeamMemberSummary } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading, Stat } from "@workspace/ui/components/marketing";
import { MosaicPageHeader } from "../mosaic-page-header";
import { MosaicCtaBand } from "../mosaic-cta-band";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { TeamCard, splitNameForHeadline } from "../team-card";

// People come from Sanity. These principles are page copy, not records, so
// they stay here.
const leadershipPrinciples = [
  ["Integrity", "Honest, transparent and accountable in all our operations."],
  ["Professionalism", "Upholding industry best practice in everything we do."],
  ["Excellence", "Setting the standard for oil marketing companies in Africa."],
  ["People first", "Our team is our greatest asset: we invest in their growth."],
];

function LeadershipPageHeader() {
  return (
    <MosaicPageHeader
      title="Leadership Team"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
            { label: "Leadership Team" },
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
          petroleum operations, finance, marketing, compliance and human capital,
          united by a shared commitment to energizing dreams and delivering
          excellence across Ghana.
        </p>
        <Stat
          value="7"
          label="Senior leaders"
          size="md"
          tone="default"
          className="mt-8"
        />
      </div>
    </section>
  );
}

/**
 * The featured member — the CEO — gets the large block. `shortBio` is the
 * preview; the full biography lives on their profile page.
 */
function CeoFeature({ member }: { member: TeamMemberSummary }) {
  const { lead, last } = splitNameForHeadline(member.name);
  // Blank lines separate paragraphs in the preview field.
  const paragraphs = (member.shortBio ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    // The left column hugs the 400px card rather than taking a fractional
    // share — a wider column would leave dead space between card and text.
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      {/* The card is the link to his profile — no separate "read more". */}
      <TeamCard member={member} className="w-full max-w-[400px]" />
      <div>
        <SectionHeading eyebrow="Executive leadership" highlight={last}>
          {lead}
        </SectionHeading>
        <div className="mt-6 flex max-w-[56ch] flex-col gap-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/awards-and-recognition">Awards &amp; recognition</Link>
        </Button>
      </div>
    </section>
  );
}

function TeamGrid({ members }: { members: TeamMemberSummary[] }) {
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
        {members.length > 0 ? (
          <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-8 min-[641px]:gap-[var(--gutter)] min-[1100px]:grid-cols-3">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} tone="dark" />
            ))}
          </div>
        ) : (
          <div className="mt-14">
            <ContentEmpty
              title="No team members yet"
              description="Leadership profiles will appear here once they are published."
            />
          </div>
        )}
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
    <MosaicCtaBand>
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
          <Link href="/contact-us">Contact HR</Link>
        </Button>
        <Button asChild variant="outlineInverse">
          <Link href="/who-we-are">Who we are</Link>
        </Button>
      </div>
    </MosaicCtaBand>
  );
}

function LeadershipSections({ members }: { members: TeamMemberSummary[] }) {
  // The featured member headlines the page; everyone else fills the grid. If
  // nobody is flagged, the whole list falls through to the grid rather than
  // silently dropping someone.
  const featured = members.find((member) => member.featured);
  const rest = featured
    ? members.filter((member) => member.id !== featured.id)
    : members;

  return (
    <main>
      <LeadershipPageHeader />
      <LeadershipIntro />
      {featured ? <CeoFeature member={featured} /> : null}
      <TeamGrid members={rest} />
      <LeadershipPrinciples />
      <CareersCta />
    </main>
  );
}

export { LeadershipSections };
