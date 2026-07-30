import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

type Alignment = "left" | "center";
type Tone = "dark" | "light";

function Eyebrow({
  children,
  align = "left",
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  align?: Alignment;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-display text-[13px] leading-[1.2] font-bold tracking-[0.14em] uppercase",
        align === "center" && "text-center",
        tone === "light" ? "text-white" : "text-brand",
        className,
      )}
    >
      {children}
    </p>
  );
}

const headingSizes = {
  sm: "text-[length:var(--size-display-sm)] leading-[1.18]",
  md: "text-[length:var(--size-display-md)] leading-[1.14]",
  lg: "text-[length:var(--size-display-lg)] leading-[1.08]",
};

function SectionHeading({
  eyebrow,
  children,
  highlight,
  size = "md",
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  highlight?: string;
  size?: keyof typeof headingSizes;
  align?: Alignment;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <Eyebrow align={align} tone={tone} className="mb-4">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cn(
          "font-display font-bold tracking-[-0.02em]",
          headingSizes[size],
          tone === "light" ? "text-white" : "text-navy-900",
        )}
      >
        {children}
        {highlight ? (
          <>
            {" "}
            <span className="swash">{highlight}</span>
          </>
        ) : null}
      </h2>
    </div>
  );
}

function Stat({
  value,
  children,
  label,
  size = "xl",
  tone = "inverse",
  divider = false,
  className,
}: {
  value: string;
  children?: React.ReactNode;
  label?: React.ReactNode;
  size?: "xl" | "md";
  tone?: "inverse" | "default";
  divider?: boolean;
  className?: string;
}) {
  if (size === "md") {
    return (
      <div className={cn("text-center", className)}>
        <strong className="font-display text-[length:var(--size-stat-md)] leading-[1.05] font-bold tracking-[-0.02em] text-brand">
          {value}
        </strong>
        {label ? (
          <p
            className={cn(
              "mt-2 text-[13px]",
              tone === "inverse" ? "text-white/72" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid items-baseline gap-6 py-8 min-[721px]:grid-cols-[minmax(180px,240px)_1fr] min-[721px]:gap-12 min-[721px]:py-12",
        divider &&
          (tone === "inverse" ? "border-t border-white/16" : "border-t border-border"),
        className,
      )}
    >
      <strong className="font-display text-[length:var(--size-stat-xl)] leading-none font-bold tracking-[-0.02em] text-brand">
        {value}
      </strong>
      {children ? (
        <p
          className={cn(
            "max-w-[52ch] text-[15px] leading-[1.62]",
            tone === "inverse" ? "text-white/72" : "text-foreground",
          )}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

const photoRatios = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  news: "aspect-[4/3]",
};

function PhotoTile({
  image,
  ratio = "portrait",
  caption,
  children,
  className,
}: {
  image: React.ReactNode;
  ratio?: keyof typeof photoRatios;
  caption?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative m-0 overflow-hidden rounded-2xl bg-ink-100 [&_img]:size-full [&_img]:object-cover",
        photoRatios[ratio],
        className,
      )}
    >
      {image}
      {children ? (
        <div className="absolute inset-0 grid place-items-center">{children}</div>
      ) : null}
      {caption ? (
        <figcaption className="absolute bottom-5 left-6 font-display text-base font-bold text-white">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Seal({ className }: { className?: string }) {
  const pathId = React.useId();

  return (
    <span
      className={cn(
        "relative inline-grid size-28 place-items-center rounded-full bg-brand text-white",
        className,
      )}
    >
      <svg
        viewBox="0 0 112 112"
        aria-hidden="true"
        className="seal-spin absolute inset-0 size-full"
      >
        <defs>
          <path
            id={pathId}
            fill="none"
            d="M 56 56 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
          />
        </defs>
        <text
          fill="currentColor"
          className="font-display text-[9px] font-bold tracking-[0.14em]"
        >
          <textPath href={`#${pathId}`}>
            SHAPING THE FUTURE · FOR TOMORROW ·
          </textPath>
        </text>
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-7"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    </span>
  );
}

export { Eyebrow, PhotoTile, Seal, SectionHeading, Stat };
