import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * One row on /events — an awards night, a conference, a community programme.
 *
 * `kind` picks which of the three row layouts the event gets, and it is an
 * editorial choice rather than something derived from which fields are filled: a
 * story event also carries photos (its card has a “View photos” button), so
 * “has a photos array” cannot imply a photos row. Deriving it would mean adding
 * a write-up to an event silently reflowed the page from a four-tile grid into a
 * split card.
 *
 * `stream` separates dated events from community work, which has no date at all
 * and shows as “CSR” rather than a year.
 *
 * Only the YEAR of `eventDate` is ever published. The website derives its filter
 * pills from it and prints nothing finer, which is why the field can hold
 * 1 January where the exact day was never recorded.
 *
 * There is no page per event — everything opens in a modal — so the slug is a
 * stable identifier rather than a URL, the same way `station` and
 * `lubricantProduct` use theirs.
 *
 * Video lives in Mux, not here: `muxPlaybackId` is a plain string because the
 * Studio has no business owning a video upload pipeline, and the site already
 * plays Mux on the home page.
 */
export const galleryEventType = defineType({
  name: 'galleryEvent',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown as the row heading and the modal title.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Stable identifier for this event. Not a URL — events open in a modal, not on their own page — but it keys every row and is what a future deep link would use.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Row type',
      type: 'string',
      description:
        'Which layout this event gets. Photos: a strip of four tiles. Story: a photo beside a short write-up, with the full text behind “Read more”. Video: a full-width poster that plays the film.',
      // Radio rather than a dropdown: there are only three, and seeing all of
      // them at once is what makes the choice legible.
      options: {
        layout: 'radio',
        list: [
          { title: 'Photos', value: 'photos' },
          { title: 'Story', value: 'story' },
          { title: 'Video', value: 'video' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stream',
      title: 'Stream',
      type: 'string',
      description:
        'Community work is filed under the “Community” pill and shows “CSR” instead of a year. Everything else is a dated event.',
      options: {
        layout: 'radio',
        list: [
          { title: 'Event', value: 'event' },
          { title: 'Community / CSR', value: 'community' },
        ],
      },
      initialValue: 'event',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series (optional)',
      type: 'string',
      description:
        'Tags an event for an additional programme page while keeping it in the main Events gallery.',
      options: {
        list: [
          {
            title: 'PETROSOL Women Network (PWN)',
            value: 'pwn',
          },
          {
            title: 'Industry & national leadership',
            value: 'industry-leadership',
          },
        ],
      },
    }),
    defineField({
      name: 'eventDate',
      title: 'Event date',
      type: 'date',
      description:
        'Only the YEAR is published — it is what the filter pill reads, and nothing on the site prints the day or month. Where the exact date was never recorded, use 1 January of the year it happened.',
      hidden: ({ document }) => document?.stream === 'community',
      // Deliberately `custom` rather than `required()`. Community work has no
      // date, and `schema:extract --enforce-required-fields` would otherwise
      // generate this as non-null — a lie for the rows that legitimately omit it.
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.document as { stream?: string } | undefined)?.stream ===
            'community' || value
            ? true
            : 'An event needs a date — its year is what the filter pill shows',
        ),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first. This is what the page sorts by — the date is only ever read for its year.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'coverImage',
      title: 'Card photo (optional)',
      type: 'image',
      options: { hotspot: true },
      description:
        'The still on this card: the photo beside a story write-up, or a poster override for a video. Leave a story empty and it falls back to the first photo below; leave a video empty and Mux generates the poster from the film itself.',
      // A photos row IS its grid — there is nowhere for a separate card photo to
      // go.
      hidden: ({ document }) => document?.kind === 'photos',
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
                ? 'Alt text is required when a card photo is set'
                : true,
            ),
        }),
      ],
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              // Plain `required()` here, unlike the optional image fields
              // elsewhere: a member of this array only exists because someone
              // added a photo, so there is no empty-but-valid state to allow for.
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      description:
        'The reel the lightbox pages through, on any kind of row. A photos row shows the first three plus a fourth tile carrying the “+N more” overlay, so four is the fewest that reads correctly. A story or video row may have any number, including none — stills shot alongside a film belong here, and the “View photos” control only appears once there is something to show.',
      // A warning, not an error: photography routinely lands after the event
      // record does, and a hard rule would make every new event fail validation
      // on the day it is created.
      validation: (rule) =>
        rule
          .custom((photos, context) =>
            (context.document as { kind?: string } | undefined)?.kind ===
              'photos' && ((photos as unknown[] | undefined) ?? []).length < 4
              ? 'A photos row wants at least four photos — the fourth tile is part of the layout'
              : true,
          )
          .warning(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description:
        'The two or three lines shown on the card, before “Read more”. Around 110 characters reads best.',
      hidden: ({ document }) => document?.kind !== 'story',
      validation: (rule) =>
        rule.max(300).custom((value, context) =>
          (context.document as { kind?: string } | undefined)?.kind !==
            'story' || value
            ? true
            : 'A story row needs an excerpt — it is what the card shows',
        ),
    }),
    defineField({
      name: 'body',
      title: 'Write-up',
      type: 'blockContent',
      description: 'The full text, shown in the modal behind “Read more”.',
      hidden: ({ document }) => document?.kind !== 'story',
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.document as { kind?: string } | undefined)?.kind !==
            'story' ||
          ((value as unknown[] | undefined) ?? []).length > 0
            ? true
            : 'A story row needs a write-up — “Read more” opens onto it',
        ),
    }),
    defineField({
      name: 'caption',
      title: 'Poster caption (optional)',
      type: 'string',
      description:
        'Overrides the title in the caption bar across the bottom of the video poster — e.g. “Watch the promo film”.',
      hidden: ({ document }) => document?.kind !== 'video',
    }),
    defineField({
      name: 'muxPlaybackId',
      title: 'Mux playback ID',
      type: 'string',
      description:
        'The playback ID from the Mux dashboard, not the full URL. The asset’s playback policy must be “public” — the ID is rendered into the page and this site holds no signing key.',
      hidden: ({ document }) => document?.kind !== 'video',
      // Two rules rather than one chain: they carry different severities, and a
      // chain has a single level.
      validation: (rule) => [
        // A pasted URL is a mistake, not an omission — the player would break.
        rule.custom((value) =>
          typeof value === 'string' &&
          (value.includes('/') || value.includes('.'))
            ? 'Paste just the playback ID, not the full stream or thumbnail URL'
            : true,
        ),
        // Only a warning, so a video row can be filed before whoever holds the
        // footage has uploaded it.
        rule
          .custom((value, context) =>
            (context.document as { kind?: string } | undefined)?.kind ===
              'video' && !value
              ? 'A video row needs a Mux playback ID before the film will play'
              : true,
          )
          .warning(),
      ],
    }),
    defineField({
      name: 'posterTime',
      title: 'Poster frame (seconds)',
      type: 'number',
      description:
        'How far into the film Mux should grab the poster from. Leave at 0 unless the opening frame is a black fade.',
      hidden: ({ document }) => document?.kind !== 'video',
      initialValue: 0,
      validation: (rule) => rule.min(0),
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
    select: {
      title: 'title',
      kind: 'kind',
      stream: 'stream',
      eventDate: 'eventDate',
      cover: 'coverImage',
      firstPhoto: 'photos.0',
    },
    // Subtitle mirrors the modal's own eyebrow ("2025 · Photos"), so the desk
    // list reads the way the page does.
    prepare: ({ title, kind, stream, eventDate, cover, firstPhoto }) => ({
      title: title ?? 'Untitled event',
      subtitle: [
        stream === 'community' ? 'Community' : eventDate?.slice(0, 4),
        { photos: 'Photos', story: 'Story', video: 'Video' }[kind as string] ??
          kind,
      ]
        .filter(Boolean)
        .join(' · '),
      media: cover ?? firstPhoto,
    }),
  },
})
