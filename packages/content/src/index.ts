// Public surface of @workspace/content — framework-neutral presentation.
export * from './adapters'
export * from './types'
export { formatDate, formatReadTime } from './format'

export { PortableContent, buildPortableComponents } from './portable-content'
export type { PortableContentProps } from './portable-content'

export { ContentLoading, ContentEmpty, ContentError } from './states'

export { CoverImage } from './components/cover-image'
export { BlogCard } from './components/blog-card'
export { BlogListing } from './components/blog-listing'
export { FeaturedPost } from './components/featured-post'
export { BlogPostView, pickRelated } from './components/blog-post-view'
export { BlogPostAside, type TocHeading } from './components/blog-post-aside'
export { FaqSection } from './components/faq-section'
export { LegalDocumentPage } from './components/legal-document-page'
export { CompanyPage } from './components/company-page'
export type { CompanyPageSection } from './components/company-page'
