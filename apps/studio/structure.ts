import type { StructureResolver } from 'sanity/structure'

/**
 * Custom desk structure. Groups content by surface, and — critically — splits
 * legal documents into current / in-review / archive by `approvalState` rather
 * than showing one flat list, because legal versions are a history, not a
 * singleton. Everything is listed explicitly so no document type leaks into an
 * ungoverned top-level list.
 */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('author').title('Authors'),
              S.documentTypeListItem('category').title('Categories'),
            ]),
        ),

      // The other half of Media, alongside the blog. Defaults to display order
      // because /events renders the list in exactly that sequence.
      S.listItem()
        .title('Events')
        .child(
          S.documentTypeList('galleryEvent')
            .title('Events')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),

      S.documentTypeListItem('page').title('Company pages'),

      // Fuel sections and the price board sit together: they are the two halves
      // of the /fuel page, and the board also drives the home hero.
      S.listItem()
        .title('Fuel')
        .child(
          S.list()
            .title('Fuel')
            .items([
              S.documentTypeListItem('fuelProduct').title('Products'),
              // Singleton: one pinned document, edited in place.
              S.listItem()
                .title('Pump prices')
                .child(
                  S.document()
                    .schemaType('pumpPrices')
                    .documentId('pumpPrices')
                    .title('Pump prices'),
                ),
            ]),
        ),

      S.listItem()
        .title('Lubricants')
        .child(
          S.list()
            .title('Lubricants')
            .items([
              S.documentTypeListItem('lubricantProduct').title('Products'),
              S.documentTypeListItem('lubricantCategory').title('Categories'),
            ]),
        ),

      S.listItem()
        .title('Stations')
        .child(
          S.list()
            .title('Stations')
            .items([
              S.documentTypeListItem('station').title('Stations'),
              S.documentTypeListItem('stationRegion').title('Regions'),
              S.documentTypeListItem('stationTerritory').title('Territories'),
            ]),
        ),

      // Two views over one document type. A person can sit in both groups (the
      // CEO does), so these are filtered lists rather than separate types —
      // editing them here edits the same record.
      S.listItem()
        .title('Team')
        .child(
          S.list()
            .title('Team')
            .items([
              S.listItem()
                .title('Leadership')
                .child(
                  S.documentList()
                    .title('Leadership')
                    .filter('_type == "teamMember" && "leadership" in groups')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Board of Directors')
                .child(
                  S.documentList()
                    .title('Board of Directors')
                    .filter('_type == "teamMember" && "board" in groups')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                ),
              S.documentTypeListItem('nationalLeadershipProfile').title(
                'Industry & National Leadership',
              ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Legal')
        .child(
          S.list()
            .title('Legal documents')
            .items([
              S.listItem()
                .title('Current (approved)')
                .child(
                  S.documentList()
                    .title('Current legal versions')
                    .filter(
                      '_type == "legalDocument" && approvalState == "approved"',
                    )
                    .defaultOrdering([
                      { field: 'documentKind', direction: 'asc' },
                    ]),
                ),
              S.listItem()
                .title('Draft / in review')
                .child(
                  S.documentList()
                    .title('Draft & in-review')
                    .filter(
                      '_type == "legalDocument" && approvalState in ["draft", "legal-review"]',
                    )
                    .defaultOrdering([
                      { field: 'documentKind', direction: 'asc' },
                    ]),
                ),
              S.listItem()
                .title('Archive (superseded)')
                .child(
                  S.documentList()
                    .title('Superseded versions')
                    .filter(
                      '_type == "legalDocument" && approvalState == "superseded"',
                    )
                    .defaultOrdering([
                      { field: 'effectiveAt', direction: 'desc' },
                    ]),
                ),
            ]),
        ),
    ])
