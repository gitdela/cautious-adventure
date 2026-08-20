"use client";

import { useState } from "react";
import { RiCheckLine, RiErrorWarningLine } from "@remixicon/react";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";

import { CONTACT_TOPICS } from "@/lib/contact/schema";
import { useContactSubmit } from "@/lib/contact/use-contact-submit";

import { TurnstileWidget } from "../turnstile-widget";

function ContactMessageForm({ siteKey }: { siteKey: string }) {
  const {
    status,
    errors,
    formError,
    tokenReady,
    handleToken,
    handleTokenCleared,
    submit,
    reset,
  } = useContactSubmit();

  // `topic` and `updates` are controlled rather than read from FormData: they
  // render as Radix primitives, and depending on their hidden-input behaviour
  // to populate FormData is a subtlety this form does not need to inherit.
  const [topic, setTopic] = useState("");
  const [updates, setUpdates] = useState(false);

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <Card className="rounded-xl py-0">
        <CardContent
          aria-live="polite"
          className="flex min-h-[520px] flex-col items-center justify-center gap-4 p-[var(--card-pad)] text-center"
        >
          <span className="inline-grid size-14 place-items-center rounded-full bg-success text-white [&_svg]:size-7">
            <RiCheckLine aria-hidden="true" />
          </span>
          <h2 className="font-display text-[24px] font-bold text-navy-900">
            Message received
          </h2>
          <p className="max-w-[36ch]">
            Thanks for reaching out &mdash; our team will get back to you within
            one business day.
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              setTopic("");
              setUpdates(false);
              reset();
            }}
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl py-0">
      <CardContent className="p-[var(--card-pad)]">
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void submit({
              name: data.get("name"),
              email: data.get("email"),
              message: data.get("message"),
              topic,
              updates,
            });
          }}
        >
          <FieldGroup className="gap-5">
            <Field data-invalid={Boolean(errors.name) || undefined}>
              <FieldLabel htmlFor="contact-page-name">Your name</FieldLabel>
              <Input
                id="contact-page-name"
                name="name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name) || undefined}
                disabled={submitting}
              />
              {errors.name ? <FieldError>{errors.name}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.email) || undefined}>
              <FieldLabel htmlFor="contact-page-email">Your email</FieldLabel>
              <Input
                id="contact-page-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email) || undefined}
                disabled={submitting}
              />
              {errors.email ? <FieldError>{errors.email}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.topic) || undefined}>
              <FieldLabel htmlFor="contact-page-topic">
                What can we help with?
              </FieldLabel>
              <Select value={topic} onValueChange={setTopic} disabled={submitting}>
                <SelectTrigger
                  id="contact-page-topic"
                  className="w-full"
                  aria-invalid={Boolean(errors.topic) || undefined}
                >
                  {/* A real placeholder. Previously this showed the first topic,
                      so the field looked answered while submitting nothing. */}
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CONTACT_TOPICS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.topic ? <FieldError>{errors.topic}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.message) || undefined}>
              <FieldLabel htmlFor="contact-page-message">Message</FieldLabel>
              <Textarea
                id="contact-page-message"
                name="message"
                rows={6}
                aria-invalid={Boolean(errors.message) || undefined}
                disabled={submitting}
              />
              {errors.message ? <FieldError>{errors.message}</FieldError> : null}
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="contact-page-updates"
                checked={updates}
                onCheckedChange={(next) => setUpdates(next === true)}
                disabled={submitting}
              />
              <FieldLabel htmlFor="contact-page-updates">
                Send me operational updates from PETROSOL
              </FieldLabel>
            </Field>

            <TurnstileWidget
              siteKey={siteKey}
              onToken={handleToken}
              onTokenCleared={handleTokenCleared}
            />

            {formError ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-[13px] text-destructive"
              >
                <RiErrorWarningLine
                  aria-hidden="true"
                  className="mt-px size-4 shrink-0"
                />
                <span>{formError}</span>
              </div>
            ) : null}

            <Field>
              <Button
                type="submit"
                className="w-fit self-start"
                // Disabled until Turnstile issues a token: submitting without
                // one is a guaranteed 403, so the click is worse than useless.
                disabled={submitting || !tokenReady}
                // `submitting || !tokenReady` is always a boolean, so React
                // cannot itself render `disabled={null}` — yet hydration
                // reported exactly that against server HTML that provably
                // contains `disabled=""`. The attribute is therefore being
                // stripped from the DOM before React boots, which is what
                // password-manager and autofill extensions do to disabled
                // submit buttons on forms carrying name/email fields.
                //
                // This silences the resulting dev warning for this element
                // only. It does not paper over a real mismatch: the value is
                // deterministic on both sides. The submit handler independently
                // refuses to post without a token, so a button left clickable
                // by such an extension still cannot fire a doomed request.
                suppressHydrationWarning
              >
                {submitting ? "Sending…" : "Send message"}
              </Button>
              <FieldDescription className="text-[12px]" aria-live="polite">
                {tokenReady
                  ? "We respect your privacy. Your information will not be shared with third parties."
                  : "Running a quick security check…"}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export { ContactMessageForm };
