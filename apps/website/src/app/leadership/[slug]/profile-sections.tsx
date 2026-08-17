import Link from "next/link";
import NextImage from "next/image";

import { urlForImage } from "@workspace/cms/image";
import {
  PortableContent,
  type TeamMemberFull,
  type TeamMemberSummary,
} from "@workspace/content";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

import { contentAdapters } from "@/lib/content-adapters";

import { MosaicPageHeader } from "../../mosaic-page-header";
import { SiteBreadcrumbs } from "../../site-breadcrumbs";
import { splitNameForHeadline, teamProfileHref } from "../../team-card";

/**
 * One template renders all twelve profiles. Everything that differs between a
 * leadership person and a board person is derived from `groups` rather than
 * stored, so a member added in Studio needs no code change.
 */
type ProfileContext = {
  isLeadership: boolean;
  /** Eyebrow on the right column and mono kicker on the left — identical text. */
  groupLabel: string;
  backHref: string;
  backLabel: string;
  ancestorLabel: string;
  alsoLabel: string;
};

function profileContext(member: TeamMemberFull): ProfileContext {
  // Someone in both groups (the CEO) is presented in their leadership context.
  const isLeadership = member.groups.includes("leadership");

  return {
    isLeadership,
    groupLabel: member.featured
      ? "Executive leadership"
      : isLeadership
        ? "Senior management"
        : "Board of directors",
    backHref: isLeadership ? "/leadership" : "/board",
    backLabel: isLeadership ? "Back to the leadership team" : "Back to the board",
    ancestorLabel: isLeadership ? "Leadership" : "Board of Directors",
    alsoLabel: isLeadership ? "Also on the team" : "Also on the board",
  };
}

/**
 * The profile portrait uses the SECOND image, not the headshot.
 *
 * The listing cards already show the headshot, so the profile page deliberately
 * carries the other shot — the two pages never show the same picture. Falls back
 * to a labelled placeholder rather than the headshot, so a missing second image
 * is visible instead of silently masked.
 */
function ProfilePortrait({ member }: { member: TeamMemberFull }) {
  if (!member.coverPhoto) {
    return <ImagePlaceholder label={`Drop a portrait — ${member.name}`} />;
  }

  return (
    <NextImage
      src={urlForImage(member.coverPhoto)
        .width(480)
        .height(600)
        // `fit("crop")` honours the hotspot the editor set in Studio.
        .fit("crop")
        .auto("format")
        .url()}
      alt={member.coverPhoto.alt ?? member.name}
      width={480}
      height={600}
      sizes="(max-width: 840px) 100vw, 400px"
      priority
      className="size-full object-cover"
    />
  );
}

function ProfileBody({ member }: { member: TeamMemberFull }) {
  const { groupLabel, backHref, backLabel, isLeadership } =
    profileContext(member);
  const { lead, last } = splitNameForHeadline(member.name);

  // The band treatment is the recognition cue: leadership profiles are white,
  // board profiles carry the same navy blueprint band (and corner cut) as the
  // Board page's bento section, so the association is immediate.
  const inverse = !isLeadership;

  // On the navy band the dark hairline disappears, so it flips to the inverse
  // border; likewise the kicker moves to the lighter orange-400 used on
  // inverse bands, and body copy to 78% white.
  const hairline = inverse ? "border-white/16" : "border-border";

  return (
    <section
      className={cn(
        "py-[var(--section-y)]",
        inverse && "ps-blueprint rounded-tr-[120px] bg-surface-inverse",
      )}
    >
      <div className="ps-container grid grid-cols-1 items-start gap-[clamp(48px,6.25vw,80px)] min-[841px]:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        {/* Sticky so the portrait stays in view while a long bio scrolls. 102px
            clears the fixed 78px header. Static once the columns stack, where
            sticking would pin the portrait over the text. */}
        <div className="w-full max-w-[400px] min-[841px]:sticky min-[841px]:top-[102px]">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            <ProfilePortrait member={member} />
          </div>
          <div className={cn("mt-5 border-t pt-4", hairline)}>
            <p
              className={cn(
                "font-mono text-[12px] font-semibold tracking-[0.14em] uppercase",
                inverse ? "text-orange-400" : "text-brand",
              )}
            >
              {groupLabel}
            </p>
            <p
              className={cn(
                "mt-1 text-[13px]",
                inverse ? "text-white/65" : "text-muted-foreground",
              )}
            >
              {member.role}
            </p>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow={groupLabel}
            highlight={last}
            tone={inverse ? "light" : "dark"}
          >
            {lead}
          </SectionHeading>
          <p
            className={cn(
              "mt-4 font-display text-[length:var(--size-display-sm)] font-bold",
              inverse ? "text-white" : "text-navy-900",
            )}
          >
            {member.role}
          </p>

          <PortableContent
            value={member.bio}
            adapters={contentAdapters}
            className={cn(
              "mt-6 flex max-w-[58ch] flex-col gap-5",
              inverse && "text-white/78",
            )}
          />

          {member.quote ? (
            <blockquote
              className={cn(
                "mt-8 max-w-[46ch] border-t pt-5 font-display text-[clamp(18px,2vw,24px)] leading-[1.5] font-bold",
                hairline,
                inverse ? "text-white" : "text-navy-900",
              )}
            >
              &ldquo;{member.quote}&rdquo;
            </blockquote>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant={inverse ? "outlineInverse" : "outline"}>
              <Link href={backHref}>{backLabel}</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Same-group colleagues only — board people never list leadership people. */
function MoreProfiles({
  member,
  others,
}: {
  member: TeamMemberFull;
  others: TeamMemberSummary[];
}) {
  if (others.length === 0) return null;

  const { alsoLabel, isLeadership } = profileContext(member);

  return (
    // Stays a white section in both variants. On a board profile it carries no
    // top hairline — the navy band above already terminates the section, and a
    // rule there would double the edge.
    <section
      className={cn(
        "pt-[var(--section-y-tight)] pb-[var(--section-y)]",
        isLeadership && "border-t border-border",
      )}
    >
      <div className="ps-container">
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          {alsoLabel}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {others.map((other) => (
            <Link key={other.id} href={teamProfileHref(other.slug)}>
              <Badge
                variant="secondary"
                className="h-auto py-1.5 transition-colors hover:bg-muted"
              >
                {other.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfileSections({
  member,
  others,
}: {
  member: TeamMemberFull;
  others: TeamMemberSummary[];
}) {
  const { ancestorLabel, backHref } = profileContext(member);

  return (
    <main>
      <MosaicPageHeader
        title={member.name}
        breadcrumbs={
          <SiteBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: ancestorLabel, href: backHref },
              { label: member.name },
            ]}
          />
        }
      />
      <ProfileBody member={member} />
      <MoreProfiles member={member} others={others} />
    </main>
  );
}

export { ProfileSections, profileContext };
