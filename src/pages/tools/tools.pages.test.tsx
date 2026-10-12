// @vitest-environment jsdom
import type { ComponentType } from 'react'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { validateCnpj } from '../../lib/generators/cnpj'
import { validateCpf } from '../../lib/generators/cpf'
import { isUuidV4 } from '../../lib/generators/uuid'
import CaseConverterPage from './CaseConverterPage'
import CharacterCounterPage from './CharacterCounterPage'
import CnpjPage from './CnpjPage'
import CpfPage from './CpfPage'
import CssBorderPage from './CssBorderPage'
import CssGradientPage from './CssGradientPage'
import CssShadowPage from './CssShadowPage'
import HashGeneratorPage from './HashGeneratorPage'
import LoremIpsumPage from './LoremIpsumPage'
import PasswordGeneratorPage from './PasswordGeneratorPage'
import PasswordStrengthPage from './PasswordStrengthPage'
import PercentagePage from './PercentagePage'
import RuleOfThreePage from './RuleOfThreePage'
import UuidGeneratorPage from './UuidGeneratorPage'
import RemoveAccentsPage from './RemoveAccentsPage'
import TextReverserPage from './TextReverserPage'
import WordCounterPage from './WordCounterPage'

afterEach(cleanup)

// The shared CopyButton only uses the Clipboard API in secure contexts (HTTPS or localhost).
Object.defineProperty(window, 'isSecureContext', { value: true })
const clipboard = () => navigator.clipboard.readText()

function open(Page: ComponentType) {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )
  return user
}

/** Text of the tool's error banners (ErrorMessage), which announce politely as a status. */
const errorText = () =>
  screen
    .getAllByRole('status')
    .map((element) => element.textContent)
    .join(' ')

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const field = (name: string | RegExp) => screen.getByRole('textbox', { name }) as HTMLInputElement
const area = (id: string) => document.getElementById(id) as HTMLTextAreaElement

const pages: Array<[string, ComponentType]> = [
  ['Gerador de senhas', PasswordGeneratorPage],
  ['Força da senha', PasswordStrengthPage],
  ['Contador de caracteres', CharacterCounterPage],
  ['Contador de palavras', WordCounterPage],
  ['Maiúsculas e minúsculas', CaseConverterPage],
  ['Inverter texto', TextReverserPage],
  ['Remover acentos', RemoveAccentsPage],
  ['Porcentagem', PercentagePage],
  ['Regra de três', RuleOfThreePage],
  ['Gerador de UUID', UuidGeneratorPage],
  ['Lorem Ipsum', LoremIpsumPage],
  ['Gerador de hash', HashGeneratorPage],
  ['CPF', CpfPage],
  ['CNPJ', CnpjPage],
  ['Gerador de sombras', CssShadowPage],
  ['Gerador de gradientes', CssGradientPage],
  ['Gerador de bordas', CssBorderPage],
]

describe('every new tool page', () => {
  for (const [name, Page] of pages) {
    it(`${name}: title, breadcrumb and labelled controls`, () => {
      open(Page)
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(name)
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy()
      const controls = [...screen.queryAllByRole('button'), ...screen.queryAllByRole('textbox'), ...screen.queryAllByRole('checkbox'), ...screen.queryAllByRole('slider')]
      expect(controls.length).toBeGreaterThan(0)
      for (const element of controls) {
        const label = element.getAttribute('aria-label') ?? element.textContent ?? ''
        const labelled = label.trim() !== '' || ((element as HTMLInputElement).labels?.length ?? 0) > 0
        expect(labelled, `${name}: control without an accessible name`).toBe(true)
      }
      expect(document.body.textContent).not.toMatch(/Em breve/)
    })
  }
})

describe('password tools', () => {
  it('generates on demand and when options change, reports impossible options, restores and copies', async () => {
    const user = open(PasswordGeneratorPage)
    const read = () => screen.getByRole('group', { name: 'Senha gerada' }).textContent ?? ''
    const first = read()
    expect(first).toHaveLength(20)
    await user.click(button('Gerar outra'))
    expect(read()).not.toBe(first)

    for (const name of [/maiúsculas/, /minúsculas/, /Símbolos/]) await user.click(screen.getByRole('checkbox', { name }))
    expect(read()).toMatch(/^\d{20}$/)

    await user.click(screen.getByRole('checkbox', { name: /Números/ }))
    expect(errorText()).toMatch(/Nenhum tipo de caractere/)

    await user.click(button('Restaurar'))
    expect(read()).toHaveLength(20)
    await user.click(button('Copiar'))
    expect(button('Copiado!')).toBeTruthy()
    expect(await clipboard()).toBe(read())
  })

  it('rates a password, explains why, toggles visibility and clears', async () => {
    const user = open(PasswordStrengthPage)
    const input = screen.getByLabelText('Digite a senha que quer avaliar') as HTMLInputElement
    expect(input.type).toBe('password')
    await user.type(input, 'senha123')
    await waitFor(() => expect(screen.getByRole('meter').getAttribute('aria-valuetext')).toBe('Muito fraca'))
    expect(document.body.textContent).toMatch(/senhas mais usadas/)
    await user.click(button('Mostrar senha'))
    expect(input.type).toBe('text')
    await user.click(button('Limpar'))
    await waitFor(() => expect(screen.getByRole('meter').getAttribute('aria-valuetext')).toBe('Sem senha'))
  })
})

describe('text tools', () => {
  it('counts characters (emoji as one) and warns about a limit', async () => {
    const user = open(CharacterCounterPage)
    await user.click(area('character-counter-input'))
    await user.paste('Olá 🚀')
    await waitFor(() => expect(within(screen.getByText('Caracteres').parentElement!).getByText('5')).toBeTruthy())
    await user.type(field(/Limite de caracteres/), '3')
    await waitFor(() => expect(errorText()).toMatch(/2 caracteres além de 3/))
    await user.click(button('Limpar'))
    expect(area('character-counter-input').value).toBe('')
  })

  it('counts words with extra spaces, line breaks and compound words', async () => {
    const user = open(WordCounterPage)
    await user.click(area('word-counter-input'))
    await user.paste('um  dois\ntrês guarda-chuva')
    await waitFor(() => expect(within(screen.getByText('Palavras').parentElement!).getByText('4')).toBeTruthy())
  })

  it('converts case while typing', async () => {
    const user = open(CaseConverterPage)
    await user.click(area('case-converter-input'))
    await user.paste('olá mundo')
    expect(area('case-converter-output').value).toBe('OLÁ MUNDO')
    await user.click(screen.getByRole('radio', { name: 'Cada Palavra' }))
    expect(area('case-converter-output').value).toBe('Olá Mundo')
    await user.click(button('Copiar'))
    expect(button('Copiado!')).toBeTruthy()
    expect(await clipboard()).toBe('Olá Mundo')
  })
})

describe('text transform tools', () => {
  it('reverses a text in each mode, keeping emoji whole, and copies the result', async () => {
    const user = open(TextReverserPage)
    await user.click(area('text-reverser-input'))
    await user.paste('um dois 🚀')
    expect(area('text-reverser-output').value).toBe('🚀 siod mu')

    await user.click(screen.getByRole('radio', { name: 'Ordem das palavras' }))
    expect(area('text-reverser-output').value).toBe('🚀 dois um')

    await user.click(screen.getByRole('radio', { name: 'Letras de cada palavra' }))
    expect(area('text-reverser-output').value).toBe('mu siod 🚀')

    await user.click(button('Copiar'))
    expect(await clipboard()).toBe('mu siod 🚀')
    await user.click(button('Limpar'))
    expect(area('text-reverser-output').value).toBe('')
  })
})

describe('remove accents', () => {
  it('removes accents while typing, can keep the cedilla and reports what changed', async () => {
    const user = open(RemoveAccentsPage)
    await user.click(area('remove-accents-input'))
    await user.paste('Ação é coração')
    expect(area('remove-accents-output').value).toBe('Acao e coracao')
    expect(document.body.textContent).toMatch(/5 letras alteradas/)

    await user.click(screen.getByRole('checkbox', { name: 'Manter o ç' }))
    expect(area('remove-accents-output').value).toBe('Açao e coraçao')
  })
})

describe('calculators', () => {
  it('computes a percentage with steps, rejects bad input and clears', async () => {
    const user = open(PercentagePage)
    await user.type(field('Porcentagem (X)'), '12,5')
    await user.type(field('Valor (Y)'), '80')
    expect(document.querySelector('output')!.textContent).toBe('10')
    expect(document.body.textContent).toContain('X ÷ 100 × Y')

    await user.clear(field('Valor (Y)'))
    await user.type(field('Valor (Y)'), 'abc')
    expect(screen.getByRole('alert').textContent).toMatch(/não é um número válido/)
    expect(document.querySelector('output')).toBeNull()

    await user.click(button('Limpar'))
    expect(field('Porcentagem (X)').value).toBe('')
  })

  it('refuses division by zero', async () => {
    const user = open(PercentagePage)
    await user.click(screen.getByRole('radio', { name: 'X é quantos % de Y' }))
    await user.type(field('Parte (X)'), '5')
    await user.type(field('Total (Y)'), '0')
    expect(errorText()).toMatch(/não pode ser zero/)
  })

  it('solves the rule of three both ways and refuses zero', async () => {
    const user = open(RuleOfThreePage)
    await user.click(button('Exemplo'))
    expect(document.querySelector('output')!.textContent).toBe('25')
    await user.click(screen.getByRole('radio', { name: 'Inversa' }))
    expect(document.querySelector('output')!.textContent).toBe('4')
    await user.clear(field('C'))
    await user.type(field('C'), '0')
    expect(errorText()).toMatch(/C não pode ser zero/)
  })
})

describe('generators', () => {
  it('generates UUIDs in the requested quantity and format', async () => {
    const user = open(UuidGeneratorPage)
    const list = () => area('uuid-output').value.split('\n')
    expect(list()).toHaveLength(1)
    await user.clear(field('Quantidade'))
    await user.type(field('Quantidade'), '25')
    await user.click(button('Gerar'))
    expect(list()).toHaveLength(25)
    expect(list().every(isUuidV4)).toBe(true)
    await user.click(screen.getByRole('checkbox', { name: /Com hifens/ }))
    expect(list().every((id) => /^[0-9a-f]{32}$/.test(id))).toBe(true)

    await user.clear(field('Quantidade'))
    await user.type(field('Quantidade'), '9999')
    expect((button('Gerar') as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('alert').textContent).toMatch(/1 a 500/)

    await user.click(button('Limpar'))
    expect(area('uuid-output').value).toBe('')
  })

  it('generates lorem ipsum in the chosen unit', async () => {
    const user = open(LoremIpsumPage)
    const text = () => area('lorem-output').value
    expect(text().split('\n\n')).toHaveLength(3)
    await user.click(screen.getByRole('radio', { name: 'Palavras' }))
    expect(text().split(' ')).toHaveLength(50)
    await user.clear(field('Quantidade'))
    await user.type(field('Quantidade'), '7')
    await user.click(button('Gerar novamente'))
    expect(text().split(' ')).toHaveLength(7)
  })

  it('generates valid CPFs, toggles the mask on the same numbers and validates typed ones', async () => {
    const user = open(CpfPage)
    const list = () => area('cpf-generated').value.split('\n')
    expect(validateCpf(list()[0]).valid).toBe(true)
    await user.clear(field('Quantidade'))
    await user.type(field('Quantidade'), '10')
    await user.click(button('Gerar'))
    expect(list()).toHaveLength(10)
    expect(list().every((cpf) => validateCpf(cpf).valid)).toBe(true)
    const masked = list()
    await user.click(screen.getByRole('checkbox', { name: /Com máscara/ }))
    expect(list()).toEqual(masked.map((cpf) => cpf.replace(/\D/g, '')))

    await user.type(field('CPF para conferir'), '529.982.247-25')
    expect(screen.getByText(/CPF válido/)).toBeTruthy()
    await user.clear(field('CPF para conferir'))
    await user.type(field('CPF para conferir'), '529.982.247-26')
    expect(errorText()).toMatch(/não conferem/)
  })

  it('generates valid CNPJs in both formats', async () => {
    const user = open(CnpjPage)
    const first = () => area('cnpj-generated').value.split('\n')[0]
    expect(validateCnpj(first()).valid).toBe(true)
    await user.click(screen.getByRole('checkbox', { name: /alfanumérico/ }))
    expect(validateCnpj(first()).valid).toBe(true)
    await user.click(button('Exemplo'))
    expect(screen.getByText(/CNPJ válido/)).toBeTruthy()
  })
})

describe('CSS generators', () => {
  it('builds a box-shadow, applies presets, resets and copies', async () => {
    const user = open(CssShadowPage)
    const css = () => area('css-shadow-output').value
    expect(css()).toBe('box-shadow: 0 12px 32px -8px rgba(10, 27, 51, 0.25);')
    await user.click(button('Dura'))
    expect(css()).toBe('box-shadow: 8px 8px 0 0 rgb(10, 27, 51);')
    await user.click(screen.getByRole('checkbox', { name: /inset/ }))
    expect(css()).toContain('inset ')
    expect(screen.getByRole('img', { name: 'Prévia da sombra' }).style.boxShadow).toContain('inset')
    await user.click(button('Restaurar'))
    expect(css()).toBe('box-shadow: 0 12px 32px -8px rgba(10, 27, 51, 0.25);')
    await user.click(button('Copiar'))
    expect(button('Copiado!')).toBeTruthy()
    expect(await clipboard()).toBe(css())
  })

  it('reports an invalid colour', async () => {
    const user = open(CssShadowPage)
    await user.clear(field('Cor'))
    await user.type(field('Cor'), '#12')
    expect(screen.getByRole('alert').textContent).toMatch(/Cor inválida/)
  })

  it('adds and removes gradient stops within limits', async () => {
    const user = open(CssGradientPage)
    const css = () => area('css-gradient-output').value
    expect(css()).toBe('background: linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%);')
    expect((button('Remover cor 1') as HTMLButtonElement).disabled).toBe(true)
    await user.click(button('Adicionar cor'))
    expect(css()).toBe('background: linear-gradient(135deg, #38bdf8 0%, #4f46e5 50%, #4f46e5 100%);')
    await user.click(button('Remover cor 3'))
    await user.click(screen.getByRole('radio', { name: 'Radial' }))
    expect(css()).toBe('background: radial-gradient(circle, #38bdf8 0%, #4f46e5 100%);')
    for (let i = 0; i < 4; i++) await user.click(button('Adicionar cor'))
    expect((button('Adicionar cor') as HTMLButtonElement).disabled).toBe(true)
  })

  it('builds borders with individual sides', async () => {
    const user = open(CssBorderPage)
    const css = () => area('css-border-output').value
    expect(css()).toBe('border: 2px solid #0a1b33;\nborder-radius: 16px;')
    await user.click(button('Só embaixo'))
    expect(css()).toBe('border-style: solid;\nborder-color: #0a1b33;\nborder-width: 0 0 4px 0;')
    await user.click(button('Restaurar'))
    expect(css()).toBe('border: 2px solid #0a1b33;\nborder-radius: 16px;')
  })
})
