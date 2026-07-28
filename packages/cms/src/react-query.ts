import { queryOptions } from '@tanstack/react-query'

import {
  fetchCurrentLegalDocument,
  fetchPostBySlug,
  fetchPostList,
  type PostListParams,
} from './queries'

/**
 * React Query bindings for CMS reads — the only file in this package that
 * imports TanStack Query (a peer dep). Uses the tokenless published client via
 * the framework-neutral fetch functions. Sanity webhooks revalidate Next.js
 * only; in a long-lived SPA tab (the future webapp), React Query freshness
 * (staleTime + refetch on focus/reconnect) is what eventually surfaces new
 * publications.
 */

// Stable, hierarchical query keys. Invalidate a whole surface via a prefix.
export const cmsQueryKeys = {
  all: ['cms'] as const,
  posts: () => [...cmsQueryKeys.all, 'posts'] as const,
  postList: (params: PostListParams) =>
    [...cmsQueryKeys.posts(), 'list', params] as const,
  post: (slug: string) => [...cmsQueryKeys.posts(), 'detail', slug] as const,
  legal: () => [...cmsQueryKeys.all, 'legal'] as const,
  legalCurrent: (kind: string) =>
    [...cmsQueryKeys.legal(), 'current', kind] as const,
} as const

// Published content changes rarely and the CDN already fronts it, so a 5-minute
// stale window is generous; focus/reconnect refetch closes the gap for a tab
// left open across a publish.
const CMS_STALE_TIME = 1000 * 60 * 5
const CMS_RETRY = 2

const shared = {
  staleTime: CMS_STALE_TIME,
  retry: CMS_RETRY,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const

export function postListQueryOptions(params: PostListParams) {
  return queryOptions({
    queryKey: cmsQueryKeys.postList(params),
    queryFn: () => fetchPostList(params),
    ...shared,
  })
}

export function postQueryOptions(slug: string) {
  return queryOptions({
    queryKey: cmsQueryKeys.post(slug),
    queryFn: () => fetchPostBySlug(slug),
    ...shared,
  })
}

export function legalCurrentQueryOptions(kind: string) {
  return queryOptions({
    queryKey: cmsQueryKeys.legalCurrent(kind),
    queryFn: () => fetchCurrentLegalDocument(kind),
    ...shared,
  })
}
