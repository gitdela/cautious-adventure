import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Mirrors the `@/*` → `./src/*` mapping in tsconfig.json. Next resolves that
// alias itself; vitest needs it declared here to import route handlers and the
// modules they pull in.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
