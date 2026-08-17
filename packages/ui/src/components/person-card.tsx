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
  className,
}: {
  name: string;
  role: string;
  tone?: "light" | "dark";
  /**
   * Photo for the 4:5 frame. A slot rather than an image prop because this
   * package must not import framework image components — the app passes its
   * own. Without it the card falls back to the person's initials.
   */
  media?: ReactNode;
  mediaClassName?: string;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "ps-blueprint relative grid aspect-[4/5] place-items-center overflow-hidden rounded-xl",
          // Tone-dependent fill: the tile must never be the same navy as the
          // band behind it, or it disappears into the background.
          tone === "dark" ? "bg-navy-700" : "bg-navy-800",
          // A filled image should cover the frame; the initials stay centred.
          media && "[&_img]:absolute [&_img]:inset-0 [&_img]:size-full [&_img]:object-cover",
          mediaClassName,
        )}
      >
        {media ?? (
          <span className="font-display text-[length:var(--size-stat-md)] font-bold text-white/90">
            {initialsForName(name)}
          </span>
        )}
      </div>
      <h3
        className={cn(
          "mt-4 font-display text-base font-bold",
          tone === "dark" ? "text-white" : "text-navy-900",
        )}
      >
        {name}
      </h3>
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
