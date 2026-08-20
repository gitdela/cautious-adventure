"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine, RiCloseLine } from "@remixicon/react";

import { urlForImage } from "@workspace/cms/image";
import {
  ContentEmpty,
  type LubricantCategoryView,
  type LubricantProductView,
} from "@workspace/content";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

/** The unfiltered view. Not a category document — "no filter" is page behaviour,
 *  not editable content. Categories are matched on slug, so this cannot collide
 *  with a real one unless an editor names a category "all", which would be
 *  indistinguishable to a visitor anyway. */
const ALL = "all";

function ProductImage({
  product,
  width,
  height,
  sizes,
}: {
  product: LubricantProductView;
  /** Requested crop, so the pack shot's hotspot is honoured at each frame ratio. */
  width: number;
  height: number;
  sizes: string;
}) {
  if (!product.image) {
    return <ImagePlaceholder label={`Drop ${product.name} pack shot`} />;
  }

  return (
    <Image
      src={urlForImage(product.image)
        .width(width)
        .height(height)
        .fit("crop")
        .auto("format")
        .url()}
      alt={product.image.alt ?? `${product.name} lubricant pack`}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}

function ProductOverview({
  product,
  title,
}: {
  product: LubricantProductView;
  title: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-6 pr-9">
      <div className="relative size-[clamp(120px,26vw,180px)] shrink-0 overflow-hidden rounded-xl border border-border bg-background">
        <ProductImage product={product} width={360} height={360} sizes="180px" />
      </div>
      <div className="min-w-0 flex-1 basis-60">
        <p className="mb-3 font-display text-[13px] leading-[1.2] font-bold tracking-[0.14em] text-brand uppercase">
          {product.category.title}
        </p>
        {title}
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge className="h-auto min-h-7 max-w-full py-1.5 whitespace-normal">
            {product.grade}
          </Badge>
          <Badge
            variant="secondary"
            className="h-auto min-h-7 max-w-full py-1.5 whitespace-normal"
          >
            {product.standard}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 border-t border-border py-4 min-[768px]:grid-cols-[minmax(88px,128px)_1fr] min-[768px]:gap-[clamp(12px,2.4vw,20px)] min-[768px]:py-3">
      <p className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase min-[768px]:pt-0.5">
        {label}
      </p>
      <div className="text-[clamp(13px,1.6vw,15px)] leading-[1.62]">
        {children}
      </div>
    </div>
  );
}

function ProductSpecRows({ product }: { product: LubricantProductView }) {
  return (
    <div>
      <SpecRow label="Suitable for">{product.applications}</SpecRow>
      {product.drainInterval ? (
        <SpecRow label="Drain interval">{product.drainInterval}</SpecRow>
      ) : null}
      <SpecRow label="Benefits">
        <ul className="flex list-disc flex-col gap-2 pl-[1.1em]">
          {product.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </SpecRow>
    </div>
  );
}

function ProductSpecs({
  product,
  onClose,
}: {
  product: LubricantProductView;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="p-0 before:inset-0 before:rounded-t-3xl before:rounded-b-none data-[vaul-drawer-direction=bottom]:max-h-[92dvh]">
          <DrawerClose asChild>
            <Button
              size="icon-sm"
              className="absolute top-4 right-4 z-10 shadow-card"
            >
              <RiCloseLine />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <DrawerHeader className="items-stretch gap-4 px-5 pt-5 pb-4 text-left group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left">
              <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
                <div className="relative size-24 overflow-hidden rounded-xl border border-border bg-background">
                  <ProductImage
                    product={product}
                    width={192}
                    height={192}
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 pr-9">
                  <p className="mb-2 font-display text-[11px] leading-[1.2] font-bold tracking-[0.12em] text-brand uppercase">
                    {product.category.title}
                  </p>
                  <DrawerTitle className="font-display text-[clamp(18px,6vw,24px)] leading-[1.18] font-bold text-navy-900">
                    {product.name}
                  </DrawerTitle>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="h-auto min-h-7 max-w-full py-1.5 whitespace-normal">
                  {product.grade}
                </Badge>
                <Badge
                  variant="secondary"
                  className="h-auto min-h-7 max-w-full py-1.5 whitespace-normal"
                >
                  {product.standard}
                </Badge>
              </div>
            </DrawerHeader>
            <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
              <ProductSpecRows product={product} />
              <DrawerDescription className="mt-5 text-[13px] leading-[1.58]">
                Full technical data sheets are available on request &mdash;{" "}
                <Link href="/contact-us" className="text-brand hover:text-orange-600">
                  contact our products team
                </Link>
                .
              </DrawerDescription>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto px-[var(--card-pad)] pt-9 pb-[var(--card-pad)] sm:max-w-[640px]">
        <DialogHeader>
          <ProductOverview
            product={product}
            title={
              <DialogTitle className="font-display text-[length:var(--size-display-sm)] leading-[1.2] font-bold text-navy-900">
                {product.name}
              </DialogTitle>
            }
          />
        </DialogHeader>
        <ProductSpecRows product={product} />
        <DialogDescription className="text-[13px] leading-[1.58]">
          Full technical data sheets are available on request &mdash;{" "}
          <Link href="/contact-us" className="text-brand hover:text-orange-600">
            contact our products team
          </Link>
          .
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function LubricantCard({
  product,
  onOpen,
}: {
  product: LubricantProductView;
  onOpen: (product: LubricantProductView) => void;
}) {
  return (
    <Card className="group/lubricant gap-0 border border-border bg-background py-0 shadow-card transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[3px] hover:shadow-raised">
      <div className="relative h-[280px] border-b border-border bg-background">
        <ProductImage
          product={product}
          width={760}
          height={560}
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex flex-1 p-0">
        <button
          type="button"
          onClick={() => onOpen(product)}
          className="group/spec flex flex-1 cursor-pointer flex-col items-start gap-2 bg-background px-6 pt-5 pb-6 text-left transition-colors group-hover/lubricant:bg-ink-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
            {product.category.title}
          </span>
          <span className="font-display text-[18px] font-bold text-navy-900">
            {product.name}
          </span>
          <span className="text-[13px] text-muted-foreground">{product.grade}</span>
          <span className="mt-2 inline-flex items-center gap-2 font-display text-[13px] font-bold text-brand">
            View specs
            <RiArrowRightLine className="transition-transform group-hover/spec:translate-x-[3px]" />
          </span>
        </button>
      </CardContent>
    </Card>
  );
}

function LubricantsCatalogue({
  products,
  categories,
}: {
  products: LubricantProductView[];
  categories: LubricantCategoryView[];
}) {
  const [category, setCategory] = useState<string>(ALL);
  const [selectedProduct, setSelectedProduct] =
    useState<LubricantProductView | null>(null);
  const shownProducts =
    category === ALL
      ? products
      : products.filter((product) => product.category.slug === category);

  return (
    <section className="ps-blueprint bg-muted pt-14 pb-[var(--section-y)]">
      <div className="ps-container">
        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(value) => {
            if (value) setCategory(value);
          }}
          aria-label="Filter lubricants by category"
          className="mx-auto mb-10 flex-wrap justify-center gap-3"
        >
          {[{ slug: ALL, title: "All" }, ...categories].map((item) => (
            <ToggleGroupItem
              key={item.slug}
              value={item.slug}
              className="h-11 rounded-4xl bg-background px-[18px] font-display text-[13px] font-bold shadow-card data-[state=on]:bg-navy-800 data-[state=on]:text-white"
            >
              {item.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {shownProducts.length === 0 ? (
          <ContentEmpty
            title="No lubricants to show"
            description={
              category === ALL
                ? "The catalogue is being updated. Please check back shortly."
                : "Nothing in this category yet — try another filter."
            }
          />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
            {shownProducts.map((product) => (
              <LubricantCard
                key={product.id}
                product={product}
                onOpen={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct ? (
        <ProductSpecs
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      ) : null}
    </section>
  );
}

export { LubricantsCatalogue };
