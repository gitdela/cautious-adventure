import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PortableContent } from './portable-content'
import { richBody, testAdapters } from './__fixtures__'

describe('PortableContent', () => {
  it('renders block styles as semantic headings', () => {
    render(<PortableContent value={richBody} adapters={testAdapters} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Section heading')
  })

  it('hardens external links with target and safe rel', () => {
    render(<PortableContent value={richBody} adapters={testAdapters} />)
    const link = screen.getByText('external link').closest('a')!
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(link.getAttribute('rel')).toContain('noreferrer')
    expect(link.getAttribute('rel')).toContain('nofollow')
  })

  it('routes internal links through the injected Link adapter', () => {
    render(<PortableContent value={richBody} adapters={testAdapters} />)
    const link = screen.getByText('internal link').closest('a')!
    expect(link).toHaveAttribute('href', '/learn/wallets')
    expect(link).toHaveAttribute('data-adapter', 'link')
    // internal links must NOT get the external target
    expect(link).not.toHaveAttribute('target', '_blank')
  })
})
