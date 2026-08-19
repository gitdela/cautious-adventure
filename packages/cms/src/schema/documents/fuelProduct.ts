import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * One fuel on the /fuel page — Petrol, Diesel — rendered as a two-column
 * feature block: headline and prose on one side, photograph on the other.
 *
 * Deliberately not modelled like `lubricantProduct`: fuels carry no grade,
 * standard or pack data, on our page or on petrosol.com.gh. What they carry is
 * a short editorial section, so that is exactly what this type holds.
 *
 * Pump prices are NOT here. They live in the `pumpPrices` singleton, which both
 * the home hero and the fuel page's price band read — one number, one place.
 */
export const fuelProductType = defineType({
  name: 'fuelProduct',
  title: 'Fuel product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'Short name for this fuel, e.g. “Petrol”. Used to find the document in Studio — the page itself shows the eyebrow and headline below.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Stable identifier. Not a URL — fuels are sections on /fuel, not pages of their own.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description:
        'Small label above the headline, e.g. “Gasoline / Premium” or “Gasoil / Automotive Gasoil”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Headline',
      type: 'string',
      description:
        'The headline’s opening words, e.g. “Petrol that arrives as clean as it”. The highlighted phrase below finishes the sentence.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'highlight',
      title: 'Highlighted phrase',
      type: 'string',
      description:
        'The end of the headline, drawn in the brand script — e.g. “left the depot”. Keep it to a few words; it is a flourish, not a sentence.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      description:
        'One entry per paragraph. Three reads best at this width.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      // Hotspot matters here: the section crops to a wide tile, so whoever
      // uploads decides what survives the crop.
      options: { hotspot: true },
      validation: (rule) => rule.required(),
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
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first. It also decides the layout: even positions put the photo on the right, odd on the left, so reordering alternates the sections automatically.',
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
    select: { title: 'name', subtitle: 'eyebrow', media: 'image' },
  },
})
