// Studio runs under Vite: SANITY_STUDIO_* vars are exposed on import.meta.env.
// Declared locally so `tsc --noEmit` passes without depending on vite/client
// types (the Sanity CLI bundles its own Vite).
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly MODE: string
  readonly [key: string]: string | boolean | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
