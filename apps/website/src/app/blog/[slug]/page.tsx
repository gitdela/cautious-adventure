import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { resolveWebsiteUrl } from "@workspace/config/env";
import { BlogPostView, pickRelated } from "@workspace/content";

import { contentAdapters } from "@/lib/content-adapters";
import { JsonLd } from "@/lib/json-ld";
import { getBlogPost, getBlogPosts } from "@/lib/sanity/data";

import { ArticleProgress } from "../../news/[slug]/article-islands";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: { absolute: `${post.title} | PETROSOL` },
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
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

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const all = await getBlogPosts(1);
  const related = pickRelated(all, post, 3);

  const base = resolveWebsiteUrl(process.env).replace(/\/$/, "");
  const shareUrl = `${base}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
        blogHref="/blog"
        basePath="/blog"
        listLabel="Blog"
        shareUrl={shareUrl}
      />
    </main>
  );
}
