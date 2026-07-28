import "server-only";

import {
  legalByKindAndVersionQuery,
  legalCurrentByKindQuery,
  legalKindVersionsQuery,
  pageBySlugQuery,
  pageSlugsQuery,
  postBySlugQuery,
  postCountQuery,
  postListQuery,
  postSlugsQuery,
} from "@workspace/cms/queries";
import type {
  LegalByKindAndVersionQueryResult,
  LegalCurrentByKindQueryResult,
  LegalKindVersionsQueryResult,
  PageBySlugQueryResult,
  PageSlugsQueryResult,
  PostBySlugQueryResult,
  PostCountQueryResult,
  PostListQueryResult,
  PostSlugsQueryResult,
} from "@workspace/cms/types";

import {
  toBlogFull,
  toBlogSummary,
  toCompanyPage,
  toLegalView,
} from "@workspace/content/mappers";

import { sanityFetch, sanityFetchPublished } from "./fetch";
import { cacheTags } from "./tags";

export const BLOG_PAGE_SIZE = 12;

// --- Blog ---
export async function getBlogPosts(page = 1) {
  const start = Math.max(0, (page - 1) * BLOG_PAGE_SIZE);
  const end = start + BLOG_PAGE_SIZE;
  const result = await sanityFetch<PostListQueryResult>({
    query: postListQuery,
    params: { start, end },
    tags: [cacheTags.postList(), cacheTags.type("post")],
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

export async function getBlogPost(slug: string) {
  const result = await sanityFetch<PostBySlugQueryResult>({
    query: postBySlugQuery,
    params: { slug },
    tags: [cacheTags.postSlug(slug), cacheTags.type("post")],
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
