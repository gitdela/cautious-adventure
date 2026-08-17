/**
 * Server-side configuration for the contact endpoint.
 *
 * `@workspace/config` deliberately never resolves secrets, so these are read
 * from the server environment here instead. Kept as a pure function over an
 * env object (rather than touching `process.env` directly) so it unit-tests
 * without mutating global state.
 */

type EnvSource = Record<string, string | undefined>;

/**
 * Cloudflare's documented test secret, paired with the always-passes test site
 * key that `resolveTurnstileSiteKey` falls back to outside production.
 *
 * The pairing is the point: test secrets reject real tokens and vice versa, so
 * a real secret alongside the fallback site key fails every submission with
 * `invalid-input-response` — an error that names nothing useful. Defaulting
 * both halves together keeps local dev working with zero configuration.
 */
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

type ContactConfig = {
  resendApiKey: string;
  from: string;
  to: string;
  turnstileSecret: string;
};

type ResolveContactConfigResult =
  | { ok: true; config: ContactConfig }
  | { ok: false; missing: string[] };

function isProductionEnv(env: EnvSource): boolean {
  return env.NODE_ENV === "production";
}

function firstNonEmpty(value: string | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Resolve everything the route needs, reporting *all* missing keys at once so
 * a misconfigured deploy surfaces in a single log line rather than one
 * variable per redeploy.
 */
function resolveContactConfig(env: EnvSource): ResolveContactConfigResult {
  const resendApiKey = firstNonEmpty(env.RESEND_API_KEY);
  const from = firstNonEmpty(env.CONTACT_FROM_EMAIL);
  const to = firstNonEmpty(env.CONTACT_TO_EMAIL);

  // Outside production, fall back to the test secret so the form works out of
  // the box. In production a missing secret is a hard failure — never silently
  // run the always-passes challenge on a live site.
  const turnstileSecret =
    firstNonEmpty(env.TURNSTILE_SECRET_KEY) ??
    (isProductionEnv(env) ? undefined : TURNSTILE_TEST_SECRET);

  const missing: string[] = [];
  if (!resendApiKey) missing.push("RESEND_API_KEY");
  if (!from) missing.push("CONTACT_FROM_EMAIL");
  if (!to) missing.push("CONTACT_TO_EMAIL");
  if (!turnstileSecret) missing.push("TURNSTILE_SECRET_KEY");

  if (!resendApiKey || !from || !to || !turnstileSecret) {
    return { ok: false, missing };
  }

  return { ok: true, config: { resendApiKey, from, to, turnstileSecret } };
}

export {
  resolveContactConfig,
  TURNSTILE_TEST_SECRET,
  type ContactConfig,
  type EnvSource,
  type ResolveContactConfigResult,
};
