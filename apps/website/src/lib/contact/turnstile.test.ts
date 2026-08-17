import { afterEach, describe, expect, it, vi } from "vitest";

import {
  EXPIRED_OR_REPLAYED,
  isExpiredTokenResult,
  SITEVERIFY_URL,
  verifyTurnstile,
} from "./turnstile";

const params = { token: "0.dummy-token", secret: "1x0000-secret" };

/** Stub `fetch` with a canned siteverify response. */
function mockSiteverify(body: unknown, init?: { ok?: boolean }) {
  const spy = vi.fn(async () =>
    new Response(JSON.stringify(body), {
      status: init?.ok === false ? 500 : 200,
    }),
  );
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verifyTurnstile", () => {
  it("passes when Cloudflare returns success", async () => {
    mockSiteverify({ success: true });

    const result = await verifyTurnstile(params);

    expect(result.success).toBe(true);
    expect(result.errorCodes).toEqual([]);
  });

  it("posts the secret, token and remote IP as form-encoded fields", async () => {
    const spy = mockSiteverify({ success: true });

    await verifyTurnstile({ ...params, remoteIp: "203.0.113.7" });

    const [url, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(SITEVERIFY_URL);
    expect(init.method).toBe("POST");

    const sent = new URLSearchParams(init.body as string);
    expect(sent.get("secret")).toBe(params.secret);
    expect(sent.get("response")).toBe(params.token);
    expect(sent.get("remoteip")).toBe("203.0.113.7");
  });

  it("omits remoteip when no IP is available", async () => {
    const spy = mockSiteverify({ success: true });

    await verifyTurnstile({ ...params, remoteIp: null });

    const [, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
    expect(new URLSearchParams(init.body as string).has("remoteip")).toBe(false);
  });

  it("surfaces Cloudflare's error codes on a failed check", async () => {
    mockSiteverify({ success: false, "error-codes": ["invalid-input-response"] });

    const result = await verifyTurnstile(params);

    expect(result.success).toBe(false);
    expect(result.errorCodes).toEqual(["invalid-input-response"]);
  });

  it("short-circuits an empty token without calling Cloudflare", async () => {
    const spy = mockSiteverify({ success: true });

    const result = await verifyTurnstile({ ...params, token: "" });

    expect(result.success).toBe(false);
    expect(result.errorCodes).toEqual(["missing-input-response"]);
    expect(spy).not.toHaveBeenCalled();
  });

  // The fail-closed contract: every one of these must block, not pass.
  it("fails closed when the network call throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ECONNRESET");
      }),
    );

    const result = await verifyTurnstile(params);

    expect(result.success).toBe(false);
    expect(result.errorCodes).toEqual(["verify-unreachable"]);
  });

  it("fails closed on a non-2xx response", async () => {
    mockSiteverify({ success: true }, { ok: false });

    const result = await verifyTurnstile(params);

    expect(result.success).toBe(false);
    expect(result.errorCodes).toEqual(["verify-http-error"]);
  });

  it("fails closed when the body is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>502</html>")));

    const result = await verifyTurnstile(params);

    expect(result.success).toBe(false);
    expect(result.errorCodes).toEqual(["verify-bad-json"]);
  });

  it("does not let a truthy non-boolean success coerce its way to a pass", async () => {
    mockSiteverify({ success: "true" });

    const result = await verifyTurnstile(params);

    expect(result.success).toBe(false);
  });

  it("reports an unknown reason when Cloudflare omits error codes", async () => {
    mockSiteverify({ success: false });

    const result = await verifyTurnstile(params);

    expect(result.errorCodes).toEqual(["unknown"]);
  });
});

describe("isExpiredTokenResult", () => {
  it("identifies a stale or already-spent token", () => {
    expect(
      isExpiredTokenResult({
        success: false,
        errorCodes: [EXPIRED_OR_REPLAYED],
      }),
    ).toBe(true);
  });

  it("does not treat other failures as expiry", () => {
    expect(
      isExpiredTokenResult({
        success: false,
        errorCodes: ["invalid-input-secret"],
      }),
    ).toBe(false);
  });
});
