import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Singleton: the "At the pump today" board on the home hero. One document
 * (fixed `_id: 'pumpPrices'`, pinned in the desk structure) holding the
 * per-litre GHS price for each fuel. The website shows `_updatedAt` as the
 * "today" date, so republishing with fresh prices is the whole workflow.
 */
export const pumpPricesType = defineType({
  name: 'pumpPrices',
  title: 'Pump prices',
  type: 'document',
  fields: [
    defineField({
      name: 'prices',
      title: 'Prices at the pump',
      description:
        'Shown on the home hero. Price is GHS per litre. The board fits up to four fuels.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fuelPrice',
          title: 'Fuel price',
          fields: [
            defineField({
              name: 'fuel',
              title: 'Fuel',
              type: 'string',
              description: 'Label on the board, e.g. Petrol, Diesel, Premium.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price (GHS / litre)',
              type: 'number',
              validation: (rule) => rule.required().positive().precision(2),
            }),
          ],
          preview: {
            select: { fuel: 'fuel', price: 'price' },
            prepare: ({ fuel, price }) => ({
              title: fuel ?? 'Fuel',
              subtitle:
                typeof price === 'number' ? `₵${price.toFixed(2)} / litre` : '—',
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Pump prices' }),
  },
})
