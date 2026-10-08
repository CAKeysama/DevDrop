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

const planned = (tool: Omit<Tool, 'status'>): Tool => ({ ...tool, status: 'planned' })

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

  planned({ id: 'password-generator', name: 'Gerador de senhas', description: 'Gera senhas fortes.', categoryId: 'security', keywords: ['senha', 'password', 'gerar', 'generator', 'aleatoria'] }),
  planned({ id: 'password-strength', name: 'Força da senha', description: 'Verifica a força de uma senha.', categoryId: 'security', keywords: ['senha', 'password', 'strength', 'verificador', 'forte'] }),

  planned({ id: 'character-counter', name: 'Contador de caracteres', description: 'Conta os caracteres de um texto.', categoryId: 'text', keywords: ['caractere', 'character', 'count', 'tamanho', 'letras'] }),
  planned({ id: 'word-counter', name: 'Contador de palavras', description: 'Conta as palavras de um texto.', categoryId: 'text', keywords: ['palavra', 'word', 'count'] }),
  planned({ id: 'case-converter', name: 'Maiúsculas e minúsculas', description: 'Converte um texto entre maiúsculas e minúsculas.', categoryId: 'text', keywords: ['case', 'converter', 'uppercase', 'lowercase', 'caixa alta', 'conversor'] }),

  planned({ id: 'percentage', name: 'Porcentagem', description: 'Calcula porcentagens.', categoryId: 'calculators', keywords: ['porcentagem', 'percentual', 'percentage', 'percent', 'calculadora'] }),
  planned({ id: 'rule-of-three', name: 'Regra de três', description: 'Resolve proporções com regra de três.', categoryId: 'calculators', keywords: ['regra de tres', 'proporcao', 'rule of three', 'calculadora'] }),

  planned({ id: 'uuid', name: 'Gerador de UUID', description: 'Gera UUIDs.', categoryId: 'data', keywords: ['uuid', 'guid', 'id', 'gerar', 'generator'] }),
  planned({ id: 'lorem-ipsum', name: 'Lorem Ipsum', description: 'Gera texto de preenchimento.', categoryId: 'data', keywords: ['lorem', 'ipsum', 'placeholder', 'texto', 'gerador'] }),
  planned({ id: 'hash-generator', name: 'Gerador de hash', description: 'Gera hashes MD5 e SHA-256.', categoryId: 'data', keywords: ['hash', 'md5', 'sha', 'sha-256', 'generator'] }),
  planned({ id: 'cpf', name: 'CPF', description: 'Gera e valida CPF para desenvolvimento e testes.', categoryId: 'data', keywords: ['cpf', 'documento', 'gerador', 'validador'] }),
  planned({ id: 'cnpj', name: 'CNPJ', description: 'Gera e valida CNPJ para desenvolvimento e testes.', categoryId: 'data', keywords: ['cnpj', 'documento', 'gerador', 'validador'] }),

  planned({ id: 'css-shadow', name: 'Gerador de sombras', description: 'Monta sombras em CSS.', categoryId: 'css', keywords: ['css', 'sombra', 'shadow', 'box-shadow'] }),
  planned({ id: 'css-gradient', name: 'Gerador de gradientes', description: 'Monta gradientes em CSS.', categoryId: 'css', keywords: ['css', 'gradiente', 'gradient', 'cor'] }),
  planned({ id: 'css-border', name: 'Gerador de bordas', description: 'Monta bordas em CSS.', categoryId: 'css', keywords: ['css', 'borda', 'border', 'radius'] }),
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
