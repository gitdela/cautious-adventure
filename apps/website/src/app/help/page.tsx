import type { Metadata } from "next";

import { FaqSection, type FaqItem, type PortableTextBlock } from "@workspace/content";

import { contentAdapters } from "@/lib/content-adapters";

export const metadata: Metadata = {
  title: "Help center",
  description: "Answers to common questions about Petrosol.",
  alternates: { canonical: "/help" },
};

/**
 * Static help page. FAQs are code-owned placeholder content for now; when a
 * real help surface ships, add `faq`/`helpCategory` document types to
 * `@workspace/cms/schema` and source these from Sanity instead.
 */
function answer(id: string, text: string): PortableTextBlock[] {
  return [
    {
      _type: "block",
      _key: id,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `${id}s`, text, marks: [] }],
    },
  ] as unknown as PortableTextBlock[];
}

const faqs: FaqItem[] = [
  {
    question: "What is Petrosol?",
    answer: answer("faq-what", "Placeholder answer describing the product."),
  },
  {
    question: "How do I get started?",
    answer: answer("faq-start", "Placeholder answer describing the first steps."),
  },
  {
    question: "How do I contact the team?",
    answer: answer("faq-contact", "Email hello@petrosol.example and we will get back to you."),
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-12 lg:px-10 lg:py-20">
      <header className="pb-10">
        <h1 className="text-[32px] font-semibold leading-tight tracking-tight sm:text-[44px]">
          Help center
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          The questions we answer most often.
        </p>
      </header>

      <FaqSection
        items={faqs}
        adapters={contentAdapters}
        title="Frequently asked"
      />
    </main>
  );
}
