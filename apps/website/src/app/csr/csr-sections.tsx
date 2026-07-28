import Image from "next/image";
import Link from "next/link";
import { RiShieldCheckLine } from "@remixicon/react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import {
  Eyebrow,
  PhotoTile,
  SectionHeading,
} from "@workspace/ui/components/marketing";

const csrItems: Array<{
  title: string;
  description: string;
  link?: string;
  place: string;
  placeholder: string;
}> = [
  {
    title: "National Quality Awards",
    description:
      "GH₵20,000 in support of the National Quality Awards organised by the Ghana Standards Authority (GSA) — backing the national push for quality standards.",
    link: "https://citinewsroom.com/2023/09/petrosol-supports-national-quality-awards-with-ghs20000/",
    place: "Accra",
    placeholder: "Drop a photo from the National Quality Awards",
  },
  {
    title: "Energising COPEC",
    description:
      "GH₵10,000 worth of fuel to the Chamber of Petroleum Consumers (COPEC) — powering the activities of an important player in the downstream sector.",
    link: "https://www.myjoyonline.com/petrosol-energises-copec-with-10000-worth-of-fuel/",
    place: "Downstream sector",
    placeholder: "Drop a photo from the COPEC presentation",
  },
  {
    title: "PPEs for hospitals",
    description:
      "Donation of PPEs to various hospitals across the country, alongside free medical care for deprived communities through the Graft Foundation.",
    place: "Nationwide",
    placeholder: "Drop a photo from a hospital donation",
  },
  {
    title: "Disaster relief",
    description:
      "Support for flood victims in the Upper East and Upper West Regions, delivered through the Red Cross Society and the National Disaster Management Organisation.",
    place: "Upper East & Upper West",
    placeholder: "Drop a photo from the relief effort",
  },
  {
    title: "LPG safety in Tamale",
    description:
      "Safety education on LPG use and donation of LPG cylinders to deprived communities in Tamale, in the Northern Region.",
    place: "Northern Region",
    placeholder: "Drop a photo from the LPG outreach",
  },
  {
    title: "Girls' education",
    description:
      "Support for the Girls' Education Unit in the Talensi District, in the Upper East Region.",
    place: "Talensi District",
    placeholder: "Drop a photo from the Girls' Education programme",
  },
];

function CsrHero() {
  return (
    <section className="relative isolate flex h-[clamp(340px,44vw,560px)] items-end overflow-hidden">
      <Image
        src="/images/home/surveyor-hivis.png"
        alt="PETROSOL community programme in the field"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900/25 to-navy-900/78" />
      <div className="ps-container w-full pb-12">
        <Eyebrow tone="light" className="mb-4">
          Corporate social responsibility
        </Eyebrow>
        <h1 className="font-display text-[length:var(--size-display-lg)] leading-[1.08] font-bold tracking-[-0.02em] text-white">
          Energizing dreams, <span className="swash">transforming lives</span>
        </h1>
      </div>
    </section>
  );
}

function GraftFeature() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <div>
        <SectionHeading eyebrow="Featured initiative" highlight="second chance">
          Free reconstructive surgeries &mdash; a
        </SectionHeading>
        <p className="mt-6 max-w-[52ch]">
          PETROSOL donated GH&#8373;50,000 to the Graft Foundation to support
          medical outreach at the Methodist Hospital in Wenchi, Bono Region
          &mdash; reaching patients from Wenchi, Techiman, Kintampo, Nkoranza,
          Sunyani and Kwame Danso from Feb 26 to Mar 8, 2026.
        </p>
        <p className="mt-4 max-w-[52ch]">
          The outreach provided free reconstructive surgeries for conditions
          such as cleft lip and palate, tumors, fused fingers and toes,
          post-burn contractures and hypospadias &mdash; giving many
          individuals a second chance at a healthier, more confident life.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Badge>Bono Region</Badge>
          <Badge variant="secondary">Feb 26 &ndash; Mar 8, 2026</Badge>
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            Free to patients
          </Badge>
        </div>
      </div>
      <PhotoTile
        ratio="news"
        image={<ImagePlaceholder label="Drop a photo from the Wenchi outreach" />}
      />
    </section>
  );
}

function CsrGrid() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Beyond our core business"
          highlight="larger society"
        >
          Our responsibility to the
        </SectionHeading>
        <div className="mt-14 flex flex-col gap-[clamp(56px,7vw,88px)]">
          {csrItems.map(({ title, description, link, place, placeholder }, index) => (
            <div
              key={title}
              className="grid grid-cols-1 items-center gap-[clamp(32px,4vw,64px)] min-[841px]:grid-cols-2"
            >
              <div
                className={`aspect-[16/10] overflow-hidden rounded-2xl ${
                  index % 2 ? "order-2" : "order-1"
                }`}
              >
                <ImagePlaceholder label={placeholder} />
              </div>
              <div className={index % 2 ? "order-1" : "order-2"}>
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[length:var(--size-stat-md)] leading-[1.05] font-bold tracking-[-0.02em] text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Badge variant="secondary">{place}</Badge>
                </div>
                <h3 className="mt-4 font-display text-[clamp(20px,2.4vw,26px)] leading-[1.24] font-bold text-navy-900">
                  {title}
                </h3>
                <p className="mt-3 max-w-[52ch]">{description}</p>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block font-display text-[14px] font-bold text-brand hover:text-orange-600"
                  >
                    Read the story
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CsrCta() {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(40px,5vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-2">
      <PhotoTile
        ratio="news"
        image={
          <Image
            src="/images/home/platform-yellow-rails.png"
            alt="PETROSOL team in the community"
            fill
            sizes="(max-width: 840px) 100vw, 50vw"
          />
        }
      />
      <div>
        <SectionHeading eyebrow="Partner with us" highlight="your community">
          Bring a programme to
        </SectionHeading>
        <p className="mt-6 max-w-[50ch]">
          PETROSOL continues to support worthy causes as part of our
          responsibility to the larger society. If there&apos;s a need in your
          community, we want to hear about it.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/contact">Propose a project</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CsrSections() {
  return (
    <main>
      <CsrHero />
      <GraftFeature />
      <CsrGrid />
      <CsrCta />
    </main>
  );
}

export { CsrSections };
