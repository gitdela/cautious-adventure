import Image from "next/image";
import Link from "next/link";

import {
  formatDate,
  type BlogPostSummary,
  type LubricantProductView,
  type PumpPriceBoardView,
} from "@workspace/content";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import {
  PhotoTile,
  Seal,
  SectionHeading,
} from "@workspace/ui/components/marketing";
import {
  StationChip,
  type StationIconName,
} from "@workspace/ui/components/station-icon";

import { RETAIL_NETWORK_SIZE } from "@/lib/company";
import { contentAdapters } from "@/lib/content-adapters";

import { HeroMedia } from "./hero-media";
import { HomePriceMarquee } from "./home-price-marquee";
import { HomeProductsSection } from "./home-products-section";

const services: Array<{
  icon: StationIconName;
  title: string;
  description: string;
  image: string;
  href: string;
  imagePosition?: string;
}> = [
    {
      icon: "pump",
      title: "Petrol & Diesel",
      description: `Clean, full-quantity fuel at ${RETAIL_NETWORK_SIZE} stations across Ghana.`,
      image: "/images/home/fuel-pump.webp",
      href: "/fuels",
    },
    {
      icon: "fullcare",
      title: "FullCare",
      description: "Complete lube bay servicing at PETROSOL stations.",
      image: "/images/home/fullcare.webp",
      href: "/fullcare-vehicle-services",
    },
    {
      icon: "tanker",
      title: "Fuel Delivery",
      description:
        "Direct-to-location fuel delivery to your business or project site.",
      image: "/images/home/fuel-delivery.webp",
      href: "/fuel-delivery",
    },
    {
      icon: "shop",
      title: "Shop",
      description: "Purchase PETROSOL products online and in-station.",
      image: "/images/home/shop.webp",
      href: "/shops-and-convenience",
      imagePosition: "object-cover object-[center_12%]",
  },
];

function HeroSection() {
  return (
    // `isolate` scopes the negative z-indexes to the band. The header is
    // absolutely positioned over it, so the top padding has to clear it — and
    // it measures 78px on the mobile bar against 127px on the desktop tiers.
    <section className="relative isolate flex min-h-[80svh] flex-col overflow-hidden bg-surface-inverse pt-[calc(78px+32px)] min-[961px]:pt-[calc(127px+40px)]">
      {/* Renders its own layers: the media sits at -z-20, its controls at
          z-20. They cannot share a wrapper — a negative z-index would trap the
          buttons beneath the scrim. */}
      <HeroMedia />
      {/* The scrim, not the footage, is what guarantees text contrast. It runs
          vertically at every width: the DS left-to-right gradient only held up
          while the copy sat in the left column, and centred copy reaches into
          the barely-tinted right edge. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,18,30,0.78)_0%,rgba(4,18,30,0.58)_45%,rgba(4,18,30,0.84)_100%)]" />

      <div className="relative flex flex-1 items-center pb-12">
        <div className="ps-container w-full">
          {/* Centred column. The `max-w-*` caps stay — they keep the heading
              and paragraph at a readable measure — but each needs `mx-auto` to
              sit in the middle of the block rather than hug its left edge. */}
          <div className="mx-auto max-w-[800px] text-center">
            {/* <Eyebrow tone="light">Efficiency meets reliability</Eyebrow> */}
            <h1 className="mt-5 mx-auto max-w-[16ch] font-display text-[clamp(34px,3.6vw,var(--size-display-xl))] leading-[1.06] font-bold tracking-[-0.02em] text-pretty text-white">
              Your Energy Solutions Provider
            </h1>
            <p className="mx-auto mt-6 max-w-[58ch] text-base leading-[1.62] text-white/85 min-[961px]:text-lg">
              Whether you&apos;re chasing personal ambitions, driving business
              growth, or building the future of Ghana, PETROSOL is here to power
              every journey with energy solutions you can trust.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/contact-us">Contact us</Link>
              </Button>
              <Button asChild variant="outlineInverse">
                <Link href="#services">Discover more</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    // The photo column carries more weight than the copy once they sit side by
    // side, so it takes the larger share — below 961px they stack and auto-fit
    // governs again.
    //
    // Tighter on top than the standard section rhythm, deliberately: this is
    // the first section under the hero, and the full `--section-y` pushed it
    // far enough down that nothing showed above the fold. The bottom keeps the
    // normal spacing so the cadence between later sections is unaffected.
    <section className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(48px,6.25vw,80px)] pt-[var(--section-y-tight)] pb-[var(--section-y)] min-[961px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div>
        <SectionHeading eyebrow="About us" highlight="PETROSOL Difference">
          Discover the
        </SectionHeading>
        <p className="mt-6 max-w-[50ch] leading-[1.62]">
          At PETROSOL Platinum Energy PLC, we believe energy is more than fuel,
          it is the force that drives businesses, connects communities, and
          powers the aspirations of individuals and nations. As a proudly
          Ghanaian, ISO-certified Oil Marketing Company (OMC), we are committed
          to delivering reliable energy solutions that fuel progress while
          maintaining the highest standards of safety, quality, and
          environmental responsibility.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/who-we-are">Discover more</Link>
        </Button>
      </div>

      <div className="relative grid grid-cols-2 items-start gap-5">
        <PhotoTile
          image={
            <Image
              src="/images/home/petrosol-station-staff.webp"
              alt="PETROSOL station attendants on the forecourt"
              fill
              sizes="(max-width: 960px) 45vw, 24vw"
            />
          }
        />
        <PhotoTile
          className="mt-16"
          image={
            <Image
              src="/images/home/fuel-pump.webp"
              alt="Refuelling at a PETROSOL pump"
              fill
              sizes="(max-width: 960px) 45vw, 24vw"
            />
          }
        />
        <Seal className="absolute top-[46%] -left-14 max-[960px]:hidden" />
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="ps-blueprint scroll-mt-[92px] bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our services"
          highlight="Services We Offer"
          align="center"
        >
          Discover The Range Of
        </SectionHeading>
        {/* All four cards on one row at desktop. The counts are pinned rather
            than auto-fit so they step 1 → 2 → 4 and never land on three, which
            would strand the fourth card on a row of its own. */}
        <div className="mt-16 grid grid-cols-1 gap-[var(--gutter)] min-[720px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="group rounded-xl">
              <Card className="h-full items-center gap-0 overflow-hidden bg-navy-700 py-0 text-center transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-[3px] group-hover:shadow-raised">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    className={service.imagePosition ?? "object-cover"}
                  />
                </div>
                <div className="flex flex-col items-center gap-4 px-6 pb-8">
                  <StationChip
                    name={service.icon}
                    className="relative z-10 -mt-7 border-[3px] border-white/12 shadow-raised"
                  />
                  <h3 className="font-display text-base font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="max-w-[26ch] text-[13px] leading-[1.58] text-white/72">
                    {service.description}
                  </p>
                  <span className="text-[13px] font-bold text-orange-400">
                    Learn more →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * One commitment in the band below Our Services.
 *
 * Same two-column rhythm and divider as `Stat`, but the left cell holds a
 * heading rather than a figure: these entries are named commitments, not
 * numbers, and `Stat` sets its value at 74px in a 240px column, which a phrase
 * this long would break apart.
 */
function CommitmentRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-start gap-6 border-t border-white/16 py-8 min-[961px]:grid-cols-[minmax(360px,420px)_1fr] min-[961px]:gap-12 min-[961px]:py-12">
      {/* The column is sized around the type rather than the other way round:
          "Sustainable Energy" needs roughly 335px at this size, so the column
          never drops below 360px and the longest title breaks across two lines
          instead of three. The two-column layout waits until 961px for the same
          reason — any earlier and that column would starve the description.
          `text-balance` evens the pair rather than orphaning a single word. */}
      <h3 className="m-0 font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-balance text-brand">
        {title}
      </h3>
      <p className="max-w-[52ch] text-[15px] leading-[1.62] text-white/72">
        {children}
      </p>
    </div>
  );
}

function StatBand() {
  return (
    <section className="ps-blueprint bg-muted">
      <div className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
        <div className="ps-container">
          <SectionHeading tone="light" highlight="Energy Industry">
            To Drive Innovation And Progress In The
          </SectionHeading>
          <div className="mt-12">
            <CommitmentRow title="Sustainable Energy Solutions">
              We are expanding beyond traditional oil marketing by embracing
              cleaner energy solutions, including solar and other initiatives
              that support a more sustainable energy future.
            </CommitmentRow>
            <CommitmentRow title="Quality &amp; Reliability">
              We deliver dependable petroleum products and energy solutions
              backed by rigorous quality standards and a commitment to
              operational excellence.
            </CommitmentRow>
            <div className="border-t border-white/16" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageBand() {
  return (
    // The band is far wider than the source (2.8:1 against 1.45:1), so only
    // about half the height survives the crop. The canopy and its branding sit
    // high in this frame, so the window is anchored near the middle: it keeps
    // the fascia and the pumps while dropping the blank sky above.
    <Image
      src="/images/home/station-canopy-wide.webp"
      alt="PETROSOL station canopy and pump islands"
      width={2000}
      height={1382}
      sizes="100vw"
      className="h-[clamp(240px,36vw,520px)] w-full object-cover object-[center_80%]"
    />
  );
}

function NewsSection({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  const { Image: CmsImage } = contentAdapters;

  return (
    <section className="bg-muted py-[var(--section-y-tight)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Blog" highlight="Latest Stories" align="center">
          Catch Up On Our
        </SectionHeading>
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block rounded-xl">
                <PhotoTile
                  // 3:2 rather than one of the named ratios: `og` (1200/630) is
                  // for artwork with baked-in text that must not be cropped,
                  // and these are photographs, which it left looking letterboxed.
                  // The requested crop matches, so Sanity crops once.
                  className="aspect-[3/2]"
                  image={
                    post.coverImage ? (
                      <CmsImage
                        source={post.coverImage}
                        alt={post.coverImage.alt ?? post.title}
                        width={1200}
                        height={800}
                        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      />
                    ) : (
                      <ImagePlaceholder
                        label={`Drop a photo: ${post.title.slice(0, 40)}…`}
                      />
                    )
                  }
                />
                <time
                  dateTime={post.publishedAt}
                  className="mt-5 block text-[13px] text-muted-foreground"
                >
                  {formatDate(post.publishedAt)}
                </time>
                <h3 className="mt-2 font-display text-base leading-[1.4] font-bold text-navy-900 transition-colors group-hover:text-brand">
                  {post.title}
                </h3>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteBand() {
  return (
    <section className="home-quote py-[calc(var(--section-y)*1.5)]">
      <div className="mx-auto max-w-[980px] px-[var(--container-pad)] text-center">
        <h2 className="font-display text-[length:var(--size-display-lg)] leading-[1.08] font-bold tracking-[-0.02em] text-white">
          WE LOVE TO ENERGIZE <span className="swash">YOUR DREAMS</span>
        </h2>
      </div>
    </section>
  );
}

function HomeSections({
  featuredPosts,
  lubricants,
  priceBoard,
}: {
  featuredPosts: BlogPostSummary[];
  lubricants: LubricantProductView[];
  priceBoard: PumpPriceBoardView | null;
}) {
  return (
    <main>
      <HomePriceMarquee board={priceBoard} />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <StatBand />
      <ImageBand />
      <HomeProductsSection products={lubricants} />
      <QuoteBand />
      <NewsSection posts={featuredPosts} />
    </main>
  );
}

export { HomeSections };
