import "server-only";

import {
  featuredPostsQuery,
  legalByKindAndVersionQuery,
  legalCurrentByKindQuery,
  legalKindVersionsQuery,
  pageBySlugQuery,
  pageSlugsQuery,
  postBySlugQuery,
  pumpPricesQuery,
  postCountQuery,
  postListQuery,
  postSlugsQuery,
  teamMemberBySlugQuery,
  teamMemberSlugsQuery,
  teamMembersByGroupQuery,
} from "@workspace/cms/queries";
import type {
  FeaturedPostsQueryResult,
  LegalByKindAndVersionQueryResult,
  LegalCurrentByKindQueryResult,
  LegalKindVersionsQueryResult,
  PageBySlugQueryResult,
  PageSlugsQueryResult,
  PostBySlugQueryResult,
  PostCountQueryResult,
  PostListQueryResult,
  PostSlugsQueryResult,
  PumpPricesQueryResult,
  TeamMemberBySlugQueryResult,
  TeamMemberSlugsQueryResult,
  TeamMembersByGroupQueryResult,
} from "@workspace/cms/types";

import {
  toBlogFull,
  toBlogSummary,
  toCompanyPage,
  toLegalView,
  toPumpPriceBoard,
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
 * Full post list for the /news listing, which filters/paginates client-side.
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
