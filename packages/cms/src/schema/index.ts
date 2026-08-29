import type { SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './objects/blockContent'
import { seoType } from './objects/seo'
import { authorType } from './documents/author'
import { categoryType } from './documents/category'
import { postType } from './documents/post'
import { pageType } from './documents/page'
import { legalDocumentType } from './documents/legalDocument'
import { pumpPricesType } from './documents/pumpPrices'
import { teamMemberType } from './documents/teamMember'
import { lubricantCategoryType } from './documents/lubricantCategory'
import { lubricantProductType } from './documents/lubricantProduct'
import { fuelProductType } from './documents/fuelProduct'
import { stationRegionType } from './documents/stationRegion'
import { stationTerritoryType } from './documents/stationTerritory'
import { stationType } from './documents/station'
import { galleryEventType } from './documents/galleryEvent'
import { nationalLeadershipProfileType } from './documents/nationalLeadershipProfile'

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
  pumpPricesType,
  teamMemberType,
  lubricantCategoryType,
  lubricantProductType,
  fuelProductType,
  stationRegionType,
  stationTerritoryType,
  stationType,
  galleryEventType,
  nationalLeadershipProfileType,
]

export {
  seoType,
  blockContentType,
  authorType,
  categoryType,
  postType,
  pageType,
  legalDocumentType,
  pumpPricesType,
  teamMemberType,
  lubricantCategoryType,
  lubricantProductType,
  fuelProductType,
  stationRegionType,
  stationTerritoryType,
  stationType,
  galleryEventType,
  nationalLeadershipProfileType,
}
