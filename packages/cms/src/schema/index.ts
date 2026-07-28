import type { SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './objects/blockContent'
import { seoType } from './objects/seo'
import { authorType } from './documents/author'
import { categoryType } from './documents/category'
import { postType } from './documents/post'
import { pageType } from './documents/page'
import { legalDocumentType } from './documents/legalDocument'

/**
 * The single schema registry. Imported by Studio (`sanity.config.ts`) and by
 * the TypeGen pipeline. Objects first, then documents.
 *
 * Deliberately minimal: only the document types the website renders today.
 * New surfaces (learn articles, FAQs, help categories, …) add their types here
 * when their routes exist — never speculatively.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  seoType,
  blockContentType,
  // documents
  authorType,
  categoryType,
  postType,
  pageType,
  legalDocumentType,
]

export {
  seoType,
  blockContentType,
  authorType,
  categoryType,
  postType,
  pageType,
  legalDocumentType,
}
