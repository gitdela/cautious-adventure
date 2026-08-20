import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CONTACT_TOPICS } from "@/lib/contact/schema";

const { verifyTurnstile, sendContactEmail } = vi.hoisted(() => ({
  verifyTurnstile: vi.fn(),
  sendContactEmail: vi.fn(),
}));

// Phases 2 and 3 have their own suites; here we only care that the route
// wires them together in the right order with the right outcomes.
vi.mock("@/lib/contact/turnstile", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/contact/turnstile")>()),
  verifyTurnstile,
}));

vi.mock("@/lib/contact/send-contact-email", () => ({ sendContactEmail }));

const { POST } = await import("./route");

const validBody = {
  name: "Ama Mensah",
  email: "ama@example.com",
  topic: CONTACT_TOPICS[0],
  message: "Please quote for bulk diesel delivery to Tema.",
  updates: false,
  turnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
};

function post(body: unknown, init?: { raw?: string; headers?: HeadersInit }) {
  return POST(
    new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: init?.headers,
      body: init?.raw ?? JSON.stringify(body),
    }),
  );
}

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.restoreAllMocks();
  // `restoreAllMocks` only restores spies — module mocks created with `vi.fn`
  // keep their call history unless reset explicitly.
  verifyTurnstile.mockReset();
  sendContactEmail.mockReset();

  // Silence the route's structured logging during tests.
  vi.spyOn(console, "log").mockImplementation(() => {});

  process.env.RESEND_API_KEY = "re_key";
  process.env.CONTACT_FROM_EMAIL = "PETROSOL <noreply@mail.petrosol.com.gh>";
  process.env.CONTACT_TO_EMAIL = "websitesu@petrosol.com.gh";
  process.env.TURNSTILE_SECRET_KEY = "1x0000-test-secret";

  verifyTurnstile.mockResolvedValue({ success: true, errorCodes: [] });
  sendContactEmail.mockResolvedValue({ ok: true, id: "email_123" });
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("POST /api/contact — happy path", () => {
  it("accepts a valid submission and reports success", async () => {
    const response = await post(validBody);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("forwards the parsed submission and config to the mailer", async () => {
    await post(validBody);

    expect(sendContactEmail).toHaveBeenCalledWith({
      submission: {
        name: validBody.name,
        email: validBody.email,
        topic: validBody.topic,
        message: validBody.message,
        updates: false,
      },
      apiKey: "re_key",
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
    });
  });

  it("passes the client IP through to Turnstile", async () => {
    await post(validBody, {
      headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
    });

    expect(verifyTurnstile).toHaveBeenCalledWith(
      expect.objectContaining({ remoteIp: "203.0.113.7" }),
    );
  });
});

describe("POST /api/contact — configuration", () => {
  it("500s when a required variable is missing, without sending", async () => {
    delete process.env.RESEND_API_KEY;

    const response = await post(validBody);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "not-configured",
    });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — request shape", () => {
  it("413s an oversized body", async () => {
    const response = await post(null, { raw: "x".repeat(20_001) });

    expect(response.status).toBe(413);
    expect(verifyTurnstile).not.toHaveBeenCalled();
  });

  it("400s a body that is not JSON", async () => {
    const response = await post(null, { raw: "<html>not json</html>" });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "invalid-json",
    });
  });
});

describe("POST /api/contact — spam gate", () => {
  it("403s when Turnstile rejects the token", async () => {
    verifyTurnstile.mockResolvedValue({
      success: false,
      errorCodes: ["invalid-input-response"],
    });

    const response = await post(validBody);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "verification-failed",
    });
  });

  it("distinguishes an expired token so the form can offer a retry", async () => {
    verifyTurnstile.mockResolvedValue({
      success: false,
      errorCodes: ["timeout-or-duplicate"],
    });

    const response = await post(validBody);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "verification-expired",
    });
  });

  it("runs the gate before validation — no email work for a bot", async () => {
    verifyTurnstile.mockResolvedValue({ success: false, errorCodes: ["bad"] });

    // Body is junk as well as unverified; the 403 must win over the 400.
    const response = await post({ turnstileToken: "x" });

    expect(response.status).toBe(403);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("blocks a submission with no token at all", async () => {
    verifyTurnstile.mockResolvedValue({
      success: false,
      errorCodes: ["missing-input-response"],
    });

    const response = await post({ ...validBody, turnstileToken: undefined });

    expect(response.status).toBe(403);
    expect(verifyTurnstile).toHaveBeenCalledWith(
      expect.objectContaining({ token: "" }),
    );
  });
});

describe("POST /api/contact — validation", () => {
  it("400s with per-field errors the form can render inline", async () => {
    const response = await post({
      ...validBody,
      email: "not-an-email",
      message: "hi",
    });

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error).toBe("invalid");
    expect(payload.errors.email).toBeTruthy();
    expect(payload.errors.message).toBeTruthy();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects a topic outside the allowlist even with a valid token", async () => {
    const response = await post({ ...validBody, topic: "Free crypto" });

    expect(response.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — delivery failure", () => {
  it("502s when the mail provider refuses", async () => {
    sendContactEmail.mockResolvedValue({
      ok: false,
      reason: "validation_error",
      statusCode: 403,
    });

    const response = await post(validBody);

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "send-failed",
    });
  });
});

describe("POST /api/contact — logging", () => {
  it("never writes the visitor's details to the log", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    await post(validBody);

    const logged = spy.mock.calls.flat().join(" ");
    expect(logged).not.toContain(validBody.email);
    expect(logged).not.toContain(validBody.name);
    expect(logged).not.toContain(validBody.message);
  });
});
