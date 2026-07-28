"use client";

import { useState } from "react";
import { RiCheckLine } from "@remixicon/react";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldDescription,
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

const contactTopics = [
  "Fuel and gasoline",
  "Lubricants and oils",
  "Fuel delivery",
  "Station franchising",
  "Careers",
  "Media and press",
  "Something else",
];

function ContactMessageForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
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
          <Button variant="outline" className="mt-2" onClick={() => setSent(false)}>
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
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="contact-page-name">Your name</FieldLabel>
              <Input id="contact-page-name" name="name" autoComplete="name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-page-email">Your email</FieldLabel>
              <Input
                id="contact-page-email"
                name="email"
                type="email"
                autoComplete="email"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-page-topic">
                What can we help with?
              </FieldLabel>
              <Select name="topic">
                <SelectTrigger id="contact-page-topic" className="w-full">
                  <SelectValue placeholder={contactTopics[0]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {contactTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-page-message">Message</FieldLabel>
              <Textarea id="contact-page-message" name="message" rows={6} />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="contact-page-updates" name="updates" />
              <FieldLabel htmlFor="contact-page-updates">
                Send me operational updates from PETROSOL
              </FieldLabel>
            </Field>
            <Field>
              <Button type="submit" className="w-fit self-start">
                Send message
              </Button>
              <FieldDescription className="text-[12px]">
                We respect your privacy. Your information will not be shared with
                third parties.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export { ContactMessageForm };
