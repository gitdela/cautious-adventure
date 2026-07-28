import {
  assertIsoDate,
  assertLegalVersion,
  assertSlug,
} from "@workspace/cms/validation";
import type {
  PageBySlugQueryResult,
  PostBySlugQueryResult,
  PostListQueryResult,
} from "@workspace/cms/types";

import type { CompanyPageSection } from "./components/company-page";
import type {
  BlogPostFull,
  BlogPostSummary,
  ContentImageValue,
  LegalDocumentView,
  PortableTextBlock,
} from "./types";

/**
 * The single set of CMS-result → view-model mappers, shared by every app that
 * renders content so all surfaces shape it identically. Load-bearing fields
 * (slug, date, legal version) are asserted at this boundary; image/body/section
 * shapes are cast — the URL builder and Portable Text renderer accept the raw
 * shapes.
 */

// --- Blog ---
type PostListItem = NonNullable<PostListQueryResult>[number];

export function toBlogSummary(p: PostListItem): BlogPostSummary {
  return {
    slug: assertSlug(p.slug),
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: assertIsoDate(p.publishedAt),
    category: p.category?.title
      ? { title: p.category.title, slug: p.category.slug ?? null }
      : null,
    author: p.author?.name
      ? {
          name: p.author.name,
          slug: p.author.slug ?? null,
          avatar: (p.author.avatar as ContentImageValue | null) ?? null,
        }
      : null,
    readMinutes: null,
    coverImage: (p.coverImage as ContentImageValue | null) ?? null,
  };
}

export function toBlogFull(p: NonNullable<PostBySlugQueryResult>): BlogPostFull {
  return {
    slug: assertSlug(p.slug),
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: assertIsoDate(p.publishedAt),
    updatedAt: p.updatedAt ?? null,
    category: p.category?.title
      ? { title: p.category.title, slug: p.category.slug ?? null }
      : null,
    author: p.author?.name
      ? {
          name: p.author.name,
          slug: p.author.slug ?? null,
          avatar: (p.author.avatar as ContentImageValue | null) ?? null,
          bio: p.author.bio ?? null,
        }
      : null,
    readMinutes: null,
    coverImage: (p.coverImage as ContentImageValue | null) ?? null,
    body: (p.body ?? []) as unknown as PortableTextBlock[],
  };
}

// --- Legal (accepts both the current and per-version projections) ---
type LegalLike = {
  documentKind: string;
  title: string;
  version: string;
  effectiveAt: string;
  jurisdiction?: string | null;
  body: unknown;
};

export function toLegalView(d: LegalLike): LegalDocumentView {
  return {
    documentKind: d.documentKind,
    title: d.title,
    version: assertLegalVersion(d.version),
    effectiveAt: assertIsoDate(d.effectiveAt),
    jurisdiction: d.jurisdiction ?? null,
    body: (d.body ?? []) as unknown as PortableTextBlock[],
  };
}

// --- Company page ---
export function toCompanyPage(p: NonNullable<PageBySlugQueryResult>): {
  title: string;
  sections: CompanyPageSection[];
} {
  return {
    title: p.title,
    sections: (p.sections ?? []) as unknown as CompanyPageSection[],
  };
}
