import type { DocumentActionsResolver } from 'sanity'

/**
 * Guardrail for legal documents: strip the `delete` and `unpublish` actions so
 * an approved, effective legal version can't be casually removed. Publishing a
 * replacement is done by creating a NEW version and marking the old one
 * `superseded` — never by unpublishing or deleting the record that users may
 * have accepted.
 *
 * This is the code-side guardrail. Real per-role enforcement (only the
 * legal/compliance publisher may approve/publish) is a server-side Sanity role
 * and is configured in project membership, not here. Removing a draft that was
 * created in error is an admin action via the CLI/API.
 */
export const documentActions: DocumentActionsResolver = (prev, context) => {
  if (context.schemaType !== 'legalDocument') return prev
  return prev.filter(
    (action) => action.action !== 'delete' && action.action !== 'unpublish',
  )
}
