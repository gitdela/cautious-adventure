import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import {
  PhotoTile,
  SectionHeading,
  Stat,
} from "@workspace/ui/components/marketing";

import { awards, operationPrinciples } from "./sustainability-data";

function EnergyTransitionSection() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <PhotoTile
        ratio="news"
        image={
          <Image
            src="/images/sustainability/solar-array-platinum-yard.webp"
            alt="Solar array on a PETROSOL station roof, with the Platinum lubricants billboard and a haulage yard beyond it"
            width={2000}
            height={1125}
            sizes="(min-width: 841px) 45vw, 100vw"
          />
        }
      />
      <div>
        <SectionHeading
          eyebrow="Expanding beyond traditional energy"
          highlight="energy transition"
        >
          Preparing for the
        </SectionHeading>
        <p className="mt-6 max-w-[54ch]">
          While petroleum products remain an important part of our business
          today, our vision extends beyond traditional oil marketing. We are
          progressively exploring renewable energy, solar power and emerging
          mobility solutions, including electric vehicle solutions, and
          building the capabilities, infrastructure and partnerships required
          to remain relevant as the energy landscape evolves.
        </p>
      </div>
    </section>
  );
}

function ProductQualitySection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Better products for a changing world"
          highlight="full quantity"
        >
          Clean fuel in
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-[var(--gutter)] min-[841px]:grid-cols-2">
          <div className="rounded-[20px] bg-background p-[var(--card-pad)] shadow-card">
            <h3 className="font-display text-[21px] leading-[1.3] font-bold text-navy-900">
              Quality you can measure
            </h3>
            <p className="mt-3">
              Our petrol and diesel are designed to meet local and
              international standards, with product integrity maintained from
              loading depots to our stations and into customers’ fuel tanks.
              Our Platinum lubricant range supports engine protection, improved
              fuel efficiency, extended drain capability and enhanced engine
              cleanliness.
            </p>
          </div>
          <div className="rounded-[20px] bg-background p-[var(--card-pad)] shadow-card">
            <h3 className="font-display text-[21px] leading-[1.3] font-bold text-navy-900">
              The Full Quantity promise
            </h3>
            <p className="mt-3">
              10 liters should remain 10 liters, regardless of which PETROSOL
              station a customer visits. We invest in the integrity of our
              dispensing systems and pump nozzles because responsible business
              is about reducing waste, protecting value and using resources
              efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResponsibleOperationsSection() {
  return (
    <section className="ps-container py-[var(--section-y)]">
      <SectionHeading eyebrow="Responsible operations" highlight="how we operate">
        Sustainability lives in
      </SectionHeading>
      <div className="mt-12 grid grid-cols-1 gap-[clamp(40px,5vw,80px)] min-[841px]:grid-cols-2">
        {operationPrinciples.map(({ title, description, icon: Icon }) => (
          <div key={title}>
            <span className="inline-grid size-14 place-items-center rounded-full bg-brand text-white">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-display text-[21px] leading-[1.3] font-bold text-navy-900">
              {title}
            </h3>
            <p className="mt-3 max-w-[50ch]">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PeopleSection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] min-[841px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.62fr)]">
        <div>
          <SectionHeading
            eyebrow="Investing in people"
            highlight="who deliver it"
          >
            Sustainable energy needs people
          </SectionHeading>
          <p className="mt-6 max-w-[54ch]">
            Our employees are central to our ability to innovate, grow and
            deliver value. Through the PETROSOL Women Network (PWN) and our
            annual Women in Leadership Conference, we create platforms for
            women to develop, connect and prepare for greater leadership
            responsibilities.
          </p>
        </div>
        <div className="flex flex-col rounded-[20px] bg-background p-[var(--card-pad)] shadow-card">
          <Stat
            size="md"
            tone="default"
            value="536"
            label="Employees"
            className="pb-8 text-left"
          />
          <Stat
            size="md"
            tone="default"
            value="44%"
            label="Women in our workforce"
            className="border-t border-border pt-8 text-left"
          />
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="ps-container py-[var(--section-y)]">
      <div className="grid grid-cols-1 gap-8 min-[841px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)] min-[841px]:items-end">
        <SectionHeading
          eyebrow="Creating value beyond our stations"
          highlight="community impact"
        >
          Health, education and
        </SectionHeading>
        <div className="min-[841px]:justify-self-end">
          <p className="max-w-[48ch]">
            Through our Corporate Social Responsibility initiatives, we support
            causes that address social, health, education and community needs.
            In 2026, PETROSOL donated GH¢50,000 to the Graft Foundation to
            support free reconstructive surgeries for patients in the Bono
            Region.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/csr">Explore our CSR work</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function RecognitionSection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y-tight)]">
      <div className="ps-container grid grid-cols-1 gap-[clamp(40px,5vw,80px)] min-[841px]:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="External recognition"
            highlight="pursue sustainability"
          >
            Awards are not the reason we
          </SectionHeading>
          <p className="mt-6 max-w-[48ch]">
            They reinforce the importance of the work we are doing and
            encourage us to keep raising the bar.
          </p>
        </div>
        <ul className="m-0 list-none divide-y divide-border self-center p-0">
          {awards.map(({ title, organisation, year }) => (
            <li
              key={title}
              className="flex items-baseline justify-between gap-6 py-5"
            >
              <div>
                <p className="font-display font-semibold text-navy-900">
                  {title}
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {organisation}
                </p>
              </div>
              <span className="font-mono text-[15px] font-bold text-brand">
                {year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export {
  CommunitySection,
  EnergyTransitionSection,
  PeopleSection,
  ProductQualitySection,
  RecognitionSection,
  ResponsibleOperationsSection,
};
