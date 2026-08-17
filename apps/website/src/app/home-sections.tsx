import Image from "next/image";
import Link from "next/link";

import {
  formatDate,
  type BlogPostSummary,
  type PumpPriceBoardView,
} from "@workspace/content";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import {
  Eyebrow,
  PhotoTile,
  Seal,
  SectionHeading,
  Stat,
} from "@workspace/ui/components/marketing";
import {
  StationChip,
  type StationIconName,
} from "@workspace/ui/components/station-icon";

import { contentAdapters } from "@/lib/content-adapters";

import { HeroVideo } from "./hero-video";
import { HomePriceBoard } from "./home-price-board";
import { lubricantProducts } from "./lubricants/lubricants-data";

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
      description: "Clean, full-quantity fuel at 115+ stations across Ghana.",
      image: "/images/home/fuel-pump.webp",
      href: "/fuel",
    },
    {
      icon: "fullcare",
      title: "FullCare",
      description: "Complete lube bay servicing at PETROSOL stations.",
      image: "/images/home/fullcare.webp",
      href: "/fullcare",
    },
    {
      icon: "tanker",
      title: "Fuel Delivery",
      description: "Direct-to-location fuel delivery for homes and businesses.",
      image: "/images/home/fuel-delivery.webp",
      href: "/fuel-delivery",
    },
    {
      icon: "shop",
      title: "Shop",
      description: "Purchase PETROSOL products online and in-station.",
      image: "/images/home/shop.webp",
      href: "/shop",
      imagePosition: "object-cover object-[center_12%]",
    },
  ];

const featuredLubricantIds = ["plus-5w30", "plus-10w40", "ultra-15w40", "atf-6"];

const featuredLubricants = featuredLubricantIds.flatMap((id) => {
  const product = lubricantProducts.find((entry) => entry.id === id);
  return product?.image ? [{ ...product, image: product.image }] : [];
});


function HeroSection({ priceBoard }: { priceBoard: PumpPriceBoardView | null }) {
  return (
    // `isolate` scopes the negative z-indexes to the band. The header is
    // absolutely positioned over it, so the top padding has to clear it — and
    // it measures 78px on the mobile bar against 127px on the desktop tiers.
    <section className="relative isolate flex min-h-[95svh] flex-col overflow-hidden bg-surface-inverse pt-[calc(78px+32px)] min-[961px]:pt-[calc(127px+40px)]">
      <div className="absolute inset-0 -z-20">
        <HeroVideo />
      </div>
      {/* The scrim, not the footage, is what guarantees text contrast. The DS
          gradient runs left-to-right, which only works while the copy occupies
          the left column — once it goes full width below 961px the right edge
          is barely tinted, so mobile gets a vertical scrim instead. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,18,30,0.78)_0%,rgba(4,18,30,0.58)_45%,rgba(4,18,30,0.84)_100%)] min-[961px]:bg-[linear-gradient(90deg,rgba(4,18,30,0.86)_0%,rgba(4,18,30,0.62)_44%,rgba(4,18,30,0.24)_100%)]" />

      <div className="relative flex flex-1 items-center pb-12">
        <div className="ps-container grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-x-20 gap-y-14 min-[961px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            {/* <Eyebrow tone="light">Efficiency meets reliability</Eyebrow> */}
            <h1 className="mt-5 max-w-[14ch] font-display text-[clamp(34px,3.6vw,var(--size-display-xl))] leading-[1.06] font-bold tracking-[-0.02em] text-pretty text-white">
              Your energy solutions provider
            </h1>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.62] text-white/85">
              Whether you&apos;re looking for high-quality gasoline or innovative
              solutions to power your home or business, we&apos;ve got you covered.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
              <Button asChild variant="outlineInverse">
                <Link href="#services">Discover more</Link>
              </Button>
            </div>
          </div>

          {priceBoard ? <HomePriceBoard board={priceBoard} /> : null}
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
    <section className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[961px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div>
        <SectionHeading eyebrow="About us" highlight="Platinum OMC.">
          Ghana&apos;s Premier
        </SectionHeading>
        <p className="mt-6 max-w-[50ch] leading-[1.62]">
          At PETROSOL, we&apos;re committed to delivering excellence in the oil
          industry. With our state-of-the-art technology and advanced processes,
          we&apos;re able to provide innovative solutions to meet the evolving needs
          of our clients worldwide. We pride ourselves on our commitment to
          safety, reliability, and sustainability, and we&apos;re always looking for
          new ways to improve our operations.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/about">Discover more</Link>
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

function StatBand() {
  return (
    <section className="ps-blueprint bg-muted">
      <div className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y)]">
        <div className="ps-container">
          <SectionHeading tone="light" highlight="Energy Industry">
            To Drive Innovation And Progress In The
          </SectionHeading>
          <div className="mt-12">
            <Stat value="10%" divider className="items-center">
              lower prices than competitors. Our company is able to keep the price
              of oil and gas at the affordable level.
            </Stat>
            <Stat value="20%" divider className="items-center">
              reducing greenhouse gas emissions per year. We&apos;re committed to
              minimizing our environmental impact and promoting social
              responsibility.
            </Stat>
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

function ProductsSection() {
  return (
    <section id="products" className="ps-blueprint scroll-mt-24 py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our products"
          highlight="Every Engine"
          align="center"
        >
          Platinum Lubricants For
        </SectionHeading>
        <p className="mx-auto mt-6 max-w-[56ch] text-center leading-[1.62]">
          Eleven Syntec&reg;-formulated lubricants — engine oils, gear and
          transmission fluids, brake fluid and coolant — blended to
          international standards and stocked at every PETROSOL station.
        </p>
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-4">
          {featuredLubricants.map((product) => (
            <Link key={product.id} href="/lubricants" className="group rounded-lg">
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-card transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-[3px] group-hover:shadow-raised">
                <div className="relative aspect-[4/3] w-full border-b border-border bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
                  <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand">
                    {product.category}
                  </span>
                  <h3 className="font-display text-base font-semibold text-navy-900 transition-colors group-hover:text-brand">
                    {product.name}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {product.grade}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/lubricants">View all lubricants</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function NewsSection({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  const { Image: CmsImage } = contentAdapters;

  return (
    <section className="bg-muted py-[var(--section-y-tight)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Media" highlight="Latest News" align="center">
          Catch Up On Our
        </SectionHeading>
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <article key={post.slug}>
              <Link href={`/news/${post.slug}`} className="group block rounded-xl">
                <PhotoTile
                  ratio="og"
                  image={
                    post.coverImage ? (
                      <CmsImage
                        source={post.coverImage}
                        alt={post.coverImage.alt ?? post.title}
                        width={1200}
                        height={630}
                        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      />
                    ) : (
                      <ImagePlaceholder
                        label={`Drop a photo — ${post.title.slice(0, 40)}…`}
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
          We&apos;re Proud To Be A Useful And <span className="swash">Valuable Partner</span>{" "}
          To Our Customers And Communities
        </h2>
      </div>
    </section>
  );
}

function HomeSections({
  priceBoard,
  featuredPosts,
}: {
  priceBoard: PumpPriceBoardView | null;
  featuredPosts: BlogPostSummary[];
}) {
  return (
    <main>
      <HeroSection priceBoard={priceBoard} />
      <AboutSection />
      <ServicesSection />
      <StatBand />
      <ImageBand />
      <ProductsSection />
      <QuoteBand />
      <NewsSection posts={featuredPosts} />
    </main>
  );
}

export { HomeSections };
