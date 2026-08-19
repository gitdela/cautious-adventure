import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * One PETROSOL forecourt in the station directory.
 *
 * The three load-bearing fields — name, manager, phone — are what the network
 * listing publishes for every site. Amenities are extra: they are known for
 * only a handful of stations today, so the field is optional and the directory
 * simply shows no service chips where nothing has been recorded. Better a blank
 * cell than an invented one.
 */
export const stationType = defineType({
  name: 'station',
  title: 'Station',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Station name as it should read in the directory.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Stable identifier. Not a URL — stations are rows in the directory, not pages.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'territory',
      title: 'Territory',
      type: 'reference',
      to: [{ type: 'stationTerritory' }],
      description: 'Which territory this station is listed under.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'manager',
      title: 'Manager',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phones',
      title: 'Phone numbers',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description:
        'One per line. Each renders as a tap-to-call link, so enter digits only.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'amenities',
      title: 'Services (optional)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Shop', value: 'shop' },
          { title: 'Washroom', value: 'washroom' },
          { title: 'FullCare', value: 'fullcare' },
        ],
      },
      description:
        'Leave empty where the facilities are not confirmed — the directory then shows no service chips for this station rather than guessing.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first within the territory.',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'byName',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'manager', territory: 'territory.name' },
    prepare: ({ title, subtitle, territory }) => ({
      title: title ?? 'Station',
      subtitle: [territory, subtitle].filter(Boolean).join(' · '),
    }),
  },
})
