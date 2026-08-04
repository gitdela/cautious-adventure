import Link from "next/link";

import type { BlogPostSummary } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { NewsListing } from "./news-listing";

function NewsPageHeader() {
  return (
    <PageHeader
      title="News"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Media" },
            { label: "News" },
          ]}
        />
      }
    />
  );
}

function NewsCta() {
  return (
    <section className="rounded-tr-[120px] bg-surface-inverse py-[var(--section-y-tight)]">
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Media enquiries"
          highlight="press team"
        >
          Speak to our
        </SectionHeading>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/gallery">View the gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function NewsSections({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <main>
      <NewsPageHeader />
      <NewsListing posts={posts} />
      <NewsCta />
    </main>
  );
}

export { NewsSections };
