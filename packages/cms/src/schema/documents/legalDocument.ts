import { defineField, defineType } from 'sanity'

/**
 * Versioned legal record — Privacy, Terms, Cookies, Disclosures, Referral
 * terms, etc. NOT a mutable page singleton.
 *
 * Publishing a new version creates a NEW document and marks the prior one
 * `superseded` (via `supersedes`); editors never overwrite the previously
 * effective record. Each approved version stays addressable at a stable
 * per-version URL for acceptance audit. Approval state gates who may publish:
 * only the legal/compliance role moves a document to `approved`.
 */
export const documentKinds = [
  { title: 'Privacy Policy', value: 'privacy' },
  { title: 'Terms of Service', value: 'terms' },
  { title: 'Cookie Policy', value: 'cookies' },
] as const

export const legalDocumentType = defineType({
  name: 'legalDocument',
  title: 'Legal document',
  type: 'document',
  fields: [
    defineField({
      name: 'documentKind',
      title: 'Document kind',
      type: 'string',
      options: { list: [...documentKinds] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      description: 'Immutable semantic version, e.g. "2026-07" or "1.3". Never reused.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Canonical slug',
      description: 'Stable per-kind slug, e.g. "privacy".',
      type: 'slug',
      options: { source: 'documentKind', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'effectiveAt',
      title: 'Effective at',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'approvalState',
      title: 'Approval state',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Legal review', value: 'legal-review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Superseded', value: 'superseded' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'approver',
      title: 'Approver',
      description: 'Identity or reference of the legal/compliance approver.',
      type: 'string',
    }),
    defineField({
      name: 'approvedAt',
      title: 'Approved at',
      type: 'datetime',
    }),
    defineField({
      name: 'supersedes',
      title: 'Supersedes',
      description: 'The prior approved version this one replaces.',
      type: 'reference',
      to: [{ type: 'legalDocument' }],
    }),
    defineField({
      name: 'jurisdiction',
      title: 'Jurisdiction',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', kind: 'documentKind', version: 'version', state: 'approvalState' },
    prepare({ title, kind, version, state }) {
      return {
        title: title ?? kind,
        subtitle: `${kind} · v${version ?? '?'} · ${state ?? 'draft'}`,
      }
    },
  },
})
