import Link from "next/link";

import type { BlogPostSummary } from "@workspace/content";
import { Button } from "@workspace/ui/components/button";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { MosaicPageHeader } from "../mosaic-page-header";

import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { NewsListing } from "./news-listing";

function NewsPageHeader() {
  return (
    <MosaicPageHeader
      title="Blog"
      breadcrumbs={
        <SiteBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog & Events" },
            { label: "Blog" },
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
            <Link href="/contact-us">Contact us</Link>
          </Button>
          <Button asChild variant="outlineInverse">
            <Link href="/events">View events</Link>
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
