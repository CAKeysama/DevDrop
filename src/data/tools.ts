/**
 * Tool registry — the single source of truth for categories and tools.
 * It mirrors the feature list in README.md. Set `status: 'available'` and add a
 * `path` when a tool ships; the catalog and the landing page pick it up from here.
 */
export type CategoryId = 'developer' | 'data' | 'css' | 'security' | 'text' | 'calculators'

export type ToolStatus = 'planned' | 'available'

export interface Category {
  id: CategoryId
  name: string
  description: string
}

export interface Tool {
  id: string
  name: string
  description: string
  categoryId: CategoryId
  status: ToolStatus
  /** Route of the tool once it is available. */
  path?: string
  keywords: string[]
}

export const categories: Category[] = [
  {
    id: 'developer',
    name: 'Desenvolvimento',
    description: 'Formate, valide, codifique e decodifique os dados com que você trabalha todo dia.',
  },
  {
    id: 'security',
    name: 'Segurança',
    description: 'Crie senhas fortes e confira a força de uma senha.',
  },
  {
    id: 'text',
    name: 'Texto',
    description: 'Conte, converta, limpe e transforme textos sem sair do navegador.',
  },
  {
    id: 'calculators',
    name: 'Calculadoras',
    description: 'Porcentagem e regra de três sem fazer conta de cabeça.',
  },
  {
    id: 'data',
    name: 'Geradores de dados',
    description: 'Dados de teste na hora: UUID, Lorem Ipsum, hashes, CPF e CNPJ.',
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'Monte sombras, gradientes e bordas de forma visual.',
  },
]

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'Formatador JSON',
    description: 'Formata, valida e minifica JSON com controle de indentação.',
    categoryId: 'developer',
    status: 'available',
    path: '/tools/json-formatter',
    keywords: ['json', 'formatter', 'format', 'validar', 'validate', 'beautify', 'minificar', 'minify'],
  },
  {
    id: 'xml-formatter',
    name: 'Formatador XML',
    description: 'Formata, valida e minifica XML com parser e diagnóstico de erros.',
    categoryId: 'developer',
    status: 'available',
    path: '/tools/xml-formatter',
    keywords: ['xml', 'formatter', 'format', 'validar', 'validate', 'minificar', 'minify'],
  },
  {
    id: 'sql-formatter',
    name: 'Formatador SQL',
    description: 'Formata e embeleza consultas SQL com múltiplos dialetos.',
    categoryId: 'developer',
    status: 'available',
    path: '/tools/sql-formatter',
    keywords: ['sql', 'formatter', 'format', 'query', 'consulta', 'beautify', 'banco de dados'],
  },
  {
    id: 'base64',
    name: 'Base64',
    description: 'Codifica e decodifica Base64 com suporte total a UTF-8 e Unicode.',
    categoryId: 'developer',
    status: 'available',
    path: '/tools/base64',
    keywords: ['base64', 'encode', 'decode', 'codificar', 'decodificar', 'utf8', 'unicode'],
  },
  {
    id: 'url-encoder',
    name: 'URL Encode/Decode',
    description: 'Codifica e decodifica parâmetros e URLs completas.',
    categoryId: 'developer',
    status: 'available',
    path: '/tools/url-encoder',
    keywords: ['url', 'uri', 'encode', 'decode', 'codificar', 'decodificar', 'query', 'percent'],
  },
  {
    id: 'jwt-decoder',
    name: 'Decodificador JWT',
    description: 'Decodifica e inspeciona claims, cabeçalhos e validade de JSON Web Tokens.',
    categoryId: 'developer',
    status: 'available',
    path: '/tools/jwt-decoder',
    keywords: ['jwt', 'token', 'decode', 'decoder', 'claims', 'payload', 'header', 'json web token'],
  },

  {
    id: 'password-generator',
    name: 'Gerador de senhas',
    description: 'Gera senhas aleatórias fortes, com tamanho e tipos de caracteres à sua escolha.',
    categoryId: 'security',
    status: 'available',
    path: '/tools/password-generator',
    keywords: ['senha', 'password', 'gerar', 'generator', 'aleatoria', 'random'],
  },
  {
    id: 'password-strength',
    name: 'Força da senha',
    description: 'Avalia a força de uma senha e explica o que a enfraquece.',
    categoryId: 'security',
    status: 'available',
    path: '/tools/password-strength',
    keywords: ['senha', 'password', 'strength', 'verificador', 'checker', 'forte', 'segura'],
  },

  {
    id: 'character-counter',
    name: 'Contador de caracteres',
    description: 'Conta caracteres, com e sem espaços, e avisa quando um limite é ultrapassado.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/character-counter',
    keywords: ['caractere', 'character', 'counter', 'count', 'tamanho', 'letras', 'limite'],
  },
  {
    id: 'word-counter',
    name: 'Contador de palavras',
    description: 'Conta palavras, frases, parágrafos e estima o tempo de leitura.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/word-counter',
    keywords: ['palavra', 'word', 'counter', 'count', 'frases', 'tempo de leitura'],
  },
  {
    id: 'case-converter',
    name: 'Maiúsculas e minúsculas',
    description: 'Converte um texto para maiúsculas, minúsculas, título e outros formatos.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/case-converter',
    keywords: ['case', 'converter', 'uppercase', 'lowercase', 'caixa alta', 'caixa baixa', 'conversor', 'title case'],
  },
  {
    id: 'text-reverser',
    name: 'Inverter texto',
    description: 'Inverte o texto, as letras de cada palavra, a ordem das palavras ou das linhas.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/text-reverser',
    keywords: ['inverter', 'inverso', 'reverso', 'reverse', 'espelhar', 'ao contrario', 'de tras para frente', 'palindromo', 'invertido'],
  },
  {
    id: 'remove-accents',
    name: 'Remover acentos',
    description: 'Tira acentos, til e cedilha de um texto: "ação" vira "acao".',
    categoryId: 'text',
    status: 'available',
    path: '/tools/remove-accents',
    keywords: ['acento', 'acentos', 'acentuacao', 'sem acento', 'tirar acento', 'cedilha', 'til', 'diacriticos', 'normalizar', 'slug', 'ascii'],
  },
  {
    id: 'line-breaks',
    name: 'Remover quebras de linha',
    description: 'Remove as quebras de linha de um texto ou troca por espaço, vírgula ou outro texto.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/line-breaks',
    keywords: ['quebra', 'quebras', 'linha', 'linhas', 'enter', 'newline', 'juntar', 'unir', 'trocar', 'paragrafo', 'line break', 'texto corrido'],
  },
  {
    id: 'sort-lines',
    name: 'Ordem alfabética',
    description: 'Coloca as linhas de um texto em ordem alfabética (A→Z ou Z→A), com opção de tirar as repetidas.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/sort-lines',
    keywords: ['ordenar', 'ordem', 'alfabetica', 'alfabetico', 'sort', 'classificar', 'organizar', 'lista', 'a-z', 'duplicadas', 'repetidas', 'azul'],
  },
  {
    id: 'text-cutter',
    name: 'Cortar texto',
    description: 'Mantém só uma parte do texto: os primeiros ou últimos caracteres ou palavras, ou um trecho do início ao fim.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/text-cutter',
    keywords: ['cortar', 'recortar', 'trecho', 'substring', 'truncar', 'limitar', 'primeiros', 'ultimos', 'caracteres', 'palavras', 'encurtar', 'resumir'],
  },
  {
    id: 'text-to-html',
    name: 'Texto para HTML',
    description: 'Transforma um texto em HTML: escapa os símbolos e cria parágrafos, quebras, links e entidades.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/text-to-html',
    keywords: ['html', 'converter', 'texto para html', 'escapar', 'entidades', 'paragrafo', 'br', 'tags', 'links', 'encode', 'acentos', 'codificar'],
  },
  {
    id: 'word-occurrences',
    name: 'Contador de ocorrências',
    description: 'Conta quantas vezes uma palavra ou frase aparece em um texto, com as ocorrências destacadas.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/word-occurrences',
    keywords: ['ocorrencia', 'ocorrencias', 'repeticao', 'quantas vezes', 'frequencia', 'buscar', 'procurar', 'palavra', 'contar palavra', 'encontrar', 'destacar'],
  },
  {
    id: 'char-info',
    name: 'Informações de caractere',
    description: 'Mostra o código Unicode, os bytes em UTF-8, a entidade HTML e a categoria de cada caractere.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/char-info',
    keywords: ['unicode', 'codigo', 'utf-8', 'utf8', 'utf-16', 'ascii', 'caractere', 'codepoint', 'entidade', 'simbolo', 'hexadecimal', 'decimal', 'emoji', 'invisivel', 'bytes'],
  },
  {
    id: 'number-to-words',
    name: 'Número por extenso',
    description: 'Escreve números, valores em dinheiro e ordinais por extenso: 1250 vira "mil duzentos e cinquenta".',
    categoryId: 'text',
    status: 'available',
    path: '/tools/number-to-words',
    keywords: ['extenso', 'numero por extenso', 'escrever numero', 'valor por extenso', 'cheque', 'reais', 'ordinal', 'cardinal', 'por extenso', 'dinheiro', 'recibo', 'contrato', 'moeda'],
  },
  {
    id: 'fancy-letters',
    name: 'Letras personalizadas',
    description: 'Transforma o texto em letras estilizadas (negrito, itálico, gótico, circulado…) para copiar e colar.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/fancy-letters',
    keywords: ['letras', 'fonte', 'fontes', 'estilizadas', 'negrito', 'italico', 'gotico', 'cursiva', 'bio', 'instagram', 'nick', 'diferentes', 'bonitas', 'unicode', 'riscado', 'sublinhado'],
  },
  {
    id: 'text-splitter',
    name: 'Dividir texto',
    description: 'Divide um texto por vírgula, espaço, tab ou outro separador, uma parte por linha.',
    categoryId: 'text',
    status: 'available',
    path: '/tools/text-splitter',
    keywords: ['dividir', 'split', 'separar', 'separador', 'string', 'virgula', 'csv', 'lista', 'partes', 'quebrar texto'],
  },

  {
    id: 'percentage',
    name: 'Porcentagem',
    description: 'Calcula porcentagens, aumentos, descontos e variações, mostrando a conta.',
    categoryId: 'calculators',
    status: 'available',
    path: '/tools/percentage',
    keywords: ['porcentagem', 'percentual', 'percentage', 'percent', 'calculadora', 'desconto', 'aumento', 'variacao'],
  },
  {
    id: 'rule-of-three',
    name: 'Regra de três',
    description: 'Resolve proporções diretas e inversas passo a passo.',
    categoryId: 'calculators',
    status: 'available',
    path: '/tools/rule-of-three',
    keywords: ['regra de tres', 'proporcao', 'rule of three', 'calculadora', 'proporcional'],
  },

  {
    id: 'uuid',
    name: 'Gerador de UUID',
    description: 'Gera identificadores UUID v4 aleatórios, um ou vários de uma vez.',
    categoryId: 'data',
    status: 'available',
    path: '/tools/uuid',
    keywords: ['uuid', 'guid', 'id', 'gerar', 'generator', 'identificador', 'v4'],
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: 'Gera texto de preenchimento em palavras, frases ou parágrafos.',
    categoryId: 'data',
    status: 'available',
    path: '/tools/lorem-ipsum',
    keywords: ['lorem', 'ipsum', 'placeholder', 'texto', 'gerador', 'preenchimento'],
  },
  {
    id: 'hash-generator',
    name: 'Gerador de hash',
    description: 'Calcula os hashes MD5, SHA-1, SHA-256 e SHA-512 de um texto.',
    categoryId: 'data',
    status: 'available',
    path: '/tools/hash-generator',
    keywords: ['hash', 'md5', 'sha', 'sha1', 'sha-1', 'sha256', 'sha-256', 'sha512', 'sha-512', 'checksum', 'generator'],
  },
  {
    id: 'cpf',
    name: 'CPF',
    description: 'Gera CPFs válidos para testes e confere os dígitos verificadores de um CPF.',
    categoryId: 'data',
    status: 'available',
    path: '/tools/cpf',
    keywords: ['cpf', 'documento', 'gerador', 'validador', 'generator', 'validar'],
  },
  {
    id: 'cnpj',
    name: 'CNPJ',
    description: 'Gera CNPJs válidos para testes e confere os dígitos verificadores de um CNPJ.',
    categoryId: 'data',
    status: 'available',
    path: '/tools/cnpj',
    keywords: ['cnpj', 'documento', 'gerador', 'validador', 'generator', 'validar', 'empresa', 'alfanumerico'],
  },

  {
    id: 'css-shadow',
    name: 'Gerador de sombras',
    description: 'Monta um box-shadow com prévia ao vivo e copia o CSS.',
    categoryId: 'css',
    status: 'available',
    path: '/tools/css-shadow',
    keywords: ['css', 'sombra', 'shadow', 'box-shadow'],
  },
  {
    id: 'css-gradient',
    name: 'Gerador de gradientes',
    description: 'Monta gradientes lineares e radiais com prévia ao vivo e copia o CSS.',
    categoryId: 'css',
    status: 'available',
    path: '/tools/css-gradient',
    keywords: ['css', 'gradiente', 'gradient', 'cor', 'degrade', 'linear-gradient', 'radial-gradient'],
  },
  {
    id: 'css-border',
    name: 'Gerador de bordas',
    description: 'Ajusta espessura, estilo, cor e raio da borda com prévia ao vivo e copia o CSS.',
    categoryId: 'css',
    status: 'available',
    path: '/tools/css-border',
    keywords: ['css', 'borda', 'border', 'radius', 'border-radius', 'arredondar'],
  },
]

/**
 * Tools shown in the landing page marquee, in order. Ids only — names, categories and
 * links are read from the registry above, so the showcase can never drift from it.
 * Only available tools belong here: the showcase is a promise of what works today.
 */
export const showcaseToolIds = [
  'json-formatter',
  'jwt-decoder',
  'base64',
  'sql-formatter',
  'url-encoder',
  'xml-formatter',
]

export function getShowcaseTools(): Tool[] {
  return showcaseToolIds.flatMap((id) => tools.find((tool) => tool.id === id && tool.status === 'available') ?? [])
}

/** Destination of a tool: its own route once available, otherwise its entry in the catalog. */
export function getToolHref(tool: Tool): string {
  if (tool.status === 'available' && tool.path) return tool.path
  return `/tools?q=${encodeURIComponent(tool.name)}`
}

export function isCategoryId(value: string | null | undefined): value is CategoryId {
  return categories.some((category) => category.id === value)
}

/** A tool by id. Throws for an unknown id, so a typo in a page fails loudly in tests. */
export function getTool(id: string): Tool {
  const tool = tools.find((item) => item.id === id)
  if (!tool) throw new Error(`Unknown tool id: ${id}`)
  return tool
}

export function getCategory(id: CategoryId): Category {
  return categories.find((category) => category.id === id)!
}

/** Tools of a category, available ones first. */
export function getToolsByCategory(id: CategoryId): Tool[] {
  const list = tools.filter((tool) => tool.categoryId === id)
  return [...list.filter((tool) => tool.status === 'available'), ...list.filter((tool) => tool.status !== 'available')]
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

/** Words that carry no meaning in a search ("formatador de json" = "formatador json"). */
const stopwords = new Set(['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'um', 'uma', 'para', 'pra', 'com', 'no', 'na', 'online', 'ferramenta'])

/**
 * Words people type that mean the same thing. A term matches a tool when the term or any
 * word of its group matches. Groups use the stem, since matching is by prefix.
 */
const synonymGroups: string[][] = [
  ['format', 'prettify', 'pretty', 'beautify', 'embelez', 'indent', 'organiz', 'identar'],
  ['minif', 'compact', 'comprim', 'uglify'],
  ['valid', 'verific', 'conferir', 'checar', 'check', 'lint'],
  ['decod', 'decode', 'decrypt', 'inspec'],
  ['codific', 'encode', 'encod', 'escap'],
  ['gera', 'generat', 'criar', 'random', 'aleator'],
  // No bare 'pass': matching is by substring, so it would hit "passo" and "ultrapassado".
  ['senha', 'password'],
  ['token', 'jwt', 'bearer'],
  ['contar', 'contador', 'count'],
  ['calcul', 'calcular'],
  ['texto', 'text'],
]

function expand(term: string): string[] {
  const group = synonymGroups.find((words) =>
    words.some((word) => term.startsWith(word) || (term.length >= 3 && word.startsWith(term))),
  )
  return group ? [term, ...group] : [term]
}

function commonPrefixLength(a: string, b: string) {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

/**
 * Whether a typed term matches a word of the tool. Besides substrings ("json" in "json"),
 * it accepts words that share a long root, so "formatar" finds "formatador" and
 * "decodificar" finds "decodifica".
 */
function termMatchesWord(term: string, word: string) {
  if (word.includes(term)) return true
  if (term.length < 5) return false
  const shared = commonPrefixLength(term, word)
  // A 4-letter root is too loose: "password" would match "passo".
  return shared >= 5 && shared >= Math.min(term.length, word.length) - 3
}

function tokenize(value: string) {
  return normalize(value)
    .split(/[^a-z0-9-]+/)
    .filter((term) => term && !stopwords.has(term))
}

interface IndexedTool {
  tool: Tool
  nameWords: string[]
  words: string[]
}

const index: IndexedTool[] = tools.map((tool) => ({
  tool,
  nameWords: tokenize(tool.name),
  words: tokenize([tool.name, tool.description, getCategory(tool.categoryId).name, ...tool.keywords].join(' ')),
}))

/** 0 when the term does not match the tool, higher when it matches the name. */
function scoreTerm(term: string, entry: IndexedTool): number {
  const variants = expand(term)
  const matches = (words: string[]) => variants.some((variant) => words.some((word) => termMatchesWord(variant, word)))
  if (matches(entry.nameWords)) return 3
  if (matches(entry.words)) return 1
  return 0
}

/**
 * Filters the registry by free text and, optionally, by category. Tools that match every
 * term come first; if none does, tools matching part of the terms are returned instead, so
 * a long query never ends in an empty page. Available tools are listed before planned ones.
 */
export function searchTools(query: string, categoryId?: CategoryId | null): Tool[] {
  const terms = tokenize(query)
  const pool = index.filter((entry) => !categoryId || entry.tool.categoryId === categoryId)
  const byStatus = (a: IndexedTool, b: IndexedTool) =>
    Number(b.tool.status === 'available') - Number(a.tool.status === 'available')

  if (terms.length === 0) return [...pool].sort(byStatus).map((entry) => entry.tool)

  const scored = pool.map((entry) => {
    const scores = terms.map((term) => scoreTerm(term, entry))
    return {
      entry,
      matched: scores.filter(Boolean).length,
      score: scores.reduce((sum, value) => sum + value, 0),
    }
  })

  const full = scored.filter((item) => item.matched === terms.length)
  const results = full.length > 0 ? full : scored.filter((item) => item.matched > 0)

  return results
    .sort((a, b) => byStatus(a.entry, b.entry) || b.matched - a.matched || b.score - a.score)
    .map((item) => item.entry.tool)
}

/** Available tools, in registry order. */
export function getAvailableTools(): Tool[] {
  return tools.filter((tool) => tool.status === 'available')
}

/** Planned tools, in registry order. */
export function getPlannedTools(): Tool[] {
  return tools.filter((tool) => tool.status === 'planned')
}

/** "6 disponíveis · 15 em breve" — the one way the UI counts tools. */
export function formatToolCount(list: Tool[] = tools): string {
  const available = list.filter((tool) => tool.status === 'available').length
  const planned = list.length - available
  const parts: string[] = []
  if (available > 0) parts.push(available === 1 ? '1 disponível' : `${available} disponíveis`)
  if (planned > 0) parts.push(`${planned} em breve`)
  return parts.join(' · ')
}
