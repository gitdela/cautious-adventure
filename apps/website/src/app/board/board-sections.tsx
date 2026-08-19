import Link from "next/link";

import { ContentEmpty, type TeamMemberSummary } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { MosaicPageHeader } from "../mosaic-page-header";
import { MosaicCtaBand } from "../mosaic-cta-band";
import { cn } from "@workspace/ui/lib/utils";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { TeamCard, isFeaturedFor, splitNameForHeadline } from "../team-card";

// Directors come from Sanity. These commitments are page copy, not records.
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
    <MosaicPageHeader
      title="Board of Directors"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
            { label: "Board of Directors" },
          ]}
        />
      }
    />
  );
}

/**
 * The Chairman, rendered from the CMS — the same record his profile page uses,
 * so the copy here and there cannot drift. `shortBio` carries the paragraphs;
 * blank lines separate them.
 */
function ChairmanFeature({ member }: { member: TeamMemberSummary }) {
  const { lead, last } = splitNameForHeadline(member.name);
  const paragraphs = (member.shortBio ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <section className="ps-container grid grid-cols-1 items-stretch gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div>
        <SectionHeading eyebrow="Corporate leadership" highlight={last}>
          {lead}
        </SectionHeading>
        <div className="mt-6 flex max-w-[58ch] flex-col gap-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        {member.quote ? (
          <blockquote className="mt-7 max-w-[46ch] border-t border-border pt-5 font-display text-[clamp(18px,2vw,24px)] leading-[1.5] font-bold text-navy-900">
            &ldquo;
            <QuoteText quote={member.quote} emphasise="honest commerce" />
            &rdquo;
          </blockquote>
        ) : null}
        <Button asChild variant="outline" className="mt-8">
          <Link href="/leadership-team">View leadership team</Link>
        </Button>
      </div>

      {/* `fill` stretches the tile to the copy column's height. */}
      <TeamCard member={member} fill />
    </section>
  );
}

/**
 * Wraps a phrase in the brand swash without the quote itself carrying markup —
 * the text comes from a plain CMS field. Degrades to plain text if the phrase
 * is edited away.
 */
function QuoteText({ quote, emphasise }: { quote: string; emphasise: string }) {
  const at = quote.indexOf(emphasise);
  if (at === -1) return <>{quote}</>;

  return (
    <>
      {quote.slice(0, at)}
      <span className="swash">{emphasise}</span>
      {quote.slice(at + emphasise.length)}
    </>
  );
}

function BoardGrid({ members }: { members: TeamMemberSummary[] }) {
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
        {members.length > 0 ? (
          // Bento: six columns, every tile spanning two, so five tiles land as
          // two over three — the Board Secretary and CEO on top, the three
          // Board Members beneath. The first tile starts at column 2, which
          // centres that top pair over the full-width row below it. Below 880px
          // it collapses to two columns with the first tile spanning both.
          <div className="mt-12 grid grid-cols-2 gap-[var(--gutter)] min-[881px]:grid-cols-6">
            {members.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                tone="dark"
                className={cn(
                  index === 0 ? "col-span-2" : "col-span-1",
                  "min-[881px]:col-span-2",
                  index === 0 && "min-[881px]:col-start-2",
                )}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <ContentEmpty
              title="No directors yet"
              description="Board profiles will appear here once they are published."
            />
          </div>
        )}
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
    <MosaicCtaBand>
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
          <Link href="/contact-us">Contact us</Link>
        </Button>
        <Button asChild variant="outlineInverse">
          <Link href="/leadership-team">View leadership team</Link>
        </Button>
      </div>
    </MosaicCtaBand>
  );
}

function BoardSections({ members }: { members: TeamMemberSummary[] }) {
  // The Chairman headlines the page; the rest fill the bento. `isFeaturedFor`
  // rather than `featured` alone, because the CEO is featured on leadership and
  // also appears in this list.
  const chairman = members.find((member) => isFeaturedFor(member, "board"));
  const directors = chairman
    ? members.filter((member) => member.id !== chairman.id)
    : members;

  return (
    <main>
      <BoardPageHeader />
      {chairman ? <ChairmanFeature member={chairman} /> : null}
      <BoardGrid members={directors} />
      <GovernanceSection />
      <GovernanceCta />
    </main>
  );
}

export { BoardSections };
