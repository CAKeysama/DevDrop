// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

afterEach(cleanup)

describe('SegmentedControl', () => {
  it('keeps the selected option readable under the pointer', () => {
    // `hover:text-ink` would otherwise paint dark text on the dark selected pill. jsdom has no
    // :hover, so the guard is the class that overrides it for the checked option.
    render(<SegmentedControl label="Modo" value="a" onChange={() => undefined} options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />)
    const pill = screen.getByRole('radio', { name: 'A' }).nextElementSibling!
    expect(pill.className).toContain('hover:text-ink')
    expect(pill.className).toContain('peer-checked:hover:text-white')
  })
})
