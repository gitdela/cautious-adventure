import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BlogCard } from './components/blog-card'
import { BlogListing } from './components/blog-listing'
import { samplePosts, testAdapters } from './__fixtures__'

describe('BlogListing', () => {
  it('renders every post title with links built from basePath', () => {
    render(
      <BlogListing
        posts={samplePosts}
        basePath="/blog"
        adapters={testAdapters}
        featured={false}
      />,
    )
    for (const post of samplePosts) {
      const link = screen.getByText(post.title).closest('a')!
      expect(link).toHaveAttribute('href', `/blog/${post.slug}`)
    }
  })

  it('shows an empty state when there are no posts', () => {
    render(<BlogListing posts={[]} basePath="/blog" adapters={testAdapters} />)
    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument()
  })
})

describe('BlogCard', () => {
  it('renders title, excerpt, and author byline through the Link adapter', () => {
    const post = samplePosts[0]
    render(
      <BlogCard post={post} href={`/blog/${post.slug}`} adapters={testAdapters} />,
    )
    const link = screen.getByText(post.title).closest('a')!
    expect(link).toHaveAttribute('href', `/blog/${post.slug}`)
    expect(link).toHaveAttribute('data-adapter', 'link')
    expect(screen.getByText(post.excerpt)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(post.author!.name))).toBeInTheDocument()
  })
})
