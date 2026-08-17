import { describe, expect, it } from "vitest";

import { resolveContactConfig, TURNSTILE_TEST_SECRET } from "./config";

const complete = {
  RESEND_API_KEY: "re_key",
  CONTACT_FROM_EMAIL: "PETROSOL <noreply@mail.petrosol.com.gh>",
  CONTACT_TO_EMAIL: "websitesu@petrosol.com.gh",
  TURNSTILE_SECRET_KEY: "0x4realsecret",
};

describe("resolveContactConfig", () => {
  it("resolves a complete environment", () => {
    const result = resolveContactConfig(complete);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config).toEqual({
        resendApiKey: "re_key",
        from: complete.CONTACT_FROM_EMAIL,
        to: complete.CONTACT_TO_EMAIL,
        turnstileSecret: "0x4realsecret",
      });
    }
  });

  it("reports every missing variable at once, not just the first", () => {
    const result = resolveContactConfig({ NODE_ENV: "production" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toEqual([
        "RESEND_API_KEY",
        "CONTACT_FROM_EMAIL",
        "CONTACT_TO_EMAIL",
        "TURNSTILE_SECRET_KEY",
      ]);
    }
  });

  it("treats an empty string as missing, not as a value", () => {
    const result = resolveContactConfig({ ...complete, RESEND_API_KEY: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missing).toContain("RESEND_API_KEY");
  });
});

describe("Turnstile secret fallback", () => {
  it("falls back to the paired test secret outside production", () => {
    const result = resolveContactConfig({
      ...complete,
      TURNSTILE_SECRET_KEY: undefined,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.turnstileSecret).toBe(TURNSTILE_TEST_SECRET);
    }
  });

  it("never falls back in production — a live site must not always-pass", () => {
    const result = resolveContactConfig({
      ...complete,
      TURNSTILE_SECRET_KEY: undefined,
      NODE_ENV: "production",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missing).toEqual(["TURNSTILE_SECRET_KEY"]);
  });

  it("prefers a real secret over the fallback when one is set", () => {
    const result = resolveContactConfig(complete);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.turnstileSecret).not.toBe(TURNSTILE_TEST_SECRET);
    }
  });
});
