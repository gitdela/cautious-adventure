import { beforeEach, describe, expect, it, vi } from "vitest";

import { escapeHtml, sendContactEmail, singleLine } from "./send-contact-email";
import type { ContactSubmission } from "./schema";

// `vi.hoisted` because `vi.mock` is lifted above the imports — plain consts
// declared here would not exist yet when the factory runs.
const { send, resendCtor } = vi.hoisted(() => ({
  send: vi.fn(),
  resendCtor: vi.fn(),
}));

// Mock the SDK surface rather than the network, so these tests assert the
// payload we hand Resend — the part we actually control. A class, not an arrow
// function: the module calls `new Resend(...)`, and arrows are not constructible.
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
    constructor(apiKey: string) {
      resendCtor(apiKey);
    }
  },
}));

const submission: ContactSubmission = {
  name: "Ama Mensah",
  email: "ama@example.com",
  topic: "Fuel delivery",
  message: "Please quote for 5000 litres of diesel, delivered weekly.",
  updates: true,
};

const config = {
  apiKey: "re_test_key",
  from: "PETROSOL <noreply@mail.petrosol.com.gh>",
  to: "websitesu@petrosol.com.gh",
};

/** The payload passed to `emails.send` on the most recent call. */
function lastPayload() {
  return send.mock.calls.at(-1)?.[0];
}

function lastOptions() {
  return send.mock.calls.at(-1)?.[1];
}

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "email_123" }, error: null });
});

describe("sendContactEmail", () => {
  it("returns the Resend message id on success", async () => {
    const result = await sendContactEmail({ submission, ...config });

    expect(result).toEqual({ ok: true, id: "email_123" });
  });

  it("constructs the client with the supplied API key", async () => {
    await sendContactEmail({ submission, ...config });

    expect(resendCtor).toHaveBeenCalledWith("re_test_key");
  });

  it("sets replyTo to the visitor so staff can just hit Reply", async () => {
    await sendContactEmail({ submission, ...config });

    expect(lastPayload().replyTo).toBe("ama@example.com");
    expect(lastPayload().from).toBe(config.from);
    expect(lastPayload().to).toBe(config.to);
  });

  it("puts the topic and sender in the subject", async () => {
    await sendContactEmail({ submission, ...config });

    expect(lastPayload().subject).toBe(
      "[Website] Fuel delivery: Ama Mensah",
    );
  });

  it("sends both a text and an HTML body", async () => {
    await sendContactEmail({ submission, ...config });

    expect(lastPayload().text).toContain(submission.message);
    expect(lastPayload().html).toContain("New enquiry from the website");
  });

  // Documented SDK behaviour: errors come back in `error`, nothing is thrown.
  it("reports an API error instead of treating it as a success", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "bad from", statusCode: 403 },
    });

    const result = await sendContactEmail({ submission, ...config });

    expect(result).toEqual({
      ok: false,
      reason: "validation_error",
      statusCode: 403,
    });
  });

  it("survives the SDK throwing at transport level", async () => {
    send.mockRejectedValue(new TypeError("fetch failed"));

    const result = await sendContactEmail({ submission, ...config });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("TypeError");
  });

  it("treats a missing id as a failure rather than reporting success", async () => {
    send.mockResolvedValue({ data: null, error: null });

    const result = await sendContactEmail({ submission, ...config });

    expect(result.ok).toBe(false);
  });
});

describe("idempotency key", () => {
  it("is stable for an identical submission", async () => {
    await sendContactEmail({ submission, ...config });
    const first = lastOptions().idempotencyKey;

    await sendContactEmail({ submission, ...config });
    const second = lastOptions().idempotencyKey;

    expect(first).toBe(second);
    expect(first).toMatch(/^contact-form\/[0-9a-f]{32}$/);
  });

  it("differs when any field changes, so a real second message still sends", async () => {
    await sendContactEmail({ submission, ...config });
    const first = lastOptions().idempotencyKey;

    await sendContactEmail({
      submission: { ...submission, message: "A different enquiry entirely." },
      ...config,
    });

    expect(lastOptions().idempotencyKey).not.toBe(first);
  });
});

describe("escaping", () => {
  it("neutralises markup in the message body", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  it("escapes ampersands before the entities it introduces", () => {
    expect(escapeHtml("Tom & <b>Jerry</b>")).toBe(
      "Tom &amp; &lt;b&gt;Jerry&lt;/b&gt;",
    );
  });

  it("keeps injected markup out of the rendered HTML email", async () => {
    await sendContactEmail({
      submission: { ...submission, message: "<img src=x onerror=alert(1)>" },
      ...config,
    });

    expect(lastPayload().html).not.toContain("<img src=x");
    expect(lastPayload().html).toContain("&lt;img src=x");
  });

  it("collapses newlines in a name so the subject stays one line", () => {
    expect(singleLine("Ama\nBcc: attacker@evil.com")).toBe(
      "Ama Bcc: attacker@evil.com",
    );
  });

  it("keeps a newline-bearing name out of the subject header", async () => {
    await sendContactEmail({
      submission: { ...submission, name: "Ama\r\nBcc: attacker@evil.com" },
      ...config,
    });

    expect(lastPayload().subject).not.toMatch(/[\r\n]/);
  });
});
