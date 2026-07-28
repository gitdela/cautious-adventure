import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { resolveWebsiteUrl } from "@workspace/config/env";
import { Badge } from "@workspace/ui/components/badge";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { PageHeader } from "@workspace/ui/components/page-header";

import { SiteBreadcrumbs } from "../../site-breadcrumbs";
import {
  getArticle,
  getRelated,
  newsArticles,
  readingMinutes,
  type NewsArticle,
} from "../news-data";
import { ArticleProgress, ArticleTimeline, ShareRow } from "./article-islands";

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: { absolute: `${article.title} — PETROSOL` },
    description: article.lead,
    alternates: { canonical: `/news/${article.slug}` },
  };
}

function ArticleBody({ article, shareUrl }: { article: NewsArticle; shareUrl: string }) {
  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{article.tag}</Badge>
        <span className="font-mono text-[12px] text-muted-foreground">
          <time dateTime={article.dateISO}>{article.date}</time> &middot;{" "}
          {readingMinutes(article)} min read
        </span>
      </div>
      <h1 className="mt-5 font-display text-[length:var(--size-display-md)] leading-[1.14] font-bold tracking-[-0.02em] text-pretty text-navy-900">
        {article.title}
      </h1>
      <div className="my-8 aspect-video overflow-hidden rounded-2xl">
        <ImagePlaceholder label={`Drop a photo — ${article.title.slice(0, 40)}…`} />
      </div>
      <p className="text-[17px] leading-[1.62] font-semibold text-navy-900">
        {article.lead}
      </p>
      {article.sections.map((section, index) => (
        <section key={section.heading} id={`sec-${index}`} className="mt-7 scroll-mt-30">
          <h2 className="mb-3 font-display text-[clamp(20px,2.4vw,26px)] leading-[1.3] font-bold text-navy-900">
            {section.heading}
          </h2>
          <p className="text-[17px] leading-[1.62]">{section.body}</p>
        </section>
      ))}
      <div className="mt-12 border-t border-border pt-6">
        <ShareRow url={shareUrl} title={article.title} />
      </div>
    </article>
  );
}

function RelatedStories({ article }: { article: NewsArticle }) {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y-tight)]">
      <div className="ps-container">
        <SectionHeading eyebrow="Keep reading" highlight="the newsroom">
          Related stories from
        </SectionHeading>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {getRelated(article).map((related) => (
            <Link
              key={related.slug}
              href={`/news/${related.slug}`}
              className="group flex flex-col gap-3 rounded-2xl bg-background p-[var(--card-pad)] shadow-card transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1"
            >
              <span className="flex items-center gap-3">
                <Badge>{related.tag}</Badge>
                <time
                  dateTime={related.dateISO}
                  className="font-mono text-[12px] text-muted-foreground"
                >
                  {related.date}
                </time>
              </span>
              <span className="font-display text-[18px] leading-[1.3] font-bold text-navy-900 transition-colors group-hover:text-brand">
                {related.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const base = resolveWebsiteUrl(process.env).replace(/\/$/, "");
  const shareUrl = `${base}/news/${article.slug}`;

  return (
    <main>
      <ArticleProgress />
      <PageHeader
        title="Newsroom"
        titleAs="p"
        breadcrumbs={
          <SiteBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Media" },
              { label: "News", href: "/news" },
            ]}
          />
        }
      />
      <section className="ps-container grid items-start gap-[clamp(40px,5vw,80px)] py-[var(--section-y-tight)] min-[901px]:grid-cols-[minmax(0,7fr)_minmax(260px,3fr)]">
        <ArticleBody article={article} shareUrl={shareUrl} />
        <ArticleTimeline
          headings={article.sections.map((section) => section.heading)}
        />
      </section>
      <RelatedStories article={article} />
    </main>
  );
}
