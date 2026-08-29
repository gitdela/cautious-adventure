import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A PETROSOL person and their service on industry or national platforms.
 *
 * This is deliberately separate from teamMember: a staff member may have a
 * national appointment without appearing on either the leadership or board
 * page. The optional team-member reference reuses an existing portrait/profile
 * when one exists, while the editorial fields keep the page useful for any
 * employee or director.
 */
export const nationalLeadershipProfileType = defineType({
  name: 'nationalLeadershipProfile',
  title: 'Industry & national leadership profile',
  type: 'document',
  fields: [
    defineField({
      name: 'personName',
      title: 'Person name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'petrosolRole',
      title: 'PETROSOL role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'teamMember',
      title: 'Existing team profile (optional)',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      description:
        'Connects this profile to an existing leadership or board profile for its portrait and link.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo override (optional)',
      type: 'image',
      options: { hotspot: true },
      description:
        'Use this when the person does not have a team profile, or when this page needs a different portrait.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) =>
              (context.parent as { asset?: unknown } | undefined)?.asset && !alt
                ? 'Alt text is required when a photo is set'
                : true,
            ),
        }),
      ],
    }),
    defineField({
      name: 'appointments',
      title: 'Industry and national appointments',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'appointment',
          title: 'Appointment',
          type: 'object',
          fields: [
            defineField({
              name: 'institution',
              title: 'Institution / platform',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'position',
              title: 'Position / contribution',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                layout: 'radio',
                list: [
                  { title: 'Current', value: 'current' },
                  { title: 'Former', value: 'former' },
                ],
              },
              initialValue: 'current',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'tenure',
              title: 'Tenure / dates (optional)',
              type: 'string',
              description: 'For example, “2024–present” or “2016–2020”.',
            }),
            defineField({
              name: 'summary',
              title: 'Contribution summary',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(500),
            }),
            defineField({
              name: 'sourceUrl',
              title: 'Public source URL (optional)',
              type: 'url',
              description: 'Use a public institutional or published source when available.',
            }),
          ],
          preview: {
            select: { title: 'institution', subtitle: 'position' },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first on the page.',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: { title: 'personName', subtitle: 'petrosolRole', media: 'photo' },
  },
})
