export type StrengthScore = 0 | 1 | 2 | 3 | 4

export interface StrengthFinding {
  kind: 'good' | 'bad'
  text: string
}

export interface PasswordStrength {
  score: StrengthScore
  label: string
  /** Estimated entropy after discounting predictable patterns. */
  bits: number
  findings: StrengthFinding[]
  suggestions: string[]
}

export const strengthLabels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'] as const

/** Passwords and words that show up at the top of leaked-password lists (international and Brazilian). */
const COMMON = new Set(
  `123456 1234567 12345678 123456789 1234567890 12345 1234 111111 000000 123123 121212 654321 666666 112233 102030
  password password1 password123 passw0rd senha senha1 senha123 senha1234 123mudar mudar123 admin admin123 administrador
  root toor qwerty qwerty123 qwertyuiop asdfgh asdfghjkl zxcvbnm 1q2w3e 1q2w3e4r 1q2w3e4r5t q1w2e3r4 q1w2e3r4t5 1qaz2wsx
  zaq12wsx zaq1xsw2 qazwsx qazwsxedc qweasd qweasdzxc abc123 abcd1234 abcdef superman batman pokemon naruto
  iloveyou teamo euteamo amor amor123 deus jesus jesuscristo familia felicidade sucesso brasil brasil123 flamengo
  corinthians palmeiras saopaulo santos vasco gremio cruzeiro futebol dragon monkey master letmein welcome login
  princesa estrela gatinha gabriel lucas pedro maria joao rafael daniel felipe matheus teste teste123 test test123
  guest user usuario mudar trocar secret segredo internet computador`.split(/\s+/),
)

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjklç', 'zxcvbnm', '1234567890', 'abcdefghijklmnopqrstuvwxyz']

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', $: 's', '!': 'i' }

function normalize(password: string) {
  return password
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

const unleet = (text: string) => [...text].map((char) => LEET[char] ?? char).join('')

/** Length of the longest run that follows a keyboard row or the alphabet, forwards or backwards. */
function longestSequence(text: string): number {
  let best = 1
  for (const row of KEYBOARD_ROWS) {
    for (const line of [row, [...row].reverse().join('')]) {
      let run = 1
      for (let i = 1; i < text.length; i++) {
        const previous = line.indexOf(text[i - 1])
        run = previous !== -1 && line[previous + 1] === text[i] ? run + 1 : 1
        best = Math.max(best, run)
      }
    }
  }
  return best
}

function longestRepeat(text: string): number {
  let best = 1
  let run = 1
  for (let i = 1; i < text.length; i++) {
    run = text[i] === text[i - 1] ? run + 1 : 1
    best = Math.max(best, run)
  }
  return best
}

/** True when the whole text is a short block repeated, such as "abcabcabc". */
function isRepeatedBlock(text: string): boolean {
  for (let size = 1; size <= text.length / 2; size++) {
    if (text.length % size === 0 && text.slice(0, size).repeat(text.length / size) === text) return true
  }
  return false
}

function findCommonWord(normalized: string): string | null {
  const plain = unleet(normalized)
  let found: string | null = null
  for (const word of COMMON) {
    if (word.length >= 4 && (normalized.includes(word) || plain.includes(word))) {
      if (!found || word.length > found.length) found = word
    }
  }
  return found
}

/**
 * Estimates how hard a password is to guess. Runs entirely in memory: the password is never
 * stored or sent anywhere. It is a heuristic, not a guarantee.
 */
export function analyzePassword(password: string): PasswordStrength {
  const chars = [...password]
  const length = chars.length
  const findings: StrengthFinding[] = []
  const suggestions: string[] = []

  if (length === 0) {
    return { score: 0, label: strengthLabels[0], bits: 0, findings, suggestions }
  }

  const hasLower = /\p{Ll}/u.test(password)
  const hasUpper = /\p{Lu}/u.test(password)
  const hasDigit = /\p{Nd}/u.test(password)
  const hasSymbol = /[^\p{L}\p{Nd}]/u.test(password)
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length
  const pool = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 33 : 0) || 26

  let bits = length * Math.log2(pool)
  const normalized = normalize(password)
  const unique = new Set(chars).size

  // Length
  if (length < 8) {
    findings.push({ kind: 'bad', text: `Curta demais: ${length} ${length === 1 ? 'caractere' : 'caracteres'}.` })
    suggestions.push('Use pelo menos 12 caracteres; 16 ou mais é melhor.')
  } else if (length < 12) {
    findings.push({ kind: 'bad', text: `Comprimento apenas razoável: ${length} caracteres.` })
    suggestions.push('Aumente para 12 caracteres ou mais.')
  } else {
    findings.push({ kind: 'good', text: `Bom comprimento: ${length} caracteres.` })
  }

  // Variety
  if (classes >= 3) {
    findings.push({ kind: 'good', text: `Mistura ${classes} tipos de caracteres.` })
  } else {
    findings.push({
      kind: 'bad',
      text: classes === 1 ? 'Usa um único tipo de caractere.' : 'Usa apenas dois tipos de caracteres.',
    })
    suggestions.push('Misture maiúsculas, minúsculas, números e símbolos.')
  }
  if (classes === 1 && hasDigit) bits = Math.min(bits, length * Math.log2(10))

  // Whole password is a known one
  const exactCommon = COMMON.has(normalized) || COMMON.has(unleet(normalized))
  const commonWord = exactCommon ? null : findCommonWord(normalized)
  if (exactCommon) {
    findings.push({ kind: 'bad', text: 'Está entre as senhas mais usadas e é testada primeiro em ataques.' })
    suggestions.push('Não use senhas conhecidas, nem com letras trocadas por números.')
    bits = Math.min(bits, 6)
  } else if (commonWord) {
    findings.push({ kind: 'bad', text: `Contém uma palavra ou sequência muito comum (“${commonWord}”).` })
    suggestions.push('Evite palavras comuns, nomes e times, mesmo com números no final.')
    bits -= commonWord.length * Math.log2(pool) * 0.85
  }

  // Repetition
  const repeat = longestRepeat(normalized)
  if (isRepeatedBlock(normalized) && length >= 4) {
    findings.push({ kind: 'bad', text: 'É um mesmo trecho repetido várias vezes.' })
    suggestions.push('Evite repetir o mesmo trecho.')
    bits = Math.min(bits, 10 + unique * 2)
  } else if (repeat >= 3) {
    findings.push({ kind: 'bad', text: `Repete o mesmo caractere ${repeat} vezes seguidas.` })
    suggestions.push('Evite caracteres repetidos em sequência.')
    bits -= (repeat - 1) * Math.log2(pool) * 0.8
  }
  // Few distinct characters in absolute terms ("aabbaabb"). A long random run of digits has 10.
  if (unique <= 4 && length >= 6 && !isRepeatedBlock(normalized)) {
    findings.push({ kind: 'bad', text: `Pouca variedade: apenas ${unique} caracteres diferentes.` })
    bits = Math.min(bits, unique * 6)
  }

  // Sequences
  const sequence = longestSequence(normalized)
  if (sequence >= 4 && !exactCommon) {
    findings.push({ kind: 'bad', text: `Contém uma sequência previsível de ${sequence} caracteres (como “abcd”, “1234” ou “qwer”).` })
    suggestions.push('Evite sequências do teclado ou do alfabeto.')
    bits -= (sequence - 1) * Math.log2(pool) * 0.85
  }

  // Predictable structure
  if (/^\d{1,2}[/.-]\d{1,2}[/.-](\d{2}|\d{4})$/.test(password) || /^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(19|20)\d{2}$/.test(password)) {
    findings.push({ kind: 'bad', text: 'É apenas uma data.' })
    suggestions.push('Não use datas de nascimento ou anos.')
    bits = Math.min(bits, 20)
  } else if (!exactCommon && length <= 24 && (/(19|20)\d{2}/.test(password) || /\d{2}[/.-]\d{2}[/.-](\d{2}|\d{4})/.test(password))) {
    findings.push({ kind: 'bad', text: 'Parece conter um ano ou uma data.' })
    suggestions.push('Não use datas de nascimento ou anos.')
    bits -= 8
  }
  if (!exactCommon && /^\p{Lu}?\p{Ll}+\d{1,4}[^\p{L}\p{Nd}]?$/u.test(password)) {
    findings.push({ kind: 'bad', text: 'Segue o formato previsível “palavra + números”.' })
    suggestions.push('Uma frase com várias palavras sem relação entre si é mais forte e mais fácil de lembrar.')
    bits -= 10
  }

  bits = Math.max(0, Math.round(bits))
  let score: StrengthScore = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4
  if (exactCommon) score = 0
  if (length < 8) score = Math.min(score, 1) as StrengthScore

  return { score, label: strengthLabels[score], bits, findings, suggestions: [...new Set(suggestions)] }
}
