"use client";

import { useCallback, useState } from "react";

import { parseContactSubmission, type ContactFieldErrors } from "./schema";

/**
 * Submit logic for the contact form.
 *
 * Shares logic, not state — each form calling this gets its own instance and
 * keeps its own markup and success copy.
 *
 * Validation runs twice by design: here for instant inline errors with no round
 * trip, and again in the route handler, which is the copy that actually counts.
 */

const ENDPOINT = "/api/contact";

type ContactSubmitStatus = "idle" | "submitting" | "success" | "error";

type ContactErrorResponse = {
  ok?: boolean;
  error?: string;
  errors?: ContactFieldErrors;
};

/**
 * Visitor-facing copy for a failure. Deliberately never echoes the server's
 * internal reason — `not-configured` is our problem, not something to explain
 * to someone trying to ask about diesel prices.
 */
function messageForError(error: string | undefined): string {
  switch (error) {
    case "verification-expired":
      return "That took a while, so the security check expired. Please send again.";
    case "verification-failed":
      return "We couldn't verify your browser. Refresh the page and try again.";
    case "send-failed":
      return "We couldn't deliver your message just now. Please try again in a moment.";
    default:
      return "Something went wrong sending your message. Please try again.";
  }
}

function useContactSubmit() {
  const [status, setStatus] = useState<ContactSubmitStatus>("idle");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Stable identities: these are passed to the Turnstile widget, which holds
  // them across its lifetime.
  const handleToken = useCallback((next: string) => setToken(next), []);
  const handleTokenCleared = useCallback(() => setToken(null), []);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrors({});
    setFormError(null);
  }, []);

  const submit = useCallback(
    async (values: Record<string, unknown>) => {
      const parsed = parseContactSubmission(values);
      if (!parsed.ok) {
        setErrors(parsed.errors);
        setFormError(null);
        setStatus("error");
        return;
      }

      // The submit button is disabled until a token arrives, so this is a
      // belt-and-braces guard rather than an expected path.
      if (!token) {
        setFormError("Still running the security check — try again in a moment.");
        setStatus("error");
        return;
      }

      setStatus("submitting");
      setErrors({});
      setFormError(null);

      let response: Response;
      try {
        response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...parsed.data, turnstileToken: token }),
        });
      } catch {
        setFormError("Couldn't reach the server. Check your connection and try again.");
        setStatus("error");
        return;
      }

      const payload = (await response
        .json()
        .catch(() => null)) as ContactErrorResponse | null;

      if (response.ok && payload?.ok) {
        setStatus("success");
        return;
      }

      // Field-level errors render inline; anything else becomes one banner.
      if (payload?.error === "invalid" && payload.errors) {
        setErrors(payload.errors);
        setStatus("error");
        return;
      }

      setFormError(messageForError(payload?.error));
      setStatus("error");
    },
    [token],
  );

  return {
    status,
    errors,
    formError,
    /** False until Turnstile issues a token; gates the submit button. */
    tokenReady: token !== null,
    handleToken,
    handleTokenCleared,
    submit,
    reset,
  };
}

export { messageForError, useContactSubmit, type ContactSubmitStatus };
