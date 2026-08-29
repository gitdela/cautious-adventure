# PETROSOL 2026 Website Improvement Plan

Status: planned, not yet implemented.

## Summary

Refresh the existing site's content and page structure while retaining the current
design system. The homepage will serve retail customers and corporate/mining buyers
equally, all reusable facts will come from verified Sanity content, and disputed or
unsupported claims will not be published.

## Content foundation and interfaces

- Create a pinned `companyProfile` Sanity singleton with:
  - Legal name, company summary, vision, purpose and ownership statement.
  - Founded, OMC-licensed and operations-started years.
  - Optional verified metrics for stations, employment and tax contribution, each
    with an "as of" date.
  - Operating depots, certifications, licences, memberships and registrations as
    separate collections.
  - History milestones and the six customer promises.
  - Required `verifiedAt` and internal verification note.
- Add `CompanyProfileView`, mapper, GROQ query and `getCompanyProfile()`. Use cached,
  draft-aware fetching with matching cache tags and revalidation-webhook handling.
- Add an `award` document type and `AwardView` for title, year, awarding body,
  recipient, summary, source link, feature status, image and display order. Generate
  award totals and latest-year information from records instead of hardcoding them.
- Reuse `galleryEvent` community records for the Sustainability page. Add a location
  field and a community-only query; the first ordered record becomes the featured
  initiative.
- Replace all leadership and board seed biographies with the supplied profiles,
  omitting the two visibly truncated sentences until complete source copy is supplied.
  Correct job titles, feature the chairman on the Board page, and remove the invented
  chairman quotation.
- Update deterministic seed/import scripts and the development NDJSON alongside the
  live Sanity migration. Preserve existing editor-owned images and hotspots when
  patching text.
- Establish an approved fact register before import covering station count, staffing
  arithmetic, tax contribution, COMAC/AOMC naming, certification validity, product
  claims, service availability and conflicting award years. If a value is not signed
  off, its field remains empty and the related statistic is omitted.

## Page improvements

| Surface | Planned changes |
| --- | --- |
| Home | Replace generic "worldwide" positioning with the official purpose and Ghana focus. Add balanced "Find a station" and "Corporate supply" paths. Replace unsupported 10% price and 20% emissions claims with verified company facts. Remove the online-purchase claim and improve service links. |
| Who We Are | Add the 2006-2025 history timeline, exact PLC identity, retail/B2B/lubricants overview, official vision and purpose, six customer promises, condensed core values and a verified Ghana-impact band. Separate ISO certifications, NPA licensing, memberships and registrations. |
| Fuels | Retain CMS product sections but remove or qualify claims about GSA certification, universal calibration, marker dosing and emissions until approved. Emphasize clean fuel, full quantity and customer value using verified wording. |
| Fuel Delivery | Reposition around corporate, mining, construction, manufacturing, agribusiness and service-sector supply. Explain onsite storage, dispensers and direct-to-equipment delivery. Remove home-delivery and operational-process claims unless separately verified. |
| Lubricants | Reconcile the CMS catalogue against the approved product master and 2026 pack specifications. Supply all missing pack shots and remove "stocked at every station," sealing, testing or additive claims that lack approval. |
| FullCare and Shops | Replace "any/every station" language with participating-location wording. Link CTAs to station results filtered for `fullcare` or `shop`. Retain service claims only after operational sign-off. |
| Find a Station | Add URL-backed `q`, `region` and `service` filters using shared typed nuqs parsers, `useQueryStates`, clean default URLs and server-safe serializers. Add "All regions" and support `/find-a-station?service=fullcare` and `?service=shop`. |
| Leadership and Board | Publish the supplied full biographies and accurate roles. Derive leadership totals from CMS data. Require primary portraits; when an optional second portrait is absent, reuse the approved headshot rather than showing "Drop a portrait." |
| Awards | Import the verified awards record into Sanity, compute totals automatically and feature the latest approved award. Resolve the 2020/2022 Indigenous OMC discrepancy and omit awards whose awarding body is unknown. |
| Sustainability & Community | Drive initiatives from community event records, using the profile's healthcare, education, consumer-rights, disaster-relief, safety and empowerment material. Require authentic approved photography for every published initiative. |
| Contact | Normalize the exact legal name, strengthen the corporate-supply enquiry path and retain verified address/contact details. Keep specific enquiry routing and update metadata accordingly. |
| Blog and Events | Remove development placeholder posts from publishable seed data. Rename the Events page's visible "Gallery" heading and breadcrumbs consistently. Block publication of photo events without four photos, stories without media, and videos without playback IDs. |
| Help and legal | Permanently redirect `/help` to `/contact-us` and remove its fake FAQ/email content. Leave Privacy and Terms copy unchanged apart from shared company-name/chrome updates. |

## Media, routes and SEO

- Require authentic portraits, CSR photographs, award images and event media from the
  original profile or PETROSOL archive. Optimize static assets to WebP; upload
  editorial media to Sanity with required alt text.
- Never expose editor-facing "Drop a photo" placeholders publicly. Optional blog/media
  content should render a neutral text-first fallback or remain unpublished.
- Keep canonical routes as the sole page implementations and retain permanent
  redirects for legacy paths. Remove duplicate legacy `page.tsx` metadata
  implementations to prevent drift.
- Add a permanent `/help` redirect.
- Expand Organization JSON-LD from the verified singleton with legal name, founding
  year, logo, address, contact details and social profiles.
- Add Person JSON-LD to leadership profiles and BreadcrumbList JSON-LD through the
  shared breadcrumbs component.
- Give every canonical page accurate title, description, canonical, Open Graph image
  and Twitter metadata; remove unsupported claims from metadata too.
- Use Ghanaian/British English for normal copy--"litre," "centre," "programme"--while
  preserving the official "energizing dreams!" brand spelling.

## Test and rollout plan

- Add mapper tests for missing/optional company metrics, expired credentials, award
  ordering and community records.
- Test company-profile and award cache-tag mappings in the revalidation webhook.
- Test station filter parsing, invalid service values, combined filters, clean URLs
  and serialized FullCare/Shop links with the nuqs testing adapter.
- Test that team profiles use the headshot fallback and that incomplete media records
  cannot be published.
- Verify every canonical route at mobile, tablet and desktop widths, with no draft
  labels, broken image frames, unsupported claims or heading-order regressions.
- Verify canonical pages return 200, legacy routes and `/help` redirect permanently,
  and query-filtered station URLs retain the canonical `/find-a-station`.
- Run:
  - `bun run cms:schema:extract && bun run cms:typegen`
  - `bun run test`
  - `bun run lint`
  - `bun run build:studio`
  - `bun run build:website`
  - `bun run cms:validate`
- Roll out in order: approve the fact register and assets; deploy the Studio schema;
  import and validate company, award, team and community content; deploy the website;
  then verify webhook revalidation and canonical redirects.

## Assumptions

- The current visual language and navigation hierarchy remain; this is not a full
  redesign.
- The 2026 profile is source material, not automatic publication authority.
- Approved original photography will be provided; affected sections do not launch
  with placeholders.
- No ecommerce, residential fuel-delivery capability, new legal content or
  speculative energy service is introduced.
- Missing optional metrics are omitted rather than replaced with broad or invented
  claims.
