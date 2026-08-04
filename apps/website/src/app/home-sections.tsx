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

import { HomeContactForm } from "./home-contact-form";
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
      icon: "fuel-drop",
      title: "Platinum Lubricants",
      description: "11 Syntec® formulated lubricants for every engine type.",
      image: "/images/home/lubricants-range.png",
      href: "/lubricants",
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
      icon: "jerrycan",
      title: "Bulk Supply",
      description: "Corporate & industrial bulk petroleum supply solutions.",
      image: "/images/home/refinery-tanks.png",
      href: "/fuel",
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
    <section className="ps-blueprint -mt-[118px] bg-muted pt-[calc(118px+clamp(36px,4.4vw,56px))] pb-[clamp(56px,7.5vw,96px)]">
      <div className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(48px,6.25vw,80px)]">
        <div>
          <Eyebrow>Efficiency meets reliability</Eyebrow>
          <h1 className="mt-5 max-w-[12ch] font-display text-[length:var(--size-display-xl)] leading-[1.06] font-bold tracking-[-0.02em] text-navy-900">
            Your Energy Solutions Provider
          </h1>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.62]">
            Whether you&apos;re looking for high-quality gasoline or innovative
            solutions to power your home or business, we&apos;ve got you covered.
          </p>
          {priceBoard ? <HomePriceBoard board={priceBoard} /> : null}
        </div>

        <div className="grid grid-cols-2 items-start gap-[var(--gutter)]">
          <div className="flex flex-col gap-[var(--gutter)]">
            <PhotoTile
              ratio="square"
              image={
                <Image
                  src="/images/home/fuel-delivery.webp"
                  alt="Petrosol fuel delivery tanker fleet"
                  fill
                  priority
                  sizes="(max-width: 960px) 45vw, 22vw"
                />
              }
            />
            <PhotoTile
              ratio="square"
              image={
                <Image
                  src="/images/home/fuel-pump.webp"
                  alt="Refuelling with Petrosol Super at the pump"
                  fill
                  priority
                  sizes="(max-width: 960px) 45vw, 22vw"
                />
              }
            />
          </div>
          <div className="flex flex-col gap-[var(--gutter)]">
            <PhotoTile
              ratio="square"
              className="mt-12"
              image={
                <Image
                  src="/images/home/fullcare.webp"
                  alt="FullCare technician servicing an engine"
                  fill
                  priority
                  sizes="(max-width: 960px) 45vw, 22vw"
                />
              }
            />
            <PhotoTile
              ratio="square"
              image={
                <Image
                  src="/images/home/fuel-delivery.webp"
                  alt="Petrosol fuel delivery tanker fleet"
                  fill
                  sizes="(max-width: 960px) 45vw, 22vw"
                />
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(48px,6.25vw,80px)] pt-10 pb-[var(--section-y)]">
      <div>
        <SectionHeading eyebrow="About us" highlight="Values">
          Learn About Our History, Mission, And
        </SectionHeading>
        <p className="mt-6 max-w-[50ch] leading-[1.62]">
          At Petrosol, we&apos;re committed to delivering excellence in the oil
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
              src="/images/home/surveyor-hivis.png"
              alt="Site surveyor"
              fill
              sizes="(max-width: 960px) 45vw, 22vw"
            />
          }
        />
        <PhotoTile
          className="mt-16"
          image={
            <Image
              src="/images/home/offshore-platform.png"
              alt="Offshore platform"
              fill
              sizes="(max-width: 960px) 45vw, 22vw"
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
    <section id="services" className="ps-blueprint scroll-mt-24 bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our services"
          highlight="Services We Offer"
          align="center"
        >
          Discover The Range Of
        </SectionHeading>
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="group rounded-xl">
              <Card className="h-full items-center gap-0 overflow-hidden bg-navy-700 py-0 text-center transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-[3px] group-hover:shadow-raised">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
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
    <Image
      src="/images/home/refinery-wide.png"
      alt="Engineer inspecting a refinery"
      width={1400}
      height={474}
      sizes="100vw"
      className="h-[clamp(240px,36vw,520px)] w-full object-cover"
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

function ContactSection() {
  const detailClassName =
    "mt-2 block text-[13px] text-muted-foreground transition-colors hover:text-brand";

  return (
    <section id="contact" className="ps-blueprint scroll-mt-24 py-[var(--section-y)]">
      <div className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(48px,6.25vw,80px)]">
        <div>
          <SectionHeading eyebrow="Contact us" highlight="Brighter Future">
            We&apos;re Excited To Work With You To Create A
          </SectionHeading>
          <div className="mt-12 flex flex-col gap-8">
            <div>
              <h3 className="font-display text-base font-bold text-navy-900">
                Write to us
              </h3>
              <a href="mailto:info@petrosol.com.gh" className={detailClassName}>
                info@petrosol.com.gh
              </a>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-navy-900">
                Call us
              </h3>
              <a href="tel:+233362196538" className={detailClassName}>
                +233 (0)362 196 538 · MON–FRI 9AM–6PM
              </a>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-navy-900">
                Visit us
              </h3>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Head office, Airport West, Accra
              </p>
            </div>
          </div>
        </div>
        <HomeContactForm />
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
      <ContactSection />
      <NewsSection posts={featuredPosts} />
    </main>
  );
}

export { HomeSections };
