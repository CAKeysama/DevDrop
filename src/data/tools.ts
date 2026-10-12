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
    description: 'Conte caracteres e palavras e converta entre maiúsculas e minúsculas.',
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
 */
export const showcaseToolIds = [
  'json-formatter',
  'password-generator',
  'percentage',
  'uuid',
  'case-converter',
  'css-gradient',
  'jwt-decoder',
  'cpf',
  'character-counter',
  'rule-of-three',
  'hash-generator',
  'password-strength',
]

export function getShowcaseTools(): Tool[] {
  return showcaseToolIds.flatMap((id) => tools.find((tool) => tool.id === id) ?? [])
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

export function getToolsByCategory(id: CategoryId): Tool[] {
  return tools.filter((tool) => tool.categoryId === id)
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

/** Filters the registry by free text (every term must match) and, optionally, by category. */
export function searchTools(query: string, categoryId?: CategoryId | null): Tool[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)

  return tools.filter((tool) => {
    if (categoryId && tool.categoryId !== categoryId) return false
    if (terms.length === 0) return true

    const haystack = normalize(
      [tool.name, tool.description, getCategory(tool.categoryId).name, ...tool.keywords].join(' '),
    )
    return terms.every((term) => haystack.includes(term))
  })
}
