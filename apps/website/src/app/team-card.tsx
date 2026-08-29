import Link from "next/link";
import NextImage from "next/image";

import { urlForImage } from "@workspace/cms/image";
import type { TeamMemberSummary } from "@workspace/content";
import { PersonCard } from "@workspace/ui/components/person-card";
import { cn } from "@workspace/ui/lib/utils";

/**
 * Shared card for the Leadership and Board grids: a `PersonCard` with the
 * member's photo, linking to their profile page.
 *
 * NOTE: `teamProfileHref` is the single definition of the profile route. The
 * route itself is being built separately — if it lands somewhere other than
 * `/leadership-team/[slug]`, this function is the only edit needed.
 */
export function teamProfileHref(slug: string) {
  return `/leadership-team/${slug}`;
}

/**
 * Splits a name so the swash lands on the LAST word only — "Michael Affum
 * Oseikoh" → lead "Michael Affum", highlight "Oseikoh". Used by both the CEO
 * feature and the profile headline so they read identically.
 */
export function splitNameForHeadline(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  const lead = parts.length > 1 ? parts.slice(0, -1).join(" ") : name;
  return { lead, last };
}

/** 4:5 to match `PersonCard`'s frame. `fit("crop")` honours the Sanity hotspot,
 *  which is the reason these photos live in the CMS at all. */
const PHOTO_WIDTH = 480;
const PHOTO_HEIGHT = 600;

function TeamMemberPhoto({
  member,
  priority,
}: {
  member: TeamMemberSummary;
  priority?: boolean;
}) {
  if (!member.photo) return null;

  return (
    <NextImage
      src={urlForImage(member.photo)
        .width(PHOTO_WIDTH)
        .height(PHOTO_HEIGHT)
        .fit("crop")
        // Portrait sources are taller than this 4:5 tile, so something has to
        // go. Sanity's default is a centre crop, which takes it off the top and
        // clips heads — bias upward instead. A hotspot set in Studio overrides
        // this per image, and is the right fix for any individual photo.
        .crop("top")
        .auto("format")
        .url()}
      alt={member.photo.alt ?? member.name}
      width={PHOTO_WIDTH}
      height={PHOTO_HEIGHT}
      // Phones give each card its own row on both the board and leadership
      // grids, so the tile is full-bleed there — asking for 50vw would serve a
      // half-resolution crop into a full-width frame.
      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 300px"
      priority={priority}
    />
  );
}

/**
 * Whether this member headlines the given page.
 *
 * `featured` alone is not enough: the CEO sits in both groups, so he would
 * otherwise headline the board page as well as leadership. A person headlines
 * the page of their PRIMARY group — leadership if they are in it, else board.
 */
export function primaryGroupOf(member: {
  groups: string[];
}): "leadership" | "board" {
  return member.groups.includes("leadership") ? "leadership" : "board";
}

export function isFeaturedFor(
  member: TeamMemberSummary,
  group: "leadership" | "board",
) {
  return member.featured && primaryGroupOf(member) === group;
}

function TeamCard({
  member,
  tone = "light",
  fill = false,
  className,
}: {
  member: TeamMemberSummary;
  tone?: "light" | "dark";
  /**
   * Stretch the tile to the column's height instead of holding 4:5. Used by the
   * Chairman feature, where the card sits beside a copy column of unknown height.
   */
  fill?: boolean;
  /** Grid placement from the caller — the board page spans some cards wider. */
  className?: string;
}) {
  return (
    <Link
      href={teamProfileHref(member.slug)}
      aria-label={`View profile — ${member.name}, ${member.role}`}
      className={cn(
        // The lift, the name shifting to brand, and the "View profile" overlay
        // that fades in over the photo all hang off this `group`.
        "group rounded-xl no-underline transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[3px]",
        "[&_h3]:transition-colors hover:[&_h3]:text-brand",
        "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        fill && "h-full",
        className,
      )}
    >
      <PersonCard
        name={member.name}
        role={member.role}
        tone={tone}
        className={fill ? "h-full" : undefined}
        mediaClassName={fill ? "aspect-auto min-h-[400px] flex-1" : undefined}
        media={
          <>
            <TeamMemberPhoto member={member} />
            {/*
              The affordance rides on the photo itself rather than sitting under
              the name, so what it points at — click the portrait — is where it
              appears. Hidden at rest and faded in on hover, and on
              `focus-visible` too, so a keyboard sees the same cue the mouse
              does. `aria-hidden` because the link already names its
              destination; a screen reader repeating "View profile" adds nothing.
            */}
            <span
              aria-hidden="true"
              className="absolute inset-0 z-10 grid place-items-center bg-navy-900/55 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            >
              <span className="pill bg-white px-4 py-2 font-display text-[13px] font-semibold whitespace-nowrap text-navy-900">
                View profile
              </span>
            </span>
          </>
        }
      />
    </Link>
  );
}

export { TeamCard, TeamMemberPhoto };
