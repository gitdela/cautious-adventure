import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * One product in the lubricants catalogue.
 *
 * The field set mirrors what the card and its spec dialog actually render —
 * grade and standard as badges, applications as "Suitable for", benefits as the
 * bullet list — so there is no field here the page ignores, and nothing the page
 * shows that an editor cannot change.
 *
 * Technical data sheets stay off this type on purpose: the page tells visitors
 * they are available on request, and no PDFs exist in the CMS to link.
 */
export const lubricantProductType = defineType({
  name: 'lubricantProduct',
  title: 'Lubricant product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Product name as printed on the pack, e.g. “Platinum Plus 5w30 FE”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Stable identifier for this product. Not a URL today — the catalogue opens products in a dialog — but it keys the grid and is what a future product page would use.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'lubricantCategory' }],
      description: 'Which filter group this product appears under.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first in the grid, across all categories and within a filtered view.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Feature on the home page',
      type: 'boolean',
      description:
        'The home page products band shows four featured products. Flag four with pack shots — if none are flagged it falls back to the first four that have one.',
      initialValue: false,
    }),
    defineField({
      name: 'grade',
      title: 'Grade',
      type: 'string',
      description:
        'Viscosity grade and base type, rendered as the primary badge — e.g. “SAE 5W-30 · pure synthetic”. The site title-cases the descriptive words for you, so “pure synthetic” and “Pure Synthetic” display identically; specification codes like 4T and 0W-20 are left exactly as typed.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'standard',
      title: 'Standard',
      type: 'string',
      description:
        'OEM/industry specifications, rendered as the secondary badge — e.g. “API SN-Plus/CF · ACEA C2/C3”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'applications',
      title: 'Suitable for',
      type: 'text',
      rows: 3,
      description: 'The engines, vehicles or conditions this blend is made for.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'drainInterval',
      title: 'Drain interval (optional)',
      type: 'string',
      description:
        'e.g. “Up to 10,000 km”. Leave empty and the spec sheet simply omits the row.',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Bullet list on the spec sheet. Four reads best.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Pack shot (optional)',
      type: 'image',
      // Hotspot so every crop keeps the bottle centred regardless of the source
      // framing — the card tile and the dialog thumbnail use different ratios.
      options: { hotspot: true },
      description:
        'Photo of the pack. Without one the card shows a placeholder, which is fine while photography is outstanding.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          // Required only once an asset is chosen, so an empty image field stays
          // valid — same rule as `teamMember.coverPhoto`.
          validation: (rule) =>
            rule.custom((alt, context) =>
              (context.parent as { asset?: unknown } | undefined)?.asset && !alt
                ? 'Alt text is required when a pack shot is set'
                : true,
            ),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'grade', media: 'image' },
  },
})
