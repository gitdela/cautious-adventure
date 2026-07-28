import type { ContentAdapters } from '../adapters'
import { formatDate } from '../format'
import type { LegalDocumentView } from '../types'
import { PortableContent } from '../portable-content'

/**
 * Renders a single legal version. `versionNotice` is used by the per-version
 * (`/{kind}/v/{version}`) route to make clear the reader is viewing a specific,
 * possibly superseded, version rather than the current one.
 */
export function LegalDocumentPage({
  document,
  adapters,
  versionNotice,
}: {
  document: LegalDocumentView
  adapters: ContentAdapters
  versionNotice?: string
}) {
  return (
    <article className="mx-auto w-full max-w-[720px]">
      <header>
        <h1 className="text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {document.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Version <span className="num">{document.version}</span> · Effective{' '}
          <time dateTime={document.effectiveAt} className="num">
            {formatDate(document.effectiveAt)}
          </time>
          {document.jurisdiction ? ` · ${document.jurisdiction}` : ''}
        </p>
        {versionNotice ? (
          <div className="mt-4 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {versionNotice}
          </div>
        ) : null}
      </header>

      <PortableContent
        value={document.body}
        adapters={adapters}
        className="mt-8"
      />
    </article>
  )
}
