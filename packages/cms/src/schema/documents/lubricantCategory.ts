import { defineField, defineType } from 'sanity'

/**
 * A filter group on the lubricants catalogue — "Engine oils", "Gear &
 * transmission", and so on.
 *
 * Its own document type rather than the blog `category`: the two taxonomies
 * share nothing but a shape, and reusing one would put lubricant groups in the
 * blog category picker. A document type rather than a hardcoded string list so
 * adding a line (greases, marine) is an edit, not a deploy.
 */
export const lubricantCategoryType = defineType({
  name: 'lubricantCategory',
  title: 'Lubricant category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown on the filter chip and above each product name.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Identifies the category in the page’s filter state. Changing it is safe — the catalogue reads it fresh on every request.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first. Sanity has no inherent ordering, so this is what the filter chips sort by.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Description (optional)',
      type: 'text',
      rows: 2,
      description: 'Internal note for editors. The catalogue does not render it.',
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
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
