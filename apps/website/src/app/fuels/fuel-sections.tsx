import Image from "next/image";
import Link from "next/link";
import { RiLeafLine, RiShieldCheckLine } from "@remixicon/react";

import {
  ContentEmpty,
  formatCedis,
  formatPumpDate,
  type FuelProductView,
  type PumpPriceBoardView,
} from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import {
  PhotoTile,
  SectionHeading,
  Stat,
} from "@workspace/ui/components/marketing";
import { ServiceCard } from "@workspace/ui/components/service-card";
import { StationIcon } from "@workspace/ui/components/station-icon";
import { cn } from "@workspace/ui/lib/utils";

import { contentAdapters } from "@/lib/content-adapters";

import { MosaicCtaBand } from "../mosaic-cta-band";
import { MosaicPageHeader } from "../mosaic-page-header";
import { SiteBreadcrumbs } from "../site-breadcrumbs";

const fuelPromises = [
  {
    title: "Full Quantity",
    lead: "Every litre counts.",
    description:
      "Our dispensing pumps are regularly checked and calibrated to support accurate measurement, ensuring you receive the quantity you pay for at every PETROSOL station.",
    icon: <RiShieldCheckLine />,
  },
  {
    title: "Product Integrity",
    lead: "Clean fuel from depot to tank.",
    description:
      "We maintain controlled handling and storage processes throughout our supply chain to help protect our fuels from contamination and preserve product quality.",
    icon: <StationIcon name="fuel-drop" />,
  },
  {
    title: "Responsible Performance",
    lead: "Quality fuel. Better performance.",
    description:
      "Our commitment to quality fuel supports efficient engine performance and contributes to responsible energy use, while our broader environmental practices help reduce our impact on the environment.",
    icon: <RiLeafLine />,
  },
];

function FuelPageHeader() {
  return (
    <MosaicPageHeader
      title="Fuels"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products & Services" },
            { label: "Fuels" },
          ]}
        />
      }
    />
  );
}

function FuelProductPhoto({
  product,
  index,
}: {
  product: FuelProductView;
  index: number;
}) {
  const { Image: CmsImage } = contentAdapters;

  return (
    <article
      data-fuel-product={product.slug}
      className={cn("min-w-0", index % 2 === 1 && "mt-10 min-[841px]:mt-16")}
    >
      <PhotoTile
        className="aspect-[4/5]"
        image={
          product.image ? (
            <CmsImage
              source={product.image}
              alt={product.image.alt ?? `${product.name} at PETROSOL`}
              width={900}
              height={1125}
              sizes="(max-width: 840px) 45vw, 24vw"
            />
          ) : (
            <ImagePlaceholder label={`${product.name} product photo unavailable`} />
          )
        }
      />
      <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-brand uppercase">
        {product.eyebrow}
      </p>
      <h3 className="mt-1 font-display text-[20px] font-bold text-navy-900">
        {product.name}
      </h3>
    </article>
  );
}

function FuelOverview({ products }: { products: FuelProductView[] }) {
  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y)] min-[841px]:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
      <div>
        <SectionHeading
          eyebrow="Petrol / Diesel"
          highlight="one promise"
        >
          Quality fuel, full quantity,
        </SectionHeading>
        <p className="mt-6 max-w-[56ch] leading-[1.72]">
          From depot to station and ultimately to your fuel tank, we maintain
          stringent quality-control and handling processes to preserve the
          integrity of every litre. Whether you choose petrol or diesel, you can
          count on quality fuel, full quantity, and dependable service at
          PETROSOL.
        </p>
      </div>

      <div className="grid grid-cols-2 items-start gap-[var(--gutter)]">
        {products.length > 0 ? (
          products.map((product, index) => (
            <FuelProductPhoto key={product.id} product={product} index={index} />
          ))
        ) : (
          <div className="col-span-2">
            <ContentEmpty
              title="Fuel details are being updated"
              description="Please check back shortly for our current petrol and diesel information."
            />
          </div>
        )}
        <PhotoTile
          ratio="news"
          className="col-span-2 mt-2 aspect-[16/9]"
          image={
            <Image
              src="/images/home/station-canopy-wide.webp"
              alt="PETROSOL service station forecourt with petrol and diesel pumps"
              fill
              sizes="(max-width: 840px) 100vw, 58vw"
            />
          }
        />
      </div>
    </section>
  );
}

function PriceBand({ board }: { board: PumpPriceBoardView | null }) {
  if (!board) return null;

  return (
    <section
      aria-label="Current pump prices"
      className="bg-surface-inverse py-[var(--section-y-tight)]"
    >
      <div className="ps-container flex flex-wrap items-center justify-center gap-x-20 gap-y-8">
        <time
          dateTime={board.updatedAt.slice(0, 10)}
          className="basis-full text-center font-mono text-[11px] tracking-[0.14em] text-white/65 uppercase"
        >
          At the pump today &middot; {formatPumpDate(board.updatedAt)}
        </time>
        {board.prices.map(({ fuel, amount }) => (
          <Stat
            key={fuel}
            value={formatCedis(amount)}
            label={
              <>
                {fuel} &middot; GHS/L
              </>
            }
            size="md"
            className="min-w-[120px]"
            valueClassName="text-white"
          />
        ))}
      </div>
    </section>
  );
}

function FuelPromiseSection() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our promise"
          align="center"
          highlight="every litre"
        >
          From depot to tank, we care for
        </SectionHeading>

        <div className="mt-14 grid grid-cols-1 items-center gap-[clamp(40px,5vw,72px)] min-[961px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="grid grid-cols-2 items-start gap-[var(--gutter)]">
            <PhotoTile
              className="aspect-[4/5]"
              image={
                <Image
                  src="/images/fuel/attendant-card-payment.webp"
                  alt="A PETROSOL attendant taking card payment at the pump"
                  fill
                  sizes="(max-width: 960px) 45vw, 22vw"
                  className="object-[center_20%]"
                />
              }
            />
            <PhotoTile
              className="mt-14 aspect-[4/5]"
              image={
                <Image
                  src="/images/home/attendant-windscreen.webp"
                  alt="A PETROSOL attendant cleaning a customer's windscreen"
                  fill
                  sizes="(max-width: 960px) 45vw, 22vw"
                  className="object-right"
                />
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-[var(--gutter)] min-[640px]:grid-cols-3 min-[961px]:grid-cols-1">
            {fuelPromises.map(({ title, lead, description, icon }) => (
              <ServiceCard key={title} title={title} icon={icon}>
                <strong className="text-navy-900">{lead}</strong>{" "}
                {description}
              </ServiceCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FleetPhotoBreak() {
  return (
    <figure className="relative m-0 h-[clamp(280px,45vw,560px)] overflow-hidden">
      <Image
        src="/images/home/fuel-delivery.webp"
        alt="PETROSOL fuel delivery tanker fleet and operations team"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </figure>
  );
}

function BulkCta() {
  return (
    <MosaicCtaBand>
      <SectionHeading
        tone="light"
        align="center"
        eyebrow="Bulk supply"
        highlight="direct to site"
      >
        Corporate volumes, delivered
      </SectionHeading>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/contact-us">Enquire about bulk supply</Link>
        </Button>
        <Button asChild variant="outlineInverse">
          <Link href="/lubricants">Explore lubricants</Link>
        </Button>
      </div>
    </MosaicCtaBand>
  );
}

function FuelSections({
  products,
  priceBoard,
}: {
  products: FuelProductView[];
  priceBoard: PumpPriceBoardView | null;
}) {
  return (
    <main>
      <FuelPageHeader />
      <FuelOverview products={products} />
      <PriceBand board={priceBoard} />
      <FuelPromiseSection />
      <FleetPhotoBreak />
      <BulkCta />
    </main>
  );
}

export { FuelSections };
