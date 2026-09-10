import Link from "next/link";

import type { NationalLeadershipProfileView } from "@workspace/content";
import { Badge } from "@workspace/ui/components/badge";
import { ContentEmpty } from "@workspace/content";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";

import { contentAdapters } from "@/lib/content-adapters";

function Appointment({
  institution,
  position,
  status,
  tenure,
  summary,
  sourceUrl,
}: NationalLeadershipProfileView["appointments"][number]) {
  return (
    <li className="border-t border-border pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={status === "current" ? "brand" : "secondary"}>
          {status === "current" ? "Current" : "Former"}
        </Badge>
        {tenure ? (
          <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
            {tenure}
          </span>
        ) : null}
      </div>
      <h4 className="mt-3 font-display text-[16px] font-bold text-navy-900">
        {position}
      </h4>
      <p className="mt-1 text-[13px] font-semibold text-brand">{institution}</p>
      <p className="mt-3 text-[13px] leading-[1.58] text-muted-foreground">
        {summary}
      </p>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-[12px] font-bold text-orange-600 underline underline-offset-4"
        >
          View public source
        </a>
      ) : null}
    </li>
  );
}

function NationalLeadershipProfileCard({
  profile,
  featured = false,
}: {
  profile: NationalLeadershipProfileView;
  featured?: boolean;
}) {
  const { Image: CmsImage } = contentAdapters;

  const card = (
    <article className="@container/profile overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/*
        Container query, not a viewport breakpoint: this card renders both full
        width (the featured profile) and two-up, so only its own width can say
        whether a side-by-side portrait fits.
      */}
      <div className="grid grid-cols-1 @[640px]/profile:grid-cols-[minmax(240px,0.34fr)_minmax(0,1fr)]">
        {/*
          The frame bleeds to the card edges but holds a fixed ratio and stays
          top-aligned: stretching it to the height of a long appointments list
          is what turned these portraits into slivers. A wide crop when the
          photo sits above the copy, a 3:4 portrait when it sits beside it.
        */}
        <div className="relative grid aspect-[16/10] w-full place-items-center self-start overflow-hidden bg-ink-100 @[640px]/profile:aspect-[3/4]">
          {profile.photo ? (
            <CmsImage
              source={profile.photo}
              alt={profile.photo.alt ?? profile.name}
              width={640}
              height={854}
              sizes="(max-width: 840px) 100vw, 600px"
              className="size-full object-cover object-top"
              priority={featured}
            />
          ) : (
            <ImagePlaceholder label={`Portrait coming soon: ${profile.name}`} />
          )}
        </div>
        <div className="p-7 @[640px]/profile:p-9">
          <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
            PETROSOL leadership
          </p>
          <h3 className="mt-3 font-display text-[clamp(22px,2.4vw,32px)] leading-[1.12] font-bold tracking-[-0.02em] text-navy-900">
            {profile.name}
          </h3>
          <p className="mt-2 font-display text-[15px] font-bold text-muted-foreground">
            {profile.petrosolRole}
          </p>
          {/* Two-up once the card is wide enough that a single column of
              13px summaries would run past a comfortable measure. */}
          <ul className="mt-7 grid gap-5 @[1000px]/profile:grid-cols-2">
            {profile.appointments.map((appointment) => (
              <Appointment key={appointment.id} {...appointment} />
            ))}
          </ul>
          {profile.profileSlug ? (
            <Link
              href={`/leadership-team/${profile.profileSlug}`}
              className="mt-7 inline-flex text-[13px] font-bold text-orange-600 underline underline-offset-4"
            >
              View PETROSOL profile
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );

  return card;
}

function NationalLeadershipProfiles({
  profiles,
}: {
  profiles: NationalLeadershipProfileView[];
}) {
  if (profiles.length === 0) {
    return (
      <ContentEmpty
        title="Leadership profiles are being prepared"
        description="Published industry and national appointments will appear here."
      />
    );
  }

  const [featured, ...others] = profiles;

  return (
    <div className="flex flex-col gap-6">
      <NationalLeadershipProfileCard profile={featured} featured />
      {others.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 min-[1101px]:grid-cols-2">
          {others.map((profile) => (
            <NationalLeadershipProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { NationalLeadershipProfiles };
