/**
 * Cloudflare Turnstile server-side verification.
 *
 * The token the browser widget produces proves nothing on its own — a bot can
 * fabricate one or replay a captured one. It only becomes meaningful once
 * Cloudflare vouches for it here, which is why this call is the route
 * handler's first action.
 *
 * Fail-closed by decision: anything other than an explicit `success: true`
 * blocks the submission, including our own network failure. A siteverify
 * outage therefore takes the contact form down. That is the accepted trade —
 * failing open would leak spam during exactly the window an attacker targets.
 *
 * The secret is passed in rather than read from `process.env` here, so this
 * module stays pure and unit-testable; the route handler owns env access.
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare is normally sub-second; cap it so a hang can't stall the route. */
const VERIFY_TIMEOUT_MS = 10_000;

type TurnstileVerifyParams = {
  token: string;
  secret: string;
  /** Visitor IP, when the platform exposes one. Optional per Cloudflare. */
  remoteIp?: string | null;
};

type TurnstileResult = {
  success: boolean;
  /**
   * Cloudflare's `error-codes`, plus two synthetic ones we add for failures
   * that never reach Cloudflare. Kept so the route can log *why* a submission
   * was blocked — `timeout-or-duplicate` (visitor's token went stale) and
   * `invalid-input-secret` (our misconfiguration) demand very different fixes.
   */
  errorCodes: string[];
};

/** Cloudflare's documented code for an expired, or already-redeemed, token. */
const EXPIRED_OR_REPLAYED = "timeout-or-duplicate";

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

async function verifyTurnstile({
  token,
  secret,
  remoteIp,
}: TurnstileVerifyParams): Promise<TurnstileResult> {
  // Short-circuit before spending a network round trip on an empty token —
  // the widget not having produced one yet is a normal, frequent case.
  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  let response: Response;
  try {
    response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    // Network error, DNS failure, or our own timeout. Fail closed.
    return { success: false, errorCodes: ["verify-unreachable"] };
  }

  if (!response.ok) {
    return { success: false, errorCodes: ["verify-http-error"] };
  }

  let payload: SiteverifyResponse;
  try {
    payload = (await response.json()) as SiteverifyResponse;
  } catch {
    return { success: false, errorCodes: ["verify-bad-json"] };
  }

  // Explicit `=== true`: a malformed body must not coerce its way to a pass.
  if (payload.success === true) {
    return { success: true, errorCodes: [] };
  }

  return {
    success: false,
    errorCodes: payload["error-codes"] ?? ["unknown"],
  };
}

/**
 * True when the block was caused by the visitor's token going stale rather
 * than by anything suspicious — the form should quietly fetch a fresh token
 * and invite a retry instead of showing an accusatory error.
 */
function isExpiredTokenResult(result: TurnstileResult): boolean {
  return result.errorCodes.includes(EXPIRED_OR_REPLAYED);
}

export {
  EXPIRED_OR_REPLAYED,
  isExpiredTokenResult,
  SITEVERIFY_URL,
  verifyTurnstile,
  type TurnstileResult,
  type TurnstileVerifyParams,
};
