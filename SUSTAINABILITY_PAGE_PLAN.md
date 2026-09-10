# Sustainability page — design prompt for Claude Design

## Context

`/Users/yosteelo/Downloads/Energizing a Sustainable Future.docx` contains the full copy for a rich sustainability page: narrative intro, triple ISO certifications, rooftop solar programme, energy transition, product quality ("Clean fuel in full quantity"), environmental management, HSSE, people/PWN, CSR (GH¢50,000 Graft Foundation donation), 2024 awards, five numbered sustainability pillars, and a "Looking Ahead" close.

The site already has a slim `/sustainability` page (`apps/website/src/app/sustainability/sustainability-sections.tsx` — header, intro, solar spotlight, 4 initiative cards, CTA), so this is an **expansion/redesign**, not greenfield. The user wants Claude Design (claude.ai) to design the page first; we implement the winning design here afterwards using the existing component kit (`SectionHeading`, `Stat`, `PhotoTile`, `ServiceCard`, `MosaicPageHeader`, `MosaicCtaBand`, the achievements timeline patterns, etc.).

The deliverable of this task is **the prompt itself** — a self-contained brief that locks Claude Design to the real Petrosol design system (extracted from `packages/ui/src/styles/globals.css` and the live page patterns) so the comp survives implementation, plus the full page content and a proposed section structure.

## Deliverable

Write the prompt below into the final response for the user to copy into Claude Design. No code changes in this task.

---

## The prompt

> **Design a long-form "Sustainability" page for PETROSOL Platinum Energy PLC** — a leading indigenous Ghanaian energy company (fuel stations, lubricants, and now solar + EV solutions). Produce a single responsive HTML page (desktop-first comp that degrades gracefully to mobile). This page will be implemented inside an existing design system, so the constraints below are hard rules, not suggestions.
>
> ## Design system (hard constraints)
>
> **Typography — Verdana only.** The entire site uses `Verdana, sans-serif` for everything: headings, body, numbers. Do NOT introduce any other typeface (no Inter, no Poppins, no serifs). Differentiation comes from weight, tracking and colour only. Body: 15px, line-height 1.62, colour `#3d3d3d` (never black). Headings: weight 700, letter-spacing -0.02em, colour `#041a2d` (deep navy — headings are never black either). Fluid display sizes via clamp(): xl `clamp(34px,4.8vw,62px)`, lg `clamp(28px,4vw,52px)`, md `clamp(24px,3.1vw,40px)`, sm `clamp(21px,2.4vw,31px)`; big stat figures `clamp(44px,5.8vw,74px)`.
>
> **Colour — light mode only, no dark theme.**
> - Orange (brand primary, does all the pointing — buttons, stats, icons, eyebrows): `#f58326`, hover `#dc6d12`, tint `#fef4ea`, deep `#b2560d`
> - Navy (brand secondary): `#0d3b61`; inverse band surface `#08263f`; inverse card `#0a3050`; darkest field `#041a2d`; header-mosaic field `#052236`
> - Leaf green (rare accent — reserved for the heading underline "swash", success states and the header mosaic tiles; never for buttons or large fills): `#6bb445`
> - Neutrals: page `#ffffff`, muted section surface `#f5f7f9`, card-hover `#eceef1`, body text `#3d3d3d`, muted text `#6b6b6b`, hairline borders `rgba(4,26,45,0.08)`
> - On navy bands: body copy `rgba(255,255,255,0.72)`, dividers `rgba(255,255,255,0.16)`, headings white, accent labels orange
>
> **Signature elements (use them — they're the brand):**
> 1. **Section heading formula**: orange uppercase eyebrow (13px, weight 700, letter-spacing 0.14em) → navy heading where the final phrase sits on a 5px leaf-green underline bar ("swash") tucked under the words. Example: eyebrow "OUR SUSTAINABILITY JOURNEY" → heading "Energizing a *sustainable future*" with "sustainable future" green-underlined. This recurs on almost every section.
> 2. **Inverse navy band with a giant single rounded corner**: full-bleed `#08263f` sections get `border-top-right-radius: 120px`.
> 3. **Numbered orange discs**: 44px orange circles holding a numeral, overlapping the edge of a photo or card — perfect for the five sustainability pillars (01–05).
> 4. **Pill buttons only**: fully rounded (999px), bold, 46px tall; primary = solid orange with white text, on dark bands = white outline ghost.
> 5. **Rounded photography**: all photos at 24px radius, on a `#eceef1` placeholder field. Real photography isn't shot yet — use clearly-labelled placeholder blocks (e.g. "Solar rooftop photography") instead of stock images.
> 6. **Stat rows**: 74px orange figure beside a short label/paragraph, separated by hairlines — or centred figure + 13px label clusters.
> 7. **Band rhythm**: sections alternate surfaces — white → soft grey `#f5f7f9` (with a faint blueprint line-texture) → deep navy inverse band → full-bleed photo/CTA band. Max content width 1280px, generous vertical padding `clamp(56px,9.4vw,120px)`.
>
> **Page chrome (design within these, don't redesign them):** the page opens under a deep-navy page-header band (`#052236`) with a cluster of green mosaic tiles hugging the right edge, breadcrumbs "Home / About / Sustainability" and the page title in white. It closes with a matching navy mosaic CTA band (centred heading + swash + buttons) above the footer.
>
> ## Page content & suggested structure
>
> Title: **"Energizing a Sustainable Future"** · Sub: *"Sustainability is at the heart of how we grow."*
>
> 1. **Intro** — Growth measured by value created for people, communities and the environment. Sustainability is embedded in how PETROSOL operates — environmental management, responsible energy use, product quality, safety, innovation, people development, renewable-energy investment. Sustainability is a core value alongside Integrity, Professionalism, Service, Leadership and Empathy; the purpose: "to energize dreams, ignite hope and power the achievement of goals and aspirations through the delivery of energy solutions in a sustainable and ethical manner."
> 2. **Our sustainability journey — triple ISO certified.** Three certification cards: ISO 9001:2015 (Quality), ISO 14001:2015 (Environmental — flagship for the sustainability agenda), ISO 45001:2018 (Occupational Health & Safety). All successfully re-certified. "More than badges — systems, processes and a culture of continuous improvement."
> 3. **Powering our stations with the sun** (hero moment of the page — good candidate for the navy inverse band). *"Turning rooftops into sources of clean energy."* Solar panels on selected station rooftops harness Ghana's sunshine. Four benefits: Harnessing renewable energy · Supporting more efficient energy use · Reducing our operational environmental footprint · Demonstrating the future of energy (stations evolving from fuel retail points into broader energy platforms).
> 4. **Expanding beyond traditional energy** — *"Preparing for the energy transition."* Diversifying beyond petroleum marketing into renewables, solar and EV solutions; building capabilities, infrastructure and partnerships to stay relevant as the landscape evolves.
> 5. **Better products for a changing world** + **Clean fuel in full quantity** (can be one band with two halves). Fuel quality and integrity from depot to tank; Platinum lubricants formulated for efficiency, extended drain, engine cleanliness. Full Quantity promise: "10 liters should remain 10 liters — regardless of which PETROSOL station a customer visits." Responsible business = reducing waste, protecting value, using resources efficiently.
> 6. **Responsible operations twins**: *Protecting the environment through responsible operations* (ISO 14001 systematic environmental management, downstream-sector handling/storage/transport) and *Safety is sustainability* (ISO 45001; "We cannot build a sustainable future if we compromise the safety of the people who are helping us build it.").
> 7. **Investing in people** — professional development, leadership development, inclusion; the PETROSOL Women Network (PWN) and the annual Women in Leadership Conference.
> 8. **Creating value beyond our stations** — CSR: health, education, community. Example: 2026 donation of GH¢50,000 to the Graft Foundation for free reconstructive surgeries in the Bono Region.
> 9. **External recognition** — Sustainable OMC of the Year (Sustainable and Investment Awards 2024) · Excellence in Corporate Responsibility (Ghana Oil and Gas Awards 2024) · CSR of the Year (Ghana Energy Awards 2024). "Awards are not the reason we pursue sustainability."
> 10. **Our five sustainability pillars** (signature moment — use the numbered orange discs): 01 Environmental Responsibility · 02 Energy Transition · 03 Responsible Operations · 04 People & Inclusion · 05 Community Impact, each with one supporting sentence.
> 11. **Looking Ahead** — *"Energizing a more sustainable tomorrow."* From consuming energy to generating cleaner energy; evolving from an oil marketing company into a diversified energy business. Close on: "This is our purpose: to energize dreams, ignite hope and power a more sustainable future — one station, one innovation and one community at a time." End with the mosaic CTA band (buttons: "Explore our CSR work" / "Find a station").
>
> You may merge or reorder sections for rhythm, but keep all the content represented, vary the layout between sections (avoid a monotonous stack of same-shaped card grids), and make section 3 (solar) and section 10 (pillars) the two visual high points of the page.

---

## After the design comes back (next session)

1. Map the comp onto the existing kit: `MosaicPageHeader`/`MosaicCtaBand` (app-local), `SectionHeading`/`Stat`/`PhotoTile`/`Seal` (`packages/ui/src/components/marketing.tsx`), `ServiceCard`, numbered-disc pattern from `about-core-values.tsx`, inverse-band stat pattern from `about-impact.tsx`.
2. Rebuild `apps/website/src/app/sustainability/sustainability-sections.tsx` (currently 171 lines / 4 sections) into the expanded structure — split into multiple files to respect the 400-line cap.
3. Use `ImagePlaceholder` for un-shot photography; add real images later via `images:optimize`.
4. Update `sustainability-sections.test.ts`; verify with `bun run test` and `bun run dev:website` → check `/sustainability`.

## Verification (this task)

None needed — the deliverable is prompt text; no repo changes.
