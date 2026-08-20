import { defineField, defineType } from 'sanity'

/**
 * A named person on the Leadership or Board of Directors page.
 *
 * One type covers both groups because they are structurally identical — the
 * `group` field decides which page a member appears on. Splitting them into two
 * document types would duplicate every field for no editorial gain.
 *
 * Distinct from `author`, which models blog bylines. A person could plausibly
 * be both; conflating them would tie a board listing to blog authorship.
 */
export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used for this person’s profile page URL.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Job title as it should appear on the card.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'groups',
      title: 'Appears on',
      type: 'array',
      // An array, not a single value: the CEO sits on the Leadership page and
      // the Board page both. One document per person keeps a single profile
      // page and a single photo to maintain.
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Leadership', value: 'leadership' },
          { title: 'Board of Directors', value: 'board' },
        ],
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first within the group. Sanity has no inherent ordering, so this is what the page sorts by.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the Leadership page',
      type: 'boolean',
      description:
        'The featured member gets the large block at the top of /leadership, with their short bio beside the photo. Intended for the CEO — set it on one person only.',
      initialValue: false,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      // Hotspot is the point of moving these into the CMS: whoever uploads
      // marks the face, and every crop at every size respects it.
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'coverPhoto',
      title: 'Second photo (optional)',
      type: 'image',
      options: { hotspot: true },
      description:
        'An optional additional shot for this person’s profile page — a wider or candid image to sit alongside the headshot. Leave empty and the profile simply uses the headshot.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          // Required only when a photo is actually chosen, so leaving the whole
          // field empty stays valid.
          validation: (rule) =>
            rule.custom((alt, context) =>
              (context.parent as { asset?: unknown } | undefined)?.asset && !alt
                ? 'Alt text is required when a second photo is set'
                : true,
            ),
        }),
      ],
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio (preview)',
      type: 'text',
      rows: 6,
      description:
        'Preview shown beside the featured member on /leadership — currently the opening paragraphs of their full bio. Separate paragraphs with a blank line. The full bio lives below.',
      // Roomy enough for the three-paragraph preview the leadership page shows,
      // while still refusing a whole biography pasted into the wrong field.
      validation: (rule) => rule.max(1200),
    }),
    defineField({
      name: 'quote',
      title: 'Pull quote (optional)',
      type: 'text',
      rows: 3,
      description:
        'A short quotation rendered as a highlighted block on the profile page. Used sparingly — currently the Board Chairman only.',
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'bio',
      title: 'Full bio',
      // Portable Text, not a string: this is multi-paragraph prose that may
      // carry links, and it renders through PortableContent on the profile page.
      type: 'blockContent',
      description: 'The long bio shown on this person’s own profile page.',
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
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
