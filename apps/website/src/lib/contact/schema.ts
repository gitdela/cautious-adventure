import { z } from "zod";

/**
 * The single source of truth for what a valid contact submission looks like.
 *
 * Imported by both the client form (instant inline errors, no round trip) and
 * the `/api/contact` route handler. The client copy is a courtesy — anyone can
 * skip the form and POST directly — so the server runs the same parse and
 * treats its result as authoritative.
 *
 * Framework-neutral on purpose: no `next/*`, no `process.env`, no DOM. That is
 * what lets it run unchanged in the browser, on the server, and in a unit test.
 */

/**
 * Rendered by the form's topic select AND used as the server-side allowlist,
 * so the two can never drift. Adding a topic here is the only edit needed.
 */
const CONTACT_TOPICS = [
  "Fuel and gasoline",
  "Lubricants and oils",
  "Fuel delivery",
  "Station franchising",
  "Careers",
  "Media and press",
  "Something else",
] as const;

type ContactTopic = (typeof CONTACT_TOPICS)[number];

/** 254 is the maximum length of an email address per RFC 5321. */
const EMAIL_MAX = 254;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;

const contactSubmissionSchema = z.object({
  // `.trim()` runs before the length checks, so "   " is caught as empty
  // rather than sneaking through as a 3-character name.
  name: z
    .string({ error: "Enter your name" })
    .trim()
    .min(2, { error: "Enter your name" })
    .max(100, { error: "Name is too long" }),

  // Trim first, then validate. `z.email().trim()` would check the format
  // *before* stripping whitespace, rejecting a pasted "  ama@example.com  " —
  // which users produce constantly. `.pipe()` enforces the order.
  email: z
    .string({ error: "Enter a valid email address" })
    .trim()
    .pipe(
      z
        .email({ error: "Enter a valid email address" })
        .max(EMAIL_MAX, { error: "Email address is too long" }),
    ),

  // Rejects both a missing topic and one that is not on the list above.
  topic: z.enum(CONTACT_TOPICS, { error: "Choose what this is about" }),

  message: z
    .string({ error: "Enter a message" })
    .trim()
    .min(MESSAGE_MIN, { error: "Message must be at least 10 characters" })
    .max(MESSAGE_MAX, { error: "Message is too long (5000 characters max)" }),

  // The marketing opt-in. An unchecked box submits nothing at all, so absent
  // has to mean false rather than invalid.
  updates: z.boolean().default(false),
});

type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

/** One message per field — what the form renders under each input. */
type ContactFieldErrors = Partial<Record<keyof ContactSubmission, string>>;

type ContactParseResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; errors: ContactFieldErrors };

/**
 * Validate an untrusted submission.
 *
 * Wrapping `safeParse` rather than exporting the schema keeps zod an
 * implementation detail: callers get a plain `{ ok, data | errors }` shape and
 * never touch a ZodError. zod reports every failed check per field; the UI only
 * has room for one line, so we keep the first.
 */
function parseContactSubmission(input: unknown): ContactParseResult {
  const result = contactSubmissionSchema.safeParse(input);

  if (result.success) {
    return { ok: true, data: result.data };
  }

  const fieldErrors = z.flattenError(result.error).fieldErrors;
  const errors: ContactFieldErrors = {};

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const first = messages?.[0];
    if (first) errors[field as keyof ContactSubmission] = first;
  }

  return { ok: false, errors };
}

export {
  CONTACT_TOPICS,
  EMAIL_MAX,
  MESSAGE_MAX,
  MESSAGE_MIN,
  parseContactSubmission,
  type ContactFieldErrors,
  type ContactParseResult,
  type ContactSubmission,
  type ContactTopic,
};
