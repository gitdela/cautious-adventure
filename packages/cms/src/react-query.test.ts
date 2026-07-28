import { describe, expect, it } from 'vitest'

import {
  cmsQueryKeys,
  legalCurrentQueryOptions,
  postListQueryOptions,
  postQueryOptions,
} from './react-query'

describe('cmsQueryKeys', () => {
  it('are hierarchical so a surface can be invalidated by prefix', () => {
    expect(cmsQueryKeys.all).toEqual(['cms'])
    expect(cmsQueryKeys.posts()).toEqual(['cms', 'posts'])
    expect(cmsQueryKeys.post('drilling-basics')).toEqual([
      'cms',
      'posts',
      'detail',
      'drilling-basics',
    ])
    expect(cmsQueryKeys.postList({ start: 0, end: 10 })).toEqual([
      'cms',
      'posts',
      'list',
      { start: 0, end: 10 },
    ])
  })

  it('separates surfaces under distinct prefixes', () => {
    expect(cmsQueryKeys.legal()[1]).toBe('legal')
    expect(cmsQueryKeys.legalCurrent('privacy')).toEqual([
      'cms',
      'legal',
      'current',
      'privacy',
    ])
  })
})

describe('query options factories', () => {
  it('wire the matching query key and sane defaults', () => {
    const opts = postListQueryOptions({ start: 0, end: 5 })
    expect(opts.queryKey).toEqual(cmsQueryKeys.postList({ start: 0, end: 5 }))
    expect(opts.staleTime).toBe(1000 * 60 * 5)
    expect(opts.retry).toBe(2)
    expect(opts.refetchOnReconnect).toBe(true)
    expect(opts.refetchOnWindowFocus).toBe(true)

    expect(postQueryOptions('x').queryKey).toEqual(cmsQueryKeys.post('x'))
    expect(legalCurrentQueryOptions('terms').queryKey).toEqual(
      cmsQueryKeys.legalCurrent('terms'),
    )
  })
})
