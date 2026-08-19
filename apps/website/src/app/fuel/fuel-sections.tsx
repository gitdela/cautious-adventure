import Image from "next/image";
import Link from "next/link";
import { RiLeafLine, RiShieldCheckLine } from "@remixicon/react";

import {
  formatCedis,
  formatPumpDate,
  type FuelProductView,
  type PumpPriceBoardView,
} from "@workspace/content";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  PhotoTile,
  SectionHeading,
  Stat,
} from "@workspace/ui/components/marketing";
import { MosaicPageHeader } from "../mosaic-page-header";
import { MosaicCtaBand } from "../mosaic-cta-band";
import { ServiceCard } from "@workspace/ui/components/service-card";
import { StationIcon } from "@workspace/ui/components/station-icon";

import { contentAdapters } from "@/lib/content-adapters";

import { SiteBreadcrumbs } from "../site-breadcrumbs";

const integrityPoints = [
  {
    title: "Full quantity",
    description:
      "Independently calibrated pumps at every station \u2014 a litre bought is a litre delivered.",
    icon: <RiShieldCheckLine />,
  },
  {
    title: "No contaminants",
    description:
      "A protected chain from loading depot to station to your tank keeps every litre clean.",
    icon: <StationIcon name="fuel-drop" />,
  },
  {
    title: "Cleaner emissions",
    description:
      "Quality fuel burns cleaner \u2014 protecting engines and the environment alike.",
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

/**
 * The same `pumpPrices` singleton the home hero totem reads, in the fuel page's
 * band layout. Absent board — nothing published, or every row incomplete — drops
 * the band rather than showing an empty strip under a date.
 */
function PriceBand({ board }: { board: PumpPriceBoardView | null }) {
  if (!board) return null;

  return (
    <section className="bg-surface-inverse py-[var(--section-y-tight)]">
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
          />
        ))}
      </div>
    </section>
  );
}

/**
 * One fuel's editorial block. `flip` alternates which side the photograph sits
 * on; it is derived from the product's position, not stored — see the `order`
 * field's description in the schema.
 */
function FuelFeature({
  product,
  flip = false,
}: {
  product: FuelProductView;
  flip?: boolean;
}) {
  const { Image: CmsImage } = contentAdapters;

  return (
    <section className="ps-container grid grid-cols-1 items-center gap-[clamp(48px,6.25vw,80px)] py-[var(--section-y-tight)] min-[841px]:grid-cols-2">
      <div className={flip ? "order-2" : "order-1"}>
        <SectionHeading eyebrow={product.eyebrow} highlight={product.highlight}>
          {product.heading}
        </SectionHeading>
        <div className="mt-6 flex max-w-[54ch] flex-col gap-5">
          {product.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <PhotoTile
        ratio="news"
        className={flip ? "order-1" : "order-2"}
        image={
          product.image ? (
            <CmsImage
              source={product.image}
              alt={product.image.alt ?? product.name}
              width={1200}
              height={800}
              sizes="(max-width: 840px) 100vw, 50vw"
            />
          ) : null
        }
      />
    </section>
  );
}

function IntegrityBand() {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Our fundamental promise"
          align="center"
          highlight="on time, every time"
        >
          Clean fuel in full quantity,
        </SectionHeading>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,264px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {integrityPoints.map(({ title, description, icon }) => (
            <ServiceCard key={title} title={title} icon={icon}>
              {description}
            </ServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegritySplit() {
  return (
    <section className="ps-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(40px,5vw,80px)] pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div>
        <SectionHeading eyebrow="Fuel integrity" highlight="full value">
          Accurate pumps, assured quality,
        </SectionHeading>
        <p className="mt-6 max-w-[50ch]">
          Every consignment is tested before discharge and every pump is
          independently calibrated. Marker-dosed fuel lets us trace and reject
          any adulteration in the supply chain.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Badge variant="success">
            <RiShieldCheckLine data-icon="inline-start" />
            GSA certified
          </Badge>
          <Badge>Marker-dosed</Badge>
          <Badge variant="secondary">Calibrated pumps</Badge>
        </div>
      </div>
      <PhotoTile
        ratio="news"
        image={
          <Image
            src="/images/fuel/attendant-card-payment.webp"
            alt="A PETROSOL attendant taking card payment at the pump"
            fill
            sizes="(max-width: 840px) 100vw, 50vw"
            // A tall portrait in a 4:3 tile shows just over half its height. A
            // centre crop lands on the bonnet and cuts the attendant's head off;
            // hard against the top loses the card handoff. 20% keeps the
            // dispenser readout, his face, and the payment all in frame.
            className="object-[center_20%]"
          />
        }
      />
    </section>
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
      <PriceBand board={priceBoard} />
      {products.map((product, index) => (
        // Even positions keep the photo on the right, odd flip it — so the
        // sections alternate however many fuels an editor adds.
        <FuelFeature
          key={product.id}
          product={product}
          flip={index % 2 === 1}
        />
      ))}
      <IntegrityBand />
      <IntegritySplit />
      <BulkCta />
    </main>
  );
}

export { FuelSections };
