import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { resolveWebsiteUrl } from "@workspace/config/env";
import { BlogPostView, pickRelated } from "@workspace/content";

import { contentAdapters } from "@/lib/content-adapters";
import { JsonLd } from "@/lib/json-ld";
import { getBlogPost, getBlogPosts, getBlogSlugs } from "@/lib/sanity/data";

type Props = { params: Promise<{ slug: string }> };

// Generate the known posts at build; long-tail posts render on first request.
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // Tolerate an unreachable/unconfigured CMS at build time — every post then
    // renders on first request via dynamicParams instead of failing the build.
    console.warn("[website] generateStaticParams: CMS unreachable, skipping prerender");
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
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

export default async function BlogPostRoute({ params }: Props) {
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
    publisher: { "@type": "Organization", name: "Petrosol", url: base },
    ...(post.author?.name
      ? { author: { "@type": "Person", name: post.author.name } }
      : {}),
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <BlogPostView
        post={post}
        related={related}
        adapters={contentAdapters}
        blogHref="/blog"
        basePath="/blog"
        shareUrl={shareUrl}
      />
    </main>
  );
}
