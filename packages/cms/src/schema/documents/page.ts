import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Constrained company/marketing page (About and simple company pages) built
 * from an allowlisted set of sections — not an unrestricted page builder and
 * not free prose. Navigation, routes, pricing, and regulatory/product-capability
 * flags remain code-owned and are never sourced from here.
 */
export const pageType = defineType({
  name: 'page',
  title: 'Company page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'heroSection',
          title: 'Hero',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'subheading', type: 'text', rows: 2 }),
          ],
        }),
        defineArrayMember({
          name: 'richTextSection',
          title: 'Rich text',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'body', type: 'blockContent', validation: (r) => r.required() }),
          ],
        }),
        defineArrayMember({
          name: 'imageTextSection',
          title: 'Image / text split',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 4 }),
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', type: 'string', validation: (r) => r.required() }),
              ],
            }),
            defineField({
              name: 'imagePosition',
              type: 'string',
              options: { list: ['left', 'right'], layout: 'radio' },
              initialValue: 'right',
            }),
          ],
        }),
        defineArrayMember({
          name: 'valuesSection',
          title: 'Values / cards',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({
              name: 'items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
                    defineField({ name: 'description', type: 'text', rows: 2 }),
                  ],
                }),
              ],
              validation: (rule) => rule.min(1),
            }),
          ],
        }),
        defineArrayMember({
          name: 'teamSection',
          title: 'Team',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({
              name: 'members',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', to: [{ type: 'author' }] })],
            }),
          ],
        }),
        defineArrayMember({
          name: 'ctaSection',
          title: 'CTA',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
})
