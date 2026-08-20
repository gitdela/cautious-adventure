import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@workspace/cms/image";

/**
 * Stable, presentation-focused view models. App routes map raw CMS query
 * results onto these before handing them to components, so the components
 * never depend on the shape of a generated GROQ result.
 */

export type ContentImageValue = SanityImageSource & { alt?: string | null };

export type AuthorRef = {
  name: string;
  slug?: string | null;
  avatar?: ContentImageValue | null;
  bio?: string | null;
};

export type CategoryRef = {
  title: string;
  slug?: string | null;
};

/**
 * A person on the Leadership or Board page. The summary is what the listing
 * grids render; `TeamMemberFull` adds the long bio and is fetched only by the
 * individual profile page, since it is the heaviest field.
 */
export type TeamMemberSummary = {
  id: string;
  slug: string;
  name: string;
  role: string;
  /**
   * Which pages this person appears on. Present on the summary because a
   * listing page needs it to tell its OWN featured person from someone who is
   * featured on the other page — the CEO sits in both groups.
   */
  groups: string[];
  photo?: ContentImageValue | null;
  shortBio?: string | null;
  /** Rendered as a pull quote. Chairman only, at time of writing. */
  quote?: string | null;
  featured: boolean;
};

export type TeamMemberFull = TeamMemberSummary & {
  /**
   * Optional second image for the profile page. Absent for most people — the
   * page should fall back to the headshot rather than assume it exists.
   */
  coverPhoto?: ContentImageValue | null;
  bio: PortableTextBlock[];
};

/** A sales territory in the station directory's filter. */
export type StationTerritoryView = {
  id: string;
  slug: string;
  name: string;
};

/**
 * One forecourt in the station directory. `amenities` is routinely empty —
 * facilities are confirmed for only part of the network — so consumers must
 * treat an empty list as "not recorded", not as "has none".
 */
export type StationView = {
  id: string;
  slug: string;
  name: string;
  /** Dereferenced in the query; its slug is what the filter compares against. */
  territory: { name: string; slug: string };
  manager: string;
  phones: string[];
  amenities: string[];
};

/**
 * One fuel section on /fuel — an editorial block, not a spec sheet. Pump prices
 * are separate: they come from the `pumpPrices` singleton as a
 * `PumpPriceBoardView`, shared with the home hero.
 */
export type FuelProductView = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  /** Opening words of the headline; `highlight` finishes the sentence. */
  heading: string;
  highlight: string;
  /** One entry per paragraph. */
  body: string[];
  image?: ContentImageValue | null;
};

/**
 * A filter group on the lubricants catalogue. The "All" chip is not one of
 * these — it is a code-side sentinel, since "no filter" is page behaviour
 * rather than editable content.
 */
export type LubricantCategoryView = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
};

/**
 * One product in the lubricants catalogue. There is no summary/full split: the
 * whole record fits in a card plus its spec dialog, and the page loads the full
 * catalogue in one read to filter it client-side.
 */
export type LubricantProductView = {
  id: string;
  slug: string;
  name: string;
  /** Dereferenced in the query, so this is the label the card shows. */
  category: CategoryRef;
  grade: string;
  standard: string;
  applications: string;
  drainInterval?: string | null;
  benefits: string[];
  image?: ContentImageValue | null;
  /** Candidate for the home page's four-product band. */
  featuredOnHome: boolean;
};

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category?: CategoryRef | null;
  author?: AuthorRef | null;
  readMinutes?: number | null;
  coverImage?: ContentImageValue | null;
};

export type BlogPostFull = BlogPostSummary & {
  body: PortableTextBlock[];
  updatedAt?: string | null;
};

export type FaqItem = {
  question: string;
  answer: PortableTextBlock[];
};

export type PumpPriceView = {
  fuel: string;
  /** GHS per litre. */
  amount: number;
};

export type PumpPriceBoardView = {
  /** ISO datetime of the last publish — shown as the board's date. */
  updatedAt: string;
  prices: PumpPriceView[];
};

export type LegalDocumentView = {
  documentKind: string;
  title: string;
  version: string;
  effectiveAt: string;
  jurisdiction?: string | null;
  body: PortableTextBlock[];
};

/**
 * One row on /events. `kind` picks the layout; `stream` separates dated events
 * from undated community work.
 *
 * There is deliberately no `eventDate` here. Only the year of an event is known
 * for most entries — the CMS holds 1 January where the day was never recorded —
 * so the mapper derives `year` and the stand-in day never reaches a surface that
 * could print it.
 */
export type GalleryEventView = {
  id: string;
  slug: string;
  title: string;
  kind: "photos" | "story" | "video";
  stream: "event" | "community";
  /** Four-digit year. Null for community work, which shows "CSR" instead. */
  year: string | null;
  /** Story card photo, or a video poster override. Photos rows have none. */
  coverImage?: ContentImageValue | null;
  /** The lightbox reel. Routinely empty while photography is outstanding. */
  photos: ContentImageValue[];
  /** Stories only — the lines shown on the card before "Read more". */
  excerpt?: string | null;
  /** Stories only — the full write-up the modal renders. */
  body: PortableTextBlock[];
  /** Videos only — overrides the title in the poster's caption bar. */
  caption?: string | null;
  /** Videos only. Absent until whoever holds the footage has uploaded it. */
  muxPlaybackId?: string | null;
  /** Seconds into the film for the Mux-generated poster frame. */
  posterTime: number;
};

export type { PortableTextBlock };
