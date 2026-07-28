import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FaqSection } from './components/faq-section'
import { ContentEmpty } from './states'
import { sampleFaqs, testAdapters } from './__fixtures__'

describe('FaqSection', () => {
  it('renders each question', () => {
    render(<FaqSection items={sampleFaqs} adapters={testAdapters} title="FAQ" />)
    expect(
      screen.getByText('How long does verification take?'),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'FAQ' })).toBeInTheDocument()
  })

  it('shows an empty state with no items', () => {
    render(<FaqSection items={[]} adapters={testAdapters} />)
    expect(screen.getByText(/no questions yet/i)).toBeInTheDocument()
  })
})

describe('ContentEmpty', () => {
  it('renders title and description', () => {
    render(<ContentEmpty title="Nothing" description="Come back later" />)
    expect(screen.getByText('Nothing')).toBeInTheDocument()
    expect(screen.getByText('Come back later')).toBeInTheDocument()
  })
})
