"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
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

const topics = [
  "Fuel and gasoline",
  "Lubricants and oils",
  "Fuel delivery",
  "Becoming a partner",
];

function HomeContactForm() {
  const [senderName, setSenderName] = useState<string | null>(null);

  if (senderName !== null) {
    return (
      <Card className="rounded-3xl py-0">
        <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-10 py-12 text-center">
          <h3 className="font-display text-[24px] font-bold text-navy-900">
            Thanks, {senderName || "there"} — message received.
          </h3>
          <p className="mt-3 text-muted-foreground">
            A member of the team replies within one working day.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSenderName(null)}
          >
            Send another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl py-0">
      <CardHeader className="px-10 pt-10 pb-0">
        <CardTitle className="text-[24px]">Write us a message</CardTitle>
      </CardHeader>
      <CardContent className="px-10 pt-8 pb-10">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setSenderName(String(formData.get("name") ?? ""));
          }}
        >
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="contact-name">Your name</FieldLabel>
              <Input id="contact-name" name="name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-email">Your email</FieldLabel>
              <Input id="contact-email" name="email" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-topic">
                What can we help with?
              </FieldLabel>
              <Select name="topic">
                <SelectTrigger id="contact-topic" className="w-full">
                  <SelectValue placeholder={topics[0]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-message">Your message</FieldLabel>
              <Textarea id="contact-message" name="message" rows={6} />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="contact-updates" name="updates" />
              <FieldLabel htmlFor="contact-updates">
                Send me operational updates from Petrosol
              </FieldLabel>
            </Field>
            <Field>
              <Button type="submit" className="w-fit">
                Submit
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export { HomeContactForm };
