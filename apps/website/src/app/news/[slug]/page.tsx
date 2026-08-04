import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { resolveWebsiteUrl } from "@workspace/config/env";
import { BlogPostView, pickRelated } from "@workspace/content";

import { contentAdapters } from "@/lib/content-adapters";
import { JsonLd } from "@/lib/json-ld";
import { getBlogPost, getBlogPosts } from "@/lib/sanity/data";

import { ArticleProgress } from "./article-islands";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: { absolute: `${post.title} — PETROSOL` },
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const all = await getBlogPosts(1);
  const related = pickRelated(all, post, 3);

  const base = resolveWebsiteUrl(process.env).replace(/\/$/, "");
  const shareUrl = `${base}/news/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: shareUrl,
    publisher: { "@type": "Organization", name: "PETROSOL", url: base },
    ...(post.author?.name
      ? { author: { "@type": "Person", name: post.author.name } }
      : {}),
  };

  return (
    <main>
      <ArticleProgress />
      <JsonLd data={jsonLd} />
      <BlogPostView
        post={post}
        related={related}
        adapters={contentAdapters}
        blogHref="/news"
        basePath="/news"
        listLabel="News"
        shareUrl={shareUrl}
      />
    </main>
  );
}
