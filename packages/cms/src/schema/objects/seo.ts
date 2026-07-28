import { defineField, defineType } from 'sanity'

/**
 * Reusable SEO object. Every field is optional — routes fall back to
 * document-derived metadata (title/excerpt/cover) when these are unset. The
 * `noIndex` escape hatch lets an editor keep a page reachable but out of the
 * index (e.g. thin or superseded content).
 */
export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      validation: (rule) => rule.max(70).warning('Keep under ~70 characters.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      validation: (rule) =>
        rule.max(160).warning('Keep under ~160 characters.'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL override',
      description: 'Only set to point at a different canonical source.',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['https'] }).warning('Use an absolute https URL.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
