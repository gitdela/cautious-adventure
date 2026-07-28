import "server-only";

import { configureSanityClient } from "@workspace/cms/browser";
import { resolveSanityConfig } from "@workspace/config/env";

// Configure the tokenless published Sanity client once for server-side reads on
// the website — the canonical, SEO-indexed content surface. Mirrors the
// `configureApiClient` bootstrap: the CMS package never reads env itself; the
// app resolves a validated config and injects it. Called from the root layout
// so every server render has a configured published client.
//
// The token-aware draft client (Phase 4 preview) is created separately via
// `@workspace/cms/server` and is never configured here.
let configured = false;

export function ensureSanityConfigured(): void {
  if (configured) return;
  configureSanityClient(resolveSanityConfig(process.env));
  configured = true;
}
