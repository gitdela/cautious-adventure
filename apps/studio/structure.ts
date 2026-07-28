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

      S.documentTypeListItem('page').title('Company pages'),

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
