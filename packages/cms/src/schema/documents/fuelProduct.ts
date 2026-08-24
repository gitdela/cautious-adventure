import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * One named fuel in the unified /fuels showcase — Petrol or Diesel. Shared
 * page copy lives in the website; these documents own labels and photography.
 *
 * Deliberately not modelled like `lubricantProduct`: fuels carry no grade,
 * standard or pack data, on our page or on petrosol.com.gh. What they carry is
 * a compact visual identity rather than a separate editorial narrative.
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
        'Short name for this fuel, e.g. “Petrol”. Shown beneath its photo in the unified fuels showcase.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Stable identifier. Not a URL — fuels are tiles on /fuels, not pages of their own.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description:
        'Small product-family label below the photo, e.g. “Gasoline / Premium” or “Gasoil / Automotive Gasoil”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Legacy headline',
      type: 'string',
      description:
        'Retained for compatibility with existing records. The unified fuels page no longer renders this field.',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'highlight',
      title: 'Legacy highlighted phrase',
      type: 'string',
      description:
        'Retained for compatibility with existing records. The unified fuels page no longer renders this field.',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'body',
      title: 'Legacy body',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      description:
        'Retained for compatibility with existing records. Shared fuels-page copy now lives in the website.',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      // Hotspot matters here: the showcase crops to a portrait tile, so whoever
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
        'Lower numbers appear first in the unified product-photo mosaic.',
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
