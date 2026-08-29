import "server-only";

import {
  featuredPostsQuery,
  fuelProductsQuery,
  galleryEventsQuery,
  legalByKindAndVersionQuery,
  legalCurrentByKindQuery,
  legalKindVersionsQuery,
  lubricantCategoriesQuery,
  lubricantProductsQuery,
  nationalLeadershipProfilesQuery,
  pageBySlugQuery,
  pageSlugsQuery,
  postBySlugQuery,
  pumpPricesQuery,
  postCountQuery,
  postListQuery,
  postSlugsQuery,
  stationRegionsQuery,
  stationsQuery,
  teamMemberBySlugQuery,
  teamMemberSlugsQuery,
  teamMembersByGroupQuery,
} from "@workspace/cms/queries";
import type {
  FeaturedPostsQueryResult,
  FuelProductsQueryResult,
  GalleryEventsQueryResult,
  LegalByKindAndVersionQueryResult,
  LegalCurrentByKindQueryResult,
  LegalKindVersionsQueryResult,
  LubricantCategoriesQueryResult,
  LubricantProductsQueryResult,
  NationalLeadershipProfilesQueryResult,
  PageBySlugQueryResult,
  PageSlugsQueryResult,
  PostBySlugQueryResult,
  PostCountQueryResult,
  PostListQueryResult,
  PostSlugsQueryResult,
  PumpPricesQueryResult,
  StationRegionsQueryResult,
  StationsQueryResult,
  TeamMemberBySlugQueryResult,
  TeamMemberSlugsQueryResult,
  TeamMembersByGroupQueryResult,
} from "@workspace/cms/types";

import {
  toBlogFull,
  toBlogSummary,
  toCompanyPage,
  toFuelProduct,
  toGalleryEvent,
  toLegalView,
  toLubricantCategory,
  toLubricantProduct,
  toNationalLeadershipProfile,
  toPumpPriceBoard,
  toStation,
  toStationRegion,
  toTeamMemberFull,
  toTeamMemberSummary,
} from "@workspace/content/mappers";

import { sanityFetch, sanityFetchLive, sanityFetchPublished } from "./fetch";
import { cacheTags } from "./tags";

export const BLOG_PAGE_SIZE = 12;

// --- Blog ---
// Post reads are uncached by design (like pump prices): there is no
// revalidation webhook, so a publish must be visible on the next request.
// Slug/count reads keep the cached published path — they run in build-time
// contexts (sitemap) where the live fetch's request scope doesn't exist.
export async function getBlogPosts(page = 1) {
  const start = Math.max(0, (page - 1) * BLOG_PAGE_SIZE);
  const end = start + BLOG_PAGE_SIZE;
  const result = await sanityFetchLive<PostListQueryResult>({
    query: postListQuery,
    params: { start, end },
  });
  return (result ?? []).map(toBlogSummary);
}

export async function getBlogPostCount() {
  const count = await sanityFetchPublished<PostCountQueryResult>({
    query: postCountQuery,
    tags: [cacheTags.postList(), cacheTags.type("post")],
  });
  return count ?? 0;
}

/** Editor-curated home slots: posts with a featuredRank, best-ranked first. */
export async function getFeaturedPosts() {
  const result = await sanityFetchLive<FeaturedPostsQueryResult>({
    query: featuredPostsQuery,
  });
  return (result ?? []).map(toBlogSummary);
}

/**
 * Full post list for the /blog listing, which filters/paginates client-side.
 * Capped defensively; revisit server-side pagination well before 200 posts.
 */
export async function getAllPosts() {
  const result = await sanityFetchLive<PostListQueryResult>({
    query: postListQuery,
    params: { start: 0, end: 200 },
  });
  return (result ?? []).map(toBlogSummary);
}

export async function getBlogPost(slug: string) {
  const result = await sanityFetchLive<PostBySlugQueryResult>({
    query: postBySlugQuery,
    params: { slug },
  });
  return result ? toBlogFull(result) : null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const result = await sanityFetchPublished<PostSlugsQueryResult>({
    query: postSlugsQuery,
    tags: [cacheTags.postList(), cacheTags.type("post")],
  });
  return (result ?? [])
    .map((r) => r.slug)
    .filter((s): s is string => typeof s === "string" && s.length > 0);
}

// --- Legal ---
export async function getCurrentLegal(kind: string) {
  const result = await sanityFetch<LegalCurrentByKindQueryResult>({
    query: legalCurrentByKindQuery,
    params: { kind },
    tags: [cacheTags.legal(kind), cacheTags.type("legalDocument")],
  });
  return result ? toLegalView(result) : null;
}

export async function getLegalVersion(kind: string, version: string) {
  const result = await sanityFetch<LegalByKindAndVersionQueryResult>({
    query: legalByKindAndVersionQuery,
    params: { kind, version },
    tags: [cacheTags.legal(kind), cacheTags.type("legalDocument")],
  });
  return result ? toLegalView(result) : null;
}

export async function getLegalVersions(kind: string) {
  const result = await sanityFetchPublished<LegalKindVersionsQueryResult>({
    query: legalKindVersionsQuery,
    params: { kind },
    tags: [cacheTags.legal(kind), cacheTags.type("legalDocument")],
  });
  return (result ?? [])
    .map((v) => v.version)
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

// --- Pump prices (home hero board) ---
// Uncached by design: prices must reflect a Studio publish on the next request,
// and there is no revalidation webhook to purge a cached entry.
export async function getPumpPrices() {
  const result = await sanityFetchLive<PumpPricesQueryResult>({
    query: pumpPricesQuery,
  });
  return result ? toPumpPriceBoard(result) : null;
}

// --- Company page ---
export async function getCompanyPage(slug: string) {
  const result = await sanityFetch<PageBySlugQueryResult>({
    query: pageBySlugQuery,
    params: { slug },
    tags: [cacheTags.page(slug), cacheTags.type("page")],
  });
  return result ? toCompanyPage(result) : null;
}

export async function getPageSlugs(): Promise<string[]> {
  const result = await sanityFetchPublished<PageSlugsQueryResult>({
    query: pageSlugsQuery,
    tags: [cacheTags.type("page")],
  });
  return (result ?? [])
    .map((r) => r.slug)
    .filter((s): s is string => typeof s === "string" && s.length > 0);
}

// --- Team (Leadership / Board) ---
// Live reads, like posts and pump prices: there is no revalidation webhook in
// this repo, so a cached read would leave a corrected job title invisible until
// its TTL expired. These are two low-traffic pages, so the per-view cost is
// cheap in exchange for edits landing on the next request.
export type TeamGroup = "leadership" | "board";

export async function getTeamMembers(group: TeamGroup) {
  const result = await sanityFetchLive<TeamMembersByGroupQueryResult>({
    query: teamMembersByGroupQuery,
    params: { group },
  });
  return (result ?? []).map(toTeamMemberSummary);
}

export async function getTeamMember(slug: string) {
  const result = await sanityFetchLive<TeamMemberBySlugQueryResult>({
    query: teamMemberBySlugQuery,
    params: { slug },
  });
  return result ? toTeamMemberFull(result) : null;
}

/** For `generateStaticParams` on the profile route. */
export async function getTeamMemberSlugs(): Promise<string[]> {
  const result = await sanityFetchPublished<TeamMemberSlugsQueryResult>({
    query: teamMemberSlugsQuery,
    tags: [cacheTags.type("teamMember")],
  });
  return (result ?? []).filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
}

// --- Lubricants ---
// Live reads, for the same reason as the team pages: with no revalidation
// webhook, a corrected viscosity grade or a new pack shot has to be visible on
// the next request. One page reading two small document sets — the per-view
// cost is negligible.
export async function getLubricantCategories() {
  const result = await sanityFetchLive<LubricantCategoriesQueryResult>({
    query: lubricantCategoriesQuery,
  });
  return (result ?? []).map(toLubricantCategory);
}

export async function getLubricantProducts() {
  const result = await sanityFetchLive<LubricantProductsQueryResult>({
    query: lubricantProductsQuery,
  });
  return (result ?? []).map(toLubricantProduct);
}

// --- Stations ---
// Live, like the other product surfaces. A station changing hands or a manager's
// number changing is exactly the kind of edit that must not wait on a cache.
export async function getStationRegions() {
  const result = await sanityFetchLive<StationRegionsQueryResult>({
    query: stationRegionsQuery,
  });
  return (result ?? []).map(toStationRegion);
}

export async function getStations() {
  const result = await sanityFetchLive<StationsQueryResult>({
    query: stationsQuery,
  });
  return (result ?? []).map(toStation);
}

// --- Fuel ---
// Live, like the rest. The fuel page pairs these sections with `getPumpPrices`,
// which is already live — a cached read here would leave the two halves of the
// page disagreeing about how fresh they are.
export async function getFuelProducts() {
  const result = await sanityFetchLive<FuelProductsQueryResult>({
    query: fuelProductsQuery,
  });
  return (result ?? []).map(toFuelProduct);
}

// --- Gallery events ---
// Live, like every other content surface here. Photography for an event
// routinely lands days after the event record does, and with no revalidation
// webhook a cached read would leave a freshly uploaded reel invisible until its
// TTL expired. One page, one read of a dozen-odd documents.
export async function getGalleryEvents() {
  const result = await sanityFetchLive<GalleryEventsQueryResult>({
    query: galleryEventsQuery,
    params: { stream: null, series: null },
  });
  return (result ?? []).map(toGalleryEvent);
}

/** Community / CSR entries for the CSR page, in gallery order. */
export async function getCommunityGalleryEvents() {
  const result = await sanityFetchLive<GalleryEventsQueryResult>({
    query: galleryEventsQuery,
    params: { stream: "community", series: null },
  });
  return (result ?? []).map(toGalleryEvent);
}

/** PWN conferences, kept in the main Events gallery and reused here. */
export async function getPwnConferenceEvents() {
  const result = await sanityFetchLive<GalleryEventsQueryResult>({
    query: galleryEventsQuery,
    params: { stream: null, series: "pwn" },
  });
  return (result ?? [])
    .map(toGalleryEvent)
    .sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));
}

/** Industry conferences and summits shown on the national leadership page. */
export async function getIndustryLeadershipEvents() {
  const result = await sanityFetchLive<GalleryEventsQueryResult>({
    query: galleryEventsQuery,
    params: { stream: null, series: "industry-leadership" },
  });
  return (result ?? [])
    .slice()
    .sort((a, b) => (b.eventDate ?? "").localeCompare(a.eventDate ?? ""))
    .map(toGalleryEvent);
}

/** CMS-managed appointments held by PETROSOL people on external platforms. */
export async function getNationalLeadershipProfiles() {
  const result = await sanityFetchLive<NationalLeadershipProfilesQueryResult>({
    query: nationalLeadershipProfilesQuery,
  });
  return (result ?? []).map(toNationalLeadershipProfile);
}
