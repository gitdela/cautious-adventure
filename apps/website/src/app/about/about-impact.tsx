import { Badge } from "@workspace/ui/components/badge";
import { SectionHeading } from "@workspace/ui/components/marketing";

import { impactStats, memberships, registrations } from "./about-data";

/**
 * What the business puts back into Ghana. Every figure comes from the profile's
 * economic-contribution section.
 *
 * The tax total carries its period in the label. It is eleven years of
 * cumulative payments, and an unqualified "GHS 1.3bn" beside three present-tense
 * figures would read as an annual one.
 */
function ImpactSection() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our impact"
          tone="light"
          highlight="stays in Ghana"
        >
          Value that
        </SectionHeading>
        <p className="mt-6 max-w-[62ch] text-white/78">
          As an indigenous company we buy locally, retain our profits here and
          reinvest them in the Ghanaian economy, while opening stations in
          communities larger operators have passed over.
        </p>

        <dl className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[var(--gutter)]">
          {impactStats.map(([value, label]) => (
            <div key={label} className="border-t border-white/16 pt-5">
              <dt className="sr-only">{label}</dt>
              <dd className="m-0">
                <span className="block font-display text-[length:var(--size-stat-md)] leading-[1.05] font-bold tracking-[-0.02em] text-orange-400">
                  {value}
                </span>
                <span className="mt-3 block max-w-[28ch] text-[13px] leading-[1.58] text-white/78">
                  {label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function BadgeList({ items }: { items: string[] }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {items.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className="h-auto max-w-full py-1.5 text-center whitespace-normal"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

/**
 * Memberships and registrations, kept apart.
 *
 * These were previously one list headed "Industry affiliations", which put the
 * EPA and the NPA alongside the AGI and implied PETROSOL had joined its own
 * regulators. One is a body you choose to join; the other is a register you are
 * required to be on. Both are credibility, but they are not the same claim.
 */
function TrustSection() {
  return (
    <section className="pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="mx-auto max-w-[900px] px-[var(--container-pad)] text-center">
        <SectionHeading
          eyebrow="Membership & regulation"
          highlight="Professional Bodies"
          align="center"
        >
          Institutions and
        </SectionHeading>

        <div className="mt-12 flex flex-col gap-10">
          <div>
            <h3 className="font-display text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
              Industry memberships
            </h3>
            <BadgeList items={memberships} />
          </div>
          <div>
            <h3 className="font-display text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
              Regulatory registrations
            </h3>
            <BadgeList items={registrations} />
          </div>
        </div>
      </div>
    </section>
  );
}

export { ImpactSection, TrustSection };
