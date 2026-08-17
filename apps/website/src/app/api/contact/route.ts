import { resolveContactConfig } from "@/lib/contact/config";
import { parseContactSubmission } from "@/lib/contact/schema";
import { sendContactEmail } from "@/lib/contact/send-contact-email";
import { isExpiredTokenResult, verifyTurnstile } from "@/lib/contact/turnstile";

/**
 * Contact form endpoint.
 *
 * Structured like `api/revalidate/route.ts` — the house template for a hardened
 * handler: config guard → size cap → parse → verify → act → PII-free log.
 *
 * Checks run cheapest-first, and the spam gate runs before validation: there is
 * no reason to spend work shaping error messages for a bot that will be
 * rejected regardless.
 *
 * The parameter is typed `Request`, not `NextRequest`. Nothing here needs the
 * Next-specific surface, and the narrower type lets the tests drive it with a
 * plain `Request`.
 */

/**
 * ~20KB. The schema caps a message at 5000 characters; this is the outer guard
 * that stops a large body being read into memory before validation sees it.
 */
const MAX_BODY_BYTES = 20_000;

type ContactRequestBody = {
  turnstileToken?: unknown;
};

/** Structured, PII-free. Never the visitor's name, email, or message. */
function log(fields: Record<string, unknown>): void {
  console.log(JSON.stringify({ route: "contact", ...fields }));
}

/**
 * Best-effort client IP. Turnstile treats `remoteip` as optional, so an absent
 * or spoofed header degrades the check rather than breaking it.
 */
function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const resolved = resolveContactConfig(process.env);
  if (!resolved.ok) {
    // Names of missing variables only — never their values.
    log({ msg: "not configured", missing: resolved.missing });
    return Response.json(
      { ok: false, error: "not-configured" },
      { status: 500 },
    );
  }
  const { config } = resolved;

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    log({ msg: "rejected", reason: "body too large", bytes: raw.length });
    return Response.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  let body: ContactRequestBody;
  try {
    body = JSON.parse(raw) as ContactRequestBody;
  } catch {
    log({ msg: "rejected", reason: "invalid json" });
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  // --- Spam gate, before any other work -----------------------------------
  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  const verification = await verifyTurnstile({
    token,
    secret: config.turnstileSecret,
    remoteIp: clientIp(request),
  });

  if (!verification.success) {
    // An expired token is a slow typer, not an attacker: the form should offer
    // a retry rather than an accusation. Both block, but distinguishably.
    const expired = isExpiredTokenResult(verification);
    log({
      msg: "blocked",
      reason: expired ? "token expired" : "verification failed",
      codes: verification.errorCodes,
    });
    return Response.json(
      { ok: false, error: expired ? "verification-expired" : "verification-failed" },
      { status: 403 },
    );
  }

  // --- Authoritative validation -------------------------------------------
  // The client runs this too, but only as a courtesy — this copy is the one
  // that counts, because anyone can POST here directly.
  const parsed = parseContactSubmission(body);
  if (!parsed.ok) {
    log({ msg: "rejected", reason: "invalid", fields: Object.keys(parsed.errors) });
    return Response.json(
      { ok: false, error: "invalid", errors: parsed.errors },
      { status: 400 },
    );
  }

  // --- Deliver -------------------------------------------------------------
  const sent = await sendContactEmail({
    submission: parsed.data,
    apiKey: config.resendApiKey,
    from: config.from,
    to: config.to,
  });

  if (!sent.ok) {
    log({ msg: "send failed", reason: sent.reason, status: sent.statusCode });
    // 502: we accepted the submission, the upstream mail provider refused it.
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }

  log({ msg: "sent", topic: parsed.data.topic, id: sent.id });
  return Response.json({ ok: true });
}
