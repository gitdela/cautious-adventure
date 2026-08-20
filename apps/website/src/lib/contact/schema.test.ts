import { describe, expect, it } from "vitest";

import {
  CONTACT_TOPICS,
  MESSAGE_MAX,
  parseContactSubmission,
} from "./schema";

const valid = {
  name: "Ama Mensah",
  email: "ama@example.com",
  topic: CONTACT_TOPICS[0],
  message: "I would like a quote for bulk diesel delivery.",
  updates: true,
};

describe("parseContactSubmission", () => {
  it("accepts a well-formed submission", () => {
    const result = parseContactSubmission(valid);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(valid);
  });

  it("defaults `updates` to false when the box is left unchecked", () => {
    // An unchecked checkbox submits no key at all, not `false`.
    const result = parseContactSubmission({
      name: valid.name,
      email: valid.email,
      topic: valid.topic,
      message: valid.message,
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.updates).toBe(false);
  });

  it("trims surrounding whitespace off the values it returns", () => {
    const result = parseContactSubmission({
      ...valid,
      name: "  Ama Mensah  ",
      email: "  ama@example.com  ",
      message: `  ${valid.message}  `,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Ama Mensah");
      expect(result.data.email).toBe("ama@example.com");
      expect(result.data.message).toBe(valid.message);
    }
  });

  it("rejects a whitespace-only name rather than counting the spaces", () => {
    const result = parseContactSubmission({ ...valid, name: "   " });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("rejects a malformed email", () => {
    const result = parseContactSubmission({ ...valid, email: "ama@" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeDefined();
  });

  it("rejects a topic that is not on the allowlist", () => {
    const result = parseContactSubmission({ ...valid, topic: "Free crypto" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.topic).toBeDefined();
  });

  it("rejects a missing topic — the select's placeholder submits nothing", () => {
    const result = parseContactSubmission({
      name: valid.name,
      email: valid.email,
      message: valid.message,
      updates: valid.updates,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.topic).toBeDefined();
  });

  it("rejects a message under the minimum length", () => {
    const result = parseContactSubmission({ ...valid, message: "hi" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });

  it("rejects an oversized message", () => {
    const result = parseContactSubmission({
      ...valid,
      message: "a".repeat(MESSAGE_MAX + 1),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });

  it("reports every bad field at once, not just the first", () => {
    const result = parseContactSubmission({
      name: "",
      email: "nope",
      topic: "nonsense",
      message: "short",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        "email",
        "message",
        "name",
        "topic",
      ]);
    }
  });

  it("does not throw on junk input", () => {
    for (const junk of [null, undefined, "a string", 42, []]) {
      expect(() => parseContactSubmission(junk)).not.toThrow();
      expect(parseContactSubmission(junk).ok).toBe(false);
    }
  });
});
