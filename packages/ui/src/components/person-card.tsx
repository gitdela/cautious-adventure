import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils";

function initialsForName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function PersonCard({
  name,
  role,
  tone = "light",
  media,
  mediaClassName,
  footer,
  className,
}: {
  name: string;
  role: string;
  tone?: "light" | "dark";
  /**
   * Photo for the 3:4 frame. A slot rather than an image prop because this
   * package must not import framework image components — the app passes its
   * own. Without it the card falls back to the person's initials.
   */
  media?: ReactNode;
  mediaClassName?: string;
  /**
   * Optional slot beside the name — a call to action, a link affordance, a
   * badge. Kept a slot rather than a `href` prop so this stays routing-agnostic:
   * the card itself never knows whether it is inside a link.
   */
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "ps-blueprint relative grid aspect-[3/4] place-items-center overflow-hidden rounded-xl",
          // Tone-dependent fill: the tile must never be the same navy as the
          // band behind it, or it disappears into the background.
          tone === "dark" ? "bg-navy-700" : "bg-navy-800",
          // A filled image should cover the frame; the initials stay centred.
          // `object-top` so a frame wider than the delivered crop (the `fill`
          // variant) sacrifices the bottom of the photo, never the head.
          media && "[&_img]:absolute [&_img]:inset-0 [&_img]:size-full [&_img]:object-cover [&_img]:object-top",
          mediaClassName,
        )}
      >
        {media ?? (
          <span className="font-display text-[length:var(--size-stat-md)] font-bold text-white/90">
            {initialsForName(name)}
          </span>
        )}
      </div>
      {/* Baseline-aligned so the footer sits on the name's first line even
          when a long name wraps, rather than drifting to the block's centre. */}
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3
          className={cn(
            "font-display text-base font-bold",
            tone === "dark" ? "text-white" : "text-navy-900",
          )}
        >
          {name}
        </h3>
        {footer}
      </div>
      <p
        className={cn(
          "mt-1 text-[13px]",
          tone === "dark" ? "text-white/65" : "text-muted-foreground",
        )}
      >
        {role}
      </p>
    </article>
  );
}

export { PersonCard };
