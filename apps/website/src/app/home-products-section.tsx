import Link from "next/link";

import type { ContentImageValue, LubricantProductView } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";

import { contentAdapters } from "@/lib/content-adapters";

const HOME_LUBRICANT_SLOTS = 4;

/** A product the band can actually render — pack shot included. */
type HomeLubricant = LubricantProductView & { image: ContentImageValue };

/**
 * The four products the band shows. Editors pick them with the "Feature on the
 * home page" flag; if nobody has, the first products with a pack shot stand in,
 * so the band never renders empty tiles just because the flag went unset.
 */
function pickHomeLubricants(products: LubricantProductView[]): HomeLubricant[] {
  const withPackShot = products.filter(
    (product): product is HomeLubricant => Boolean(product.image),
  );
  const flagged = withPackShot.filter((product) => product.featuredOnHome);
  return (flagged.length > 0 ? flagged : withPackShot).slice(
    0,
    HOME_LUBRICANT_SLOTS,
  );
}

/**
 * Home page teaser for the lubricants catalogue. Every tile links to
 * `/lubricants` rather than to a product — products open in a dialog there, so
 * there is no per-product URL to deep-link to.
 */
function HomeProductsSection({ products }: { products: LubricantProductView[] }) {
  const featured = pickHomeLubricants(products);
  // Nothing to tease — an empty band under a "Platinum Lubricants" heading
  // reads as breakage, so drop the section entirely.
  if (featured.length === 0) return null;

  const { Image: CmsImage } = contentAdapters;

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
        {/* Sits tight under the h2 so the two read as one heading block, with
            the body copy keeping its own larger gap below. No width cap: the
            line is ~670px at this size and the container gives it 1152px, so it
            holds one line on desktop and only wraps once the screen is genuinely
            too narrow. */}
        <h3 className="mt-4 text-center font-display text-[length:var(--size-heading-lg)] leading-[1.28] font-bold tracking-[-0.01em] text-balance text-navy-900">
          Engineered for Performance. Designed for Protection.
        </h3>
        <p className="mx-auto mt-6 max-w-[64ch] text-center leading-[1.62]">
          Available across PETROSOL stations nationwide, our lubricants provide
          the dependable protection your vehicle needs every journey, every
          engine, every time.
        </p>
        <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-4">
          {featured.map((product) => (
            <Link key={product.id} href="/lubricants" className="group rounded-lg">
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-card transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-[3px] group-hover:shadow-raised">
                <div className="relative aspect-[4/3] w-full border-b border-border bg-white">
                  <CmsImage
                    source={product.image}
                    alt={product.image.alt ?? product.name}
                    width={640}
                    height={480}
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
                  <span className="text-xs font-bold tracking-[0.12em] uppercase text-brand">
                    {product.category.title}
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

export { HomeProductsSection };
