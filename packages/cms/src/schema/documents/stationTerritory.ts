import { defineField, defineType } from 'sanity'

/**
 * A sales territory grouping PETROSOL stations — "North East Territory",
 * "Western Territory", and so on. It is what the directory's dropdown filters
 * by.
 *
 * A document type rather than a fixed list because the network is still
 * expanding: adding or renaming a territory should be an edit, not a deploy.
 */
export const stationTerritoryType = defineType({
  name: 'stationTerritory',
  title: 'Station territory',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Shown in the territory dropdown, e.g. “Ashanti Territory”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Identifies the territory in the directory’s filter state. Not a URL.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first in the dropdown. The first one is what the page opens on.',
      validation: (rule) => rule.required().integer().min(0),
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
    select: { title: 'name', subtitle: 'slug.current' },
  },
})
