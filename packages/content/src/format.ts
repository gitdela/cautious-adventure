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

const pumpDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const cedisFormatter = new Intl.NumberFormat('en-GH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * "27 Jul 2026" — the date a pump-price board was last published. Shared by the
 * home hero totem and the fuel page's price band so the two never disagree
 * about how a date looks.
 */
export function formatPumpDate(iso: string): string {
  return pumpDateFormatter.format(new Date(iso))
}

/** "₵9.80" — a pump price, always to two decimals. */
export function formatCedis(amount: number): string {
  return `₵${cedisFormatter.format(amount)}`
}

/**
 * Title-cases the prose words in a lubricant grade — "SAE 0W-20 · full
 * synthetic" → "SAE 0W-20 · Full Synthetic" — so the badge reads consistently
 * however an editor typed it.
 *
 * A word is only touched when it carries no uppercase letter and no digit,
 * which is what keeps the specification codes intact: SAE, 4T, 0W-20, VI, DOT
 * and ACEA all already fail that test, and so does anything an editor has
 * deliberately capitalised.
 */
export function formatGrade(grade: string): string {
  return grade
    .split(' ')
    .map((word) =>
      /[A-Z0-9]/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}
