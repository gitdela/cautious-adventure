"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Cloudflare Turnstile widget, rendered explicitly.
 *
 * Explicit rendering (`?render=explicit`) rather than the automatic `.cf-turnstile`
 * class scan: the automatic mode looks for its container at script-load time,
 * which races React's mount and leaves nothing rendered on a client-side
 * navigation back to the page.
 *
 * The widget is a non-React library writing into a DOM node we own, so mounting
 * it in an effect with a `remove()` cleanup is the correct escape hatch (step 5
 * of the CLAUDE.md effects ladder), not a workaround.
 */

/** The subset of the Turnstile browser API this component uses. */
type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      "timeout-callback": () => void;
      theme?: "auto" | "light" | "dark";
      size?: "normal" | "flexible" | "compact";
    },
  ) => string | undefined;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileWidgetProps = {
  siteKey: string;
  /** Fires with a fresh token, and again after every silent refresh. */
  onToken: (token: string) => void;
  /**
   * Fires when the current token stops being usable — expiry, an execution
   * error, or a challenge timeout. The parent should clear any token it holds;
   * the widget has already asked Cloudflare for a replacement.
   */
  onTokenCleared?: () => void;
  className?: string;
};

function TurnstileWidget({
  siteKey,
  onToken,
  onTokenCleared,
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  // Callbacks live in a ref so a parent re-rendering with new closures cannot
  // tear down and re-create the widget — which would flash the challenge and
  // discard a perfectly good token mid-form-fill.
  const handlersRef = useRef({ onToken, onTokenCleared });
  useEffect(() => {
    handlersRef.current = { onToken, onTokenCleared };
  });

  useEffect(() => {
    const api = window.turnstile;
    const container = containerRef.current;
    if (!scriptReady || !api || !container) return;

    /**
     * A token is single-use and expires after ~5 minutes. Someone composing a
     * real enquiry will routinely outlast that, so expiry silently asks for a
     * replacement instead of surfacing an error. Without this the form rejects
     * legitimate messages from anyone who types slowly.
     *
     * Reads `widgetId` from the closure below — these callbacks only ever fire
     * after `render` has returned and assigned it.
     */
    const refresh = () => {
      handlersRef.current.onTokenCleared?.();
      if (widgetId) api.reset(widgetId);
    };

    const widgetId = api.render(container, {
      sitekey: siteKey,
      callback: (token: string) => handlersRef.current.onToken(token),
      "error-callback": refresh,
      "expired-callback": refresh,
      "timeout-callback": refresh,
      theme: "auto",
      // The widget renders inside a fixed-width iframe, so a full-width
      // container alone would not stretch it — `flexible` is what makes it
      // fill the available width (Cloudflare enforces a 300px minimum).
      size: "flexible",
    });

    return () => {
      // `remove` deliberately fires no callbacks, so this cannot re-enter the
      // handlers above during unmount.
      if (widgetId) api.remove(widgetId);
    };
  }, [scriptReady, siteKey]);

  return (
    <>
      <Script
        src={TURNSTILE_SCRIPT}
        strategy="afterInteractive"
        // `onReady` (not `onLoad`) fires on every mount, including ones where
        // the script is already cached from an earlier page in the session.
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className={cn("min-h-[65px] w-full", className)} />
    </>
  );
}

export { TurnstileWidget };
