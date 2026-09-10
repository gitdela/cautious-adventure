import {
  assertIsoDate,
  assertLegalVersion,
  assertSlug,
} from "@workspace/cms/validation";
import type {
  FuelProductsQueryResult,
  GalleryEventsQueryResult,
  LubricantCategoriesQueryResult,
  LubricantProductsQueryResult,
  PageBySlugQueryResult,
  PostBySlugQueryResult,
  PostListQueryResult,
  PumpPricesQueryResult,
  StationRegionsQueryResult,
  StationsQueryResult,
  TeamMemberBySlugQueryResult,
  TeamMembersByGroupQueryResult,
} from "@workspace/cms/types";

import type { CompanyPageSection } from "./components/company-page";
import { formatGrade } from "./format";
import type {
  BlogPostFull,
  BlogPostSummary,
  ContentImageValue,
  FuelProductView,
  GalleryEventView,
  LegalDocumentView,
  LubricantCategoryView,
  LubricantProductView,
  NationalLeadershipProfileView,
  PortableTextBlock,
  PumpPriceBoardView,
  StationRegionView,
  StationView,
  TeamMemberFull,
  TeamMemberSummary,
} from "./types";

/**
 * The single set of CMS-result → view-model mappers, shared by every app that
 * renders content so all surfaces shape it identically. Load-bearing fields
 * (slug, date, legal version) are asserted at this boundary; image/body/section
 * shapes are cast — the URL builder and Portable Text renderer accept the raw
 * shapes.
 */

// --- Blog ---
type PostListItem = NonNullable<PostListQueryResult>[number];

export function toBlogSummary(p: PostListItem): BlogPostSummary {
  return {
    slug: assertSlug(p.slug),
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: assertIsoDate(p.publishedAt),
    category: p.category?.title
      ? { title: p.category.title, slug: p.category.slug ?? null }
      : null,
    author: p.author?.name
      ? {
          name: p.author.name,
          slug: p.author.slug ?? null,
          avatar: (p.author.avatar as ContentImageValue | null) ?? null,
        }
      : null,
    readMinutes: null,
    coverImage: (p.coverImage as ContentImageValue | null) ?? null,
  };
}

export function toBlogFull(
  p: NonNullable<PostBySlugQueryResult>,
): BlogPostFull {
  return {
    slug: assertSlug(p.slug),
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: assertIsoDate(p.publishedAt),
    updatedAt: p.updatedAt ?? null,
    category: p.category?.title
      ? { title: p.category.title, slug: p.category.slug ?? null }
      : null,
    author: p.author?.name
      ? {
          name: p.author.name,
          slug: p.author.slug ?? null,
          avatar: (p.author.avatar as ContentImageValue | null) ?? null,
          bio: p.author.bio ?? null,
        }
      : null,
    readMinutes: null,
    coverImage: (p.coverImage as ContentImageValue | null) ?? null,
    body: (p.body ?? []) as unknown as PortableTextBlock[],
  };
}

// --- Legal (accepts both the current and per-version projections) ---
type LegalLike = {
  documentKind: string;
  title: string;
  version: string;
  effectiveAt: string;
  jurisdiction?: string | null;
  body: unknown;
};

export function toLegalView(d: LegalLike): LegalDocumentView {
  return {
    documentKind: d.documentKind,
    title: d.title,
    version: assertLegalVersion(d.version),
    effectiveAt: assertIsoDate(d.effectiveAt),
    jurisdiction: d.jurisdiction ?? null,
    body: (d.body ?? []) as unknown as PortableTextBlock[],
  };
}

// --- Pump prices (home hero board) ---
export function toPumpPriceBoard(
  p: NonNullable<PumpPricesQueryResult>,
): PumpPriceBoardView | null {
  const prices = (p.prices ?? []).flatMap((row) =>
    row.fuel && typeof row.price === "number"
      ? [{ fuel: row.fuel, amount: row.price }]
      : [],
  );
  if (prices.length === 0) return null;
  return { updatedAt: assertIsoDate(p._updatedAt), prices };
}

// --- Company page ---
export function toCompanyPage(p: NonNullable<PageBySlugQueryResult>): {
  title: string;
  sections: CompanyPageSection[];
} {
  return {
    title: p.title,
    sections: (p.sections ?? []) as unknown as CompanyPageSection[],
  };
}

// --- Team members ---
type TeamMemberListItem = TeamMembersByGroupQueryResult[number];

/**
 * The slug is asserted rather than passed through: it is the profile page's
 * URL, so a member saved without one must fail loudly here instead of
 * rendering a link to nowhere.
 */
export function toTeamMemberSummary(m: TeamMemberListItem): TeamMemberSummary {
  return {
    id: m._id,
    slug: assertSlug(m.slug),
    name: m.name,
    role: m.role,
    groups: m.groups ?? [],
    photo: m.photo ?? null,
    shortBio: m.shortBio ?? null,
    quote: m.quote ?? null,
    // `featured` is optional in the schema; absent means "not featured".
    featured: m.featured === true,
  };
}

export function toTeamMemberFull(
  m: NonNullable<TeamMemberBySlugQueryResult>,
): TeamMemberFull {
  return {
    ...toTeamMemberSummary(m),
    coverPhoto: m.coverPhoto ?? null,
    bio: (m.bio ?? []) as unknown as PortableTextBlock[],
  };
}

// --- Stations ---
export function toStationRegion(
  r: StationRegionsQueryResult[number],
): StationRegionView {
  return {
    id: r._id,
    slug: assertSlug(r.slug),
    name: r.name,
  };
}

export function toStation(s: StationsQueryResult[number]): StationView {
  return {
    id: s._id,
    slug: assertSlug(s.slug),
    name: s.name,
    // Optional chain deliberately: `region` is a required reference, but one
    // pointing at a deleted document dereferences to null. Naming the field in
    // a CmsValidationError beats an opaque TypeError, and the directory groups
    // solely by region — a station without one has nowhere to appear.
    region: {
      slug: assertSlug(s.region?.slug, "region.slug"),
      // Unreachable once the slug above asserts, but it keeps the type honest.
      name: s.region?.name ?? "",
    },
    manager: s.manager,
    phones: s.phones ?? [],
    // Empty means "facilities not recorded" — the directory shows no chips
    // rather than claiming the station has none.
    amenities: s.amenities ?? [],
  };
}

// --- Fuel ---
export function toFuelProduct(
  f: FuelProductsQueryResult[number],
): FuelProductView {
  return {
    id: f._id,
    slug: assertSlug(f.slug),
    name: f.name,
    eyebrow: f.eyebrow,
    image: (f.image as ContentImageValue | null) ?? null,
  };
}

// --- Lubricants ---
type LubricantCategoryItem = LubricantCategoriesQueryResult[number];
type LubricantProductItem = LubricantProductsQueryResult[number];

/**
 * Category slugs are asserted because the catalogue's filter state is keyed on
 * them — a category saved without one would render a chip that matches no
 * product.
 */
export function toLubricantCategory(
  c: LubricantCategoryItem,
): LubricantCategoryView {
  return {
    id: c._id,
    slug: assertSlug(c.slug),
    title: c.title,
    description: c.description ?? null,
  };
}

export function toLubricantProduct(
  p: LubricantProductItem,
): LubricantProductView {
  return {
    id: p._id,
    slug: assertSlug(p.slug),
    name: p.name,
    // Dereferenced by the query. Its slug is what the filter compares against,
    // so it is asserted here too.
    category: {
      title: p.category.title,
      slug: assertSlug(p.category.slug, "category.slug"),
    },
    // Normalised here rather than at each badge, so every surface — and any
    // future one — shows the same capitalisation without remembering to ask.
    grade: formatGrade(p.grade),
    standard: p.standard,
    applications: p.applications,
    drainInterval: p.drainInterval ?? null,
    benefits: p.benefits ?? [],
    image: (p.image as ContentImageValue | null) ?? null,
    // Optional in the schema; absent means "not featured".
    featuredOnHome: p.featuredOnHome === true,
  };
}

// --- Gallery events ---

/**
 * Whether an image field actually points at an uploaded file.
 *
 * A Sanity image can exist as a shape without one: fill in the alt text, never
 * pick a file, and the document holds `{_type: 'image', alt: '…'}` with no
 * asset. It is truthy, so a plain null check waves it through — and then the
 * URL builder throws "Unable to resolve image URL from source" at render.
 */
function hasAsset(image: unknown): boolean {
  return Boolean(
    (image as { asset?: { _ref?: string } } | null | undefined)?.asset?._ref,
  );
}

/**
 * `kind` and `stream` are not asserted: both are required in the schema, and
 * the extract runs with `--enforce-required-fields`, so the generated types
 * have already narrowed them to literal unions.
 *
 * The kind-conditional reads below are not defensive padding. Sanity's `hidden`
 * only hides a field, it does not clear it, so an event switched from video to
 * photos still carries its old playback ID. This is where those leftovers stop:
 * the view model only ever holds what its kind actually renders.
 */
export function toGalleryEvent(
  e: GalleryEventsQueryResult[number],
): GalleryEventView {
  const isStory = e.kind === "story";
  const isVideo = e.kind === "video";

  return {
    id: e._id,
    slug: assertSlug(e.slug),
    title: e.title,
    kind: e.kind,
    stream: e.stream,
    series: e.series ?? null,
    // Community work has no date by design — its pill reads "CSR". A dated
    // event without one is a hard failure: there would be no year pill to file
    // it under, so it would drop off the page silently instead of loudly.
    year:
      e.stream === "community"
        ? null
        : assertIsoDate(e.eventDate, "eventDate").slice(0, 4),
    // An image with no file behind it is treated as absent, so the card falls
    // back to the reel or a placeholder instead of throwing.
    coverImage: hasAsset(e.coverImage)
      ? (e.coverImage as ContentImageValue)
      : null,
    // Filtered, not just guarded at render: `photos.length` is what drives the
    // "+N more" count, the video row's photo pill and the lightbox counter, so
    // an unrenderable member would make all three lie and put a blank slide in
    // the lightbox.
    photos: ((e.photos ?? []) as unknown as ContentImageValue[]).filter(
      hasAsset,
    ),
    excerpt: isStory ? (e.excerpt ?? null) : null,
    body: isStory ? ((e.body ?? []) as unknown as PortableTextBlock[]) : [],
    caption: isVideo ? (e.caption ?? null) : null,
    muxPlaybackId: isVideo ? (e.muxPlaybackId ?? null) : null,
    posterTime: isVideo ? (e.posterTime ?? 0) : 0,
  };
}

type NationalLeadershipProfileItem =
  import("@workspace/cms/types").NationalLeadershipProfilesQueryResult[number];

export function toNationalLeadershipProfile(
  p: NationalLeadershipProfileItem,
): NationalLeadershipProfileView {
  return {
    id: p._id,
    name: p.personName,
    petrosolRole: p.petrosolRole,
    profileSlug: p.profileSlug ?? null,
    photo: hasAsset(p.photo) ? (p.photo as ContentImageValue) : null,
    appointments: (p.appointments ?? []).map((appointment, index) => ({
      // Typegen says `_key` is always there, but documents seeded outside
      // Studio can miss it — fall back to the position so React keys stay
      // unique either way.
      id: appointment._key ?? `appointment-${index}`,
      institution: appointment.institution,
      position: appointment.position,
      status: appointment.status,
      tenure: appointment.tenure ?? null,
      summary: appointment.summary,
      sourceUrl: appointment.sourceUrl ?? null,
    })),
  };
}
