import "server-only";

import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";

import { getPublishedClient } from "@workspace/cms/browser";
import { getDraftClient } from "@workspace/cms/server";

import { ensureSanityConfigured } from "./config";

/**
 * App-local cached Sanity fetch (the "caching without Cache Components" model).
 *
 * Published requests are cached with `unstable_cache`, keyed by query+params and
 * tagged for on-demand `revalidateTag` invalidation, with a `revalidate` TTL as
 * a safety net if a webhook is ever missed. Draft Mode requests bypass the cache
 * and read via the server-only token client. Reading `draftMode()` only forces
 * dynamic rendering when the draft cookie is set, so ordinary visitors keep
 * static/ISR pages.
 */
export type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
  /** TTL safety-net in seconds. Freshness normally comes from revalidateTag. */
  revalidate?: number;
};

const DEFAULT_REVALIDATE = 3600;

function fetchPublishedCached<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[],
  revalidate: number,
): Promise<T> {
  ensureSanityConfigured();
  const run = unstable_cache(
    () => getPublishedClient().fetch<T>(query, params),
    ["sanity", query, JSON.stringify(params)],
    { tags, revalidate },
  );
  return run();
}

/**
 * Draft-aware fetch for page/metadata rendering. Do NOT use in
 * `generateStaticParams`, `sitemap`, or `robots` — those run without a request
 * scope where `draftMode()` is unavailable; use `sanityFetchPublished` there.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  revalidate = DEFAULT_REVALIDATE,
}: SanityFetchOptions): Promise<T> {
  ensureSanityConfigured();

  const { isEnabled: isDraft } = await draftMode();
  if (isDraft) {
    const token = process.env.SANITY_API_READ_TOKEN;
    if (!token) {
      throw new Error(
        "[website] Draft Mode is enabled but SANITY_API_READ_TOKEN is not set.",
      );
    }
    return getDraftClient({ token }).fetch<T>(query, params);
  }

  return fetchPublishedCached(query, params, tags, revalidate);
}

/** Published-only cached fetch — safe in build-time / no-request contexts. */
export async function sanityFetchPublished<T>({
  query,
  params = {},
  tags,
  revalidate = DEFAULT_REVALIDATE,
}: SanityFetchOptions): Promise<T> {
  return fetchPublishedCached(query, params, tags, revalidate);
}
