"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import {
  configureSanityClient,
  type SanityClientConfig,
} from "@workspace/cms/browser";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { useState, type ReactNode } from "react";

import { createAppQueryClient } from "@/lib/query-client";

type ProvidersProps = {
  children: ReactNode;
  sanityConfig: SanityClientConfig;
};

export function Providers({ children, sanityConfig }: ProvidersProps) {
  // Configure the tokenless published client in the browser so interactive
  // client components (e.g. the blog filter) can build image URLs. Public,
  // token-free — the server configures its own copy in the layout.
  configureSanityClient(sanityConfig);

  const [queryClient] = useState(createAppQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}
