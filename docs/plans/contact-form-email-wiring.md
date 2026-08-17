# Wire the contact forms to send real email (Resend + Turnstile)

Status: planned, not yet implemented.

## Context

The contact form is a stub. `apps/website/src/app/contact/contact-message-form.tsx`
calls `event.preventDefault()` and flips a `useState` to a "Message received" card —
**nothing ever leaves the browser**. Anyone who fills it in believes PETROSOL received
their enquiry; nobody did.

> **Scope update:** the homepage had a near-duplicate form (`home-contact-form.tsx`).
> It has since been deleted and replaced with a CTA panel linking to `/contact`, and a
> site-wide floating "Chat with us" button (`apps/website/src/app/contact-fab.tsx`) now
> routes visitors there too. `/contact` is the single message surface, so this plan
> covers **one** form, not two.

There is no email transport, no validation library, no server action, and no
`/api/contact` route in the repo today. The only existing route-handler precedent is
`apps/website/src/app/api/revalidate/route.ts`, which is the house template for a
hardened endpoint (env guard → size cap → verify → parse → act → PII-free structured log).

**Outcome:** a submission on either form is validated, gated by Cloudflare Turnstile,
and delivered by Resend to PETROSOL's inbox with `replyTo` set to the sender, so staff
can hit Reply. Failures surface as real inline errors instead of a fake success screen.

Decisions already made: **Resend** transport, **Cloudflare Turnstile**.

---

## Approach

A single `POST /api/contact` route handler (not a server action — matches the existing
`api/revalidate` precedent and CLAUDE.md's "data fetching only in server components /
route handlers"). The form keeps its markup and success state; the submit logic and
validation live in separate modules so a second form could reuse them later.

```
client form ──▶ useContactSubmit() ──fetch──▶ POST /api/contact
  (+ Turnstile widget → token)                 ├─ parseContactSubmission()  [shared, pure]
                                               ├─ verifyTurnstile()         [siteverify]
                                               └─ sendContactEmail()        [resend, server-only]
```

### 1. Shared validation — `apps/website/src/lib/contact/schema.ts` ✅ DONE

**Built with zod v4** (`zod@^4.4.3`, added to `apps/website`). The plan originally
proposed hand-rolling to match `packages/cms/src/validation.ts`; zod was chosen instead.
`parseContactSubmission` wraps `safeParse` so zod stays an implementation detail —
callers get a plain `{ ok, data | errors }` and never touch a `ZodError`.

zod v4 gotcha found while building: `z.email().trim()` validates the format *before*
trimming, so a pasted `"  a@b.com  "` is rejected. The schema uses
`z.string().trim().pipe(z.email())` to force the right order.

Pure and framework-neutral — no `next/*`, no `process.env`, no DOM — so the same module
runs in the browser, on the server, and in unit tests.

- Export `CONTACT_TOPICS` (the 7 from the contact page). The form renders from it and the
  server allowlist checks membership in it, so the two can't drift.
- Export `parseContactSubmission(input: unknown): { ok: true; data: ContactSubmission } | { ok: false; errors: Record<Field, string> }`.
  Rules: `name` 2–100 chars; `email` trimmed, ≤254, basic shape check; `topic` must be in
  `CONTACT_TOPICS`; `message` 10–5000 chars; `updates` boolean.
- Used by **both** the client (instant inline errors, no round trip) and the route handler
  (authoritative — never trust the client's copy).

**Fix while here:** the form uses `<SelectValue placeholder={contactTopics[0]} />`, so the
select *looks* pre-filled but submits nothing. Change the placeholder to
`"Select a topic"` and let validation require a real choice.

### 2. Turnstile verification — `apps/website/src/lib/contact/turnstile.ts` ✅ DONE

Built with the client widget (§6) and the Turnstile env vars (§8) in the same phase.
`verifyTurnstile` returns `{ success, errorCodes }` rather than the planned bare boolean —
distinguishing `timeout-or-duplicate` (visitor's token went stale) from
`invalid-input-secret` (our misconfiguration) is what makes the route's logs actionable.
The secret is a parameter, not a `process.env` read, so the module unit-tests without
`server-only`. `resolveTurnstileSiteKey` falls back to Cloudflare's always-passes test key
outside production, so the form works locally with no Cloudflare account.

**Browser-verified** via the dev-only `/turnstile-probe` route: the widget issued
`XXXX.DUMMY.TOKEN.XXXX`, Cloudflare's documented dummy-token format, confirming script
load → explicit render → `onReady` timing → callback → parent state. Delete that
directory in phase 5.

Still unexercised: the expiry/refresh path (`cleared` stayed 0). Phase 4 can drive it
deterministically with test secret `3x0000000000000000000000000000000AA`, which always
returns `timeout-or-duplicate`.

`verifyTurnstile(token: string, ip: string | null): Promise<boolean>` — plain `fetch` POST
to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET_KEY`,
the token, and `remoteip`. No SDK. Returns `false` on a non-2xx or `success: false`.
Tokens are single-use and expire in 300s, so this doubles as replay protection — no
separate in-memory rate limit (which would be ineffective across serverless instances anyway).

**Decision: hard-block, fail-closed.** A missing, invalid, expired, or already-spent token
means `403` and no email — no "log it and let it through" fallback. Consequences accepted:

- Visitors whose network or privacy extensions block `challenges.cloudflare.com` cannot
  use the form. The page must therefore keep the `mailto:` and phone fallbacks visible so
  those people still have a route through.
- `verifyTurnstile` returning `false` on a fetch throw means a **Cloudflare siteverify
  outage takes the contact form down**. That is the deliberate trade of fail-closed; the
  alternative leaks spam during exactly the window an attacker would target.
- The expired-token path must auto-refresh silently (see §6) or slow typers get blocked
  on a legitimate message — the most common way this integration ships broken.

### 3. Email send — `apps/website/src/lib/contact/send-contact-email.ts` ✅ DONE (code)

`resend@6.20.0`. Config passed as params (not `process.env`), so no `server-only` and the
module unit-tests against a mocked SDK. Idempotency key = sha256 of the payload via Web
Crypto, so a double-click cannot deliver twice and a genuinely different message still
sends. Escapes all user text into the HTML body and collapses whitespace in the subject —
a submission is attacker-controlled content landing in a mail from your own domain.

**Untested against the live API** — see "sending domain" below. `bun run test` covers the
payload shape, error handling, idempotency and escaping; it does not prove a real send.

`import "server-only"` at the top (same guard as `packages/cms/src/server.ts`).

- New dependency: `resend` (>= 6.14.0) in `apps/website/package.json`.
- `from`: `CONTACT_FROM_EMAIL` — must be on a Resend-**verified** domain
  (e.g. `PETROSOL Website <noreply@mail.petrosol.com.gh>`). Sending from an unverified
  `petrosol.com.gh` address returns 403.
- `to`: `CONTACT_TO_EMAIL` (today's hardcoded `info@petrosol.com.gh`, now configurable).
- `replyTo`: the submitter's email — this is the whole point; staff reply straight from the inbox.
- `subject`: `[Website] ${topic} — ${name}`.
- Body: plain `text` + simple inline-styled `html` (no React Email dependency). Includes
  name, email, topic, message, the "send me operational updates" flag, and which form it
  came from.
- **Idempotency key** derived from a sha256 of the payload: `contact-form/${hash.slice(0,32)}`.
  Same payload within 24h returns the original response instead of re-sending, so a
  double-click or a retry can't spam the inbox. Because the key is derived from the payload,
  the 409 "same key, different payload" case cannot occur.
- The Resend Node SDK **does not throw** — it returns `{ data, error }`. Check `error`
  explicitly; do not wrap in try/catch and assume success.

### 4. Route handler — `apps/website/src/app/api/contact/route.ts` ✅ DONE

Verified live with `curl` against the dev server: 413 oversized, 400 invalid-JSON,
403 no-token, 400 per-field validation errors, **200 with a real Resend send**.

Config resolution lives in `lib/contact/config.ts` (pure, env-as-parameter, tested).
Per decision, `TURNSTILE_SECRET_KEY` falls back to the test secret paired with the
fallback site key **outside production only** — keeping both halves in sync so local dev
needs no Cloudflare account, while production still hard-fails on a missing secret.

`vitest.config.ts` added to mirror the `@/*` → `./src/*` tsconfig alias, which vitest
needs to import route handlers.

The handler takes `Request`, not `NextRequest` — nothing needs the Next-specific surface,
and the narrower type lets tests drive it with a plain `Request`.

Mirrors the structure of `api/revalidate/route.ts`:

1. Guard `RESEND_API_KEY` / `TURNSTILE_SECRET_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`
   → `500 "Contact form is not configured"` if any is missing.
2. `MAX_BODY_BYTES` cap (~20_000) on the raw body → `400`.
3. `JSON.parse` in a try/catch → `400`.
4. `verifyTurnstile(body.turnstileToken, ip)` → `403 { ok: false, error: "verification-failed" }`.
5. `parseContactSubmission(body)` → `400 { ok: false, errors }` (field-keyed, rendered inline).
6. `sendContactEmail(data)` → `502` on Resend error.
7. `200 { ok: true }`.
8. PII-free structured log on both paths — `console.log(JSON.stringify({ msg, source, topic, id }))`.
   **Never log name, email, or message body.**

### 5. Client hook — `apps/website/src/lib/contact/use-contact-submit.ts`

`"use client"`. Owns `status: "idle" | "submitting" | "success" | "error"`, `errors`, and the
Turnstile token. Returns `{ status, errors, formError, onSubmit, reset, onTurnstileToken }`.

Shares *logic*, not state (CLAUDE.md React rules) — each form calls it independently and keeps
its own distinct card styling and success copy. No effect chains: token arrives via the widget's
callback, submission happens in the submit handler.

### 6. Turnstile widget — `apps/website/src/components/turnstile-widget.tsx`

Small `"use client"` leaf. Loads `https://challenges.cloudflare.com/turnstile/v0/api.js`
via `next/script` (`strategy="lazyOnload"`), then **explicit render** in a `useEffect` with
cleanup calling `window.turnstile.remove(id)`. This is a legitimate effect under the CLAUDE.md
ladder — step 5, syncing with a non-React external widget. Props: `siteKey: string`,
`onToken: (token: string) => void`, `onExpire: () => void`.

There is no CSP in `next.config.ts`, so the third-party script loads without further config.

### 7. Wiring the form ✅ DONE

Submit button is **disabled until Turnstile issues a token** (decision), with the hint
"Running a quick security check…" in place of the privacy line until then — submitting
without a token is a guaranteed 403, so the click is worse than useless.

`topic` and `updates` are controlled React state rather than read from `FormData`: both
render as Radix primitives, and relying on their hidden-input behaviour was a subtlety
worth not inheriting. The plain inputs still use `FormData`.

Site key resolved in `contact/page.tsx` (server) and threaded down as a plain string
prop, so the client form never touches `process.env`.

`/turnstile-probe` scaffold deleted.

**Dropped (not planned):** surfacing the `mailto:` fallback on a hard failure. Note the
consequence of pairing this with the fail-closed decision — a visitor whose network blocks
`challenges.cloudflare.com` has no route through the form and is shown only a generic
error. The address and phone number are already on the page, just not raised at the point
of failure. Revisit if support ever reports "I couldn't contact you".

<details><summary>original plan text</summary>

- `contact-message-form.tsx` takes a new `siteKey: string` prop (a plain string —
  serializable, satisfies the RSC boundary rule), passed by its server parent
  `apps/website/src/app/contact/contact-sections.tsx`.
- Replace the fake `onSubmit` with the hook's `onSubmit`; add `<FieldError>` under each field
  (already exported from `packages/ui/src/components/field.tsx:176`); disable the submit button
  and show "Sending…" while `status === "submitting"`; render a form-level error alert on failure.
- Success states stay as they are — they just become truthful.

</details>

### 8. Config & env

Public site key follows the documented public-var pattern: add `resolveTurnstileSiteKey(env)`
to `packages/config/src/env.ts` (multi-key lookup, throws in production, empty in dev) plus a
case in `packages/config/src/env.test.ts`. Server secrets are read directly with `process.env`
in the route handler — `@workspace/config` deliberately never handles secrets.

| Var | Kind | Notes |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | turbo.json → `env` |
| `TURNSTILE_SECRET_KEY` | server-only | turbo.json → `passThroughEnv` |
| `RESEND_API_KEY` | server-only | `passThroughEnv` |
| `CONTACT_FROM_EMAIL` | server-only | `passThroughEnv`, verified domain |
| `CONTACT_TO_EMAIL` | server-only | `passThroughEnv` |

Document all five in **both** `.env.example` and `apps/website/.env.example`, in the
existing public / server-only sections.

### 9. Tests — ✅ harness DONE in phase 1

`vitest` added as a devDep to `apps/website` plus a `"test": "vitest run"` script, so the
root `bun run test` (turbo) picks it up alongside the three package suites.
`apps/website/src/lib/contact/schema.test.ts` covers the validation module (11 tests).
Later phases add their own files here.

---

## Files

**New**
- `apps/website/src/app/api/contact/route.ts`
- `apps/website/src/lib/contact/schema.ts` + `schema.test.ts`
- `apps/website/src/lib/contact/turnstile.ts`
- `apps/website/src/lib/contact/send-contact-email.ts`
- `apps/website/src/lib/contact/use-contact-submit.ts`
- `apps/website/src/components/turnstile-widget.tsx`

**Modified**
- `apps/website/src/app/contact/contact-message-form.tsx` — real submit, inline errors, widget
- `apps/website/src/app/contact/contact-sections.tsx` — pass `siteKey`
- `apps/website/package.json` — `resend`, `vitest`, `test` script
- `packages/config/src/env.ts` + `env.test.ts` — `resolveTurnstileSiteKey`
- `turbo.json`, `.env.example`, `apps/website/.env.example`

---

## Prerequisites (account setup — manual, not code)

### Sending domain — the blocker, and why

A mailbox at `petrosol.com.gh` is **not** authority to send as that domain through Resend.
Resend never logs into the mailbox; it sends from its own servers claiming to be the
domain, so the domain has to publish DNS records (DKIM signing key, SPF/Return-Path)
declaring Resend authorised. What's needed is **DNS access, not mailbox credentials**.

Extra reason it matters here: the form sends *from* `petrosol.com.gh` *to*
`petrosol.com.gh` via a third party — the exact shape of a phishing attack. Unauthenticated,
corporate filters are likely to quarantine the enquiries silently.

Recommended, and what Resend advises ("isolate your sending reputation"):

```
from:    noreply@mail.petrosol.com.gh   ← verified SUBDOMAIN, keeps form traffic from
to:      websitesu@petrosol.com.gh         affecting staff-email deliverability
replyTo: the visitor
```

The `from` domain must exactly match the verified domain — verify `mail.petrosol.com.gh`
then send as `websitesu@petrosol.com.gh` and Resend returns 403.

**Interim (DNS pending, week of 2026-08-16):** `CONTACT_FROM_EMAIL="…<onboarding@resend.dev>"`
needs no DNS but only delivers to the Resend account's own address. Switching later is an
env change; no code moves.

Fallback if DNS access stalls: nodemailer over SMTP with the `websitesu@` credentials needs
no DNS at all, at the cost of storing full-mailbox credentials and less reliable serverless
delivery. Phases 1–2 are unaffected either way.

### Checklist

1. Resend account → API key → `RESEND_API_KEY`.
2. Resend → add domain → add its DNS records → verify. (Read the records off the
   dashboard; they are generated per-domain.)
3. Cloudflare Turnstile → widget for the site's domains incl. `localhost` → site + secret key.
   Optional: dev works without this via the always-passes test key fallback.
4. Put the values in `apps/website/.env.local` and in the deploy secret manager.

## Verification

1. `bun run dev:website`, open `http://localhost:3000/contact`.
2. Submit with empty/invalid fields → inline `FieldError` messages, no network request fired.
3. Submit valid data with `CONTACT_TO_EMAIL=delivered@resend.dev` → success card; confirm the
   send in the Resend dashboard (Emails log) and check `replyTo` is the submitter's address.
4. Point `CONTACT_TO_EMAIL` at a real inbox → send once, confirm the mail arrives, hit Reply
   and confirm it addresses the submitter.
5. Repeat the same submission immediately → idempotency key means no second email.
6. Failure paths: unset `RESEND_API_KEY` → 500 + "not configured"; tamper the Turnstile token
   in devtools → 403; `curl -X POST localhost:3000/api/contact -d '{}'` → 403 (no token),
   confirming the endpoint can't be driven headlessly.
7. `bun run test` and `bun run lint` clean. Grep the dev server output to confirm no submitter
   name/email/message ever appears in logs.

## Deliberately out of scope

- Adding subscribers to a Resend Audience when "send me operational updates" is checked —
  that's a contact-list feature, not this wiring. Today the flag just appears in the email.
- Making the recipient address or topic list editable in Sanity (would need a new
  `siteSettings` document type + `bun run cms:typegen`).
- Storing submissions anywhere; email is the only sink.
