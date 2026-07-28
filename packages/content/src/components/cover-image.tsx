import { cn } from '@workspace/ui/lib/utils'

import type { ContentAdapters } from '../adapters'
import type { ContentImageValue } from '../types'

/**
 * Renders a cover image through the app's Image adapter, or a neutral labelled
 * placeholder when no image is set (seeded/draft content often has none yet).
 */
export function CoverImage({
  image,
  label,
  adapters,
  className,
  width = 800,
  height = 500,
  priority,
}: {
  image?: ContentImageValue | null
  label?: string | null
  adapters: ContentAdapters
  className?: string
  width?: number
  height?: number
  priority?: boolean
}) {
  const { Image } = adapters

  if (image) {
    return (
      <div className={cn('overflow-hidden rounded-xl border bg-muted', className)}>
        <Image
          source={image}
          alt={image.alt ?? label ?? ''}
          width={width}
          height={height}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-muted to-muted/30',
        className,
      )}
    >
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/40">
        {label ?? 'Petrosol'}
      </span>
    </div>
  )
}
