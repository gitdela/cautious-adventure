/**
 * Formats an ISO date as "May 22, 2026". Returns '' for missing/invalid input
 * so a component can decide whether to render the byline dot separators.
 */
export function formatDate(iso?: string | null): string {
  if (!iso) return ''
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return ''
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(t))
}

/** "6 min read" / "" when unknown. */
export function formatReadTime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return ''
  return `${minutes} min read`
}
