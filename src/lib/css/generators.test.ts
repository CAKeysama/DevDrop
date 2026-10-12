import { describe, expect, it } from 'vitest'
import { borderCss, buildBoxShadow, buildGradient, defaultBorder, defaultShadow, hexToRgba, normalizeHex, shadowCss } from './generators'

describe('CSS builders', () => {
  it('converts colours', () => {
    expect(normalizeHex('#ABC')).toBe('#aabbcc')
    expect(normalizeHex('abc')).toBeNull()
    expect(normalizeHex('#12345')).toBeNull()
    expect(hexToRgba('#ff0000', 50)).toBe('rgba(255, 0, 0, 0.5)')
    expect(hexToRgba('#fff')).toBe('rgb(255, 255, 255)')
    expect(hexToRgba('#000000', 250)).toBe('rgb(0, 0, 0)')
    expect(hexToRgba('#000000', -5)).toBe('rgba(0, 0, 0, 0)')
  })

  it('builds box-shadow', () => {
    expect(buildBoxShadow(defaultShadow)).toBe('0 12px 32px -8px rgba(10, 27, 51, 0.25)')
    expect(shadowCss({ ...defaultShadow, inset: true, x: -4 })).toBe('box-shadow: inset -4px 12px 32px -8px rgba(10, 27, 51, 0.25);')
    expect(buildBoxShadow({ ...defaultShadow, blur: -10 })).toContain(' 0 -8px ')
  })

  it('builds gradients with sorted, clamped stops', () => {
    const stops = [
      { id: 'b', color: '#00F', position: 100 },
      { id: 'a', color: '#ff0000', position: 0 },
    ]
    expect(buildGradient({ type: 'linear', angle: 90, shape: 'circle', stops })).toBe('linear-gradient(90deg, #ff0000 0%, #0000ff 100%)')
    expect(buildGradient({ type: 'radial', angle: 90, shape: 'ellipse', stops })).toBe('radial-gradient(ellipse, #ff0000 0%, #0000ff 100%)')
    expect(buildGradient({ type: 'linear', angle: -90, shape: 'circle', stops: [{ id: 'a', color: 'x', position: 150 }] })).toBe('linear-gradient(270deg, #000000 100%)')
  })

  it('builds borders, using shorthand whenever possible', () => {
    expect(borderCss(defaultBorder)).toBe('border: 2px solid #0a1b33;\nborder-radius: 16px;')
    expect(borderCss({ ...defaultBorder, radius: 0 })).toBe('border: 2px solid #0a1b33;')
    expect(borderCss({ ...defaultBorder, individualSides: true, sideWidths: { top: 1, right: 2, bottom: 3, left: 0 } })).toBe(
      'border-style: solid;\nborder-color: #0a1b33;\nborder-width: 1px 2px 3px 0;\nborder-radius: 16px;',
    )
    expect(
      borderCss({ ...defaultBorder, individualCorners: true, cornerRadii: { 'top-left': 8, 'top-right': 0, 'bottom-right': 8, 'bottom-left': 0 } }),
    ).toBe('border: 2px solid #0a1b33;\nborder-radius: 8px 0 8px 0;')
    expect(borderCss({ ...defaultBorder, width: -5 })).toContain('border: 0 solid')
  })
})
