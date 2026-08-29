import { defineField, defineType } from 'sanity'

/**
 * One of Ghana's administrative regions — "Greater Accra", "Upper West", and so
 * on. This is what the public station directory groups and filters by, because
 * it is the geography customers actually know.
 *
 * Distinct from `stationTerritory`, which is PETROSOL's internal sales grouping
 * and never reaches the website.
 *
 * A closed, official set of sixteen. It is still a document type rather than a
 * fixed list for two reasons: the dropdown's order is editorial (see `order`),
 * and the set is not truly immutable — Ghana went from ten regions to sixteen
 * in 2018. Adding or renaming one should be an edit, not a deploy.
 */
export const stationRegionType = defineType({
  name: 'stationRegion',
  title: 'Station region',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Shown in the region dropdown, e.g. “Greater Accra”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Identifies the region in the directory’s filter state. Not a URL.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first in the dropdown, and the first one is what ' +
        'the page opens on — which is why Greater Accra sits at 0 and the rest ' +
        'follow alphabetically. Numbered in tens so a new region can be slotted ' +
        'in without renumbering its neighbours.',
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
