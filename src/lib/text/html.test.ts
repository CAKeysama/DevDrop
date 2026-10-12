import { describe, expect, it } from 'vitest'
import { escapeHtml, textToHtml, type HtmlOptions } from './html'

const base: HtmlOptions = { structure: 'none', linkify: false, entities: false }
const html = (text: string, options: Partial<HtmlOptions> = {}) => textToHtml(text, { ...base, ...options }).output

describe('escapeHtml', () => {
  it('escapes the four reserved characters, & first so nothing is escaped twice', () => {
    expect(escapeHtml('<a href="x">Tom & Jerry</a>', false)).toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;')
    expect(escapeHtml('&lt;', false)).toBe('&amp;lt;')
  })

  it('leaves accents alone by default', () => {
    expect(escapeHtml('ação é bom', false)).toBe('ação é bom')
  })

  it('writes accents and symbols as named entities when asked', () => {
    expect(escapeHtml('ação, coração, você', true)).toBe('a&ccedil;&atilde;o, cora&ccedil;&atilde;o, voc&ecirc;')
    expect(escapeHtml('ÁÉÍÓÚ Ç Ñ', true)).toBe('&Aacute;&Eacute;&Iacute;&Oacute;&Uacute; &Ccedil; &Ntilde;')
    expect(escapeHtml('« » © € — …', true)).toBe('&laquo; &raquo; &copy; &euro; &mdash; &hellip;')
  })

  it('uses a numeric entity for anything without a name, one per code point', () => {
    expect(escapeHtml('🚀', true)).toBe('&#128640;')
    expect(escapeHtml('日', true)).toBe('&#26085;')
  })
})

describe('textToHtml structure', () => {
  it('makes paragraphs from blocks and <br> from single breaks', () => {
    expect(html('Olá\nmundo\n\nSegundo bloco', { structure: 'paragraphs' })).toBe('<p>Olá<br>\nmundo</p>\n<p>Segundo bloco</p>')
  })

  it('ignores extra blank lines and edges', () => {
    expect(html('\n\nUm\n\n\n\nDois\n\n', { structure: 'paragraphs' })).toBe('<p>Um</p>\n<p>Dois</p>')
    expect(textToHtml('a\n\nb\n\nc', { ...base, structure: 'paragraphs' }).paragraphs).toBe(3)
  })

  it('only breaks the lines in "br" mode, and touches nothing in "none"', () => {
    expect(html('a\n\nb', { structure: 'br' })).toBe('a<br>\n<br>\nb')
    expect(html('a\nb', { structure: 'none' })).toBe('a\nb')
  })

  it('understands Windows line breaks', () => {
    expect(html('a\r\n\r\nb', { structure: 'paragraphs' })).toBe('<p>a</p>\n<p>b</p>')
  })

  it('returns nothing for an empty or blank text', () => {
    expect(html('')).toBe('')
    expect(html('  \n ', { structure: 'paragraphs' })).toBe('')
  })
})

describe('textToHtml links', () => {
  const link = (text: string) => html(text, { linkify: true })

  it('turns an address into a link', () => {
    expect(link('veja https://devdrop.com.br/tools agora')).toBe('veja <a href="https://devdrop.com.br/tools">https://devdrop.com.br/tools</a> agora')
  })

  it('leaves the punctuation of the sentence outside the link', () => {
    expect(link('acesse http://x.com.')).toBe('acesse <a href="http://x.com">http://x.com</a>.')
    expect(link('(veja http://x.com/a)')).toBe('(veja <a href="http://x.com/a">http://x.com/a</a>)')
    expect(link('disse "http://x.com", ok')).toBe('disse &quot;<a href="http://x.com">http://x.com</a>&quot;, ok')
  })

  it('keeps a parenthesis that belongs to the address', () => {
    expect(link('http://x.com/a_(b)')).toBe('<a href="http://x.com/a_(b)">http://x.com/a_(b)</a>')
  })

  it('escapes an address with & once, inside href', () => {
    expect(link('http://x.com/?a=1&b=2')).toBe('<a href="http://x.com/?a=1&amp;b=2">http://x.com/?a=1&amp;b=2</a>')
  })

  it('does not link anything but http and https', () => {
    expect(link('javascript:alert(1) ftp://x.com')).toBe('javascript:alert(1) ftp://x.com')
  })

  it('cannot be tricked into closing the attribute with quotes', () => {
    const out = link('http://x.com/"onmouseover="alert(1)')
    expect(out).not.toMatch(/href="[^"]*"[^>]/) // nothing after the closing quote but >
    expect(out).toContain('&quot;')
  })

  it('does not run scripts typed in the text', () => {
    expect(html('<script>alert(1)</script>', { linkify: true })).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })
})
