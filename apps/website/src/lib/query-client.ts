import { QueryClient } from "@tanstack/react-query";

/**
 * App-local QueryClient factory. When `packages/api` arrives (first
 * authenticated call), its `createAppQueryClient` supersedes this one so the
 * website and webapp share defaults.
 */
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
