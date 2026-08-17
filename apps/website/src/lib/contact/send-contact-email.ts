import { Resend } from "resend";

import type { ContactSubmission } from "./schema";

/**
 * Delivers a validated contact submission to PETROSOL's inbox via Resend.
 *
 * Config arrives as parameters rather than `process.env` reads, matching
 * `turnstile.ts`: the route handler owns env access, and this module stays
 * unit-testable without `server-only` (which throws under vitest).
 *
 * Only ever call this with a submission that has already been through
 * `parseContactSubmission` — the types say so, and the escaping below assumes
 * the length caps it enforces.
 */

/** Resend rejects idempotency keys over 256 chars; we use ~46. */
const IDEMPOTENCY_PREFIX = "contact-form";

type SendContactEmailParams = {
  submission: ContactSubmission;
  apiKey: string;
  /** Must be on a Resend-verified domain, or the API returns 403. */
  from: string;
  to: string;
};

type SendContactEmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: string; statusCode?: number | null };

/**
 * The message body is attacker-controlled text landing in an HTML email.
 * Without escaping, a submission containing markup could forge convincing
 * content inside a mail that genuinely comes from your own domain — a far more
 * credible phish than an ordinary spoof.
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Collapse all whitespace, including newlines, to single spaces.
 * A subject line must stay one line; embedded newlines in a display name are a
 * classic header-injection vector, and cost nothing to neutralise here.
 */
function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Stable fingerprint of the submission's content, used as the idempotency key.
 *
 * Resend replays the original response for a repeated key within 24h, so a
 * double-clicked Send button or a retried request cannot deliver twice. Because
 * the key is derived from the payload, the "same key, different payload" 409
 * cannot occur — a genuinely different message hashes differently and sends.
 *
 * Web Crypto rather than `node:crypto` so the module stays runtime-agnostic.
 */
async function fingerprint(submission: ContactSubmission): Promise<string> {
  const canonical = JSON.stringify([
    submission.name,
    submission.email,
    submission.topic,
    submission.message,
    submission.updates,
  ]);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function buildText(submission: ContactSubmission): string {
  return [
    `Name:    ${submission.name}`,
    `Email:   ${submission.email}`,
    `Topic:   ${submission.topic}`,
    `Updates: ${submission.updates ? "yes" : "no"}`,
    "",
    submission.message,
  ].join("\n");
}

function buildHtml(submission: ContactSubmission): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:4px 16px 4px 0;color:#6b7280;font-size:13px;white-space:nowrap;">${label}</td>
      <td style="padding:4px 0;font-size:13px;">${escapeHtml(value)}</td>
    </tr>`;

  return `<div style="font-family:system-ui,-apple-system,sans-serif;color:#041a2d;line-height:1.55;">
  <h2 style="margin:0 0 16px;font-size:18px;">New enquiry from the website</h2>
  <table style="border-collapse:collapse;margin-bottom:20px;">
    ${row("Name", submission.name)}
    ${row("Email", submission.email)}
    ${row("Topic", submission.topic)}
    ${row("Updates", submission.updates ? "yes" : "no")}
  </table>
  <div style="padding:16px;background:#f4f6f8;border-radius:8px;font-size:14px;white-space:pre-wrap;">${escapeHtml(
    submission.message,
  )}</div>
  <p style="margin:20px 0 0;color:#6b7280;font-size:12px;">
    Reply directly to this email to reach ${escapeHtml(submission.name)}.
  </p>
</div>`;
}

async function sendContactEmail({
  submission,
  apiKey,
  from,
  to,
}: SendContactEmailParams): Promise<SendContactEmailResult> {
  const resend = new Resend(apiKey);
  const idempotencyKey = `${IDEMPOTENCY_PREFIX}/${await fingerprint(submission)}`;

  let result;
  try {
    result = await resend.emails.send(
      {
        from,
        to,
        // Staff hit Reply and reach the visitor, not this mailbox. This is the
        // whole reason the form is worth more than a mailto: link.
        replyTo: submission.email,
        subject: singleLine(
          `[Website] ${submission.topic} — ${submission.name}`,
        ),
        text: buildText(submission),
        html: buildHtml(submission),
      },
      { idempotencyKey },
    );
  } catch (error) {
    // The SDK returns errors in `result.error` rather than throwing, so
    // reaching here means a transport-level failure it could not wrap.
    return {
      ok: false,
      reason: error instanceof Error ? error.name : "send-threw",
    };
  }

  // Documented SDK gotcha: `send` resolves with `{ data, error }` and does not
  // throw on an API error. Checking `error` explicitly is mandatory — awaiting
  // without it silently reports failures as successes.
  if (result.error) {
    return {
      ok: false,
      reason: result.error.name,
      statusCode: result.error.statusCode,
    };
  }

  if (!result.data) {
    return { ok: false, reason: "no-id-returned" };
  }

  return { ok: true, id: result.data.id };
}

export {
  escapeHtml,
  sendContactEmail,
  singleLine,
  type SendContactEmailParams,
  type SendContactEmailResult,
};
