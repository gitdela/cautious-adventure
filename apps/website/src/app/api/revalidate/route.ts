import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";

import { cacheTags } from "@/lib/sanity/tags";

/**
 * Sanity → Next revalidation webhook.
 *
 * Configure the Sanity webhook to POST here with the projection:
 *   { "_type": _type, "_id": _id, "slug": slug.current,
 *     "prevSlug": before().slug.current, "kind": documentKind }
 * filtered to published documents only. We verify the signature against
 * SANITY_REVALIDATE_SECRET before trusting any field, map the document to
 * deterministic tags (including the previous slug on a slug change, and a
 * type-wide tag for delete safety), and revalidate. Idempotent and
 * mutation-free, so replayed deliveries are harmless.
 */
const MAX_BODY_BYTES = 100_000;

type WebhookDoc = {
  _type?: string;
  _id?: string;
  slug?: string;
  prevSlug?: string;
  kind?: string;
};

function tagsForDocument(doc: WebhookDoc): string[] {
  const t = doc._type;
  if (!t) return [];
  const tags = new Set<string>();

  switch (t) {
    case "post":
      tags.add(cacheTags.type("post"));
      tags.add(cacheTags.postList());
      if (doc.slug) tags.add(cacheTags.postSlug(doc.slug));
      if (doc.prevSlug) tags.add(cacheTags.postSlug(doc.prevSlug));
      break;
    case "page":
      tags.add(cacheTags.type("page"));
      if (doc.slug) tags.add(cacheTags.page(doc.slug));
      if (doc.prevSlug) tags.add(cacheTags.page(doc.prevSlug));
      break;
    case "legalDocument":
      tags.add(cacheTags.type("legalDocument"));
      if (doc.kind) tags.add(cacheTags.legal(doc.kind));
      break;
    case "pumpPrices":
      tags.add(cacheTags.type("pumpPrices"));
      tags.add(cacheTags.pumpPrices());
      break;
    // Author/category changes ripple into post projections.
    case "author":
    case "category":
      tags.add(cacheTags.type("post"));
      tags.add(cacheTags.postList());
      break;
    default:
      // Not an allowlisted, rendered type — no-op.
      return [];
  }
  return [...tags];
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new Response("Revalidation is not configured", { status: 500 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    return new Response("Missing signature", { status: 401 });
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return new Response("Payload too large", { status: 400 });
  }

  let valid = false;
  try {
    valid = await isValidSignature(body, signature, secret);
  } catch {
    valid = false;
  }
  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  let doc: WebhookDoc;
  try {
    doc = JSON.parse(body) as WebhookDoc;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const tags = tagsForDocument(doc);
  if (tags.length === 0) {
    // Valid signature, but a type we don't render. Acknowledge idempotently.
    return Response.json({ revalidated: false, reason: "unhandled type" });
  }

  try {
    for (const tag of tags) revalidateTag(tag, "max");
  } catch {
    // Signal failure so Sanity retries.
    console.error(
      JSON.stringify({ msg: "revalidate failed", type: doc._type, id: doc._id }),
    );
    return new Response("Revalidation failed", { status: 500 });
  }

  // PII-free structured log: ids/types/tags only, no payload contents.
  console.log(
    JSON.stringify({ msg: "revalidated", type: doc._type, id: doc._id, tags }),
  );
  return Response.json({ revalidated: true, tags });
}
