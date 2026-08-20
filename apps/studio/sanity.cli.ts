import { defineCliConfig } from 'sanity/cli'

import {
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

// The Sanity CLI runs under Node and auto-loads SANITY_STUDIO_* from .env files
// into process.env. Config resolution is shared with the product apps via
// @workspace/config so dataset/project validation is identical everywhere.
export default defineCliConfig({
  api: {
    projectId: resolveSanityProjectId(process.env),
    dataset: resolveSanityDataset(process.env),
  },
  studioHost: 'petrosol',
  deployment: {
    appId: 'qmoa0p3mhg3wgc398ntogcsf',
  },
})
