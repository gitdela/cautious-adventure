import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'
import { schemaTypes } from '@workspace/cms/schema'

import { deskStructure } from './structure'
import { documentActions } from './legal-actions'

// Studio runs under Vite; SANITY_STUDIO_* vars are exposed on import.meta.env.
// The schema registry is the single source of truth shared with TypeGen and the
// product apps via @workspace/cms/schema.
const env = import.meta.env as Record<string, string | undefined>
const apiVersion = resolveSanityApiVersion(env)

// Vision (the GROQ playground) is a developer/admin tool. Keep it out of the
// production editorial workspace; enable it only in local dev.
const isDev = Boolean(import.meta.env.DEV)

export default defineConfig({
  name: 'default',
  title: 'Petrosol Studio',
  projectId: resolveSanityProjectId(env),
  dataset: resolveSanityDataset(env),
  plugins: [
    structureTool({ structure: deskStructure }),
    ...(isDev ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: documentActions,
  },
})
