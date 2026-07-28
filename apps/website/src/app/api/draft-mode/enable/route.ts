import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

// Only these content areas may be previewed; blocks open-redirect abuse of the
// draft-enable endpoint.
const ALLOWED_PREFIXES = ["/blog", "/help", "/about", "/privacy", "/terms"];

function isAllowedRedirect(target: string): boolean {
  // Relative-only. Reject protocol-relative ("//evil.com") and absolute URLs.
  if (!target.startsWith("/") || target.startsWith("//")) return false;
  if (target === "/") return true;
  return ALLOWED_PREFIXES.some(
    (p) => target === p || target.startsWith(`${p}/`),
  );
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/";

  const expected = process.env.SANITY_PREVIEW_SECRET;
  if (!expected) {
    return new Response("Preview is not configured", { status: 500 });
  }
  if (!secret || secret !== expected) {
    return new Response("Invalid preview secret", { status: 401 });
  }
  if (!isAllowedRedirect(redirectTo)) {
    return new Response("Redirect target not allowed", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(redirectTo);
}
