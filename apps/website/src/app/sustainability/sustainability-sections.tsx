import Image from "next/image";

import {
  PhotoTile,
  SectionHeading,
} from "@workspace/ui/components/marketing";

import {
  CommunitySection,
  EnergyTransitionSection,
  PeopleSection,
  ProductQualitySection,
  RecognitionSection,
  ResponsibleOperationsSection,
} from "./sustainability-operations-sections";
import {
  LookingAheadSection,
  PillarsSection,
} from "./sustainability-pillars-sections";
import { isoCertifications, solarBenefits } from "./sustainability-data";

/** Top-right corner cut shared by both navy bands on this page. */
const cornerCut = "rounded-tr-[clamp(56px,9vw,120px)]";

/** Full-bleed photo hero over the rooftop solar array at a PETROSOL station. */
function SustainabilityHero() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-inverse">
      <Image
        src="/images/sustainability/solar-roof-station-canopy.webp"
        alt="Aerial view of solar panels covering the roof of a PETROSOL station beside its orange and navy forecourt canopy"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_45%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900/25 to-navy-900/80" />
      <div className="ps-container flex min-h-[clamp(340px,44vw,560px)] flex-col justify-end pt-24 pb-12">
        <SectionHeading
          as="h1"
          eyebrow="Sustainability"
          tone="light"
          size="lg"
          highlight="sustainable future"
        >
          Energizing a
        </SectionHeading>
        <p className="mt-4 max-w-[46ch] text-white/85">
          Sustainability is at the heart of how we grow.
        </p>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="ps-container grid grid-cols-1 items-start gap-[clamp(40px,5vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <SectionHeading eyebrow="How we grow" highlight="value we create">
        Growth measured by the
      </SectionHeading>
      <div className="flex flex-col gap-4">
        <p>
          At PETROSOL Platinum Energy PLC, we believe that true growth is not
          measured only by the size of our business, but by the value we create
          for people, communities and the environment. Our approach to
          sustainability is embedded in the way we operate, from environmental
          management and responsible energy use to product quality, safety,
          innovation and our growing investments in renewable energy.
        </p>
        <p>
          This commitment is reflected in our core values, where Sustainability
          stands alongside Integrity, Professionalism, Service, Leadership and
          Empathy. It is also reflected in our purpose: to energize dreams,
          ignite hope and power the achievement of goals and aspirations
          through the delivery of energy solutions in a sustainable and
          ethical manner.
        </p>
      </div>
    </section>
  );
}

function TripleIsoSection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <div className="grid grid-cols-1 gap-8 min-[841px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)] min-[841px]:items-end">
          <SectionHeading
            eyebrow="Our sustainability journey"
            highlight="Triple ISO certified"
          >
            Systems, not slogans:
          </SectionHeading>
          <p className="max-w-[48ch] min-[841px]:justify-self-end">
            All three certifications have been successfully re-certified. They
            are more than badges. They represent systems, processes and a
            culture of continuous improvement.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {isoCertifications.map(({ code, title, description, icon: Icon }) => (
            <div
              key={code}
              className="rounded-[20px] bg-background p-[var(--card-pad)] shadow-card"
            >
              <span className="inline-grid size-14 place-items-center rounded-full bg-brand text-white">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-5 font-mono text-[13px] font-semibold tracking-[0.06em] text-brand">
                {code}
              </p>
              <h3 className="mt-2 font-display text-[21px] leading-[1.3] font-bold text-navy-900">
                {title}
              </h3>
              <p className="mt-3 text-[13px] leading-[1.58]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Hero moment #1: the rooftop solar programme on the navy inverse band. */
function SolarSection() {
  return (
    <section className={`bg-surface-inverse py-[var(--section-y)] ${cornerCut}`}>
      <div className="ps-container">
        <div className="grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] min-[841px]:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Powering our stations with the sun"
              tone="light"
              size="lg"
              highlight="clean energy"
            >
              Turning rooftops into sources of
            </SectionHeading>
            <p className="mt-6 max-w-[54ch] text-white/72">
              We are installing solar panels on the roofs of selected PETROSOL
              stations, harnessing Ghana’s abundant sunshine as a source of
              renewable energy. Rather than relying solely on conventional
              sources to power our operations, we are putting existing
              infrastructure to work for cleaner energy generation.
            </p>
          </div>
          <PhotoTile
            ratio="news"
            image={
              <Image
                src="/images/sustainability/solar-install-technicians.webp"
                alt="Technicians installing solar panels on the roof of a PETROSOL station"
                width={2000}
                height={1362}
                sizes="(min-width: 841px) 45vw, 100vw"
              />
            }
          />
        </div>
        <div className="mt-[clamp(48px,6vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[var(--gutter)]">
          {solarBenefits.map(({ title, description, icon: Icon }) => (
            <div key={title} className="border-t border-white/16 pt-5">
              <Icon className="size-6 text-brand" aria-hidden="true" />
              <h3 className="mt-4 font-display text-[18px] leading-[1.3] font-bold text-white">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.58] text-white/72">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SustainabilitySections() {
  return (
    <main>
      <SustainabilityHero />
      <IntroSection />
      <TripleIsoSection />
      <SolarSection />
      <EnergyTransitionSection />
      <ProductQualitySection />
      <ResponsibleOperationsSection />
      <PeopleSection />
      <CommunitySection />
      <RecognitionSection />
      <PillarsSection />
      <LookingAheadSection cornerCut={cornerCut} />
    </main>
  );
}

export { SustainabilitySections };
